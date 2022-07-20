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

function listener({url}){
  if(enable){
    const index = rules.findIndex(val => val.host === url)
    if(index !== -1){
      return {
        redirectUrl: url.replace(url, rules[index]['target'])
      }
    } 
  }
}

//开启请求或关闭
function toggleWebRequest(flag){
  if(flag){
    /** listener web request **/
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      {
        urls: ['<all_urls>'],
        types: ['xmlhttprequest'],
      },
      ['requestHeaders','blocking']
    )
  }else{
     /** remove listener web request **/
    chrome.webRequest.onBeforeRequest.removeListener(listener)
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



















