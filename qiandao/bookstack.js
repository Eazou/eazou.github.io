// ==UserScript==
// @name              书栈网签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/bookstack.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://www.bookstack.cn/
// @expire            3600000
// @domain            www.bookstack.cn
// ==/UserScript==


exports.run = async function(param) {
    var { data } = await axios.get('https://www.bookstack.cn/user/sign');
    return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('https://www.bookstack.cn/read/zhaoqingqing-bat/copyright.md');
var { data } = await axios.get('https://www.bookstack.cn/read/zhaoqingqing-bat/spilt.1.bat.md');
var { data } = await axios.get('https://www.bookstack.cn/read/zhaoqingqing-bat/spilt.2.bat.md');
    return (/书签管理/.test(data));
};