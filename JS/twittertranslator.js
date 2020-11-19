// ==UserScript==
// @name         推特翻译机2
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  该脚本用于翻译推特为中文，不会经过中间服务器。
// @author       HolynnChen
// @match        https://*.twitter.com/*
// @match        https://*.youtube.com/*
// @match        https://*.facebook.com/*
// @match        https://*.reddit.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.5.2/base64.min.js
// ==/UserScript==

const transdict = {
    '谷歌翻译': translate_gg,
    '爱词霸翻译': translate_icib,
    '必应翻译': translate_biying,
    '有道翻译': translate_youdao,
    '腾讯翻译': translate_tencent,
    '彩云小译': translate_caiyun,
    'Papago翻译': translate_papago,
    '沪江翻译': translate_hj,
    '关闭翻译': () => {}
};
const startup = {
    '谷歌翻译': translate_gg_startup,
    '有道翻译': translate_youdao_startup,
    '腾讯翻译': translate_tencent_startup,
    '彩云小译': translate_caiyun_startup
};
const baseoptions = {
    'enable_pass_lang': {
        declare: '不翻译中文',
        default_value: false,
        change_func: self => {
            if (self.checked) sessionStorage.clear()
        }
    },
    'remove_url': {
        declare: '自动过滤url',
        default_value: true,
    },
    'show_info': {
        declare: '显示翻译源',
        default_value: true,
    },
    'fullscrenn_hidden': {
        declare: '全屏时不显示',
        default_value: true,
    }
};

const [enable_pass_lang, remove_url, show_info, fullscrenn_hidden] = Object.keys(baseoptions).map(key => GM_getValue(key, baseoptions[key].default_value));

const globalProcessingSave = [];

function initPanel() {
    let choice = GM_getValue('translate_choice', '谷歌翻译');
    let select = document.createElement("select");
    select.className = 'js_translate';
    select.style = 'height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange = () => {
        GM_setValue('translate_choice', select.value);
        title.innerText = "控制面板（请刷新以应用）"
    };
    for (let i in transdict) select.innerHTML += '<option value="' + i + '">' + i + '</option>';
    let mask = document.createElement('div'),
        dialog = document.createElement("div"),
        js_dialog = document.createElement("div"),
        title = document.createElement('p');
    //
    window.top.document.body.appendChild(mask);
    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title)
    js_dialog.appendChild(document.createElement('p').appendChild(select));
    //
    mask.style = "display: none;position: fixed;height: 100vh;width: 100vw;z-index: 99999;top: 0;left: 0;overflow: hidden;background-color: rgba(0,0,0,0.4);justify-content: center;align-items: center;"
    mask.addEventListener('click', event => {
        if (event.target === mask) mask.style.display = 'none'
    });
    dialog.style = 'padding:0;border-radius:10px;background-color: #fff;box-shadow: 0 0 5px 4px rgba(0,0,0,0.3);';
    js_dialog.style = "min-height:10vh;min-width:10vw;display:flex;flex-direction:column;align-items:center;padding:10px;border-radius:4px;color:#000";
    title.style = 'margin:5px 0;font-size:20px;';
    title.innerText = "控制面板";
    for (let i in baseoptions) {
        let temp = document.createElement('input'),
            temp_p = document.createElement('p');
        js_dialog.appendChild(temp_p);
        temp_p.appendChild(temp);
        temp.type = 'checkbox';
        temp.name = i;
        temp_p.style = "display:flex;align-items: center;margin:5px 0"
        temp_p.innerHTML += baseoptions[i].declare;
    }
    for (let i of js_dialog.querySelectorAll('input')) {
        if (i.name && baseoptions[i.name]) {
            i.onclick = _ => {
                title.innerText = "控制面板（请刷新以应用）";
                GM_setValue(i.name, i.checked);
                if (baseoptions[i.name].change_func) baseoptions[i.name].change_func(i)
            }
            i.checked = GM_getValue(i.name, baseoptions[i.name].default_value)
        }
    };
    let open = document.createElement('div');
    open.style = `z-index: 9999;height: 25px;width: 25px;background-color: #3e71b0;position: fixed;border-radius: 17.5px;right: 9px;top: 9px;text-align-last: center;color: #ddd;display: flex;align-items: center;justify-content: center;cursor: pointer;font-size: 15px;user-select: none;`;
    open.innerHTML = "译";
    open.onclick = () => {
        mask.style.display = 'flex'
    };
    open.draggable = true;
    open.ondragstart = function (ev) {
        this.tempNode = document.createElement('div');
        this.tempNode.style = "width:1px;height:1px;opacity:0";
        document.body.appendChild(this.tempNode);
        ev.dataTransfer.setDragImage(this.tempNode, 0, 0);
        this.oldX = ev.offsetX - Number(this.style.width.replace('px', ''));
        this.oldY = ev.offsetY
    };
    open.ondrag = function (ev) {
        if (!ev.x && !ev.y) return;
        this.style.right = (window.innerWidth - ev.x + this.oldX) + "px";
        this.style.top = (ev.y - this.oldY) + "px"
    };
    open.ondragend = function (ev) {
        GM_setValue("position_right", this.style.right);
        GM_setValue("position_top", this.style.top);
        document.body.removeChild(this.tempNode)
    };
    open.addEventListener("touchstart", ev => {
        ev.preventDefault();
        ev = ev.touches[0];
        open._tempTouch = {};
        const base = open.getClientRects()[0];
        open._tempTouch.oldX = base.x + base.width - ev.clientX;
        open._tempTouch.oldY = base.y - ev.clientY
    });
    open.addEventListener("touchmove", ev => {
        ev = ev.touches[0];
        open.style.right = (window.innerWidth - open._tempTouch.oldX - ev.clientX) + 'px';
        open.style.top = (ev.clientY + open._tempTouch.oldY) + 'px';
        open._tempIsMove = true
    });
    open.addEventListener("touchend", () => {
        GM_setValue("position_right", open.style.right);
        GM_setValue("position_top", open.style.top);
        if (!open._tempIsMove) {
            mask.style.display = 'flex'
        };
        open._tempIsMove = false
    })
    window.top.document.body.appendChild(open);
    window.top.document.querySelector('.js_translate option[value=' + choice + ']').selected = true;
    if (fullscrenn_hidden) window.top.document.addEventListener('fullscreenchange', () => {
        open.style.display = window.top.document.fullscreenElement ? "none" : "flex"
    });
}

const rules = {
    'twitter': {
        name: '推特通用',
        matcher: /https:\/\/[a-zA-Z.]*?twitter\.com/,
        selector: () => {
            let key = Object.keys(document.querySelector('#react-root>div') || {}).find(item => item.match('^__reactEventHandlers'));
            if (!key) return [];
            return Array.from(document.querySelectorAll('article div[dir="auto"]:not([data-translate])'), item => {
                    item.dataset.translate = "processed";
                    return item.parentNode;
                })
                .map(item => {
                    const obj = item[key].children;
                    if (Array.isArray(obj)) {
                        let index = obj.filter(inner => inner).findIndex(inner => inner && inner.props && inner.props.lang);
                        if (index > -1) return item.children[index];
                    }
                    if (Object.prototype.toString.call(obj) === '[object Object]' && obj.props && obj.props.lang) {
                        return item.firstElementChild
                    }
                    return null;
                }).filter(item => item);
        },
        textGetter: element => {
            let content = element.localName == 'p' ? element.innerText : [...element.querySelectorAll('span')].filter(node => node.parentElement === element).map(e => e.innerText).join('');
            if (remove_url) content = url_filter(content);
            return content;
        },
        textSetter: base_ce_text
    },
    'youtube': {
        name: 'youtube评论区',
        matcher: /https:\/\/.*?.youtube.com\/watch\?v=*/,
        selector: () => {
            const result = [...document.querySelectorAll('#content>#content-text')].filter(item => item.childNodes.length == item.__data.text.runs.length);
            return result;
        },
        textGetter: element => remove_url ? url_filter(element.innerText) : element.innerText,
        textSetter: (element, name, text) => {
            element.updateText_([...element.__data.text.runs, {
                text: `\n\n${show_info?"-----------"+name+"-----------":""}\n\n` + text
            }]);
            element.parentNode.parentNode.removeAttribute('collapsed');
        }
    },
    'facebook': {
        name: 'facebook通用',
        matcher: /https:\/\/www.facebook.com\/.+/,
        selector: () => {
            [...document.querySelectorAll('.text_exposed_root:not(.text_exposed)')].forEach(item => {
                item.className += " text_exposed"
            })
            const articles = Array.from(document.querySelectorAll('div[data-testid=post_message]:not([data-translate])'), item => {
                item.dataset.translate = "processed";
                return item
            });
            const comments = Array.from(document.querySelectorAll('.commentable_item *[role=article] *[data-ft]:not(a):not([data-translate])'), item => {
                item.dataset.translate = "processed";
                return item
            }).filter(item => !item.querySelector('*[data-ft]')).map(item => {
                if (item.tagName != "DIV") return item;
                return item.querySelector('span[dir]')
            });
            return [...articles, ...comments];
        },
        textGetter: element => remove_url ? url_filter(element.innerText) : element.innerText,
        textSetter: (e, name, text) => {
            e.innerHTML += `<pre style="white-space:pre-line">${show_info?"-----------"+name+"-----------":""}\n\n` + text + '</pre>';
        },
    },
    'reddit': {
        name: 'reddit评论',
        matcher: /https:\/\/www.reddit.com\/.+/,
        selector: () => {
            return Array.from(document.querySelectorAll('div[data-test-id=comment]:not([data-translate])'), item => {
                item.dataset.translate = "processed";
                return item
            });
        },
        textGetter: element => remove_url ? url_filter(element.innerText) : element.innerText,
        textSetter: (e, name, text) => {
            e.innerHTML += `<pre style="white-space:pre-line">${show_info?"-----------"+name+"-----------":""}\n\n` + text + '</pre>';
        }
    }
};


(function () {
    'use strict';
    let url = document.location.href;
    let rule = Object.values(rules).find(item => item.matcher.test(document.location.href));
    setInterval(() => {
        if (document.location.href != url) {
            url = document.location.href;
            const ruleNew = Object.values(rules).find(item => item.matcher.test(document.location.href));
            if (ruleNew != rule) {
                if (ruleNew != null) {
                    console.log(`【翻译机】检测到URl变更，改为使用【${ruleNew.name}】规则`)
                } else {
                    console.log("【翻译器】当前无匹配规则")
                }
                rule = ruleNew;
            }
        }
    }, 200)
    console.log(rule ? `【翻译机】使用【${rule.name}】规则` : "【翻译机】当前无匹配规则");
    let main = _ => {
        if (!rule) return;
        let choice = GM_getValue('translate_choice', '谷歌翻译');
        let temp = [...new Set(rule.selector())];
        for (let i = 0; i < temp.length; i++) {
            const now = temp[i];
            if (globalProcessingSave.includes(now)) continue;
            globalProcessingSave.push(now);
            const text = rule.textGetter(now);
            if (text.length == 0) continue;
            if (sessionStorage.getItem(choice + '-' + text)) {
                rule.textSetter(now, choice, sessionStorage.getItem(choice + '-' + text));
                removeItem(globalProcessingSave, now)
            } else {
                pass_lang(text).then(() => transdict[choice](text, s => {
                    rule.textSetter(now, choice, s);
                    removeItem(globalProcessingSave, now);
                }));
            }
        }
    };
    (new Promise(startup[GM_getValue('translate_choice', '谷歌翻译')] || ((a, b) => a()))).then(() => {
        document.js_translater = setInterval(main, 20)
    });
    initPanel();
})();

function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
}

function tk(a) {
    var b = sessionStorage.getItem('google_tkk');
    var d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var k = a.charCodeAt(g);
        128 > k ? e[f++] = k : (2048 > k ? e[f++] = k >> 6 | 192 : (55296 == (k & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (k = 65536 + ((k & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                    e[f++] = k >> 18 | 240,
                    e[f++] = k >> 12 & 63 | 128) : e[f++] = k >> 12 | 224,
                e[f++] = k >> 6 & 63 | 128),
            e[f++] = k & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++) a = Fo(a + e[f], "+-a^+6");
    a = Fo(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + "." + (a ^ b)
}

function Fo(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}

function base_ce_text(e, name, text) { //change element text
    if (text.length == 0) text = '翻译异常';
    e.innerHTML += `<span>\n${show_info?"--------------------------------------------------------":""}\n` + text + '</span>';
}

function url_filter(text) {
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g, '');
}

function translate_gg(raw, reslove, error) {
    let myname = '谷歌翻译'
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=zh-CN&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=btn&ssel=0&tsel=0&kc=0&tk=' + tk(raw) + '&q=' + encodeURIComponent(raw),
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data[0].map(x => x[0] || '').join('')
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(data.responseText)
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_gg(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}

function translate_gg_startup(reslove, reject) {
    if (!sessionStorage.getItem('google_tkk')) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://translate.google.com',
            anonymous: true,
            onload: function (res) {
                sessionStorage.setItem('google_tkk', res.responseText.match(/tkk:'.*?(?=')/g)[0].slice(5))
                reslove()
            }
        });
    } else {
        reslove()
    }
}

function translate_hj(raw, reslove, error) {
    let myname = '沪江翻译'
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://dict.hjenglish.com/v10/dict/translation/jp/cn',
        data: 'content=' + encodeURIComponent(raw.replace('twitter', '推特')),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Cookie': 'HJ_UID=0;'
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data.data.content;
                sessionStorage.setItem(myname + '-' + raw, s)
                reslove(s)
            } catch (err) {
                console.log(data.responseText)
                console.log(raw)
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_hj(raw, reslove, true), 3000)
                return
            }
            reslove(raw)
        }
    })
}

function translate_icib(raw, reslove, error) {
    let myname = '爱词霸翻译'
    GM_xmlhttpRequest({
        method: "POST",
        url: 'http://fy.iciba.com/ajax.php?a=fy',
        data: 'f=auto&t=auto&w=' + encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data.content.out;
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(data.responseText)
                console.log(raw)
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_icib(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}

function translate_biying(raw, reslove, error) {
    let myname = '必应翻译'
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://cn.bing.com/ttranslatev3',
        data: 'fromLang=auto-detect&to=zh-Hans&text=' + encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data[0].translations[0].text;
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(data.responseText)
                console.log(raw)
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_biying(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}

function youdao_data(text) {
    let ts = "" + (new Date).getTime(),
        salt = ts + parseInt(10 * Math.random(), 10);
    let result = `i=${encodeURIComponent(text)}&from=AUTO&to=AUTO&smartresult=dict&client=fanyideskweb&salt=${salt}&sign=${CryptoJS.MD5("fanyideskweb"+text+salt+sessionStorage.getItem('youdao_key'))}&ts=${ts}&doctype=json&version=2.1&keyfrom=fanyi.web&action=FY_BY_REALTlME&typoResult=false`
    return result
}

function translate_youdao(raw, reslove, error) {
    let myname = '有道翻译'
    GM_xmlhttpRequest({
        method: "POST",
        url: 'http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule',
        data: youdao_data(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": "http://fanyi.youdao.com/",
            "User-Agent": "test",
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data.translateResult.map(e => e.map(t => t.tgt).join('')).join('\n');
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(data, data.responseText)
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_youdao(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}

function translate_youdao_startup(reslove, reject) {
    if (!sessionStorage.getItem('youdao_key')) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://fanyi.youdao.com',
            onload: function (res) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: res.responseText.match(/http.*?fanyi.min.js/g)[0],
                    onload: function (res) {
                        sessionStorage.setItem('youdao_key', res.responseText.match(/fanyideskweb.{6}".*?(?=")/g)[0].slice(19));
                        reslove()
                    }
                })
            }
        });
    } else {
        reslove()
    }
}

function translate_tencent(raw, reslove, error) {
    let myname = '腾讯翻译'
    let qtk = sessionStorage.getItem('tencent_qtk'),
        qtv = sessionStorage.getItem('tencent_qtv');
    if (qtk && qtv) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://fanyi.qq.com/api/translate',
            data: `source=auto&target=zh&sourceText=${encodeURIComponent(raw)}&qtv=${encodeURIComponent(qtv)}&qtk=${encodeURIComponent(qtk)}&sessionUuid=translate_uuid${(new Date).getTime()}`,
            headers: {
                "Origin": "https://fanyi.qq.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://fanyi.qq.com/"
            },
            onload: (data) => {
                let s = ''
                try {
                    data = JSON.parse(data.responseText);
                    s = data.translate.records.map(e => e.targetText).join('');
                    sessionStorage.setItem(myname + '-' + raw, s)
                } catch (err) {
                    console.log(raw);
                    if (error) {
                        reslove('翻译出错');
                        return
                    }
                    setTimeout(_ => translate_tencent(raw, reslove, true), 3000)
                    return
                }
                reslove(s);
            },
            onerror: (err) => {
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_tencent(raw, reslove, true), 3000)
            }
        });
    } else {
        console.log('无法获取qtk与qtv')
    }
}

function translate_tencent_startup(reslove, reject) {
    if (!sessionStorage.getItem('tencent_qtk') || !!sessionStorage.getItem('tencent_qtv')) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://fanyi.qq.com',
            onload: function (res) {
                sessionStorage.setItem('tencent_qtv', res.responseText.match(/qtv=.*?(?=")/g)[0].slice(4))
                sessionStorage.setItem('tencent_qtk', res.responseText.match(/qtk=.*?(?=")/g)[0].slice(4))
                reslove()
            }
        });
    } else {
        reslove()
    }
}

function pass_lang(raw) {
    return new Promise((reslove, reject) => {
        if (!enable_pass_lang) {
            reslove();
            return
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://fanyi.baidu.com/langdetect',
            data: `query=${encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0,50))}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: (data) => {
                try {
                    data = JSON.parse(data.responseText);
                    if (data.lan != 'zh') reslove(data.lan);
                } catch (err) {
                    reject(err);
                }
            }
        })
    })
}

function translate_caiyun_decode(t) {
    let e = (i) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(i);
    return Base64.decode(t.split("").map((j) => e(j) > -1 ? "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm" [e(j)] : j).join(""));
}

function translate_caiyun_startup(reslove, reject) {
    if (!sessionStorage.getItem('caiyun_id') || !!sessionStorage.getItem('caiyun_jwt')) {
        let browser_id = CryptoJS.MD5(Math.random().toString()).toString();
        sessionStorage.setItem('caiyun_id', browser_id);
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://api.interpreter.caiyunai.com/v1/user/jwt/generate',
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            },
            data: JSON.stringify({
                "browser_id": browser_id
            }),
            onload: (data) => {
                try {
                    data = JSON.parse(data.responseText);
                    sessionStorage.setItem('caiyun_jwt', data.jwt);
                    reslove();
                } catch (err) {
                    reject(err);
                }
            }
        })
    } else {
        reslove()
    }
}

function translate_caiyun(raw, reslove, error) {
    let myname = '彩云小译'
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://api.interpreter.caiyunai.com/v1/translator',
        data: JSON.stringify({
            "source": raw.split('\n'),
            "jsonrpc": "2.0",
            "trans_type": "auto2zh",
            "request_id": "web_fanyi",
            "media": "text",
            "os_type": "web",
            "dict": true,
            "cached": true,
            "replaced": true,
            "detect": true,
            "browser_id": sessionStorage.getItem('caiyun_id')
        }),
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            "T-Authorization": sessionStorage.getItem('caiyun_jwt')
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                console.log(data, raw.split('\n'));
                s = data.target.map(i => translate_caiyun_decode(i)).join('\n');
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(err);
                console.log(data.responseText);
                console.log(data);
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_caiyun(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function translate_papago(raw, reslove, error) {
    let myname = 'Papago';
    const device_id = guid();
    const time = Date.now();
    const auth = 'PPG ' + device_id + ':' + CryptoJS.HmacMD5(device_id + '\nhttps://papago.naver.com/apis/n2mt/translate\n' + time, "v1.5.1_4dfe1d83c2").toString(CryptoJS.enc.Base64);
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://papago.naver.com/apis/n2mt/translate',
        data: `deviceId=${device_id}&source=auto&target=zh-CN&text=${encodeURIComponent(raw)}`,
        headers: {
            "authorization": auth,
            "x-apigw-partnerid": "papago",
            "device-type": 'pc',
            "timestamp": time,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        onload: (data) => {
            let s = ''
            try {
                data = JSON.parse(data.responseText);
                s = data.translatedText
                sessionStorage.setItem(myname + '-' + raw, s)
            } catch (err) {
                console.log(err);
                console.log(data.responseText);
                if (error) {
                    reslove('翻译出错');
                    return
                }
                setTimeout(_ => translate_papago(raw, reslove, true), 3000)
                return
            }
            reslove(s)
        }
    })
}