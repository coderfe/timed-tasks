import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

import { sendMail } from '../utils';

dotenv.config();

const { EXECUTABLE_PATH } = process.env;

export default async function qiemanExponent() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: EXECUTABLE_PATH,
    slowMo: 50,
    timeout: 60000,
    userDataDir: path.resolve(__dirname, '../tmp'),
    defaultViewport: {
      width: 960,
      height: 2000
    },
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  await page.goto('https://qieman.com/idx-eval');
  await page.waitForSelector('.gclTsa', { timeout: 40000 });
  const date = await page.$eval('.qm-header-note', el => el.textContent);
  await page.screenshot({
    path: 'qieman',
    type: 'png',
    encoding: 'base64',
    clip: {
      x: 10,
      y: 148,
      width: 944,
      height: 1342
    }
  });
  await browser.close();
  const base64 = fs.readFileSync('qieman').toString();
  sendMail(
    {
      subject: '每日估值',
      html: `
        <h1>且慢每日估值</h1>
        <p>${date}</p>
        <div>
          <img src="data:image/png;base64,${base64}" />
        </div>
      `
    },
    () => {
      console.log(`✅ 且慢每日估值发送成功`);
    }
  );
}
