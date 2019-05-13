import schedule from 'node-schedule';

import writeWeekly from './weekly';

// 0 18 * * 5 At 18:00 on Friday
// */5 * * * * At every 5th minute
const weekly = schedule.scheduleJob('0 18 * * 5', () => {
  console.log('Task::周报：%o', weekly.nextInvocation());
  writeWeekly();
});
console.log('Task::周报：%o', weekly.nextInvocation());
