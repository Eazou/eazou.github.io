// ==UserScript==
// @name              vpn 速鹰666签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/vpn_sy168.site.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://sy168.site
// @expire            900000
// @domain            sy168.site
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('https://sy168.site/user/checkin')
    return data.msg;
};

exports.check = async function(param) {
    var { data } = await axios.get('https://sy168.site/user/profile')
    return (/我的/.test(data));
};