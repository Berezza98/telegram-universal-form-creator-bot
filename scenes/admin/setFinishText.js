const { Scenes } = require('telegraf');

const db = require('../../config/db');
const { SET_FINISH_TEXT_SCENE } = require('../consts');

module.exports = new Scenes.WizardScene(
  SET_FINISH_TEXT_SCENE,
  (ctx) => {
    ctx.reply('Please enter the new finish text');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const newFinishText = ctx.message.text;

    await db.write('finishText', newFinishText);

    ctx.reply('Done!');
    return ctx.scene.leave();
  }
);