// ==UserScript==
// @name         浏览器搜索扩展工具
// @version      1.1.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索,一键跳转哔哩哔哩，谷歌，百度等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       Levy258
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  "use strict";
  var keyword = {
    beforePopup: function (popup) {
      var text = window.getSelection().toString().trim();
      GM_setValue("search", text);
      popup(text);
    },
    beforeCustom: function (custom) {
      var text = GM_getValue("search");
      GM_setValue("search", "");
      custom(text);
    },
  };

  var iconArray = [
      {
        name: "打开",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACCUlEQVRoge2YP2/TQBjGf69TKSwEgcQS1e1AJSRGxEq7sSC2ACoCZSL9Lh07wRCJEvEZ2PkgIOTwZ0ytFnVI/TJAUls5B+fO8qXifpOtyz1+nrz3ni+BQCAQCPzPSNnA1vv0iSpvgG6DfqowVnQw7t/4CBCZPrFzpG1VhqyfeYBNgbezG2OA807aA243ZmllJJ5dGQOIyOvmzLixEKA7Su8Cux68WLEQoJUxYElzrxuFADtH2gZeefJiRSHA+jfvIoUAIjLwZcSWeYC/zfvQoxcr5gGuWvPOyC0h6fmzYU8ugGb+bKyKJrOrywCaHQBffNhZDU30z3IH/rHm4+FZl42LbxZP+ZT0O3sFreNU8/dJv1NLvxnPQnNa072l42WofreaZ8HyAMi+nar8sJpn86iyga0Pk5sIj2xEVWkswEbZQHYR9QTaNqICh/FxemhvqzqlFYgUu+XTMMYA8fCsq2DXwJW43MddMVegNX1eOuZMcR93xdwDIi8cNE+Tfue6w/yVWPiW43eTO8ADB83GdiAwBFBpvXTUbOwlBoYAovrMSVHVXwW2R5P7CPecFEX8VSDLIve9v8G3MBSO0yoKT10FNWruIAe5AJuj012BbVdB1chPBUS1lqODtwoAj+sQvPZr+rMOnarkA0xr0Bt/Prh1UoNOZQq/iRW+2ktpouiV+2MsEAgE3PgNRpiD2Pmw+UgAAAAASUVORK5CYII=",
        host: [""],
        popup: function (text) {
          if (text.indexOf("http://") == 0 || text.indexOf("https://") == 0)
            window.open(text, "_blank");
          else window.open("http://" + text, "_blank");
        },
      },
    ],
    hostCustomMap = {};
  iconArray.forEach(function (obj) {
    obj.host.forEach(function (host) {
      // 赋值DOM加载后的自定义方法Map
      hostCustomMap[host] = obj.custom;
    });
  });
  var text = GM_getValue("search");
  if (text && window.location.host in hostCustomMap) {
    keyword.beforeCustom(hostCustomMap[window.location.host]);
  }
  var icon = document.createElement("div");
  iconArray.forEach(function (obj) {
    var img = document.createElement("img");
    img.setAttribute("src", obj.image);
    img.setAttribute("alt", obj.name);
    img.setAttribute("title", obj.name);
    img.addEventListener("mouseup", function () {
      keyword.beforePopup(obj.popup);
    });
    img.setAttribute(
      "style",
      "" +
        "cursor:pointer!important;" +
        "display:inline-block!important;" +
        "width:30px!important;" + //图标尺寸设置
        "height:30px!important;" + //图标尺寸设置
        "border:0!important;" +
        "background-color:#0000!important;" +
        "padding:0!important;" +
        "margin:0!important;" +
        "margin-right:5px!important;" +
        ""
    );
    icon.appendChild(img);
  });
  icon.setAttribute(
    "style",
    "" +
      "display:none!important;" +
      "position:absolute!important;" +
      "padding:0!important;" +
      "margin:0!important;" +
      "font-size:13px!important;" +
      "text-align:left!important;" +
      "border:0!important;" +
      "background:transparent!important;" +
      "z-index:2147483647!important;" +
      ""
  );
  // 添加到 DOM
  document.documentElement.appendChild(icon);
  // 鼠标事件：防止选中的文本消失
  document.addEventListener("mousedown", function (e) {
    if (
      e.target == icon ||
      (e.target.parentNode && e.target.parentNode == icon)
    ) {
      e.preventDefault();
    }
  });
  // 选中变化事件：
  document.addEventListener("selectionchange", function () {
    if (!window.getSelection().toString().trim()) {
      icon.style.display = "none";
    }
  });
  // 鼠标事件
  document.addEventListener("mouseup", function (e) {
    if (
      e.target == icon ||
      (e.target.parentNode && e.target.parentNode == icon)
    ) {
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

  /**在新标签页中打开*/
  function open(url) {
    var win;
    win = window.open(url);
    if (window.focus) {
      win.focus();
    }
    return win;
  }
})();
