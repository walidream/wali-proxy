/* global chrome */
import { LOCAL_URL, LOCAL_DOMAIN, SET_COOKIES } from "@/constants"
//设置localhost cookie
export const setLocalhostCookie = cookie => {
  chrome.cookies.set({
    url: LOCAL_URL,
    domain: LOCAL_DOMAIN,
    name: cookie.name,
    value: cookie.value
  },((details) => {
    console.log(`设置成功: ${details.name}`)
  }))
}

//清除
export const removeCookie = cookie => {
  chrome.cookies.remove({
    url: LOCAL_URL,
    name: cookie.name,
  },((details) =>{
    console.log(`清除成功: ${details.name}`)
  }))
}

export const removeAll = () =>{
  SET_COOKIES.forEach(name => {
    removeCookie({name})
  })
}
