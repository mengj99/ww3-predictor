import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Activity,
  Info,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Settings,
  Key,
  X,
  Globe,
  Cpu,
  Database,
  Languages,
  Volume2,
  VolumeX,
  Pin,
} from 'lucide-react';

// --- 配置与常量 ---
const INITIAL_TIME_MS =
  3 * 365 * 24 * 60 * 60 * 1000 + 145 * 24 * 60 * 60 * 1000;
const MAX_IMPACT_DAYS = 30;

// --- 预设 RSS 新闻源 ---
const RSS_PRESETS = [
  {
    id: 'bbc_world',
    name: 'BBC World (EN)',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
  },
  {
    id: 'bbc_zh',
    name: 'BBC 中文 (ZH)',
    url: 'http://feeds.bbci.co.uk/zhongwen/simp/rss.xml',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera (EN)',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
  },
  {
    id: 'un_news',
    name: 'UN News (EN)',
    url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml',
  },
];

// --- 多语言翻译字典 ---
const TRANSLATIONS = {
  zh: {
    title: 'W.W.III 预测终端系统 v2.1',
    subtitle: '距离预测引爆点还剩',
    years: '年',
    months: '月',
    days: '天',
    hrs: '时',
    mins: '分',
    secs: '秒',
    evaluating: '系统正在分析全球动态...',
    stable: '卫星数据链稳定',
    liveFeed: '全球实时新闻截获 (LIVE)',
    aiLogic: '系统决策逻辑',
    intercepting: '正在接入全球通讯卫星阵列...',
    new: 'NEW',
    aiDanger: '风险系数',
    timeCorrection: '时间修正',
    logTitle: '仲裁协议分析记录',
    eventId: '事件编号',
    aiConclusion: '分析结论：',
    langSwitch: 'EN',
    settings: '终端配置中枢',
    save: '保存并重启终端',
    tabAi: 'AI 算力引擎',
    tabData: '情报数据源',
    aiProvider: 'AI 供应商',
    apiKey: 'API 密钥 (API Key)',
    baseUrl: '代理地址 (Base URL - 可选)',
    modelName: '自定义模型名 (可选)',
    localWarning:
      '当前使用内置边缘引擎 (支持基础免费翻译)。填入 API 密钥以解锁 AI 深度打分。',
    customRss: '自定义 RSS 源 (URL)',
    dataDesc: '选择要监听的全球新闻源。多选将混合抓取。',
    criticalAlerts: '重大危机预警 (PINNED)',
    refreshRate: '情报刷新频率',
    rate15s: '15秒 (高消耗 - 易限流)',
    rate30s: '30秒 (推荐平衡)',
    rate60s: '60秒 (省流模式)',
  },
  en: {
    title: 'W.W.III PREDICTION TERMINAL v2.1',
    subtitle: 'TIME REMAINING UNTIL PREDICTED FLASHPOINT',
    years: 'YEARS',
    months: 'MNTHS',
    days: 'DAYS',
    hrs: 'HRS',
    mins: 'MINS',
    secs: 'SECS',
    evaluating: 'Analyzing global dynamics...',
    stable: 'Satellite data link stable',
    liveFeed: 'GLOBAL LIVE NEWS INTERCEPT',
    aiLogic: 'Decision Logic',
    intercepting: 'Connecting to comms satellites...',
    new: 'NEW',
    aiDanger: 'RISK INDEX',
    timeCorrection: 'TIME CORRECTION',
    logTitle: 'Arbitration Protocol Log',
    eventId: 'Event ID',
    aiConclusion: 'Conclusion:',
    langSwitch: '中文',
    settings: 'Terminal Config Hub',
    save: 'Save & Reboot Terminal',
    tabAi: 'AI Engine',
    tabData: 'Intel Sources',
    aiProvider: 'AI Provider',
    apiKey: 'API Key',
    baseUrl: 'Proxy Base URL (Optional)',
    modelName: 'Custom Model Name (Optional)',
    localWarning:
      'Using Local Edge Engine (with free basic translation). Enter API Key to unlock deep AI analysis.',
    customRss: 'Custom RSS Source (URL)',
    dataDesc:
      'Select global news sources to monitor. Multiple selections will be mixed.',
    criticalAlerts: 'CRITICAL ALERTS (PINNED)',
    refreshRate: 'Intel Refresh Rate',
    rate15s: '15s (High cost - easy to hit limit)',
    rate30s: '30s (Recommended balance)',
    rate60s: '60s (Eco mode)',
  },
};

const FALLBACK_NEWS = [
  'Iran conducts massive live-fire military drills',
  'UN Security Council passes new disarmament treaty',
  'European energy crisis eases',
  '全球主要大国联合宣布削减20%的年度国防预算',
  'Unidentified military drone swarms spotted',
];

// --- 样式定义 ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw;
    min-height: 100vh;
    background-color: #000000 !important;
    overflow-x: hidden !important;
  }

  .font-military { font-family: 'Share Tech Mono', monospace; }
  
  .crt-overlay {
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
  }

  .text-glow-red { text-shadow: 0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.5); }
  .text-glow-green { text-shadow: 0 0 10px rgba(34, 197, 94, 0.7), 0 0 20px rgba(34, 197, 94, 0.5); }

  @keyframes shake {
    0%, 100% { transform: translate(0, 0); }
    20% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, 0); }
    60% { transform: translate(-2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }
  .animate-shake { animation: shake 0.4s; }

  @keyframes flash-red { 0% { background-color: rgba(239, 68, 68, 0.25); } 100% { background-color: transparent; } }
  @keyframes flash-green { 0% { background-color: rgba(34, 197, 94, 0.15); } 100% { background-color: transparent; } }
  .flash-red-bg { animation: flash-red 1s ease-out; }
  .flash-green-bg { animation: flash-green 1s ease-out; }

  .radar-scan {
    background: conic-gradient(from 90deg at 50% 50%, transparent 0%, rgba(239, 68, 68, 0.05) 80%, rgba(239, 68, 68, 0.4) 100%);
    border-radius: 50%;
    animation: spin 4s linear infinite;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.2); border-radius: 2px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.5); }
`;

// 默认配置
const DEFAULT_CONFIG = {
  provider: 'local',
  apiKey: '',
  baseUrl: '',
  modelName: '',
  sources: ['bbc_world', 'bbc_zh'],
  customRss: '',
  refreshInterval: 30,
};

export default function App() {
  const [targetDateMs, setTargetDateMs] = useState(
    Date.now() + INITIAL_TIME_MS
  );
  const [timeLeft, setTimeLeft] = useState({
    y: 0,
    m: 0,
    d: 0,
    h: 0,
    min: 0,
    s: 0,
  });
  const [newsFeed, setNewsFeed] = useState([]);
  const [pinnedAlerts, setPinnedAlerts] = useState([]);
  const [effect, setEffect] = useState('none');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // UI 状态
  const [showLog, setShowLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('ai');
  const [lang, setLang] = useState('zh');
  const [isMuted, setIsMuted] = useState(true);

  // 配置状态
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [tempConfig, setTempConfig] = useState(DEFAULT_CONFIG);

  const newsQueue = useRef([]);
  const langRef = useRef(lang);
  const configRef = useRef(config);
  const audioCtxRef = useRef(null);

  const t = TRANSLATIONS[lang];

  // --- 纯代码音效合成引擎 (Web Audio API) ---
  const playSound = (type) => {
    if (isMuted) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'major_alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.2);
      osc.frequency.setValueAtTime(400, now + 0.4);
      osc.frequency.setValueAtTime(600, now + 0.6);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 1.2);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'minor_red') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'minor_green') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  };

  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    const savedConfig = localStorage.getItem('ww3_predictor_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        const mergedConfig = { ...DEFAULT_CONFIG, ...parsed };
        setConfig(mergedConfig);
        setTempConfig(mergedConfig);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    langRef.current = lang;
    configRef.current = config;
    newsQueue.current = [];
  }, [lang, config]);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = targetDateMs - Date.now();
      if (difference <= 0) {
        setTimeLeft({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        y: Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
        m: Math.floor(
          (difference % (1000 * 60 * 60 * 24 * 365)) /
            (1000 * 60 * 60 * 24 * 30)
        ),
        d: Math.floor(
          (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
        ),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateMs]);

  // RSS 抓取逻辑
  const fetchNewsQueue = async (currentConfig) => {
    const urlsToFetch = currentConfig.sources
      .map((id) => RSS_PRESETS.find((p) => p.id === id)?.url)
      .filter(Boolean);

    if (currentConfig.customRss) urlsToFetch.push(currentConfig.customRss);

    if (urlsToFetch.length === 0)
      return [...FALLBACK_NEWS].sort(() => 0.5 - Math.random());

    let allItems = [];
    for (const url of urlsToFetch) {
      try {
        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            url
          )}`
        );
        const data = await res.json();
        if (data.status === 'ok')
          allItems.push(...data.items.map((i) => i.title));
      } catch (e) {
        console.error('RSS fetch error:', url);
      }
    }

    if (allItems.length === 0)
      return [...FALLBACK_NEWS].sort(() => 0.5 - Math.random());
    return [...new Set(allItems)].sort(() => 0.5 - Math.random());
  };

  // --- 全新免费基础翻译模块 (无需 API Key) ---
  const getFreeBasicTranslation = async (text, targetLang) => {
    try {
      const tl = targetLang === 'zh' ? 'zh-CN' : 'en';
      // 使用 allorigins 代理绕过 CORS，调用公开的免费翻译接口
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(
          text
        )}`
      )}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const parsed = JSON.parse(data.contents);
      const translatedText = parsed[0].map((x) => x[0]).join('');
      // 如果翻译结果与原文几乎一样，直接返回 null 以免重复显示
      return translatedText.trim().toLowerCase() === text.trim().toLowerCase()
        ? null
        : translatedText;
    } catch (e) {
      return null;
    }
  };

  // 本地 NLP 引擎 (纯净版，不带重复的文字警告)
  const localAnalyzeEdge = (text, currentLang) => {
    let score = 0;
    const lower = text.toLowerCase();
    const negative = [
      'war',
      'strike',
      'missile',
      'attack',
      'nuclear',
      'sanction',
      'crisis',
      'tension',
      'military',
      'conflict',
      'dead',
      'kill',
      'warn',
      'threat',
      '警告',
      '冲突',
      '袭击',
      '核',
      '制裁',
      '危机',
      '紧张',
      '军事',
      '战争',
      '导弹',
      '死',
      '威胁',
      '制裁',
      '演习',
    ];
    const positive = [
      'peace',
      'talks',
      'treaty',
      'ceasefire',
      'agree',
      'deal',
      'summit',
      'resolve',
      'help',
      'aid',
      '和平',
      '谈判',
      '条约',
      '停火',
      '同意',
      '协议',
      '峰会',
      '解决',
      '援助',
      '合作',
      '降温',
    ];

    let negMatch = negative.find((w) => lower.includes(w));
    let posMatch = positive.find((w) => lower.includes(w));

    if (negMatch) score -= Math.random() * 0.4 + 0.3;
    if (posMatch) score += Math.random() * 0.4 + 0.3;
    if (score === 0) score = Math.random() * 0.2 - 0.1;
    score = Math.max(-1, Math.min(1, score));

    const reason =
      currentLang === 'zh'
        ? score < -0.2
          ? `系统预警: 检测到高危关键字 [${negMatch}]`
          : score > 0.2
          ? `系统提示: 检测到缓和关键字 [${posMatch}]`
          : '常规状态维持，无显著偏差'
        : score < -0.2
        ? `System Alert: High-risk keyword [${negMatch}]`
        : score > 0.2
        ? `System Note: De-escalation keyword [${posMatch}]`
        : 'Status nominal, no significant deviation';

    return { score: parseFloat(score.toFixed(2)), reason, translation: null };
  };

  // AI 分析调度核心
  const evaluateWithAI = async (text, currentConfig, currentLang) => {
    // 1. 本地模式：调用本地引擎 + 免费翻译接口
    if (currentConfig.provider === 'local' || !currentConfig.apiKey) {
      const localResult = localAnalyzeEdge(text, currentLang);
      localResult.translation = await getFreeBasicTranslation(
        text,
        currentLang
      );
      return localResult;
    }

    // 2. API 模式：
    const langName = currentLang === 'zh' ? 'Chinese' : 'English';
    const prompt = `Analyze this news for its impact on the likelihood of World War III.
Score: -1.0 (extreme escalation) to 1.0 (major de-escalation).
News: ${text}
You MUST return ONLY valid JSON format exactly as below:
{"score": number, "reason": "short reason in ${langName}", "translation": "translate the News text into ${langName}"}`;

    try {
      let responseText = '';

      if (currentConfig.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${
          currentConfig.modelName || 'gemini-2.5-flash'
        }:generateContent?key=${currentConfig.apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'API Error');
        responseText = data.candidates[0].content.parts[0].text;
      } else if (
        currentConfig.provider === 'openai' ||
        currentConfig.provider === 'deepseek'
      ) {
        let url =
          currentConfig.baseUrl ||
          (currentConfig.provider === 'openai'
            ? 'https://api.openai.com/v1/chat/completions'
            : 'https://api.deepseek.com/chat/completions');
        let model =
          currentConfig.modelName ||
          (currentConfig.provider === 'openai'
            ? 'gpt-4o-mini'
            : 'deepseek-chat');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentConfig.apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'API Error');
        responseText = data.choices[0].message.content;
      }

      let cleanJson = responseText;
      const startIdx = cleanJson.indexOf('{');
      const endIdx = cleanJson.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        cleanJson = cleanJson.substring(startIdx, endIdx + 1);
      } else {
        throw new Error('Invalid JSON from AI model');
      }

      const result = JSON.parse(cleanJson);
      return {
        score: parseFloat(result.score || 0),
        reason: `[${currentConfig.provider.toUpperCase()}] ${result.reason}`,
        translation: result.translation || text,
      };
    } catch (e) {
      console.error('AI API Error:', e);
      // 如果 API 失败/限流：平滑降级到本地打分 + 免费基础翻译，去除报错警告
      const fallback = localAnalyzeEdge(text, currentLang);
      fallback.translation = await getFreeBasicTranslation(text, currentLang);
      return fallback;
    }
  };

  // 主事件循环
  useEffect(() => {
    const processNews = async () => {
      setIsEvaluating(true);
      const curConfig = configRef.current;
      const curLang = langRef.current;

      if (newsQueue.current.length === 0) {
        newsQueue.current = await fetchNewsQueue(curConfig);
      }

      const newsText = newsQueue.current.pop();
      if (!newsText) return;

      const aiResult = await evaluateWithAI(newsText, curConfig, curLang);

      const impactDays = Math.round(aiResult.score * MAX_IMPACT_DAYS);
      const impactMs = impactDays * 24 * 60 * 60 * 1000;

      setTargetDateMs((prev) => prev + impactMs);

      const isCritical = Math.abs(aiResult.score) >= 0.6;

      if (aiResult.score < -0.2) {
        setEffect('red');
        playSound(isCritical ? 'major_alert' : 'minor_red');
      } else if (aiResult.score > 0.2) {
        setEffect('green');
        playSound(isCritical ? 'major_alert' : 'minor_green');
      } else {
        setEffect('none');
      }
      setTimeout(() => setEffect('none'), 1200);

      const newFeedItem = {
        id: Date.now(),
        text: newsText,
        score: aiResult.score,
        reason: aiResult.reason,
        translation: aiResult.translation,
        impactDays: impactDays,
        timestamp: new Date().toLocaleTimeString(),
        isCritical: isCritical,
      };

      setNewsFeed((prev) => [newFeedItem, ...prev].slice(0, 15));

      if (isCritical) {
        setPinnedAlerts((prev) => [newFeedItem, ...prev].slice(0, 3));
      }

      setIsEvaluating(false);
    };

    const intervalMs = Math.max((config.refreshInterval || 30) * 1000, 15000);
    const newsInterval = setInterval(processNews, intervalMs);

    processNews();
    return () => clearInterval(newsInterval);
  }, [isMuted, config.refreshInterval]);

  const saveSettings = () => {
    localStorage.setItem('ww3_predictor_config', JSON.stringify(tempConfig));
    setConfig(tempConfig);
    setShowSettings(false);
    setNewsFeed([]);
  };

  return (
    <>
      <style>{customStyles}</style>

      <div
        className={`min-h-screen w-full bg-black text-white font-military relative overflow-hidden flex flex-col ${
          effect === 'red' ? 'animate-shake' : ''
        }`}
      >
        {/* 控制栏 */}
        <div className="absolute top-4 right-4 z-50 flex space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 border ${
              isMuted
                ? 'border-neutral-700 bg-neutral-900/80 text-neutral-500'
                : 'border-red-900/50 bg-red-900/20 text-red-400 animate-pulse'
            } rounded transition-colors backdrop-blur-sm`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 rounded transition-colors backdrop-blur-sm"
          >
            <Settings className="w-5 h-5 text-neutral-300" />
          </button>
          <button
            onClick={() => setLang((l) => (l === 'zh' ? 'en' : 'zh'))}
            className="px-4 py-2 border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 rounded text-sm transition-colors backdrop-blur-sm font-bold"
          >
            {t.langSwitch}
          </button>
        </div>

        {/* 特效层 */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none ${
            effect === 'red'
              ? 'flash-red-bg'
              : effect === 'green'
              ? 'flash-green-bg'
              : ''
          }`}
        />
        <div className="absolute inset-0 z-0 crt-overlay opacity-40 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[800px] h-[120vw] max-h-[800px] border border-red-900/20 rounded-full opacity-30 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 radar-scan rounded-full" />
          <div className="absolute inset-0 border border-red-900/30 rounded-full scale-75" />
          <div className="absolute inset-0 border border-red-900/40 rounded-full scale-50" />
        </div>

        {/* --- 主内容区：重构为弹性双栏布局，完美适配 16:9 电脑屏幕 --- */}
        <div className="relative z-10 flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center min-h-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10 gap-6 xl:gap-12 relative">
            {/* 左侧：重大危机预警 置顶区 */}
            {pinnedAlerts.length > 0 && (
              <div className="w-full xl:w-72 shrink-0 mb-6 xl:mb-0 xl:sticky xl:top-24 z-20">
                <div className="flex items-center space-x-2 text-red-500 mb-3 border-b border-red-900/50 pb-2">
                  <Pin className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest">
                    {t.criticalAlerts}
                  </span>
                </div>
                <div className="space-y-3">
                  {pinnedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-red-950/40 border border-red-900/50 p-3 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-red-400/70">
                          {alert.timestamp}
                        </span>
                        <span className="text-[10px] font-bold text-red-500">
                          IMPACT: {alert.impactDays > 0 ? '+' : ''}
                          {alert.impactDays}D
                        </span>
                      </div>
                      <p className="text-xs text-red-100 leading-relaxed line-clamp-3">
                        {alert.translation || alert.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 中间/右侧：主倒计时与新闻流 */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center space-x-3 mb-8 sm:mb-12 text-red-500 opacity-90 border border-red-900/50 px-6 py-3 rounded bg-red-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center w-fit">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
                <h1 className="text-sm sm:text-lg tracking-[0.2em] uppercase font-bold">
                  {t.title}
                </h1>
              </div>

              <div className="text-center w-full mb-10 sm:mb-12">
                <div className="text-xs text-red-500/60 mb-5 tracking-[0.5em] uppercase">
                  {t.subtitle}
                </div>

                {/* 倒计时数字（微调尺寸防止高度溢出） */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-5 w-full">
                  <TimeUnit
                    value={timeLeft.y}
                    label={t.years}
                    effect={effect}
                  />
                  <TimeSeparator effect={effect} />
                  <TimeUnit
                    value={timeLeft.m}
                    label={t.months}
                    effect={effect}
                  />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={timeLeft.d} label={t.days} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit
                    value={String(timeLeft.h).padStart(2, '0')}
                    label={t.hrs}
                    effect={effect}
                  />
                  <TimeSeparator effect={effect} />
                  <TimeUnit
                    value={String(timeLeft.min).padStart(2, '0')}
                    label={t.mins}
                    effect={effect}
                  />
                  <TimeSeparator effect={effect} />
                  <TimeUnit
                    value={String(timeLeft.s).padStart(2, '0')}
                    label={t.secs}
                    effect={effect}
                  />
                </div>

                <div className="mt-8 flex justify-center items-center">
                  <div className="flex items-center space-x-2 bg-neutral-900/80 px-4 py-1.5 rounded-full border border-neutral-800 shadow-lg backdrop-blur-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isEvaluating
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                      }`}
                    />
                    <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide">
                      {isEvaluating ? t.evaluating : t.stable}
                    </span>
                  </div>
                </div>
              </div>

              {/* 新闻流面板 (高度自适应，留出充足空间) */}
              <div className="w-full border border-neutral-800/80 bg-neutral-950/80 rounded overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[40vh] min-h-[250px] max-h-[400px]">
                <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 px-4 py-3 shrink-0">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-xs tracking-wider font-bold">
                      {t.liveFeed}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowLog(true)}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-900/20 hover:bg-blue-900/40 rounded transition-colors"
                  >
                    <Info className="w-3 h-3" />
                    <span>{t.aiLogic}</span>
                  </button>
                </div>

                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar flex-1">
                  {newsFeed.length === 0 ? (
                    <div className="flex items-center justify-center text-neutral-600 text-sm py-16">
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />{' '}
                      {t.intercepting}
                    </div>
                  ) : (
                    newsFeed.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:flex-row justify-between p-3 sm:p-4 rounded bg-neutral-900/60 border-l-4 ${
                          item.score < 0
                            ? 'border-red-600'
                            : item.score > 0
                            ? 'border-green-600'
                            : 'border-neutral-600'
                        } transition-all duration-500 ${
                          index === 0
                            ? 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-neutral-800/80'
                            : 'opacity-85'
                        }`}
                      >
                        <div className="flex-1 pr-0 sm:pr-6 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[10px] text-neutral-500 font-sans tracking-wider">
                              {item.timestamp}
                            </span>
                            {index === 0 && (
                              <span className="text-[9px] bg-red-900/80 text-red-100 px-1.5 py-0.5 rounded animate-pulse">
                                {t.new}
                              </span>
                            )}
                          </div>
                          {/* 原文 */}
                          <p
                            className={`text-sm leading-relaxed ${
                              item.score < 0 ? 'text-red-100' : 'text-green-100'
                            }`}
                          >
                            {item.text}
                          </p>
                          {/* 智能/基础翻译 (无多余警告文字) */}
                          {item.translation && (
                            <div className="mt-2 pt-2 border-t border-neutral-800/50 flex items-start space-x-2">
                              <Languages className="w-3.5 h-3.5 text-blue-500/70 mt-0.5 shrink-0" />
                              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                                {item.translation}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end sm:space-x-6 shrink-0 border-t border-neutral-800/50 sm:border-t-0 pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <div className="text-[10px] text-neutral-500 uppercase">
                              {t.aiDanger}
                            </div>
                            <div
                              className={`text-sm sm:text-lg font-bold ${
                                item.score < 0
                                  ? 'text-red-500'
                                  : item.score > 0
                                  ? 'text-green-500'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {item.score > 0 ? '+' : ''}
                              {item.score.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right sm:w-28">
                            <div className="text-[10px] text-neutral-500 uppercase">
                              {t.timeCorrection}
                            </div>
                            <div
                              className={`text-sm sm:text-lg font-bold ${
                                item.impactDays < 0
                                  ? 'text-red-500 text-glow-red'
                                  : item.impactDays > 0
                                  ? 'text-green-500 text-glow-green'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {item.impactDays > 0
                                ? `+${item.impactDays}`
                                : item.impactDays}{' '}
                              DAYS
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 浮层：系统设置 --- */}
        {showSettings && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-neutral-400" />{' '}
                  {t.settings}
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-neutral-500 hover:text-white p-1 bg-neutral-900 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setSettingsTab('ai')}
                  className={`flex-1 p-3 text-sm font-bold flex items-center justify-center transition-colors ${
                    settingsTab === 'ai'
                      ? 'bg-blue-900/20 text-blue-400 border-b-2 border-blue-500'
                      : 'text-neutral-500 hover:bg-neutral-900'
                  }`}
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  {t.tabAi}
                </button>
                <button
                  onClick={() => setSettingsTab('data')}
                  className={`flex-1 p-3 text-sm font-bold flex items-center justify-center transition-colors ${
                    settingsTab === 'data'
                      ? 'bg-green-900/20 text-green-400 border-b-2 border-green-500'
                      : 'text-neutral-500 hover:bg-neutral-900'
                  }`}
                >
                  <Database className="w-4 h-4 mr-2" />
                  {t.tabData}
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 font-sans">
                {settingsTab === 'ai' ? (
                  <div className="space-y-5">
                    {tempConfig.provider === 'local' && (
                      <div className="p-3 bg-amber-900/20 border border-amber-900/50 rounded text-xs text-amber-500 leading-relaxed">
                        {t.localWarning}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">
                        {t.aiProvider}
                      </label>
                      <select
                        value={tempConfig.provider}
                        onChange={(e) =>
                          setTempConfig({
                            ...tempConfig,
                            provider: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="local">
                          Local Edge Engine (Free Base Translation)
                        </option>
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI (GPT)</option>
                        <option value="deepseek">DeepSeek</option>
                      </select>
                    </div>

                    {tempConfig.provider !== 'local' && (
                      <>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5 uppercase flex items-center">
                            <Key className="w-3 h-3 mr-1" /> {t.apiKey}
                          </label>
                          <input
                            type="password"
                            value={tempConfig.apiKey}
                            onChange={(e) =>
                              setTempConfig({
                                ...tempConfig,
                                apiKey: e.target.value,
                              })
                            }
                            placeholder="sk-..."
                            className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5 uppercase">
                            {t.baseUrl}
                          </label>
                          <input
                            type="text"
                            value={tempConfig.baseUrl}
                            onChange={(e) =>
                              setTempConfig({
                                ...tempConfig,
                                baseUrl: e.target.value,
                              })
                            }
                            placeholder={
                              tempConfig.provider === 'openai'
                                ? 'https://api.openai.com/v1/chat/completions'
                                : 'Leave blank for default'
                            }
                            className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5 uppercase">
                            {t.modelName}
                          </label>
                          <input
                            type="text"
                            value={tempConfig.modelName}
                            onChange={(e) =>
                              setTempConfig({
                                ...tempConfig,
                                modelName: e.target.value,
                              })
                            }
                            placeholder={
                              tempConfig.provider === 'gemini'
                                ? 'gemini-2.5-flash'
                                : tempConfig.provider === 'openai'
                                ? 'gpt-4o-mini'
                                : 'deepseek-chat'
                            }
                            className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">
                        {t.refreshRate}
                      </label>
                      <select
                        value={tempConfig.refreshInterval}
                        onChange={(e) =>
                          setTempConfig({
                            ...tempConfig,
                            refreshInterval: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
                      >
                        <option value={15}>{t.rate15s}</option>
                        <option value={30}>{t.rate30s}</option>
                        <option value={60}>{t.rate60s}</option>
                      </select>
                    </div>

                    <p className="text-xs text-neutral-400 mb-4 border-t border-neutral-800 pt-4">
                      {t.dataDesc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {RSS_PRESETS.map((source) => (
                        <label
                          key={source.id}
                          className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                            tempConfig.sources.includes(source.id)
                              ? 'bg-green-900/20 border-green-700/50 text-green-400'
                              : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={tempConfig.sources.includes(source.id)}
                            onChange={(e) => {
                              const newSources = e.target.checked
                                ? [...tempConfig.sources, source.id]
                                : tempConfig.sources.filter(
                                    (id) => id !== source.id
                                  );
                              setTempConfig({
                                ...tempConfig,
                                sources: newSources,
                              });
                            }}
                          />
                          <Globe className="w-4 h-4 mr-2 opacity-70" />
                          <span className="text-sm font-bold">
                            {source.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-neutral-800">
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">
                        {t.customRss}
                      </label>
                      <input
                        type="text"
                        value={tempConfig.customRss}
                        onChange={(e) =>
                          setTempConfig({
                            ...tempConfig,
                            customRss: e.target.value,
                          })
                        }
                        placeholder="https://example.com/rss.xml"
                        className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                <button
                  onClick={saveSettings}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded text-sm transition-colors font-bold tracking-widest shadow-lg shadow-blue-900/20"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 浮层：AI 分析日志 --- */}
        {showLog && (
          <div className="fixed top-0 right-0 w-full sm:w-[480px] h-[100dvh] bg-neutral-950/98 border-l border-neutral-800 z-50 p-5 backdrop-blur-xl transform transition-transform shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-800 shrink-0">
              <h2 className="text-amber-500 flex items-center text-sm font-bold tracking-widest">
                <ShieldCheck className="w-5 h-5 mr-2" /> {t.logTitle}
              </h2>
              <button
                onClick={() => setShowLog(false)}
                className="text-neutral-400 hover:text-white bg-neutral-800/80 rounded p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {newsFeed.map((item) => (
                <div
                  key={item.id}
                  className="text-xs border border-neutral-800 p-4 rounded bg-black"
                >
                  <div className="text-neutral-500 mb-3 border-b border-neutral-800 pb-2 flex justify-between font-sans">
                    <span>
                      {t.eventId}: #{item.id}
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="mb-3 text-neutral-300 leading-relaxed text-sm">
                    "{item.text}"
                  </div>

                  {item.translation && (
                    <div className="mb-3 text-neutral-500 text-xs italic border-l-2 border-neutral-800 pl-2">
                      {item.translation}
                    </div>
                  )}

                  <div className="flex items-start space-x-2 mt-3 p-3 bg-neutral-900 rounded border border-neutral-800">
                    {item.score < 0 ? (
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-blue-400 font-bold mb-1">
                        {t.aiConclusion}
                      </span>
                      <span className="text-neutral-300 text-sm leading-relaxed">
                        {item.reason}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const TimeUnit = ({ value, label, effect }) => {
  const color =
    effect === 'red'
      ? 'text-red-400 text-glow-red'
      : effect === 'green'
      ? 'text-green-400 text-glow-green'
      : 'text-red-500 text-glow-red';
  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter ${color} transition-colors duration-300 py-1`}
      >
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-red-900/80 mt-1 tracking-[0.2em] sm:tracking-[0.4em] font-sans font-bold">
        {label}
      </div>
    </div>
  );
};

const TimeSeparator = ({ effect }) => (
  <div
    className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl pb-4 sm:pb-6 ${
      effect === 'red'
        ? 'text-red-400'
        : effect === 'green'
        ? 'text-green-400'
        : 'text-red-900/40'
    } animate-pulse`}
  >
    :
  </div>
);
