import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

import sendMail from './sendMail';

dotenv.config();

const {
  AUTH_USER,
  AUTH_PASS,
  AUTH_TO,
  NK_USER,
  NK_PASS,
  NK_CONTENT,
  NK_URL,
  EXECUTABLE_PATH
} = process.env;
const auth = {
  user: AUTH_USER,
  pass: AUTH_PASS,
  to: AUTH_TO
};

export default async function writeWeekly() {
  const browser = await puppeteer.launch({
    // headless: false,
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
    await page.waitForNavigation();
    const frame = await page
      .frames()
      .find(frame => frame.name() === 'rightFrame');
    await frame.waitForSelector('#tbrz');
    await frame.click('#tbrz');
    await frame.waitForSelector('#projectLog_0');
    await frame.$eval('#projectLog_0', el => (el.textContent = ''));
    await frame.type('#projectLog_0', NK_CONTENT);
    const startDate = await frame.$eval('#week1DateSpan', el => el.textContent);
    const endDate = await frame.$eval('#week7DateSpan', el => el.textContent);
    const subject = `周报：${startDate} To ${endDate}`;
    await frame.click('#save_button'); // 保存
    // await frame.click('#submit_button');  // 提交
    const successMessage = `
      时间：${subject}
      信息：✅周报提交成功
      内容：${NK_CONTENT}
    `;
    sendMail(
      {
        auth,
        subject,
        text: successMessage
      },
      () => {
        console.log(
          `${startDate} To ${endDate} - ✅ 周报提交成功 - ${NK_CONTENT}`
        );
      }
    );
  } catch (error) {
    const errorMessage = `
      信息：✅周报提交失败
      错误：${error.message}
      ${NK_URL}
    `;
    sendMail(
      {
        auth,
        subject: '❌周报提交失败',
        text: errorMessage
      },
      () => {
        console.log(`❌ 周报提交失败 - ${error.message}`);
      }
    );
  } finally {
    await browser.close();
  }
}
