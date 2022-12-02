const { Scenes } = require('telegraf');

const userTexts = require('../texts').userTexts;
const { USER_FORM_SCENE } = require('./consts');
const sendAdminMessage = require('../helpers/sendAdminMessage');

const form = userTexts.questions.map(({ text }, index) => {
  return (ctx) => {
    if (index === 0) ctx.session.answers = {};
    ctx.reply(text);

    if (index !== 0) ctx.session.answers[userTexts.questions[index - 1].resultKey] = ctx.message.text;
    return ctx.wizard.next();
  }
});

module.exports = new Scenes.WizardScene(
  USER_FORM_SCENE,
  ...form,
  (ctx) => {
    ctx.session.answers[userTexts.questions[userTexts.questions.length - 1].resultKey] = ctx.message.text;
    ctx.reply(userTexts.finishText);
    sendAdminMessage(JSON.stringify(ctx.session.answers, null, 2));
    return ctx.scene.leave();
  }
);