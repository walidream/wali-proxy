/* global chrome */
import { YAPI_PROXY_RULES, YAPI_PROXY_ENABLE } from "@/constants"

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

function toggleWebRequest(flag){
  if(flag){
    /** listener web request **/
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      {
        urls: ['<all_urls>'],
        types: ['xmlhttprequest'],
      },
      ['blocking']
    )
  }else{
     /** remove listener web request **/
    chrome.webRequest.onBeforeRequest.removeListener(listener)
  }
}


/** init **/
chrome.storage.local.get([YAPI_PROXY_RULES, YAPI_PROXY_ENABLE], (data) => {
  enable = data[YAPI_PROXY_ENABLE] || false
  rules = filterRules(data[YAPI_PROXY_RULES]) || []

  if(enable){
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

});



















