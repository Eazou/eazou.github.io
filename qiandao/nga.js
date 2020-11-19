// ==UserScript==
// @name              NGA签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/nga.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://nga.178.com/
// @expire            300000
// @domain            nga.178.com
// ==/UserScript==


exports.run = async function(param) {
	var { data } = await axios.get('https://nga.178.com/nuke.php?&');
	var { data } = await axios.get('https://nga.178.com/nuke.php?__lib=check_in&__act=get_stat&access_token=Y8jcvqtajr53easm14i6sb6vuqncgpu9&__output=14&t=1586448298&access_uid=14998534&sign=c89f5760f149b688da90222d61dd9814&app_id=1010');
	
	    if (/签到过了/.test(data)) return "已经签到";
    return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('https://nga.178.com/thread.php?fid=-7');
    return (/登出/.test(data));
};