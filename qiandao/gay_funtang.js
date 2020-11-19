// ==UserScript==
// @name              gay 泛糖签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/gay_funtang.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://funtang.net/
// @expire            291000
// @domain            funtang.net
// ==/UserScript==


exports.run = async function(param) {
    var { data } = await axios.get('https://funtang.net/plugin.php?id=cack_app_sign:pcajax&infloat=yes&handlekey=cacksign&inajax=1&ajaxtarget=fwin_content_cacksign');
    if (/已签/.test(data)) return "已签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var { data } = await axios.post('https://funtang.net/plugin.php?id=cack_app_sign:sign&pcsign=1&signxid=4&content=%E5%BC%80%E5%BF%83%E5%95%8A&settingsubmit=%E7%AD%BE%E5%88%B0&formhash='+formhash);
    if (/成功/.test(data)) return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('https://funtang.net/forum-2-1.html');
    return (/精华/.test(data));
};