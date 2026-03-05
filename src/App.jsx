import React, { useState, useEffect, useRef } from 'react';
import { Radio, Activity, Info, ShieldCheck, ShieldAlert, Zap, Settings, Key, X, Globe, Cpu, Database, Languages, Volume2, VolumeX, Pin, ZapOff, ServerCrash, ActivitySquare, AlertTriangle } from 'lucide-react';

// --- 配置与常量 ---
const INITIAL_TIME_MS = 3 * 365 * 24 * 60 * 60 * 1000 + 145 * 24 * 60 * 60 * 1000;
const MAX_IMPACT_DAYS = 30;

// --- 预设突发与权威情报源 ---
const RSS_PRESETS = [
  { id: 'reddit_world', name: 'Reddit WorldNews (极速突发)', url: 'https://www.reddit.com/r/worldnews/new/.rss?sort=new' },
  { id: 'reddit_geopolitics', name: 'Reddit Geopolitics', url: 'https://www.reddit.com/r/geopolitics/new/.rss' },
  { id: 'aljazeera', name: 'Al Jazeera (中东及全球)', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { id: 'bbc_world', name: 'BBC World (传统权威)', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
  { id: 'rt_news', name: 'RT News (俄罗斯视角)', url: 'https://www.rt.com/rss/news/' },
  { id: 'defense', name: 'Defense News (军事防务)', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/' }
];

// --- 多语言翻译字典 ---
const TRANSLATIONS = {
  zh: {
    title: "W.W.III 战备监测中枢 v4.0",
    subtitle: "距离预测引爆点还剩",
    years: "年", months: "月", days: "天", hrs: "时", mins: "分", secs: "秒",
    evaluating: "拦截并解析加密通讯...",
    stable: "数据链静默监听中",
    liveFeed: "全球突发情报流 (LIVE)",
    aiLogic: "系统仲裁记录",
    intercepting: "正在建立卫星握手信号...",
    new: "BRK",
    aiDanger: "威胁等级",
    timeCorrection: "末日时钟修正",
    logTitle: "AI 仲裁详细日志",
    eventId: "区块ID",
    aiConclusion: "仲裁结果：",
    langSwitch: "EN",
    settings: "系统底层配置",
    save: "应用并重启中枢",
    tabAi: "核心算力 & 翻译",
    tabData: "情报监听源",
    aiProvider: "仲裁 AI 模型",
    apiKey: "API Key (密钥保存在本地)",
    baseUrl: "反向代理 Base URL (可选)",
    modelName: "指定模型版本 (可选)",
    localWarning: "警告：未配置 API 密钥。当前仅依靠本地规则引擎进行基础判定。",
    customRss: "自定义高优先级情报源 (每行填入一个 RSS/XML 链接)",
    dataDesc: "勾选需要监听的公开情报网。多源混合可防止信息茧房。",
    criticalAlerts: "红色警报区 (PINNED)",
    refreshRate: "数据轮询频率",
    rate15s: "15秒 (实战模式 - 极易触发 API 封控)",
    rate30s: "30秒 (推荐：效能平衡)",
    rate60s: "60秒 (待机省流模式)",
    transSettings: "本地化翻译策略 (大幅节省 API 费用)",
    enableTrans: "开启内容翻译 (将外文情报转为本地语言)",
    forceFreeTrans: "【强力省钱】强制使用免费翻译通道 (只让 AI 打分，拒绝让 AI 翻译长文本)"
  },
  en: {
    title: "W.W.III DEFCON TERMINAL v4.0",
    subtitle: "TIME REMAINING UNTIL FLASHPOINT",
    years: "YRS", months: "MTHS", days: "DAYS", hrs: "HRS", mins: "MINS", secs: "SECS",
    evaluating: "Decrypting intercepts...",
    stable: "Datalink in silent watch",
    liveFeed: "GLOBAL BREAKING INTEL (LIVE)",
    aiLogic: "Arbitration Logs",
    intercepting: "Establishing satellite handshake...",
    new: "BRK",
    aiDanger: "THREAT LVL",
    timeCorrection: "DOOMSDAY CORRECTION",
    logTitle: "AI Arbitration Details",
    eventId: "Block ID",
    aiConclusion: "Verdict:",
    langSwitch: "中文",
    settings: "System Configuration",
    save: "Apply & Reboot",
    tabAi: "Compute & Trans",
    tabData: "Intel Sources",
    aiProvider: "Arbitration Engine",
    apiKey: "API Key (Saved Locally)",
    baseUrl: "Proxy Base URL (Optional)",
    modelName: "Specific Model (Optional)",
    localWarning: "WARNING: No API Key. Operating on local rule-based engine.",
    customRss: "Custom High-Priority Feeds (One URL per line)",
    dataDesc: "Select public intel networks to monitor. Mixing prevents echo chambers.",
    criticalAlerts: "RED ALERTS (PINNED)",
    refreshRate: "Polling Frequency",
    rate15s: "15s (Combat - High API ban risk)",
    rate30s: "30s (Recommended: Balanced)",
    rate60s: "60s (Standby mode)",
    transSettings: "Localization Strategy (Cost Saver)",
    enableTrans: "Enable Intel Translation",
    forceFreeTrans: "[COST SAVER] Force Free Translation Channel (AI only scores, no costly long translations)"
  }
};

const FALLBACK_NEWS = [
  "System Error: Unable to intercept global signals.",
  "Check your Intel Sources configuration.",
  "No data received from satellite array."
];

// --- 样式定义 ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw;
    min-height: 100vh;
    background-color: #030303 !important;
    overflow-x: hidden !important;
  }

  .font-military { font-family: 'Share Tech Mono', monospace; }
  
  .crt-overlay {
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
    z-index: 50;
  }

  .text-glow-red { text-shadow: 0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4); }
  .text-glow-green { text-shadow: 0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4); }
  .text-glow-amber { text-shadow: 0 0 10px rgba(245, 158, 11, 0.8); }

  @keyframes shake {
    0%, 100% { transform: translate(0, 0); }
    20% { transform: translate(-3px, -3px); }
    40% { transform: translate(3px, 0); }
    60% { transform: translate(-3px, 3px); }
    80% { transform: translate(3px, -3px); }
  }
  .animate-shake { animation: shake 0.3s; }

  @keyframes flash-red { 0% { background-color: rgba(220, 38, 38, 0.3); } 100% { background-color: transparent; } }
  @keyframes flash-green { 0% { background-color: rgba(22, 163, 74, 0.2); } 100% { background-color: transparent; } }
  .flash-red-bg { animation: flash-red 0.8s ease-out; }
  .flash-green-bg { animation: flash-green 0.8s ease-out; }

  .radar-scan {
    background: conic-gradient(from 90deg at 50% 50%, transparent 0%, rgba(239, 68, 68, 0.03) 80%, rgba(239, 68, 68, 0.3) 100%);
    border-radius: 50%;
    animation: spin 4s linear infinite;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.3); border-radius: 2px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.6); }
`;

// 默认配置
const DEFAULT_CONFIG = {
  provider: 'local',
  apiKey: '',
  baseUrl: '',
  modelName: '',
  sources: ['reddit_world', 'aljazeera'], // 默认采用强冲突和极速突发源
  customRss: '',
  refreshInterval: 30,
  enableTranslation: true,
  forceFreeTranslation: true
};

export default function App() {
  const [targetDateMs, setTargetDateMs] = useState(Date.now() + INITIAL_TIME_MS);
  const [timeLeft, setTimeLeft] = useState({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
  const [newsFeed, setNewsFeed] = useState([]);
  const [pinnedAlerts, setPinnedAlerts] = useState([]); 
  const [effect, setEffect] = useState('none');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // 核心系统状态指示
  const [sysStatus, setSysStatus] = useState({
    engine: 'LOCAL (EDGE)',
    health: 'OK', // 'OK', 'ERROR', 'WARN'
    msg: 'Local Rule Engine Active',
    trans: 'FREE API'
  });

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
  
  // 【关键优化】去重缓存池，防止同一新闻重复刷分
  const processedNewsCache = useRef(new Set());

  const t = TRANSLATIONS[lang];

  // 音效引擎
  const playSound = (type) => {
    if (isMuted) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
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
      gainNode.gain.setValueAtTime(0.2, now);
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

    const savedConfig = localStorage.getItem('ww3_predictor_config_v4');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        const mergedConfig = { ...DEFAULT_CONFIG, ...parsed };
        setConfig(mergedConfig);
        setTempConfig(mergedConfig);
        updateStatusDisplay(mergedConfig, 'OK', 'System Initialized');
      } catch (e) {}
    } else {
      updateStatusDisplay(DEFAULT_CONFIG, 'WARN', 'No API Key. Using Edge Engine.');
    }
  }, []);

  const updateStatusDisplay = (cfg, health, msg) => {
    let engine = 'LOCAL';
    if (cfg.provider !== 'local' && cfg.apiKey) engine = cfg.provider.toUpperCase();
    
    let trans = 'OFF';
    if (cfg.enableTranslation) {
      trans = (cfg.forceFreeTranslation || engine === 'LOCAL') ? 'FREE API' : 'LLM NATIVE';
    }

    setSysStatus({ engine, health, msg, trans });
  };

  useEffect(() => {
    langRef.current = lang;
    configRef.current = config;
    newsQueue.current = []; // 配置改变时刷新队列
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
        m: Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)),
        d: Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateMs]);

  // RSS 抓取与多源解析
  const fetchNewsQueue = async (currentConfig) => {
    const urlsToFetch = currentConfig.sources
      .map(id => RSS_PRESETS.find(p => p.id === id)?.url)
      .filter(Boolean);
    
    // 支持多行自定义 RSS
    if (currentConfig.customRss) {
      const customLines = currentConfig.customRss.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
      urlsToFetch.push(...customLines);
    }

    if (urlsToFetch.length === 0) return [...FALLBACK_NEWS].sort(() => 0.5 - Math.random());

    let allItems = [];
    await Promise.allSettled(urlsToFetch.map(async (url) => {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&api_key=`); // 限制使用量时尽量不要key
        const data = await res.json();
        if (data.status === 'ok') {
          // 清理多余标签，例如 Reddit RSS 喜欢带 /u/user
          const validTitles = data.items.map(i => i.title.replace(/\[.*?\]/g, '').trim()).filter(t => t && t.length > 10);
          allItems.push(...validTitles);
        }
      } catch (e) { console.error("RSS fetch error:", url); }
    }));

    if (allItems.length === 0) return [...FALLBACK_NEWS].sort(() => 0.5 - Math.random());
    
    return [...new Set(allItems)].sort(() => 0.5 - Math.random());
  };

  // 免费基础翻译模块 (走 raw json 通道提高稳定性)
  const getFreeBasicTranslation = async (text, targetLang) => {
    try {
      const tl = targetLang === 'zh' ? 'zh-CN' : 'en';
      // 避免源语言和目标语言相同时翻译
      const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const translatedText = data[0].map(x => x[0]).join('');
      return translatedText.trim().toLowerCase() === text.trim().toLowerCase() ? null : translatedText;
    } catch (e) {
      return null;
    }
  };

  // 本地边缘引擎
  const localAnalyzeEdge = (text, currentLang) => {
    let score = 0;
    const lower = text.toLowerCase();
    const negative = ['war', 'strike', 'missile', 'attack', 'nuclear', 'sanction', 'crisis', 'tension', 'military', 'conflict', 'dead', 'kill', 'warn', 'threat', '警告', '冲突', '袭击', '核', '制裁', '危机', '紧张', '军事', '战争', '导弹', '死', '威胁', '演习', 'escalate', 'troops', 'fire', 'clash'];
    const positive = ['peace', 'talks', 'treaty', 'ceasefire', 'agree', 'deal', 'summit', 'resolve', 'help', 'aid', '和平', '谈判', '条约', '停火', '同意', '协议', '峰会', '解决', '援助', '合作', '降温', 'pact'];

    let negMatch = negative.find(w => lower.includes(w));
    let posMatch = positive.find(w => lower.includes(w));

    if (negMatch) score -= (Math.random() * 0.4 + 0.3);
    if (posMatch) score += (Math.random() * 0.4 + 0.3);
    if (score === 0) score = (Math.random() * 0.2 - 0.1); 
    score = Math.max(-1, Math.min(1, score));

    const reason = currentLang === 'zh' 
      ? (score < -0.2 ? `高危词元匹配: [${negMatch}]` : score > 0.2 ? `缓和词元匹配: [${posMatch}]` : "常规监控，无异常")
      : (score < -0.2 ? `Risk token matched: [${negMatch}]` : score > 0.2 ? `Peace token matched: [${posMatch}]` : "Nominal telemetry");

    return { score: parseFloat(score.toFixed(2)), reason }; 
  };

  // AI 智能核心调度
  const evaluateWithAI = async (text, currentConfig, currentLang) => {
    const needsAiTranslation = currentConfig.enableTranslation && !currentConfig.forceFreeTranslation && currentConfig.provider !== 'local' && currentConfig.apiKey;

    if (currentConfig.provider === 'local' || !currentConfig.apiKey) {
      const result = localAnalyzeEdge(text, currentLang);
      if (currentConfig.enableTranslation) {
        result.translation = await getFreeBasicTranslation(text, currentLang);
      }
      return result;
    }

    const langName = currentLang === 'zh' ? 'Chinese' : 'English';
    
    // 极简 Prompt，严控输出长度
    const prompt = `Rate WW3 risk for this news. Score: -1.0 (war) to 1.0 (peace). 0 is neutral.
News: ${text}
Output JSON ONLY:
{"s": [number], "r": "[max_10_words_reason_in_${langName}]"${needsAiTranslation ? `, "t": "[translate_News_to_${langName}]"` : ""}}`;

    try {
      let responseText = "";

      if (currentConfig.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentConfig.modelName || 'gemini-2.5-flash'}:generateContent?key=${currentConfig.apiKey}`;
        const res = await fetch(url, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        responseText = data.candidates[0].content.parts[0].text;
      } 
      else if (currentConfig.provider === 'openai' || currentConfig.provider === 'deepseek') {
        let url = currentConfig.baseUrl || (currentConfig.provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'https://api.deepseek.com/chat/completions');
        let model = currentConfig.modelName || (currentConfig.provider === 'openai' ? 'gpt-4o-mini' : 'deepseek-chat');

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentConfig.apiKey}` },
          body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        responseText = data.choices[0].message.content;
      }

      let cleanJson = responseText;
      const startIdx = cleanJson.indexOf('{');
      const endIdx = cleanJson.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) cleanJson = cleanJson.substring(startIdx, endIdx + 1);
      else throw new Error("Invalid JSON");
      
      const result = JSON.parse(cleanJson);
      
      updateStatusDisplay(currentConfig, 'OK', 'API connection stable'); // 成功则更新状态

      let finalTranslation = null;
      if (currentConfig.enableTranslation) {
        if (currentConfig.forceFreeTranslation) {
          finalTranslation = await getFreeBasicTranslation(text, currentLang);
        } else {
          finalTranslation = result.t || null;
        }
      }

      return {
        score: parseFloat(result.s || 0),
        reason: `[LLM] ${result.r || 'Analyzed'}`,
        translation: finalTranslation
      };

    } catch (e) {
      console.warn("AI API Error:", e.message);
      // API 失败，更新 HUD 状态
      updateStatusDisplay(currentConfig, 'ERROR', e.message.includes('quota') ? 'Quota Exceeded - Using Local' : 'API Error - Using Local');
      
      const fallback = localAnalyzeEdge(text, currentLang);
      if (currentConfig.enableTranslation) {
        fallback.translation = await getFreeBasicTranslation(text, currentLang);
      }
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

      // 【去重逻辑】从队列中找出一条没处理过的新闻
      let newsText = null;
      while (newsQueue.current.length > 0) {
        const candidate = newsQueue.current.pop();
        if (!processedNewsCache.current.has(candidate)) {
          newsText = candidate;
          processedNewsCache.current.add(candidate);
          // 保持缓存池大小防止内存泄漏
          if (processedNewsCache.current.size > 500) {
            const first = processedNewsCache.current.values().next().value;
            processedNewsCache.current.delete(first);
          }
          break;
        }
      }

      // 如果队列里的新闻全处理过了，直接返回等下一轮抓取
      if (!newsText) {
        setIsEvaluating(false);
        return; 
      }

      const aiResult = await evaluateWithAI(newsText, curConfig, curLang);

      const impactDays = Math.round(aiResult.score * MAX_IMPACT_DAYS);
      const impactMs = impactDays * 24 * 60 * 60 * 1000;
      
      setTargetDateMs(prev => prev + impactMs);
      
      const isCritical = Math.abs(aiResult.score) >= 0.55; 

      if (aiResult.score <= -0.2) {
        setEffect('red');
        playSound(isCritical ? 'major_alert' : 'minor_red');
      } else if (aiResult.score >= 0.2) {
        setEffect('green');
        playSound(isCritical ? 'major_alert' : 'minor_green');
      } else {
        setEffect('none');
      }
      setTimeout(() => setEffect('none'), 1000);

      const newFeedItem = {
        id: Date.now(),
        text: newsText,
        score: aiResult.score,
        reason: aiResult.reason,
        translation: aiResult.translation,
        impactDays: impactDays,
        timestamp: new Date().toLocaleTimeString(),
        isCritical: isCritical
      };
      
      setNewsFeed(prev => [newFeedItem, ...prev].slice(0, 15));

      if (isCritical) {
        setPinnedAlerts(prev => {
          // 置顶区去重
          if (prev.some(p => p.text === newFeedItem.text)) return prev;
          return [newFeedItem, ...prev].slice(0, 3);
        });
      }

      setIsEvaluating(false);
    };

    const intervalMs = Math.max((config.refreshInterval || 30) * 1000, 15000);
    const newsInterval = setInterval(processNews, intervalMs); 
    
    processNews(); // 初始执行
    return () => clearInterval(newsInterval);
  }, [isMuted, config.refreshInterval]);

  const saveSettings = () => {
    localStorage.setItem('ww3_predictor_config_v4', JSON.stringify(tempConfig));
    setConfig(tempConfig);
    updateStatusDisplay(tempConfig, 'OK', 'Config Applied');
    setShowSettings(false);
    setNewsFeed([]); 
    processedNewsCache.current.clear(); // 更改设置后清理缓存，重新抓取
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className={`min-h-screen w-full bg-black text-white font-military relative overflow-hidden flex flex-col ${effect === 'red' ? 'animate-shake' : ''}`}>
        
        {/* CRT 特效屏蔽层 */}
        <div className={`absolute inset-0 pointer-events-none z-0 ${effect === 'red' ? 'flash-red-bg' : effect === 'green' ? 'flash-green-bg' : ''}`} />
        <div className="absolute inset-0 crt-overlay" />
        
        {/* 雷达背景 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[800px] h-[120vw] max-h-[800px] border border-red-900/10 rounded-full opacity-30 pointer-events-none flex items-center justify-center z-0">
          <div className="absolute inset-0 radar-scan rounded-full" />
          <div className="absolute inset-0 border border-red-900/20 rounded-full scale-75" />
          <div className="absolute inset-0 border border-red-900/30 rounded-full scale-50" />
        </div>

        {/* 顶部控制栏 */}
        <div className="absolute top-4 right-4 z-[60] flex space-x-2">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2 border ${isMuted ? 'border-neutral-700 bg-neutral-900/80 text-neutral-500' : 'border-red-900/50 bg-red-900/20 text-red-400 animate-pulse'} rounded transition-colors backdrop-blur-sm`}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 rounded transition-colors backdrop-blur-sm">
            <Settings className="w-5 h-5 text-neutral-300" />
          </button>
          <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')} className="px-4 py-2 border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 rounded text-sm transition-colors backdrop-blur-sm font-bold">
            {t.langSwitch}
          </button>
        </div>

        {/* 主内容区 */}
        <div className="relative z-10 flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center min-h-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10 gap-6 xl:gap-12 relative">
            
            {/* 左侧：重大危机预警 */}
            {pinnedAlerts.length > 0 && (
              <div className="w-full xl:w-72 shrink-0 mb-6 xl:mb-0 xl:sticky xl:top-24 z-20">
                <div className="flex items-center space-x-2 text-red-500 mb-3 border-b border-red-900/50 pb-2">
                  <Pin className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest">{t.criticalAlerts}</span>
                </div>
                <div className="space-y-3">
                  {pinnedAlerts.map(alert => (
                    <div key={alert.id} className="bg-red-950/40 border border-red-900/50 p-3 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-red-400/70 font-sans">{alert.timestamp}</span>
                        <span className="text-[10px] font-bold text-red-500">IMPACT: {alert.impactDays > 0 ? '+' : ''}{alert.impactDays}D</span>
                      </div>
                      <p className="text-xs text-red-100 leading-relaxed line-clamp-3">{alert.translation || alert.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 中间核心区 */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center">
              
              {/* 系统状态监控 HUD (新增) */}
              <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8 text-[10px] sm:text-xs">
                <div className={`flex items-center px-2.5 py-1 border rounded bg-black/50 backdrop-blur-sm ${sysStatus.health === 'OK' ? 'border-green-800 text-green-500' : sysStatus.health === 'WARN' ? 'border-amber-800 text-amber-500' : 'border-red-800 text-red-500'}`}>
                  {sysStatus.health === 'OK' ? <ServerCrash className="w-3 h-3 mr-1.5 opacity-50" /> : <AlertTriangle className="w-3 h-3 mr-1.5" />}
                  SYS: {sysStatus.health}
                </div>
                <div className="flex items-center px-2.5 py-1 border border-neutral-800 text-neutral-400 rounded bg-black/50 backdrop-blur-sm">
                  <Cpu className="w-3 h-3 mr-1.5" /> ENG: {sysStatus.engine}
                </div>
                <div className="flex items-center px-2.5 py-1 border border-neutral-800 text-neutral-400 rounded bg-black/50 backdrop-blur-sm">
                  <Languages className="w-3 h-3 mr-1.5" /> TRN: {sysStatus.trans}
                </div>
                <div className="hidden sm:flex items-center px-2.5 py-1 border border-neutral-800 text-neutral-500 rounded bg-black/50 backdrop-blur-sm max-w-[200px] truncate">
                  {sysStatus.msg}
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6 sm:mb-10 text-red-500 opacity-90 border border-red-900/50 px-6 py-3 rounded bg-red-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center w-fit">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
                <h1 className="text-sm sm:text-lg tracking-[0.2em] uppercase font-bold">{t.title}</h1>
              </div>

              <div className="text-center w-full mb-10 sm:mb-12">
                <div className="text-xs text-red-500/60 mb-5 tracking-[0.5em] uppercase">{t.subtitle}</div>
                
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-5 w-full">
                  <TimeUnit value={timeLeft.y} label={t.years} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={timeLeft.m} label={t.months} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={timeLeft.d} label={t.days} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={String(timeLeft.h).padStart(2,'0')} label={t.hrs} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={String(timeLeft.min).padStart(2,'0')} label={t.mins} effect={effect} />
                  <TimeSeparator effect={effect} />
                  <TimeUnit value={String(timeLeft.s).padStart(2,'0')} label={t.secs} effect={effect} />
                </div>

                <div className="mt-8 flex justify-center items-center">
                  <div className="flex items-center space-x-2 bg-neutral-900/80 px-4 py-1.5 rounded-full border border-neutral-800 shadow-lg backdrop-blur-sm">
                    <div className={`w-2 h-2 rounded-full ${isEvaluating ? 'bg-amber-500 animate-ping' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                    <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide">{isEvaluating ? t.evaluating : t.stable}</span>
                  </div>
                </div>
              </div>

              {/* 新闻流面板 */}
              <div className="w-full border border-neutral-800/80 bg-neutral-950/80 rounded overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[40vh] min-h-[250px] max-h-[450px]">
                <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 px-4 py-3 shrink-0">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <ActivitySquare className="w-4 h-4 text-blue-500" />
                    <span className="text-xs tracking-wider font-bold">{t.liveFeed}</span>
                  </div>
                  <button onClick={() => setShowLog(true)} className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-900/20 hover:bg-blue-900/40 rounded transition-colors">
                    <Info className="w-3 h-3" />
                    <span>{t.aiLogic}</span>
                  </button>
                </div>

                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar flex-1 relative">
                  {newsFeed.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-sm">
                      <Zap className="w-4 h-4 mr-2 animate-pulse" /> {t.intercepting}
                    </div>
                  ) : (
                    newsFeed.map((item, index) => (
                      <div key={item.id} className={`flex flex-col sm:flex-row justify-between p-3 sm:p-4 rounded bg-neutral-900/60 border-l-4 ${item.score <= -0.2 ? 'border-red-600' : item.score >= 0.2 ? 'border-green-600' : 'border-neutral-600'} transition-all duration-500 ${index === 0 ? 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-neutral-800/80' : 'opacity-85'}`}>
                        
                        <div className="flex-1 pr-0 sm:pr-6 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[10px] text-neutral-500 font-sans tracking-wider">{item.timestamp}</span>
                            {index === 0 && <span className="text-[9px] bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded animate-pulse">{t.new}</span>}
                          </div>
                          <p className={`text-sm leading-relaxed ${item.score <= -0.2 ? 'text-red-100' : item.score >= 0.2 ? 'text-green-100' : 'text-neutral-300'}`}>
                            {item.text}
                          </p>
                          {item.translation && (
                            <div className="mt-2 pt-2 border-t border-neutral-800/50 flex items-start space-x-2">
                              <Languages className="w-3.5 h-3.5 text-blue-500/50 mt-0.5 shrink-0" />
                              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">{item.translation}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end sm:space-x-6 shrink-0 border-t border-neutral-800/50 sm:border-t-0 pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <div className="text-[10px] text-neutral-500 uppercase">{t.aiDanger}</div>
                            <div className={`text-sm sm:text-lg font-bold ${item.score <= -0.2 ? 'text-red-500' : item.score >= 0.2 ? 'text-green-500' : 'text-neutral-400'}`}>
                              {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right sm:w-28">
                            <div className="text-[10px] text-neutral-500 uppercase">{t.timeCorrection}</div>
                            <div className={`text-sm sm:text-lg font-bold ${item.impactDays < 0 ? 'text-red-500 text-glow-red' : item.impactDays > 0 ? 'text-green-500 text-glow-green' : 'text-neutral-400'}`}>
                              {item.impactDays > 0 ? `+${item.impactDays}` : item.impactDays} DAYS
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
          <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b border-neutral-800 shrink-0">
                <h2 className="text-lg font-bold text-white flex items-center"><Settings className="w-5 h-5 mr-2 text-neutral-400"/> {t.settings}</h2>
                <button onClick={() => setShowSettings(false)} className="text-neutral-500 hover:text-white p-1 bg-neutral-900 rounded"><X className="w-5 h-5"/></button>
              </div>

              <div className="flex border-b border-neutral-800 shrink-0">
                <button onClick={() => setSettingsTab('ai')} className={`flex-1 p-3 text-sm font-bold flex items-center justify-center transition-colors ${settingsTab === 'ai' ? 'bg-blue-900/20 text-blue-400 border-b-2 border-blue-500' : 'text-neutral-500 hover:bg-neutral-900'}`}><Cpu className="w-4 h-4 mr-2"/>{t.tabAi}</button>
                <button onClick={() => setSettingsTab('data')} className={`flex-1 p-3 text-sm font-bold flex items-center justify-center transition-colors ${settingsTab === 'data' ? 'bg-green-900/20 text-green-400 border-b-2 border-green-500' : 'text-neutral-500 hover:bg-neutral-900'}`}><Database className="w-4 h-4 mr-2"/>{t.tabData}</button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 font-sans">
                {settingsTab === 'ai' ? (
                  <div className="space-y-5">
                    {tempConfig.provider === 'local' && <div className="p-3 bg-amber-900/20 border border-amber-900/50 rounded text-xs text-amber-500 leading-relaxed">{t.localWarning}</div>}
                    
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">{t.aiProvider}</label>
                      <select value={tempConfig.provider} onChange={(e) => setTempConfig({...tempConfig, provider: e.target.value})} className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="local">Local Edge Engine (Free & Fast)</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI (GPT API)</option>
                        <option value="deepseek">DeepSeek API</option>
                      </select>
                    </div>

                    {tempConfig.provider !== 'local' && (
                      <>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5 uppercase flex items-center"><Key className="w-3 h-3 mr-1"/> {t.apiKey}</label>
                          <input type="password" value={tempConfig.apiKey} onChange={(e) => setTempConfig({...tempConfig, apiKey: e.target.value})} placeholder="sk-..." className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1.5 uppercase">{t.baseUrl}</label>
                            <input type="text" value={tempConfig.baseUrl} onChange={(e) => setTempConfig({...tempConfig, baseUrl: e.target.value})} placeholder={tempConfig.provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'Leave blank'} className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/>
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1.5 uppercase">{t.modelName}</label>
                            <input type="text" value={tempConfig.modelName} onChange={(e) => setTempConfig({...tempConfig, modelName: e.target.value})} placeholder={tempConfig.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini'} className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t border-neutral-800">
                      <label className="block text-xs text-amber-500 mb-3 uppercase font-bold flex items-center">
                        <ZapOff className="w-4 h-4 mr-1"/> {t.transSettings}
                      </label>
                      <div className="space-y-3 bg-neutral-900/30 p-3 rounded border border-neutral-800">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" className="mr-3" checked={tempConfig.enableTranslation} onChange={(e) => setTempConfig({...tempConfig, enableTranslation: e.target.checked})} />
                          <span className="text-sm text-neutral-200">{t.enableTrans}</span>
                        </label>
                        {tempConfig.enableTranslation && tempConfig.provider !== 'local' && (
                          <label className="flex items-start cursor-pointer ml-6 mt-2">
                            <input type="checkbox" className="mr-3 mt-1" checked={tempConfig.forceFreeTranslation} onChange={(e) => setTempConfig({...tempConfig, forceFreeTranslation: e.target.checked})} />
                            <span className="text-xs text-neutral-400 leading-snug">{t.forceFreeTrans}</span>
                          </label>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">{t.refreshRate}</label>
                      <select value={tempConfig.refreshInterval} onChange={(e) => setTempConfig({...tempConfig, refreshInterval: Number(e.target.value)})} className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500">
                        <option value={15}>{t.rate15s}</option>
                        <option value={30}>{t.rate30s}</option>
                        <option value={60}>{t.rate60s}</option>
                      </select>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-800">
                      <p className="text-xs text-neutral-400 mb-3">{t.dataDesc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {RSS_PRESETS.map(source => (
                          <label key={source.id} className={`flex items-center p-2.5 border rounded cursor-pointer transition-colors ${tempConfig.sources.includes(source.id) ? 'bg-green-900/20 border-green-700/50 text-green-400' : 'bg-black border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}>
                            <input type="checkbox" className="hidden" 
                              checked={tempConfig.sources.includes(source.id)}
                              onChange={(e) => {
                                const newSources = e.target.checked ? [...tempConfig.sources, source.id] : tempConfig.sources.filter(id => id !== source.id);
                                setTempConfig({...tempConfig, sources: newSources});
                              }}
                            />
                            <Globe className="w-4 h-4 mr-2 opacity-70 shrink-0" />
                            <span className="text-xs font-bold truncate">{source.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* 支持多行自定义 RSS */}
                    <div className="pt-2">
                      <label className="block text-xs text-neutral-400 mb-1.5 uppercase">{t.customRss}</label>
                      <textarea 
                        value={tempConfig.customRss} 
                        onChange={(e) => setTempConfig({...tempConfig, customRss: e.target.value})} 
                        placeholder="https://example.com/feed.xml&#10;https://another.com/rss" 
                        className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-green-500 h-24 custom-scrollbar resize-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 shrink-0">
                <button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded text-sm transition-colors font-bold tracking-widest shadow-lg shadow-blue-900/20">
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 浮层：AI 分析日志 --- */}
        {showLog && (
          <div className="fixed top-0 right-0 w-full sm:w-[480px] h-[100dvh] bg-neutral-950/98 border-l border-neutral-800 z-[60] p-5 backdrop-blur-xl transform transition-transform shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-800 shrink-0">
              <h2 className="text-amber-500 flex items-center text-sm font-bold tracking-widest">
                <ShieldCheck className="w-5 h-5 mr-2" /> {t.logTitle}
              </h2>
              <button onClick={() => setShowLog(false)} className="text-neutral-400 hover:text-white bg-neutral-800/80 rounded p-1.5 transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {newsFeed.map((item) => (
                <div key={item.id} className="text-xs border border-neutral-800 p-4 rounded bg-black">
                  <div className="text-neutral-500 mb-3 border-b border-neutral-800 pb-2 flex justify-between font-sans">
                    <span>{t.eventId}: #{item.id}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="mb-3 text-neutral-300 leading-relaxed text-sm">"{item.text}"</div>
                  
                  {item.translation && (
                    <div className="mb-3 text-neutral-500 text-xs italic border-l-2 border-neutral-800 pl-2">
                      {item.translation}
                    </div>
                  )}

                  <div className="flex items-start space-x-2 mt-3 p-3 bg-neutral-900 rounded border border-neutral-800">
                    {item.score <= -0.2 ? <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> : <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                    <div className="flex flex-col">
                      <span className="text-blue-400 font-bold mb-1">{t.aiConclusion}</span>
                      <span className="text-neutral-300 text-sm leading-relaxed">{item.reason}</span>
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
  const color = effect === 'red' ? 'text-red-400 text-glow-red' : effect === 'green' ? 'text-green-400 text-glow-green' : 'text-red-500 text-glow-red';
  return (
    <div className="flex flex-col items-center">
      <div className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter ${color} transition-colors duration-300 py-1`}>
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-red-900/80 mt-1 tracking-[0.2em] sm:tracking-[0.4em] font-sans font-bold">{label}</div>
    </div>
  );
};

const TimeSeparator = ({ effect }) => (
  <div className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl pb-4 sm:pb-6 ${effect === 'red' ? 'text-red-400' : effect === 'green' ? 'text-green-400' : 'text-red-900/40'} animate-pulse`}>
    :
  </div>
);