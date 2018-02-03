const { Observable } = require('rxjs')
const numeral = require('numeral')
const Gdax = require('../utils/gdax')
const Telegram = require('telegraf/telegram')
const config = require(`../config.${process.env.STAGE}`)()

const notify = (event, context, callback) => {
  const gdax = Gdax()

  return Observable
    .from(config.trades)
    .mergeMap(trade => Observable
      .fromPromise(gdax.get(`/products/${trade.base_currency}-${trade.counter_currency}/trades`))
      .mergeMap(res => Observable.from(res))
      .filter(res => numeral(res.size).value() >= trade.total_amount)
      .do(console.info)
      .toArray()
      .mergeMap(res => {
        const data = Observable
          .from(res)
          .partition(res => res.side === 'buy')

        return data
      })
      .mergeMap(data =>
        data.reduce((acc, cur) => {
          const text = `Trade Id:${cur.trade_id} <b>${cur.side}</b> ${numeral(cur.size).format('0.0')} ${trade.base_currency} at rate ${numeral(cur.price).format('0.0')} ${trade.counter_currency}`
          acc.push(text)

          return acc
        }, [])
      )
      .toArray()
      .skipWhile(([ buy, sell ]) => buy.length === 0 && sell.length === 0)
      .mergeMap(([ buy, sell ]) => {
        const text = buy.concat(['\n'], sell)
        const bot = new Telegram(process.env.BOT_TOKEN)
        const message = text.join('\n')

        return Observable
          .fromPromise(bot.sendMessage(process.env.CHANNEL_ID, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }))
      })
    )
    .subscribe({
      next: result => {},
      error: result => console.error('ERROR\r\n', result)
    })
}

module.exports = { notify }
