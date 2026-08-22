(() => {
  'use strict';

  const APP_KEY = 'math_compass_tracker_state_v1';
  const DB_NAME = 'math_compass_media_v1';
  const DB_VERSION = 1;
  const MEDIA_STORE = 'media';
  const AVATAR_PATH = './assets/avatars/';
  const AVATAR_PRESETS = [
    { id: 'avatar-01', label: 'مستكشف الأعداد' },
    { id: 'avatar-02', label: 'محلل الأنماط' },
    { id: 'avatar-03', label: 'خبير القياس' },
    { id: 'avatar-04', label: 'مفكر هندسي' },
    { id: 'avatar-05', label: 'باحث عن الحل' },
    { id: 'avatar-06', label: 'نجمة الكسور' },
    { id: 'avatar-07', label: 'صديق الأرقام' },
    { id: 'avatar-08', label: 'بطل المثابرة' },
    { id: 'avatar-09', label: 'مبدع المسائل' },
    { id: 'avatar-10', label: 'مفسر بارع' },
    { id: 'avatar-11', label: 'محقق رياضي' },
    { id: 'avatar-12', label: 'قائد التحدي' }
  ];

  const LEVELS = {
    1: { name: 'أبدأ', emoji: '🌱', short: 'دعم', description: 'بحاجة إلى دعم' },
    2: { name: 'أتقدم', emoji: '🌿', short: 'تقدّم', description: 'يتعلم بمساندة' },
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
    { id: 'T', code: 'ت', label: 'التفسير والتبرير', action: 'طلب تفسير شفهي أو كتابي: كيف عرفت؟ ولماذا كانت الإجابة منطقية؟' },
    { id: 'N', code: 'ن', label: 'تنظيم الخطوات', action: 'استخدام منظم بصري أو مربعات مرتبة لكتابة الخطوات والتحقق من كل خطوة.' },
    { id: 'D', code: 'د', label: 'تثبيت وتدريب', action: 'تطبيق تدريب موزع قصير في بداية الحصص القادمة بدل التكرار المكثف في حصة واحدة.' }
  ];


  const NOTE_OTHER_VALUE = '__other__';
  const STUDENT_NOTE_CATEGORIES = [
    {
      id: 'academic',
      label: 'التقدم الأكاديمي',
      options: [
        { id: 'mastered', label: 'متقن للمهارة' },
        { id: 'progressing', label: 'يتقدم بمساندة' },
        { id: 'needs_practice', label: 'يحتاج إلى تدريب إضافي' },
        { id: 'needs_reteach', label: 'يحتاج إلى إعادة شرح' },
        { id: 'needs_individual', label: 'يحتاج إلى متابعة فردية' },
        { id: 'improved', label: 'تحسن ملحوظ' },
        { id: 'basic_errors', label: 'يخطئ في العمليات الأساسية' },
        { id: 'organize_steps', label: 'يحتاج إلى تنظيم خطوات الحل' }
      ]
    },
    {
      id: 'learning',
      label: 'الاستجابة لطرائق التعلم',
      options: [
        { id: 'hands_on', label: 'يستفيد من المحسوسات' },
        { id: 'visual', label: 'يستفيد من التمثيل البصري' },
        { id: 'oral', label: 'يستفيد من الشرح الشفهي' },
        { id: 'written', label: 'يستفيد من الخطوات المكتوبة' },
        { id: 'digital', label: 'يستفيد من النشاط الرقمي' },
        { id: 'cooperative', label: 'يستفيد من العمل التعاوني' }
      ]
    },
    {
      id: 'participation',
      label: 'المشاركة والاستقلالية',
      options: [
        { id: 'active', label: 'متفاعل داخل الحصة' },
        { id: 'low_participation', label: 'يحتاج إلى رفع مستوى المشاركة' },
        { id: 'cooperates', label: 'يتعاون مع زملائه' },
        { id: 'focus', label: 'يحتاج إلى تحسين التركيز' },
        { id: 'on_time', label: 'ينجز المهام في الوقت المحدد' },
        { id: 'task_followup', label: 'يحتاج إلى متابعة إنجاز المهام' }
      ]
    },
    {
      id: 'support',
      label: 'الدعم والمتابعة',
      options: [
        { id: 'remedial_short', label: 'يحتاج إلى دعم علاجي قصير' },
        { id: 'home_followup', label: 'يحتاج إلى متابعة منزلية' },
        { id: 'confidence', label: 'يحتاج إلى تعزيز الثقة' },
        { id: 'distributed_practice', label: 'يحتاج إلى تكرار التدريب بصورة موزعة' },
        { id: 'alternate_method', label: 'يحتاج إلى تغيير طريقة عرض المهارة' }
      ]
    },
    {
      id: 'enrichment',
      label: 'الإثراء والتميز',
      options: [
        { id: 'distinguished', label: 'متميز ويستحق مهمة إثرائية' },
        { id: 'multiple_strategies', label: 'يحل بأكثر من استراتيجية' },
        { id: 'justifies', label: 'يبرر الإجابة بوضوح' },
        { id: 'fast_accurate', label: 'ينجز المهمة بسرعة ودقة' },
        { id: 'deeper_challenge', label: 'جاهز لتحدٍ رياضي أعمق' }
      ]
    },
    {
      id: 'attendance',
      label: 'الحضور والإنجاز',
      options: [
        { id: 'absent_assessment', label: 'غاب عن التقييم' },
        { id: 'not_completed', label: 'لم ينجز المهمة' },
        { id: 'completed_after_guidance', label: 'أكمل المهمة بعد التوجيه' },
        { id: 'needs_completion', label: 'يحتاج إلى استكمال النشاط' }
      ]
    },
    { id: 'other', label: 'أخرى', options: [] }
  ];


  const REWARD_TYPES = {
    star: { id: 'star', icon: '⭐', label: 'نجمة', points: 1 },
    glow_star: { id: 'glow_star', icon: '🌟', label: 'نجمة تميز', points: 2 },
    badge: { id: 'badge', icon: '🏅', label: 'وسام', points: 3 }
  };

  const MOTIVATION_BADGES = [
    { id: 'perseverance', icon: '🌱', label: 'وسام المثابر', description: 'استمر في المحاولة ولم يستسلم.' },
    { id: 'thinker', icon: '🧠', label: 'وسام المفكر الرياضي', description: 'اختار استراتيجية ذكية ومناسبة.' },
    { id: 'explainer', icon: '💬', label: 'وسام المفسر البارع', description: 'شرح خطوات الحل وفسرها بوضوح.' },
    { id: 'accuracy', icon: '🎯', label: 'وسام الدقة', description: 'أنجز الحل بصورة صحيحة ومنظمة.' },
    { id: 'progress', icon: '📈', label: 'وسام التقدم', description: 'انتقل إلى مستوى أعلى في المهارة.' },
    { id: 'investigator', icon: '🔍', label: 'وسام المحقق', description: 'اكتشف خطأ وصححه وفسر سبب التصحيح.' },
    { id: 'flexibility', icon: '🔄', label: 'وسام المرونة', description: 'حل الموقف بأكثر من استراتيجية.' },
    { id: 'cooperation', icon: '🤝', label: 'وسام المتعاون', description: 'دعم زملاءه وعمل بروح الفريق.' },
    { id: 'creativity', icon: '💎', label: 'وسام الإبداع', description: 'قدم فكرة أو حلاً غير تقليدي.' },
    { id: 'independence', icon: '🧭', label: 'وسام الاستقلالية', description: 'أنجز المهمة بثقة واستقلالية.' },
    { id: 'mastery', icon: '⭐', label: 'وسام الإتقان', description: 'أتقن المهارة وطبقها بصورة مستقلة.' }
  ];

  const MOTIVATION_REASONS = [
    { id: 'progress', label: 'أظهر تحسنًا ملحوظًا' },
    { id: 'mastery', label: 'أتقن المهارة' },
    { id: 'explanation', label: 'شرح الحل بوضوح' },
    { id: 'strategy', label: 'استخدم استراتيجية مناسبة' },
    { id: 'multiple_methods', label: 'حل بأكثر من طريقة' },
    { id: 'verification', label: 'تحقق من صحة الإجابة' },
    { id: 'perseverance', label: 'أظهر مثابرة في حل المسألة' },
    { id: 'participation', label: 'شارك بفاعلية' },
    { id: 'cooperation', label: 'تعاون مع زملائه' },
    { id: 'independence', label: 'أنجز المهمة باستقلالية' },
    { id: 'creativity', label: 'قدم فكرة إبداعية' },
    { id: 'homework', label: 'التزم بأداء الواجب' },
    { id: 'organization', label: 'نظم خطوات الحل بصورة واضحة' },
    { id: 'other', label: 'أخرى' }
  ];

  const GROUP_CRITERIA = [
    { id: 'cooperation', icon: '🤝', label: 'التعاون' },
    { id: 'quality', icon: '✨', label: 'جودة الإنجاز' },
    { id: 'accuracy', icon: '✅', label: 'صحة الحل' },
    { id: 'explanation', icon: '💬', label: 'تفسير الإجابة' },
    { id: 'organization', icon: '🗂️', label: 'تنظيم العمل' },
    { id: 'perseverance', icon: '🌱', label: 'المثابرة' },
    { id: 'rules', icon: '🎯', label: 'الالتزام بقواعد النشاط' }
  ];

  const DEFAULT_SKILLS = [
    { domain: 'الأعداد والقيمة المنزلية', name: 'قراءة الأعداد وكتابتها', description: 'يقرأ الطالب العدد ويمثله ويكتبه بصيغ متعددة.' },
    { domain: 'الأعداد والقيمة المنزلية', name: 'القيمة المنزلية', description: 'يحدد قيمة الرقم بحسب منزلته ويمثل العدد.' },
    { domain: 'الأعداد والقيمة المنزلية', name: 'مقارنة الأعداد وترتيبها', description: 'يقارن الأعداد ويستخدم الرموز ويرتبها.' },
    { domain: 'الجمع والطرح', name: 'الجمع', description: 'يختار استراتيجية مناسبة ويتحقق من معقولية الناتج.' },
    { domain: 'الجمع والطرح', name: 'الطرح', description: 'يطرح بدقة ويربط الطرح بالجمع عند التحقق.' },
    { domain: 'الضرب والقسمة', name: 'الضرب', description: 'يمثل الضرب ويستعمل الحقائق الأساسية.' },
    { domain: 'الضرب والقسمة', name: 'القسمة', description: 'يمثل القسمة ويربطها بالضرب.' },
    { domain: 'حل المسألة', name: 'حل المسألة اللفظية', description: 'يفهم المطلوب ويختار الخطة ويفسر الإجابة.' },
    { domain: 'القياس', name: 'الطول والكتلة والسعة', description: 'يختار الوحدة المناسبة ويقيس ويقارن.' },
    { domain: 'القياس', name: 'الزمن والنقود', description: 'يقرأ الوقت ويتعامل مع القيم النقدية في مواقف حياتية.' },
    { domain: 'الهندسة', name: 'الأشكال الهندسية', description: 'يصف الأشكال والمجسمات ويصنفها حسب خصائصها.' },
    { domain: 'البيانات', name: 'قراءة البيانات وتمثيلها', description: 'يقرأ الجداول والرسوم ويستنتج منها.' },
    { domain: 'الكسور', name: 'الكسور', description: 'يمثل الكسور ويقارنها في نماذج بسيطة.' }
  ];

  const DEFAULT_STATE = {
    version: 4,
    settings: {
      teacher: '',
      school: '',
      grade: '',
      className: '',
      semester: '',
      subject: 'الرياضيات',
      reportTitle: 'سجل المتابعة اليومية لمادة الرياضيات',
      showAvatarsInApp: true,
      showAvatarsInDashboard: true,
      showAvatarsInPrint: false,
      includePhotosInBackup: false
    },
    students: [],
    skills: DEFAULT_SKILLS.map((skill, index) => ({
      id: `skill-default-${index + 1}`,
      ...skill,
      createdAt: new Date().toISOString()
    })),
    entries: [],
    motivation: {
      rewards: [],
      groups: [],
      suggestions: []
    }
  };

  let state = loadState();
  let currentView = 'dashboard';
  let currentMotivationMode = 'students';
  let deferredInstallPrompt = null;
  let mediaRecorder = null;
  let recordingStream = null;
  let recordingChunks = [];
  let recordingTimer = null;
  let recordingStartedAt = 0;
  let pendingAudio = null;
  let discardRecordingAfterStop = false;
  let pendingImages = [];
  let pendingStudentAvatar = null;
  let studentAvatarPreviewUrl = '';
  const avatarObjectUrls = new Map();
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

  function avatarPresetPath(presetId) {
    const resolved = AVATAR_PRESETS.some(item => item.id === presetId) ? presetId : AVATAR_PRESETS[0].id;
    return `${AVATAR_PATH}${resolved}.svg`;
  }

  function studentInitial(student = {}) {
    return String(student.name || '').trim().charAt(0) || 'ط';
  }

  function defaultAvatarPresetId(student = {}, index = 0) {
    const source = String(student.id || student.name || index || 'student');
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) hash = ((hash << 5) - hash + source.charCodeAt(i)) | 0;
    return AVATAR_PRESETS[Math.abs(hash) % AVATAR_PRESETS.length].id;
  }

  function normalizeStudentAvatar(avatar, student = {}, index = 0) {
    const legacyPreset = typeof avatar === 'string' && AVATAR_PRESETS.some(item => item.id === avatar) ? avatar : '';
    const source = avatar && typeof avatar === 'object' ? avatar : {};
    const presetId = AVATAR_PRESETS.some(item => item.id === source.presetId)
      ? source.presetId
      : (legacyPreset || defaultAvatarPresetId(student, index));
    const requestedMode = source.mode || source.type || (legacyPreset ? 'preset' : 'preset');
    const mode = ['preset', 'photo', 'initial'].includes(requestedMode) ? requestedMode : 'preset';
    const mediaId = String(source.mediaId || '').trim();
    return {
      mode: mode === 'photo' && !mediaId ? 'preset' : mode,
      presetId,
      mediaId: mode === 'photo' ? mediaId : '',
      mediaName: mode === 'photo' ? String(source.mediaName || '') : '',
      mediaType: mode === 'photo' ? String(source.mediaType || '') : '',
      updatedAt: String(source.updatedAt || '')
    };
  }

  function shouldDisplayStudentAvatar(context = 'app') {
    if (context === 'print') return Boolean(state.settings.showAvatarsInPrint);
    if (context === 'dashboard') return Boolean(state.settings.showAvatarsInDashboard);
    return Boolean(state.settings.showAvatarsInApp);
  }

  function studentAvatarHTML(student, { className = '', context = 'app', label = '' } = {}) {
    if (!student || !shouldDisplayStudentAvatar(context)) return '';
    const avatar = normalizeStudentAvatar(student.avatar, student);
    const classes = ['avatar', 'student-avatar', className].filter(Boolean).join(' ');
    const accessibleLabel = label || `الصورة التعريفية للطالب ${student.name || ''}`;
    const fallbackImage = `<img class="student-avatar-fallback-image" src="${escapeHTML(avatarPresetPath(avatar.presetId))}" alt="" aria-hidden="true" />`;

    if (avatar.mode === 'photo' && avatar.mediaId) {
      return `<span class="${classes} student-avatar-photo" data-avatar-wrapper="${escapeHTML(avatar.mediaId)}">
        <span class="student-avatar-fallback">${fallbackImage}</span>
        <img class="student-avatar-image" data-avatar-media-id="${escapeHTML(avatar.mediaId)}" alt="${escapeHTML(accessibleLabel)}" />
      </span>`;
    }

    if (avatar.mode === 'initial') {
      return `<span class="${classes} student-avatar-initial" role="img" aria-label="${escapeHTML(accessibleLabel)}"><span>${escapeHTML(studentInitial(student))}</span></span>`;
    }

    return `<span class="${classes} student-avatar-preset" role="img" aria-label="${escapeHTML(accessibleLabel)}"><img class="student-avatar-image preset-image" src="${escapeHTML(avatarPresetPath(avatar.presetId))}" alt="" aria-hidden="true" /></span>`;
  }

  function studentIdentityHTML(student, { context = 'app', className = '' } = {}) {
    return `<span class="student-identity ${escapeHTML(className)}">${studentAvatarHTML(student, { context })}<span>${escapeHTML(student?.name || '')}</span></span>`;
  }

  function printStudentIdentity(student) {
    if (!student?.name) return '';
    return `<span class="print-student-identity">${studentAvatarHTML(student, { context: 'print', className: 'print-student-avatar' })}<span>${escapeHTML(student.name)}</span></span>`;
  }

  async function hydrateStudentAvatars(root = document) {
    const images = $$('img[data-avatar-media-id]', root);
    for (const image of images) {
      const mediaId = image.dataset.avatarMediaId;
      if (!mediaId) continue;
      let url = avatarObjectUrls.get(mediaId);
      if (!url) {
        try {
          const record = await getMedia(mediaId);
          if (!record?.blob) continue;
          url = URL.createObjectURL(record.blob);
          avatarObjectUrls.set(mediaId, url);
        } catch (error) {
          console.warn('تعذر تحميل صورة الطالب:', error);
          continue;
        }
      }
      const wrapper = image.closest('[data-avatar-wrapper]');
      const markLoaded = () => wrapper?.classList.add('avatar-loaded');
      if (image.src !== url) {
        image.addEventListener('load', markLoaded, { once: true });
        image.addEventListener('error', () => wrapper?.classList.remove('avatar-loaded'), { once: true });
        image.src = url;
      } else if (image.complete && image.naturalWidth) {
        markLoaded();
      }
    }
  }

  function revokeAvatarObjectUrl(mediaId) {
    const url = avatarObjectUrls.get(mediaId);
    if (url) URL.revokeObjectURL(url);
    avatarObjectUrls.delete(mediaId);
  }

  function revokeAllAvatarObjectUrls() {
    avatarObjectUrls.forEach(url => URL.revokeObjectURL(url));
    avatarObjectUrls.clear();
  }

  function normalizeState() {
    if (!state || typeof state !== 'object') state = structuredCloneSafe(DEFAULT_STATE);
    state.settings = { ...DEFAULT_STATE.settings, ...(state.settings || {}) };
    state.students = Array.isArray(state.students) ? state.students : [];
    state.students.forEach((student, index) => {
      if (student.note && !student.noteCategory && !student.noteChoice && !student.noteOther) {
        student.noteCategory = 'other';
        student.noteChoice = NOTE_OTHER_VALUE;
        student.noteOther = student.note;
      }
      student.noteCategory = student.noteCategory || '';
      student.noteChoice = student.noteChoice || '';
      student.noteOther = student.noteOther || '';
      student.note = getStudentNoteText(student);
      student.avatar = normalizeStudentAvatar(student.avatar, student, index);
    });
    state.skills = Array.isArray(state.skills) && state.skills.length ? state.skills : structuredCloneSafe(DEFAULT_STATE.skills);
    state.entries = Array.isArray(state.entries) ? state.entries : [];
    state.motivation = state.motivation && typeof state.motivation === 'object' ? state.motivation : {};
    state.motivation.rewards = Array.isArray(state.motivation.rewards) ? state.motivation.rewards : [];
    state.motivation.groups = Array.isArray(state.motivation.groups) ? state.motivation.groups : [];
    state.motivation.suggestions = Array.isArray(state.motivation.suggestions) ? state.motivation.suggestions : [];
    state.motivation.groups.forEach(group => {
      group.memberIds = Array.isArray(group.memberIds) ? group.memberIds.filter(id => state.students.some(student => student.id === id)) : [];
    });
    state.motivation.rewards = state.motivation.rewards.filter(reward => {
      if (reward.targetType === 'student') return state.students.some(student => student.id === reward.targetId);
      if (reward.targetType === 'group') return state.motivation.groups.some(group => group.id === reward.targetId);
      return false;
    });
    state.motivation.rewards.forEach(reward => {
      const linkedSkill = state.skills.find(skill => skill.id === reward.skillId);
      reward.skillName = reward.skillName || linkedSkill?.name || '';
      reward.reasonText = reward.reasonText || MOTIVATION_REASONS.find(item => item.id === reward.reasonId)?.label || '';
      reward.points = Number.isFinite(Number(reward.points)) ? Number(reward.points) : (REWARD_TYPES[reward.rewardType]?.points || 0);
    });
    state.motivation.suggestions = state.motivation.suggestions.filter(suggestion => state.students.some(student => student.id === suggestion.studentId));
    state.version = 4;
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
      showToast('تعذر الحفظ؛ قد تكون مساحة التخزين ممتلئة. صدّر نسخة احتياطية.', 'error');
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
    $('#studentAvatarFileInput')?.addEventListener('change', handleStudentAvatarSelection);
    $('#studentAvatarCameraInput')?.addEventListener('change', handleStudentAvatarSelection);
    $('#studentName')?.addEventListener('input', updateStudentAvatarInitialPreview);
    $('#studentNoteCategory')?.addEventListener('change', () => renderStudentNoteChoices($('#studentNoteCategory')?.value || ''));
    $('#studentNoteChoice')?.addEventListener('change', toggleStudentNoteOther);
    $('#saveBulkStudentsButton')?.addEventListener('click', saveBulkStudents);
    $('#saveSkillButton')?.addEventListener('click', saveSkillFromDialog);
    $('#saveBulkSkillsButton')?.addEventListener('click', saveBulkSkills);
    $('#saveQuickEntriesButton')?.addEventListener('click', saveQuickEntries);
    $('#saveEntryButton')?.addEventListener('click', saveDetailedEntry);
    $('#saveRewardButton')?.addEventListener('click', saveRewardFromDialog);
    $('#saveMotivationGroupButton')?.addEventListener('click', saveMotivationGroup);
    $('#rewardType')?.addEventListener('change', updateRewardDialogFields);
    $('#rewardReason')?.addEventListener('change', updateRewardDialogFields);
    $('#rewardTargetPicker')?.addEventListener('change', updateRewardTargetFromPicker);
    $('#regenerateSuggestionButton')?.addEventListener('click', () => {
      $('#entryAction').value = generateSuggestion(collectEntryFormData(false));
    });

    $('#studentSearch')?.addEventListener('input', renderStudents);
    $('#dashboardSkillFilter')?.addEventListener('change', renderDashboard);
    $('#dashboardDateFilter')?.addEventListener('change', renderDashboard);
    $('#dailyDate')?.addEventListener('change', renderDaily);
    $('#dailySkill')?.addEventListener('change', renderDaily);
    $('#dailyAssessmentTool')?.addEventListener('change', renderDaily);
    $('#motivationStudentSearch')?.addEventListener('input', renderMotivation);
    $('#motivationSkillFilter')?.addEventListener('change', renderMotivation);
    $('#motivationPeriodFilter')?.addEventListener('change', renderMotivation);
    $('#motivationStudentSort')?.addEventListener('change', renderMotivation);

    $('#entryImageInput')?.addEventListener('change', handleImageSelection);
    $('#startRecordingButton')?.addEventListener('click', startRecording);
    $('#stopRecordingButton')?.addEventListener('click', stopRecording);
    $('#discardRecordingButton')?.addEventListener('click', discardPendingRecording);

    $('#backupFileInput')?.addEventListener('change', importBackupFromFile);

    $('#entryAbsent')?.addEventListener('change', updateEntryFormForAbsence);

    $('#studentDialog')?.addEventListener('close', clearPendingStudentAvatar);
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
      case 'select-student-avatar-mode': setPendingStudentAvatarMode(actionButton.dataset.avatarMode); break;
      case 'select-student-avatar-preset': selectPendingStudentAvatarPreset(actionButton.dataset.avatarPreset); break;
      case 'remove-student-avatar-photo': removePendingStudentAvatarPhoto(); break;
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
      case 'switch-motivation-mode': switchMotivationMode(actionButton.dataset.mode); break;
      case 'award-from-header': openRewardForHeader(); break;
      case 'award-student': openRewardDialog({ targetType: 'student', targetId: actionButton.dataset.studentId, rewardType: actionButton.dataset.rewardType || 'star' }); break;
      case 'award-group': openRewardDialog({ targetType: 'group', targetId: actionButton.dataset.groupId, rewardType: actionButton.dataset.rewardType || 'star', criterionId: actionButton.dataset.criterionId || '' }); break;
      case 'add-motivation-group': openMotivationGroupDialog(); break;
      case 'edit-motivation-group': openMotivationGroupDialog(actionButton.dataset.groupId); break;
      case 'delete-motivation-group': deleteMotivationGroup(actionButton.dataset.groupId); break;
      case 'open-reward-history': openRewardHistory(actionButton.dataset.targetType, actionButton.dataset.targetId); break;
      case 'close-reward-history': $('#rewardHistoryDialog')?.close(); break;
      case 'delete-reward': deleteReward(actionButton.dataset.rewardId); break;
      case 'approve-reward-suggestion': approveRewardSuggestion(actionButton.dataset.suggestionId); break;
      case 'dismiss-reward-suggestion': dismissRewardSuggestion(actionButton.dataset.suggestionId); break;
      case 'print-dashboard': printDashboard(); break;
      case 'print-daily-sheet': printDailySheet(); break;
      case 'print-support-report': printSupportReport(); break;
      case 'print-enrichment-report': printEnrichmentReport(); break;
      case 'print-motivation-students': printMotivationStudents(); break;
      case 'print-motivation-groups': printMotivationGroups(); break;
      case 'print-selected-student': {
        const studentId = $('#reportStudentSelect')?.value;
        if (studentId) printStudentCard(studentId); else showToast('اختر طالبًا أولًا.', 'warning');
        break;
      }
      case 'print-student': printStudentCard(actionButton.dataset.studentId); break;
      case 'export-csv': exportCSV(); break;
      case 'export-motivation-csv': exportMotivationCSV(); break;
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
    if (view === 'motivation') renderMotivation();
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
    renderMotivation();
    renderStudents();
    renderSkills();
    renderReports();
    renderSettings();
    hydrateStudentAvatars(document).catch(error => console.warn('تعذر تحديث صور الطلاب:', error));
  }

  function renderContext() {
    const classParts = [state.settings.grade, state.settings.className].filter(Boolean);
    $('#contextClassName').textContent = classParts.length ? classParts.join(' — ') : 'الفصل غير محدد';
    $('#contextTeacherName').textContent = state.settings.teacher || 'أضف بياناتك من الإعدادات';
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

    const motivationFilter = $('#motivationSkillFilter');
    const previousMotivationFilter = motivationFilter?.value || 'all';
    if (motivationFilter) {
      motivationFilter.innerHTML = '<option value="all">جميع المهارات</option>' + state.skills.map(skill => `<option value="${escapeHTML(skill.id)}">${escapeHTML(skill.name)}</option>`).join('');
      motivationFilter.value = state.skills.some(skill => skill.id === previousMotivationFilter) ? previousMotivationFilter : 'all';
    }

    const rewardSkill = $('#rewardSkill');
    const previousRewardSkill = rewardSkill?.value || '';
    if (rewardSkill) {
      rewardSkill.innerHTML = '<option value="">اختر المهارة</option>' + state.skills.map(skill => `<option value="${escapeHTML(skill.id)}">${escapeHTML(skill.name)}</option>`).join('');
      rewardSkill.value = state.skills.some(skill => skill.id === previousRewardSkill) ? previousRewardSkill : '';
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
      statCard('◉', toArabicDigits(state.students.length), 'عدد الطلاب', 'rgba(15,118,110,0.11)'),
      statCard('✓', toArabicDigits(todayEntries), 'عمليات الرصد اليوم', 'rgba(201,154,46,0.14)'),
      statCard('⭐', `${toArabicDigits(masteryRate)}٪`, 'نسبة الإتقان فأعلى', 'rgba(45,157,104,0.12)'),
      statCard('🌱', toArabicDigits(supportStudents), 'أولوية دعم حالية', 'rgba(233,107,132,0.12)')
    ].join('');

    renderHeatmap(matrix, visibleSkills);
    renderDistribution(ratedItems);
    renderFlexibleGroups(maxDate, skillFilter);
    renderPriorityLists(maxDate);
    hydrateStudentAvatars($('#view-dashboard') || document).catch(error => console.warn('تعذر تحديث صور لوحة الفصل:', error));
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
      container.innerHTML = emptyState('لا يوجد طلاب بعد', 'أضف قائمة الطلاب لتظهر خريطة التقدم.');
      return;
    }

    if (!skills.length) {
      container.innerHTML = emptyState('لا توجد مهارات', 'أضف مهارة واحدة على الأقل من صفحة المهارات.');
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
      return `<tr><td class="student-name-cell">${studentIdentityHTML(row.student, { context: 'dashboard', className: 'heatmap-student-identity' })}</td>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      <table class="heatmap-table">
        <thead><tr><th class="student-name-cell">الطالب</th>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderDistribution(ratedItems) {
    const container = $('#levelDistribution');
    if (!container) return;
    const total = ratedItems.length;
    if (!total) {
      container.innerHTML = emptyState('لا توجد بيانات كافية', 'ابدأ أول رصد ليظهر توزيع المستويات.');
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
      container.innerHTML = emptyState('لم تتكوّن المجموعات بعد', 'أضف رصدًا للطلاب لتظهر المجموعات المرنة.');
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
    enrichmentContainer.innerHTML = enrichment.length ? enrichment.map(item => personRow(item, 'enrichment')).join('') : emptyState('لا توجد فرص إثراء محددة', 'سيظهر الطلاب الجاهزون بعد الرصد.');
  }

  function personRow(item, type) {
    const score = item.average ? item.average.toFixed(1) : '0';
    const detail = type === 'support'
      ? `${toArabicDigits(item.supportCount)} مهارة بحاجة إلى متابعة`
      : `${toArabicDigits(item.enrichmentCount)} مهارة في مستوى الامتداد`;
    return `
      <button class="person-row" data-action="open-student" data-student-id="${escapeHTML(item.student.id)}" type="button">
        <div class="person-row-identity">${studentAvatarHTML(item.student, { context: 'dashboard', className: 'person-avatar' })}<div><strong>${escapeHTML(item.student.name)}</strong><span>${detail}</span></div></div>
        <span class="person-score ${type}">${toArabicDigits(score)}</span>
      </button>`;
  }

  function renderDaily() {
    const container = $('#quickEntryContainer');
    if (!container) return;
    const date = $('#dailyDate')?.value || todayISO();
    const skillId = $('#dailySkill')?.value || state.skills[0]?.id || '';

    if (!state.students.length) {
      container.innerHTML = emptyState('لم يُضف الطلاب', 'أضف قائمة الطلاب أولًا من صفحة بطاقات الطلاب.');
      updateDailyProgress();
      return;
    }
    if (!skillId) {
      container.innerHTML = emptyState('لا توجد مهارة للرصد', 'أضف مهارة من صفحة المهارات.');
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
              <th>الطالب</th>
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
    hydrateStudentAvatars(container).catch(error => console.warn('تعذر تحديث صور الرصد:', error));
  }

  function renderQuickDesktopRow(student, entry) {
    const values = quickValuesFromEntry(entry);
    return `
      <tr class="quick-record" data-quick-student="${escapeHTML(student.id)}" data-level="${values.level}" data-absent="${values.absent}">
        <td class="student-name">${studentIdentityHTML(student, { context: 'app', className: 'daily-student-identity' })}</td>
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
          <div class="quick-card-student-identity">${studentAvatarHTML(student, { context: 'app', className: 'quick-card-avatar' })}<strong>${escapeHTML(student.name)}</strong></div>
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
      suggestion: entry?.action || (entry?.postLevel ? generateSuggestion(entry) : 'اختر المستوى ليظهر الإجراء التالي.')
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
      <button class="quick-level-button absent ${absent === 'true' ? 'selected' : ''}" data-quick-absent type="button">غ<br>غائب</button>
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
    const text = draft.absent ? 'غائب — لا يُحتسب مستوى في هذه الحصة.' : draft.postLevel ? generateSuggestion(draft) : 'اختر المستوى ليظهر الإجراء التالي.';
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
    if (label) label.textContent = `${toArabicDigits(completed)} من ${toArabicDigits(total)} تم رصدهم`;
  }

  function saveQuickEntries() {
    if (!state.students.length) {
      showToast('أضف الطلاب أولًا.', 'warning');
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
      queueMotivationSuggestion(base);
      savedCount += 1;
    });

    saveState();
    renderAll();
    showToast(`تم حفظ رصد ${toArabicDigits(savedCount)} طالبًا.`, 'success');
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
    $('#studentCountLabel').textContent = `${toArabicDigits(state.students.length)} طالبًا في السجل`;

    if (!students.length) {
      grid.innerHTML = emptyState(state.students.length ? 'لا توجد نتيجة مطابقة' : 'لم يُضف طلاب بعد', state.students.length ? 'جرّب كتابة جزء آخر من الاسم.' : 'استخدم زر «إضافة قائمة» لإدخال الأسماء بسرعة.');
      return;
    }

    const summaries = new Map(calculateStudentSummaries().map(item => [item.student.id, item]));
    grid.innerHTML = students.map(student => {
      const summary = summaries.get(student.id);
      const average = summary?.ratedCount ? summary.average.toFixed(1) : '—';
      return `
        <button class="student-card" data-action="open-student" data-student-id="${escapeHTML(student.id)}" type="button">
          <div class="student-card-header">
            ${studentAvatarHTML(student, { context: 'app', className: 'student-card-avatar' })}
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
    hydrateStudentAvatars(grid).catch(error => console.warn('تعذر تحديث صور بطاقات الطلاب:', error));
  }

  function buildStudentNoteControls() {
    const categorySelect = $('#studentNoteCategory');
    if (!categorySelect) return;
    categorySelect.innerHTML = '<option value="">دون ملاحظة</option>' + STUDENT_NOTE_CATEGORIES
      .map(category => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.label)}</option>`)
      .join('');
    renderStudentNoteChoices('');
  }

  function renderStudentNoteChoices(categoryId, selectedChoice = '') {
    const choiceSelect = $('#studentNoteChoice');
    if (!choiceSelect) return;
    const category = STUDENT_NOTE_CATEGORIES.find(item => item.id === categoryId);
    if (!category) {
      choiceSelect.innerHTML = '<option value="">اختر نوع الملاحظة أولًا</option>';
      choiceSelect.value = '';
      choiceSelect.disabled = true;
      toggleStudentNoteOther();
      return;
    }

    if (category.id === 'other') {
      choiceSelect.innerHTML = '<option value="__other__">ملاحظة أخرى</option>';
      choiceSelect.value = NOTE_OTHER_VALUE;
      choiceSelect.disabled = true;
      toggleStudentNoteOther();
      return;
    }

    const options = [...category.options, { id: NOTE_OTHER_VALUE, label: 'أخرى ضمن هذا النوع' }];
    choiceSelect.disabled = false;
    choiceSelect.innerHTML = '<option value="">اختر الملاحظة المناسبة</option>' + options
      .map(option => `<option value="${escapeHTML(option.id)}">${escapeHTML(option.label)}</option>`)
      .join('');
    choiceSelect.value = options.some(option => option.id === selectedChoice) ? selectedChoice : '';
    toggleStudentNoteOther();
  }

  function toggleStudentNoteOther() {
    const wrap = $('#studentNoteOtherWrap');
    if (!wrap) return;
    const categoryId = $('#studentNoteCategory')?.value || '';
    wrap.hidden = !(categoryId === 'other' || $('#studentNoteChoice')?.value === NOTE_OTHER_VALUE);
  }

  function getStudentNoteData(student = {}) {
    if (student.noteCategory || student.noteChoice || student.noteOther) {
      return {
        noteCategory: student.noteCategory || '',
        noteChoice: student.noteChoice || '',
        noteOther: student.noteOther || ''
      };
    }
    if (student.note) {
      return { noteCategory: 'other', noteChoice: NOTE_OTHER_VALUE, noteOther: student.note };
    }
    return { noteCategory: '', noteChoice: '', noteOther: '' };
  }

  function collectStudentNoteData() {
    const noteCategory = $('#studentNoteCategory')?.value || '';
    const noteChoice = noteCategory === 'other' ? NOTE_OTHER_VALUE : (noteCategory ? ($('#studentNoteChoice')?.value || '') : '');
    const noteOther = noteChoice === NOTE_OTHER_VALUE ? ($('#studentNoteOther')?.value.trim() || '') : '';
    return { noteCategory, noteChoice, noteOther };
  }

  function getStudentNoteText(student = {}) {
    const data = getStudentNoteData(student);
    if (!data.noteCategory || !data.noteChoice) return '';
    if (data.noteChoice === NOTE_OTHER_VALUE) return String(data.noteOther || student.note || '').trim();
    const category = STUDENT_NOTE_CATEGORIES.find(item => item.id === data.noteCategory);
    const option = category?.options.find(item => item.id === data.noteChoice);
    return option?.label || String(student.note || '').trim();
  }

  function getStudentNoteCategoryLabel(student = {}) {
    const data = getStudentNoteData(student);
    return STUDENT_NOTE_CATEGORIES.find(item => item.id === data.noteCategory)?.label || '';
  }

  function initializeStudentAvatarDraft(student = null) {
    clearPendingStudentAvatar();
    const fallbackPresetId = student
      ? normalizeStudentAvatar(student.avatar, student).presetId
      : AVATAR_PRESETS[state.students.length % AVATAR_PRESETS.length].id;
    const avatar = student
      ? normalizeStudentAvatar(student.avatar, student)
      : { mode: 'preset', presetId: fallbackPresetId, mediaId: '', mediaName: '', mediaType: '' };
    pendingStudentAvatar = {
      mode: avatar.mode,
      presetId: avatar.presetId || fallbackPresetId,
      originalMediaId: avatar.mediaId || '',
      photoMediaId: avatar.mediaId || '',
      mediaName: avatar.mediaName || '',
      mediaType: avatar.mediaType || '',
      newBlob: null,
      newName: '',
      newType: ''
    };
  }

  function clearPendingStudentAvatar() {
    if (studentAvatarPreviewUrl) {
      URL.revokeObjectURL(studentAvatarPreviewUrl);
      studentAvatarPreviewUrl = '';
    }
    pendingStudentAvatar = null;
    if ($('#studentAvatarFileInput')) $('#studentAvatarFileInput').value = '';
    if ($('#studentAvatarCameraInput')) $('#studentAvatarCameraInput').value = '';
  }

  function setPendingStudentAvatarMode(mode) {
    if (!pendingStudentAvatar || !['preset', 'photo', 'initial'].includes(mode)) return;
    pendingStudentAvatar.mode = mode;
    renderStudentAvatarEditor();
  }

  function selectPendingStudentAvatarPreset(presetId) {
    if (!pendingStudentAvatar || !AVATAR_PRESETS.some(item => item.id === presetId)) return;
    pendingStudentAvatar.presetId = presetId;
    pendingStudentAvatar.mode = 'preset';
    renderStudentAvatarEditor();
  }

  function updateStudentAvatarInitialPreview() {
    const preview = $('#studentAvatarInitialPreview');
    if (preview) preview.textContent = studentInitial({ name: $('#studentName')?.value || '' });
    if (pendingStudentAvatar?.mode === 'initial') renderStudentAvatarEditor();
  }

  function renderStudentAvatarEditor() {
    if (!pendingStudentAvatar) return;
    const mode = pendingStudentAvatar.mode;
    $$('.avatar-mode-button').forEach(button => {
      const selected = button.dataset.avatarMode === mode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    const presetPanel = $('#studentAvatarPresetPanel');
    const photoPanel = $('#studentAvatarPhotoPanel');
    const initialPanel = $('#studentAvatarInitialPanel');
    if (presetPanel) presetPanel.hidden = mode !== 'preset';
    if (photoPanel) photoPanel.hidden = mode !== 'photo';
    if (initialPanel) initialPanel.hidden = mode !== 'initial';

    const presetGrid = $('#studentAvatarPresetGrid');
    if (presetGrid) {
      presetGrid.innerHTML = AVATAR_PRESETS.map((preset, index) => `
        <button class="avatar-preset-choice ${pendingStudentAvatar.presetId === preset.id ? 'selected' : ''}" data-action="select-student-avatar-preset" data-avatar-preset="${escapeHTML(preset.id)}" type="button" aria-label="${escapeHTML(preset.label)}" aria-pressed="${pendingStudentAvatar.presetId === preset.id ? 'true' : 'false'}">
          <img src="${escapeHTML(avatarPresetPath(preset.id))}" alt="" aria-hidden="true" />
          <span>${toArabicDigits(index + 1)}</span>
        </button>`).join('');
    }

    const name = $('#studentName')?.value || '';
    const preview = $('#studentAvatarEditorPreview');
    if (preview) {
      if (mode === 'photo') {
        if (studentAvatarPreviewUrl) {
          preview.innerHTML = `<span class="avatar avatar-editor-avatar student-avatar-photo avatar-loaded"><img class="student-avatar-image" src="${escapeHTML(studentAvatarPreviewUrl)}" alt="معاينة الصورة الحقيقية" /></span><small>صورة حقيقية</small>`;
        } else if (pendingStudentAvatar.photoMediaId) {
          preview.innerHTML = `<span class="avatar avatar-editor-avatar student-avatar-photo" data-avatar-wrapper="${escapeHTML(pendingStudentAvatar.photoMediaId)}"><span class="student-avatar-fallback"><img class="student-avatar-fallback-image" src="${escapeHTML(avatarPresetPath(pendingStudentAvatar.presetId))}" alt="" /></span><img class="student-avatar-image" data-avatar-media-id="${escapeHTML(pendingStudentAvatar.photoMediaId)}" alt="معاينة الصورة الحقيقية" /></span><small>صورة حقيقية محفوظة</small>`;
          hydrateStudentAvatars(preview).catch(error => console.warn('تعذر عرض معاينة الصورة:', error));
        } else {
          preview.innerHTML = `<span class="avatar avatar-editor-avatar student-avatar-preset"><img class="student-avatar-image preset-image" src="${escapeHTML(avatarPresetPath(pendingStudentAvatar.presetId))}" alt="" /></span><small>اختر صورة أو التقطها</small>`;
        }
      } else if (mode === 'initial') {
        preview.innerHTML = `<span class="avatar avatar-editor-avatar student-avatar-initial"><span>${escapeHTML(studentInitial({ name }))}</span></span><small>الحرف الأول</small>`;
      } else {
        const selected = AVATAR_PRESETS.find(item => item.id === pendingStudentAvatar.presetId);
        preview.innerHTML = `<span class="avatar avatar-editor-avatar student-avatar-preset"><img class="student-avatar-image preset-image" src="${escapeHTML(avatarPresetPath(pendingStudentAvatar.presetId))}" alt="" /></span><small>${escapeHTML(selected?.label || 'صورة رمزية')}</small>`;
      }
    }

    const initialPreview = $('#studentAvatarInitialPreview');
    if (initialPreview) initialPreview.textContent = studentInitial({ name });
  }

  async function handleStudentAvatarSelection(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !pendingStudentAvatar) return;
    if (!file.type.startsWith('image/')) {
      showToast('اختر ملف صورة صالحًا.', 'warning');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('حجم الصورة كبير جدًا؛ اختر صورة أصغر من ١٥ ميجابايت.', 'warning');
      return;
    }
    try {
      const blob = await prepareAvatarPhoto(file);
      if (studentAvatarPreviewUrl) URL.revokeObjectURL(studentAvatarPreviewUrl);
      studentAvatarPreviewUrl = URL.createObjectURL(blob);
      pendingStudentAvatar.mode = 'photo';
      pendingStudentAvatar.newBlob = blob;
      pendingStudentAvatar.newName = file.name || `صورة-طالب-${Date.now()}.jpg`;
      pendingStudentAvatar.newType = blob.type || 'image/jpeg';
      renderStudentAvatarEditor();
    } catch (error) {
      console.error(error);
      showToast('تعذر تجهيز صورة الطالب.', 'error');
    }
  }

  async function prepareAvatarPhoto(file) {
    const bitmap = await createImageBitmap(file);
    const size = Math.min(bitmap.width, bitmap.height);
    const sourceX = Math.max(0, Math.round((bitmap.width - size) / 2));
    const sourceY = Math.max(0, Math.round((bitmap.height - size) / 2));
    const targetSize = 640;
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const context = canvas.getContext('2d');
    context.fillStyle = '#f2f5f8';
    context.fillRect(0, 0, targetSize, targetSize);
    context.drawImage(bitmap, sourceX, sourceY, size, size, 0, 0, targetSize, targetSize);
    bitmap.close?.();
    return await new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('فشل تجهيز الصورة')), 'image/jpeg', 0.84);
    });
  }

  function removePendingStudentAvatarPhoto() {
    if (!pendingStudentAvatar) return;
    if (studentAvatarPreviewUrl) {
      URL.revokeObjectURL(studentAvatarPreviewUrl);
      studentAvatarPreviewUrl = '';
    }
    pendingStudentAvatar.newBlob = null;
    pendingStudentAvatar.newName = '';
    pendingStudentAvatar.newType = '';
    pendingStudentAvatar.photoMediaId = '';
    pendingStudentAvatar.mode = 'preset';
    renderStudentAvatarEditor();
    showToast('أزيلت الصورة من المعاينة؛ احفظ التعديل لتأكيد الحذف.', 'success');
  }

  async function persistPendingStudentAvatar(existingStudent = null) {
    const fallback = normalizeStudentAvatar(existingStudent?.avatar, existingStudent || {}).presetId || AVATAR_PRESETS[0].id;
    const draft = pendingStudentAvatar || { mode: 'preset', presetId: fallback, originalMediaId: '', photoMediaId: '' };
    const presetId = AVATAR_PRESETS.some(item => item.id === draft.presetId) ? draft.presetId : fallback;
    const oldMediaId = normalizeStudentAvatar(existingStudent?.avatar, existingStudent || {}).mediaId || draft.originalMediaId || '';

    if (draft.mode === 'photo') {
      let mediaId = draft.photoMediaId || oldMediaId;
      let mediaName = draft.mediaName || existingStudent?.avatar?.mediaName || '';
      let mediaType = draft.mediaType || existingStudent?.avatar?.mediaType || '';
      if (draft.newBlob) {
        const media = await putMedia(draft.newBlob, draft.newName || `صورة-طالب-${Date.now()}.jpg`, draft.newType || draft.newBlob.type || 'image/jpeg');
        mediaId = media.id;
        mediaName = media.name;
        mediaType = media.type;
      }
      if (!mediaId) throw new Error('اختر صورة حقيقية أولًا.');
      if (oldMediaId && oldMediaId !== mediaId) {
        await deleteMedia(oldMediaId).catch(error => console.warn('تعذر حذف الصورة السابقة:', error));
        revokeAvatarObjectUrl(oldMediaId);
      }
      return { mode: 'photo', presetId, mediaId, mediaName, mediaType, updatedAt: new Date().toISOString() };
    }

    if (oldMediaId) {
      await deleteMedia(oldMediaId).catch(error => console.warn('تعذر حذف الصورة السابقة:', error));
      revokeAvatarObjectUrl(oldMediaId);
    }
    return { mode: draft.mode === 'initial' ? 'initial' : 'preset', presetId, mediaId: '', mediaName: '', mediaType: '', updatedAt: new Date().toISOString() };
  }

  function openStudentDialog(studentId = '') {
    const student = state.students.find(item => item.id === studentId);
    $('#studentEditId').value = student?.id || '';
    $('#studentName').value = student?.name || '';
    $('#studentNumber').value = student?.number || '';
    const noteData = getStudentNoteData(student || {});
    $('#studentNoteCategory').value = noteData.noteCategory;
    renderStudentNoteChoices(noteData.noteCategory, noteData.noteChoice);
    $('#studentNoteOther').value = noteData.noteOther;
    toggleStudentNoteOther();
    initializeStudentAvatarDraft(student || null);
    renderStudentAvatarEditor();
    $('#studentDialogTitle').textContent = student ? 'تعديل بيانات الطالب' : 'إضافة طالب';
    openDialog('studentDialog');
    setTimeout(() => $('#studentName')?.focus(), 50);
  }

  async function saveStudentFromDialog() {
    const id = $('#studentEditId').value;
    const name = $('#studentName').value.trim();
    if (!name) {
      showToast('اكتب اسم الطالب.', 'warning');
      $('#studentName').focus();
      return;
    }

    const duplicate = state.students.find(student => normalizeName(student.name) === normalizeName(name) && student.id !== id);
    if (duplicate) {
      showToast('هذا الاسم موجود في السجل بالفعل.', 'warning');
      return;
    }

    const noteData = collectStudentNoteData();
    if (noteData.noteCategory && noteData.noteCategory !== 'other' && !noteData.noteChoice) {
      showToast('اختر الملاحظة المناسبة من القائمة.', 'warning');
      $('#studentNoteChoice')?.focus();
      return;
    }
    if (noteData.noteChoice === NOTE_OTHER_VALUE && !noteData.noteOther) {
      showToast('اكتب الملاحظة الأخرى.', 'warning');
      $('#studentNoteOther')?.focus();
      return;
    }
    if (pendingStudentAvatar?.mode === 'photo' && !pendingStudentAvatar.newBlob && !pendingStudentAvatar.photoMediaId && !pendingStudentAvatar.originalMediaId) {
      showToast('اختر صورة حقيقية أو استخدم صورة رمزية.', 'warning');
      return;
    }

    const saveButton = $('#saveStudentButton');
    saveButton.disabled = true;
    saveButton.textContent = 'جارٍ الحفظ…';
    try {
      const existingStudent = id ? state.students.find(item => item.id === id) : null;
      const avatar = await persistPendingStudentAvatar(existingStudent);
      const note = getStudentNoteText(noteData);

      if (existingStudent) {
        Object.assign(existingStudent, {
          name,
          number: $('#studentNumber').value.trim(),
          ...noteData,
          note,
          avatar,
          updatedAt: new Date().toISOString()
        });
      } else {
        state.students.push({
          id: uid('student'),
          name,
          number: $('#studentNumber').value.trim(),
          ...noteData,
          note,
          avatar,
          createdAt: new Date().toISOString()
        });
      }

      saveState();
      $('#studentDialog').close();
      renderAll();
      if (id && $('#studentCardDialog')?.open) await openStudentCard(id);
      showToast(id ? 'تم تحديث بيانات الطالب وصورته التعريفية.' : 'تمت إضافة الطالب بصورته التعريفية.', 'success');
    } catch (error) {
      console.error(error);
      showToast(error?.message || 'تعذر حفظ بيانات الطالب.', 'error');
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = 'حفظ';
    }
  }

  function saveBulkStudents() {
    const lines = $('#bulkStudentNames').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) {
      showToast('اكتب اسمًا واحدًا على الأقل.', 'warning');
      return;
    }

    const existingNames = new Set(state.students.map(student => normalizeName(student.name)));
    let added = 0;
    lines.forEach((line, index) => {
      const normalized = normalizeName(line);
      if (!normalized || existingNames.has(normalized)) return;
      const presetId = AVATAR_PRESETS[state.students.length % AVATAR_PRESETS.length].id;
      state.students.push({ id: uid('student'), name: line, number: String(state.students.length + 1), noteCategory: '', noteChoice: '', noteOther: '', note: '', avatar: { mode: 'preset', presetId, mediaId: '', mediaName: '', mediaType: '', updatedAt: new Date().toISOString() }, createdAt: new Date().toISOString() });
      existingNames.add(normalized);
      added += 1;
    });

    saveState();
    $('#bulkStudentNames').value = '';
    $('#bulkStudentsDialog').close();
    renderAll();
    showToast(`تمت إضافة ${toArabicDigits(added)} طالبًا.`, 'success');
  }

  async function deleteStudent(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    if (!confirm(`سيتم حذف «${student.name}» وجميع سجلاته ومرفقاته. هل أنت متأكد؟`)) return;

    const avatarMediaId = normalizeStudentAvatar(student.avatar, student).mediaId;
    if (avatarMediaId) {
      await deleteMedia(avatarMediaId).catch(error => console.warn('تعذر حذف صورة الطالب:', error));
      revokeAvatarObjectUrl(avatarMediaId);
    }
    const entries = state.entries.filter(entry => entry.studentId === studentId);
    for (const entry of entries) {
      for (const media of entry.media || []) await deleteMedia(media.id);
    }
    state.entries = state.entries.filter(entry => entry.studentId !== studentId);
    state.students = state.students.filter(item => item.id !== studentId);
    state.motivation.rewards = state.motivation.rewards.filter(reward => !(reward.targetType === 'student' && reward.targetId === studentId));
    state.motivation.suggestions = state.motivation.suggestions.filter(suggestion => suggestion.studentId !== studentId);
    state.motivation.groups.forEach(group => { group.memberIds = (group.memberIds || []).filter(id => id !== studentId); });
    saveState();
    $('#studentCardDialog')?.close();
    renderAll();
    showToast('تم حذف الطالب وسجلاته.', 'success');
  }

  async function openStudentCard(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    revokeObjectUrls();

    const summary = calculateStudentSummaries().find(item => item.student.id === studentId);
    const entries = state.entries.filter(entry => entry.studentId === studentId).sort(sortEntriesDescending);
    const mastered = summary?.latestEntries.filter(entry => Number(entry.postLevel) >= 3).length || 0;
    const average = summary?.ratedCount ? summary.average.toFixed(1) : '—';
    const studentNote = getStudentNoteText(student);
    const studentNoteCategory = getStudentNoteCategoryLabel(student);
    const motivation = summarizeStudentRewards(studentId);
    const motivationHistory = motivation.rewards.length ? motivation.rewards.slice(0, 8).map(reward => {
      const skillName = rewardSkillName(reward);
      return `<div class="student-reward-row"><span class="student-reward-symbol">${reward.rewardType === 'badge' ? (rewardBadgeInfo(reward)?.icon || '🏅') : rewardTypeInfo(reward).icon}</span><div><strong>${escapeHTML(rewardTitle(reward))}</strong><span>${escapeHTML(rewardReasonText(reward))} • ${escapeHTML(skillName)}</span><small>${escapeHTML(formatDate(reward.date))}</small></div></div>`;
    }).join('') : emptyState('لا يوجد تحفيز مسجل', 'امنح أول نجمة أو وسام عند ظهور تقدم أو إنجاز واضح.');

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

    const history = entries.length ? entries.map(entry => renderHistoryEntry(entry)).join('') : emptyState('لا يوجد رصد لهذا الطالب', 'أضف أول متابعة تفصيلية أو استخدم الرصد اليومي.');

    $('#studentCardContent').innerHTML = `
      <div class="student-profile-header">
        <div class="student-profile-identity">
          ${studentAvatarHTML(student, { context: 'app', className: 'student-profile-avatar' })}
          <div><h3>${escapeHTML(student.name)}</h3><p>${escapeHTML([state.settings.grade, state.settings.className].filter(Boolean).join(' — ') || 'بطاقة تعلم فردية')}</p></div>
        </div>
        <div class="student-profile-actions">
          <button class="button" data-action="add-entry-for-student" data-student-id="${escapeHTML(student.id)}" type="button">＋ متابعة جديدة</button>
          <button class="button button-badge" data-action="award-student" data-student-id="${escapeHTML(student.id)}" data-reward-type="badge" type="button">＋ تحفيز</button>
          <button class="button" data-action="print-student" data-student-id="${escapeHTML(student.id)}" type="button">طباعة</button>
          <button class="button" data-action="edit-student" data-student-id="${escapeHTML(student.id)}" type="button">تعديل</button>
          <button class="button" data-action="close-student-card" type="button">إغلاق</button>
        </div>
      </div>

      <div class="profile-stats">
        <div class="profile-stat"><strong>${toArabicDigits(summary?.ratedCount || 0)}</strong><span>مهارة مرصودة</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(average)}</strong><span>متوسط التقدم</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(mastered)}</strong><span>إتقان فأعلى</span></div>
        <div class="profile-stat"><strong>${toArabicDigits(summary?.supportCount || 0)}</strong><span>أولوية متابعة</span></div>
        <div class="profile-stat reward-profile-stat"><strong>⭐ ${toArabicDigits(motivation.stars)}</strong><span>رصيد النجوم</span></div>
        <div class="profile-stat reward-profile-stat"><strong>🏅 ${toArabicDigits(motivation.badges)}</strong><span>الأوسمة</span></div>
      </div>

      <section class="panel student-motivation-panel">
        <div class="panel-header wrap-header"><div><h3>رصيد التحفيز</h3><p>النجوم والأوسمة مرتبطة بأسباب تربوية ومهارات محددة.</p></div><div class="inline-actions"><button class="button button-star" data-action="award-student" data-student-id="${escapeHTML(student.id)}" data-reward-type="star" type="button">＋ ⭐ نجمة</button><button class="button button-badge" data-action="award-student" data-student-id="${escapeHTML(student.id)}" data-reward-type="badge" type="button">＋ 🏅 وسام</button><button class="button button-ghost" data-action="open-reward-history" data-target-type="student" data-target-id="${escapeHTML(student.id)}" type="button">عرض السجل</button></div></div>
        <div class="student-reward-list">${motivationHistory}</div>
      </section>

      ${studentNote ? `<section class="panel student-note-panel"><div class="student-note-display-header"><h3>الملاحظة العامة</h3>${studentNoteCategory ? `<span class="note-category-badge">${escapeHTML(studentNoteCategory)}</span>` : ''}</div><p>${escapeHTML(studentNote)}</p></section>` : ''}

      <section class="panel">
        <div class="panel-header"><div><h3>تقدم المهارات</h3><p>بحسب أحدث رصد لكل مهارة.</p></div></div>
        <div class="skill-progress-list">${skillRows}</div>
      </section>

      <section class="panel">
        <div class="panel-header"><div><h3>السجل الزمني</h3><p>المتابعات والملاحظات والمرفقات من الأحدث إلى الأقدم.</p></div></div>
        <div>${history}</div>
      </section>`;

    if (!$('#studentCardDialog').open) $('#studentCardDialog').showModal();
    await hydrateStudentAvatars($('#studentCardContent'));
    await hydrateMedia($('#studentCardContent'));
  }

  function renderHistoryEntry(entry) {
    const skill = state.skills.find(item => item.id === entry.skillId);
    const level = Number(entry.postLevel) || 0;
    const modes = (entry.learningModes || []).map(id => LEARNING_MODES.find(mode => mode.id === id)?.label).filter(Boolean);
    const errors = (entry.errorCodes || []).map(id => ERROR_CODES.find(error => error.id === id)).filter(Boolean);
    const media = entry.media || [];
    const imageHTML = media.filter(item => item.type.startsWith('image')).map(item => `<div class="media-preview-item"><img data-media-id="${escapeHTML(item.id)}" alt="صورة من حل الطالب" /></div>`).join('');
    const audioHTML = media.filter(item => item.type.startsWith('audio')).map(item => `<div class="audio-item"><audio data-media-id="${escapeHTML(item.id)}" controls></audio></div>`).join('');

    return `
      <article class="history-entry">
        <div class="history-entry-header">
          <div><strong>${escapeHTML(skill?.name || 'مهارة محذوفة')}</strong><small>${escapeHTML(formatDate(entry.date))}${entry.assessmentTool ? ` — ${escapeHTML(entry.assessmentTool)}` : ''}</small></div>
          <div class="row-actions">
            <span class="level-badge level-${level}">${entry.absent ? 'غائب' : level ? `${LEVELS[level].emoji} ${LEVELS[level].name}` : 'غير محدد'}</span>
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
      container.innerHTML = emptyState('لا توجد مهارات', 'أضف مهارات المنهج لتبدأ الرصد.');
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
      showToast('اكتب اسم المهارة.', 'warning');
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
      showToast('اكتب مهارة واحدة على الأقل.', 'warning');
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
      ? `ترتبط بالمهارة «${skill.name}» ${toArabicDigits(relatedEntries.length)} متابعة. سيؤدي الحذف إلى حذفها ومرفقاتها أيضًا. هل أنت متأكد؟`
      : `هل تريد حذف المهارة «${skill.name}»؟`;
    if (!confirm(message)) return;

    for (const entry of relatedEntries) {
      for (const media of entry.media || []) await deleteMedia(media.id);
    }
    state.entries = state.entries.filter(entry => entry.skillId !== skillId);
    state.skills = state.skills.filter(item => item.id !== skillId);
    state.motivation.rewards.forEach(reward => { if (reward.skillId === skillId) reward.skillName = reward.skillName || skill.name; });
    state.motivation.suggestions = state.motivation.suggestions.filter(suggestion => suggestion.skillId !== skillId);
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

    buildStudentNoteControls();
    buildMotivationControls();
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
    select.innerHTML = state.students.map(student => `<option value="${escapeHTML(student.id)}">${escapeHTML(student.name)}</option>`).join('') || '<option value="">لا يوجد طلاب</option>';
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
    if (!level) return 'اختر مستوى التقدم لتوليد إجراء مناسب.';

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
      ? 'تعزيز الثقة بطلب شرح خطوة واحدة لزميل، ثم سؤال تثبيت مستقل في بداية الحصة القادمة.'
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
      showToast('اختر الطالب والتاريخ والمهارة.', 'warning');
      return;
    }
    if (!data.absent && !data.postLevel) {
      showToast('اختر مستوى الطالب بعد التعلم.', 'warning');
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
      queueMotivationSuggestion(record);
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
    if (!confirm('هل تريد حذف هذه المتابعة ومرفقاتها؟')) return;
    for (const media of entry.media || []) await deleteMedia(media.id);
    state.entries = state.entries.filter(item => item.id !== entryId);
    state.motivation.suggestions = state.motivation.suggestions.filter(item => item.sourceEntryId !== entryId);
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
        <img data-media-id="${escapeHTML(item.id)}" alt="صورة من حل الطالب" />
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
    if (!confirm('هل تريد حذف هذا المرفق؟')) return;
    entry.media = (entry.media || []).filter(item => item.id !== mediaId);
    entry.updatedAt = new Date().toISOString();
    await deleteMedia(mediaId);
    saveState();
    await renderExistingEntryMedia(entry);
    showToast('تم حذف المرفق.', 'success');
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      showToast('هذا المتصفح لا يدعم التسجيل الصوتي. جرّب Chrome أو Edge عبر اتصال HTTPS.', 'warning');
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
        pendingAudio = { blob, type, name: `شرح-الطالب-${Date.now()}.${extension}`, url };
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


  function buildMotivationControls() {
    const badgeSelect = $('#rewardBadge');
    if (badgeSelect) {
      badgeSelect.innerHTML = MOTIVATION_BADGES.map(badge => `<option value="${escapeHTML(badge.id)}">${badge.icon} ${escapeHTML(badge.label)}</option>`).join('');
    }
    const reasonSelect = $('#rewardReason');
    if (reasonSelect) {
      reasonSelect.innerHTML = MOTIVATION_REASONS.map(reason => `<option value="${escapeHTML(reason.id)}">${escapeHTML(reason.label)}</option>`).join('');
    }
    const criterionSelect = $('#rewardGroupCriterion');
    if (criterionSelect) {
      criterionSelect.innerHTML = GROUP_CRITERIA.map(criterion => `<option value="${escapeHTML(criterion.id)}">${criterion.icon} ${escapeHTML(criterion.label)}</option>`).join('');
    }
  }

  function switchMotivationMode(mode = 'students') {
    currentMotivationMode = mode === 'groups' ? 'groups' : 'students';
    renderMotivation();
  }

  function getMotivationPeriodStart(daysValue) {
    const days = Number(daysValue);
    if (!days) return '';
    const date = new Date(`${todayISO()}T12:00:00`);
    date.setDate(date.getDate() - Math.max(0, days - 1));
    return date.toISOString().slice(0, 10);
  }

  function filterRewards(rewards, { skillId = 'all', period = 'all' } = {}) {
    const start = getMotivationPeriodStart(period);
    return rewards.filter(reward => {
      if (skillId !== 'all' && reward.skillId !== skillId) return false;
      if (start && String(reward.date || '') < start) return false;
      return true;
    });
  }

  function rewardPoints(reward) {
    if (Number.isFinite(Number(reward.points))) return Number(reward.points);
    return REWARD_TYPES[reward.rewardType]?.points || 0;
  }

  function rewardTypeInfo(reward) {
    return REWARD_TYPES[reward.rewardType] || REWARD_TYPES.star;
  }

  function rewardBadgeInfo(reward) {
    return MOTIVATION_BADGES.find(item => item.id === reward.badgeId) || null;
  }

  function rewardReasonText(reward) {
    if (reward.customReason) return reward.customReason;
    return MOTIVATION_REASONS.find(item => item.id === reward.reasonId)?.label || reward.reasonText || 'تحفيز تربوي';
  }

  function rewardSkillName(reward) {
    return state.skills.find(item => item.id === reward.skillId)?.name || reward.skillName || 'مهارة غير محددة (سجل سابق)';
  }

  function rewardTitle(reward) {
    if (reward.rewardType === 'badge') {
      const badge = rewardBadgeInfo(reward);
      return badge ? `${badge.icon} ${badge.label}` : '🏅 وسام';
    }
    const info = rewardTypeInfo(reward);
    return `${info.icon} ${info.label}`;
  }

  function getTargetRewards(targetType, targetId) {
    return state.motivation.rewards
      .filter(reward => reward.targetType === targetType && reward.targetId === targetId)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }

  function summarizeStudentRewards(studentId, filters = {}) {
    const all = filterRewards(getTargetRewards('student', studentId), filters);
    const stars = all.filter(reward => reward.rewardType !== 'badge').reduce((sum, reward) => sum + rewardPoints(reward), 0);
    const badges = all.filter(reward => reward.rewardType === 'badge').length;
    return { rewards: all, stars, badges, total: all.length, latest: all[0] || null };
  }

  function summarizeGroupRewards(groupId) {
    const rewards = getTargetRewards('group', groupId);
    const criteria = Object.fromEntries(GROUP_CRITERIA.map(criterion => [criterion.id, 0]));
    rewards.forEach(reward => {
      if (criteria[reward.groupCriterionId] !== undefined) criteria[reward.groupCriterionId] += rewardPoints(reward);
    });
    return { rewards, criteria, total: Object.values(criteria).reduce((sum, value) => sum + value, 0), latest: rewards[0] || null };
  }

  function renderMotivation() {
    if (!$('#view-motivation')) return;
    $$('.motivation-tab').forEach(button => {
      const active = button.dataset.mode === currentMotivationMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    $('#motivationStudentsMode')?.classList.toggle('active', currentMotivationMode === 'students');
    $('#motivationGroupsMode')?.classList.toggle('active', currentMotivationMode === 'groups');

    const pending = state.motivation.suggestions.filter(suggestion => suggestion.status !== 'dismissed' && suggestion.status !== 'approved');
    const navBadge = $('#motivationNavBadge');
    if (navBadge) {
      navBadge.hidden = pending.length === 0;
      navBadge.textContent = toArabicDigits(pending.length);
    }

    renderMotivationStats(pending);
    renderMotivationSuggestions(pending);
    renderGroupCriteriaStrip();
    if (currentMotivationMode === 'groups') renderMotivationGroups();
    else renderMotivationStudents();
    hydrateStudentAvatars($('#view-motivation') || document).catch(error => console.warn('تعذر تحديث صور لوحة التحفيز:', error));
  }

  function renderMotivationStats(pending = []) {
    const container = $('#motivationStats');
    if (!container) return;
    const studentRewards = state.motivation.rewards.filter(reward => reward.targetType === 'student');
    const stars = studentRewards.filter(reward => reward.rewardType !== 'badge').reduce((sum, reward) => sum + rewardPoints(reward), 0);
    const badges = studentRewards.filter(reward => reward.rewardType === 'badge').length;
    const weekStart = getMotivationPeriodStart(7);
    const recognized = new Set(studentRewards.filter(reward => !weekStart || String(reward.date || '') >= weekStart).map(reward => reward.targetId)).size;
    container.innerHTML = [
      { icon: '⭐', value: stars, label: 'رصيد النجوم' },
      { icon: '🏅', value: badges, label: 'الأوسمة الممنوحة' },
      { icon: '📅', value: recognized, label: 'طلاب حُفزوا خلال ٧ أيام' },
      { icon: '✨', value: pending.length, label: 'اقتراحات بانتظار الاعتماد' }
    ].map(item => `<div class="motivation-stat-card"><span>${item.icon}</span><div><strong>${toArabicDigits(item.value)}</strong><small>${escapeHTML(item.label)}</small></div></div>`).join('');
  }

  function renderMotivationSuggestions(pending = []) {
    const panel = $('#motivationSuggestionsPanel');
    const container = $('#motivationSuggestions');
    if (!panel || !container) return;
    panel.hidden = pending.length === 0;
    $('#motivationSuggestionCount').textContent = toArabicDigits(pending.length);
    if (!pending.length) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = pending.slice().sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).map(suggestion => {
      const student = state.students.find(item => item.id === suggestion.studentId);
      const skill = state.skills.find(item => item.id === suggestion.skillId);
      const badge = MOTIVATION_BADGES.find(item => item.id === suggestion.badgeId);
      const type = REWARD_TYPES[suggestion.rewardType] || REWARD_TYPES.star;
      const rewardLabel = suggestion.rewardType === 'badge' && badge ? `${badge.icon} ${badge.label}` : `${type.icon} ${type.label}`;
      return `<article class="motivation-suggestion-card">
        <div class="suggestion-avatar-wrap">${student ? studentAvatarHTML(student, { context: 'app', className: 'suggestion-avatar' }) : `<div class="suggestion-icon">${suggestion.rewardType === 'badge' ? (badge?.icon || '🏅') : type.icon}</div>`}<span class="suggestion-reward-symbol">${suggestion.rewardType === 'badge' ? (badge?.icon || '🏅') : type.icon}</span></div>
        <div class="suggestion-copy">
          <strong>${escapeHTML(student?.name || 'طالب محذوف')} — ${escapeHTML(rewardLabel)}</strong>
          <span>${escapeHTML(suggestion.reasonText || 'أظهر تقدمًا يستحق التحفيز.')}${skill ? ` • ${escapeHTML(skill.name)}` : ''}</span>
        </div>
        <div class="suggestion-actions">
          <button class="button button-primary button-small" data-action="approve-reward-suggestion" data-suggestion-id="${escapeHTML(suggestion.id)}" type="button">اعتماد</button>
          <button class="button button-ghost button-small" data-action="dismiss-reward-suggestion" data-suggestion-id="${escapeHTML(suggestion.id)}" type="button">تجاهل</button>
        </div>
      </article>`;
    }).join('');
  }

  function renderMotivationStudents() {
    const container = $('#motivationStudentGrid');
    if (!container) return;
    const search = normalizeName($('#motivationStudentSearch')?.value || '');
    const skillId = $('#motivationSkillFilter')?.value || 'all';
    const period = $('#motivationPeriodFilter')?.value || 'all';
    const sort = $('#motivationStudentSort')?.value || 'name';
    const summaries = state.students.map(student => ({ student, ...summarizeStudentRewards(student.id, { skillId, period }) }))
      .filter(item => !search || normalizeName(item.student.name).includes(search));

    summaries.sort((a, b) => {
      if (sort === 'stars') return b.stars - a.stars || a.student.name.localeCompare(b.student.name, 'ar');
      if (sort === 'badges') return b.badges - a.badges || a.student.name.localeCompare(b.student.name, 'ar');
      if (sort === 'recent') return String(b.latest?.date || '').localeCompare(String(a.latest?.date || '')) || a.student.name.localeCompare(b.student.name, 'ar');
      return a.student.name.localeCompare(b.student.name, 'ar');
    });

    const equityStart = getMotivationPeriodStart(14);
    const recentlyRecognized = new Set(state.motivation.rewards.filter(reward => reward.targetType === 'student' && String(reward.date || '') >= equityStart).map(reward => reward.targetId));
    const unrecognizedCount = state.students.filter(student => !recentlyRecognized.has(student.id)).length;
    const equityNote = $('#motivationEquityNote');
    if (equityNote) equityNote.innerHTML = unrecognizedCount
      ? `<span>⚖️</span><div><strong>تنبيه للعدالة في التعزيز</strong><small>${toArabicDigits(unrecognizedCount)} طالبًا لم يُسجل له تحفيز خلال آخر ١٤ يومًا.</small></div>`
      : `<span>✓</span><div><strong>تغطية تحفيزية متوازنة</strong><small>سُجل تحفيز لجميع الطلاب خلال آخر ١٤ يومًا.</small></div>`;

    if (!state.students.length) {
      container.innerHTML = emptyState('لم يُضف الطلاب', 'أضف قائمة الطلاب من بطاقات الطلاب؛ وستظهر هنا تلقائيًا دون إعادة إدخالها.');
      return;
    }
    if (!summaries.length) {
      container.innerHTML = emptyState('لا توجد نتائج مطابقة', 'غيّر البحث أو الفترة أو المهارة المختارة.');
      return;
    }

    container.innerHTML = summaries.map(item => {
      const recent = item.rewards.slice(0, 3);
      return `<article class="motivation-student-card">
        <div class="motivation-card-top">
          <div class="student-card-header">
            ${studentAvatarHTML(item.student, { context: 'app', className: 'motivation-avatar' })}
            <div><strong>${escapeHTML(item.student.name)}</strong><small>${item.student.number ? `الرقم ${escapeHTML(toArabicDigits(item.student.number))}` : 'رصيد تحفيز فردي'}</small></div>
          </div>
          <button class="table-action" data-action="open-reward-history" data-target-type="student" data-target-id="${escapeHTML(item.student.id)}" type="button">السجل</button>
        </div>
        <div class="reward-balance">
          <div><span>⭐</span><strong>${toArabicDigits(item.stars)}</strong><small>نجمة</small></div>
          <div><span>🏅</span><strong>${toArabicDigits(item.badges)}</strong><small>وسام</small></div>
        </div>
        <div class="recent-rewards">
          ${recent.length ? recent.map(reward => `<span class="recent-reward-chip" title="${escapeHTML(rewardReasonText(reward))}">${escapeHTML(rewardTitle(reward))}</span>`).join('') : '<span class="no-reward-yet">لم يُسجل تحفيز بعد</span>'}
        </div>
        ${item.latest ? `<p class="last-reward"><strong>الأحدث:</strong> ${escapeHTML(rewardReasonText(item.latest))} • ${escapeHTML(formatDate(item.latest.date))}</p>` : '<p class="last-reward muted">ابدأ بأول تعزيز مرتبط بإنجاز واضح.</p>'}
        <div class="motivation-card-actions">
          <button class="button button-star" data-action="award-student" data-student-id="${escapeHTML(item.student.id)}" data-reward-type="star" type="button">＋ ⭐ نجمة</button>
          <button class="button button-badge" data-action="award-student" data-student-id="${escapeHTML(item.student.id)}" data-reward-type="badge" type="button">＋ 🏅 وسام</button>
        </div>
      </article>`;
    }).join('');
  }

  function renderGroupCriteriaStrip() {
    const container = $('#groupCriteriaStrip');
    if (!container) return;
    container.innerHTML = GROUP_CRITERIA.map(criterion => `<span>${criterion.icon} ${escapeHTML(criterion.label)}</span>`).join('');
  }

  function renderMotivationGroups() {
    const container = $('#motivationGroupGrid');
    if (!container) return;
    if (!state.motivation.groups.length) {
      container.innerHTML = emptyState('لم تُنشأ مجموعات بعد', 'أنشئ مجموعة واختر أعضاءها من قائمة الطلاب الموجودة في السجل.');
      return;
    }
    const groups = state.motivation.groups.map(group => ({ group, ...summarizeGroupRewards(group.id) }))
      .sort((a, b) => b.total - a.total || a.group.name.localeCompare(b.group.name, 'ar'));
    container.innerHTML = groups.map(item => {
      const memberStudents = item.group.memberIds.map(id => state.students.find(student => student.id === id)).filter(Boolean);
      const members = memberStudents.map(student => student.name);
      return `<article class="motivation-group-card">
        <div class="group-card-header">
          <div><span class="group-icon">👥</span><div><strong>${escapeHTML(item.group.name)}</strong><small>${toArabicDigits(members.length)} أعضاء</small></div></div>
          <div class="row-actions">
            <button class="table-action" data-action="open-reward-history" data-target-type="group" data-target-id="${escapeHTML(item.group.id)}" type="button">السجل</button>
            <button class="table-action" data-action="edit-motivation-group" data-group-id="${escapeHTML(item.group.id)}" type="button">تعديل</button>
            <button class="table-action danger" data-action="delete-motivation-group" data-group-id="${escapeHTML(item.group.id)}" type="button">حذف</button>
          </div>
        </div>
        <div class="group-members">${memberStudents.length ? memberStudents.map(student => `<span class="group-member-chip">${studentAvatarHTML(student, { context: 'app', className: 'group-chip-avatar' })}<span>${escapeHTML(student.name)}</span></span>`).join('') : '<span>دون أعضاء</span>'}</div>
        <div class="group-total"><span>المجموع</span><strong>${toArabicDigits(item.total)}</strong></div>
        <div class="group-criteria-grid">
          ${GROUP_CRITERIA.map(criterion => `<div class="group-criterion-card">
            <div><span>${criterion.icon}</span><strong>${escapeHTML(criterion.label)}</strong></div>
            <b>${toArabicDigits(item.criteria[criterion.id] || 0)}</b>
            <div class="group-point-actions">
              <button data-action="award-group" data-group-id="${escapeHTML(item.group.id)}" data-criterion-id="${escapeHTML(criterion.id)}" data-reward-type="star" type="button" title="إضافة نقطة">＋١</button>
              <button data-action="award-group" data-group-id="${escapeHTML(item.group.id)}" data-criterion-id="${escapeHTML(criterion.id)}" data-reward-type="glow_star" type="button" title="إضافة نقطتين">＋٢</button>
              <button data-action="award-group" data-group-id="${escapeHTML(item.group.id)}" data-criterion-id="${escapeHTML(criterion.id)}" data-reward-type="badge" type="button" title="إضافة ثلاث نقاط">＋٣</button>
            </div>
          </div>`).join('')}
        </div>
      </article>`;
    }).join('');
  }

  function openRewardForHeader() {
    if (currentMotivationMode === 'groups') {
      if (!state.motivation.groups.length) {
        showToast('أنشئ مجموعة أولًا.', 'warning');
        return;
      }
      openRewardDialog({ targetType: 'group', targetId: state.motivation.groups[0].id, allowTargetSelection: true });
      return;
    }
    if (!state.students.length) {
      showToast('أضف الطلاب أولًا.', 'warning');
      return;
    }
    openRewardDialog({ targetType: 'student', targetId: state.students[0].id, allowTargetSelection: true });
  }

  function openRewardDialog({ targetType = 'student', targetId = '', rewardType = 'star', badgeId = '', reasonId = '', customReason = '', skillId = '', criterionId = '', suggestionId = '', sourceEntryId = '', allowTargetSelection = false } = {}) {
    const target = targetType === 'group'
      ? state.motivation.groups.find(group => group.id === targetId)
      : state.students.find(student => student.id === targetId);
    if (!target) {
      showToast(targetType === 'group' ? 'المجموعة غير موجودة.' : 'الطالب غير موجود.', 'warning');
      return;
    }

    buildMotivationControls();
    renderSkillOptions();
    $('#rewardTargetType').value = targetType;
    $('#rewardTargetId').value = targetId;
    $('#rewardSuggestionId').value = suggestionId;
    $('#rewardSourceEntryId').value = sourceEntryId;
    $('#rewardTargetName').textContent = target.name;
    $('#rewardDate').value = todayISO();
    $('#rewardType').value = REWARD_TYPES[rewardType] ? rewardType : 'star';
    $('#rewardBadge').value = MOTIVATION_BADGES.some(item => item.id === badgeId) ? badgeId : (targetType === 'student' ? 'progress' : 'cooperation');
    $('#rewardReason').value = MOTIVATION_REASONS.some(item => item.id === reasonId) ? reasonId : (targetType === 'student' ? 'progress' : 'cooperation');
    $('#rewardCustomReason').value = customReason || '';
    const filteredSkillId = $('#motivationSkillFilter')?.value || '';
    const resolvedSkillId = state.skills.some(skill => skill.id === skillId)
      ? skillId
      : (filteredSkillId !== 'all' && state.skills.some(skill => skill.id === filteredSkillId) ? filteredSkillId : '');
    $('#rewardSkill').value = resolvedSkillId;
    $('#rewardGroupCriterion').value = GROUP_CRITERIA.some(item => item.id === criterionId) ? criterionId : 'cooperation';
    $('#rewardNote').value = '';
    $('#rewardDialogTitle').textContent = targetType === 'group' ? 'منح نقاط للمجموعة' : 'منح نجمة أو وسام';

    const picker = $('#rewardTargetPicker');
    if (picker) {
      picker.hidden = !allowTargetSelection;
      if (allowTargetSelection) {
        const targets = targetType === 'group' ? state.motivation.groups : state.students;
        picker.innerHTML = targets.map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)}</option>`).join('');
        picker.value = targetId;
      } else {
        picker.innerHTML = '';
      }
    }
    $('#rewardTargetName').hidden = allowTargetSelection;

    updateRewardDialogFields();
    openDialog('rewardDialog');
  }

  function updateRewardTargetFromPicker() {
    const picker = $('#rewardTargetPicker');
    if (!picker || picker.hidden) return;
    const targetType = $('#rewardTargetType').value;
    const target = targetType === 'group'
      ? state.motivation.groups.find(group => group.id === picker.value)
      : state.students.find(student => student.id === picker.value);
    if (!target) return;
    $('#rewardTargetId').value = target.id;
    $('#rewardTargetName').textContent = target.name;
  }

  function updateRewardDialogFields() {
    const targetType = $('#rewardTargetType')?.value || 'student';
    const type = $('#rewardType')?.value || 'star';
    const reason = $('#rewardReason')?.value || '';
    if ($('#rewardBadgeWrap')) $('#rewardBadgeWrap').hidden = !(targetType === 'student' && type === 'badge');
    if ($('#rewardGroupCriterionWrap')) $('#rewardGroupCriterionWrap').hidden = targetType !== 'group';
    if ($('#rewardCustomReasonWrap')) $('#rewardCustomReasonWrap').hidden = reason !== 'other';
    const typeSelect = $('#rewardType');
    if (typeSelect) {
      const labels = targetType === 'group'
        ? { star: '⭐ +١ نقطة', glow_star: '🌟 +٢ نقطتين', badge: '🏅 +٣ نقاط' }
        : { star: '⭐ نجمة', glow_star: '🌟 نجمة تميز', badge: '🏅 وسام' };
      Array.from(typeSelect.options).forEach(option => { option.textContent = labels[option.value] || option.textContent; });
    }
  }

  function saveRewardFromDialog() {
    updateRewardTargetFromPicker();
    const targetType = $('#rewardTargetType').value;
    const targetId = $('#rewardTargetId').value;
    const rewardType = $('#rewardType').value;
    const reasonId = $('#rewardReason').value;
    const customReason = reasonId === 'other' ? $('#rewardCustomReason').value.trim() : '';
    const skillId = $('#rewardSkill').value;
    const linkedSkill = state.skills.find(skill => skill.id === skillId);
    const date = $('#rewardDate').value || todayISO();
    const targetExists = targetType === 'group'
      ? state.motivation.groups.some(group => group.id === targetId)
      : state.students.some(student => student.id === targetId);
    if (!targetExists) {
      showToast('اختر مستفيدًا صالحًا.', 'warning');
      return;
    }
    if (!MOTIVATION_REASONS.some(item => item.id === reasonId)) {
      showToast('اختر سبب التحفيز.', 'warning');
      $('#rewardReason')?.focus();
      return;
    }
    if (reasonId === 'other' && !customReason) {
      showToast('اكتب سبب التحفيز الآخر.', 'warning');
      $('#rewardCustomReason')?.focus();
      return;
    }
    if (!linkedSkill) {
      showToast('اختر المهارة المرتبطة بالتحفيز.', 'warning');
      $('#rewardSkill')?.focus();
      return;
    }
    const groupCriterionId = targetType === 'group' ? $('#rewardGroupCriterion').value : '';
    if (targetType === 'group' && !groupCriterionId) {
      showToast('اختر معيار المجموعة.', 'warning');
      return;
    }

    const record = {
      id: uid('reward'),
      targetType,
      targetId,
      rewardType,
      badgeId: targetType === 'student' && rewardType === 'badge' ? $('#rewardBadge').value : '',
      reasonId,
      reasonText: MOTIVATION_REASONS.find(item => item.id === reasonId)?.label || '',
      customReason,
      skillId,
      skillName: linkedSkill.name,
      groupCriterionId,
      date,
      note: $('#rewardNote').value.trim(),
      points: rewardPoints({ rewardType }),
      sourceEntryId: $('#rewardSourceEntryId').value || '',
      createdAt: new Date().toISOString()
    };
    state.motivation.rewards.push(record);

    const suggestionId = $('#rewardSuggestionId').value;
    if (suggestionId) {
      const suggestion = state.motivation.suggestions.find(item => item.id === suggestionId);
      if (suggestion) suggestion.status = 'approved';
    }

    saveState();
    $('#rewardDialog').close();
    renderAll();
    celebrateReward(record.rewardType === 'badge' ? '🏅' : rewardTypeInfo(record).icon);
    showToast(targetType === 'group' ? `تمت إضافة ${toArabicDigits(record.points)} نقاط للمجموعة.` : 'تم منح التحفيز وحفظ سببه.', 'success');
  }

  function celebrateReward(symbol = '⭐') {
    const layer = document.createElement('div');
    layer.className = 'celebration-layer';
    for (let index = 0; index < 18; index += 1) {
      const item = document.createElement('span');
      item.textContent = index % 3 === 0 ? symbol : (index % 2 ? '✨' : '⭐');
      item.style.setProperty('--x', `${Math.round(Math.random() * 90 + 5)}vw`);
      item.style.setProperty('--delay', `${(Math.random() * 0.35).toFixed(2)}s`);
      item.style.setProperty('--rotate', `${Math.round(Math.random() * 360)}deg`);
      layer.appendChild(item);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1700);
  }

  function openMotivationGroupDialog(groupId = '') {
    if (!state.students.length) {
      showToast('أضف الطلاب أولًا حتى تتمكن من تكوين المجموعات.', 'warning');
      return;
    }
    const group = state.motivation.groups.find(item => item.id === groupId);
    $('#motivationGroupEditId').value = group?.id || '';
    $('#motivationGroupName').value = group?.name || '';
    $('#motivationGroupDialogTitle').textContent = group ? 'تعديل المجموعة' : 'إنشاء مجموعة';
    $('#motivationGroupMembers').innerHTML = state.students.map(student => `<label class="group-member-choice">
      <input type="checkbox" value="${escapeHTML(student.id)}" ${(group?.memberIds || []).includes(student.id) ? 'checked' : ''} />
      ${studentAvatarHTML(student, { context: 'app', className: 'small-avatar' })}
      <span>${escapeHTML(student.name)}</span>
    </label>`).join('');
    openDialog('motivationGroupDialog');
    hydrateStudentAvatars($('#motivationGroupMembers')).catch(error => console.warn('تعذر تحديث صور أعضاء المجموعة:', error));
    setTimeout(() => $('#motivationGroupName')?.focus(), 50);
  }

  function saveMotivationGroup() {
    const id = $('#motivationGroupEditId').value;
    const name = $('#motivationGroupName').value.trim();
    const memberIds = $$('#motivationGroupMembers input:checked').map(input => input.value);
    if (!name) {
      showToast('اكتب اسم المجموعة.', 'warning');
      return;
    }
    if (!memberIds.length) {
      showToast('اختر عضوًا واحدًا على الأقل.', 'warning');
      return;
    }
    const duplicate = state.motivation.groups.find(group => normalizeName(group.name) === normalizeName(name) && group.id !== id);
    if (duplicate) {
      showToast('اسم المجموعة مستخدم بالفعل.', 'warning');
      return;
    }
    if (id) {
      const group = state.motivation.groups.find(item => item.id === id);
      if (group) Object.assign(group, { name, memberIds, updatedAt: new Date().toISOString() });
    } else {
      state.motivation.groups.push({ id: uid('group'), name, memberIds, createdAt: new Date().toISOString() });
    }
    saveState();
    $('#motivationGroupDialog').close();
    renderAll();
    switchMotivationMode('groups');
    showToast(id ? 'تم تحديث المجموعة.' : 'تم إنشاء المجموعة.', 'success');
  }

  function deleteMotivationGroup(groupId) {
    const group = state.motivation.groups.find(item => item.id === groupId);
    if (!group) return;
    if (!confirm(`هل تريد حذف مجموعة «${group.name}» وسجل نقاطها؟`)) return;
    state.motivation.groups = state.motivation.groups.filter(item => item.id !== groupId);
    state.motivation.rewards = state.motivation.rewards.filter(reward => !(reward.targetType === 'group' && reward.targetId === groupId));
    saveState();
    renderAll();
    showToast('تم حذف المجموعة وسجل نقاطها.', 'success');
  }

  function openRewardHistory(targetType, targetId) {
    const target = targetType === 'group'
      ? state.motivation.groups.find(group => group.id === targetId)
      : state.students.find(student => student.id === targetId);
    if (!target) return;
    const rewards = getTargetRewards(targetType, targetId);
    const summary = targetType === 'group' ? summarizeGroupRewards(targetId) : summarizeStudentRewards(targetId);
    const rows = rewards.length ? rewards.map(reward => {
      const skillName = rewardSkillName(reward);
      const criterion = GROUP_CRITERIA.find(item => item.id === reward.groupCriterionId);
      return `<article class="reward-history-item">
        <div class="reward-history-icon">${reward.rewardType === 'badge' && targetType === 'student' ? (rewardBadgeInfo(reward)?.icon || '🏅') : rewardTypeInfo(reward).icon}</div>
        <div class="reward-history-copy">
          <strong>${escapeHTML(targetType === 'group' ? `${criterion?.label || 'نقاط المجموعة'} (+${toArabicDigits(rewardPoints(reward))})` : rewardTitle(reward))}</strong>
          <span>${escapeHTML(rewardReasonText(reward))} • ${escapeHTML(skillName)}</span>
          <small>${escapeHTML(formatDate(reward.date))}${reward.note ? ` • ${escapeHTML(reward.note)}` : ''}</small>
        </div>
        <button class="table-action danger" data-action="delete-reward" data-reward-id="${escapeHTML(reward.id)}" type="button">حذف</button>
      </article>`;
    }).join('') : emptyState('لا يوجد تحفيز مسجل', 'ابدأ بمنح نجمة أو وسام مرتبط بإنجاز واضح.');

    $('#rewardHistoryContent').dataset.targetType = targetType;
    $('#rewardHistoryContent').dataset.targetId = targetId;
    $('#rewardHistoryContent').innerHTML = `<div class="dialog-header sticky-dialog-header">
      <div><span class="eyebrow">السجل الزمني للتحفيز</span><h3>${escapeHTML(target.name)}</h3></div>
      <button class="icon-button" data-action="close-reward-history" aria-label="إغلاق" type="button">×</button>
    </div>
    <div class="reward-history-summary">
      ${targetType === 'group'
        ? `<div><strong>${toArabicDigits(summary.total)}</strong><span>إجمالي النقاط</span></div><div><strong>${toArabicDigits(summary.rewards.length)}</strong><span>عمليات التحفيز</span></div>`
        : `<div><strong>${toArabicDigits(summary.stars)}</strong><span>النجوم</span></div><div><strong>${toArabicDigits(summary.badges)}</strong><span>الأوسمة</span></div>`}
    </div>
    <div class="reward-history-list">${rows}</div>`;
    if (!$('#rewardHistoryDialog').open) $('#rewardHistoryDialog').showModal();
  }

  function deleteReward(rewardId) {
    const reward = state.motivation.rewards.find(item => item.id === rewardId);
    if (!reward) return;
    if (!confirm('هل تريد حذف هذا التحفيز من السجل؟')) return;
    state.motivation.rewards = state.motivation.rewards.filter(item => item.id !== rewardId);
    saveState();
    renderAll();
    const content = $('#rewardHistoryContent');
    if ($('#rewardHistoryDialog')?.open && content?.dataset.targetType && content?.dataset.targetId) {
      openRewardHistory(content.dataset.targetType, content.dataset.targetId);
    }
    showToast('تم حذف التحفيز.', 'success');
  }

  function approveRewardSuggestion(suggestionId) {
    const suggestion = state.motivation.suggestions.find(item => item.id === suggestionId && item.status !== 'approved');
    if (!suggestion) return;
    openRewardDialog({
      targetType: 'student',
      targetId: suggestion.studentId,
      rewardType: suggestion.rewardType,
      badgeId: suggestion.badgeId,
      reasonId: suggestion.reasonId,
      skillId: suggestion.skillId,
      suggestionId: suggestion.id,
      sourceEntryId: suggestion.sourceEntryId
    });
  }

  function dismissRewardSuggestion(suggestionId) {
    const suggestion = state.motivation.suggestions.find(item => item.id === suggestionId);
    if (!suggestion) return;
    suggestion.status = 'dismissed';
    saveState();
    renderMotivation();
    showToast('تم تجاهل الاقتراح، ولم يُمنح أي تحفيز.', 'success');
  }

  function queueMotivationSuggestion(entry) {
    if (!entry || entry.absent || !entry.studentId || !entry.postLevel) return;
    if (state.motivation.rewards.some(reward => reward.sourceEntryId === entry.id)) return;
    const existing = state.motivation.suggestions.find(item => item.sourceEntryId === entry.id && item.status !== 'dismissed');
    if (existing) return;

    const hasAudio = (entry.media || []).some(media => String(media.type || '').startsWith('audio'));
    const pre = Number(entry.preLevel) || 0;
    const post = Number(entry.postLevel) || 0;
    let suggestion = null;
    if (hasAudio && post >= 3) {
      suggestion = { rewardType: 'badge', badgeId: 'explainer', reasonId: 'explanation', reasonText: 'سجل شرحًا صوتيًا واضحًا للحل.' };
    } else if (pre && post > pre) {
      suggestion = { rewardType: 'badge', badgeId: 'progress', reasonId: 'progress', reasonText: `انتقل من مستوى ${LEVELS[pre]?.name || pre} إلى ${LEVELS[post]?.name || post}.` };
    } else if (post === 4) {
      suggestion = { rewardType: 'badge', badgeId: 'creativity', reasonId: 'creativity', reasonText: 'وصل إلى مستوى الامتداد وأصبح جاهزًا لتطبيق أعمق.' };
    } else if (post === 3 && Number(entry.independence || 0) === 3) {
      suggestion = { rewardType: 'badge', badgeId: 'independence', reasonId: 'independence', reasonText: 'أتقن المهارة وأنجز المهمة باستقلالية.' };
    } else if (post === 3) {
      suggestion = { rewardType: 'star', badgeId: '', reasonId: 'mastery', reasonText: 'حقق مستوى الإتقان في المهارة.' };
    }
    if (!suggestion) return;

    state.motivation.suggestions.push({
      id: uid('suggestion'),
      studentId: entry.studentId,
      skillId: entry.skillId || '',
      sourceEntryId: entry.id,
      date: entry.date || todayISO(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...suggestion
    });
  }

  function exportMotivationCSV() {
    const headers = ['التاريخ', 'النوع', 'المستفيد', 'نوع التحفيز', 'الوسام', 'النقاط', 'المعيار', 'سبب التحفيز', 'المهارة', 'الملاحظة'];
    const rows = state.motivation.rewards.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).map(reward => {
      const target = reward.targetType === 'group'
        ? state.motivation.groups.find(group => group.id === reward.targetId)
        : state.students.find(student => student.id === reward.targetId);
      const badge = rewardBadgeInfo(reward);
      const criterion = GROUP_CRITERIA.find(item => item.id === reward.groupCriterionId);
      const skillName = rewardSkillName(reward);
      return [
        reward.date || '',
        reward.targetType === 'group' ? 'مجموعة' : 'طالب',
        target?.name || '',
        rewardTypeInfo(reward).label,
        badge?.label || '',
        reward.targetType === 'group' ? rewardPoints(reward) : (reward.rewardType === 'badge' ? '' : rewardPoints(reward)),
        criterion?.label || '',
        rewardReasonText(reward),
        skillName,
        reward.note || ''
      ];
    });
    const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `سجل-التحفيز-بوصلة-الرياضيات-${todayISO()}.csv`);
    showToast('تم تصدير سجل التحفيز بصيغة CSV.', 'success');
  }

  function renderReports() {
    const select = $('#reportStudentSelect');
    if (!select) return;
    const previous = select.value;
    select.innerHTML = state.students.length
      ? state.students.map(student => `<option value="${escapeHTML(student.id)}">${escapeHTML(student.name)}</option>`).join('')
      : '<option value="">لا يوجد طلاب</option>';
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
    $('#settingShowAvatarsInApp').checked = state.settings.showAvatarsInApp !== false;
    $('#settingShowAvatarsInDashboard').checked = state.settings.showAvatarsInDashboard !== false;
    $('#settingShowAvatarsInPrint').checked = Boolean(state.settings.showAvatarsInPrint);
    $('#settingIncludePhotosInBackup').checked = Boolean(state.settings.includePhotosInBackup);
  }

  function saveSettings() {
    state.settings = {
      teacher: $('#settingTeacher').value.trim(),
      school: $('#settingSchool').value.trim(),
      grade: $('#settingGrade').value.trim(),
      className: $('#settingClass').value.trim(),
      semester: $('#settingSemester').value.trim(),
      subject: $('#settingSubject').value.trim() || 'الرياضيات',
      reportTitle: $('#settingReportTitle').value.trim() || DEFAULT_STATE.settings.reportTitle,
      showAvatarsInApp: Boolean($('#settingShowAvatarsInApp')?.checked),
      showAvatarsInDashboard: Boolean($('#settingShowAvatarsInDashboard')?.checked),
      showAvatarsInPrint: Boolean($('#settingShowAvatarsInPrint')?.checked),
      includePhotosInBackup: Boolean($('#settingIncludePhotosInBackup')?.checked)
    };
    saveState();
    renderAll();
    showToast('تم حفظ إعدادات السجل والخصوصية.', 'success');
  }

  async function exportBackup() {
    const button = document.querySelector('[data-action="export-backup"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'جارٍ تجهيز النسخة…';
    }
    try {
      const includeAvatarPhotos = Boolean(state.settings.includePhotosInBackup);
      const backupState = structuredCloneSafe(state);
      const mediaIds = new Set(state.entries.flatMap(entry => (entry.media || []).map(media => media.id)));

      if (includeAvatarPhotos) {
        state.students.forEach(student => {
          const avatar = normalizeStudentAvatar(student.avatar, student);
          if (avatar.mode === 'photo' && avatar.mediaId) mediaIds.add(avatar.mediaId);
        });
      } else {
        backupState.students.forEach((student, index) => {
          const avatar = normalizeStudentAvatar(student.avatar, student, index);
          if (avatar.mode === 'photo') {
            student.avatar = {
              mode: 'preset',
              presetId: avatar.presetId,
              mediaId: '',
              mediaName: '',
              mediaType: '',
              updatedAt: avatar.updatedAt || new Date().toISOString()
            };
          }
        });
      }

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
        backupVersion: 3,
        exportedAt: new Date().toISOString(),
        privacy: { avatarPhotosIncluded: includeAvatarPhotos },
        state: backupState,
        mediaData
      };
      downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' }), `نسخة-احتياطية-بوصلة-الرياضيات-${todayISO()}.json`);
      showToast(includeAvatarPhotos ? 'تم إنشاء النسخة الاحتياطية مع الصور الحقيقية.' : 'تم إنشاء النسخة الاحتياطية دون الصور الحقيقية وفق إعدادات الخصوصية.', 'success');
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
    if (!confirm('سيستبدل الاستيراد البيانات الحالية في هذا الجهاز. هل تريد المتابعة؟')) return;

    try {
      const backup = JSON.parse(await file.text());
      if (!backup?.state || !Array.isArray(backup.state.students) || !Array.isArray(backup.state.skills) || !Array.isArray(backup.state.entries)) {
        throw new Error('صيغة غير صحيحة');
      }

      revokeAllAvatarObjectUrls();
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
    const headers = ['التاريخ', 'اسم الطالب', 'الملاحظة العامة للطالب', 'المهارة', 'المجال', 'الأداة', 'المستوى القبلي', 'المستوى بعد التعلم', 'الثقة', 'الاستقلالية', 'الطريقة المساعدة', 'بصمة الخطأ', 'ملاحظة المتابعة', 'الإجراء التالي', 'غياب'];
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
        getStudentNoteText(student || {}),
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
    if (!confirm('سيتم حذف جميع الطلاب والرصد والصور والتسجيلات من هذا الجهاز. لا يمكن التراجع. هل أنت متأكد؟')) return;
    if (!confirm('تأكيد أخير: هل تريد مسح السجل كاملًا؟')) return;
    revokeAllAvatarObjectUrls();
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
        <div class="print-title-wrap">
          <img class="print-brand-logo" src="./assets/interactive-learning-forum-logo.png" alt="شعار ملتقى التعليم التفاعلي" />
          <div class="print-title"><h1>${escapeHTML(title)}</h1><p>${escapeHTML(subtitle || state.settings.reportTitle)}</p></div>
        </div>
        <div class="print-header-side">${escapeHTML(left || 'المعلم: __________________')}</div>
      </header>`;
  }

  function printFooter() {
    return `<footer class="print-footer"><div class="print-credit"><img src="./assets/interactive-learning-forum-logo.png" alt="" /><span>أ/ فاطمة هزازي | ملتقى التعليم التفاعلي | ملتقى معلمي ومعلمات الرياضيات</span></div><span>تاريخ الطباعة: ${escapeHTML(formatDate(todayISO()))}</span></footer>`;
  }

  async function launchPrint(html) {
    const printArea = $('#printArea');
    printArea.innerHTML = `<div class="print-document">${html}</div>`;
    printArea.setAttribute('aria-hidden', 'false');
    await hydrateStudentAvatars(printArea);
    const images = Array.from(printArea.querySelectorAll('img'));
    const imageReady = images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    }));
    Promise.all(imageReady).finally(() => setTimeout(() => window.print(), 100));
  }

  function printDashboard() {
    const maxDate = $('#dashboardDateFilter')?.value || todayISO();
    const skillFilter = $('#dashboardSkillFilter')?.value || 'all';
    const skills = skillFilter === 'all' ? state.skills : state.skills.filter(skill => skill.id === skillFilter);
    const matrix = buildLatestMatrix(maxDate, skills);
    const rated = matrix.flatMap(row => row.cells).filter(cell => cell.entry);
    const mastery = rated.length ? Math.round(rated.filter(cell => Number(cell.entry.postLevel) >= 3).length / rated.length * 100) : 0;

    const header = skills.map(skill => `<th>${escapeHTML(skill.name)}</th>`).join('');
    const rows = matrix.length ? matrix.map(row => `<tr><td class="student-print-name">${printStudentIdentity(row.student)}</td>${row.cells.map(cell => {
      const level = cell.entry ? Number(cell.entry.postLevel) : 0;
      return `<td class="print-level-cell print-level-${level}">${level ? `${LEVELS[level].emoji} ${LEVELS[level].name}` : '—'}</td>`;
    }).join('')}</tr>`).join('') : `<tr><td colspan="${skills.length + 1}">لا توجد بيانات</td></tr>`;

    launchPrint(`
      ${printHeader('لوحة ألوان الفصل', `أحدث رصد حتى ${formatDate(maxDate)}`)}
      <div class="print-summary">
        <div class="print-summary-item"><strong>${toArabicDigits(state.students.length)}</strong><span>الطلاب</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(skills.length)}</strong><span>المهارات</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(rated.length)}</strong><span>خلايا مرصودة</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(mastery)}٪</strong><span>إتقان فأعلى</span></div>
      </div>
      <table class="print-table"><thead><tr><th class="student-print-name">الطالب</th>${header}</tr></thead><tbody>${rows}</tbody></table>
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
        <td class="student-print-name">${printStudentIdentity(student)}</td>
        <td>${entry?.preLevel ? LEVELS[entry.preLevel].name : ''}</td>
        <td class="print-level-cell print-level-${entry?.postLevel || 0}">${entry?.absent ? 'غائب' : entry?.postLevel ? LEVELS[entry.postLevel].name : ''}</td>
        <td>${escapeHTML(mode)}</td>
        <td>${escapeHTML(errors)}</td>
        <td>${escapeHTML(entry?.action || '')}</td>
      </tr>`;
    }).join('');

    launchPrint(`
      ${printHeader('ورقة المتابعة اليومية', `${skill?.name || 'المهارة: __________________'} — ${formatDate(date)}`)}
      <table class="print-table">
        <thead><tr><th>م</th><th class="student-print-name">الطالب</th><th>قبلي</th><th>بعد التعلم</th><th>الطريقة المساعدة</th><th>بصمة الخطأ</th><th>الإجراء التالي</th></tr></thead>
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
      return `<tr><td>${toArabicDigits(index + 1)}</td><td class="student-print-name">${printStudentIdentity(item.student)}</td><td>${escapeHTML(item.skill.name)}</td><td class="print-level-cell print-level-${item.entry.postLevel}">${LEVELS[item.entry.postLevel].name}</td><td>${escapeHTML(errors || 'غير محدد')}</td><td>${escapeHTML(item.entry.action || generateSuggestion(item.entry))}</td><td>${escapeHTML(formatDate(item.entry.date))}</td></tr>`;
    }).join('') : '<tr><td colspan="7">لا توجد حالات دعم حالية بحسب أحدث رصد.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير الدعم العلاجي', 'الأولويات والإجراءات المقترحة بحسب أحدث رصد')}
      <table class="print-table"><thead><tr><th>م</th><th class="student-print-name">الطالب</th><th>المهارة</th><th>المستوى</th><th>بصمة الخطأ</th><th>الإجراء التالي</th><th>آخر رصد</th></tr></thead><tbody>${rows}</tbody></table>
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

    const rows = records.length ? records.map((item, index) => `<tr><td>${toArabicDigits(index + 1)}</td><td class="student-print-name">${printStudentIdentity(item.student)}</td><td>${escapeHTML(item.skill.name)}</td><td>${escapeHTML(item.entry.action || generateSuggestion(item.entry))}</td><td>${escapeHTML(formatDate(item.entry.date))}</td></tr>`).join('') : '<tr><td colspan="5">لا توجد مهارات في مستوى الامتداد حتى الآن.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير الإثراء والامتداد', 'مهام مقترحة للطلاب الجاهزين للتحدي')}
      <table class="print-table"><thead><tr><th>م</th><th class="student-print-name">الطالب</th><th>المهارة</th><th>مهمة الامتداد المقترحة</th><th>آخر رصد</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="print-section"><h2>أفكار إثرائية إضافية</h2><div class="print-note-box">تأليف مسألة — حل بأكثر من استراتيجية — اكتشاف خطأ وتفسيره — تصميم لعبة رياضية — ربط المهارة بموقف حياتي.</div></section>
      ${printFooter()}`);
  }


  function printMotivationStudents() {
    const summaries = state.students.map(student => ({ student, ...summarizeStudentRewards(student.id) }));
    const totalStars = summaries.reduce((sum, item) => sum + item.stars, 0);
    const totalBadges = summaries.reduce((sum, item) => sum + item.badges, 0);
    const recognized = summaries.filter(item => item.total > 0).length;
    const rows = summaries.length ? summaries.map((item, index) => {
      const latest = item.latest;
      const skillName = latest ? rewardSkillName(latest) : '';
      return `<tr>
        <td>${toArabicDigits(index + 1)}</td>
        <td class="student-print-name">${printStudentIdentity(item.student)}</td>
        <td>${toArabicDigits(item.stars)}</td>
        <td>${toArabicDigits(item.badges)}</td>
        <td>${latest ? escapeHTML(rewardTitle(latest)) : '—'}</td>
        <td>${latest ? escapeHTML(rewardReasonText(latest)) : '—'}</td>
        <td>${escapeHTML(skillName || '—')}</td>
        <td>${latest ? escapeHTML(formatDate(latest.date)) : '—'}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="8">لا يوجد طلاب في السجل.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير النجوم والأوسمة', 'تعزيز فردي مرتبط بالتقدم والجهد والمهارات')}
      <div class="print-summary">
        <div class="print-summary-item"><strong>${toArabicDigits(state.students.length)}</strong><span>الطلاب</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(totalStars)}</strong><span>رصيد النجوم</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(totalBadges)}</strong><span>الأوسمة</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(recognized)}</strong><span>طلاب لديهم تحفيز</span></div>
      </div>
      <table class="print-table"><thead><tr><th>م</th><th class="student-print-name">الطالب</th><th>النجوم</th><th>الأوسمة</th><th>آخر تحفيز</th><th>السبب</th><th>المهارة</th><th>التاريخ</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="print-section"><h2>مبدأ العدالة في التحفيز</h2><div class="print-note-box">يُمنح التحفيز للتقدم والجهد والمثابرة والتفسير والتعاون، ولا يعتمد على مقارنة الطلاب أو سرعة الإنجاز وحدها.</div></section>
      ${printFooter()}`);
  }

  function printMotivationGroups() {
    const groupRows = state.motivation.groups.length ? state.motivation.groups.map((group, index) => {
      const summary = summarizeGroupRewards(group.id);
      const members = (group.memberIds || []).map(id => state.students.find(student => student.id === id)?.name).filter(Boolean).join('، ');
      return `<tr>
        <td>${toArabicDigits(index + 1)}</td>
        <td class="student-print-name">${escapeHTML(group.name)}</td>
        <td class="student-print-name">${escapeHTML(members || '—')}</td>
        ${GROUP_CRITERIA.map(criterion => `<td>${toArabicDigits(summary.criteria[criterion.id] || 0)}</td>`).join('')}
        <td><strong>${toArabicDigits(summary.total)}</strong></td>
      </tr>`;
    }).join('') : `<tr><td colspan="${GROUP_CRITERIA.length + 4}">لم تُنشأ مجموعات بعد.</td></tr>`;

    const history = state.motivation.rewards.filter(reward => reward.targetType === 'group').slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 30);
    const historyRows = history.length ? history.map((reward, index) => {
      const group = state.motivation.groups.find(item => item.id === reward.targetId);
      const criterion = GROUP_CRITERIA.find(item => item.id === reward.groupCriterionId);
      const skillName = rewardSkillName(reward);
      return `<tr><td>${toArabicDigits(index + 1)}</td><td>${escapeHTML(formatDate(reward.date))}</td><td class="student-print-name">${escapeHTML(group?.name || 'مجموعة محذوفة')}</td><td>${escapeHTML(criterion?.label || '—')}</td><td>${toArabicDigits(rewardPoints(reward))}</td><td>${escapeHTML(skillName)}</td><td>${escapeHTML(reward.note || rewardReasonText(reward))}</td></tr>`;
    }).join('') : '<tr><td colspan="7">لا يوجد سجل نقاط للمجموعات.</td></tr>';

    launchPrint(`
      ${printHeader('تقرير تحفيز المجموعات', 'نقاط موثقة وفق معايير تربوية واضحة')}
      <table class="print-table print-group-table"><thead><tr><th>م</th><th class="student-print-name">المجموعة</th><th class="student-print-name">الأعضاء</th>${GROUP_CRITERIA.map(criterion => `<th>${criterion.icon} ${escapeHTML(criterion.label)}</th>`).join('')}<th>المجموع</th></tr></thead><tbody>${groupRows}</tbody></table>
      <section class="print-section"><h2>أحدث عمليات التحفيز الجماعي</h2><table class="print-table"><thead><tr><th>م</th><th>التاريخ</th><th class="student-print-name">المجموعة</th><th>المعيار</th><th>النقاط</th><th>المهارة</th><th>التفصيل</th></tr></thead><tbody>${historyRows}</tbody></table></section>
      ${printFooter()}`);
  }

  function printStudentCard(studentId) {
    const student = state.students.find(item => item.id === studentId);
    if (!student) return;
    const summary = calculateStudentSummaries().find(item => item.student.id === studentId);
    const entries = state.entries.filter(entry => entry.studentId === studentId).sort(sortEntriesDescending).slice(0, 12);
    const studentNote = getStudentNoteText(student);
    const studentNoteCategory = getStudentNoteCategoryLabel(student);
    const motivation = summarizeStudentRewards(studentId);
    const rewardRows = motivation.rewards.slice(0, 12).map((reward, index) => {
      const skillName = rewardSkillName(reward);
      return `<tr><td>${toArabicDigits(index + 1)}</td><td>${escapeHTML(formatDate(reward.date))}</td><td>${escapeHTML(rewardTitle(reward))}</td><td>${escapeHTML(rewardReasonText(reward))}</td><td>${escapeHTML(skillName)}</td></tr>`;
    }).join('') || '<tr><td colspan="5">لا يوجد تحفيز مسجل بعد.</td></tr>';
    const skillRows = state.skills.map(skill => {
      const entry = getLatestEntry(student.id, skill.id, todayISO(), false);
      const level = entry ? Number(entry.postLevel) : 0;
      return `<tr><td class="student-print-name">${escapeHTML(skill.name)}</td><td class="print-level-cell print-level-${level}">${level ? LEVELS[level].name : 'لم تُرصد'}</td><td>${entry ? escapeHTML(formatDate(entry.date)) : ''}</td><td>${entry ? escapeHTML(entry.action || '') : ''}</td></tr>`;
    }).join('');
    const historyRows = entries.length ? entries.map((entry, index) => {
      const skill = state.skills.find(item => item.id === entry.skillId);
      const errors = (entry.errorCodes || []).map(id => ERROR_CODES.find(item => item.id === id)?.code).filter(Boolean).join('، ');
      return `<tr><td>${toArabicDigits(index + 1)}</td><td>${escapeHTML(formatDate(entry.date))}</td><td>${escapeHTML(skill?.name || 'مهارة محذوفة')}</td><td>${entry.absent ? 'غائب' : entry.postLevel ? LEVELS[entry.postLevel].name : ''}</td><td>${escapeHTML(errors)}</td><td>${escapeHTML(entry.note || '')}</td></tr>`;
    }).join('') : '<tr><td colspan="6">لا توجد متابعات بعد.</td></tr>';

    launchPrint(`
      ${printHeader(`بطاقة الطالب: ${student.name}`, [state.settings.grade, state.settings.className].filter(Boolean).join(' — '))}
      ${state.settings.showAvatarsInPrint ? `<div class="print-student-hero">${studentAvatarHTML(student, { context: 'print', className: 'print-student-hero-avatar' })}<div><strong>${escapeHTML(student.name)}</strong><span>${escapeHTML([state.settings.grade, state.settings.className].filter(Boolean).join(' — ') || 'بطاقة تعلم فردية')}</span></div></div>` : ''}
      <div class="print-summary">
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.ratedCount || 0)}</strong><span>مهارة مرصودة</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.average ? summary.average.toFixed(1) : '—')}</strong><span>متوسط التقدم</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.supportCount || 0)}</strong><span>مهارة تحتاج دعمًا</span></div>
        <div class="print-summary-item"><strong>${toArabicDigits(summary?.enrichmentCount || 0)}</strong><span>فرصة إثراء</span></div>
        <div class="print-summary-item"><strong>⭐ ${toArabicDigits(motivation.stars)}</strong><span>رصيد النجوم</span></div>
        <div class="print-summary-item"><strong>🏅 ${toArabicDigits(motivation.badges)}</strong><span>الأوسمة</span></div>
      </div>
      ${studentNote ? `<section class="print-section"><h2>الملاحظة العامة${studentNoteCategory ? ` - ${escapeHTML(studentNoteCategory)}` : ''}</h2><div class="print-note-box">${escapeHTML(studentNote)}</div></section>` : ''}
      <section class="print-section"><h2>سجل النجوم والأوسمة</h2><table class="print-table"><thead><tr><th>م</th><th>التاريخ</th><th>التحفيز</th><th>السبب</th><th>المهارة</th></tr></thead><tbody>${rewardRows}</tbody></table></section>
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
