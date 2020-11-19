// ==UserScript==
// @name              vpn SoCloud签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/vpn_SoCloud.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://5socloud.gq
// @expire            900000
// @domain            5socloud.gq
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('https://5socloud.gq/user/checkin')
    return data.msg;
};

exports.check = async function(param) {
    var { data } = await axios.get('https://5socloud.gq/user/profile')
    return (/我的账号/.test(data));
};