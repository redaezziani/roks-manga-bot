import {Telegraf} from 'telegraf';
import puppeteer from 'puppeteer';

const bot = new Telegraf('6574884227:AAFmuxsw-jIZ91V9x0bk9RG9lEDY1igkBx4');

bot.start((ctx) => ctx.reply('Welcome to the Manga Search Bot! Type /search to find manga.'));

bot.command('search', (ctx) => {
    ctx.reply('Enter the name of the manga you want to search for:');
    bot.on('text', async (ctx) => {
        const mangaName = ctx.message.text;
        ctx.reply(`Searching for manga with the name: ${mangaName}`);

        // Construct the search URL
        const searchUrl = `https://manga-lek.net/?s=${encodeURIComponent(mangaName)}&post_type=wp-manga`;

        // Use Puppeteer to scrape the website
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(searchUrl);
        const mangaList = await page.evaluate(() => {
            const titleAndLink = Array.from(document.querySelectorAll('h3.h4 a'));
            return titleAndLink.map((titleAndLink) => {
                return {
                    link: titleAndLink.getAttribute('href')
                };
            });
        });

        await browser.close();

        if (mangaList.length === 0) {
            ctx.reply('No manga found with that name.');
        } else {
            ctx.reply('Here are the manga titles and links that match your search:');
            mangaList.forEach((manga) => {
                ctx.reply(`${manga.title}\n${manga.link}`);
            });
        }
    });
});

bot.launch();
