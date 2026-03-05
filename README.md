🌍 W.W.III Prediction Terminal (第三次世界大战预测终端)

一个极具赛博朋克风格的可视化 Web 终端。它通过实时抓取全球各大媒体的 RSS 新闻，并利用 AI 大语言模型（或内置边缘 NLP 引擎）对新闻的“地缘政治风险”进行情感打分，从而动态增减“距离第三次世界大战爆发”的倒计时。

✨ 核心特性 (Features)

📡 全球情报截获 (Live Intel Intercept): 默认集成 BBC、Al Jazeera、UN News 等多路源，支持用户自定义添加任何 RSS 链接。

🧠 双轨 AI 算力引擎 (Dual AI Engines):

本地边缘引擎 (Local Edge): 永久免费、零依赖。通过内置的地缘政治词库进行快速权重分析。

云端大模型中枢 (Cloud LLM): 原生支持接入 Google Gemini、OpenAI (GPT) 和 DeepSeek，提供基于深层语义的精准打分与理由输出。

🌐 智能无感翻译 (Auto-Translation): 无论新闻源是哪种语言，系统均可自动调用基础免费翻译接口，将其转换为您界面的语言（支持中/英双语 UI 切换）。

🚨 沉浸式视听反馈 (Immersive UI/UX):

老式军用 CRT 显示器扫描线与雷达动画。

基于 Web Audio API 纯代码合成的防空警报与雷达提示音。

当发生重大危机（Impact 分数过低）时，触发全局红屏闪烁与物理级屏幕震动。

📌 危机置顶 (Critical Alerts): 重大负面新闻将自动被提取并 PIN 在屏幕显眼位置，带来极致压迫感。

📱 全端完美适配 (Fully Responsive): 采用弹性双栏布局与智能缩放，完美兼容从手机端到 16:9 超宽电脑显示器。

🛠️ 技术栈 (Tech Stack)

框架: React (Hooks)

样式: Tailwind CSS (通过 CDN 动态注入，零配置)

图标: lucide-react

数据流: rss2json (RSS 转 JSON API), allorigins (跨域请求代理)

音效: 原生 Web Audio API (无需外部音频文件)

🚀 快速开始 (Getting Started)

本地运行 (Local Development)

克隆本项目到本地：

git clone [https://github.com/your-username/ww3-terminal.git](https://github.com/your-username/ww3-terminal.git)
cd ww3-terminal


安装依赖 (主要是安装 lucide-react)：

npm install


启动开发服务器：

npm run dev


部署到 Vercel (一键部署)

本项目完全由纯前端构建，无需任何后端数据库，极其适合部署在 Serverless 平台：

将代码推送到您的 GitHub 仓库。

登录 Vercel，点击 Add New -> Project。

导入您的 GitHub 仓库，直接点击 Deploy 即可获得全球加速的访问链接。

⚙️ 终端配置说明 (Configuration)

在网页运行后，点击右上角的 设置 (⚙️) 图标即可打开“终端配置中枢”：

API 密钥 (BYOK): 默认使用本地免费引擎。您可以填入自己的 API Key 来解锁高度智能的打分逻辑。密钥仅保存在您的浏览器本地缓存 (LocalStorage) 中，绝对安全。

刷新频率: 提供 15秒、30秒、60秒 三个档位，防止免费 API 额度被过度消耗（Rate Limit）。

自定义数据源: 除了预设的全球媒体，您可以在“情报数据源”面板填入任何有效的 RSS XML 链接。

⚠️ 免责声明 (Disclaimer)

本项目仅为前端技术演示、数据可视化实验与娱乐目的而构建。预测的倒计时时间、AI 打分逻辑及新闻情感判定不具有任何现实世界的科学指导意义。请勿将其作为真实世界冲突的判断依据。

Stay safe, stay informed.