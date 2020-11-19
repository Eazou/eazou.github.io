// ==UserScript==
// @name              vpn X速度签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/vpn_xspeed-1.com.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://xspeed-1.com
// @expire            900000
// @domain            xspeed-1.com
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('https://xspeed-1.com/user/checkin')
    return data.msg;
};

exports.check = async function(param) {
    var { data } = await axios.get('https://xspeed-1.com/user/profile')
    return (/我的账号/.test(data));
};