// ==UserScript==
// @name              ����Ӱ����Ļ��ǩ��
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/yyets.js
// @version           1.0
// @author            ����Խ��
// @loginURL          http://www.rrys2020.com/
// @expire            1001e3
// @domain          www.rrys2020.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://www.rrys2020.com/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.rrys2020.com/' } });
    if (data.status == 1) {
        if (data.data.new_login)
            return `ǩ���ɹ�,��${data.data.userinfo.point}����`;
        return `�Ѿ�ǩ��`;
    }
    throw '��Ҫ��¼';
};

exports.check = async function() {
    var { data } = await axios.get('http://www.rrys2020.com/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.rrys2020.com/' } });
    return data.status == 1;
};
