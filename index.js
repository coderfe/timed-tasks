import schedule from 'node-schedule';

import writeWeekly from './tasks/weekly';
import { formatDate } from './utils';

// 0 18 * * 5 At 18:00 on Friday
// */5 * * * * At every 5th minute
const weekly = schedule.scheduleJob('0 18 * * 5', () => {
  console.log('SCHEDULE::周报:: ' + formatDate(weekly.nextInvocation()));
  writeWeekly();
});
console.log('SCHEDULE::周报:: ' + formatDate(weekly.nextInvocation()));
