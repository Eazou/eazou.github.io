// ==UserScript==
// @name              ZNDS智能电视网签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/znds.com.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://www.znds.com/
// @expire            304000
// @domain            *.znds.com
// ==/UserScript==


exports.run = async function(param) {
    var { data } = await axios.get('https://www.znds.com/index.php');
    if (!/打卡签到/.test(data)) return "已签到";
    var text = "formhash";
    var m = "";
    m = data.split("formhash=")[1].split("\")")[0];
    if (m == "") throw "签到失败";
    var bbb = 'https://www.znds.com/plugin.php?id=ljdaka:daka&action=msg&formhash='+m;
    var { data } = await axios.post(bbb);
    if (/获得/.test(data)) return "签到成功";
    if (/已打卡/.test(data)) return "已签到";
};

exports.check = async function(param) {
var { data } = await axios.get('https://www.znds.com/index.php');
    return (/退出/.test(data));
};