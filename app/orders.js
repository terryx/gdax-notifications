const { Observable } = require('rxjs')
const numeral = require('numeral')
const Gdax = require('../utils/gdax')
const Telegram = require('telegraf/telegram')
const config = require(`../config.${process.env.STAGE}`)()

const sumBy = (orders) => Observable
  .from(orders)
  .reduce((acc, cur) => {
    const price = numeral(cur[0]).multiply(numeral(cur[1]).value()).value()
    acc.price = acc.price.add(price)
    acc.size = acc.size.add(cur[1])

    return acc
  }, { price: numeral(0), size: numeral(0) })

const notify = (event, context, callback) => {
  const gdax = Gdax()

  return Observable
    .from(config.trades)
    .mergeMap(trade => Observable
      .fromPromise(gdax.get(`/products/${trade.base_currency}-${trade.counter_currency}/book`, {
        qs: { level: 2 }
      }))
      .mergeMap(res => Observable.zip(
        sumBy(res.asks),
        sumBy(res.bids)
      ))
      .filter(([ asks, bids ]) =>
        asks.size.value() >= (trade.total_amount * trade.factor) || bids.size.value() >= (trade.total_amount * trade.factor)
      )
      .map(([ asks, bids ]) => {
        const text = `
Asks: ${asks.size.format('0.0a')} ${trade.base_currency} for ${asks.price.format('0.0a')} ${trade.counter_currency}
Bids: ${bids.size.format('0.0a')} ${trade.base_currency} for ${bids.price.format('0.0a')} ${trade.counter_currency}
        `
        return text
      })
    )
    .toArray()
    .skipWhile(texts => texts.length === 0)
    .mergeMap(texts => {
      const bot = new Telegram(process.env.BOT_TOKEN)
      texts.unshift('<b>Aggregated Order Book</b>')
      const message = texts.join('\n')

      return Observable
        .fromPromise(bot.sendMessage(process.env.CHANNEL_ID, message, {
          parse_mode: 'HTML',
          disable_web_page_preview: true
        }))
    })
    .subscribe({
      next: result => console.error('NEXT\r\n', result),
      error: result => console.error('ERROR\r\n', result)
    })
}

module.exports = { notify }
