(function () {
  var STORAGE_KEY = 'orbit_demo_state';
  var MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var currentState = null;
  var stateChangeCallback = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildSeedState(role) {
    var seed = window.ORBIT_DATA;
    return {
      role: role || null,
      organization: clone(seed.organization),
      activitiesThisMonth: seed.activitiesThisMonth || 4,
      members: clone(seed.members),
      documents: clone(seed.documents),
      transactions: clone(seed.transactions),
      history: clone(seed.history)
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.members) && Array.isArray(parsed.documents) && Array.isArray(parsed.transactions) && Array.isArray(parsed.history)) {
          currentState = parsed;
          return currentState;
        }
      }
    } catch (e) {
      // Fallback to seed data if localStorage is unavailable or corrupted
    }
    currentState = buildSeedState(null);
    return currentState;
  }

  function saveState(state) {
    if (state) {
      currentState = state;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      // Ignore storage quota errors in restricted environments
    }
  }

  function getState() {
    if (!currentState) {
      return loadState();
    }
    return currentState;
  }

  function isValidRole(role) {
    return role === 'Secretary' || role === 'Treasurer' || role === 'Member';
  }

  function requireAuth() {
    var state = loadState();
    if (!isValidRole(state.role)) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  function selectRoleAndEnter(role) {
    if (!isValidRole(role)) return;
    var state = loadState();
    state.role = role;
    saveState(state);
    window.location.href = 'dashboard.html';
  }

  function getCurrentUser() {
    var state = getState();
    var roleKey = isValidRole(state.role) ? state.role : 'Member';
    return window.ORBIT_DATA.roles[roleKey];
  }

  function canEdit(section) {
    var user = getCurrentUser();
    if (section === 'documents') return Boolean(user.canEditDocuments);
    if (section === 'members') return Boolean(user.canEditMembers);
    if (section === 'finance') return Boolean(user.canEditFinance);
    return false;
  }

  function formatCurrency(amount) {
    var num = Math.round(Number(amount) || 0);
    var sign = num < 0 ? '-' : '';
    var absStr = Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return sign + 'Rp ' + absStr;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    var parts = String(dateStr).split('-');
    if (parts.length === 3) {
      var year = parts[0];
      var monthIdx = parseInt(parts[1], 10) - 1;
      var day = parseInt(parts[2], 10);
      if (!isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
        return day + ' ' + MONTH_SHORT[monthIdx] + ' ' + year;
      }
    }
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.getDate() + ' ' + MONTH_SHORT[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatNowDateTime() {
    var now = new Date();
    var day = now.getDate();
    var month = MONTH_SHORT[now.getMonth()];
    var year = now.getFullYear();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    return day + ' ' + month + ' ' + year + ', ' + hh + ':' + mm;
  }

  function addHistory(action, section) {
    var state = getState();
    var user = getCurrentUser();
    var entry = {
      id: 'HIS-' + Date.now(),
      actor: user.name,
      role: user.role,
      action: action,
      section: section,
      time: formatNowDateTime()
    };
    state.history.unshift(entry);
    saveState(state);
    return entry;
  }

  function getFinanceSummary() {
    var state = getState();
    var totalIncome = 0;
    var totalExpense = 0;
    for (var i = 0; i < state.transactions.length; i++) {
      var tx = state.transactions[i];
      var amt = Number(tx.amount) || 0;
      if (tx.type === 'Income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }
    }
    return {
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }

  function getMonthlyFinanceSeries(monthCount) {
    var count = monthCount || 6;
    var state = getState();
    // Anchor at Nov 2026 or the latest transaction month if later
    var maxYear = 2026;
    var maxMonth = 10; // 0-indexed (10 = Nov)
    for (var i = 0; i < state.transactions.length; i++) {
      var parts = String(state.transactions[i].date || '').split('-');
      if (parts.length === 3) {
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          if (y > maxYear || (y === maxYear && m > maxMonth)) {
            maxYear = y;
            maxMonth = m;
          }
        }
      }
    }

    var keys = [];
    var labels = [];
    for (var offset = count - 1; offset >= 0; offset--) {
      var d = new Date(maxYear, maxMonth - offset, 1);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      keys.push(key);
      labels.push(MONTH_SHORT[d.getMonth()] + ' ' + d.getFullYear());
    }

    var incomeMap = {};
    var expenseMap = {};
    for (var k = 0; k < keys.length; k++) {
      incomeMap[keys[k]] = 0;
      expenseMap[keys[k]] = 0;
    }

    for (var j = 0; j < state.transactions.length; j++) {
      var tx = state.transactions[j];
      var txKey = String(tx.date || '').slice(0, 7);
      if (Object.prototype.hasOwnProperty.call(incomeMap, txKey)) {
        var val = Number(tx.amount) || 0;
        if (tx.type === 'Income') {
          incomeMap[txKey] += val;
        } else {
          expenseMap[txKey] += val;
        }
      }
    }

    var income = [];
    var expense = [];
    for (var idx = 0; idx < keys.length; idx++) {
      income.push(incomeMap[keys[idx]]);
      expense.push(expenseMap[keys[idx]]);
    }

    return {
      labels: labels,
      income: income,
      expense: expense
    };
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function getLogoSvg(sizePx) {
    var size = sizePx || 28;
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="16" cy="16" r="11.5" stroke="#3B5BDB" stroke-width="2.25" />' +
      '<circle cx="16" cy="16" r="4.5" fill="#3B5BDB" />' +
      '<circle cx="25.5" cy="9.5" r="3" fill="#F59F00" stroke="#FFFFFF" stroke-width="1.5" />' +
      '</svg>'
    );
  }

  function showToast(message, variant) {
    var root = document.getElementById('orbit-toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'orbit-toast-root';
      root.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0';
      document.body.appendChild(root);
    }

    var bgClass = 'bg-slate-900 text-white border-slate-800';
    var iconName = 'check-circle-2';
    var iconColor = 'text-emerald-400';

    if (variant === 'info') {
      iconName = 'info';
      iconColor = 'text-sky-400';
    } else if (variant === 'warning') {
      iconName = 'alert-circle';
      iconColor = 'text-amber-400';
    } else if (variant === 'error') {
      iconName = 'x-circle';
      iconColor = 'text-rose-400';
    }

    var toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium orbit-animate-in ' + bgClass;
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<i data-lucide="' + iconName + '" class="w-4 h-4 shrink-0 ' + iconColor + '"></i>' +
      '<span class="flex-1 leading-snug">' + escapeHtml(message) + '</span>';

    root.appendChild(toast);
    refreshIcons();

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 2800);
  }

  function openModal(options) {
    closeModal();
    var root = document.getElementById('orbit-modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'orbit-modal-root';
      document.body.appendChild(root);
    }

    root.innerHTML =
      '<div id="orbit-modal-backdrop" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center p-4">' +
      '  <div class="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col orbit-animate-in" role="dialog" aria-modal="true" aria-labelledby="orbit-modal-title">' +
      '    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">' +
      '      <h2 id="orbit-modal-title" class="text-base font-semibold text-slate-900">' + escapeHtml(options.title || '') + '</h2>' +
      '      <button type="button" id="orbit-modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Close modal">' +
      '        <i data-lucide="x" class="w-4 h-4"></i>' +
      '      </button>' +
      '    </div>' +
      '    <div class="p-6 overflow-y-auto flex-1">' + (options.bodyHtml || '') + '</div>' +
      (options.footerHtml
        ? '<div class="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex items-center justify-end gap-3">' + options.footerHtml + '</div>'
        : '') +
      '  </div>' +
      '</div>';

    refreshIcons();

    var backdrop = document.getElementById('orbit-modal-backdrop');
    var closeBtn = document.getElementById('orbit-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) {
          closeModal();
        }
      });
    }
    if (typeof options.onMount === 'function') {
      options.onMount();
    }
  }

  function closeModal() {
    var root = document.getElementById('orbit-modal-root');
    if (root) {
      root.innerHTML = '';
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  function switchRole(newRole) {
    if (!isValidRole(newRole)) return;
    var state = getState();
    state.role = newRole;
    saveState(state);
    var user = getCurrentUser();
    updateTopBarUser();
    if (typeof stateChangeCallback === 'function') {
      stateChangeCallback(state);
    }
    showToast('Switched to ' + user.role + ' (' + user.name + ')', 'info');
  }

  function resetDemoData() {
    var state = getState();
    var activeRole = isValidRole(state.role) ? state.role : null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
    currentState = buildSeedState(activeRole);
    saveState(currentState);
    updateTopBarUser();
    if (typeof stateChangeCallback === 'function') {
      stateChangeCallback(currentState);
    }
    showToast('Demo data reset to sample defaults', 'success');
  }

  function logout() {
    var state = getState();
    state.role = null;
    saveState(state);
    window.location.href = 'index.html';
  }

  function getAvatarToneClass(role) {
    if (role === 'Secretary') return 'bg-[#EEF2FF] text-[#3B5BDB] border-[#DBE4FF]';
    if (role === 'Treasurer') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }

  function updateTopBarUser() {
    var user = getCurrentUser();
    var selectEl = document.getElementById('orbit-role-select');
    if (selectEl) {
      selectEl.value = user.role;
    }
    var avatarEl = document.getElementById('orbit-user-avatar');
    if (avatarEl) {
      avatarEl.textContent = user.initials;
      avatarEl.className = 'w-9 h-9 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ' + getAvatarToneClass(user.role);
    }
    var nameEl = document.getElementById('orbit-user-name');
    if (nameEl) {
      nameEl.textContent = user.name;
    }
    var roleEl = document.getElementById('orbit-user-role');
    if (roleEl) {
      roleEl.textContent = user.role;
    }
  }

  function toggleMobileSidebar(open) {
    var sidebar = document.getElementById('orbit-sidebar');
    var backdrop = document.getElementById('orbit-sidebar-backdrop');
    if (!sidebar || !backdrop) return;
    if (open) {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    }
  }

  function renderLayout(options) {
    if (!requireAuth()) return false;
    var activeNav = options.activeNav || 'dashboard';
    var pageTitle = options.pageTitle || 'Dashboard';
    stateChangeCallback = options.onStateChange || null;

    var user = getCurrentUser();
    var state = getState();

    var navItems = [
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'layout-dashboard' },
      { id: 'documents', label: 'Documents', href: 'documents.html', icon: 'file-text' },
      { id: 'finance', label: 'Finance', href: 'finance.html', icon: 'wallet' },
      { id: 'members', label: 'Members', href: 'members.html', icon: 'users' },
      { id: 'history', label: 'Change History', href: 'history.html', icon: 'history' }
    ];

    var navHtml = navItems
      .map(function (item) {
        var isActive = item.id === activeNav;
        var cls = isActive
          ? 'bg-[#EEF2FF] text-[#3B5BDB] font-semibold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium';
        return (
          '<a href="' + item.href + '" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ' + cls + '">' +
          '  <i data-lucide="' + item.icon + '" class="w-4 h-4 shrink-0"></i>' +
          '  <span>' + escapeHtml(item.label) + '</span>' +
          '</a>'
        );
      })
      .join('');

    var packagesActive = activeNav === 'packages';
    var packagesCls = packagesActive
      ? 'bg-[#EEF2FF] text-[#3B5BDB] font-semibold'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium';

    var pageSlot = document.getElementById('page-content');
    var pageInnerHtml = pageSlot ? pageSlot.innerHTML : '';

    var shell = document.getElementById('app-shell');
    if (!shell) {
      shell = document.body;
    }

    shell.innerHTML =
      '<div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">' +
      '  <!-- Demo mode banner -->' +
      '  <div class="bg-amber-50 border-b border-amber-200/80 px-4 py-1.5 text-center text-xs font-medium text-amber-900 flex items-center justify-center gap-2">' +
      '    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#F59F00] shrink-0"></i>' +
      '    <span>Demo mode: all data is sample data.</span>' +
      '  </div>' +
      '  <div class="flex-1 flex min-h-0 relative">' +
      '    <!-- Mobile Sidebar Backdrop -->' +
      '    <div id="orbit-sidebar-backdrop" class="fixed inset-0 z-30 bg-slate-900/40 hidden md:hidden"></div>' +
      '    <!-- Sidebar -->' +
      '    <aside id="orbit-sidebar" class="fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-out shrink-0">' +
      '      <div class="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">' +
      '        <a href="dashboard.html" class="flex items-center gap-2.5 whitespace-nowrap shrink-0">' +
      '          ' + getLogoSvg(28) +
      '          <span class="text-lg font-bold tracking-tight text-slate-900">Orbit</span>' +
      '        </a>' +
      '        <button type="button" id="orbit-sidebar-close" class="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close navigation">' +
      '          <i data-lucide="x" class="w-5 h-5"></i>' +
      '        </button>' +
      '      </div>' +
      '      <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/60">' +
      '        <p class="text-xs font-semibold text-slate-900 truncate">' + escapeHtml(state.organization.name) + '</p>' +
      '        <p class="text-xs text-slate-500 mt-0.5">Period ' + escapeHtml(state.organization.period) + '</p>' +
      '      </div>' +
      '      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">' +
      '        ' + navHtml +
      '        <div class="pt-5 mt-5 border-t border-slate-100">' +
      '          <p class="px-3 text-xs font-semibold text-slate-400 tracking-wide">Plus Modules</p>' +
      '          <p class="px-3 mt-2 text-xs text-slate-400">No extra modules enabled yet.</p>' +
      '        </div>' +
      '      </nav>' +
      '      <div class="p-3 border-t border-slate-200 space-y-1 bg-white shrink-0">' +
      '        <a href="packages.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ' + packagesCls + '">' +
      '          <i data-lucide="layers" class="w-4 h-4 shrink-0"></i>' +
      '          <span>Packages</span>' +
      '        </a>' +
      '        <button type="button" id="orbit-logout-btn" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap text-left">' +
      '          <i data-lucide="log-out" class="w-4 h-4 shrink-0"></i>' +
      '          <span>Logout</span>' +
      '        </button>' +
      '        <div class="px-3 pt-2 pb-1 text-xs text-slate-400">' +
      '          Orbit by Niph Code' +
      '        </div>' +
      '      </div>' +
      '    </aside>' +
      '    <!-- Main Content Column -->' +
      '    <div class="flex-1 flex flex-col min-w-0">' +
      '      <!-- Top Bar -->' +
      '      <header class="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">' +
      '        <div class="flex items-center gap-3 min-w-0">' +
      '          <button type="button" id="orbit-menu-btn" class="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB]" aria-label="Open navigation menu">' +
      '            <i data-lucide="menu" class="w-5 h-5"></i>' +
      '          </button>' +
      '          <h1 class="text-lg sm:text-xl font-bold text-slate-900 truncate">' + escapeHtml(pageTitle) + '</h1>' +
      '        </div>' +
      '        <div class="flex items-center gap-2 sm:gap-3 shrink-0">' +
      '          <div class="flex items-center gap-2">' +
      '            <label for="orbit-role-select" class="hidden lg:inline text-xs font-medium text-slate-500 whitespace-nowrap">Viewing as</label>' +
      '            <select id="orbit-role-select" aria-label="Viewing as role" class="h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:border-[#3B5BDB] cursor-pointer">' +
      '              <option value="Secretary">Secretary</option>' +
      '              <option value="Treasurer">Treasurer</option>' +
      '              <option value="Member">Member</option>' +
      '            </select>' +
      '          </div>' +
      '          <button type="button" id="orbit-reset-btn" class="h-9 px-2.5 sm:px-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0" title="Reset demo data to defaults">' +
      '            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 shrink-0"></i>' +
      '            <span class="hidden sm:inline">Reset demo data</span>' +
      '          </button>' +
      '          <div class="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200 shrink-0">' +
      '            <div id="orbit-user-avatar" class="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ' + getAvatarToneClass(user.role) + '">' + escapeHtml(user.initials) + '</div>' +
      '            <div class="hidden md:flex flex-col leading-tight">' +
      '              <span id="orbit-user-name" class="text-sm font-semibold text-slate-900 whitespace-nowrap">' + escapeHtml(user.name) + '</span>' +
      '              <span id="orbit-user-role" class="text-xs text-slate-500 whitespace-nowrap">' + escapeHtml(user.role) + '</span>' +
      '            </div>' +
      '          </div>' +
      '        </div>' +
      '      </header>' +
      '      <!-- Main Viewport -->' +
      '      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">' +
      '        <div id="page-content">' + pageInnerHtml + '</div>' +
      '      </main>' +
      '      <!-- Footer -->' +
      '      <footer class="border-t border-slate-200 bg-white px-4 sm:px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">' +
      '        <span>Orbit by Niph Code</span>' +
      '        <span>' + escapeHtml(state.organization.name) + ' · Period ' + escapeHtml(state.organization.period) + '</span>' +
      '      </footer>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div id="orbit-modal-root"></div>' +
      '<div id="orbit-toast-root" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"></div>';

    var roleSelect = document.getElementById('orbit-role-select');
    if (roleSelect) {
      roleSelect.value = user.role;
      roleSelect.addEventListener('change', function (e) {
        switchRole(e.target.value);
      });
    }

    var resetBtn = document.getElementById('orbit-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetDemoData);
    }

    var logoutBtn = document.getElementById('orbit-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    var menuBtn = document.getElementById('orbit-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        toggleMobileSidebar(true);
      });
    }

    var closeSidebarBtn = document.getElementById('orbit-sidebar-close');
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', function () {
        toggleMobileSidebar(false);
      });
    }

    var sidebarBackdrop = document.getElementById('orbit-sidebar-backdrop');
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', function () {
        toggleMobileSidebar(false);
      });
    }

    refreshIcons();
    return true;
  }

  window.OrbitApp = {
    loadState: loadState,
    saveState: saveState,
    getState: getState,
    requireAuth: requireAuth,
    selectRoleAndEnter: selectRoleAndEnter,
    switchRole: switchRole,
    resetDemoData: resetDemoData,
    logout: logout,
    getCurrentUser: getCurrentUser,
    canEdit: canEdit,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    formatNowDateTime: formatNowDateTime,
    addHistory: addHistory,
    getFinanceSummary: getFinanceSummary,
    getMonthlyFinanceSeries: getMonthlyFinanceSeries,
    escapeHtml: escapeHtml,
    getLogoSvg: getLogoSvg,
    renderLayout: renderLayout,
    openModal: openModal,
    closeModal: closeModal,
    showToast: showToast,
    refreshIcons: refreshIcons
  };
})();
