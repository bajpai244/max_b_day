/** @format */

module.exports = (user_id) => ({
  type: 'message',

  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Hey <@${user_id}> :wave:`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `I am whom-bot :robot_face: I help you find whom for what in :hack_club:`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Just follow these 3 simple :) \n\n 1. Type @whom-bot, I will reply u in a thread \n 2. Choose the continent in which you live and in what you need help \n 3. Click on the button "whom!whom!whom!" \n\n Yup that was it :congaparrot:`,
      },
    },
  ],
});
