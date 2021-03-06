/* global chrome */
import { setLocalhostCookie, removeAll } from './login';
import { 
  YAPI_PROXY_RULES, 
  YAPI_PROXY_ENABLE, 
  YAPI_PROXY_LOGIN, 
  QA_HOST,
  SET_COOKIES
} from "@/constants";


var login = false
var enable = false
var rules = []

function filterRules(rules){

  if(rules && rules.filter){
    return rules.filter(item => item.checked )
  }
  return  []
}

function updateRules(){
  return rules.map((item, ind) => {
    const id = ind + 1
    return {
      "id" : id,
      "priority": 1,
      "action": {
        "type" : "redirect",
        "redirect": {
          "url": item.target
        }
      },
      "condition": {
        "urlFilter" : `${item.host}`,
        "resourceTypes" : ["xmlhttprequest"]
      }
    }
  }) 
}


//开启请求或关闭
function toggleWebRequest(flag){
  if(flag){
    //添加规则
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
      const previousRuleIds = previousRules.map(rule => rule.id)
      const addRules = updateRules()
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: previousRuleIds,
        addRules: addRules
      },(info) => {
        console.log('更新成功：', info)
      })
     })
  }else{
     //移除规则
     chrome.declarativeNetRequest.getDynamicRules(previousRules => {
      const previousRuleIds = previousRules.map(rule => rule.id)
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: previousRuleIds,
        addRules: []
      },(info) => {
        console.log('清除成功：', info)
      })
     })
  }
}

/** init **/
chrome.storage.local.get([YAPI_PROXY_RULES, YAPI_PROXY_ENABLE, YAPI_PROXY_LOGIN], (data) => {
  login = data[YAPI_PROXY_LOGIN] || false
  enable = data[YAPI_PROXY_ENABLE] || false
  rules = filterRules(data[YAPI_PROXY_RULES]) || []

  if(enable){
    //监听请求
    toggleWebRequest(true)
  }
});

/** listener chrome storage**/
chrome.storage.onChanged.addListener((changes) => {

  if(changes[YAPI_PROXY_RULES]){
    rules = filterRules(changes[YAPI_PROXY_RULES]['newValue'])
    toggleWebRequest(true)
  }
  if(changes[YAPI_PROXY_ENABLE]){
    enable = changes[YAPI_PROXY_ENABLE]['newValue']
    toggleWebRequest(enable)
  }
  if(changes[YAPI_PROXY_LOGIN]){
    login = changes[YAPI_PROXY_LOGIN]['newValue']
    if(!login){
      removeAll()
    }
  }
});


//监听cookies
chrome.cookies.onChanged.addListener((changeInfo) => {
  if(login){
    const cookie = changeInfo.cookie
    if(cookie.domain.includes(QA_HOST) && SET_COOKIES.includes(cookie.name)){
      setLocalhostCookie(cookie)
    }
  }
})



















