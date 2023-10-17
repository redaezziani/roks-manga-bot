import puppeteer from "puppeteer";
import fs from "fs";
import request from "request";

import PDFDocument from "pdfkit";
const searchUrl = `https://www.rocks-manga.com/2023/08/one-piece-1074.html`;




const getManga= async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(searchUrl);
    const mangaList = await page.evaluate(() => {
        const titleAndLink = Array.from(document.querySelectorAll('.separator a img'));
        return titleAndLink.map((titleAndLink) => {
            return {
                link: titleAndLink.getAttribute('src')
            };
        });
    });

    await browser.close();

    if (mangaList.length === 0) {
        console.log('No manga found with that name.');
    } else {
        console.log('Here are the manga titles and links that match your search:');
        DownloadImg(mangaList);

    }
} 


// make a function to get the image and save all in a folder

const DownloadImg= async (ImgList) => {
    const folderName = 'Manga';
    fs.mkdirSync(folderName);
    for (let img of ImgList) {
        const url = img.link;
        const imgName = url.split('/').pop();
        request(url).pipe(fs.createWriteStream(`${folderName}/${imgName}`));
    }
    createPDFFromImages('Manga');

}












getManga();