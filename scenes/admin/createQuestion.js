const { Scenes } = require('telegraf');

const db = require('../../config/db');
const { CREATE_QUESTION_SCENE } = require('../consts');

const formElements = [
  {
    question: 'Please enter question text:',
    propName: 'text',
  },
  {
    question: 'Please enter result question name:',
    propName: 'resultKey',
  }
]
const form = formElements.map(({ question }, index) => {
  return (ctx) => {
    if (index === 0) ctx.session.question = {};

    ctx.reply(question);

    if (index !== 0) ctx.session.question[formElements[index - 1].propName] = ctx.message.text;
    return ctx.wizard.next();
  };
});

module.exports = new Scenes.WizardScene(
  CREATE_QUESTION_SCENE,
  ...form,
  async (ctx) => {
    ctx.session.question[formElements[formElements.length - 1].propName] = ctx.message.text;

    if (ctx.wizard.state.edit) {
      await db.editQuestion(ctx.wizard.state.questionIndex, ctx.session.question);
      ctx.reply('EDITED!');
      return ctx.scene.leave();
    }

    await db.addQuestion(ctx.session.question);
    ctx.reply('New question was added!');
    return ctx.scene.leave();
  }
);