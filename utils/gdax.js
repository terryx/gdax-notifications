const request = require('request-promise')

const constructor = () => {
  const req = request.defaults({
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'AWS'
    },
    baseUrl: 'https://api.gdax.com',
    json: true
  })

  return req
}

module.exports = constructor
