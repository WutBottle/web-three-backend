const schedule = require('node-schedule');
let blackList = [];
const tokenInBlackList = (token) => {
  return blackList.includes(token);
}
const  addBlackList = (token) => {
  blackList.push(token);
}
const clearBlackList = () => {
  schedule.scheduleJob('30 1 1 * * *', () => {
    blackList = [];
    console.log('token黑名单清零' + new Date());
  })
}
module.exports = {
  tokenInBlackList,
  addBlackList,
  clearBlackList
}