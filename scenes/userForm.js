const { Scenes } = require('telegraf');

const userTexts = require('../texts').userTexts;
const { USER_FORM_SCENE } = require('./consts');

const form = userTexts.questions.map(({ text }, index) => {
  return (ctx) => {
    ctx.reply(text);

    if (index !== 0) ctx.session[userTexts.questions[index - 1].resultKey] = ctx.message.text;
    return ctx.wizard.next();
  }
});

module.exports = new Scenes.WizardScene(
  USER_FORM_SCENE,
  ...form,
  (ctx) => {
    ctx.session[userTexts.questions[userTexts.questions.length - 1].resultKey] = ctx.message.text;
    ctx.reply(userTexts.finishText);
    return ctx.scene.leave();
  }
);