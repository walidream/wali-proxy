const rulesContainer = document.getElementById('rulesContainer');
const emptyState = document.getElementById('emptyState');
const globalToggle = document.getElementById('globalToggle');
const addRuleBtn = document.getElementById('addRule');
const refreshTabBtn = document.getElementById('refreshTab');

let rules = [];
let globalEnabled = true;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function renderRules() {
  rulesContainer.querySelectorAll('.rule').forEach(el => el.remove());
  emptyState.style.display = rules.length === 0 ? 'block' : 'none';

  rules.forEach((rule, index) => {
    const ruleEl = document.createElement('div');
    ruleEl.className = 'rule';
    ruleEl.innerHTML = `
      <div class="rule-header">
        <label>Rule ${index + 1}</label>
        <div class="rule-actions">
          <label class="toggle" title="Enable/Disable">
            <input type="checkbox" class="rule-toggle" data-id="${rule.id}" ${rule.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <button class="btn btn-danger" data-id="${rule.id}" title="Delete">&times;</button>
        </div>
      </div>
      <input type="text" class="rule-url" data-id="${rule.id}" placeholder="Full URL to match (e.g. https://api.example.com/data?page=1)" value="${escapeHtml(rule.url)}">
      <textarea class="rule-body" data-id="${rule.id}" placeholder="Response JSON body">${escapeHtml(rule.body)}</textarea>
      <div class="json-error" data-id="${rule.id}"></div>
    `;
    rulesContainer.appendChild(ruleEl);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let saveTimer = null;
function saveRulesImmediate() {
  clearTimeout(saveTimer);
  chrome.storage.local.set({ rules, globalEnabled });
}
function saveRules() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveRulesImmediate, 300);
}

function loadRules() {
  chrome.storage.local.get(['rules', 'globalEnabled'], (result) => {
    rules = result.rules || [];
    globalEnabled = result.globalEnabled !== undefined ? result.globalEnabled : true;
    globalToggle.checked = globalEnabled;
    renderRules();
  });
}

addRuleBtn.addEventListener('click', () => {
  rules.push({
    id: generateId(),
    url: '',
    body: '{\n  \n}',
    enabled: true
  });
  saveRulesImmediate();
  renderRules();
});

rulesContainer.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn-danger');
  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    rules = rules.filter(r => r.id !== id);
    saveRulesImmediate();
    renderRules();
  }
});

rulesContainer.addEventListener('change', (e) => {
  if (e.target.classList.contains('rule-toggle')) {
    const id = e.target.dataset.id;
    const rule = rules.find(r => r.id === id);
    if (rule) {
      rule.enabled = e.target.checked;
      saveRulesImmediate();
    }
  }
});

rulesContainer.addEventListener('input', (e) => {
  if (e.target.classList.contains('rule-url')) {
    const id = e.target.dataset.id;
    const rule = rules.find(r => r.id === id);
    if (rule) {
      rule.url = e.target.value;
      saveRules();
    }
  }
  if (e.target.classList.contains('rule-body')) {
    const id = e.target.dataset.id;
    const rule = rules.find(r => r.id === id);
    if (rule) {
      rule.body = e.target.value;
      saveRules();
      // Validate JSON
      const errorEl = rulesContainer.querySelector(`.json-error[data-id="${id}"]`);
      try {
        if (e.target.value.trim()) JSON.parse(e.target.value);
        e.target.classList.remove('invalid');
        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
      } catch (err) {
        e.target.classList.add('invalid');
        if (errorEl) { errorEl.style.display = 'block'; errorEl.textContent = err.message; }
      }
    }
  }
});

globalToggle.addEventListener('change', () => {
  globalEnabled = globalToggle.checked;
  saveRulesImmediate();
});

// Refresh current tab
refreshTabBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
  });
});

// Flush pending saves when popup closes
window.addEventListener('unload', () => {
  if (saveTimer) saveRulesImmediate();
});

loadRules();
