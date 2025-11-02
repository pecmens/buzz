"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},5477:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},7310:e=>{e.exports=require("url")},9796:e=>{e.exports=require("zlib")},9099:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>d,originalPathname:()=>g,requestAsyncStorage:()=>p,routeModule:()=>n,serverHooks:()=>c,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>m});var a={};r.r(a),r.d(a,{GET:()=>GET});var o=r(884),s=r(6132),i=r(5798),l=r(7770);async function GET(){try{let e=process.env.NEXT_PUBLIC_SITE_URL||"https://buzz-blog.vercel.app",{data:t}=await l.OQ.from("posts").select("slug, updated_at, created_at").eq("status","published").order("updated_at",{ascending:!1}),{data:r}=await l.OQ.from("categories").select("slug, created_at"),{data:a}=await l.OQ.from("tags").select("slug, created_at"),o=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${e}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 搜索页面 -->
  <url>
    <loc>${e}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 文章页面 -->
  ${t?.map(t=>`
  <url>
    <loc>${e}/posts/${t.slug}</loc>
    <lastmod>${new Date(t.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join("")||""}

  <!-- 分类页面 -->
  ${r?.map(t=>`
  <url>
    <loc>${e}/categories/${t.slug}</loc>
    <lastmod>${new Date(t.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")||""}

  <!-- 标签页面 -->
  ${a?.map(t=>`
  <url>
    <loc>${e}/tags/${t.slug}</loc>
    <lastmod>${new Date(t.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")||""}
</urlset>`;return new i.Z(o,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(e){return console.error("生成sitemap失败:",e),new i.Z("Internal Server Error",{status:500})}}let n=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/home/pecmen/git/github/pecmens/buzz/app/api/sitemap/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:c,headerHooks:d,staticGenerationBailout:m}=n,g="/api/sitemap/route"}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[897,997,770],()=>__webpack_exec__(9099));module.exports=r})();