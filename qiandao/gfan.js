// ==UserScript==
// @name              GFan机锋论坛签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/gfan.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://bbs.gfan.com/
// @expire            301000
// @domain            *.gfan.com
// ==/UserScript==


exports.run = async function(param) {
	var { data } = await axios.get('http://bbs.gfan.com/plugin.php?id=dsu_paulsign:sign&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return "已签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var textss = 'formhash='+formhash+'&qdxq=kx&qdmode=3&todaysay=&fastreply=0';
    var { data } = await axios.post('http://bbs.gfan.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1', textss);
    if (/成功/.test(data)) return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('http://bbs.gfan.com/');
    return (/退出/.test(data));
};