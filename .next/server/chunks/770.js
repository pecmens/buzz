"use strict";exports.id=770,exports.ids=[770],exports.modules={7770:(e,t,s)=>{s.d(t,{Jq:()=>getPosts,OQ:()=>o,xl:()=>getPost});var r=s(6897);let a="https://ymvoqlvupcdhazkebrtm.supabase.co",i="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdm9xbHZ1cGNkaGF6a2VicnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDMxNDYsImV4cCI6MjA3NzQxOTE0Nn0.6fh3AsTXqLK9BZ8aVIT0lKf51nCfiKNDtXqAVNMUSuk";if(!a||!i)throw Error("Missing Supabase environment variables");let o=(0,r.eI)(a,i,{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0},realtime:{params:{eventsPerSecond:10}}});async function getPosts(){try{let{data:e,error:t}=await o.from("posts").select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        created_at,
        updated_at,
        published_at,
        view_count,
        status,
        users(username),
        categories(name)
      `).eq("status","published").order("created_at",{ascending:!1});if(t)throw t;return e.map(e=>({...e,author:e.users?.username||"匿名",category:e.categories?.name,readTime:"5 分钟"}))}catch(e){return console.error("Error fetching posts:",e),[]}}async function getPost(e){try{let{data:t,error:s}=await o.from("posts").select(`
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image_url,
        created_at,
        updated_at,
        published_at,
        view_count,
        status,
        users(username),
        categories(name)
      `).eq("slug",e).eq("status","published").single();if(s)throw s;return{...t,author:t.users?.username||"匿名",category:t.categories?.name,readTime:"5 分钟"}}catch(e){return console.error("Error fetching post:",e),null}}}};