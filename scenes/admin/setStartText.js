const { Scenes } = require('telegraf');

const db = require('../../config/db');
const { SET_START_TEXT_SCENE } = require('../consts');

module.exports = new Scenes.WizardScene(
  SET_START_TEXT_SCENE,
  (ctx) => {
    ctx.reply('Please enter the new start text');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const newStartText = ctx.message.text;

    await db.write('startText', newStartText);

    ctx.reply('Done!');
    return ctx.scene.leave();
  }
);