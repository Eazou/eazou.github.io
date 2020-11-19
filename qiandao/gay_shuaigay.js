// ==UserScript==
// @name              gay 帅同签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/gay_gay_shuaigay.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://www.shuaigay.pro/
// @expire            1020000
// @domain            www.shuaigay.pro
// ==/UserScript==


exports.run = async function(param) {
    return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('https://www.shuaigay.pro/');
    return (/退出/.test(data));
};