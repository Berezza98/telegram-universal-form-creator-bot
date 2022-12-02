const { Telegraf, Telegram, Scenes } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const child_process = require('child_process');

const db = require('./config/db');
const isAdmin = require('./middlewars/isAdmin');
const scenes = require('./scenes/index');
const texts = require('./texts');
const sceneNames = require('./scenes/consts');
const consts = require('./consts');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);
const stage = new Scenes.Stage(scenes);

// telegram.sendMessage(process.env.ADMIN_ID, 'Bot started!');

bot.use((new LocalSession({ database: 'sessions.json' })).middleware())
bot.use(stage.middleware());

bot.use(isAdmin);

bot.start((ctx) => {
  ctx.reply(texts[ctx.state.isAdmin ? 'adminTexts' : 'userTexts'].startText);
});

bot.command('set_start_text', Scenes.Stage.enter(sceneNames.SET_START_TEXT_SCENE));
bot.command('set_finish_text', Scenes.Stage.enter(sceneNames.SET_FINISH_TEXT_SCENE));
bot.command('edit_questions', Scenes.Stage.enter(sceneNames.SELECT_QUESTION_SCENE, { action: consts.EDIT_ACTION }));
bot.command('delete_question', Scenes.Stage.enter(sceneNames.SELECT_QUESTION_SCENE, { action: consts.DELETE_ACTION }));
bot.command('create_question', Scenes.Stage.enter(sceneNames.CREATE_QUESTION_SCENE));

bot.command('fill_form', Scenes.Stage.enter(sceneNames.USER_FORM_SCENE));

bot.command('restart', (ctx) => {
  if (!ctx.state.isAdmin) return;

  bot.stop();

  const cmd = 'node main.js';
  child_process.exec(cmd, async () => {
    process.kill();
  });
});

async function main() {
  await db.init();
  bot.launch();
}

main();