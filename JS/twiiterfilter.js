// ==UserScript==
// @name           Twitter关键词过滤器
// @description    Twitter推特关键词过滤器。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @version      2.1
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @match       https://twitter.com/*
// @exclude     https://twitter.com/i/*
// @exclude     https://twitter.com/intent/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==
var nglc = ["", "", "", "", "", "", "", "", ""];
let glzs = 0;
var glc = GM_getValue("golvci", new Array());
var toObj = (arr) => {
  var obj = {};
  for (var temp in arr) {
    obj[arr[temp]] = true;
  }
  return obj;
};
var toArr = (obj) => {
  var arr = [];
  for (var temp in obj) {
    arr.push(temp);
  }
  return arr;
};
var together = (a, b) => {
  for (var temp = 0; temp < b.length; temp++) {
    if (b[temp] != null && b[temp] != "" && b[temp] != "null" && b[temp].length < 40) {
      a.push((b[temp] += '').toLowerCase());
    }
  }
};
var getUniq = (arr) => toArr(toObj(arr));

function bc() {
  together(glc, nglc);
  nglc = getUniq(glc);
  glc = new Array();
  together(glc, nglc);
  GM_setValue("golvci", glc);
}

function gy() {
  var tt = document.getElementsByClassName("css-1dbjc4n r-1ila09b r-qklmqi r-1adg3ll");
  var topics = tt;
  //console.log("生成 ",topics);
  for (var i = 0; i < topics.length - 1; i++) {
    if (topics[i].parentElement.parentElement.parentElement.parentElement.getAttribute("class") == "css-1dbjc4n") {
      var x = 0;
      var y = topics[i].innerText.toLowerCase().replace(/\n/g, " ").replace(/\s\s/g, " ");
      //console.log("判断 ",topics[i],"  :  ",topics[i].innerText);
      for (var j = 0; j < glc.length; j++) {
        if (glc[j] != "" && y.indexOf(glc[j]) > -1) {
          x = 1;
          break;
        }
      }
      if (x == 1) {
        console.log("删除  ", glc[j], "  ", i + 1, "/", topics.length, "  ", topics[i]);
        console.log("  ", y);
        glzs++;
        $(".xfsz_sz").text(glzs);
        //topics[i].remove();
        topics[i].innerHTML = "";
      }
    }
  }
}

//------1-----过滤关键词---------------------
bc();
gy();
var aaa = new Date();
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (records) {
  var bbb = new Date();
  if (bbb - aaa > 200) {
    aaa = bbb;
    records.map(function (record) {
      if (record.addedNodes) {
        gy();
      }
    });
  }
});
var option = {
  childList: true,
  subtree: true,
};
observer.observe(document.body, option);




//-------2-----选中文字 浮动按钮增加过滤词-----------
var keyword = {
  beforePopup: function (popup) {
    var text = window.getSelection().toString().trim();
    popup(text);
  },
};
var iconArray = [{
    name: "过滤",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACCUlEQVRoge2YP2/TQBjGf69TKSwEgcQS1e1AJSRGxEq7sSC2ACoCZSL9Lh07wRCJEvEZ2PkgIOTwZ0ytFnVI/TJAUls5B+fO8qXifpOtyz1+nrz3ni+BQCAQCPzPSNnA1vv0iSpvgG6DfqowVnQw7t/4CBCZPrFzpG1VhqyfeYBNgbezG2OA807aA243ZmllJJ5dGQOIyOvmzLixEKA7Su8Cux68WLEQoJUxYElzrxuFADtH2gZeefJiRSHA+jfvIoUAIjLwZcSWeYC/zfvQoxcr5gGuWvPOyC0h6fmzYU8ugGb+bKyKJrOrywCaHQBffNhZDU30z3IH/rHm4+FZl42LbxZP+ZT0O3sFreNU8/dJv1NLvxnPQnNa072l42WofreaZ8HyAMi+nar8sJpn86iyga0Pk5sIj2xEVWkswEbZQHYR9QTaNqICh/FxemhvqzqlFYgUu+XTMMYA8fCsq2DXwJW43MddMVegNX1eOuZMcR93xdwDIi8cNE+Tfue6w/yVWPiW43eTO8ADB83GdiAwBFBpvXTUbOwlBoYAovrMSVHVXwW2R5P7CPecFEX8VSDLIve9v8G3MBSO0yoKT10FNWruIAe5AJuj012BbVdB1chPBUS1lqODtwoAj+sQvPZr+rMOnarkA0xr0Bt/Prh1UoNOZQq/iRW+2ktpouiV+2MsEAgE3PgNRpiD2Pmw+UgAAAAASUVORK5CYII=",
    host: [""],
    popup: function (text) {
      nglc.push(text);
      bc();
      gy();
      icon.style.display = "none";
    },
  }, ],
  hostCustomMap = {};
iconArray.forEach(function (obj) {
  obj.host.forEach(function (host) {
    // 赋值DOM加载后的自定义方法Map
    hostCustomMap[host] = obj.custom;
  });
});
var text = GM_getValue("search");
var icon = document.createElement("div");
iconArray.forEach(function (obj) {
  var img = document.createElement("img");
  img.setAttribute("src", obj.image);
  img.setAttribute("alt", obj.name);
  img.setAttribute("title", obj.name);
  img.addEventListener("mouseup",
    function () {
      keyword.beforePopup(obj.popup);
    });
  //图标尺寸设置
  img.setAttribute("style", "" + "cursor:pointer!important;" + "display:inline-block!important;" + "width:30px!important;" +
    "height:30px!important;" + "border:0!important;" + "background-color:#0000!important;" + "padding:0!important;" + "margin:0!important;" + "margin-right:5px!important;" + "");
  icon.appendChild(img);
});
icon.setAttribute("style", "" + "display:none!important;" + "position:absolute!important;" + "padding:0!important;" + "margin:0!important;" + "font-size:13px!important;" + "text-align:left!important;" + "border:0!important;" + "background:transparent!important;" + "z-index:2147483647!important;" + "");
// 添加到 DOM
document.documentElement.appendChild(icon);
// 鼠标事件：防止选中的文本消失
document.addEventListener("mousedown",
  function (e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
      e.preventDefault();
    }
  });
// 选中变化事件：
document.addEventListener("selectionchange",
  function () {
    if (!window.getSelection().toString().trim()) {
      icon.style.display = "none";
    }
  });
// 鼠标事件
document.addEventListener("mouseup",
  function (e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
      e.preventDefault();
      return;
    }
    var text = window.getSelection().toString().trim();
    if (text && icon.style.display == "none") {
      icon.style.top = e.pageY - 30 + "px";
      if (e.pageX - 70 < 10) icon.style.left = "10px";
      else icon.style.left = e.pageX + 10 + "px";
      icon.style.display = "block";
    } else if (!text) {
      icon.style.display = "none";
    }
  });

/**触发事件*/
function tiggerEvent(el, type) {
  if ("createEvent" in document) {
    // modern browsers, IE9+
    var e = document.createEvent("HTMLEvents");
    e.initEvent(type, false, true); // event.initEvent(type, bubbles, cancelable);
    el.dispatchEvent(e);
  } else {
    // IE 8
    e = document.createEventObject();
    e.eventType = type;
    el.fireEvent("on" + e.eventType, e);
  }
}


//--------3-------左下角设置按钮-设置节目---------------
let wdstyle = document.createElement('style');
wdstyle.innerHTML = `
.xfsz {
  height: 200px;
  width: 100px;
  position: fixed;
  transition: 0.5s;
  z-index: 9999;
  opacity: 0;
  left: 0px;
  bottom: 0px;
}

.xfsz:hover {
  opacity: 1;
}

.xfsz_an {
  left: 3vw;
  bottom: 3vw;
  background-color: rgb(29, 161, 242);
  border-radius: 19px;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  height: 38px;
  width: 38px;
  line-height: 38px;
  position: absolute;
  text-align: center;
  z-index: 99999;
  user-select: none;
  display: block;
}
.xfsz_sz{
  left: 30px;
  bottom: 0px;
  background-color: #333;
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  height: 25px;
  width: 25px;
  line-height: 25px;
  position: absolute;
  text-align: center;
  z-index: 99999;
  user-select: none;
  display: block;
}
.xfck {
  display: none;
  background: #222;
  width: 600px;
  height: 640px;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}
.xfsc {
  background: #444;
  right: 20px;
  border-radius: 35px;
  margin-bottom: 13px;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
  border: solid 5px #444;
  white-space: nowrap;
  float: left;
}
.xfsc:hover {
  background: #000;
  border: solid 5px #000;
}
.xfyy {
  overflow: auto;
  width: 600px;
  height: 460px;
  margin: auto;
}
#xf_sr {
  width: 580px;
  height: 32px;
  margin: auto;
}
#xf_dc {
  margin-left: 40px;
  margin-right: 40px;
}
.xfgb {
  position: absolute;
  right: 3px;
  top: 3px;
  cursor: pointer;
  font-size: 50px;
}
.xfgb:hover {
  background: #f00;
}

  `;
let wddiv = `
<div class="xfsz">
<span class="xfsz_an" title="过滤设置">
滤
<span class="xfsz_sz">0
</span>
</span>
</div>
<div class="xfck">
  <h1>Twitter过滤设置</h1>
  <div class="xfgb">X
  </div>
  <div>
  <textarea type="text" name="textfield" id="xf_sr" width="auto"></textarea>
  <br>
  不同过滤词用英文 , 分隔；导入会清空已有的，替换为导入的。
	  <br>
    <input type="submit" name="submit" id="xf_zj" value="增加">
    <input type="submit" name="submit" id="xf_dc" value="导出">
    <input type="submit" name="submit" id="xf_dr" value="导入">
    </div>
    <br>
	<div class="xfyy"><div>
</div>
`;
document.body.appendChild(wdstyle);
setTimeout(() => {
  document.querySelector("body").innderHTML += wddiv;
  console.log("成功插入");

  $(wddiv).appendTo($("body"));

  //关闭
  $(".xfgb").click(function () {
    $(".xfck").toggle();
  })
  $(".xfsz_an").click(function () {
    $(".xfck").toggle();
  });

  //删除
  function sc() {
    $(".xfyy").empty();
    glc.forEach(glcc => {
      let a = document.createElement("span");
      $(a).text(glcc).addClass("xfsc");
      $(a).click(function () {
        //console.log("当前", $(a).text());
        glc = glc.filter(item => {
          return item != $(a).text();
        })
        //console.log("glc=", glc);
        GM_setValue("golvci", glc);
        sc();
      })
      $(a).appendTo($(".xfyy"));
    });
  }
  sc();

  //增加
  $("#xf_zj").click(function () {
    nglc = $("#xf_sr").val().split(",");
    bc();
    sc();
    $("#xf_sr").val("")
  });

  //导出
  $("#xf_dc").click(function () {
    let s = "";
    glc.forEach((x) => {
      s += x + ","
    })
    $("#xf_sr").val(s).select();
  });
  //导入
  $("#xf_dr").click(function () {
    glc = $("#xf_sr").val().split(",");
    nglc = new Array();
    bc();
    sc();
    $("#xf_sr").val("");
  });

}, 1000);