"use strict";(()=>{var e={};e.id=45,e.ids=[45],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1619:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>c,originalPathname:()=>m,requestAsyncStorage:()=>p,routeModule:()=>n,serverHooks:()=>u,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>d});var o={};a.r(o),a.d(o,{GET:()=>GET});var r=a(884),i=a(6132),s=a(5798);async function GET(){let e=process.env.NEXT_PUBLIC_SITE_URL||"https://buzz-blog.vercel.app",t=`User-agent: *
Allow: /

# 禁止爬取管理页面
Disallow: /admin/
Disallow: /auth/

# 禁止爬取API路由
Disallow: /api/

# 允许爬取搜索页面
Allow: /search

# Sitemap
Sitemap: ${e}/sitemap.xml

# 爬取延迟
Crawl-delay: 1`;return new s.Z(t,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let n=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/robots/route",pathname:"/api/robots",filename:"route",bundlePath:"app/api/robots/route"},resolvedPagePath:"/home/pecmen/git/github/pecmens/buzz/app/api/robots/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:l,serverHooks:u,headerHooks:c,staticGenerationBailout:d}=n,m="/api/robots/route"}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[997],()=>__webpack_exec__(1619));module.exports=a})();