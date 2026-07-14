import { createBot } from './bot';

const bot = createBot();

void bot.start({
  onStart: (info) => {
    console.log(`Bot @${info.username} ishga tushdi.`);
  },
});
