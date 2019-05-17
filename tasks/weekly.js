import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

import { sendMail } from '../utils';

dotenv.config();

const { NK_USER, NK_PASS, NK_CONTENT, NK_URL, EXECUTABLE_PATH } = process.env;

export default async function writeWeekly() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: EXECUTABLE_PATH,
    slowMo: 50
  });
  const page = await browser.newPage();
  await page.goto(NK_URL);
  try {
    await page.waitForSelector('#code');
    await page.type('#code', NK_USER);
    await page.type('#password', NK_PASS);
    await page.click('[type=button]');
    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
    await page.waitFor(5000);
    const frame = await page
      .frames()
      .find(frame => frame.name() === 'rightFrame');
    await frame.waitForSelector('#tbrz');
    await frame.click('#tbrz');
    await frame.waitFor(5000);
    await frame.$eval('#projectLog_0', el => (el.textContent = ''));
    await frame.type('#projectLog_0', NK_CONTENT);
    const startDate = await frame.$eval('#week1DateSpan', el => el.textContent);
    const endDate = await frame.$eval('#week7DateSpan', el => el.textContent);
    // await frame.click('#save_button'); // 保存
    await frame.click('#submit_button'); // 提交
    sendMail(
      {
        subject: 'Weekly',
        html: `
          <h1>Weekly</h1>
          <p>
            Date: ${startDate} To ${endDate}
          </p>
          <p>
            Status: ✅
          </p>
          <p>
            Content: ${NK_CONTENT}
          </p>
        `
      },
      () => {
        console.log(
          `${startDate} To ${endDate} - ✅ 周报提交成功 - ${NK_CONTENT}`
        );
      }
    );
  } catch (error) {
    sendMail(
      {
        subject: 'Weekly',
        html: `
          <h1>Weekly</h1>
          <p>Status: ❌</p>
          <p>Error: ${error.message}</p>
          <p>Link: <a href="${NK_URL}">Weekly</a></p>
        `
      },
      () => {
        console.log(
          `${startDate} To ${endDate} - ❌ 周报提交失败 - ${error.message}`
        );
      }
    );
  } finally {
    await browser.close();
  }
}
