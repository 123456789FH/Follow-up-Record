(() => {
  'use strict';

  const APP_KEY = 'math_compass_tracker_state_v1';
  const DB_NAME = 'math_compass_media_v1';
  const DB_VERSION = 1;
  const MEDIA_STORE = 'media';

  const LEVELS = {
    1: { name: 'أبدأ', emoji: '🌱', short: 'دعم', description: 'بحاجة إلى دعم' },
    2: { name: 'أتقدم', emoji: '🌿', short: 'تقدّم', description: 'تتعلم بمساندة' },
    3: { name: 'أتقن', emoji: '⭐', short: 'إتقان', description: 'أداء مستقل' },
    4: { name: 'أمتد', emoji: '💎', short: 'إثراء', description: 'تعميم وإبداع' }
  };

  const LEARNING_MODES = [
    { id: 'visual', icon: '👁️', label: 'بصري: مخطط أو نموذج' },
    { id: 'hands_on', icon: '✋', label: 'محسوس وحركي' },
    { id: 'oral', icon: '🗣️', label: 'شفهي وسمعي' },
    { id: 'written', icon: '✍️', label: 'كتابي ورمزي' },
    { id: 'digital', icon: '💻', label: 'رقمي وتفاعلي' },
    { id: 'cooperative', icon: '🤝', label: 'تعاوني' }
  ];

  const ERROR_CODES = [
    { id: 'S', code: 'س', label: 'فهم السؤال', action: 'إعادة صياغة السؤال، وتحديد المطلوب والكلمات المفتاحية قبل البدء.' },
    { id: 'M', code: 'م', label: 'المفهوم الرياضي', action: 'إعادة بناء المفهوم باستخدام محسوسات ونموذج بصري وربطه بموقف حياتي.' },
    { id: 'KH', code: 'خ', label: 'اختيار خطة الحل', action: 'استخدام بطاقة خطوات: أفهم، أخطط، أحل، أتحقق؛ مع مقارنة أكثر من استراتيجية.' },
    { id: 'H', code: 'ح', label: 'خطأ حسابي', action: 'تدريب قصير على الدقة مع التحقق العكسي ومراجعة العملية الأساسية.' },
    { id: 'R', code: 'ر', label: 'قراءة بيانات', action: 'تدريب موجه على قراءة الجدول أو الرسم وتحديد العنوان والوحدات والبيانات.' },
    { id: 'T', code: 'ت', label: 'التفسير والتبرير', action: 'طلب تفسير شفهي أو كتابي: كيف عرفتِ؟ ولماذا كانت الإجابة منطقية؟' },
    { id: 'N', code: 'ن', label: 'تنظيم الخطوات', action: 'استخدام منظم بصري أو مربعات مرتبة لكتابة الخطوات والتحقق من كل خطوة.' },
    { id: 'D', code: 'د', label: 'تثبيت وتدريب', action: 'تطبيق تدريب موزع قصير في بداية الحصص القادمة بدل التكرار المكثف في حصة واحدة.' }
  ];

  const DEFAULT_SKILLS = [
    { domain: 'الأعداد والقيمة المنزلية', name: 'قراءة الأعداد وكتابتها', description: 'تقرأ الطالبة العدد وتمثله وتكتبه بصيغ متعددة.' },
    { domain: 'الأعداد والقيمة المنزلية', name: 'القيمة المنزلية', description: 'تحدد قيمة الرقم بحسب منزلته وتمثل العدد.' },
    { domain: 'الأعداد والقيمة المنزلية', name: 'مقارنة الأعداد وترتيبها', description: 'تقارن الأعداد وتستخدم الرموز وترتبها.' },
    { domain: 'الجمع والطرح', name: 'الجمع', description: 'تختار استراتيجية مناسبة وتتحقق من معقولية الناتج.' },
    { domain: 'الجمع والطرح', name: 'الطرح', description: 'تطرح بدقة وتربط الطرح بالجمع عند التحقق.' },
    { domain: 'الضرب والقسمة', name: 'الضرب', description: 'تمثل الضرب وتستعمل الحقائق الأساسية.' },
    { domain: 'الضرب والقسمة', name: 'القسمة', description: 'تمثل القسمة وتربطها بالضرب.' },
    { domain: 'حل المسألة', name: 'حل المسألة اللفظية', description: 'تفهم المطلوب وتختار الخطة وتفسر الإجابة.' },
    { domain: 'القياس', name: 'الطول والكتلة والسعة', description: 'تختار الوحدة المناسبة وتقيس وتقارن.' },
    { domain: 'القياس', name: 'الزمن والنقود', description: 'تقرأ الوقت وتتعامل مع القيم النقدية في مواقف حياتية.' },
    { domain: 'الهندسة', name: 'الأشكال الهندسية', description: 'تصف الأشكال والمجسمات وتصنفها حسب خصائصها.' },
    { domain: 'البيانات', name: 'قراءة البيانات وتمثيلها', description: 'تقرأ الجداول والرسوم وتستنتج منها.' },
    { domain: 'الكسور', name: 'الكسور', description: 'تمثل الكسور وتقارنها في نماذج بسيطة.' }
  ];

  const DEFAULT_STATE = {
    version: 1,
    settings: {
      teacher: '',
      school: '',
      grade: '',
      className: '',
      semester: '',
      subject: 'الرياضيات',
      reportTitle: 'سجل المتابعة اليومية لمادة الرياضيات'
    },
    students: [],
    skills: DEFAULT_SKILLS.map((skill, index) => ({
      id: `skill-default-${index + 1}`,
      ...skill,
      createdAt: new Date().toISOString()
    })),
    entries: []
  };

  let state = loadState();
  let currentView = 'dashboard';
  let deferredInstallPrompt = null;
  let mediaRecorder = null;
  let recordingStream = null;
  let recordingChunks = [];
  let recordingTimer = null;
  let recordingStartedAt = 0;
  let pendingAudio = null;
  let discardRecordingAfterStop = false;
  let pendingImages = [];
  let objectUrls = new Set();
  let toastTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    normalizeState();
    buildChoiceControls();
    bindStaticEvents();
    setDefaultDates();
    renderAll();
    registerServiceWorker();
    setupInstallPrompt();
  }

  function normalizeState() {
    if (!state || typeof state !== 'object') state = structuredCloneSafe(DEFAULT_STATE);
    state.settings = { ...DEFAULT_STATE.settings, ...(state.settings || {}) };
    state.students = Array.isArray(state.students) ? state.students : [];
    state.skills = Array.isArray(state.skills) && state.skills.length ? state.skills : structuredCloneSafe(DEFAULT_STATE.skills);
    state.entries = Array.isArray(state.entries) ? state.entries : [];
    saveState();
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(APP_KEY);
      if (!raw) return structuredCloneSafe(DEFAULT_STATE);
      return JSON.parse(raw);
    } catch (error) {
      console.error('تعذر تحميل البيانات:', error);
      return structuredCloneSafe(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(APP_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('تعذر حفظ البيانات:', error);
      showToast('تعذر الحفظ؛ قد تكون مساحة التخزين ممتلئة. صدّري نسخة احتياطية.', 'error');
    }
  }

  function structuredCloneSafe(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function uid(prefix = 'id') {
    if (window.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function todayISO() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function setDefaultDates() {
    const today = todayISO();
    const dailyDate = $('#dailyDate');
    const dashboardDate = $('#dashboardDateFilter');
    const entryDate = $('#entryDate');
    if (dailyDate && !dailyDate.value) dailyDate.value = today;
    if (dashboardDate && !dashboardDate.value) dashboardDate.value = today;
    if (entryDate && !entryDate.value) entryDate.value = today;
  }

  function formatDate(dateString) {
    if (!dateString) return '—';
    try {
      const date = new Date(`${dateString}T12:00:00`);
      return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(date);
    } catch {
      return toArabicDigits(dateString);
    }
  }

  function formatDateTime(dateString) {
    if (!dateString) return '—';
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  }

  function toArabicDigits(value) {
    return String(value ?? '').replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ar');
  }

  function bindStaticEvents() {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('change', handleDocumentChange);
    document.addEventListener('input', handleDocumentInput);

    $('#mobileMenuButton')?.addEventListener('click', () => $('#sidebar')?.classList.toggle('open'));

    $('#settingsForm')?.addEventListener('submit', event => {
      event.preventDefault();
      saveSettings();
    });

    $('#saveStudentButton')?.addEventListener('click', saveStudentFromDialog);
    $('#saveBulkStudentsButton')?.addEventListener('click', saveBulkStudents);
    $('#saveSkillButton')?.addEventListener('click', saveSkillFromDialog);
    $('#saveBulkSkillsButton')?.addEventListener('click', saveBulkSkills);
    $('#saveQuickEntriesButton')?.addEventListener('click', saveQuickEntries);
    $('#saveEntryButton')?.addEventListener('click', saveDetailedEntry);
    $('#regenerateSuggestionButton')?.addEventListener('click', () => {
      $('#entryAction').value = generateSuggestion(collectEntryFormData(false));
    });

    $('#studentSearch')?.addEventListener('input', renderStudents);
    $('#dashboardSkillFilter')?.addEventListener('change', renderDashboard);
    $('#dashboardDateFilter')?.addEventListener('change', renderDashboard);
    $('#dailyDate')?.addEventListener('change', renderDaily);
    $('#dailySkill')?.addEventListener('change', renderDaily);
    $('#dailyAssessmentTool')?.addEventListener('change', renderDaily);

    $('#entryImageInput')?.addEventListener('change', handleImageSelection);
    $('#startRecordingButton')?.addEventListener('click', startRecording);
    $('#stopRecordingButton')?.addEventListener('click', stopRecording);
    $('#discardRecordingButton')?.addEventListener('click', discardPendingRecording);

    $('#backupFileInput')?.addEventListener('change', importBackupFromFile);

    $('#entryAbsent')?.addEventListener('change', updateEntryFormForAbsence);

    $('#studentCardDialog')?.addEventListener('close', revokeObjectUrls);
    $('#entryDialog')?.addEventListener('close', () => {
      stopRecording(true);
      clearPendingMedia();
      revokeObjectUrls();
    });

    window.addEventListener('afterprint', () => {
      const printArea = $('#printArea');
      if (printArea) printArea.innerHTML = '';
    });
  }

  function handleDocumentClick(event) {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) {
      navigate(viewButton.dataset.view);
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    switch (action) {
      case 'open-quick-entry': navigate('daily'); break;
      case 'add-student': openStudentDialog(); break;
      case 'bulk-add-students': openDialog('bulkStudentsDialog'); break;
      case 'edit-student': openStudentDialog(actionButton.dataset.studentId); break;
      case 'delete-student': deleteStudent(actionButton.dataset.studentId); break;
      case 'open-student': openStudentCard(actionButton.dataset.studentId); break;
      case 'close-student-card': $('#studentCardDialog')?.close(); break;
      case 'add-entry-for-student': openEntryDialog({ studentId: actionButton.dataset.studentId }); break;
      case 'edit-entry': openEntryDialog({ entryId: actionButton.dataset.entryId }); break;
      case 'delete-entry': deleteEntry(actionButton.dataset.entryId); break;
      case 'add-skill': openSkillDialog(); break;
      case 'bulk-add-skills': openDialog('bulkSkillsDialog'); break;
      case 'edit-skill': openSkillDialog(actionButton.dataset.skillId); break;
      case 'delete-skill': deleteSkill(actionButton.dataset.skillId); break;
      case 'apply-quick-level': applyLevelToUnrated(Number(actionButton.dataset.level)); break;
      case 'apply-quick-absent': applyAbsentToUnrated(); break;
      case 'open-entry-cell': openEntryDialog({
        studentId: actionButton.dataset.studentId,
        skillId: actionButton.dataset.skillId,
        date: $('#dashboardDateFilter')?.value || todayISO()
      }); break;
      case 'quick-details': openQuickDetails(actionButton.dataset.studentId); break;
      case 'print-dashboard': printDashboard(); break;
      case 'print-daily-sheet': printDailySheet(); break;
      case 'print-support-report': printSupportReport(); break;
      case 'print-enrichment-report': printEnrichmentReport(); break;
      case 'print-selected-student': {
        const studentId = $('#reportStudentSelect')?.value;
        if (studentId) printStudentCard(studentId); else showToast('اختاري طالبة أولًا.', 'warning');
        break;
      }
      case 'print-student': printStudentCard(actionButton.dataset.studentId); break;
      case 'export-csv': exportCSV(); break;
      case 'export-backup': exportBackup(); break;
      case 'import-backup': $('#backupFileInput')?.click(); break;
      case 'reset-app': resetApp(); break;
      case 'remove-pending-image': removePendingImage(Number(actionButton.dataset.index)); break;
      case 'remove-media': removeExistingMedia(actionButton.dataset.entryId, actionButton.dataset.mediaId); break;
      default: break;
    }
  }

  function handleDocumentChange(event) {
    const target = event.target;

    if (target.matches('#entryPreLevelChoices input, #entryPostLevelChoices input, #learningModesChoices input, #errorCodesChoices input')) {
      refreshChoiceSelections();
      $('#entryAction').value = generateSuggestion(collectEntryFormData(false));
      return;
    }

    if (target.matches('#entryConfidence, #entryIndependence')) {
      $('#entryAction').value = generateSuggestion(collectEntryFormData(false));
      return;
    }

    if (target.closest('#quickEntryContainer') && target.dataset.field) {
      syncQuickField(target);
      updateQuickSuggestionForStudent(target.closest('[data-quick-student]')?.dataset.quickStudent);
      updateDailyProgress();
    }
  }

  function handleDocumentInput(event) {
    const target = event.target;
    if (target.closest('#quickEntryContainer') && target.dataset.field) {
      syncQuickField(target);
    }
  }

  function navigate(view) {
    if (!view || !document.querySelector(`[data-view-section="${CSS.escape(view)}"]`)) return;
    currentView = view;
    $$('.app-view').forEach(section => section.classList.toggle('active', section.dataset.viewSection === view));
    $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    $('#sidebar')?.classList.remove('open');

    if (view === 'dashboard') renderDashboard();
    if (view === 'daily') renderDaily();
    if (view === 'students') renderStudents();
    if (view === 'skills') renderSkills();
    if (view === 'reports') renderReports();
    if (view === 'settings') renderSettings();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderAll() {
    renderContext();
    renderSkillOptions();
    renderDashboard();
    renderDaily();
    renderStudents();
    renderSkills();
    renderReports();
    renderSettings();
  }

  function renderContext() {
    const classParts = [state.settings.grade, state.settings.className].filter(Boolean);
    $('#contextClassName').textContent = classParts.length ? classParts.join(' — ') : 'الفصل غير محدد';
    $('#contextTeacherName').textContent = state.settings.teacher || 'أضيفي بياناتك من الإعدادات';
    $('#sidebarFooter').textContent = state.settings.teacher || 'بوصلة الرياضيات';
  }

  function renderSkillOptions() {
    const optionHTML = state.skills.map(skill => `<option value="${escapeHTML(skill.id)}">${escapeHTML(skill.domain ? `${skill.domain} — ${skill.name}` : skill.name)}</option>`).join('');

    const dailySkill = $('#dailySkill');
    const previousDaily = dailySkill?.value;
    if (dailySkill) {
      dailySkill.innerHTML = optionHTML || '<option value="">لا توجد مهارات</option>';
      if (state.skills.some(skill => skill.id === previousDaily)) dailySkill.value = previousDaily;
    }

    const entrySkill = $('#entrySkill');
    const previousEntry = entrySkill?.value;
    if (entrySkill) {
      entrySkill.innerHTML = optionHTML || '<option value="">لا توجد مهارات</option>';
      if (state.skills.some(skill => skill.id === previousEntry)) entrySkill.value = previousEntry;
    }

    const dashboardFilter = $('#dashboardSkillFilter');
    const previousFilter = dashboardFilter?.value || 'all';
    if (dashboardFilter) {
      dashboardFilter.innerHTML = '<option value="all">جميع المهارات</option>' + state.skills.map(skill => `<option value="${escapeHTML(skill.id)}">${escapeHTML(skill.name)}</option>`).join('');
      dashboardFilter.value = state.skills.some(skill => skill.id === previousFilter) ? previousFilter : 'all';
    }
  }

  function renderDashboard() {
    const setupBanner = $('#setupBanner');
    if (setupBanner) setupBanner.hidden = state.students.length > 0;

    const maxDate = $('#dashboardDateFilter')?.value || todayISO();
    const skillFilter = $('#dashboardSkillFilter')?.value || 'all';
    const visibleSkills = skillFilter === 'all' ? state.skills : state.skills.filter(skill => skill.id === skillFilter);
    const matrix = buildLatestMatrix(maxDate, visibleSkills);
    const ratedItems = matrix.flatMap(row => row.cells).filter(cell => cell.entry && !cell.entry.absent);
    const masteryCount = ratedItems.filter(cell => Number(cell.entry.postLevel) >= 3).length;
    const masteryRate = ratedItems.length ? Math.round((masteryCount / ratedItems.length) * 100) : 0;
    const todayEntries = state.entries.filter(entry => entry.date === todayISO() && !entry.absent).length;
    const supportStudents = calculateStudentSummaries(maxDate).filter(item => item.ratedCount && item.average < 2.5).length;

    $('#dashboardStats').innerHTML = [
      statCard('◉', toArabicDigits(state.students.length), 'عدد الطالبات', 'rgba(15,118,110,0.11)'),
      statCard('✓', toArabicDigits(todayEntries), 'عمليات الرصد اليوم', 'rgba(201,154,46,0.14)'),
      statCard('⭐', `${toArabicDigits(masteryRate)}٪`, 'نسبة الإتقان فأعلى', 'rgba(45,157,104,0.12)'),
      statCard('🌱', toArabicDigits(supportStudents), 'أولوية دعم حالية', 'rgba(233,107,132,0.12)')
    ].join('');

    renderHeatmap(matrix, visibleSkills);
    renderDistribution(ratedItems);
    renderFlexibleGroups(maxDate, skillFilter);
    renderPriorityLists(maxDate);
  }

  function statCard(icon, value, label, accent) {
    return `
      <article class="stat-card" style="--stat-accent:${accent}">
        <div class="stat-top"><span>${escapeHTML(label)}</span><div class="stat-icon">${icon}</div></div>
        <strong>${value}</strong>
      </article>`;
  }

  function buildLatestMatrix(maxDate, skills = state.skills) {
    return state.students.map(student => ({
      student,
      cells: skills.map(skill => ({
        skill,
        entry: getLatestEntry(student.id, skill.id, maxDate, false)
      }))
    }));
  }

  function getLatestEntry(studentId, skillId, maxDate = todayISO(), includeAbsent = false) {
    return state.entries
      .filter(entry => entry.studentId === studentId && entry.skillId === skillId && entry.date <= maxDate && (includeAbsent || !entry.absent))
      .sort((a, b) => {
        const dateCompare = String(b.date).localeCompare(String(a.date));
        if (dateCompare !== 0) return dateCompare;
        return String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''));
      })[0] || null;
  }

  function getEntryForDate(studentId, skillId, date) {
    return state.entries
      .filter(entry => entry.studentId === studentId && entry.skillId === skillId && entry.date === date)
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0] || null;
  }

  function renderHeatmap(matrix, skills) {
    const container = $('#heatmapContainer');
    if (!container) return;

    if (!state.students.length) {
      container.innerHTML = emptyState('لا توجد طالبات بعد', 'أضيفي قائمة الطالبات لتظهر خريطة التقدم.');
      return;
    }

    if (!skills.length) {
      container.innerHTML = emptyState('لا توجد مهارات', 'أضيفي مهارة واحدة على الأقل من صفحة المهارات.');
      return;
    }

    const headerCells = skills.map(skill => `<th title="${escapeHTML(skill.domain || '')}">${escapeHTML(skill.name)}</th>`).join('');
    const rows = matrix.map(row => {
      const cells = row.cells.map(({ skill, entry }) => {
        if (!entry) {
          return `<td><button class="level-cell level-0" data-action="open-entry-cell" data-student-id="${escapeHTML(row.student.id)}" data-skill-id="${escapeHTML(skill.id)}" type="button"><span>＋</span><small>لم تُرصد</small></button></td>`;
        }
        const level = LEVELS[entry.postLevel] || LEVELS[1];
        return `<td><button class="level-cell level-${entry.postLevel}" data-action="open-entry-cell" data-student-id="${escapeHTML(row.student.id)}" data-skill-id="${escapeHTML(skill.id)}" type="button" title="آخر رصد: ${escapeHTML(formatDate(entry.date))}"><span>${level.emoji} ${level.name}</span><small>${escapeHTML(formatDate(entry.date))}</small></button></td>`;
      }).join('');
      return `<tr><td class="student-name-cell">${escapeHTML(row.student.name)}</td>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      <table class="heatmap-table">
        <thead><tr><th class="student-name-cell">الطالبة</th>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderDistribution(ratedItems) {
    const container = $('#levelDistribution');
    if (!container) return;
    const total = ratedItems.length;
    if (!total) {
      container.innerHTML = emptyState('لا توجد بيانات كافية', 'ابدئي أول رصد ليظهر توزيع المستويات.');
      return;
    }

    container.innerHTML = [1, 2, 3, 4].map(level => {
      const count = ratedItems.filter(item => Number(item.entry.postLevel) === level).length;
      const percentage = Math.round((count / total) * 100);
      return `
        <div class="distribution-row">
          <div class="distribution-label">${LEVELS[level].emoji} ${LEVELS[level].name}</div>
          <div class="distribution-track"><div class="distribution-fill level-${level}" style="width:${percentage}%"></div></div>
          <div class="distribution-count">${toArabicDigits(count)}</div>
        </div>`;
    }).join('');
  }

  function renderFlexibleGroups(maxDate, skillFilter) {
    const container = $('#flexibleGroups');
    if (!container) return;

    const studentLevels = state.students.map(student => {
      if (skillFilter !== 'all') {
        const entry = getLatestEntry(student.id, skillFilter, maxDate, false);
        return { student, level: entry ? Number(entry.postLevel) : 0 };
      }
      const entries = state.skills.map(skill => getLatestEntry(student.id, skill.id, maxDate, false)).filter(Boolean);
      const average = entries.length ? entries.reduce((sum, entry) => sum + Number(entry.postLevel || 0), 0) / entries.length : 0;
      return { student, level: average ? Math.max(1, Math.min(4, Math.round(average))) : 0 };
    });

    const groups = [1, 2, 3, 4].map(level => ({
      level,
      students: studentLevels.filter(item => item.level === level).map(item => item.student.name)
    })).filter(group => group.students.length);

    if (!groups.length) {
      container.innerHTML = emptyState('لم تتكوّن المجموعات بعد', 'أضيفي رصدًا للطالبات لتظهر المجموعات المرنة.');
      return;
    }

    const actionText = {
      1: 'بناء المفهوم بالمحسوسات وتوجيه مباشر.',
      2: 'تدريب موجه متدرج مع تغذية راجعة.',
      3: 'تطبيق مستقل وسؤال تثبيت.',
      4: 'تحدٍ مفتوح وتفسير أو حل بأكثر من طريقة.'
    };

    container.innerHTML = groups.map(group => `
      <div class="group-card level-${group.level}">
        <span class="group-badge">${LEVELS[group.level].emoji} ${LEVELS[group.level].name}</span>
        <div>
          <strong>${escapeHTML(group.students.slice(0, 4).join('، '))}${group.students.length > 4 ? ` +${toArabicDigits(group.students.length - 4)}` : ''}</strong>
          <span>${escapeHTML(actionText[group.level])}</span>
        </div>
      </div>`).join('');
  }

  function calculateStudentSummaries(maxDate = todayISO()) {
    return state.students.map(student => {
      const latestEntries = state.skills.map(skill => getLatestEntry(student.id, skill.id, maxDate, false)).filter(Boolean);
      const levels = latestEntries.map(entry => Number(entry.postLevel)).filter(Boolean);
      const average = levels.length ? levels.reduce((sum, value) => sum + value, 0) / levels.length : 0;
      const supportCount = levels.filter(level => level <= 2).length;
      const enrichmentCount = levels.filter(level => level === 4).length;
      return { student, average, ratedCount: levels.length, supportCount, enrichmentCount, latestEntries };
    });
  }

  function renderPriorityLists(maxDate) {
    const summaries = calculateStudentSummaries(maxDate);
    const support = summaries
      .filter(item => item.ratedCount && (item.average < 3 || item.supportCount > 0))
      .sort((a, b) => a.average - b.average || b.supportCount - a.supportCount)
      .slice(0, 6);
    const enrichment = summaries
      .filter(item => item.ratedCount && (item.average >= 3.3 || item.enrichmentCount > 0))
      .sort((a, b) => b.average - a.average || b.enrichmentCount - a.enrichmentCount)
      .slice(0, 6);

    const supportContainer = $('#supportPriorities');
    const enrichmentContainer = $('#enrichmentOpportunities');

    supportContainer.innerHTML = support.length ? support.map(item => personRow(item, 'support')).join('') : emptyState('لا توجد أولويات واضحة', 'ستظهر هنا بعد توفر رصد كافٍ.');
    enrichmentContainer.innerHTML = enrichment.length ? enrichment.map(item => personRow(item, 'enrichment')).join('') : emptyState('لا توجد فرص إثراء محددة', 'ستظهر الطالبات الجاهزات بعد الرصد.');
  }

  function personRow(item, type) {
    const score = item.average ? item.average.toFixed(1) : '0';
    const detail = type === 'support'
      ? `${toArabicDigits(item.supportCount)} مهارة بحاجة إلى متابعة`
      : `${toArabicDigits(item.enrichmentCount)} مهارة في مستوى الامتداد`;
    return `
      <button class="person-row" data-action="open-student" data-student-id="${escapeHTML(item.student.id)}" type="button">
        <div><strong>${escapeHTML(item.student.name)}</strong><span>${detail}</span></div>
        <span class="person-score ${type}">${toArabicDigits(score)}</span>
      </button>`;
  }

  function renderDaily() {
    const container = $('#quickEntryContainer');
    if (!container) return;
    const date = $('#dailyDate')?.value || todayISO();
    const skillId = $('#dailySkill')?.value || state.skills[0]?.id || '';

    if (!state.students.length) {
      container.innerHTML = emptyState('لم تُضاف الطالبات', 'أضيفي قائمة الطالبات أولًا من صفحة بطاقات الطالبات.');
      updateDailyProgress();
      return;
    }
    if (!skillId) {
      container.innerHTML = emptyState('لا توجد مهارة للرصد', 'أضيفي مهارة من صفحة المهارات.');
      updateDailyProgress();
      return;
    }

    const desktopRows = state.students.map(student => renderQuickDesktopRow(student, getEntryForDate(student.id, skillId, date))).join('');
    const mobileCards = state.students.map(student => renderQuickMobileCard(student, getEntryForDate(student.id, skillId, date))).join('');

    container.innerHTML = `
      <div class="quick-entry-desktop table-scroll">
        <table class="quick-entry-table">
          <thead>
            <tr>
              <th>الطالبة</th>
              <th>قبلي</th>
              <th>المستوى بعد التعلم</th>
              <th>الطريقة المساعدة</th>
              <th>بصمة الخطأ</th>
              <th>الإجراء المقترح</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${desktopRows}</tbody>
        </table>
      </div>
      <div class="quick-entry-card-list">${mobileCards}</div>`;

    updateDailyProgress();
  }

  function renderQuickDesktopRow(student, entry) {
    const values = quickValuesFromEntry(entry);
    return `
      <tr class="quick-record" data-quick-student="${escapeHTML(student.id)}" data-level="${values.level}" data-absent="${values.absent}">
        <td class="student-name">${escapeHTML(student.name)}</td>
        <td>${renderQuickPreSelect(values.preLevel)}</td>
        <td>${renderQuickLevelButtons(values.level, values.absent)}</td>
        <td>${renderQuickModeSelect(values.mode)}</td>
        <td>${renderQuickErrorSelect(values.error)}</td>
        <td><div class="quick-suggestion" data-quick-suggestion>${escapeHTML(values.suggestion)}</div></td>
        <td><button class="table-action" data-action="quick-details" data-student-id="${escapeHTML(student.id)}" type="button">تفاصيل</button></td>
      </tr>`;
  }

  function renderQuickMobileCard(student, entry) {
    const values = quickValuesFromEntry(entry);
    return `
      <article class="quick-student-card" data-quick-student="${escapeHTML(student.id)}" data-level="${values.level}" data-absent="${values.absent}">
        <div class="quick-student-card-header">
          <strong>${escapeHTML(student.name)}</strong>
          <button class="table-action" data-action="quick-details" data-student-id="${escapeHTML(student.id)}" type="button">تفاصيل ومرفقات</button>
        </div>
        ${renderQuickLevelButtons(values.level, values.absent)}
        <div class="quick-card-fields">
          <label><span>المستوى القبلي</span>${renderQuickPreSelect(values.preLevel)}</label>
          <label><span>الطريقة المساعدة</span>${renderQuickModeSelect(values.mode)}</label>
          <label><span>بصمة الخطأ</span>${renderQuickErrorSelect(values.error)}</label>
        </div>
        <div class="quick-suggestion" data-quick-suggestion>${escapeHTML(values.suggestion)}</div>
      </article>`;
  }

  function quickValuesFromEntry(entry) {
    const mode = entry?.learningModes?.[0] || '';
    const error = entry?.errorCodes?.[0] || '';
    return {
      preLevel: entry?.preLevel || '',
      level: entry?.postLevel || '',
      absent: entry?.absent ? 'true' : 'false',
      mode,
      error,
      suggestion: entry?.action || (entry?.postLevel ? generateSuggestion(entry) : 'اختاري المستوى ليظهر الإجراء التالي.')
    };
  }

  function renderQuickPreSelect(value) {
    return `<select data-field="preLevel" aria-label="المستوى القبلي">
      <option value="">—</option>
      ${[1,2,3,4].map(level => `<option value="${level}" ${Number(value) === level ? 'selected' : ''}>${LEVELS[level].emoji} ${LEVELS[level].name}</option>`).join('')}
    </select>`;
  }

  function renderQuickModeSelect(value) {
    return `<select data-field="mode" aria-label="الطريقة المساعدة">
      <option value="">—</option>
      ${LEARNING_MODES.map(mode => `<option value="${mode.id}" ${value === mode.id ? 'selected' : ''}>${mode.icon} ${escapeHTML(mode.label)}</option>`).join('')}
    </select>`;
  }

  function renderQuickErrorSelect(value) {
    return `<select data-field="error" aria-label="بصمة الخطأ">
      <option value="">لا يوجد / غير محدد</option>
      ${ERROR_CODES.map(error => `<option value="${error.id}" ${value === error.id ? 'selected' : ''}>${error.code} — ${escapeHTML(error.label)}</option>`).join('')}
    </select>`;
  }

  function renderQuickLevelButtons(level, absent) {
    return `<div class="quick-levels">
      ${[1,2,3,4].map(item => `<button class="quick-level-button ${Number(level) === item && absent !== 'true' ? 'selected' : ''}" data-quick-level="${item}" data-level="${item}" type="button" title="${LEVELS[item].description}">${LEVELS[item].emoji}<br>${LEVELS[item].name}</button>`).join('')}
      <button class="quick-level-button absent ${absent === 'true' ? 'selected' : ''}" data-quick-absent type="button">غ<br>غائبة</button>
    </div>`;
  }

  function syncQuickField(target) {
    const wrapper = target.closest('[data-quick-student]');
    const studentId = wrapper?.dataset.quickStudent;
    const field = target.dataset.field;
    if (!studentId || !field) return;
    $$(`[data-quick-student="${CSS.escape(studentId)}"] [data-field="${CSS.escape(field)}"]`).forEach(element => {
      if (element !== target) element.value = target.value;
    });
  }

  function handleQuickLevelClick(button) {
    const wrapper = button.closest('[data-quick-student]');
    const studentId = wrapper?.dataset.quickStudent;
    if (!studentId) return;
    updateQuickState(studentId, { level: Number(button.dataset.quickLevel), absent: false });
  }

  function handleQuickAbsentClick(button) {
    const wrapper = button.closest('[data-quick-student]');
    const studentId = wrapper?.dataset.quickStudent;
    if (!studentId) return;
    updateQuickState(studentId, { level: '', absent: true });
  }

  document.addEventListener('click', event => {
    const levelButton = event.target.closest('[data-quick-level]');
    if (levelButton) {
      handleQuickLevelClick(levelButton);
      return;
    }
    const absentButton = event.target.closest('[data-quick-absent]');
    if (absentButton) handleQuickAbsentClick(absentButton);
  });

  function updateQuickState(studentId, { level, absent }) {
    $$(`[data-quick-student="${CSS.escape(studentId)}"]`).forEach(wrapper => {
      wrapper.dataset.level = level || '';
      wrapper.dataset.absent = absent ? 'true' : 'false';
      $$('[data-quick-level]', wrapper).forEach(button => button.classList.toggle('selected', !absent && Number(button.dataset.quickLevel) === Number(level)));
      $('[data-quick-absent]', wrapper)?.classList.toggle('selected', Boolean(absent));
    });
    updateQuickSuggestionForStudent(studentId);
    updateDailyProgress();
  }

  function updateQuickSuggestionForStudent(studentId) {
    if (!studentId) return;
    const draft = collectQuickStudent(studentId);
    const text = draft.absent ? 'غائبة — لا يُحتسب مستوى في هذه الحصة.' : draft.postLevel ? generateSuggestion(draft) : 'اختاري المستوى ليظهر الإجراء التالي.';
    $$(`[data-quick-student="${CSS.escape(studentId)}"] [data-quick-suggestion]`).forEach(element => { element.textContent = text; });
  }

  function collectQuickStudent(studentId) {
    const wrappers = $$(`[data-quick-student="${CSS.escape(studentId)}"]`);
    const wrapper = wrappers.find(item => item.offsetParent !== null) || wrappers[0];
    if (!wrapper) return {};
    return {
      studentId,
      date: $('#dailyDate')?.value || todayISO(),
      skillId: $('#dailySkill')?.value || '',
      assessmentTool: $('#dailyAssessmentTool')?.value || '',
      preLevel: Number($('[data-field="preLevel"]', wrapper)?.value) || null,
      postLevel: Number(wrapper.dataset.level) || null,
      absent: wrapper.dataset.absent === 'true',
      confidence: 2,
      independence: 2,
      learningModes: [$('[data-field="mode"]', wrapper)?.value].filter(Boolean),
      errorCodes: [$('[data-field="error"]', wrapper)?.value].filter(Boolean),
      note: '',
      action: $('[data-quick-suggestion]', wrapper)?.textContent || ''
    };
  }

  function applyLevelToUnrated(level) {
    state.students.forEach(student => {
      const draft = collectQuickStudent(student.id);
      if (!draft.postLevel && !draft.absent) updateQuickState(student.id, { level, absent: false });
    });
  }

  function applyAbsentToUnrated() {
    state.students.forEach(student => {
      const draft = collectQuickStudent(student.id);
      if (!draft.postLevel && !draft.absent) updateQuickState(student.id, { level: '', absent: true });
    });
  }

  function updateDailyProgress() {
    const total = state.students.length;
    const completed = state.students.filter(student => {
      const draft = collectQuickStudent(student.id);
      return Boolean(draft.postLevel || draft.absent);
    }).length;
    const label = $('#dailyProgressLabel');
    if (label) label.textContent = `${toArabicDigits(completed)} من ${toArabicDigits(total)} تم رصدهن`;
  }

  function saveQuickEntries() {
    if (!state.students.length) {
      showToast('أضيفي الطالبات أولًا.', 'warning');
      return;
    }

    let savedCount = 0;
    const now = new Date().toISOString();
    state.students.forEach(student => {
      const draft = collectQuickStudent(student.id);
      if (!draft.postLevel && !draft.absent) return;

      const existing = getEntryForDate(student.id, draft.skillId, draft.date);
      const base = existing || {
        id: uid('entry'),
        studentId: student.id,
        skillId: draft.skillId,
        date: draft.date,
        media: [],
        createdAt: now
      };

      Object.assign(base, {
        ...draft,
        action: draft.absent ? '' : generateSuggestion(draft),
        updatedAt: now
      });

      if (!existing) state.entries.push(base);
      savedCount += 1;
    });

    saveState();
    renderAll();
    showToast(`تم حفظ رصد ${toArabicDigits(savedCount)} طالبة.`, 'success');
  }

  function openQuickDetails(studentId) {
    const draft = collectQuickStudent(studentId);
    openEntryDialog({
      studentId,
      skillId: draft.skillId,
      date: draft.date,
      draft
    });
  }

  function renderStudents() {
    const grid = $('#studentsGrid');
    if (!grid) return;
    const search = normalizeName($('#studentSearch')?.value || '');
    const students = state.students.filter(student => !search || normalizeName(student.name).includes(search));
    $('#studentCountLabel').textContent = `${toArabicDigits(state.students.length)} طالبة في السجل`;

    if (!students.length) {
      grid.innerHTML = emptyState(state.students.length ? 'لا توجد نتيجة مطابقة' : 'لم تُضاف طالبات بعد', state.students.length ? 'جرّبي كتابة جزء آخر من الاسم.' : 'استخدمي زر «إضافة قائمة» لإدخال الأسماء بسرعة.');
      return;
    }

    const summaries = new Map(calculateStudentSummaries().map(item => [item.student.id, item]));
    grid.innerHTML = students.map(student => {
      const summary = summaries.get(student.id);
      const average = summary?.ratedCount ? summary.average.toFixed(1) : '—';
      return `
        <button class="student-card" data-action="open-student" data-student-id="${escapeHTML(student.id)}" type="button">
          <div class="student-card-header">
            <div class="avatar">${escapeHTML(student.name.trim().charAt(0) || 'ط')}</div>
            <div>
              <strong>${escapeHTML(student.name)}</strong>
              <small>${student.number ? `الرقم ${escapeHTML(toArabicDigits(student.number))}` : 'بطاقة تعلم فردية'}</small>
            </div>
          </div>
          <div class="student-card-stats">
            <div class="mini-stat"><strong>${toArabicDigits(summary?.ratedCount || 0)}</strong><span>مهارة مرصودة</span></div>
            <div class="mini-stat"><strong>${toArabicDigits(average)}</strong><span>متوسط التقدم</span></div>
            <div class="mini-stat"><strong>${toArabicDigits(summary?.supportCount || 0)}</strong><span>أولوية دعم</span></div>
          </div>
        </button>`;
    }).join('');
  }

  function openStudentDialog(studentId = '') {
    const student = state.students.find(item => item.id === studentId);
    $('#studentEditId').value = student?.id || '';
    $('#studentName').value = student?.name || '';
    $('#studentNumber').value = student?.number || '';
    $('#studentGeneralNote').value = student?.note || '';
    $('#studentDialogTitle').textContent = student ? 'تعديل بيانات الطالبة' : 'إضافة طالبة';
    openDialog('studentDialog');
    setTimeout(() => $('#studentName')?.focus(), 50);
  }

  function saveStudentFromDialog() {
    const id = $('#studentEditId').value;
    const name = $('#studentName').value.trim();
    if (!name) {
      showToast('اكتبي اسم الطالبة.', 'warning');
      $('#studentName').focus();
      return;
    }

    const duplicate = state.students.find(student => normalizeName(student.name) === normalizeName(name) && student.id !== id);
    if (duplicate) {
      showToast('هذا الاسم موجود في السجل بالفعل.', 'warning');
      return;
    }

    if (id) {
      const student = state.students.find(item => item.id === id);
      if (student) Object.assign(student, { name, number: $('#studentNumber').value.trim(), note: $('#studentGeneralNote').value.trim(), updatedAt: new Date().toISOString() });
    } else {
      state.students.push({
        id: uid('student'),
        name,
        number: $('#studentNumber').value.trim(),
        note: $('#studentGeneralNote').value.trim(),
        createdAt: new Date().toISOString()
      });
    }

    saveState();
    $('#studentDialog').close();
    renderAll();
    if (id && $('#studentCardDialog')?.open) openStudentCard(id);
    showToast(id ? 'تم تحديث بيانات الطالبة.' : 'تمت إضافة الطالبة.', 'success');
  }

  function saveBulkStudents() {
    const lines = $('#bulkStudentNames').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) {
      showToast('اكتبي اسمًا واحدًا على الأقل.', 'warning');
      return;
    }

    const existingNames = new Set(state.students.map(student => normalizeName(student.name)));
    let added = 0;
    lines.forEach((line, index) => {
      const normalized = normalizeName(line);
      if (!normalized || existingNames.has(normalized)) return;
      state.students.push({ id: uid('student'), name: line, number: String(state.students.length + 1), note: '', createdAt: new Date().toISOString() });
      existingNames.add(normalized);
      added += 1;
    });

    saveState();
    $('#bulkStudentNames').value = '';
    $('#bulkStudentsDialog').close();
    renderAll();
    showToast(`تمت إضافة ${toArabicDigits(added)} طالبة.`, 'success');
  }

  async function deleteStudent(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    if (!confirm(`سيتم حذف «${student.name}» وجميع سجلاتها ومرفقاتها. هل أنتِ متأكدة؟`)) return;

    const entries = state.entries.filter(entry => entry.studentId === studentId);
    for (const entry of entries) {
      for (const media of entry.media || []) await deleteMedia(media.id);
    }
    state.entries = state.entries.filter(entry => entry.studentId !== studentId);
    state.students = state.students.filter(item => item.id !== studentId);
    saveState();
    $('#studentCardDialog')?.close();
    renderAll();
    showToast('تم حذف الطالبة وسجلاتها.', 'success');
  }

  async function openStudentCard(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    revokeObjectUrls();

    const summary = calculateStudentSummaries().find(item => item.student.id === studentId);
    const entries = state.entries.filter(entry => entry.studentId === studentId).sort(sortEntriesDescending);
    const mastered = summary?.latestEntries.filter(entry => Number(entry.postLevel) >= 3).length || 0;
    const average = summary?.ratedCount ? summary.average.toFixed(1) : '—';

    const skillRows = state.skills.map(skill => {
      const entry = getLatestEntry(studentId, skill.id, todayISO(), false);
      const level = entry ? Number(entry.postLevel) : 0;
      return `
        <div class="skill-progress-row">
          <strong>${escapeHTML(skill.name)}</strong>
          <div class="skill-progress-track"><div class="skill-progress-fill level-${level}"></div></div>
          <span class="level-badge level-${level}">${level ? `${LEVELS[level].emoji} ${LEVELS[level].name}` : 'لم تُرصد'}</span>
        </div>`;
    }).join('');

    const history = entries.length ? entries.map(entry => renderHistoryEntry(entry)).join('') : emptyState('لا يوجد رصد لهذه الطالبة', 'أضيفي أول متابعة تفصيلية أو استخدمي الرصد اليومي.');

    $('#studentCardContent').innerHTML = `
      <div class="student-profile-header">
        <div class="student-profile-identity">
          <div class="avatar">${escapeHTML(student.name.trim().charAt(0) || 'ط')}</div>
          <div><h3>${escapeHTML(student.name)}</h3><p>${escapeHTML([state.settings.grade, state.settings.className].filter(Boolean).join(' — ') || 'بطاقة تعلم فردية')}</p></div>
        </div>
        <div class="student-profile-actions">
          <button class="button" data-action="add-entry-for-student" data-student-id="${escapeHTML(student.id)}" type="button">＋ متابعة جديدة</button>
          <button class="button" data-action="print-student" data-student-id="${escapeHTML(student.id)}" type="button">طباعة</button>
          <button class="button" data-action="edit-student" data-student-id="${escapeHTML(student.id)}" type="button">تعديل</button>
          <button class="button" data-action="close-student-card" type="button">إغلاق</button>
        </div>
      </div>

      <div class="profile-stats">
        <div class="profile-stat"><strong>${toArabicDigits(summary?.ratedCount || 0)}</strong><span>مهارة مرصودة</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(average)}</strong><span>متوسط التقدم</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(mastered)}</strong><span>إتقان فأعلى</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(summary?.supportCount || 0)}</strong><span>تحتاج إلى متابعة</span></div>
      </div>

      ${student.note ? `<section class="panel"><h3>ملاحظة عامة</h3><p>${escapeHTML(student.note)}</p></section>` : ''}

      <section class="panel">
        <div class="panel-header"><div><h3>تقدم المهارات</h3><p>بحسب أحدث رصد لكل مهارة.</p></div></div>
        <div class="skill-progress-list">${skillRows}</div>
      </section>

      <section class="panel">
        <div class="panel-header"><div><h3>السجل الزمني</h3><p>المتابعات والملاحظات والمرفقات من الأحدث إلى الأقدم.</p></div></div>
        <div>${history}</div>
      </section>`;

    if (!$('#studentCardDialog').open) $('#studentCardDialog').showModal();
    await hydrateMedia($('#studentCardContent'));
  }

  function renderHistoryEntry(entry) {
    const skill = state.skills.find(item => item.id === entry.skillId);
    const level = Number(entry.postLevel) || 0;
    const modes = (entry.learningModes || []).map(id => LEARNING_MODES.find(mode => mode.id === id)?.label).filter(Boolean);
    const errors = (entry.errorCodes || []).map(id => ERROR_CODES.find(error => error.id === id)).filter(Boolean);
    const media = entry.media || [];
    const imageHTML = media.filter(item => item.type.startsWith('image')).map(item => `<div class="media-preview-item"><img data-media-id="${escapeHTML(item.id)}" alt="صورة من حل الطالبة" /></div>`).join('');
    const audioHTML = media.filter(item => item.type.startsWith('audio')).map(item => `<div class="audio-item"><audio data-media-id="${escapeHTML(item.id)}" controls></audio></div>`).join('');

    return `
      <article class="history-entry">
        <div class="history-entry-header">
          <div><strong>${escapeHTML(skill?.name || 'مهارة محذوفة')}</strong><small>${escapeHTML(formatDate(entry.date))}${entry.assessmentTool ? ` — ${escapeHTML(entry.assessmentTool)}` : ''}</small></div>
          <div class="row-actions">
            <span class="level-badge level-${level}">${entry.absent ? 'غائبة' : level ? `${LEVELS[level].emoji} ${LEVELS[level].name}` : 'غير محدد'}</span>
            <button class="table-action" data-action="edit-entry" data-entry-id="${escapeHTML(entry.id)}" type="button">تعديل</button>
            <button class="table-action danger" data-action="delete-entry" data-entry-id="${escapeHTML(entry.id)}" type="button">حذف</button>
          </div>
        </div>
        <div class="history-meta">
          ${entry.preLevel ? `<span class="history-chip">قبلي: ${LEVELS[entry.preLevel]?.name || entry.preLevel}</span>` : ''}
          ${entry.confidence ? `<span class="history-chip">الثقة: ${toArabicDigits(entry.confidence)}/٣</span>` : ''}
          ${entry.independence ? `<span class="history-chip">الاستقلالية: ${toArabicDigits(entry.independence)}/٣</span>` : ''}
          ${modes.map(mode => `<span class="history-chip">${escapeHTML(mode)}</span>`).join('')}
          ${errors.map(error => `<span class="history-chip">${error.code} — ${escapeHTML(error.label)}</span>`).join('')}
        </div>
        ${entry.note ? `<p><strong>الملاحظة:</strong> ${escapeHTML(entry.note)}</p>` : ''}
        ${entry.action ? `<p><strong>الإجراء التالي:</strong> ${escapeHTML(entry.action)}</p>` : ''}
        ${media.length ? `<div class="history-media"><div class="media-preview-grid">${imageHTML}</div><div class="audio-list">${audioHTML}</div></div>` : ''}
      </article>`;
  }

  function sortEntriesDescending(a, b) {
    const dateCompare = String(b.date).localeCompare(String(a.date));
    if (dateCompare !== 0) return dateCompare;
    return String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''));
  }

  function renderSkills() {
    const container = $('#skillsTableContainer');
    if (!container) return;
    if (!state.skills.length) {
      container.innerHTML = emptyState('لا توجد مهارات', 'أضيفي مهارات المنهج لتبدئي الرصد.');
      return;
    }

    const rows = state.skills
      .slice()
      .sort((a, b) => String(a.domain || '').localeCompare(String(b.domain || ''), 'ar') || String(a.name).localeCompare(String(b.name), 'ar'))
      .map(skill => {
        const entryCount = state.entries.filter(entry => entry.skillId === skill.id).length;
        return `
          <tr>
            <td><span class="skill-domain-badge">${escapeHTML(skill.domain || 'عام')}</span></td>
            <td><strong>${escapeHTML(skill.name)}</strong>${skill.description ? `<br><small class="muted">${escapeHTML(skill.description)}</small>` : ''}</td>
            <td>${toArabicDigits(entryCount)}</td>
            <td><div class="row-actions"><button class="table-action" data-action="edit-skill" data-skill-id="${escapeHTML(skill.id)}" type="button">تعديل</button><button class="table-action danger" data-action="delete-skill" data-skill-id="${escapeHTML(skill.id)}" type="button">حذف</button></div></td>
          </tr>`;
      }).join('');

    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>المجال</th><th>المهارة ومؤشر الإتقان</th><th>عدد مرات الرصد</th><th>الإجراءات</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function openSkillDialog(skillId = '') {
    const skill = state.skills.find(item => item.id === skillId);
    $('#skillEditId').value = skill?.id || '';
    $('#skillName').value = skill?.name || '';
    $('#skillDomain').value = skill?.domain || '';
    $('#skillDescription').value = skill?.description || '';
    $('#skillDialogTitle').textContent = skill ? 'تعديل المهارة' : 'إضافة مهارة';
    openDialog('skillDialog');
    setTimeout(() => $('#skillName')?.focus(), 50);
  }

  function saveSkillFromDialog() {
    const id = $('#skillEditId').value;
    const name = $('#skillName').value.trim();
    const domain = $('#skillDomain').value.trim();
    const description = $('#skillDescription').value.trim();
    if (!name) {
      showToast('اكتبي اسم المهارة.', 'warning');
      return;
    }

    const duplicate = state.skills.find(skill => normalizeName(skill.name) === normalizeName(name) && skill.id !== id);
    if (duplicate) {
      showToast('هذه المهارة موجودة بالفعل.', 'warning');
      return;
    }

    if (id) {
      const skill = state.skills.find(item => item.id === id);
      if (skill) Object.assign(skill, { name, domain, description, updatedAt: new Date().toISOString() });
    } else {
      state.skills.push({ id: uid('skill'), name, domain, description, createdAt: new Date().toISOString() });
    }

    saveState();
    $('#skillDialog').close();
    renderAll();
    showToast(id ? 'تم تحديث المهارة.' : 'تمت إضافة المهارة.', 'success');
  }

  function saveBulkSkills() {
    const lines = $('#bulkSkillNames').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) {
      showToast('اكتبي مهارة واحدة على الأقل.', 'warning');
      return;
    }

    const existing = new Set(state.skills.map(skill => normalizeName(skill.name)));
    let added = 0;
    lines.forEach(line => {
      const parts = line.split('|').map(part => part.trim());
      const domain = parts.length > 1 ? parts[0] : '';
      const name = parts.length > 1 ? parts.slice(1).join(' | ') : parts[0];
      if (!name || existing.has(normalizeName(name))) return;
      state.skills.push({ id: uid('skill'), name, domain, description: '', createdAt: new Date().toISOString() });
      existing.add(normalizeName(name));
      added += 1;
    });

    saveState();
    $('#bulkSkillNames').value = '';
    $('#bulkSkillsDialog').close();
    renderAll();
    showToast(`تمت إضافة ${toArabicDigits(added)} مهارة.`, 'success');
  }

  async function deleteSkill(skillId) {
    const skill = state.skills.find(item => item.id === skillId);
    if (!skill) return;
    const relatedEntries = state.entries.filter(entry => entry.skillId === skillId);
    const message = relatedEntries.length
      ? `ترتبط بالمهارة «${skill.name}» ${toArabicDigits(relatedEntries.length)} متابعة. سيؤدي الحذف إلى حذفها ومرفقاتها أيضًا. هل أنتِ متأكدة؟`
      : `هل تريدين حذف المهارة «${skill.name}»؟`;
    if (!confirm(message)) return;

    for (const entry of relatedEntries) {
      for (const media of entry.media || []) await deleteMedia(media.id);
    }
    state.entries = state.entries.filter(entry => entry.skillId !== skillId);
    state.skills = state.skills.filter(item => item.id !== skillId);
    saveState();
    renderAll();
    showToast('تم حذف المهارة.', 'success');
  }

  function buildChoiceControls() {
    const levelHTML = (name, compact = false) => [1,2,3,4].map(level => `
      <label class="level-choice ${compact ? 'compact' : ''}" data-level="${level}">
        <input type="radio" name="${name}" value="${level}" />
        <span class="level-emoji">${LEVELS[level].emoji}</span>
        <strong>${LEVELS[level].name}</strong>
        <small>${LEVELS[level].description}</small>
      </label>`).join('');
    $('#entryPreLevelChoices').innerHTML = levelHTML('entryPreLevel', true);
    $('#entryPostLevelChoices').innerHTML = levelHTML('entryPostLevel');

    $('#learningModesChoices').innerHTML = LEARNING_MODES.map(mode => `
      <label class="tag-choice">
        <input type="checkbox" value="${mode.id}" />
        <span>${mode.icon}</span><span>${escapeHTML(mode.label)}</span>
      </label>`).join('');

    $('#errorCodesChoices').innerHTML = ERROR_CODES.map(error => `
      <label class="tag-choice" title="${escapeHTML(error.action)}">
        <input type="checkbox" value="${error.id}" />
        <strong>${error.code}</strong><span>${escapeHTML(error.label)}</span>
      </label>`).join('');
  }

  function refreshChoiceSelections() {
    $$('.level-choice').forEach(label => label.classList.toggle('selected', Boolean($('input', label)?.checked)));
    $$('.tag-choice').forEach(label => label.classList.toggle('selected', Boolean($('input', label)?.checked)));
  }

  async function openEntryDialog({ entryId = '', studentId = '', skillId = '', date = '', draft = null } = {}) {
    revokeObjectUrls();
    clearPendingMedia();
    stopRecording(true);
    renderStudentSelectOptions();
    renderSkillOptions();

    let entry = entryId ? state.entries.find(item => item.id === entryId) : null;
    if (!entry && studentId && skillId && date) entry = getEntryForDate(studentId, skillId, date);
    const source = entry || draft || {};

    $('#entryEditId').value = entry?.id || '';
    $('#entryStudent').value = source.studentId || studentId || state.students[0]?.id || '';
    $('#entryDate').value = source.date || date || todayISO();
    $('#entrySkill').value = source.skillId || skillId || state.skills[0]?.id || '';
    $('#entryConfidence').value = String(source.confidence || 2);
    $('#entryIndependence').value = String(source.independence || 2);
    $('#entryNote').value = source.note || '';
    $('#entryAbsent').checked = Boolean(source.absent);

    $$('input[name="entryPreLevel"]').forEach(input => { input.checked = Number(input.value) === Number(source.preLevel); });
    $$('input[name="entryPostLevel"]').forEach(input => { input.checked = Number(input.value) === Number(source.postLevel); });
    $$('#learningModesChoices input').forEach(input => { input.checked = (source.learningModes || []).includes(input.value); });
    $$('#errorCodesChoices input').forEach(input => { input.checked = (source.errorCodes || []).includes(input.value); });

    refreshChoiceSelections();
    $('#entryAction').value = source.action || generateSuggestion(collectEntryFormData(false));
    $('#entryForm').dataset.assessmentTool = source.assessmentTool || $('#dailyAssessmentTool')?.value || '';
    $('#entryDialogTitle').textContent = entry ? 'تعديل المتابعة' : 'متابعة تفصيلية جديدة';
    updateEntryFormForAbsence();

    await renderExistingEntryMedia(entry);
    openDialog('entryDialog');
  }

  function renderStudentSelectOptions() {
    const select = $('#entryStudent');
    if (!select) return;
    const previous = select.value;
    select.innerHTML = state.students.map(student => `<option value="${escapeHTML(student.id)}">${escapeHTML(student.name)}</option>`).join('') || '<option value="">لا توجد طالبات</option>';
    if (state.students.some(student => student.id === previous)) select.value = previous;
  }

  function collectEntryFormData(includeId = true) {
    const data = {
      studentId: $('#entryStudent')?.value || '',
      date: $('#entryDate')?.value || todayISO(),
      skillId: $('#entrySkill')?.value || '',
      preLevel: Number($('input[name="entryPreLevel"]:checked')?.value) || null,
      postLevel: Number($('input[name="entryPostLevel"]:checked')?.value) || null,
      confidence: Number($('#entryConfidence')?.value) || 2,
      independence: Number($('#entryIndependence')?.value) || 2,
      learningModes: $$('#learningModesChoices input:checked').map(input => input.value),
      errorCodes: $$('#errorCodesChoices input:checked').map(input => input.value),
      note: $('#entryNote')?.value.trim() || '',
      action: $('#entryAction')?.value.trim() || '',
      absent: Boolean($('#entryAbsent')?.checked),
      assessmentTool: $('#entryForm')?.dataset.assessmentTool || $('#dailyAssessmentTool')?.value || ''
    };
    if (includeId) data.id = $('#entryEditId')?.value || '';
    return data;
  }

  function generateSuggestion(data = {}) {
    if (data.absent) return '';
    const level = Number(data.postLevel);
    if (!level) return 'اختاري مستوى التقدم لتوليد إجراء مناسب.';

    const modes = data.learningModes || [];
    const errors = data.errorCodes || [];
    const confidence = Number(data.confidence || 2);
    const independence = Number(data.independence || 2);
    const parts = [];

    const preferredMode = modes[0];
    const modePhrase = {
      visual: 'باستخدام مخطط أو نموذج بصري واضح',
      hands_on: 'باستخدام المحسوسات والحركة',
      oral: 'من خلال شرح شفهي وحوار قصير',
      written: 'باستخدام خطوات مكتوبة ومنظمة',
      digital: 'من خلال نشاط رقمي تفاعلي قصير',
      cooperative: 'ضمن تعلم ثنائي أو مجموعة صغيرة'
    }[preferredMode] || 'باستخدام محسوسات ونموذج بصري';

    if (level === 1) parts.push(`إعادة تقديم المفهوم في مجموعة دعم صغيرة ${modePhrase}، ثم التحقق بسؤال واحد مباشر.`);
    if (level === 2) parts.push(`تدريب موجه من ثلاث مسائل متدرجة ${modePhrase}، مع تقليل التلميحات تدريجيًا.`);
    if (level === 3) parts.push(confidence <= 1
      ? 'تعزيز الثقة بطلب شرح خطوة واحدة لزميلة، ثم سؤال تثبيت مستقل في بداية الحصة القادمة.'
      : 'تقديم سؤال تثبيت قصير في بداية الحصة القادمة، ثم الانتقال إلى تطبيق جديد دون مساعدة.');
    if (level === 4) parts.push('مهمة إثرائية مفتوحة: تأليف مسألة، أو اكتشاف خطأ، أو حل الموقف بطريقتين مع تبرير الاختيار.');

    errors.slice(0, 2).forEach(errorId => {
      const error = ERROR_CODES.find(item => item.id === errorId);
      if (error) parts.push(error.action);
    });

    if (independence === 1 && level <= 2) parts.push('خفض المساندة تدريجيًا: نموذج، ثم تلميح، ثم محاولة مستقلة.');
    if (confidence === 1 && level >= 3 && !parts.some(part => part.includes('تعزيز الثقة'))) parts.push('منح تغذية راجعة محددة تعزز الثقة في الاستراتيجية الصحيحة.');

    return parts.slice(0, 3).join(' ');
  }

  function updateEntryFormForAbsence() {
    const absent = $('#entryAbsent')?.checked;
    const controls = [
      ...$$('#entryPreLevelChoices input, #entryPostLevelChoices input, #entryConfidence, #entryIndependence, #learningModesChoices input, #errorCodesChoices input'),
      $('#entryNote'), $('#entryAction'), $('#entryImageInput'), $('#startRecordingButton')
    ].filter(Boolean);
    controls.forEach(control => { control.disabled = Boolean(absent); });
    if (absent) $('#entryAction').value = '';
    else if (!$('#entryAction').value) $('#entryAction').value = generateSuggestion(collectEntryFormData(false));
  }

  async function saveDetailedEntry() {
    const data = collectEntryFormData(true);
    if (!data.studentId || !data.skillId || !data.date) {
      showToast('اختاري الطالبة والتاريخ والمهارة.', 'warning');
      return;
    }
    if (!data.absent && !data.postLevel) {
      showToast('اختاري مستوى الطالبة بعد التعلم.', 'warning');
      return;
    }

    const saveButton = $('#saveEntryButton');
    saveButton.disabled = true;
    saveButton.textContent = 'جارٍ الحفظ…';

    try {
      let entry = data.id ? state.entries.find(item => item.id === data.id) : null;
      if (!entry) entry = getEntryForDate(data.studentId, data.skillId, data.date);
      const now = new Date().toISOString();
      const media = [...(entry?.media || [])];

      for (const pending of pendingImages) {
        const meta = await putMedia(pending.blob, pending.name, pending.type);
        media.push(meta);
      }
      if (pendingAudio?.blob) {
        const meta = await putMedia(pendingAudio.blob, pendingAudio.name, pendingAudio.type);
        media.push(meta);
      }

      const record = entry || { id: uid('entry'), createdAt: now };
      Object.assign(record, {
        studentId: data.studentId,
        skillId: data.skillId,
        date: data.date,
        preLevel: data.absent ? null : data.preLevel,
        postLevel: data.absent ? null : data.postLevel,
        confidence: data.absent ? null : data.confidence,
        independence: data.absent ? null : data.independence,
        learningModes: data.absent ? [] : data.learningModes,
        errorCodes: data.absent ? [] : data.errorCodes,
        note: data.absent ? '' : data.note,
        action: data.absent ? '' : (data.action || generateSuggestion(data)),
        absent: data.absent,
        assessmentTool: data.assessmentTool,
        media,
        updatedAt: now
      });

      if (!entry) state.entries.push(record);
      saveState();
      $('#entryDialog').close();
      renderAll();
      if ($('#studentCardDialog')?.open) await openStudentCard(data.studentId);
      showToast('تم حفظ المتابعة التفصيلية.', 'success');
    } catch (error) {
      console.error(error);
      showToast('تعذر حفظ المتابعة أو المرفقات.', 'error');
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = 'حفظ المتابعة';
    }
  }

  async function deleteEntry(entryId) {
    const entry = state.entries.find(item => item.id === entryId);
    if (!entry) return;
    if (!confirm('هل تريدين حذف هذه المتابعة ومرفقاتها؟')) return;
    for (const media of entry.media || []) await deleteMedia(media.id);
    state.entries = state.entries.filter(item => item.id !== entryId);
    saveState();
    const openStudentId = entry.studentId;
    renderAll();
    if ($('#studentCardDialog')?.open) await openStudentCard(openStudentId);
    showToast('تم حذف المتابعة.', 'success');
  }

  async function handleImageSelection(event) {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const blob = await compressImage(file);
        const url = URL.createObjectURL(blob);
        objectUrls.add(url);
        pendingImages.push({ blob, name: file.name || `حل-${Date.now()}.jpg`, type: blob.type || file.type, url });
      } catch (error) {
        console.error(error);
        showToast(`تعذر تجهيز الصورة: ${file.name}`, 'error');
      }
    }
    event.target.value = '';
    renderPendingImages();
  }

  async function compressImage(file) {
    if (file.size <= 900 * 1024) return file;
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return await new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('فشل ضغط الصورة')), 'image/jpeg', 0.82);
    });
  }

  function renderPendingImages() {
    const container = $('#pendingImagePreview');
    if (!container) return;
    container.innerHTML = pendingImages.map((image, index) => `
      <div class="media-preview-item">
        <img src="${image.url}" alt="صورة مرفقة جديدة" />
        <button class="media-remove" data-action="remove-pending-image" data-index="${index}" type="button" aria-label="حذف الصورة">×</button>
      </div>`).join('');
  }

  function removePendingImage(index) {
    const item = pendingImages[index];
    if (!item) return;
    if (item.url) {
      URL.revokeObjectURL(item.url);
      objectUrls.delete(item.url);
    }
    pendingImages.splice(index, 1);
    renderPendingImages();
  }

  async function renderExistingEntryMedia(entry) {
    const images = $('#existingImagePreview');
    const audios = $('#existingAudioPreview');
    images.innerHTML = '';
    audios.innerHTML = '';
    if (!entry?.media?.length) return;

    images.innerHTML = entry.media.filter(item => item.type.startsWith('image')).map(item => `
      <div class="media-preview-item">
        <img data-media-id="${escapeHTML(item.id)}" alt="صورة من حل الطالبة" />
        <button class="media-remove" data-action="remove-media" data-entry-id="${escapeHTML(entry.id)}" data-media-id="${escapeHTML(item.id)}" type="button" aria-label="حذف الصورة">×</button>
      </div>`).join('');

    audios.innerHTML = entry.media.filter(item => item.type.startsWith('audio')).map(item => `
      <div class="audio-item">
        <button class="media-remove" data-action="remove-media" data-entry-id="${escapeHTML(entry.id)}" data-media-id="${escapeHTML(item.id)}" type="button" aria-label="حذف التسجيل">×</button>
        <audio data-media-id="${escapeHTML(item.id)}" controls></audio>
      </div>`).join('');

    await hydrateMedia($('#entryForm'));
  }

  async function removeExistingMedia(entryId, mediaId) {
    const entry = state.entries.find(item => item.id === entryId);
    if (!entry) return;
    if (!confirm('هل تريدين حذف هذا المرفق؟')) return;
    entry.media = (entry.media || []).filter(item => item.id !== mediaId);
    entry.updatedAt = new Date().toISOString();
    await deleteMedia(mediaId);
    saveState();
    await renderExistingEntryMedia(entry);
    showToast('تم حذف المرفق.', 'success');
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      showToast('هذا المتصفح لا يدعم التسجيل الصوتي. جرّبي Chrome أو Edge عبر اتصال HTTPS.', 'warning');
      return;
    }

    try {
      discardPendingRecording();
      recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = mimeCandidates.find(type => MediaRecorder.isTypeSupported?.(type));
      mediaRecorder = mimeType ? new MediaRecorder(recordingStream, { mimeType }) : new MediaRecorder(recordingStream);
      recordingChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => { if (event.data?.size) recordingChunks.push(event.data); });
      mediaRecorder.addEventListener('stop', () => {
        if (discardRecordingAfterStop) {
          discardRecordingAfterStop = false;
          recordingChunks = [];
          $('#recordingStatus').textContent = 'جاهز للتسجيل';
          $('#recordingStatus').classList.remove('recording');
          return;
        }
        const type = mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(recordingChunks, { type });
        const extension = type.includes('mp4') ? 'm4a' : 'webm';
        const url = URL.createObjectURL(blob);
        objectUrls.add(url);
        pendingAudio = { blob, type, name: `شرح-الطالبة-${Date.now()}.${extension}`, url };
        const preview = $('#pendingAudioPreview');
        preview.src = url;
        preview.hidden = false;
        $('#discardRecordingButton').disabled = false;
        $('#recordingStatus').textContent = 'تم تجهيز التسجيل للحفظ.';
        $('#recordingStatus').classList.remove('recording');
      });
      mediaRecorder.start(250);
      recordingStartedAt = Date.now();
      updateRecordingClock();
      recordingTimer = setInterval(updateRecordingClock, 1000);
      $('#startRecordingButton').disabled = true;
      $('#stopRecordingButton').disabled = false;
      $('#recordingStatus').classList.add('recording');
    } catch (error) {
      console.error(error);
      showToast('تعذر الوصول إلى الميكروفون. تحققي من الإذن ومن فتح التطبيق عبر HTTPS.', 'error');
      stopRecording(true);
    }
  }

  function updateRecordingClock() {
    const seconds = Math.max(0, Math.floor((Date.now() - recordingStartedAt) / 1000));
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    $('#recordingStatus').textContent = `جارٍ التسجيل… ${toArabicDigits(minutes)}:${toArabicDigits(String(remaining).padStart(2, '0'))}`;
  }

  function stopRecording(silent = false) {
    if (silent && mediaRecorder && mediaRecorder.state !== 'inactive') discardRecordingAfterStop = true;
    if (recordingTimer) clearInterval(recordingTimer);
    recordingTimer = null;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (error) { console.warn(error); }
    }
    if (recordingStream) recordingStream.getTracks().forEach(track => track.stop());
    recordingStream = null;
    $('#startRecordingButton').disabled = Boolean($('#entryAbsent')?.checked);
    $('#stopRecordingButton').disabled = true;
    if (!silent && !pendingAudio) $('#recordingStatus').textContent = 'جارٍ تجهيز التسجيل…';
    if (silent) $('#recordingStatus').classList.remove('recording');
  }

  function discardPendingRecording() {
    if (pendingAudio?.url) {
      URL.revokeObjectURL(pendingAudio.url);
      objectUrls.delete(pendingAudio.url);
    }
    pendingAudio = null;
    const preview = $('#pendingAudioPreview');
    if (preview) {
      preview.pause?.();
      preview.removeAttribute('src');
      preview.hidden = true;
    }
    const discard = $('#discardRecordingButton');
    if (discard) discard.disabled = true;
    const status = $('#recordingStatus');
    if (status) {
      status.textContent = 'جاهز للتسجيل';
      status.classList.remove('recording');
    }
  }

  function clearPendingMedia() {
    pendingImages.forEach(image => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
        objectUrls.delete(image.url);
      }
    });
    pendingImages = [];
    renderPendingImages();
    discardPendingRecording();
    if ($('#entryImageInput')) $('#entryImageInput').value = '';
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }

  function emptyState(title, text) {
    return `<div class="empty-state"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(text)}</span></div>`;
  }

  function renderReports() {
    const select = $('#reportStudentSelect');
    if (!select) return;
    const previous = select.value;
    select.innerHTML = state.students.length
      ? state.students.map(student => `<option value="${escapeHTML(student.id)}">${escapeHTML(student.name)}</option>`).join('')
      : '<option value="">لا توجد طالبات</option>';
    if (state.students.some(student => student.id === previous)) select.value = previous;
  }

  function renderSettings() {
    $('#settingTeacher').value = state.settings.teacher || '';
    $('#settingSchool').value = state.settings.school || '';
    $('#settingGrade').value = state.settings.grade || '';
    $('#settingClass').value = state.settings.className || '';
    $('#settingSemester').value = state.settings.semester || '';
    $('#settingSubject').value = state.settings.subject || 'الرياضيات';
    $('#settingReportTitle').value = state.settings.reportTitle || DEFAULT_STATE.settings.reportTitle;
  }

  function saveSettings() {
    state.settings = {
      teacher: $('#settingTeacher').value.trim(),
      school: $('#settingSchool').value.trim(),
      grade: $('#settingGrade').value.trim(),
      className: $('#settingClass').value.trim(),
      semester: $('#settingSemester').value.trim(),
      subject: $('#settingSubject').value.trim() || 'الرياضيات',
      reportTitle: $('#settingReportTitle').value.trim() || DEFAULT_STATE.settings.reportTitle
    };
    saveState();
    renderContext();
    showToast('تم حفظ إعدادات السجل.', 'success');
  }

  async function exportBackup() {
    const button = document.querySelector('[data-action="export-backup"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'جارٍ تجهيز النسخة…';
    }
    try {
      const mediaIds = [...new Set(state.entries.flatMap(entry => (entry.media || []).map(media => media.id)))];
      const mediaData = [];
      for (const id of mediaIds) {
        const record = await getMedia(id);
        if (!record?.blob) continue;
        mediaData.push({
          id: record.id,
          name: record.name,
          type: record.type,
          createdAt: record.createdAt,
          dataUrl: await blobToDataURL(record.blob)
        });
      }
      const backup = {
        app: 'بوصلة الرياضيات',
        backupVersion: 1,
        exportedAt: new Date().toISOString(),
        state,
        mediaData
      };
      downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' }), `نسخة-احتياطية-بوصلة-الرياضيات-${todayISO()}.json`);
      showToast('تم إنشاء النسخة الاحتياطية الكاملة.', 'success');
    } catch (error) {
      console.error(error);
      showToast('تعذر إنشاء النسخة الاحتياطية.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'نسخة احتياطية كاملة';
      }
    }
  }

  async function importBackupFromFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!confirm('سيستبدل الاستيراد البيانات الحالية في هذا الجهاز. هل تريدين المتابعة؟')) return;

    try {
      const backup = JSON.parse(await file.text());
      if (!backup?.state || !Array.isArray(backup.state.students) || !Array.isArray(backup.state.skills) || !Array.isArray(backup.state.entries)) {
        throw new Error('صيغة غير صحيحة');
      }

      await clearMediaDatabase();
      for (const media of backup.mediaData || []) {
        const blob = dataURLToBlob(media.dataUrl);
        await putMediaRecord({ id: media.id, blob, name: media.name, type: media.type || blob.type, createdAt: media.createdAt || new Date().toISOString() });
      }
      state = backup.state;
      normalizeState();
      saveState();
      renderAll();
      showToast('تم استيراد النسخة الاحتياطية بنجاح.', 'success');
    } catch (error) {
      console.error(error);
      showToast('تعذر قراءة النسخة الاحتياطية أو أن الملف غير صالح.', 'error');
    }
  }

  function exportCSV() {
    const headers = ['التاريخ', 'اسم الطالبة', 'المهارة', 'المجال', 'الأداة', 'المستوى القبلي', 'المستوى بعد التعلم', 'الثقة', 'الاستقلالية', 'الطريقة المساعدة', 'بصمة الخطأ', 'الملاحظة', 'الإجراء التالي', 'غياب'];
    const rows = state.entries.slice().sort(sortEntriesDescending).map(entry => {
      const student = state.students.find(item => item.id === entry.studentId);
      const skill = state.skills.find(item => item.id === entry.skillId);
      const modes = (entry.learningModes || []).map(id => LEARNING_MODES.find(item => item.id === id)?.label).filter(Boolean).join(' | ');
      const errors = (entry.errorCodes || []).map(id => {
        const item = ERROR_CODES.find(error => error.id === id);
        return item ? `${item.code}-${item.label}` : id;
      }).join(' | ');
      return [
        entry.date,
        student?.name || '',
        skill?.name || '',
        skill?.domain || '',
        entry.assessmentTool || '',
        entry.preLevel ? LEVELS[entry.preLevel]?.name || entry.preLevel : '',
        entry.postLevel ? LEVELS[entry.postLevel]?.name || entry.postLevel : '',
        entry.confidence || '',
        entry.independence || '',
        modes,
        errors,
        entry.note || '',
        entry.action || '',
        entry.absent ? 'نعم' : 'لا'
      ];
    });

    const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `سجل-متابعة-الرياضيات-${todayISO()}.csv`);
    showToast('تم تصدير ملف CSV.', 'success');
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function dataURLToBlob(dataURL) {
    const [header, data] = String(dataURL).split(',');
    const mime = /data:(.*?);base64/.exec(header)?.[1] || 'application/octet-stream';
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mime });
  }

  async function resetApp() {
    if (!confirm('سيتم حذف جميع الطالبات والرصد والصور والتسجيلات من هذا الجهاز. لا يمكن التراجع. هل أنتِ متأكدة؟')) return;
    if (!confirm('تأكيد أخير: هل تريدين مسح السجل كاملًا؟')) return;
    await clearMediaDatabase();
    state = structuredCloneSafe(DEFAULT_STATE);
    saveState();
    renderAll();
    navigate('dashboard');
    showToast('تم مسح السجل وإعادته إلى الحالة الأولى.', 'success');
  }

  function printHeader(title, subtitle = '') {
    const right = [state.settings.school, state.settings.grade, state.settings.className].filter(Boolean).join(' — ');
    const left = [state.settings.teacher, state.settings.semester].filter(Boolean).join(' — ');
    return `
      <header class="print-header">
        <div class="print-header-side">${escapeHTML(right || 'بيانات الفصل: __________________')}</div>
        <div class="print-title"><h1>${escapeHTML(title)}</h1><p>${escapeHTML(subtitle || state.settings.reportTitle)}</p></div>
        <div class="print-header-side">${escapeHTML(left || 'المعلمة: __________________')}</div>
      </header>`;
  }

  function printFooter() {
    return `<footer class="print-footer"><span>بوصلة الرياضيات — سجل متابعة يراعي الفروق الفردية</span><span>تاريخ الطباعة: ${escapeHTML(formatDate(todayISO()))}</span></footer>`;
  }

  function launchPrint(html) {
    const printArea = $('#printArea');
    printArea.innerHTML = `<div class="print-document">${html}</div>`;
    printArea.setAttribute('aria-hidden', 'false');
    setTimeout(() => window.print(), 80);
  }

  function printDashboard() {
    const maxDate = $('#dashboardDateFilter')?.value || todayISO();
    const skillFilter = $('#dashboardSkillFilter')?.value || 'all';
    const skills = skillFilter === 'all' ? state.skills : state.skills.filter(skill => skill.id === skillFilter);
    const matrix = buildLatestMatrix(maxDate, skills);
    const rated = matrix.flatMap(row => row.cells).filter(cell => cell.entry);
    const mastery = rated.length ? Math.round(rated.filter(cell => Number(cell.entry.postLevel) >= 3).length / rated.length * 100) : 0;

    const header = skills.map(skill => `<th>${escapeHTML(skill.name)}</th>`).join('');
    const rows = matrix.length ? matrix.map(row => `<tr><td class="student-print-name">${escapeHTML(row.student.name)}</td>${row.cells.map(cell => {
      const level = cell.entry ? Number(cell.entry.postLevel) : 0;
      return `<td class="print-level-cell print-level-${level}">${level ? `${LEVELS[level].emoji} ${LEVELS[level].name}` : '—'}</td>`;
    }).join('')}</tr>`).join('') : `<tr><td colspan="${skills.length + 1}">لا توجد بيانات</td></tr>`;

    launchPrint(`
      ${printHeader('لوحة ألوان الفصل', `أحدث رصد حتى ${formatDate(maxDate)}`)}
      <div class="print-summary">
        <div class="print-summary-item"><strong>${toArabicDigits(state.students.length)}</strong><span>الطالبات</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(skills.length)}</strong><span>المهارات</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(rated.length)}</strong><span>خلايا مرصودة</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(mastery)}٪</strong><span>إتقان فأعلى</span></div>
      </div>
      <table class="print-table"><thead><tr><th class="student-print-name">الطالبة</th>${header}</tr></thead><tbody>${rows}</tbody></table>
      ${printFooter()}`);
  }

  function printDailySheet() {
    const date = $('#dailyDate')?.value || todayISO();
    const skillId = $('#dailySkill')?.value || state.skills[0]?.id;
    const skill = state.skills.find(item => item.id === skillId);
    const students = state.students.length ? state.students : Array.from({ length: 20 }, (_, index) => ({ id: `blank-${index}`, name: '' }));
    const rows = students.map((student, index) => {
      const entry = state.students.length ? getEntryForDate(student.id, skillId, date) : null;
      const mode = entry?.learningModes?.map(id => LEARNING_MODES.find(item => item.id === id)?.label).filter(Boolean).join('، ') || '';
      const errors = entry?.errorCodes?.map(id => ERROR_CODES.find(item => item.id === id)?.code).filter(Boolean).join('، ') || '';
      return `<tr>
        <td>${toArabicDigits(index + 1)}</td>
        <td class="student-print-name">${escapeHTML(student.name)}</td>
        <td>${entry?.preLevel ? LEVELS[entry.preLevel].name : ''}</td>
        <td class="print-level-cell print-level-${entry?.postLevel || 0}">${entry?.absent ? 'غائبة' : entry?.postLevel ? LEVELS[entry.postLevel].name : ''}</td>
        <td>${escapeHTML(mode)}</td>
        <td>${escapeHTML(errors)}</td>
        <td>${escapeHTML(entry?.action || '')}</td>
      </tr>`;
    }).join('');

    launchPrint(`
      ${printHeader('ورقة المتابعة اليومية', `${skill?.name || 'المهارة: __________________'} — ${formatDate(date)}`)}
      <table class="print-table">
        <thead><tr><th>م</th><th class="student-print-name">الطالبة</th><th>قبلي</th><th>بعد التعلم</th><th>الطريقة المساعدة</th><th>بصمة الخطأ</th><th>الإجراء التالي</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <section class="print-section"><h2>ملاحظات الحصة وخطة الحصة القادمة</h2><div class="print-note-box"></div></section>
      ${printFooter()}`);
  }

  function printSupportReport() {
    const records = [];
    state.students.forEach(student => {
      state.skills.forEach(skill => {
        const entry = getLatestEntry(student.id, skill.id, todayISO(), false);
        if (entry && Number(entry.postLevel) <= 2) records.push({ student, skill, entry });
      });
    });
    records.sort((a, b) => Number(a.entry.postLevel) - Number(b.entry.postLevel) || a.student.name.localeCompare(b.student.name, 'ar'));

    const rows = records.length ? records.map((item, index) => {
      const errors = (item.entry.errorCodes || []).map(id => {
        const error = ERROR_CODES.find(e => e.id === id);
        return error ? `${error.code} — ${error.label}` : id;
      }).join('، ');
      return `<tr><td>${toArabicDigits(index + 1)}</td><td class="student-print-name">${escapeHTML(item.student.name)}</td><td>${escapeHTML(item.skill.name)}</td><td class="print-level-cell print-level-${item.entry.postLevel}">${LEVELS[item.entry.postLevel].name}</td><td>${escapeHTML(errors || 'غير محدد')}</td><td>${escapeHTML(item.entry.action || generateSuggestion(item.entry))}</td><td>${escapeHTML(formatDate(item.entry.date))}</td></tr>`;
    }).join('') : '<tr><td colspan="7">لا توجد حالات دعم حالية بحسب أحدث رصد.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير الدعم العلاجي', 'الأولويات والإجراءات المقترحة بحسب أحدث رصد')}
      <table class="print-table"><thead><tr><th>م</th><th class="student-print-name">الطالبة</th><th>المهارة</th><th>المستوى</th><th>بصمة الخطأ</th><th>الإجراء التالي</th><th>آخر رصد</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="print-section"><h2>خطة المتابعة</h2><div class="print-note-box"></div></section>
      ${printFooter()}`);
  }

  function printEnrichmentReport() {
    const records = [];
    state.students.forEach(student => {
      state.skills.forEach(skill => {
        const entry = getLatestEntry(student.id, skill.id, todayISO(), false);
        if (entry && Number(entry.postLevel) === 4) records.push({ student, skill, entry });
      });
    });
    records.sort((a, b) => a.student.name.localeCompare(b.student.name, 'ar'));

    const rows = records.length ? records.map((item, index) => `<tr><td>${toArabicDigits(index + 1)}</td><td class="student-print-name">${escapeHTML(item.student.name)}</td><td>${escapeHTML(item.skill.name)}</td><td>${escapeHTML(item.entry.action || generateSuggestion(item.entry))}</td><td>${escapeHTML(formatDate(item.entry.date))}</td></tr>`).join('') : '<tr><td colspan="5">لا توجد مهارات في مستوى الامتداد حتى الآن.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير الإثراء والامتداد', 'مهام مقترحة للطالبات الجاهزات للتحدي')}
      <table class="print-table"><thead><tr><th>م</th><th class="student-print-name">الطالبة</th><th>المهارة</th><th>مهمة الامتداد المقترحة</th><th>آخر رصد</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="print-section"><h2>أفكار إثرائية إضافية</h2><div class="print-note-box">تأليف مسألة — حل بأكثر من استراتيجية — اكتشاف خطأ وتفسيره — تصميم لعبة رياضية — ربط المهارة بموقف حياتي.</div></section>
      ${printFooter()}`);
  }

  function printStudentCard(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    const summary = calculateStudentSummaries().find(item => item.student.id === studentId);
    const entries = state.entries.filter(entry => entry.studentId === studentId).sort(sortEntriesDescending).slice(0, 12);
    const skillRows = state.skills.map(skill => {
      const entry = getLatestEntry(student.id, skill.id, todayISO(), false);
      const level = entry ? Number(entry.postLevel) : 0;
      return `<tr><td class="student-print-name">${escapeHTML(skill.name)}</td><td class="print-level-cell print-level-${level}">${level ? LEVELS[level].name : 'لم تُرصد'}</td><td>${entry ? escapeHTML(formatDate(entry.date)) : ''}</td><td>${entry ? escapeHTML(entry.action || '') : ''}</td></tr>`;
    }).join('');
    const historyRows = entries.length ? entries.map((entry, index) => {
      const skill = state.skills.find(item => item.id === entry.skillId);
      const errors = (entry.errorCodes || []).map(id => ERROR_CODES.find(item => item.id === id)?.code).filter(Boolean).join('، ');
      return `<tr><td>${toArabicDigits(index + 1)}</td><td>${escapeHTML(formatDate(entry.date))}</td><td>${escapeHTML(skill?.name || 'مهارة محذوفة')}</td><td>${entry.absent ? 'غائبة' : entry.postLevel ? LEVELS[entry.postLevel].name : ''}</td><td>${escapeHTML(errors)}</td><td>${escapeHTML(entry.note || '')}</td></tr>`;
    }).join('') : '<tr><td colspan="6">لا توجد متابعات بعد.</td></tr>';

    launchPrint(`
      ${printHeader(`بطاقة الطالبة: ${student.name}`, [state.settings.grade, state.settings.className].filter(Boolean).join(' — '))}
      <div class="print-summary">
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.ratedCount || 0)}</strong><span>مهارة مرصودة</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.average ? summary.average.toFixed(1) : '—')}</strong><span>متوسط التقدم</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.supportCount || 0)}</strong><span>مهارة تحتاج دعمًا</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.enrichmentCount || 0)}</strong><span>فرصة إثراء</span></div>
      </div>
      ${student.note ? `<section class="print-section"><h2>ملاحظة عامة</h2><div class="print-note-box">${escapeHTML(student.note)}</div></section>` : ''}
      <section class="print-section"><h2>ملخص المهارات</h2><table class="print-table"><thead><tr><th class="student-print-name">المهارة</th><th>المستوى</th><th>آخر رصد</th><th>الخطوة التالية</th></tr></thead><tbody>${skillRows}</tbody></table></section>
      <section class="print-section"><h2>أحدث المتابعات</h2><table class="print-table"><thead><tr><th>م</th><th>التاريخ</th><th>المهارة</th><th>المستوى</th><th>الخطأ</th><th>الملاحظة</th></tr></thead><tbody>${historyRows}</tbody></table></section>
      ${printFooter()}`);
  }

  function showToast(message, type = '') {
    const toast = $('#toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast show ${type}`.trim();
    toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3200);
  }

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      const button = $('#installAppButton');
      if (button) button.hidden = false;
    });

    $('#installAppButton')?.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        showToast('يمكن تثبيت التطبيق من قائمة المتصفح ثم «تثبيت التطبيق».', 'warning');
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $('#installAppButton').hidden = true;
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      if ($('#installAppButton')) $('#installAppButton').hidden = true;
      showToast('تم تثبيت التطبيق بنجاح.', 'success');
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('تعذر تسجيل خدمة العمل دون إنترنت:', error));
    }
  }

  async function openMediaDatabase() {
    return await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(MEDIA_STORE)) db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function putMedia(blob, name, type) {
    const record = { id: uid('media'), blob, name: name || 'مرفق', type: type || blob.type || 'application/octet-stream', createdAt: new Date().toISOString() };
    await putMediaRecord(record);
    return { id: record.id, name: record.name, type: record.type, createdAt: record.createdAt };
  }

  async function putMediaRecord(record) {
    const db = await openMediaDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      transaction.objectStore(MEDIA_STORE).put(record);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  }

  async function getMedia(id) {
    if (!id) return null;
    const db = await openMediaDatabase();
    const result = await new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readonly');
      const request = transaction.objectStore(MEDIA_STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  }

  async function deleteMedia(id) {
    if (!id) return;
    const db = await openMediaDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      transaction.objectStore(MEDIA_STORE).delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  }

  async function clearMediaDatabase() {
    const db = await openMediaDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      transaction.objectStore(MEDIA_STORE).clear();
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  }

  async function hydrateMedia(root = document) {
    const elements = $$('[data-media-id]', root);
    for (const element of elements) {
      const record = await getMedia(element.dataset.mediaId);
      if (!record?.blob) continue;
      const url = URL.createObjectURL(record.blob);
      objectUrls.add(url);
      element.src = url;
    }
  }

  function revokeObjectUrls() {
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    objectUrls.clear();
  }
})();
