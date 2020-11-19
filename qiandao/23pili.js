// ==UserScript==
// @name             紫龙天布袋戏签到
// @namespace https://space.bilibili.com/482343
// @updateURL         http://327964.xyz/qiandao/23pili.js
// @version           1.0
// @author            超神越鬼
// @loginURL          https://bbs.23pili.com/
// @expire            182000
// @domain            bbs.23pili.com
// ==/UserScript==


exports.run = async function(param) {
     var s="";
     var { data } = await axios.get('https://bbs.23pili.com/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
     if (/已经签到/.test(data)) { s="已经签到";}else{
          var m = /name="formhash" value="([^"]+)/.exec(data);
          if (!m) {s="签到失败";}else{
               var formhash = m[1];
               var ss = (param.say || "开心").split('|');
               var say = "%CF%C0%D3%B0%B7%D7%B7%D7%BE%B8%D0%FE%BB%F6%A3%AC%BA%E3%C9%BD%D6%D5%BC%FB%DA%D8%CF%C9%C0%B4";
               var { data } = await axios.post('https://bbs.23pili.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1', `formhash=${formhash}&qdxq=kx&qdmode=3&todaysay=&fastreply=0`);
               if (/签到成功/.test(data)) {s='签到成功';}else{
                    if (/已经签到/.test(data)) {s='已经签到';}else{s='签到失败';}
               }
          }
     }

     var { data } = await axios.get('https://bbs.23pili.com/plugin.php?id=luckypacket');
     sss=/this.form.packetid.value = '([^']+)/g;
     var m = data.match(sss);
     if (m!='' && m!=null){
          for (var i=0;i<m.length;i++){
               var id = m[i].split("packetid.value = '")[1];
               var dz = 'https://bbs.23pili.com/plugin.php?id=luckypacket&module=ajax&action=get&getsubmit=yes&packetid='+id;
               var { data } = await axios.get(dz);
               if (/已经领/.test(data)) {
                    s=s+'  '+id+'已领红包';
               }else{
                    if (/未开始发放/.test(data)) {
                         s=s;
                    }else{
                         s=s+'  '+id+'领取红包';
                    }
               }
          }
     }
     var { data } = await axios.get('https://bbs.23pili.com/plugin.php?id=luckypacket&page=2');
     sss=/this.form.packetid.value = '([^']+)/g;
     var m = data.match(sss);
     if (m!='' && m!=null){
          for (var i=0;i<m.length;i++){
               var id = m[i].split("packetid.value = '")[1];
               var dz = 'https://bbs.23pili.com/plugin.php?id=luckypacket&module=ajax&action=get&getsubmit=yes&packetid='+id;
               var { data } = await axios.get(dz);
               if (/已经领/.test(data)) {
                    s=s+'  '+id+'已领红包';
               }else{
                    if (/未开始发放/.test(data)) {
                         s=s;
                    }else{
                         s=s+'  '+id+'领取红包';
                    }
               }
          }
     }
     var { data } = await axios.get('https://bbs.23pili.com/plugin.php?id=luckypacket&page=3');
     sss=/this.form.packetid.value = '([^']+)/g;
     var m = data.match(sss);
     if (m!='' && m!=null){
          for (var i=0;i<m.length;i++){
               var id = m[i].split("packetid.value = '")[1];
               var dz = 'https://bbs.23pili.com/plugin.php?id=luckypacket&module=ajax&action=get&getsubmit=yes&packetid='+id;
               var { data } = await axios.get(dz);
               if (/已经领/.test(data)) {
                    s=s+'  '+id+'已领红包';
               }else{
                    if (/未开始发放/.test(data)) {
                         s=s;
                    }else{
                         s=s+'  '+id+'领取红包';
                    }
               }
          }
     }
     return s;
};

exports.check = async function(param) {
     var { data } = await axios.get('https://bbs.23pili.com/forum.php');
     return (/退出/.test(data));
};