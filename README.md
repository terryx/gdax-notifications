## GDAX Notifications
This a simple configurable telegram notifications about [GDAX trades](https://www.gdax.com/trade)

### Getting started
- Make sure you have at least NodeJS 6 >= version installed
- An AWS account and necessary IAM role to create and execute lambda function
- A Telegram Bot and Channel. You can follow the guide [here](https://medium.com/@terryyuen/step-by-step-telegram-notification-bot-96843e04ec22) to setup a bot and a channel
- Copy config.sample.js setup into a new file e.g `config.dev.js`
- You should have 2 copy, `dev` and `prd` depending on your serverless `STAGE` for development and production
- Run `npm install` and `npm run trades:notify`
