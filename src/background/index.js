/* global chrome */
import { setLocalhostCookie, removeAll, setDomainCookies } from "./login";
import {
  YAPI_PROXY_RULES,
  YAPI_PROXY_ENABLE,
  YAPI_PROXY_DEV_LOGIN,
  YAPI_PROXY_QA_LOGIN,
  DEV_HOST,
  QA_HOST,
  SET_COOKIES,
} from "@/constants";

var devLogin = false;
var qaLogin = false;
var enable = false;
var rules = [];

//filter rule
function filterRules(rules) {
  if (rules && rules.filter) {
    return rules.filter((item) => item.checked);
  }
  return [];
}

//update rule
function updateRules() {
  return rules.map((item, ind) => {
    const id = ind + 1;
    return {
      id: id,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          url: item.target,
        },
      },
      condition: {
        urlFilter: `${item.host}`,
        resourceTypes: ["xmlhttprequest"],
      },
    };
  });
}

//turn on request or turn off
function toggleWebRequest(flag) {
  if (flag) {
    //add rule
    chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
      const previousRuleIds = previousRules.map((rule) => rule.id);
      const addRules = updateRules();
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: previousRuleIds,
          addRules: addRules,
        },
        (info) => {
          console.log("update successful:", info);
        }
      );
    });
  } else {
    //remove rule
    chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
      const previousRuleIds = previousRules.map((rule) => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: previousRuleIds,
          addRules: [],
        },
        (info) => {
          console.log("clean successful:", info);
        }
      );
    });
  }
}

/** init **/
chrome.storage.local.get(
  [
    YAPI_PROXY_RULES,
    YAPI_PROXY_ENABLE,
    YAPI_PROXY_DEV_LOGIN,
    YAPI_PROXY_QA_LOGIN,
  ],
  (data) => {
    devLogin = data[YAPI_PROXY_DEV_LOGIN] || false;
    qaLogin = data[YAPI_PROXY_QA_LOGIN] || false;
    enable = data[YAPI_PROXY_ENABLE] || false;
    rules = filterRules(data[YAPI_PROXY_RULES]) || [];

    if (enable) {
      //监听请求
      toggleWebRequest(true);
    }
  }
);

/** listener chrome storage**/
chrome.storage.onChanged.addListener((changes) => {
  if (changes[YAPI_PROXY_RULES]) {
    rules = filterRules(changes[YAPI_PROXY_RULES]["newValue"]);
    toggleWebRequest(true);
  }
  if (changes[YAPI_PROXY_ENABLE]) {
    enable = changes[YAPI_PROXY_ENABLE]["newValue"];
    toggleWebRequest(enable);
  }

  //监听用户DEV登录
  if (changes[YAPI_PROXY_DEV_LOGIN] && qaLogin === false) {
    devLogin = changes[YAPI_PROXY_DEV_LOGIN]["newValue"];
    if (!devLogin) {
      removeAll();
    } else {
      console.log("设置dev cookie");
      setDomainCookies(DEV_HOST);
    }
  }

  //监听用户QA登录
  if (changes[YAPI_PROXY_QA_LOGIN] && devLogin === false) {
    qaLogin = changes[YAPI_PROXY_QA_LOGIN]["newValue"];
    if (!qaLogin) {
      removeAll();
    } else {
      console.log("设置qa cookie");
      setDomainCookies(QA_HOST);
    }
  }
});

//监听cookies
chrome.cookies.onChanged.addListener((changeInfo) => {
  if (devLogin && qaLogin === false) {
    const cookie = changeInfo.cookie;
    if (cookie.domain.includes(DEV_HOST) && SET_COOKIES.includes(cookie.name)) {
      console.log("监听dev cookie 变动: ", cookie);
      setLocalhostCookie(cookie);
    }
  }
  if (qaLogin && devLogin === false) {
    const cookie = changeInfo.cookie;
    if (cookie.domain.includes(QA_HOST) && SET_COOKIES.includes(cookie.name)) {
      console.log("监听qa cookie 变动: ", cookie);
      setLocalhostCookie(cookie);
    }
  }
});
