const child_process = require('child_process');

// 分支名
const branchName = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// 最后一次提交版本
const lastCommitVersion = child_process.execSync('git rev-parse HEAD').toString().trim();

// 最后一次提交者
const lastUser = child_process.execSync('git show -s --format=%cn').toString().trim();

// 最后一次提交时间
const commitDateObj = new Date(child_process.execSync('git show -s --format=%cd').toString());
const commitDate =
    commitDateObj.getFullYear() +
    '-' +
    (commitDateObj.getMonth() + 1) +
    '-' +
    commitDateObj.getDate() +
    ' ' +
    commitDateObj.getHours() +
    ':' +
    commitDateObj.getMinutes();

// 当前打包的用户
// const currentUser = child_process.execSync('git config user.name').toString().trim();

// 打包时间
const currentDateObj = new Date();
const currentDate =
    currentDateObj.getFullYear() +
    '-' +
    (currentDateObj.getMonth() + 1) +
    '-' +
    currentDateObj.getDate() +
    ' ' +
    currentDateObj.getHours() +
    ':' +
    currentDateObj.getMinutes();

module.exports = {
    branchName,
    lastCommitVersion,
    lastUser,
    commitDate,
    // currentUser,
    currentDate
};
