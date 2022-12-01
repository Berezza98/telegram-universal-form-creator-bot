const { Scenes, Markup } = require('telegraf');

const sceneNames = require('../consts');
const userTexts = require('../../texts').userTexts;
const { EDIT_QUESTIONS_SCENE } = require('../consts');

const scene = new Scenes.BaseScene(EDIT_QUESTIONS_SCENE);

scene.enter((ctx) => {
  const questions = userTexts.questions;

  if (questions.length === 0) {
    ctx.reply('You don`t have questions to edit. Use /create_question to create new one!');
    return ctx.scene.leave();
  }

  const buttons = questions.map(({ text }, index) => [Markup.button.callback(text, 'select_question ' + index)]);
  return ctx.reply('Choose question for editing:', Markup.inlineKeyboard(buttons));
});

scene.action(/select_question (.+)/, (ctx) => {
  const questionIndex = ctx.match[1];
  ctx.scene.enter(sceneNames.CREATE_QUESTION_SCENE, { edit: true, questionIndex });
  return ctx.scene.leave();
});

module.exports = scene;