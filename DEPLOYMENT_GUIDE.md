# FutureBabe SAAS 上线部署指南

## 📁 源码位置
你的完整源码在：`c:\Users\Administrator\Documents\augment-projects\AIbeby`

## 🚀 上线赚钱的关键步骤

### 1. 配置 Supabase 数据库 (必须)

#### 1.1 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目URL和API密钥

#### 1.2 设置数据库表
运行 `database/schema.sql` 中的SQL语句创建必要的表：
- users (用户表)
- payments (支付记录)
- generations (AI生成记录)
- subscriptions (订阅管理)

### 2. 配置 PayPal 支付 (必须)

#### 2.1 创建 PayPal 开发者账户
1. 访问 [developer.paypal.com](https://developer.paypal.com)
2. 创建应用获取 Client ID
3. 创建订阅计划获取 Plan ID

#### 2.2 更新环境变量
编辑 `.env.local` 文件：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的supabase服务密钥

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的PayPal客户端ID
NEXT_PUBLIC_PAYPAL_SUBSCRIPTION_PLAN_ID=你的订阅计划ID
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox  # 测试环境，生产环境改为live

# AI服务 (选择一个)
OPENAI_API_KEY=你的OpenAI密钥
REPLICATE_API_TOKEN=你的Replicate密钥
```

### 3. 配置 AI 图像生成服务 (必须)

选择以下服务之一：

#### 选项A: OpenAI DALL-E
- 成本：约$0.02-0.04/张图片
- 质量：高
- 申请：[platform.openai.com](https://platform.openai.com)

#### 选项B: Replicate
- 成本：约$0.01-0.03/张图片  
- 质量：很高
- 申请：[replicate.com](https://replicate.com)

#### 选项C: Stability AI
- 成本：约$0.01-0.02/张图片
- 质量：高
- 申请：[platform.stability.ai](https://platform.stability.ai)

### 4. 部署到生产环境

#### 推荐选项A: Vercel (最简单)
1. 推送代码到 GitHub
2. 连接 Vercel 账户
3. 导入项目并设置环境变量
4. 自动部署

#### 选项B: Netlify
1. 构建项目：`npm run build`
2. 上传到 Netlify
3. 设置环境变量

#### 选项C: 自己的服务器
1. 购买VPS (推荐DigitalOcean/AWS)
2. 安装Node.js和PM2
3. 部署代码并启动服务

### 5. 域名和SSL证书
1. 购买域名 (推荐 .com 域名)
2. 配置DNS指向你的服务器
3. 设置SSL证书 (Let's Encrypt免费)

### 6. 营销和推广

#### 6.1 SEO优化
- 添加Google Analytics
- 提交到Google Search Console
- 优化页面标题和描述

#### 6.2 社交媒体营销
- 创建Instagram/TikTok账户
- 发布AI生成的婴儿照片示例
- 使用相关标签 #futurebaby #AI #pregnancy

#### 6.3 内容营销
- 写博客文章关于AI和怀孕
- 创建YouTube视频展示产品
- 在Reddit相关社区分享

### 7. 法律合规

#### 7.1 必需文件 (已包含)
- 隐私政策 (`/privacy`)
- 服务条款 (`/terms`)
- 退款政策 (`/refund-policy`)

#### 7.2 数据保护
- 确保用户照片加密存储
- 实施数据删除功能
- 遵守GDPR/CCPA规定

### 8. 监控和分析
1. 设置错误监控 (Sentry)
2. 配置性能监控
3. 跟踪转化率和收入

## 💰 预期收入模型

### 定价策略 (已更新)
- 一次性：$5.90
- 月度订阅：$12.90
- 年度计划：$39.90

### 成本估算
- AI生成成本：$0.02-0.04/张
- 服务器成本：$10-50/月
- 域名：$10-15/年

### 盈利预测
- 100个用户/月 = $290-790收入
- 1000个用户/月 = $2,900-7,900收入
- 10000个用户/月 = $29,000-79,000收入

## ⚡ 快速启动清单

- [ ] 配置Supabase数据库
- [ ] 设置PayPal支付
- [ ] 配置AI服务API
- [ ] 更新环境变量
- [ ] 部署到Vercel
- [ ] 购买域名
- [ ] 开始营销推广

## 🔧 修复注册问题

**问题：** 注册后数据库没有显示用户记录

**原因：** 之前的注册功能只是模拟，没有真正连接Supabase

**已修复：**
✅ 注册页面现在连接真实的Supabase
✅ 登录页面也已更新
✅ 仪表板显示真实用户信息
✅ 添加了Supabase依赖包

**测试步骤：**
1. 配置 `.env.local` 中的Supabase变量
2. 在Supabase中运行 `database/schema.sql`
3. 重新测试注册功能
4. 检查Supabase数据库中的 `users` 表

## 🆘 需要帮助？

如果遇到技术问题，检查：
1. 环境变量是否正确设置
2. API密钥是否有效
3. 数据库连接是否正常
4. PayPal配置是否正确

**下一步：立即配置Supabase和PayPal，这是开始赚钱的关键！**
