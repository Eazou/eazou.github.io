// ==UserScript==
// @name              gay-torrents.org签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/gay_gay-torrents.org.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://gay-torrents.org/torrents_beta.php
// @expire            300000
// @domain            gay-torrents.org
// ==/UserScript==

exports.run = async function(param) {
};

exports.check = async function(param) {
var { data } = await axios.get('http://gay-torrents.org');
    return (/liceries/.test(data));
};