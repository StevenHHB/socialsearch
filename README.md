# Social Targeter

## Connection to SEO Engine Config 
### 0. 项目启动与配置
* 请务必联系`chiev`通过SEO Engine内部接口创建项目，否则SEO Engine无法识别本项目并且进行操作。
* 项目创建涉及到`config.json`文件的编写，请务必确保已经配置好：
    a. `Google Search Console`以及谷歌Service Account Credentials（获取到Oauth2 Token）
    b. 已经生成了完整的Keyword list （Semrush格式csv文件）
    c. 确保Sitemap、博客api、以及search console site、以及博客页面URL准备完成
### 1. Environment Variable Checklist （该步骤需要再创建完成Project之后方可全部完成）
```python
# 这个是在项目config里面配置的，用于给SEO Engine调用APP接口
BLOG_API_KEY=socialtargeter2024  
# SEO Engine Supabase 博客文章数据库表
BLOG_SUPABASE_URL=https://cogdwpjfmifsfnpgjkni.supabase.co 
# SEO Engine 数据库访问Token
BLOG_SUPABASE_SERVICE_KEY=eyJhbGc... 
# SEO Engine 中给这个项目的id
SEO_ENGINE_PROJECT_KEY=4 
# 本项目的博客获取接口（用于本项目SLUG生成获取博客）
BLOG_API_URL=https://socialtargeter.com/api/blogs 
```

### 2. Important Files （该步骤请在创建SEO Engine Project之前完成）
1. `project/utils/seoUtils.ts` 用于动态更新本地Sitemap，生成并host sitemap.xml到public文件夹
2. `app/api/blogs/route.ts`
    * GET用于从SEO Engine数据库获取博客文章
    * POST用于给SEO Engine发布文章后调用更新Sitemap
3. `app/api/blogs/[slug]/page.tsx`, `app/api/blogs/page.tsx` 这两个文件是博客详情页和博客聚合页，里面会调用`app/api/blogs/route.ts`的GET请求来获取具体的博客文章信息



## Archive 

Oct 7 
3. Find leads 
4. Highlight keyword


Oct 8
1. linkedin , Twitter, Facebook search
2. Lead search logic update; 
3.  

Oct 13:
1. Lead table content display bolding
2. Edit keywords
3. Seach logic update
  - Get 50 leads each search
  - Update for Newest Leads