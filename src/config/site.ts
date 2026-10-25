/** Single place for site-wide constants. vite.config.ts reads REPO_NAME too. */
export const REPO_NAME = 'ML_Notes';
export const SITE_NAME = 'ML Notes';

/**
 * Every topic page of the site, declared once. The router, the navbar tabs, the menu and the
 * content build all read this list. `source` is the only Markdown file the build reads for the
 * page: it never scans folders. `band` is the design token of the topic colour (UI-SPEC.md section 1).
 */
export const PAGES = [
  {
    id: 'regression',
    route: '/regression',
    label: 'Regression',
    source: 'content/midterm/Regression.md',
    band: 'dark-navy',
    kind: 'supervised',
  },
  {
    id: 'classification',
    route: '/classification',
    label: 'Classification',
    source: 'content/midterm/Classification.md',
    band: 'deep-green',
    kind: 'supervised',
  },
  {
    id: 'clustering',
    route: '/clustering',
    label: 'Clustering',
    source: 'content/midterm/Clustering.md',
    band: 'primary',
    kind: 'unsupervised',
  },
] as const;

export type PageId = (typeof PAGES)[number]['id'];

/**
 * The reference page of definitions and comparisons. It is not a topic: it has no colour band, no
 * place in the Home diagram and no share in the Home counts. It is built and routed like a page.
 */
export const REFERENCE_PAGE = {
  id: 'definitions',
  route: '/definitions',
  label: 'นิยาม',
  source: 'content/midterm/Definitions.md',
} as const;

/**
 * The cheat sheet: a two-sided A4 page generated from `CheatSheet.md` for the exam. Like the
 * definitions page it is not a topic. Its Markdown holds the content of the boxes; where each box
 * sits on the sheet is decided in `features/cheatsheet/layout.ts`.
 */
export const CHEATSHEET_PAGE = {
  id: 'cheatsheet',
  route: '/cheatsheet',
  label: 'โพย A4',
  source: 'content/midterm/CheatSheet.md',
} as const;

/** The pages built apart from the topics, in the order of the navbar. */
export const EXTRA_PAGES = [REFERENCE_PAGE, CHEATSHEET_PAGE] as const;

/** Every id the content loaders know: the topics and the extra pages. */
export type ContentPageId = PageId | (typeof EXTRA_PAGES)[number]['id'];

export const HOME_ROUTE = '/';

/** Thai labels shown to students, see UI-SPEC.md section 1. */
export const UI_TEXT = {
  loading: 'กำลังโหลด...',
  loadError: 'โหลดเนื้อหาไม่สำเร็จ',
  retry: 'ลองอีกครั้ง',
  notFound: 'ไม่พบหน้านี้',
  backHome: 'กลับหน้าหลัก',
  home: 'หน้าหลัก',
  comingSoon: 'กำลังจัดทำ',
  skipToContent: 'ข้ามไปยังเนื้อหา',
  menuOpen: 'เมนู',
  menuClose: 'ปิดเมนู',
  share: 'แชร์',
  shareTitle: 'แชร์หน้านี้',
  shareHint: 'สแกน QR หรือคัดลอกลิงก์',
  copyLink: 'คัดลอกลิงก์',
  shareOther: 'แชร์ผ่านแอปอื่น',
  linkCopied: 'คัดลอกลิงก์แล้ว',
  dismiss: 'ปิด',
  railOpen: 'เปิดสารบัญ',
  railClose: 'ปิดสารบัญ',
  railLabel: 'สารบัญ',
  overview: 'ภาพรวม',
  backToTop: 'กลับขึ้นบน',
  readingProgress: 'ความคืบหน้าการอ่าน',
  diagramTitle: 'แผนผังแนวข้อสอบ',
  opened: 'เปิด',
  closed: 'ปิด',
  diagramHint: 'กดที่ Midterm เพื่อเปิดแผนผัง',
  diagramCountUnit: 'หัวข้อ',
  homeLead: 'สรุปสูตรและวิธีทำโจทย์คำนวณ แนวข้อสอบกลางภาค',
  courseLabel: '1322308 Machine Learning · Midterm',
  statTopics: 'หัวข้อใหญ่',
  statLeaves: 'หัวข้อย่อย',
  statExamples: 'ตัวอย่างโจทย์',
  statExercises: 'แบบฝึกหัด',
  exercisesLabel: 'แบบฝึกหัด',
  exercisesHint: 'ลองทำเองก่อน แล้วกดดูเฉลยเพื่อเทียบคำตอบ',
  solutionShow: 'ดูเฉลย',
  solutionHide: 'ซ่อนเฉลย',
  definitionsTag: 'Definitions',
  definitionsLink: 'นิยามและการเปรียบเทียบ',
  sheetFront: 'หน้า',
  sheetBack: 'หลัง',
  sheetBoth: 'ดู 2 หน้า',
  sheetExport: 'ส่งออก PDF',
  sheetViews: 'มุมมองโพย',
  updateReady: 'มีเวอร์ชันใหม่ พร้อมใช้งาน',
  updateAction: 'โหลดใหม่',
  offlineReady: 'ใช้งานออฟไลน์ได้แล้ว',
} as const;

/** The two learning types shown as mono tags (Latin, uppercase). */
export const KIND_LABEL = { supervised: 'Supervised', unsupervised: 'Unsupervised' } as const;
