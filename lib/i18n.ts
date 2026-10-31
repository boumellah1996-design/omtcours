import type { CourseSlug } from "@/lib/courses";

export type Locale = "ar" | "fr" | "en" | "es";

export const locales: { id: Locale; label: string; short: string }[] = [
  { id: "ar", label: "العربية", short: "AR" },
  { id: "fr", label: "Français", short: "FR" },
  { id: "en", label: "English", short: "EN" },
  { id: "es", label: "Español", short: "ES" },
];

type CourseCopy = {
  title: string;
  summary: string;
  points: [string, string, string];
};

export type Dictionary = {
  localeName: string;
  ticker: string;
  nav: {
    home: string;
    courses: string;
    about: string;
    location: string;
    pay: string;
    login: string;
    loginShort: string;
    menu: string;
    close: string;
      skip: string;
      learn: string;
      logout: string;
    themeToDark: string;
    themeToLight: string;
  };
  hero: {
    badge: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    imageTitle: string;
    imageHint: string;
    location: string;
    photos: {
      banner: string;
      phone: string;
      bench: string;
      oran: string;
      oran2: string;
      group: string;
      algiers: string;
      sidiBelAbbes: string;
      skikda: string;
      laghouat: string;
      pair: string;
      stand: string;
    };
  };
  coursesSection: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    pageLink: string;
  };
  courses: Record<CourseSlug, CourseCopy>;
  modal: {
    eyebrow: string;
    pay: string;
    payHint: string;
    watch: string;
    watchHint: string;
    back: string;
    close: string;
    teaserTitle: string;
    teaserNote: string;
    teaserLabel: string;
    waiting: string;
    duration: string;
    enrollTitle: string;
    enrollLead: string;
    name: string;
    phone: string;
    email: string;
    method: string;
    methodBaridi: string;
    methodUsdt: string;
    methodCash: string;
    receipt: string;
    receiptHint: string;
    pledge: string;
    captcha: string;
    captchaHint: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    requestId: string;
    whatsapp: string;
    details: string;
    prefill: string;
    errors: {
      invalid_name: string;
      invalid_phone: string;
      invalid_email: string;
      unknown_course: string;
      pledge_required: string;
      invalid_captcha: string;
      invalid_method: string;
      invalid_receipt: string;
      generic: string;
    };
  };
  payments: {
    kicker: string;
    title: string;
    lead: string;
    copy: string;
    copied: string;
    missing: string;
    baridiTitle: string;
    baridiLead: string;
    holder: string;
    rip: string;
    account: string;
    usdtTitle: string;
    usdtLead: string;
    trc20: string;
    bep20: string;
    cashTitle: string;
    cashLead: string;
    cashPlace: string;
  };
  about: {
    kicker: string;
    title: string;
    body: string;
    placeLabel: string;
    place: string;
    phoneLabel: string;
    recorded: string;
    mapTitle: string;
    mapLink: string;
    mapAction: string;
  };
  footer: {
    blurb: string;
    rights: string;
  };
  floating: {
    whatsapp: string;
    telegram: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    sending: string;
    notConfigured: string;
    invalid: string;
    failed: string;
    back: string;
    singleDevice: string;
    replaced: string;
  };
  admin: {
    preview: string;
    manager: string;
    overview: string;
    courses: string;
    videos: string;
    enrollments: string;
    registered: string;
    registeredLead: string;
    registeredEmpty: string;
    call: string;
    whatsapp: string;
    noPhone: string;
    back: string;
    statsCourses: string;
    statsTeasers: string;
    statsRequests: string;
    online: string;
    totalStudents: string;
    recent: string;
    empty: string;
    locked: string;
    name: string;
    phone: string;
    secret: string;
    secretLater: string;
    devices: string;
    deviceOne: string;
    deviceTwo: string;
    deviceOff: string;
    deviceLive: string;
    method: string;
    receipt: string;
    noReceipt: string;
    openReceipt: string;
    course: string;
    status: string;
    date: string;
    pending: string;
    routesTitle: string;
    routesLead: string;
    teaserSlots: string;
    waitingUpload: string;
    loadError: string;
    activate: string;
    activating: string;
    active: string;
    activated: string;
    tempPassword: string;
    existingAccount: string;
    lessonTitle: string;
    videoId: string;
    addLesson: string;
    lessons: string;
    noLessons: string;
    bunnyHint: string;
    videosLead: string;
    videoLink: string;
    videoInvalid: string;
    edit: string;
    save: string;
    cancel: string;
    remove: string;
    confirmDelete: string;
    videoSaved: string;
    videoDeleted: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  coursePage: {
    back: string;
    open: string;
  };
  learn: {
    title: string;
    lead: string;
    empty: string;
    locked: string;
    open: string;
    missingVideo: string;
    back: string;
  };
  install: {
    button: string;
    badge: string;
    title: string;
    lead: string;
    ready: string;
    installed: string;
    iphone: { kicker: string; title: string; steps: [string, string, string] };
    android: { kicker: string; title: string; steps: [string, string, string] };
    windows: { kicker: string; title: string; steps: [string, string, string] };
    mac: { kicker: string; title: string; steps: [string, string, string] };
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  ar: {
    localeName: "العربية",
    ticker: "تواصل معنا على الواتساب: 0540190559",
    nav: {
      home: "الرئيسية",
      courses: "الدورات",
      about: "عن الأكاديمية",
      location: "موقع المحل",
      pay: "طرق الدفع",
      login: "تسجيل الدخول",
      loginShort: "دخول",
      menu: "القائمة",
      close: "إغلاق",
      skip: "تخطي إلى المحتوى",
      learn: "دوراتي",
      logout: "خروج",
      themeToDark: "الوضع الداكن",
      themeToLight: "الوضع الفاتح",
    },
    hero: {
      badge: "أكاديمية تصليح الهواتف والمايكروسولدرينغ · الحراش",
      titleBefore: "اشترك معنا في",
      titleHighlight: "الدورة المسجلة",
      subtitle:
        "من فتح الجهاز حتى إصلاح اللوحة. دورة مسجّلة مع فريق OMT في الحراش، بثلاث مستويات واضحة.",
      imageTitle: "صورة الأكاديمية",
      imageHint: "ضع صورة المدرسة في الملف public/academy.jpg",
      location: "الحراش، الجزائر",
      photos: {
        banner: "التدريب تحت المجهر أمام شعار OMT",
        phone: "هاتف بعد الإصلاح في ورشة الأكاديمية",
        bench: "لحام دقيق تحت المجهر في ورشة OMT",
        oran: "متربص من ولاية وهران",
        oran2: "متربص من ولاية وهران في الورشة",
        group: "مجموعة متربصين في أكاديمية OMT",
        algiers: "متربص من ولاية الجزائر",
        sidiBelAbbes: "متربص من سيدي بلعباس",
        skikda: "متربص من ولاية سكيكدة",
        laghouat: "متربص من ولاية الأغواط",
        pair: "متربصان على طاولة العمل",
        stand: "تدريب عملي في ورشة الأكاديمية",
      },
    },
    coursesSection: {
      kicker: "المستويات",
      title: "ثلاث دورات، مسار واحد",
      subtitle: "اختر مستواك. كل دورة تفتح نافذة للاشتراك أو لمشاهدة المقتطفات التشويقية.",
      cta: "عرض الخيارات",
      pageLink: "صفحة الدورة",
    },
    courses: {
      beginner: {
        title: "دورة مبتدئ",
        summary: "أساسيات التشخيص، الأدوات، والتعامل الآمن مع الهاتف قبل أي لحام.",
        points: [
          "فتح الهاتف والتعامل الآمن مع القطع",
          "التعرف على الأدوات وأجهزة القياس",
          "تشخيص الأعطال الشائعة قبل اللحام",
        ],
      },
      intermediate: {
        title: "دورة متوسط متقدم",
        summary: "المايكروسولدرينغ، قراءة المسارات، واستبدال المكوّنات على اللوحة.",
        points: [
          "لحام دقيق واستبدال مكوّنات اللوحة",
          "العمل تحت المجهر على المسارات",
          "أعطال التغذية والشحن المتكررة",
        ],
      },
      professional: {
        title: "دورة محترف",
        summary: "إصلاح الأعطال المعقدة على مستوى اللوحة بمنهجية تشخيص واضحة.",
        points: [
          "أعطال اللوحة والدوائر المعقدة",
          "إعادة بناء المسارات التالفة",
          "منهجية تشخيص للمحترفين",
        ],
      },
    },
    modal: {
      eyebrow: "خيارات الدورة",
      pay: "دفع الرسوم والاشتراك مباشرة",
      payHint: "اختر طريقة الدفع وأرفق وصل التحويل. التفعيل يتم بعد المراجعة.",
      watch: "مشاهدة مقتطفات تشويقية من الدورة",
      watchHint: "15 فيديو تشويقي · 15 ثانية لكل فيديو",
      back: "العودة إلى الخيارات",
      close: "إغلاق",
      teaserTitle: "المقتطفات التشويقية",
      teaserNote: "مقاطع قصيرة من فيديوهات الدورة المضافة في لوحة التحكم، مدة كل واحد 15 ثانية.",
      teaserLabel: "مقتطف",
      waiting: "بانتظار الرفع",
      duration: "0:15",
      enrollTitle: "طلب الاشتراك",
      enrollLead: "اختر طريقة الدفع وأرفق صورة الوصل. الطلب يبقى قيد المراجعة حتى يفعّله المدير.",
      name: "الاسم الكامل",
      phone: "رقم الهاتف (واتساب)",
      email: "البريد الإلكتروني (اختياري)",
      method: "طريقة الدفع",
      methodBaridi: "بريدي موب",
      methodUsdt: "USDT",
      methodCash: "نقداً",
      receipt: "صورة وصل التحويل",
      receiptHint: "JPG أو PNG أو WEBP أو PDF. النقد في المقر يمكن إرساله بدون وصل.",
      pledge:
        "أنا أتعاهد بأنني لن أقوم بتسريب أي فيديو من الفيديوهات المسجلة. وإذا قمت بذلك، سوف تُحظر من هذه الدورة نهائياً.",
      captcha: "Get Captcha",
      captchaHint: "اكتب الرمز الظاهر في الصورة.",
      submit: "إرسال طلب الاشتراك",
      sending: "جارٍ الإرسال...",
      successTitle: "وصلنا طلبك",
      successBody: "تم تسجيل الطلب وهو الآن قيد المراجعة. الاشتراك لا يُفعّل إلا بعد تأكيد الدفع.",
      requestId: "رقم الطلب",
      whatsapp: "إكمال الطلب عبر واتساب",
      details: "صفحة الدورة",
      prefill: "مرحباً OMT، أرغب في الاشتراك في {course}.",
      errors: {
        invalid_name: "اكتب الاسم الكامل، ثلاثة أحرف على الأقل.",
        invalid_phone: "رقم الهاتف غير مكتمل.",
        invalid_email: "البريد الإلكتروني غير صالح.",
        unknown_course: "هذه الدورة غير متاحة.",
        pledge_required: "يجب الموافقة على التعهّد قبل إكمال التسجيل.",
        invalid_captcha: "رمز Get Captcha غير صحيح. اطلب رمزاً جديداً.",
        invalid_method: "اختر طريقة الدفع.",
        invalid_receipt: "أرفق صورة وصل واضحة بصيغة صورة أو PDF.",
        generic: "تعذر إرسال الطلب. حاول مرة أخرى.",
      },
    },
    payments: {
      kicker: "طرق الدفع",
      title: "ادفع بالطريقة التي تناسبك",
      lead: "بعد التحويل أرفق صورة الوصل من نافذة الاشتراك. الطلب يبقى قيد المراجعة حتى التفعيل.",
      copy: "نسخ",
      copied: "تم النسخ",
      missing: "سيظهر الرقم هنا بعد إضافته من إعدادات الأكاديمية.",
      baridiTitle: "بريدي موب / CCP",
      baridiLead: "حوّل إلى حساب بريدي ثم أرفق صورة الوصف.",
      holder: "صاحب الحساب",
      rip: "رقم RIP",
      account: "تفاصيل الحساب البريدي",
      usdtTitle: "USDT",
      usdtLead: "حوّل على الشبكة المكتوبة فقط، ثم انسخ العنوان.",
      trc20: "شبكة TRC20",
      bep20: "شبكة BEP20",
      cashTitle: "الدفع نقداً",
      cashLead: "سلّم الرسوم يدوياً في مقر الأكاديمية.",
      cashPlace: "الحراش، الجزائر العاصمة",
    },
    about: {
      kicker: "عن الأكاديمية",
      title: "OMT في الحراش",
      body: "Optima Mobile Team أكاديمية متخصصة في تصليح الهواتف والمايكروسولدرينغ. الدورة مسجّلة لتتعلم بهدوء، من أول أداة حتى إصلاح اللوحة، مع مسار واضح: مبتدئ، متوسط متقدم، ثم محترف.",
      placeLabel: "المقر",
      place: "المحمدية مول، الطابق الثاني، 1046",
      phoneLabel: "واتساب",
      recorded: "الدورة مسجّلة وتُفعّل بعد تأكيد الاشتراك.",
      mapTitle: "موقع الأكاديمية على الخريطة",
      mapLink: "الخريطة",
      mapAction: "افتح الموقع في خرائط جوجل",
    },
    footer: {
      blurb: "أكاديمية تصليح الهواتف والمايكروسولدرينغ في الحراش.",
      rights: "© 2026 OMT Optima Mobile Team. كل الحقوق محفوظة.",
    },
    floating: {
      whatsapp: "واتساب",
      telegram: "تيليغرام",
    },
    login: {
      title: "تسجيل الدخول",
      subtitle: "ادخل بحساب المدير، أو بحساب المتدرب بعد تفعيل الاشتراك.",
      email: "البريد أو الهاتف",
      password: "كلمة المرور",
      submit: "دخول",
      sending: "جارٍ التحقق...",
      notConfigured: "تعذر الدخول الآن. حاول مرة أخرى.",
      invalid: "أدخل البريد أو الهاتف وكلمة المرور.",
      failed: "بيانات الدخول غير صحيحة.",
      back: "العودة إلى الرئيسية",
      singleDevice: "حساب المتدرب يبقى مفتوحاً على جهاز واحد. الدخول من جهاز أو متصفح جديد يغلق الجلسة السابقة.",
      replaced: "هذا الحساب مفتوح الآن على جهاز آخر، لذلك أُغلقت هذه الجلسة.",
    },
    admin: {
      preview: "فعّل اشتراك المتدرب بعد تأكيد الدفع. المشاهدة تبقى مغلقة حتى التفعيل.",
      manager: "المدير العام",
      overview: "نظرة عامة",
      courses: "الدورات",
      videos: "الفيديوهات",
      enrollments: "طلبات الاشتراك",
      registered: "المسجلون",
      registeredLead: "أسماء المسجلين وأرقامهم للاتصال أو واتساب مباشرة.",
      registeredEmpty: "لا يوجد مسجلون بعد.",
      call: "اتصال",
      whatsapp: "واتساب",
      noPhone: "لا يوجد رقم للاتصال.",
      back: "الموقع",
      statsCourses: "دورات",
      statsTeasers: "مقطع تشويقي",
      statsRequests: "طلب اشتراك",
      online: "متواجدون الآن",
      totalStudents: "متدربون مسجلون",
      recent: "آخر الطلبات",
      empty: "لا توجد طلبات بعد.",
      locked: "هذه الصفحة للمدير فقط.",
      name: "الاسم",
      phone: "الهاتف",
      secret: "الرمز السري",
      secretLater: "يظهر بعد التفعيل",
      devices: "الأجهزة",
      deviceOne: "جهاز واحد",
      deviceTwo: "جهازان",
      deviceOff: "غير متصل",
      deviceLive: "متصل",
      method: "الدفع",
      receipt: "الوصل",
      noReceipt: "بدون وصل",
      openReceipt: "فتح الوصل",
      course: "الدورة",
      status: "الحالة",
      date: "التاريخ",
      pending: "قيد المراجعة",
      routesTitle: "مسارات الربط",
      routesLead: "الطلبات والدروس والحسابات محفوظة في قاعدة البيانات المحلية.",
      teaserSlots: "خانات المقتطفات",
      waitingUpload: "بانتظار رفع فيديو 15 ثانية",
      loadError: "تعذر تحميل الطلبات.",
      activate: "تفعيل الاشتراك",
      activating: "جارٍ التفعيل...",
      active: "مفعّل",
      activated: "تم تفعيل الاشتراك.",
      tempPassword: "الرمز السري يبقى ظاهراً في الجدول. أرسله للمتدرب:",
      existingAccount: "الحساب موجود مسبقاً. المتدرب يدخل بكلمة مروره الحالية.",
      lessonTitle: "عنوان الدرس",
      videoId: "معرّف فيديو Bunny",
      addLesson: "إضافة الدرس",
      lessons: "دروس الدورة",
      noLessons: "لا توجد دروس بعد.",
      bunnyHint: "ضع BUNNY_LIBRARY_ID و BUNNY_TOKEN_KEY في الخادم، وفعّل Embed token في مكتبة Bunny. لا يُرسل رابط التحميل إلى المتصفح.",
      videosLead: "أضف دروس كل دورة، ثم عدّل العنوان أو رابط Bunny، أو احذف الدرس.",
      videoLink: "رابط Bunny أو معرّف الفيديو",
      videoInvalid: "استخدم رابط التضمين من Bunny أو معرّف الفيديو. رابط التحميل لا يُقبل.",
      edit: "تعديل",
      save: "حفظ",
      cancel: "إلغاء",
      remove: "حذف",
      confirmDelete: "تأكيد الحذف",
      videoSaved: "تم حفظ الدرس.",
      videoDeleted: "تم حذف الدرس.",
    },
    notFound: {
      title: "الصفحة غير موجودة",
      body: "هذا المسار لا يطابق دورة أو صفحة في الأكاديمية.",
      back: "العودة إلى الرئيسية",
    },
    coursePage: {
      back: "رجوع",
      open: "خيارات الاشتراك والمقتطفات",
    },
    learn: {
      title: "دوراتي",
      lead: "المشاهدة متاحة للاشتراك المفعّل فقط.",
      empty: "لا توجد دورة مفعّلة على هذا الحساب بعد.",
      locked: "هذا الحساب غير مشترك في هذه الدورة.",
      open: "مشاهدة الدورة",
      missingVideo: "الاشتراك مفعّل. الفيديو محمي ولن يُعرض حتى يُربط Bunny.net من الخادم.",
      back: "كل دوراتي",
    },
    install: {
      button: "تثبيت التطبيق",
      badge: "تطبيق OMT",
      title: "ثبّت تطبيق OMT على جهازك",
      lead: "أضِف الأكاديمية إلى شاشتك وافتحها كتطبيق كامل على هاتف أندرويد أو آيفون، أو على كمبيوتر ويندوز أو ماك، بدون أي متجر.",
      ready: "هذا المتصفح يستطيع التثبيت الآن. اضغط زر جهازك ثم أكّد.",
      installed: "التطبيق مثبت على هذا الجهاز.",
      iphone: {
        kicker: "أضف OMT إلى الشاشة الرئيسية",
        title: "تثبيت على iPhone",
        steps: ["افتح الموقع في Safari.", "اضغط زر المشاركة.", "اختر «إضافة إلى الشاشة الرئيسية»."],
      },
      android: {
        kicker: "ثبّت OMT كتطبيق على هاتفك",
        title: "تثبيت على Android",
        steps: ["افتح الموقع في Chrome.", "اضغط «تثبيت على Android» أو من قائمة المتصفح.", "أكّد التثبيت ليظهر على الشاشة الرئيسية."],
      },
      windows: {
        kicker: "ثبّت OMT كتطبيق على جهازك",
        title: "تثبيت على Windows",
        steps: ["افتح الموقع في Chrome أو Edge.", "اضغط «تثبيت على Windows»، أو من قائمة المتصفح اختر تثبيت التطبيق.", "أكّد ليظهر التطبيق في قائمة ابدأ."],
      },
      mac: {
        kicker: "ثبّت OMT كتطبيق على جهازك",
        title: "تثبيت على Mac",
        steps: ["في Safari اختر ملف ثم «إضافة إلى Dock».", "أو في Chrome اضغط تثبيت التطبيق.", "يفتح OMT بعد ذلك من Dock."],
      },
    },
  },
  fr: {
    localeName: "Français",
    ticker: "Contactez-nous sur WhatsApp : 0540190559",
    nav: {
      home: "Accueil",
      courses: "Cours",
      about: "L'académie",
      location: "Le magasin",
      pay: "Paiement",
      login: "Connexion",
      loginShort: "Connexion",
      menu: "Menu",
      close: "Fermer",
      skip: "Aller au contenu",
      learn: "Mes cours",
      logout: "Sortir",
      themeToDark: "Mode sombre",
      themeToLight: "Mode clair",
    },
    hero: {
      badge: "Académie de réparation mobile et microsoudure · El Harrach",
      titleBefore: "Inscrivez-vous avec nous au",
      titleHighlight: "cours enregistré",
      subtitle:
        "De l'ouverture du téléphone à la réparation de la carte. Un cours enregistré avec l'équipe OMT à El Harrach, en trois niveaux.",
      imageTitle: "Photo de l'académie",
      imageHint: "Ajoutez la photo dans public/academy.jpg",
      location: "El Harrach, Algérie",
      photos: {
        banner: "Formation au microscope devant le logo OMT",
        phone: "Téléphone réparé dans l'atelier",
        bench: "Microsoudure sous microscope à l'atelier OMT",
        oran: "Stagiaire de la wilaya d'Oran",
        oran2: "Stagiaire de la wilaya d'Oran à l'atelier",
        group: "Groupe de stagiaires à l'académie OMT",
        algiers: "Stagiaire de la wilaya d'Alger",
        sidiBelAbbes: "Stagiaire de Sidi Bel Abbès",
        skikda: "Stagiaire de la wilaya de Skikda",
        laghouat: "Stagiaire de la wilaya de Laghouat",
        pair: "Deux stagiaires à l'établi",
        stand: "Formation pratique à l'atelier",
      },
    },
    coursesSection: {
      kicker: "Niveaux",
      title: "Trois cours, un seul parcours",
      subtitle: "Choisissez votre niveau. Chaque cours ouvre l'inscription ou les extraits.",
      cta: "Voir les options",
      pageLink: "Page du cours",
    },
    courses: {
      beginner: {
        title: "Cours débutant",
        summary: "Les bases du diagnostic, les outils, et la manipulation sûre avant toute soudure.",
        points: [
          "Ouverture du téléphone et sécurité des pièces",
          "Outils et appareils de mesure",
          "Pannes courantes avant la soudure",
        ],
      },
      intermediate: {
        title: "Cours intermédiaire avancé",
        summary: "Microsoudure, lecture des pistes, et remplacement des composants.",
        points: [
          "Soudure fine et remplacement de composants",
          "Travail sous microscope sur les pistes",
          "Pannes d'alimentation et de charge",
        ],
      },
      professional: {
        title: "Cours professionnel",
        summary: "Réparation des pannes complexes au niveau de la carte, avec une méthode claire.",
        points: [
          "Pannes complexes de carte et de circuits",
          "Reconstruction des pistes abîmées",
          "Méthode de diagnostic professionnelle",
        ],
      },
    },
    modal: {
      eyebrow: "Options du cours",
      pay: "Payer les frais et s'inscrire directement",
      payHint: "Choisissez le paiement et joignez le reçu. L'activation suit la vérification.",
      watch: "Regarder les extraits du cours",
      watchHint: "15 vidéos · 15 secondes chacune",
      back: "Retour aux options",
      close: "Fermer",
      teaserTitle: "Extraits",
      teaserNote: "Extraits courts des vidéos du cours ajoutées depuis le tableau de bord, 15 secondes chacun.",
      teaserLabel: "Extrait",
      waiting: "En attente",
      duration: "0:15",
      enrollTitle: "Demande d'inscription",
      enrollLead: "Choisissez le paiement et joignez le reçu. La demande reste en examen jusqu'à l'activation.",
      name: "Nom complet",
      phone: "Téléphone (WhatsApp)",
      email: "E-mail (facultatif)",
      method: "Mode de paiement",
      methodBaridi: "BaridiMob",
      methodUsdt: "USDT",
      methodCash: "Espèces",
      receipt: "Photo du reçu",
      receiptHint: "JPG, PNG, WEBP ou PDF. Le paiement en espèces peut partir sans reçu.",
      pledge:
        "Je m'engage à ne divulguer aucune vidéo des cours enregistrés. Si je le fais, je serai définitivement exclu de ce cours.",
      captcha: "Get Captcha",
      captchaHint: "Saisissez le code affiché.",
      submit: "Envoyer la demande",
      sending: "Envoi...",
      successTitle: "Demande reçue",
      successBody: "La demande est enregistrée et elle est en cours d'examen. Le cours s'active après confirmation du paiement.",
      requestId: "Numéro",
      whatsapp: "Continuer sur WhatsApp",
      details: "Page du cours",
      prefill: "Bonjour OMT, je souhaite m'inscrire à : {course}.",
      errors: {
        invalid_name: "Indiquez un nom complet d'au moins 3 caractères.",
        invalid_phone: "Le numéro de téléphone est incomplet.",
        invalid_email: "L'e-mail n'est pas valide.",
        unknown_course: "Ce cours n'est pas disponible.",
        pledge_required: "Vous devez accepter l'engagement avant de terminer l'inscription.",
        invalid_captcha: "Le code Get Captcha est incorrect. Demandez-en un nouveau.",
        invalid_method: "Choisissez un mode de paiement.",
        invalid_receipt: "Joignez une photo nette du reçu, en image ou en PDF.",
        generic: "Envoi impossible. Réessayez.",
      },
    },
    payments: {
      kicker: "Paiement",
      title: "Payez comme il vous convient",
      lead: "Après le transfert, joignez la photo du reçu depuis l'inscription. La demande reste en examen jusqu'à l'activation.",
      copy: "Copier",
      copied: "Copié",
      missing: "Le numéro apparaîtra ici après son ajout dans les réglages de l'académie.",
      baridiTitle: "BaridiMob / CCP",
      baridiLead: "Transférez vers un compte Baridi, puis joignez l'image de la description.",
      holder: "Titulaire",
      rip: "Numéro RIP",
      account: "Détails du compte postal",
      usdtTitle: "USDT",
      usdtLead: "Transférez uniquement sur le réseau indiqué, puis copiez l'adresse.",
      trc20: "Réseau TRC20",
      bep20: "Réseau BEP20",
      cashTitle: "Paiement en espèces",
      cashLead: "Remettez les frais en main propre au siège de l'académie.",
      cashPlace: "El Harrach, Alger",
    },
    about: {
      kicker: "L'académie",
      title: "OMT à El Harrach",
      body: "Optima Mobile Team est une académie de réparation mobile et de microsoudure. Le cours est enregistré, du premier outil jusqu'à la carte mère, en trois niveaux.",
      placeLabel: "Adresse",
      place: "Mohammadia Mall, 2e étage, 1046",
      phoneLabel: "WhatsApp",
      recorded: "Le cours enregistré s'active après confirmation de l'inscription.",
      mapTitle: "L'académie sur la carte",
      mapLink: "La carte",
      mapAction: "Ouvrir dans Google Maps",
    },
    footer: {
      blurb: "Académie de réparation mobile et de microsoudure à El Harrach.",
      rights: "© 2026 OMT Optima Mobile Team. Tous droits réservés.",
    },
    floating: { whatsapp: "WhatsApp", telegram: "Telegram" },
    login: {
      title: "Connexion",
      subtitle: "Entrez avec le compte administrateur, ou avec le compte stagiaire après activation.",
      email: "E-mail ou téléphone",
      password: "Mot de passe",
      submit: "Entrer",
      sending: "Vérification...",
      notConfigured: "Connexion impossible pour le moment. Réessayez.",
      invalid: "Saisissez l'e-mail ou le téléphone et le mot de passe.",
      failed: "Identifiants incorrects.",
      back: "Retour à l'accueil",
      singleDevice: "Le compte stagiaire reste ouvert sur un seul appareil. Une connexion depuis un autre appareil ou navigateur ferme la session précédente.",
      replaced: "Ce compte est ouvert sur un autre appareil. Cette session a été fermée.",
    },
    admin: {
      preview: "Activez l'inscription après confirmation du paiement. La lecture reste fermée jusque-là.",
      manager: "Directeur général",
      overview: "Aperçu",
      courses: "Cours",
      videos: "Vidéos",
      enrollments: "Inscriptions",
      registered: "Inscrits",
      registeredLead: "Noms et numéros des inscrits pour les appeler ou leur écrire sur WhatsApp.",
      registeredEmpty: "Aucun inscrit pour le moment.",
      call: "Appeler",
      whatsapp: "WhatsApp",
      noPhone: "Aucun numéro.",
      back: "Site",
      statsCourses: "Cours",
      statsTeasers: "Extraits",
      statsRequests: "Demandes",
      online: "En ligne maintenant",
      totalStudents: "Stagiaires inscrits",
      recent: "Dernières demandes",
      empty: "Aucune demande pour le moment.",
      locked: "Cette page est réservée à l'administrateur.",
      name: "Nom",
      phone: "Téléphone",
      secret: "Code secret",
      secretLater: "Visible après activation",
      devices: "Appareils",
      deviceOne: "1 appareil",
      deviceTwo: "2 appareils",
      deviceOff: "Hors ligne",
      deviceLive: "En ligne",
      method: "Paiement",
      receipt: "Reçu",
      noReceipt: "Sans reçu",
      openReceipt: "Ouvrir le reçu",
      course: "Cours",
      status: "Statut",
      date: "Date",
      pending: "En examen",
      routesTitle: "Routes prévues",
      routesLead: "Les demandes, les leçons et les comptes sont enregistrés dans la base locale.",
      teaserSlots: "Emplacements d'extraits",
      waitingUpload: "Vidéo de 15 secondes à ajouter",
      loadError: "Impossible de charger les demandes.",
      activate: "Activer l'inscription",
      activating: "Activation...",
      active: "Activé",
      activated: "Inscription activée.",
      tempPassword: "Le code secret reste visible dans le tableau. Envoyez-le au stagiaire :",
      existingAccount: "Le compte existe déjà. Le stagiaire utilise son mot de passe actuel.",
      lessonTitle: "Titre de la leçon",
      videoId: "Identifiant vidéo Bunny",
      addLesson: "Ajouter la leçon",
      lessons: "Leçons du cours",
      noLessons: "Aucune leçon pour le moment.",
      bunnyHint: "Ajoutez BUNNY_LIBRARY_ID et BUNNY_TOKEN_KEY sur le serveur, et activez le jeton d'intégration Bunny. Aucun lien de téléchargement n'est envoyé au navigateur.",
      videosLead: "Ajoutez les leçons de chaque cours, puis modifiez le titre, le lien Bunny, ou supprimez la leçon.",
      videoLink: "Lien Bunny ou identifiant",
      videoInvalid: "Utilisez le lien d'intégration Bunny ou l'identifiant. Un lien de téléchargement est refusé.",
      edit: "Modifier",
      save: "Enregistrer",
      cancel: "Annuler",
      remove: "Supprimer",
      confirmDelete: "Confirmer",
      videoSaved: "Leçon enregistrée.",
      videoDeleted: "Leçon supprimée.",
    },
    notFound: {
      title: "Page introuvable",
      body: "Ce lien ne correspond à aucun cours ni à aucune page.",
      back: "Retour à l'accueil",
    },
    coursePage: {
      back: "Retour",
      open: "Inscription et extraits",
    },
    learn: {
      title: "Mes cours",
      lead: "La lecture est réservée à l'inscription activée.",
      empty: "Aucun cours activé sur ce compte.",
      locked: "Ce compte n'est pas inscrit à ce cours.",
      open: "Regarder le cours",
      missingVideo: "L'inscription est active. La vidéo reste protégée tant que Bunny.net n'est pas relié au serveur.",
      back: "Tous mes cours",
    },
    install: {
      button: "Installer l'application",
      badge: "Application OMT",
      title: "Installez OMT sur votre appareil",
      lead: "Ajoutez l'académie à votre écran et ouvrez-la comme une application, sur Android, iPhone, Windows ou Mac, sans store.",
      ready: "Ce navigateur peut installer maintenant. Appuyez sur votre appareil puis confirmez.",
      installed: "L'application est installée sur cet appareil.",
      iphone: {
        kicker: "Ajoutez OMT à l'écran d'accueil",
        title: "Installer sur iPhone",
        steps: ["Ouvrez le site dans Safari.", "Appuyez sur le bouton Partager.", "Choisissez « Ajouter à l'écran d'accueil »."],
      },
      android: {
        kicker: "Installez OMT sur votre téléphone",
        title: "Installer sur Android",
        steps: ["Ouvrez le site dans Chrome.", "Appuyez sur « Installer sur Android » ou le menu du navigateur.", "Confirmez pour l'afficher sur l'écran d'accueil."],
      },
      windows: {
        kicker: "Installez OMT sur votre ordinateur",
        title: "Installer sur Windows",
        steps: ["Ouvrez le site dans Chrome ou Edge.", "Appuyez sur « Installer sur Windows », ou choisissez Installer dans le menu du navigateur.", "Confirmez pour l'afficher dans le menu Démarrer."],
      },
      mac: {
        kicker: "Installez OMT sur votre Mac",
        title: "Installer sur Mac",
        steps: ["Dans Safari : Fichier, puis « Ajouter au Dock ».", "Ou dans Chrome, utilisez Installer l'application.", "OMT s'ouvre ensuite depuis le Dock."],
      },
    },
  },
  en: {
    localeName: "English",
    ticker: "Contact us on WhatsApp: 0540190559",
    nav: {
      home: "Home",
      courses: "Courses",
      about: "The academy",
      location: "The shop",
      pay: "Payment",
      login: "Log in",
      loginShort: "Log in",
      menu: "Menu",
      close: "Close",
      skip: "Skip to content",
      learn: "My courses",
      logout: "Log out",
      themeToDark: "Dark mode",
      themeToLight: "Light mode",
    },
    hero: {
      badge: "Phone repair and microsoldering academy · El Harrach",
      titleBefore: "Subscribe with us to the",
      titleHighlight: "recorded course",
      subtitle:
        "From opening the phone to board repair. A recorded course with the OMT team in El Harrach, in three clear levels.",
      imageTitle: "Academy photo",
      imageHint: "Add the photo at public/academy.jpg",
      location: "El Harrach, Algeria",
      photos: {
        banner: "Training at the microscope in front of the OMT logo",
        phone: "A repaired phone in the academy workshop",
        bench: "Fine soldering under the microscope at OMT",
        oran: "A trainee from Oran",
        oran2: "A trainee from Oran in the workshop",
        group: "A group of trainees at the OMT academy",
        algiers: "A trainee from Algiers",
        sidiBelAbbes: "A trainee from Sidi Bel Abbès",
        skikda: "A trainee from Skikda",
        laghouat: "A trainee from Laghouat",
        pair: "Two trainees at the workbench",
        stand: "Hands-on training in the academy workshop",
      },
    },
    coursesSection: {
      kicker: "Levels",
      title: "Three courses, one path",
      subtitle: "Pick your level. Each course opens enrollment or the teaser clips.",
      cta: "View options",
      pageLink: "Course page",
    },
    courses: {
      beginner: {
        title: "Beginner course",
        summary: "Diagnosis basics, tools, and safe handling before any soldering.",
        points: [
          "Opening the phone and handling parts safely",
          "Tools and measuring instruments",
          "Common faults before soldering",
        ],
      },
      intermediate: {
        title: "Intermediate–advanced course",
        summary: "Microsoldering, trace reading, and replacing board components.",
        points: [
          "Fine soldering and component replacement",
          "Microscope work on traces",
          "Recurring power and charging faults",
        ],
      },
      professional: {
        title: "Professional course",
        summary: "Complex board-level repair with a clear diagnostic method.",
        points: [
          "Complex board and circuit faults",
          "Rebuilding damaged traces",
          "A professional diagnostic method",
        ],
      },
    },
    modal: {
      eyebrow: "Course options",
      pay: "Pay the fees and subscribe directly",
      payHint: "Choose a payment method and attach the receipt. Activation follows review.",
      watch: "Watch teaser clips from the course",
      watchHint: "15 teaser videos · 15 seconds each",
      back: "Back to options",
      close: "Close",
      teaserTitle: "Teaser clips",
      teaserNote: "Short clips from the course videos added in the dashboard, 15 seconds each.",
      teaserLabel: "Clip",
      waiting: "Waiting for upload",
      duration: "0:15",
      enrollTitle: "Enrollment request",
      enrollLead: "Choose how you paid and attach the receipt. The request stays under review until an admin activates it.",
      name: "Full name",
      phone: "Phone (WhatsApp)",
      email: "Email (optional)",
      method: "Payment method",
      methodBaridi: "BaridiMob",
      methodUsdt: "USDT",
      methodCash: "Cash",
      receipt: "Receipt photo",
      receiptHint: "JPG, PNG, WEBP, or PDF. Cash at the academy can be sent without a receipt.",
      pledge:
        "I pledge not to leak any video from the recorded courses. If I do, I will be permanently banned from this course.",
      captcha: "Get Captcha",
      captchaHint: "Type the code shown in the image.",
      submit: "Send enrollment request",
      sending: "Sending...",
      successTitle: "Request received",
      successBody: "Your request is saved and is now under review. The course stays closed until payment is confirmed.",
      requestId: "Request number",
      whatsapp: "Continue on WhatsApp",
      details: "Course page",
      prefill: "Hello OMT, I want to enroll in {course}.",
      errors: {
        invalid_name: "Enter a full name of at least 3 characters.",
        invalid_phone: "The phone number is incomplete.",
        invalid_email: "The email address is not valid.",
        unknown_course: "This course is not available.",
        pledge_required: "You must accept the pledge before completing enrollment.",
        invalid_captcha: "The Get Captcha code is wrong. Request a new one.",
        invalid_method: "Choose a payment method.",
        invalid_receipt: "Attach a clear receipt as an image or a PDF.",
        generic: "The request could not be sent. Try again.",
      },
    },
    payments: {
      kicker: "Payment",
      title: "Pay the way that suits you",
      lead: "After the transfer, attach the receipt from the enrollment window. The request stays under review until activation.",
      copy: "Copy",
      copied: "Copied",
      missing: "The number appears here after it is added in the academy settings.",
      baridiTitle: "BaridiMob / CCP",
      baridiLead: "Transfer to a Baridi account, then attach the description image.",
      holder: "Account holder",
      rip: "RIP number",
      account: "Postal account details",
      usdtTitle: "USDT",
      usdtLead: "Transfer only on the named network, then copy the address.",
      trc20: "TRC20 network",
      bep20: "BEP20 network",
      cashTitle: "Cash payment",
      cashLead: "Hand the fee in person at the academy.",
      cashPlace: "El Harrach, Algiers",
    },
    about: {
      kicker: "The academy",
      title: "OMT in El Harrach",
      body: "Optima Mobile Team is an academy for phone repair and microsoldering. The course is recorded, from the first tool to board repair, across three levels.",
      placeLabel: "Location",
      place: "Mohammadia Mall, second floor, 1046",
      phoneLabel: "WhatsApp",
      recorded: "The recorded course is activated after enrollment is confirmed.",
      mapTitle: "The academy on the map",
      mapLink: "Map",
      mapAction: "Open in Google Maps",
    },
    footer: {
      blurb: "Phone repair and microsoldering academy in El Harrach.",
      rights: "© 2026 OMT Optima Mobile Team. All rights reserved.",
    },
    floating: { whatsapp: "WhatsApp", telegram: "Telegram" },
    login: {
      title: "Log in",
      subtitle: "Sign in as admin, or as a trainee after the enrollment is activated.",
      email: "Email or phone",
      password: "Password",
      submit: "Log in",
      sending: "Checking...",
      notConfigured: "Sign-in failed for now. Try again.",
      invalid: "Enter your email or phone and password.",
      failed: "Those sign-in details are not correct.",
      back: "Back to home",
      singleDevice: "A trainee account stays open on one device. Signing in from another device or browser closes the previous session.",
      replaced: "This account is open on another device, so this session was closed.",
    },
    admin: {
      preview: "Activate a trainee after payment is confirmed. Watching stays closed until then.",
      manager: "General manager",
      overview: "Overview",
      courses: "Courses",
      videos: "Videos",
      enrollments: "Enrollments",
      registered: "Registered",
      registeredLead: "Names and numbers of registered students so you can call or message them.",
      registeredEmpty: "No registered students yet.",
      call: "Call",
      whatsapp: "WhatsApp",
      noPhone: "No phone number.",
      back: "Site",
      statsCourses: "Courses",
      statsTeasers: "Teaser clips",
      statsRequests: "Requests",
      online: "Online now",
      totalStudents: "Registered trainees",
      recent: "Latest requests",
      empty: "No requests yet.",
      locked: "This page is for the admin only.",
      name: "Name",
      phone: "Phone",
      secret: "Secret code",
      secretLater: "Shown after activation",
      devices: "Devices",
      deviceOne: "1 device",
      deviceTwo: "2 devices",
      deviceOff: "Offline",
      deviceLive: "Online",
      method: "Payment",
      receipt: "Receipt",
      noReceipt: "No receipt",
      openReceipt: "Open receipt",
      course: "Course",
      status: "Status",
      date: "Date",
      pending: "Under review",
      routesTitle: "Connection routes",
      routesLead: "Requests, lessons, and accounts are stored in the local database.",
      teaserSlots: "Teaser slots",
      waitingUpload: "Waiting for a 15-second video",
      loadError: "Could not load requests.",
      activate: "Activate enrollment",
      activating: "Activating...",
      active: "Active",
      activated: "Enrollment activated.",
      tempPassword: "The secret code stays visible in the table. Send it to the trainee:",
      existingAccount: "The account already exists. The trainee uses their current password.",
      lessonTitle: "Lesson title",
      videoId: "Bunny video id",
      addLesson: "Add lesson",
      lessons: "Course lessons",
      noLessons: "No lessons yet.",
      bunnyHint: "Set BUNNY_LIBRARY_ID and BUNNY_TOKEN_KEY on the server, and turn on Bunny embed token authentication. No download link is sent to the browser.",
      videosLead: "Add each course lesson, then edit the title, the Bunny link, or delete the lesson.",
      videoLink: "Bunny link or video id",
      videoInvalid: "Use the Bunny embed link or the video id. A download link is rejected.",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      remove: "Delete",
      confirmDelete: "Confirm delete",
      videoSaved: "Lesson saved.",
      videoDeleted: "Lesson deleted.",
    },
    notFound: {
      title: "Page not found",
      body: "This address does not match a course or a page.",
      back: "Back to home",
    },
    coursePage: {
      back: "Back",
      open: "Enrollment and teasers",
    },
    learn: {
      title: "My courses",
      lead: "Watching is available only for an activated enrollment.",
      empty: "No activated course on this account yet.",
      locked: "This account is not enrolled in this course.",
      open: "Watch the course",
      missingVideo: "Enrollment is active. The video stays protected until Bunny.net is connected on the server.",
      back: "All my courses",
    },
    install: {
      button: "Install the app",
      badge: "OMT app",
      title: "Install OMT on your device",
      lead: "Add the academy to your screen and open it as a full app on Android, iPhone, Windows, or Mac, without an app store.",
      ready: "This browser can install now. Press your device button, then confirm.",
      installed: "The app is installed on this device.",
      iphone: {
        kicker: "Add OMT to the Home Screen",
        title: "Install on iPhone",
        steps: ["Open this site in Safari.", "Tap the Share button.", "Choose Add to Home Screen."],
      },
      android: {
        kicker: "Install OMT on your phone",
        title: "Install on Android",
        steps: ["Open this site in Chrome.", "Tap Install on Android, or the browser menu.", "Confirm so it appears on your home screen."],
      },
      windows: {
        kicker: "Install OMT on your computer",
        title: "Install on Windows",
        steps: ["Open this site in Chrome or Edge.", "Tap Install on Windows, or choose Install app from the browser menu.", "Confirm so the app appears in the Start menu."],
      },
      mac: {
        kicker: "Install OMT on your Mac",
        title: "Install on Mac",
        steps: ["In Safari, choose File, then Add to Dock.", "Or in Chrome, use Install the app.", "OMT then opens from the Dock."],
      },
    },
  },
  es: {
    localeName: "Español",
    ticker: "Contáctanos por WhatsApp: 0540190559",
    nav: {
      home: "Inicio",
      courses: "Cursos",
      about: "La academia",
      location: "El local",
      pay: "Pago",
      login: "Iniciar sesión",
      loginShort: "Entrar",
      menu: "Menú",
      close: "Cerrar",
      skip: "Saltar al contenido",
      learn: "Mis cursos",
      logout: "Salir",
      themeToDark: "Modo oscuro",
      themeToLight: "Modo claro",
    },
    hero: {
      badge: "Academia de reparación de móviles y microsoldadura · El Harrach",
      titleBefore: "Suscríbete con nosotros al",
      titleHighlight: "curso grabado",
      subtitle:
        "Desde abrir el teléfono hasta reparar la placa. Un curso grabado con el equipo OMT en El Harrach, en tres niveles.",
      imageTitle: "Foto de la academia",
      imageHint: "Añade la foto en public/academy.jpg",
      location: "El Harrach, Argelia",
      photos: {
        banner: "Formación en el microscopio frente al logo de OMT",
        phone: "Un teléfono reparado en el taller",
        bench: "Microsoldadura bajo el microscopio en OMT",
        oran: "Un alumno de la provincia de Orán",
        oran2: "Un alumno de Orán en el taller",
        group: "Grupo de alumnos en la academia OMT",
        algiers: "Un alumno de Argel",
        sidiBelAbbes: "Un alumno de Sidi Bel Abbès",
        skikda: "Un alumno de Skikda",
        laghouat: "Un alumno de Laghouat",
        pair: "Dos alumnos en el banco de trabajo",
        stand: "Formación práctica en el taller",
      },
    },
    coursesSection: {
      kicker: "Niveles",
      title: "Tres cursos, un solo camino",
      subtitle: "Elige tu nivel. Cada curso abre la inscripción o los avances.",
      cta: "Ver opciones",
      pageLink: "Página del curso",
    },
    courses: {
      beginner: {
        title: "Curso principiante",
        summary: "Bases del diagnóstico, herramientas y manejo seguro antes de soldar.",
        points: [
          "Abrir el teléfono y cuidar las piezas",
          "Herramientas e instrumentos de medida",
          "Fallos habituales antes de soldar",
        ],
      },
      intermediate: {
        title: "Curso intermedio avanzado",
        summary: "Microsoldadura, lectura de pistas y sustitución de componentes.",
        points: [
          "Soldadura fina y cambio de componentes",
          "Trabajo con microscopio en las pistas",
          "Fallos de alimentación y carga",
        ],
      },
      professional: {
        title: "Curso profesional",
        summary: "Reparación de fallos complejos en la placa, con un método claro.",
        points: [
          "Fallos complejos de placa y circuitos",
          "Reconstrucción de pistas dañadas",
          "Método de diagnóstico profesional",
        ],
      },
    },
    modal: {
      eyebrow: "Opciones del curso",
      pay: "Pagar las tasas y suscribirse directamente",
      payHint: "Elige el pago y adjunta el recibo. La activación llega después de la revisión.",
      watch: "Ver avances del curso",
      watchHint: "15 vídeos · 15 segundos cada uno",
      back: "Volver a las opciones",
      close: "Cerrar",
      teaserTitle: "Avances",
      teaserNote: "Clips cortos de los vídeos del curso añadidos en el panel, 15 segundos cada uno.",
      teaserLabel: "Clip",
      waiting: "Pendiente de subida",
      duration: "0:15",
      enrollTitle: "Solicitud de inscripción",
      enrollLead: "Elige el pago y adjunta el recibo. La solicitud sigue en revisión hasta que el administrador la active.",
      name: "Nombre completo",
      phone: "Teléfono (WhatsApp)",
      email: "Correo (opcional)",
      method: "Forma de pago",
      methodBaridi: "BaridiMob",
      methodUsdt: "USDT",
      methodCash: "Efectivo",
      receipt: "Foto del recibo",
      receiptHint: "JPG, PNG, WEBP o PDF. El pago en efectivo puede enviarse sin recibo.",
      pledge:
        "Me comprometo a no filtrar ningún vídeo de los cursos grabados. Si lo hago, quedaré expulsado de este curso de forma definitiva.",
      captcha: "Get Captcha",
      captchaHint: "Escribe el código que aparece.",
      submit: "Enviar solicitud",
      sending: "Enviando...",
      successTitle: "Solicitud recibida",
      successBody: "La solicitud quedó registrada y está en revisión. El curso sigue cerrado hasta confirmar el pago.",
      requestId: "Número",
      whatsapp: "Continuar por WhatsApp",
      details: "Página del curso",
      prefill: "Hola OMT, quiero inscribirme en {course}.",
      errors: {
        invalid_name: "Escribe un nombre completo de al menos 3 caracteres.",
        invalid_phone: "El teléfono está incompleto.",
        invalid_email: "El correo no es válido.",
        unknown_course: "Este curso no está disponible.",
        pledge_required: "Debes aceptar el compromiso antes de completar la inscripción.",
        invalid_captcha: "El código Get Captcha no es correcto. Pide uno nuevo.",
        invalid_method: "Elige una forma de pago.",
        invalid_receipt: "Adjunta una foto clara del recibo, en imagen o PDF.",
        generic: "No se pudo enviar. Inténtalo de nuevo.",
      },
    },
    payments: {
      kicker: "Pago",
      title: "Paga como te convenga",
      lead: "Después de la transferencia, adjunta la foto del recibo desde la inscripción. La solicitud sigue en revisión hasta la activación.",
      copy: "Copiar",
      copied: "Copiado",
      missing: "El número aparece aquí después de añadirlo en los ajustes de la academia.",
      baridiTitle: "BaridiMob / CCP",
      baridiLead: "Transfiere a una cuenta Baridi y adjunta la imagen de la descripción.",
      holder: "Titular",
      rip: "Número RIP",
      account: "Datos de la cuenta postal",
      usdtTitle: "USDT",
      usdtLead: "Transfiere solo en la red indicada y copia la dirección.",
      trc20: "Red TRC20",
      bep20: "Red BEP20",
      cashTitle: "Pago en efectivo",
      cashLead: "Entrega la tasa en mano en la sede de la academia.",
      cashPlace: "El Harrach, Argel",
    },
    about: {
      kicker: "La academia",
      title: "OMT en El Harrach",
      body: "Optima Mobile Team es una academia de reparación de móviles y microsoldadura. El curso está grabado, desde la primera herramienta hasta la placa, en tres niveles.",
      placeLabel: "Sede",
      place: "Mohammadia Mall, segunda planta, 1046",
      phoneLabel: "WhatsApp",
      recorded: "El curso grabado se activa después de confirmar la inscripción.",
      mapTitle: "La academia en el mapa",
      mapLink: "Mapa",
      mapAction: "Abrir en Google Maps",
    },
    footer: {
      blurb: "Academia de reparación de móviles y microsoldadura en El Harrach.",
      rights: "© 2026 OMT Optima Mobile Team. Todos los derechos reservados.",
    },
    floating: { whatsapp: "WhatsApp", telegram: "Telegram" },
    login: {
      title: "Iniciar sesión",
      subtitle: "Entra con la cuenta de administración, o con la del alumno después de activar la inscripción.",
      email: "Correo o teléfono",
      password: "Contraseña",
      submit: "Entrar",
      sending: "Comprobando...",
      notConfigured: "No se pudo entrar ahora. Inténtalo de nuevo.",
      invalid: "Escribe el correo o el teléfono y la contraseña.",
      failed: "Los datos de acceso no son correctos.",
      back: "Volver al inicio",
      singleDevice: "La cuenta del alumno permanece abierta en un solo dispositivo. Entrar desde otro dispositivo o navegador cierra la sesión anterior.",
      replaced: "Esta cuenta está abierta en otro dispositivo, así que esta sesión se cerró.",
    },
    admin: {
      preview: "Activa la inscripción después de confirmar el pago. La reproducción sigue cerrada hasta entonces.",
      manager: "Director general",
      overview: "Resumen",
      courses: "Cursos",
      videos: "Vídeos",
      enrollments: "Inscripciones",
      registered: "Inscritos",
      registeredLead: "Nombres y números de los inscritos para llamarles o escribirles por WhatsApp.",
      registeredEmpty: "Todavía no hay inscritos.",
      call: "Llamar",
      whatsapp: "WhatsApp",
      noPhone: "Sin número.",
      back: "Sitio",
      statsCourses: "Cursos",
      statsTeasers: "Avances",
      statsRequests: "Solicitudes",
      online: "En línea ahora",
      totalStudents: "Alumnos registrados",
      recent: "Últimas solicitudes",
      empty: "Todavía no hay solicitudes.",
      locked: "Esta página es solo para el administrador.",
      name: "Nombre",
      phone: "Teléfono",
      secret: "Código secreto",
      secretLater: "Visible tras la activación",
      devices: "Dispositivos",
      deviceOne: "1 dispositivo",
      deviceTwo: "2 dispositivos",
      deviceOff: "Desconectado",
      deviceLive: "Conectado",
      method: "Pago",
      receipt: "Recibo",
      noReceipt: "Sin recibo",
      openReceipt: "Abrir recibo",
      course: "Curso",
      status: "Estado",
      date: "Fecha",
      pending: "En revisión",
      routesTitle: "Rutas de conexión",
      routesLead: "Las solicitudes, las lecciones y las cuentas se guardan en la base local.",
      teaserSlots: "Espacios de avances",
      waitingUpload: "Falta un vídeo de 15 segundos",
      loadError: "No se pudieron cargar las solicitudes.",
      activate: "Activar inscripción",
      activating: "Activando...",
      active: "Activa",
      activated: "Inscripción activada.",
      tempPassword: "El código secreto permanece visible en la tabla. Envíalo al alumno:",
      existingAccount: "La cuenta ya existe. El alumno entra con su contraseña actual.",
      lessonTitle: "Título de la lección",
      videoId: "Id de vídeo Bunny",
      addLesson: "Añadir lección",
      lessons: "Lecciones del curso",
      noLessons: "Todavía no hay lecciones.",
      bunnyHint: "Pon BUNNY_LIBRARY_ID y BUNNY_TOKEN_KEY en el servidor, y activa el token de inserción de Bunny. No se envía ningún enlace de descarga al navegador.",
      videosLead: "Añade las lecciones de cada curso, luego edita el título, el enlace de Bunny, o elimina la lección.",
      videoLink: "Enlace de Bunny o identificador",
      videoInvalid: "Usa el enlace de inserción de Bunny o el identificador. Un enlace de descarga no se acepta.",
      edit: "Editar",
      save: "Guardar",
      cancel: "Cancelar",
      remove: "Eliminar",
      confirmDelete: "Confirmar",
      videoSaved: "Lección guardada.",
      videoDeleted: "Lección eliminada.",
    },
    notFound: {
      title: "Página no encontrada",
      body: "Esta dirección no corresponde a ningún curso ni página.",
      back: "Volver al inicio",
    },
    coursePage: {
      back: "Volver",
      open: "Inscripción y avances",
    },
    learn: {
      title: "Mis cursos",
      lead: "La reproducción está disponible solo con la inscripción activada.",
      empty: "Todavía no hay un curso activado en esta cuenta.",
      locked: "Esta cuenta no está inscrita en este curso.",
      open: "Ver el curso",
      missingVideo: "La inscripción está activa. El vídeo sigue protegido hasta conectar Bunny.net en el servidor.",
      back: "Todos mis cursos",
    },
    install: {
      button: "Instalar la aplicación",
      badge: "Aplicación OMT",
      title: "Instala OMT en tu dispositivo",
      lead: "Añade la academia a tu pantalla y ábrela como una aplicación en Android, iPhone, Windows o Mac, sin tienda.",
      ready: "Este navegador puede instalar ahora. Pulsa el botón de tu dispositivo y confirma.",
      installed: "La aplicación está instalada en este dispositivo.",
      iphone: {
        kicker: "Añade OMT a la pantalla de inicio",
        title: "Instalar en iPhone",
        steps: ["Abre el sitio en Safari.", "Pulsa el botón Compartir.", "Elige «Añadir a pantalla de inicio»."],
      },
      android: {
        kicker: "Instala OMT en tu teléfono",
        title: "Instalar en Android",
        steps: ["Abre el sitio en Chrome.", "Pulsa «Instalar en Android» o el menú del navegador.", "Confirma para verla en la pantalla de inicio."],
      },
      windows: {
        kicker: "Instala OMT en tu ordenador",
        title: "Instalar en Windows",
        steps: ["Abre el sitio en Chrome o Edge.", "Pulsa «Instalar en Windows», o elige Instalar aplicación en el menú del navegador.", "Confirma para verla en el menú Inicio."],
      },
      mac: {
        kicker: "Instala OMT en tu Mac",
        title: "Instalar en Mac",
        steps: ["En Safari: Archivo y luego «Añadir al Dock».", "O en Chrome, usa Instalar la aplicación.", "OMT se abre después desde el Dock."],
      },
    },
  },
};

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "fr" || value === "en" || value === "es";
}
