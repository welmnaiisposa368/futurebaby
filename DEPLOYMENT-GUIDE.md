# FutureBabe 部署指南 - 新定价系统

## 🚀 更新内容

### 新定价结构
**订阅计划：**
- One-Time Plan: $5.90 (1 AI Baby Photo + 1 Voice)
- Monthly Plan: $12.90/月 (3 Baby Generations/月)
- Yearly Plan: $39.90/年 (12 Baby Generations，一次性交付)

**积分套餐：**
- 2 Credits: $8.90 (~$4.45/generation)
- 5 Credits: $19.90 (~$3.98/generation) - 最受欢迎
- 10 Credits: $39.90 (~$3.99/generation) - 高价值选择

## 📋 部署前准备

### 1. 数据库迁移
在Supabase SQL编辑器中运行 `database-migration-pricing.sql`：

```sql
-- 运行完整的迁移脚本
-- 这将创建新的表和字段来支持新定价系统
```

### 2. 环境变量配置
更新你的 `.env.local` 文件：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase anon key
SUPABASE_SERVICE_ROLE_KEY=你的supabase service role key

# PayPal配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的paypal client id
PAYPAL_CLIENT_SECRET=你的paypal client secret
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox

# 新定价配置
ONETIME_PLAN_PRICE=5.90
MONTHLY_PLAN_PRICE=12.90
YEARLY_PLAN_PRICE=39.90
CREDITS_2_PRICE=8.90
CREDITS_5_PRICE=19.90
CREDITS_10_PRICE=39.90

# NextAuth配置
NEXTAUTH_SECRET=随机生成的32位字符串
NEXTAUTH_URL=https://你的域名.com
```

### 3. PayPal产品设置
在PayPal开发者控制台创建以下产品：

**订阅产品：**
- Monthly Plan: $12.90/月
- Yearly Plan: $39.90/年

**一次性产品：**
- One-Time Plan: $5.90
- 2 Credits: $8.90
- 5 Credits: $19.90
- 10 Credits: $39.90

## 🔧 Netlify部署步骤

### 1. 推送代码到GitHub
```bash
git add .
git commit -m "Update pricing system to new structure"
git push origin main
```

### 2. Netlify环境变量
在Netlify站点设置中添加所有环境变量：
- 进入站点设置 → Environment variables
- 添加上述所有变量

### 3. 构建设置
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18

### 4. 域名配置
- 添加自定义域名
- 配置DNS记录
- 启用HTTPS

## ✅ 测试清单

### 功能测试
- [ ] 定价页面显示正确价格
- [ ] PayPal支付流程正常
- [ ] 订阅创建和管理
- [ ] 积分购买和消费
- [ ] 用户仪表板显示正确信息
- [ ] 生成限制正确执行

### 支付测试
- [ ] One-Time Plan ($5.90) 支付
- [ ] Monthly Plan ($12.90) 订阅
- [ ] Yearly Plan ($39.90) 订阅
- [ ] 2 Credits ($8.90) 购买
- [ ] 5 Credits ($19.90) 购买
- [ ] 10 Credits ($39.90) 购买

### 权限测试
- [ ] 积分用户：每次生成消耗1积分
- [ ] 月度订阅：每月3次生成限制
- [ ] 年度订阅：12次生成一次性交付
- [ ] 无权限用户：正确显示购买提示

## 🔄 生产环境切换

### 1. PayPal生产环境
```bash
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
# 使用生产环境的Client ID和Secret
```

### 2. 域名更新
```bash
NEXTAUTH_URL=https://你的实际域名.com
```

### 3. Supabase生产配置
- 确保数据库迁移已执行
- 检查行级安全策略
- 验证API密钥配置

## 📊 监控和维护

### 1. 支付监控
- 监控PayPal webhook接收
- 检查支付成功率
- 跟踪订阅续费情况

### 2. 用户体验监控
- 生成成功率
- 页面加载速度
- 错误日志监控

### 3. 定期维护
- 每月重置月度计数器
- 清理过期数据
- 备份重要数据

## 🆘 常见问题

### 支付问题
- 检查PayPal配置
- 验证webhook URL
- 确认环境变量正确

### 权限问题
- 检查数据库函数
- 验证用户状态
- 确认积分余额

### 性能问题
- 优化数据库查询
- 启用CDN缓存
- 监控API响应时间

## 📞 支持联系

如果遇到部署问题，请检查：
1. 所有环境变量是否正确配置
2. 数据库迁移是否成功执行
3. PayPal产品是否正确创建
4. DNS配置是否生效

部署完成后，新的定价系统将立即生效！
