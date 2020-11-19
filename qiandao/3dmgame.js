// ==UserScript==
// @name             3dmGame签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/23pili.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://bbs.3dmgame.com/
// @expire            182000
// @domain            bbs.3dmgame.com
// ==/UserScript==


exports.run = async function(param) {
     var s="已签到";
     var { data } = await axios.get('https://bbs.3dmgame.com/home.php?mod=task&do=apply&id=70');
     return s;
};

exports.check = async function(param) {
     var { data } = await axios.get('https://bbs.3dmgame.com/');
     return (/退出/.test(data));
};