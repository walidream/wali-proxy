/* global chrome */
export const Storage = {
  get(key) {
    let val = localStorage.getItem(key)
    return val ? JSON.parse(val) : ''
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
  },
  addItem(key, item) {
    let list = this.get(key) || []
    list.unshift(item)
    this.set(key, list)
    return list
  },
  deleteItemBy(key, itemKey, val) {
    let list = this.get(key)
    if (list && list.length) {
      let i = list.findIndex(_it => _it[itemKey] === val)
      if (i > -1) list.splice(i, 1)
      this.set(key, list)
    }
    return list
  },
  clear(){
    localStorage.clear()
  }
}


export const chromeStorage = {
  get(key = [''], cb){
    try{
      chrome.storage.local.get(key, (data) => {
        cb && cb(data)
      })
    }catch(e){
      console.error("获取 chrome storage 报错",e)
    }
  },
  set(storageObj, cb){
    try{
      chrome.storage.local.set(storageObj, (data) => {
        cb && cb(data)
      })
    }catch(e){
      console.error("设置 chrome storage 报错",e)
    }
  },
  remove(key, cb){
    try{
      chrome.storage.local.remove(key, () => {
        cb && cb()
      })
    }catch(e){
      console.error("移除 chrome storage 报错",e)
    }
  },
  clear(cb){
    try{
      chrome.storage.local.clear(() => {
        cb && cb()
      })
    }catch(e){
      console.error("清除 chrome storage 报错",e)
    }
  }
}








