import schedule from 'node-schedule';

import writeWeekly from './tasks/weekly';
import qiemanExponent from './tasks/qieman';
import { formatDateTime } from './utils';

// 0 18 * * 5 At 18:00 on Friday
// */5 * * * * At every 5th minute
const weekly = schedule.scheduleJob('0 18 * * 5', () => {
  console.log('SCHEDULE::周报:: ' + formatDateTime(weekly.nextInvocation()));
  writeWeekly();
});
console.log('SCHEDULE::周报:: ' + formatDateTime(weekly.nextInvocation()));

const qieman = schedule.scheduleJob('5 20 * * 0-6', () => {
  console.log(
    'SCHEDULE::且慢估值:: ' + formatDateTime(qieman.nextInvocation())
  );
  qiemanExponent();
});
console.log('SCHEDULE::且慢估值:: ' + formatDateTime(qieman.nextInvocation()));
