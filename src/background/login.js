/* global chrome */

import { LOCAL_URL, LOCAL_DOMAIN, SET_COOKIES } from "@/constants";
//set localhost cookie
export const setLocalhostCookie = (cookie) => {
  chrome.cookies.set(
    {
      url: LOCAL_URL,
      domain: LOCAL_DOMAIN,
      name: cookie.name,
      value: cookie.value,
    },
    (details) => {
      console.log(`coockie set up successfully: ${details.name}`);
    }
  );
};

//clear localhost cookies
export const removeCookie = (cookie) => {
  chrome.cookies.remove(
    {
      url: LOCAL_URL,
      name: cookie.name,
    },
    (details) => {
      console.log(`cookie clean: ${details.name}`);
    }
  );
};

export const removeAll = () => {
  SET_COOKIES.forEach((name) => {
    removeCookie({ name });
  });
};
