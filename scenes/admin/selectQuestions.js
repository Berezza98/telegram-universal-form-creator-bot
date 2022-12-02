const { Scenes, Markup } = require('telegraf');
const db = require('../../config/db');
const consts = require('../../consts');

const sceneNames = require('../consts');
const userTexts = require('../../texts').userTexts;
const adminTexts = require('../../texts').adminTexts;
const { SELECT_QUESTION_SCENE } = require('../consts');

const scene = new Scenes.BaseScene(SELECT_QUESTION_SCENE);

scene.enter((ctx) => {
  const questions = userTexts.questions;

  if (questions.length === 0) {
    ctx.reply(adminTexts.noQuestions[ctx.scene.state.action]);
    return ctx.scene.leave();
  }

  const buttons = questions.map(({ text }, index) => [Markup.button.callback(text, 'select_question ' + index)]);
  buttons.push([Markup.button.callback('Exit', 'exit')]);

  return ctx.reply(adminTexts.chooseQuestion[ctx.scene.state.action], Markup.inlineKeyboard(buttons));
});

scene.action(/select_question (.+)/, async (ctx) => {
  const questionIndex = ctx.match[1];

  if (ctx.scene.state.action === consts.DELETE_ACTION) {
    await db.deleteQuestion(questionIndex);
    ctx.reply('Deleted!');
    return ctx.scene.leave();
  }

  ctx.scene.enter(sceneNames.CREATE_QUESTION_SCENE, { action: ctx.scene.state.action, questionIndex });
  return ctx.scene.leave();
});

scene.action('exit', (ctx) => {
  ctx.reply('Exit done!');
  return ctx.scene.leave();
});

module.exports = scene;