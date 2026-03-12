(() => {
  let rules = [];
  let globalEnabled = true;
  let rulesReady = false;
  let pendingRequests = [];

  // Listen for rule updates from bridge via postMessage
  window.addEventListener('message', (e) => {
    if (e.source === window && e.data && e.data.type === '__fetch_interceptor_rules_update__') {
      rules = e.data.rules || [];
      globalEnabled = e.data.globalEnabled !== undefined ? e.data.globalEnabled : true;

      if (!rulesReady) {
        rulesReady = true;
        // Resolve any pending requests that were waiting for rules
        const pending = pendingRequests.splice(0);
        pending.forEach(p => p.resolve());
      }
    }
  });

  // Request rules from bridge
  window.postMessage({ type: '__fetch_interceptor_get_rules__' }, '*');

  function waitForRules() {
    if (rulesReady) return Promise.resolve();
    return new Promise((resolve) => {
      // Timeout after 100ms to avoid blocking requests forever
      const timer = setTimeout(() => {
        rulesReady = true;
        resolve();
      }, 100);
      pendingRequests.push({
        resolve: () => {
          clearTimeout(timer);
          resolve();
        }
      });
    });
  }

  function findMatchingRule(url) {
    if (!globalEnabled) return null;
    let normalizedUrl;
    try {
      normalizedUrl = new URL(url, window.location.href).href;
    } catch {
      normalizedUrl = url;
    }
    return rules.find(rule => {
      if (!rule.enabled || !rule.url) return false;
      let normalizedRuleUrl;
      try {
        normalizedRuleUrl = new URL(rule.url).href;
      } catch {
        normalizedRuleUrl = rule.url;
      }
      return normalizedUrl === normalizedRuleUrl;
    });
  }

  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
    return waitForRules().then(() => {
      const matchedRule = findMatchingRule(url);
      if (matchedRule) {
        console.log('%c[wali proxy]%c Intercepted: %s', 'color:#4CAF50;font-weight:bold', 'color:inherit', url);
        return new Response(matchedRule.body, {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch.apply(window, [input, init]);
    });
  };

  // Override XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this.__interceptor_url = url;
    return originalXHROpen.call(this, method, url, ...rest);
  };

  function fakeXhrResponse(xhr, url, matchedRule) {
    console.log('%c[wali proxy]%c Intercepted XHR: %s', 'color:#4CAF50;font-weight:bold', 'color:inherit', url);
    Object.defineProperty(xhr, 'readyState', { get: () => 4, configurable: true });
    Object.defineProperty(xhr, 'status', { get: () => 200, configurable: true });
    Object.defineProperty(xhr, 'statusText', { get: () => 'OK', configurable: true });
    Object.defineProperty(xhr, 'responseText', { get: () => matchedRule.body, configurable: true });
    Object.defineProperty(xhr, 'response', { get: () => matchedRule.body, configurable: true });
    Object.defineProperty(xhr, 'responseURL', { get: () => url, configurable: true });
    Object.defineProperty(xhr, 'getAllResponseHeaders', {
      value: () => 'content-type: application/json\r\n',
      configurable: true
    });
    Object.defineProperty(xhr, 'getResponseHeader', {
      value: (name) => name.toLowerCase() === 'content-type' ? 'application/json' : null,
      configurable: true
    });

    setTimeout(() => {
      xhr.dispatchEvent(new Event('readystatechange'));
      xhr.dispatchEvent(new Event('load'));
      xhr.dispatchEvent(new Event('loadend'));
      if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
      if (typeof xhr.onload === 'function') xhr.onload();
      if (typeof xhr.onloadend === 'function') xhr.onloadend();
    }, 0);
  }

  XMLHttpRequest.prototype.send = function(body) {
    const xhr = this;
    const url = xhr.__interceptor_url;

    if (rulesReady) {
      const matchedRule = findMatchingRule(url);
      if (matchedRule) {
        fakeXhrResponse(xhr, url, matchedRule);
        return;
      }
      return originalXHRSend.call(xhr, body);
    }

    // Rules not ready yet — wait then decide
    waitForRules().then(() => {
      const matchedRule = findMatchingRule(url);
      if (matchedRule) {
        fakeXhrResponse(xhr, url, matchedRule);
      } else {
        originalXHRSend.call(xhr, body);
      }
    });
  };
})();
