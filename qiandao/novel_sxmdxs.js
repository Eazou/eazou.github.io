// ==UserScript==
// @name              小说 书香门第
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/novel_sxmdxs.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://www.txtnovel.top/
// @expire            304000
// @domain            *.txtnovel.top
// ==/UserScript==


exports.run = async function(param) {
    var { data } = await axios.get('http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign');
    if (data.indexOf("已经签到过了")>-1) return "已签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var { data } = await axios.post('http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1', `formhash=${formhash}&qdxq=kx&qdmode=1`);
    if (/获得/.test(data)) return "签到成功";
    if (/已打卡/.test(data)) return "已签到";
    
};

exports.check = async function(param) {
var { data } = await axios.get('http://www.txtnovel.top/');
    return (/退出/.test(data));
};