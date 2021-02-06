require('dotenv').config();
const api = require('covid19-api');
const { Telegraf, Markup } = require('telegraf');

const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx =>
  ctx.reply(
    `
Hello ${ctx.message.from.first_name} ${ctx.message.from.last_name}.
Find out the statistics on the COVID 19.
Enter the name of the country in English and get statistics.
You can view the entire list of countries using the command /help`,
    Markup.keyboard([
      ['Armenia', 'Russia', 'France'],
      ['USA', 'Italy', 'Belgium'],
    ]).resize(),
  ),
);

bot.help(ctx =>
  ctx.reply(
    COUNTRIES_LIST.reduce(
      (acc, item) =>
        `
	${acc}
	${item}
	`,
      '',
    ),
  ),
);

bot.on('text', async ctx => {
  const { text } = ctx.message;

  try {
    const data = await api.getReportsByCountries(text);
    const { country, flag, cases, deaths, recovered } = data?.[0]?.[0] || {};

    ctx.reply(`
Country - ${country}
Cases - ${cases}
Deaths - ${deaths}
Recovered - ${recovered}

${flag}`);
  } catch (e) {
    ctx.reply('Please enter the country from the list.');
    ctx.reply('/help');
  }
});

bot.launch();
