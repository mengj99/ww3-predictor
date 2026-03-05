# 🌍 W.W.III Prediction Terminal (第三次世界大战预测终端)

[English](#english) | [中文](#中文-chinese)

---

## English

> A cyberpunk-style visual Web Terminal. It fetches live RSS news from major global media outlets and uses AI Large Language Models (or a built-in Edge NLP engine) to perform sentiment analysis on the "geopolitical risk" of the news. This dynamically increases or decreases the countdown timer to the "outbreak of World War III."

### ✨ Features

* 📡 **Live Intel Intercept**: Integrates multiple sources like BBC, Al Jazeera, and UN News by default, and supports adding any custom RSS feed URLs.
* 🧠 **Dual AI Engines**:
  * **Local Edge Engine**: Forever free, zero dependencies. Performs rapid weight analysis using a built-in geopolitical dictionary.
  * **Cloud LLM Hub**: Natively supports Google Gemini, OpenAI (GPT), and DeepSeek, providing precise scoring and reasoning based on deep semantic analysis.
* 🌐 **Auto-Translation**: No matter the language of the news source, the system can automatically call a free basic translation API to convert it into your UI language (supports EN/ZH bilingual UI).
* 🚨 **Immersive UI/UX**:
  * Retro military CRT monitor scanlines and radar animations.
  * Pure code-synthesized air raid sirens and radar sounds via `Web Audio API`.
  * Triggers global red screen flashing and physical-level screen shaking during major crises (when Impact score drops significantly).
* 📌 **Critical Alerts (Pinned)**: Major negative news is automatically extracted and pinned prominently on the screen, creating an ultimate sense of tension.
* 📱 **Fully Responsive**: Uses a flexible dual-column layout and smart scaling, perfectly compatible with everything from mobile devices to 16:9 ultra-wide desktop monitors.

### 🛠️ Tech Stack

* **Framework**: React (Hooks)
* **Styling**: Tailwind CSS (Injected dynamically via CDN, zero config)
* **Icons**: `lucide-react`
* **Data Flow**: `rss2json` (RSS to JSON API), `allorigins` (CORS Proxy)
* **Audio**: Native Web Audio API (No external audio files required)

### 🚀 Getting Started

#### Local Development

1. Clone this repository:
```bash
git clone [https://github.com/your-username/ww3-terminal.git](https://github.com/your-username/ww3-terminal.git)
cd ww3-terminal
```

2. Install dependencies (primarily `lucide-react`):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

#### Deploy to Vercel (One-Click Deploy)

This project is built entirely on the frontend with no backend database, making it perfect for Serverless platforms:

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/), click **Add New -> Project**.
3. Import your GitHub repository, and click **Deploy** to get a globally accelerated URL.

### ⚙️ Configuration

After launching the page, click the **Settings (⚙️)** icon in the top right corner to open the "Terminal Config Hub":

* **API Key (BYOK)**: Defaults to the local free engine. Enter your own API Key to unlock highly intelligent scoring logic. Keys are **saved ONLY in your browser's LocalStorage**, ensuring absolute security.
* **Refresh Rate**: Offers 15s, 30s, and 60s intervals to prevent excessive consumption of your free API quota (Rate Limiting).
* **Custom Sources**: In addition to preset global media, you can enter any valid RSS XML link in the "Intel Sources" panel.

### ⚠️ Disclaimer

> This project is built solely for **frontend technical demonstration, data visualization experiments, and entertainment purposes**. The predicted countdown time, AI scoring logic, and news sentiment judgments **have no scientific significance or real-world application**. Please do not use it as a basis for judging real-world conflicts.

*Stay safe, stay informed.*

---

## 中文 (Chinese)

> 一个极具赛博朋克风格的可视化 Web 终端。它通过实时抓取全球各大媒体的 RSS 新闻，并利用 AI 大语言模型（或内置边缘 NLP 引擎）对新闻的“地缘政治风险”进行情感打分，从而动态增减“距离第三次世界大战爆发”的倒计时。

### ✨ 核心特性

* 📡 **全球情报截获 (Live Intel Intercept)**: 默认集成 BBC、Al Jazeera、UN News 等多路源，支持用户自定义添加任何 RSS 链接。
* 🧠 **双轨 AI 算力引擎 (Dual AI Engines)**:
  * **本地边缘引擎 (Local Edge)**: 永久免费、零依赖。通过内置的地缘政治词库进行快速权重分析。
  * **云端大模型中枢 (Cloud LLM)**: 原生支持接入 Google Gemini、OpenAI (GPT) 和 DeepSeek，提供基于深层语义的精准打分与理由输出。
* 🌐 **智能无感翻译 (Auto-Translation)**: 无论新闻源是哪种语言，系统均可自动调用基础免费翻译接口，将其转换为您界面的语言（支持中/英双语 UI 切换）。
* 🚨 **沉浸式视听反馈 (Immersive UI/UX)**:
  * 老式军用 CRT 显示器扫描线与雷达动画。
  * 基于 `Web Audio API` 纯代码合成的防空警报与雷达提示音。
  * 当发生重大危机（Impact 分数过低）时，触发全局红屏闪烁与物理级屏幕震动。
* 📌 **危机置顶 (Critical Alerts)**: 重大负面新闻将自动被提取并 PIN 在屏幕显眼位置，带来极致压迫感。
* 📱 **全端完美适配 (Fully Responsive)**: 采用弹性双栏布局与智能缩放，完美兼容从手机端到 16:9 超宽电脑显示器。

### 🛠️ 技术栈

* **框架**: React (Hooks)
* **样式**: Tailwind CSS (通过 CDN 动态注入，零配置)
* **图标**: `lucide-react`
* **数据流**: `rss2json` (RSS 转 JSON API), `allorigins` (跨域请求代理)
* **音效**: 原生 Web Audio API (无需外部音频文件)

### 🚀 快速开始

#### 本地运行

1. 克隆本项目到本地：
```bash
git clone [https://github.com/your-username/ww3-terminal.git](https://github.com/your-username/ww3-terminal.git)
cd ww3-terminal
```

2. 安装依赖 (主要是安装 `lucide-react`)：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

#### 部署到 Vercel (一键部署)

本项目完全由纯前端构建，无需任何后端数据库，极其适合部署在 Serverless 平台：

1. 将代码推送到您的 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com/), 点击 **Add New -> Project**。
3. 导入您的 GitHub 仓库，直接点击 **Deploy** 即可获得全球加速的访问链接。

### ⚙️ 终端配置说明

在网页运行后，点击右上角的 **设置 (⚙️)** 图标即可打开“终端配置中枢”：

* **API 密钥 (BYOK)**: 默认使用本地免费引擎。您可以填入自己的 API Key 来解锁高度智能的打分逻辑。密钥**仅保存在您的浏览器本地缓存 (LocalStorage)** 中，绝对安全。
* **刷新频率**: 提供 15秒、30秒、60秒 三个档位，防止免费 API 额度被过度消耗（Rate Limit）。
* **自定义数据源**: 除了预设的全球媒体，您可以在“情报数据源”面板填入任何有效的 RSS XML 链接。

### ⚠️ 免责声明

> 本项目仅为**前端技术演示、数据可视化实验与娱乐目的**而构建。预测的倒计时时间、AI 打分逻辑及新闻情感判定**不具有任何现实世界的科学指导意义**。请勿将其作为真实世界冲突的判断依据。

*Stay safe, stay informed.*