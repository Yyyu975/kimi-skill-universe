export interface Skill {
  id: string;
  name: string;
  en: string;
  desc: string; // 大白话作用
  usage: string[]; // 使用说明
  tags: string[];
  ais: string[]; // 适用的 AI 平台
  link: string; // 官方入口
  hot?: boolean;
}

export interface Category {
  id: string;
  name: string;
  en: string;
  icon: string; // lucide icon name
  blurb: string;
  skills: Skill[];
}

const KIMI = "https://www.kimi.com/";

export const categories: Category[] = [
  {
    id: "office",
    name: "办公文档",
    en: "OFFICE & DOCS",
    icon: "FileText",
    blurb: "做 PPT、写 Word、算 Excel、排 PDF——Office 全家桶活儿全包",
    skills: [
      {
        id: "kimi-slides",
        name: "幻灯片制作",
        en: "kimi-slides",
        desc: "一句话就能生成一整套精美 PPT，也能帮你改已有的 PPT、把 PPT 转成图片。做汇报、课件、路演都能用。",
        usage: [
          "直接说「帮我做一份关于 XX 的 PPT」",
          "上传旧 PPT 说「帮我美化 / 修改第 X 页」",
          "可以说「把这份 PPT 导出成图片」",
        ],
        tags: ["PPT", "演示", "课件"],
        ais: ["Kimi"],
        link: KIMI,
        hot: true,
      },
      {
        id: "kimi-word",
        name: "Word 文档",
        en: "kimi-word",
        desc: "创建和编辑 Word 文档，支持批注、修订追踪（类似 Word 里的「审阅」模式），还能把 Markdown 一键转成排版整齐的 docx。",
        usage: [
          "说「帮我把这篇文章整理成 Word 文档」",
          "上传 docx 说「帮我在第 X 段加个批注」",
          "支持无损修改，不会搞乱你原来的格式",
        ],
        tags: ["Word", "docx", "合同", "论文"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "kimi-excel",
        name: "Excel 表格",
        en: "kimi-excel",
        desc: "做电子表格的高手：公式、图表、条件格式、美化报表样样行，还会搭财务模型（三表模型、DCF 估值、可比公司分析）。",
        usage: [
          "说「帮我把这些数据做成 Excel，加上公式」",
          "说「帮我搭一个 DCF 估值模型」",
          "上传 csv/xlsx 让它直接分析和可视化",
        ],
        tags: ["Excel", "财务建模", "数据分析"],
        ais: ["Kimi"],
        link: KIMI,
        hot: true,
      },
      {
        id: "kimi-pdf",
        name: "PDF 工具",
        en: "kimi-pdf",
        desc: "PDF 全能选手：能排版生成带公式、图表、引用的论文级 PDF，也能提取文字表格、填表单、合并拆分旋转页面。",
        usage: [
          "说「帮我生成一份 PDF 报告」",
          "上传 PDF 说「帮我提取里面的表格」",
          "说「把这几个 PDF 合并成一个」",
        ],
        tags: ["PDF", "论文", "报告排版"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "kimi-design",
        name: "设计海报",
        en: "kimi-design",
        desc: "做信息图、海报、社交媒体配图、简历这类视觉物料。用文字描述需求，它帮你排版设计，可导出图片或 PPTX。",
        usage: [
          "说「帮我做一张 XX 主题的海报」",
          "说「把我的简历设计得好看一点」",
          "说「做一张信息图解释 XX」",
        ],
        tags: ["海报", "信息图", "简历"],
        ais: ["Kimi"],
        link: KIMI,
      },
    ],
  },
  {
    id: "finance",
    name: "金融数据",
    en: "FINANCE & DATA",
    icon: "TrendingUp",
    blurb: "股票行情、财报、研报、宏观数据——真金白银的专业数据库",
    skills: [
      {
        id: "ifind",
        name: "iFinD 同花顺",
        en: "ifind",
        desc: "同花顺的专业金融数据，A 股、港股、美股都覆盖。查行情、财报、公告、股东、盈利预测，还能按条件智能选股。",
        usage: [
          "说「查一下贵州茅台最近的股价走势」",
          "说「帮我筛选市盈率低于 20 的银行股」",
          "说「看看这家公司的主营收入构成」",
        ],
        tags: ["A股", "港股", "选股", "财报"],
        ais: ["Kimi 插件", "同花顺 iFinD"],
        link: "https://www.51ifind.com",
        hot: true,
      },
      {
        id: "yahoo_finance",
        name: "雅虎财经",
        en: "yahoo_finance",
        desc: "查美股等海外股票的价格、公司资料、财务指标、分红、分析师评级和风险指标。",
        usage: [
          "说「查一下苹果 (AAPL) 现在的股价」",
          "说「特斯拉的分析师评级怎么样」",
        ],
        tags: ["美股", "行情", "分红"],
        ais: ["Kimi 插件", "Yahoo Finance"],
        link: "https://finance.yahoo.com",
      },
      {
        id: "sec_edgar",
        name: "SEC EDGAR",
        en: "sec_edgar",
        desc: "美国证监会的官方公告库。查美股上市公司的 10-K 年报、10-Q 季报、内部人交易、机构持仓等一手文件。",
        usage: [
          "说「帮我找英伟达最新的 10-K 年报」",
          "说「查一下这家公司高管最近有没有减持」",
        ],
        tags: ["美股", "年报", "公告"],
        ais: ["Kimi 插件", "SEC EDGAR"],
        link: "https://www.sec.gov/edgar",
      },
      {
        id: "imf",
        name: "IMF 宏观数据",
        en: "imf",
        desc: "国际货币基金组织的全球宏观数据库：190 多个国家的 GDP、通胀、政府债务、失业率、贸易差额，还有各国外汇储备货币构成。",
        usage: [
          "说「对比一下中美两国的 GDP 增速」",
          "说「全球外汇储备里美元占比多少」",
        ],
        tags: ["宏观经济", "GDP", "通胀"],
        ais: ["Kimi 插件", "IMF"],
        link: "https://www.imf.org/en/Data",
      },
      {
        id: "world_bank",
        name: "世界银行数据",
        en: "world_bank_open_data",
        desc: "世界银行开放数据，29000 多个指标，覆盖全球各国的经济、社会、环境数据，从 1960 年到现在的时间序列都有。",
        usage: [
          "说「查一下中国过去 20 年的人口变化」",
          "说「对比一下东南亚各国的贫困率」",
        ],
        tags: ["发展数据", "人口", "贫困"],
        ais: ["Kimi 插件", "World Bank"],
        link: "https://data.worldbank.org",
      },
      {
        id: "igo_open_data",
        name: "国际组织数据",
        en: "igo_open_data",
        desc: "世卫组织、联合国、欧盟统计局、联合国粮农组织等官方统计，外加美联储 FRED 的宏观经济时间序列。",
        usage: [
          "说「查一下全球新冠疫苗接种率」",
          "说「美国联邦基金利率历史走势」",
        ],
        tags: ["WHO", "FRED", "利率"],
        ais: ["Kimi 插件", "FRED"],
        link: "https://fred.stlouisfed.org",
      },
      {
        id: "tianyancha",
        name: "天眼查",
        en: "tianyancha",
        desc: "查中国企业的工商注册、经营风险、司法诉讼、知识产权、对外投资、股权关系，尽调避坑利器。",
        usage: [
          "说「帮我查一下 XX 公司靠不靠谱」",
          "说「这家公司有没有法律诉讼」",
        ],
        tags: ["企业查询", "尽调", "工商信息"],
        ais: ["Kimi 插件", "天眼查"],
        link: "https://www.tianyancha.com",
      },
    ],
  },
  {
    id: "creative",
    name: "创意生成",
    en: "AI GENERATION",
    icon: "Sparkles",
    blurb: "画图、生成视频、配音效、建 3D 模型——AI 内容生产线",
    skills: [
      {
        id: "image_generation",
        name: "AI 画图",
        en: "image_generation",
        desc: "用文字描述生成高清图片，支持自定义尺寸、透明背景，还能参考你给的图来画。",
        usage: [
          "说「帮我画一张赛博朋克风格的城市夜景」",
          "说「生成一个透明背景的 PNG 图标」",
          "上传参考图说「照着这个风格画」",
        ],
        tags: ["文生图", "插画", "透明背景"],
        ais: ["Kimi"],
        link: KIMI,
        hot: true,
      },
      {
        id: "video_generation",
        name: "AI 视频",
        en: "video_generation",
        desc: "用文字生成 4–12 秒的 mp4 小视频，可以上传图片、视频、音频作为参考，支持横屏竖屏多种比例。",
        usage: [
          "说「生成一段海浪拍打礁石的视频」",
          "上传图片说「让这张照片动起来」",
        ],
        tags: ["文生视频", "短视频", "动画"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "audio_generation",
        name: "语音与音效",
        en: "audio_generation",
        desc: "两种玩法：把文字转成自然流畅的语音（多种中文音色可选），或者用英文描述生成自定义音效（0.5–22 秒）。",
        usage: [
          "说「把这段文字读出来，用温柔的女声」",
          "说「生成一段雨天的环境音，10 秒」",
        ],
        tags: ["配音", "TTS", "音效"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "tripo-3d",
        name: "3D 模型生成",
        en: "tripo-3d",
        desc: "一句话或一张图生成带贴图的 3D 模型，支持骨骼绑定、角色动画、减面优化，导出 GLB/FBX/OBJ/STL 等格式，游戏、影视、AR、3D 打印都能用。",
        usage: [
          "说「帮我生成一个低多边形风格的机器人」",
          "上传图片说「把这个角色做成 3D 模型」",
          "说「给这个角色绑骨并加走路动画」",
        ],
        tags: ["3D", "游戏资产", "3D打印"],
        ais: ["Kimi 插件", "Tripo 3D"],
        link: "https://www.tripo3d.ai",
        hot: true,
      },
    ],
  },
  {
    id: "dev",
    name: "开发建站",
    en: "DEV & BUILD",
    icon: "Code2",
    blurb: "从网页到全栈应用，从组件到插件——程序员的生产力外挂",
    skills: [
      {
        id: "webapp-building",
        name: "网站构建",
        en: "webapp-building",
        desc: "用 React + TypeScript + Tailwind 搭现代化网站和 Web 应用，内置 40 多个精美 UI 组件，适合做有复杂交互的页面。",
        usage: [
          "说「帮我做一个 XX 主题的网站」",
          "说「给我做一个带仪表盘的后台页面」",
        ],
        tags: ["React", "网站", "Web App"],
        ais: ["Kimi"],
        link: KIMI,
        hot: true,
      },
      {
        id: "backend-building",
        name: "后端与数据库",
        en: "backend-building",
        desc: "给网站加上真后端：数据库、用户登录（支持 Kimi 一键登录）、API、AI 能力。需要存数据、做账号系统就靠它。",
        usage: [
          "说「这个网站需要用户注册登录」",
          "说「把提交的数据存到数据库里」",
        ],
        tags: ["数据库", "登录", "API"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "musepool",
        name: "设计灵感库",
        en: "musepool",
        desc: "做网站前先搜真实的设计参考，避免千篇一律的「AI 味儿」审美，让页面配色、动效、排版更有高级感。",
        usage: ["（自动触发）做网页类任务时它会先去找设计灵感"],
        tags: ["设计参考", "审美"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "skill-creator",
        name: "Skill 创建器",
        en: "skill-creator",
        desc: "教 AI 新技能的技能。把你的工作流程、专业知识打包成一个 Skill，以后一句话就能复用。",
        usage: [
          "说「帮我创建一个 Skill，专门用来 XX」",
          "说「把刚才这个工作流程保存成 Skill」",
        ],
        tags: ["自定义技能", "工作流"],
        ais: ["Kimi"],
        link: KIMI,
      },
      {
        id: "kimi-widget",
        name: "互动小组件",
        en: "kimi-widget",
        desc: "在对话里直接渲染可交互的小组件：图表、计算器、表单、时间轴、小模拟器，让答案「看得见摸得着」。",
        usage: ["（自动触发）回答里有数据对比或互动需求时使用"],
        tags: ["图表", "计算器", "互动"],
        ais: ["Kimi"],
        link: KIMI,
      },
    ],
  },
  {
    id: "research",
    name: "研究与助手",
    en: "RESEARCH & ASSIST",
    icon: "Search",
    blurb: "深度调研、学术论文、法律检索——动脑子的活儿有帮手",
    skills: [
      {
        id: "deep-research",
        name: "深度研究",
        en: "deep-research-v2",
        desc: "对一个主题进行地毯式调研：大量检索、交叉验证、输出带引用的长篇研究报告。适合写行业分析、调研报告。",
        usage: [
          "说「帮我深度研究一下 XX 行业」",
          "关键词触发：深度研究 / 深度调研 / deep research",
        ],
        tags: ["调研", "研究报告", "引用"],
        ais: ["Kimi"],
        link: KIMI,
        hot: true,
      },
      {
        id: "scholar",
        name: "学术搜索",
        en: "scholar",
        desc: "搜学术论文的引擎：按关键词找论文（标题、作者、摘要、引用数、年份），还能查学者的 h-index、研究方向和代表作。",
        usage: [
          "说「帮我找 transformer 相关的经典论文」",
          "说「查一下这位学者的学术影响力」",
        ],
        tags: ["论文", "文献综述", "引用分析"],
        ais: ["Kimi 插件", "Google Scholar"],
        link: "https://scholar.google.com",
      },
      {
        id: "yuandian_law",
        name: "元典法律",
        en: "yuandian_law",
        desc: "中国法律数据库：法律法规、司法解释、法院判例都能语义检索，可按效力级别、地区、案件类型等多维度筛选。",
        usage: [
          "说「查一下劳动合同法关于裁员的规定」",
          "说「找一些交通事故赔偿的判例」",
        ],
        tags: ["法律", "判例", "合规"],
        ais: ["Kimi 插件", "元典法律"],
        link: KIMI,
      },
      {
        id: "kimi-help",
        name: "Kimi 帮助中心",
        en: "kimi-help-center",
        desc: "Kimi 产品使用问题的官方解答：会员订阅、价格、积分、账单发票、登录账号，以及 Kimi Code、API、PPT 等功能用法。",
        usage: ["问「Kimi 会员多少钱」「积分怎么算」之类的问题时自动触发"],
        tags: ["产品帮助", "会员", "账单"],
        ais: ["Kimi"],
        link: "https://www.kimi.com/zh-cn/help",
      },
    ],
  },
  {
    id: "writing",
    name: "写作创作",
    en: "WRITING",
    icon: "PenLine",
    blurb: "小说网文、故事续写——文字创作的专业陪跑",
    skills: [
      {
        id: "creative-writing",
        name: "创意写作",
        en: "creative-writing",
        desc: "写小说、网文的高手：开篇、续写、扩写、改写都行，长短不限。注意它只管文学创作，不包办论文和报告。",
        usage: [
          "说「帮我写一个修仙小说的开头」",
          "上传稿子说「帮我续写这一章」",
        ],
        tags: ["小说", "网文", "续写"],
        ais: ["Kimi"],
        link: KIMI,
      },
    ],
  },
];

export const allSkills = categories.flatMap((c) =>
  c.skills.map((s) => ({ ...s, category: c.name, categoryId: c.id }))
);
