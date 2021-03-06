module.exports = () => {
  return {
    profile: 'your aws profile',
    region: 'lambda function region',
    role: 'your aws IAM role',
    telegram: {
      bot_token: '1234:xxxxxx',
      channel_id: '@xxxxx'
    },
    schedule: 'rate(2 minutes)', // singular for 1 minute
    trades: [
      {
        base_currency: 'BTC',
        counter_currency: 'USD',
        total_amount: 100,
        total_fiat: 1000000
      },
      {
        base_currency: 'ETH',
        counter_currency: 'USD',
        total_amount: 500,
        total_fiat: 1000000
      },
      {
        base_currency: 'LTC',
        counter_currency: 'USD',
        total_amount: 2000,
        total_fiat: 1000000
      }
    ]
  }
}
