import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
Deno.serve(async req=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 if(req.method!=="POST") return reply({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"), service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), anon=Deno.env.get("SUPABASE_ANON_KEY");
 if(!url||!service||!anon) return reply({error:"Server function secrets are missing"},500);
 const auth=req.headers.get("Authorization"); if(!auth)return reply({error:"Missing authorization"},401);
 const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
 const {data:{user},error:authErr}=await userClient.auth.getUser();
 if(authErr||!user)return reply({error:"Invalid session"},401);
 const admin=createClient(url,service);
 const {data:caller,error:callerErr}=await admin.from("profiles").select("role").eq("id",user.id).single();
 if(callerErr||caller?.role!=="teacher")return reply({error:"Teacher access required"},403);
 let body:any;try{body=await req.json()}catch{return reply({error:"Invalid JSON"},400)}
 const email=String(body.email||"").trim().toLowerCase(),password=String(body.password||""),name=String(body.display_name||"").trim(),grade=Number(body.grade);
 if(!email.includes("@")||password.length<8||!name||!Number.isInteger(grade)||grade<1||grade>6)return reply({error:"Valid email, name, password (8+ chars), and grade 1–6 are required"},400);
 const {data:created,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:name,grade}});
 if(error)return reply({error:error.message},400);
 const {error:profileErr}=await admin.from("profiles").upsert({id:created.user.id,email,display_name:name,grade,role:"student"});
 if(profileErr){await admin.auth.admin.deleteUser(created.user.id);return reply({error:"Profile setup failed"},500)}
 return reply({ok:true,id:created.user.id,email});
});