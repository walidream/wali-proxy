const YAPI_PROXY_RULES = "YAPI_PROXY_RULES";
const YAPI_PROXY_ENABLE = 'YAPI_PROXY_ENABLE';

function filterRules(rules){

  if(rules && rules.filter){
    rules.filter(item => item.checked )
  }

  return  []
}

let enable = false
let rules = []


chrome.storage.local.get([YAPI_PROXY_RULES, YAPI_PROXY_ENABLE], (data) => {
  enable = data[YAPI_PROXY_ENABLE]
  rules = filterRules(data[YAPI_PROXY_RULES])
});


chrome.storage.onChanged.addListener((changes) => {
  enable = changes[YAPI_PROXY_ENABLE]
  rules = filterRules(changes[YAPI_PROXY_RULES])
});

chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    console.log(enable)
    if(enable){
      const index = rules.findIndex(val => val.host === url)
      if(index !== -1){
        return {
          redirectUrl: url.replace(url, rules[index]['target'])
        }
      }
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['xmlhttprequest'],
  },
  ['blocking']
)

















