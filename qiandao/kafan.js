// ==UserScript==
// @name              ����
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/kafan.js
// @version           1.0
// @author            ����Խ��
// @loginURL          https://bbs.kafan.cn/
// @expire            907e3
// @domain            bbs.kafan.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/index.php');
    var text = "formhash";
    var m = "";
    m = data.split("formhash=")[1].split("\"")[0];
    if (m == "") throw "ǩ��ʧ��";
    var bbb = 'https://bbs.kafan.cn/plugin.php?id=dsu_amupper&ppersubmit=true&formhash='+m;
    var { data } = await axios.post(bbb);
    if (/���/.test(data)) return "ǩ���ɹ�";
    if (/��ǩ��/.test(data)) return "��ǩ��";
};

exports.check = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/forum.php');
    return !/QQ���ٵ�¼/.test(data);
};