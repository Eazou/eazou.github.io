// ==UserScript==
// @name              龙腾签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/ltaaa.js
// @version           1.0
// @author            超神越鬼
// @loginURL          http://www.ltaaa.com/
// @expire            291000
// @domain            www.ltaaa.com
// ==/UserScript==


exports.run = async function(param) {
    var { data } = await axios.get('http://www.ltaaa.com/plugin/roll');
    if (/您今天已经参与过摇奖了/.test(data)) return "已签到";
    var aa = data.getElementsByTagName("a");
    for (var i=0;i<aa.length;i++){
        if (aa[i].href.indexOf("doRoll")>-1){
            aa[i].click();return '签到成功';
        }
    }
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var { data } = await axios.post('http://www.ltaaa.com/plugin/roll/doRoll','&rd=='+formhash);
    if (/成功/.test(data)) return '签到成功';
};

exports.check = async function(param) {
var { data } = await axios.get('http://www.ltaaa.com/');
    return true;
};