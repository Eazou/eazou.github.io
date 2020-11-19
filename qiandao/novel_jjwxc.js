// ==UserScript==
// @name              小说 晋江文学城
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/novel_jjwxc.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://my.jjwxc.net
// @expire            598000
// @domain            my.jjwxc.net
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('http://my.jjwxc.net/backend/signin.php?action=signIn');
    return "已签到";
};

exports.check = async function(param) {
    var { data } = await axios.get('http://my.jjwxc.net/backend/favorite.php');
    return (/退出/.test(data));
};