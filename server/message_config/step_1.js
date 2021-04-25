/** @format */

const get_score = require('../get_score');

module.exports = (user_id) => ({
  type: 'message',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Hi <@${user_id}> , the highest score in the game till this far is ${get_score()}`,
      },
    },
  ],
});
