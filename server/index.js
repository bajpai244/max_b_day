/** @format */

const keep_alive = require('./keep_alive');

const _ = require('ramda');
const { App } = require('@slack/bolt');

const express = require('express');
const cors = require('cors');
const exp_app = express();
const port = 3000;

const update_score = require('./update_score');

const dotenv = require('dotenv');

const stp_1_message_config = require('./message_config/step_1');

dotenv.config();

const { WebClient, LogLevel } = require('@slack/web-api');
const oauth_token = process.env.PROD_OAUTH_TOKEN;
const app_token = process.env.PROD_APP_TOKEN;

const client = new WebClient(oauth_token, {
  logLevel: LogLevel.DEBUG,
});

const app = new App({
  token: oauth_token,
  appToken: app_token,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');

  /* client.chat.postMessage({
    channel: 'bot_test',
    text: 'Hey a message from me',
  });*/
})();

app.event('app_mention', async ({ event, context, client, say }) => {
  const user_id = event.user;
  client.chat.postMessage({
    channel: event.channel,
    ...stp_1_message_config(user_id),
    thread_ts: event.ts,
  });
});

exp_app.use(express.urlencoded({ extended: true }));

exp_app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200,
  })
);

exp_app.post('/update_score', (req, res) => {
  const auth_token = _.split(' ')(req.headers.authorization)[1];

  if (_.equals(auth_token, process.env.TOKEN)) {
    try {
      if (req.method === 'POST') {
        const score = req.body.score;
        res.send('got the score, it is' + score);
        update_score(score, () => {
          client.chat.postMessage({
            channel: 'bot_test',
            text: 'hey!!!!!!!',
          });
        });
      } else {
        res.statusCode = 405;
        res.send(JSON.stringify({ message: 'method_not_allowed' }));
        return 0;
      }
    } catch (err) {
      res.statusCode = 200;
      console.log(err);
      res.send(JSON.stringify({ message: 'something_went_wrong' }));
      return 0;
    }
  } else {
    res.statusCode = 200;
    res.send({ message: 'unauthorized_access' });
    return 0;
  }
});

exp_app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
