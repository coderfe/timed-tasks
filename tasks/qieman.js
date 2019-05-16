import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

const { EXECUTABLE_PATH } = process.env;

export default async function qieman() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: EXECUTABLE_PATH,
    slowMo: 50,
    timeout: 60000,
    defaultViewport: {
      width: 960,
      height: 2000
    },
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  await page.goto('https://qieman.com/idx-eval');
  await page.waitForSelector('.gclTsa', { timeout: 40000 });
  await page.screenshot({
    path: 'qieman.png',
    type: 'png',
    clip: {
      x: 10,
      y: 148,
      width: 944,
      height: 1342
    }
  });
  await browser.close();
}

qieman();
