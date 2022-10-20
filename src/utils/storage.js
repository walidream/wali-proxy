/* global chrome */
export const chromeStorage = {
  get(key = [""], cb) {
    try {
      chrome.storage.local.get(key, (data) => {
        cb && cb(data);
      });
    } catch (e) {
      console.error("get chrome storage error", e);
    }
  },
  set(storageObj, cb) {
    try {
      chrome.storage.local.set(storageObj, (data) => {
        cb && cb(data);
      });
    } catch (e) {
      console.error("set chrome storage error", e);
    }
  },
  remove(key, cb) {
    try {
      chrome.storage.local.remove(key, () => {
        cb && cb();
      });
    } catch (e) {
      console.error("remove chrome storage error", e);
    }
  },
  clear(cb) {
    try {
      chrome.storage.local.clear(() => {
        cb && cb();
      });
    } catch (e) {
      console.error("clean chrome storage error", e);
    }
  },
};
