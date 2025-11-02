"use strict";exports.id=934,exports.ids=[934],exports.modules={6934:(e,t,s)=>{s.d(t,{CP:()=>updatePost,GD:()=>generateSlug,Jq:()=>batchUpdatePostStatus,a7:()=>getAdminPosts,fR:()=>deletePost,qb:()=>createPost});var r=s(9708);async function getAdminPosts(e=1,t=10,s,a){try{let o=r.OQ.from("posts").select(`
        id,
        title,
        slug,
        excerpt,
        status,
        view_count,
        created_at,
        updated_at,
        published_at,
        users(username),
        categories(name)
      `,{count:"exact"}).order("created_at",{ascending:!1});s&&"all"!==s&&(o=o.eq("status",s)),a&&(o=o.or(`title.ilike.%${a}%,content.ilike.%${a}%`));let c=(e-1)*t,n=c+t-1;o=o.range(c,n);let{data:u,count:i,error:l}=await o;if(l)return console.error("获取文章列表失败:",l),{posts:[],total:0};let d=u.map(e=>({...e,author:e.users?.username||"匿名",category:e.categories?.name||"未分类"}));return{posts:d,total:i||0}}catch(e){return console.error("获取文章列表失败:",e),{posts:[],total:0}}}async function createPost(e){try{let t=new Date().toISOString(),{data:s,error:a}=await r.OQ.from("posts").insert([{...e,created_at:t,updated_at:t,published_at:"published"===e.status?t:null}]).select(`
        *,
        users(username),
        categories(name)
      `).single();if(a)return console.error("创建文章失败:",a),{success:!1,error:a.message};let o={...s,author:s.users?.username||"匿名",category:s.categories?.name||"未分类"};return{success:!0,post:o}}catch(e){return console.error("创建文章失败:",e),{success:!1,error:e.message}}}async function updatePost(e,t){try{let s={...t,updated_at:new Date().toISOString()};"published"!==t.status||t.published_at||(s.published_at=new Date().toISOString());let{data:a,error:o}=await r.OQ.from("posts").update(s).eq("id",e).select(`
        *,
        users(username),
        categories(name)
      `).single();if(o)return console.error("更新文章失败:",o),{success:!1,error:o.message};let c={...a,author:a.users?.username||"匿名",category:a.categories?.name||"未分类"};return{success:!0,post:c}}catch(e){return console.error("更新文章失败:",e),{success:!1,error:e.message}}}async function deletePost(e){try{let{error:t}=await r.OQ.from("posts").delete().eq("id",e);if(t)return console.error("删除文章失败:",t),{success:!1,error:t.message};return{success:!0}}catch(e){return console.error("删除文章失败:",e),{success:!1,error:e.message}}}async function batchUpdatePostStatus(e,t){try{let s={status:t,updated_at:new Date().toISOString()};"published"===t&&(s.published_at=new Date().toISOString());let{error:a}=await r.OQ.from("posts").update(s).in("id",e);if(a)return console.error("批量更新文章状态失败:",a),{success:!1,error:a.message};return{success:!0}}catch(e){return console.error("批量更新文章状态失败:",e),{success:!1,error:e.message}}}function generateSlug(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}}};