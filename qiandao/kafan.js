// ==UserScript==
// @name              卡饭
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/kafan.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://bbs.kafan.cn/
// @expire            907e3
// @domain            bbs.kafan.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/index.php');
    var text = "formhash";
    var m = "";
    m = data.split("formhash=")[1].split("\"")[0];
    if (m == "") throw "签到失败";
    var bbb = 'https://bbs.kafan.cn/plugin.php?id=dsu_amupper&ppersubmit=true&formhash='+m;
    var { data } = await axios.post(bbb);
    if (/获得/.test(data)) return "签到成功";
    if (/已签到/.test(data)) return "已签到";
};

exports.check = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/forum.php');
    return !/QQ快速登录/.test(data);
};