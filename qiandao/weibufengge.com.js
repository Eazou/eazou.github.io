// ==UserScript==
// @name              为布凤歌签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/weibufengge.com.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://bbs.weibufengge.com/
// @expire            182000
// @domain            bbs.weibufengge.com
// ==/UserScript==


exports.run = async function(param) {
var { data } = await axios.get('http://bbs.weibufengge.com/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return "已经签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var ss = (param.say || "开心").split('|');
    var say = "%CF%C0%D3%B0%B7%D7%B7%D7%BE%B8%D0%FE%BB%F6%A3%AC%BA%E3%C9%BD%D6%D5%BC%FB%DA%D8%CF%C9%C0%B4";
    var { data } = await axios.post('http://bbs.weibufengge.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1', `formhash=${formhash}&qdxq=kx&qdmode=1&todaysay=${say}&fastreply=1`);
    if (/签到成功/.test(data)) return '签到成功';
    if (/已经签到/.test(data)) return '已经签到';
    throw '签到失败';
};

exports.check = async function(param) {
var { data } = await axios.get('http://bbs.weibufengge.com/home.php?mod=task');
    return (/新任务/.test(data));
};