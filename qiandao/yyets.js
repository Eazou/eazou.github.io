// ==UserScript==
// @name              人人影视字幕组签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/yyets.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://www.rrys2020.com/
// @expire            1001e3
// @domain          www.rrys2020.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://www.rrys2020.com/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.rrys2020.com/' } });
    if (data.status == 1) {
        if (data.data.new_login)
            return `签到成功,共${data.data.userinfo.point}积分`;
        return `已经签到`;
    }
    throw '需要登录';
};

exports.check = async function() {
    var { data } = await axios.get('http://www.rrys2020.com/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.rrys2020.com/' } });
    return data.status == 1;
};
