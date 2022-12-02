const { Telegraf, Scenes } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const child_process = require('child_process');

const db = require('./config/db');
const isAdmin = require('./middlewars/isAdmin');
const onlyAdmin = require('./middlewars/onlyAdmin');
const scenes = require('./scenes/index');
const texts = require('./texts');
const sceneNames = require('./scenes/consts');
const consts = require('./consts');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage(scenes);

bot.use((new LocalSession({ database: 'sessions.json' })).middleware())
bot.use(stage.middleware());

bot.use(isAdmin);

bot.start((ctx) => {
  ctx.reply(texts[ctx.state.isAdmin ? 'adminTexts' : 'userTexts'].startText);

  if (!ctx.state.isAdmin) return ctx.scene.enter(sceneNames.USER_FORM_SCENE);
});

bot.command('set_start_text', onlyAdmin, Scenes.Stage.enter(sceneNames.SET_START_TEXT_SCENE));
bot.command('set_finish_text', onlyAdmin, Scenes.Stage.enter(sceneNames.SET_FINISH_TEXT_SCENE));
bot.command('edit_questions', onlyAdmin, Scenes.Stage.enter(sceneNames.SELECT_QUESTION_SCENE, { action: consts.EDIT_ACTION }));
bot.command('delete_question', onlyAdmin, Scenes.Stage.enter(sceneNames.SELECT_QUESTION_SCENE, { action: consts.DELETE_ACTION }));
bot.command('create_question', onlyAdmin, Scenes.Stage.enter(sceneNames.CREATE_QUESTION_SCENE));
bot.command('get_all_questions', onlyAdmin, (ctx) => {
  const questions = db.questions;

  ctx.reply(questions.map(({ text, resultKey }) => `Text:\n${text}\nResult key:\n${resultKey}\n\n`));
});
bot.command('restart', onlyAdmin, (ctx) => {
  bot.stop();

  const cmd = 'node main.js';
  child_process.exec(cmd, async () => {
    process.kill(process.pid);
  });
});

async function main() {
  console.log(process.env.NODE_ENV === 'production' ? 'Launch in PROD mode' : 'Launch in DEV mode');
  const launchOptions = process.env.NODE_ENV === 'production'
    ? {
        webhook: {
          domain: process.env.DOMAIN,
          port: 80,
        }
      }
    : undefined;

  await db.init();
  bot.launch(launchOptions);
}

main();