// ==UserScript==
// @name              gay 搜同签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/gay_soutong.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://www.stboy.net/
// @expire            110000
// @domain            www.stboy.net
// ==/UserScript==


exports.run = async function(param) {
    return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('https://www.stboy.net/');
    return (/退出/.test(data));
};