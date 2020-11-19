// ==UserScript==
// @name              vpn 优云666签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/vpn_youyun666.net.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://youyun666.net
// @expire            900000
// @domain            youyun666.net
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('https://youyun666.net/user/checkin', { headers: { 'Referer': 'https://youyun777.net/user' } })
    return data.msg;
};

exports.check = async function(param) {
    var { data } = await axios.get('https://youyun666.net/user/profile')
    return (/我的账号/.test(data));
};