// Smart Classroom MVP. Set Supabase URL + PUBLIC anon/publishable key to enable real online accounts.
// NEVER place the Supabase service_role secret in frontend code.
const SUPABASE_URL = "https://pbwvtwaywnnnewvnisch.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_H_Ch7JJhBI2UC7bBkODRHQ_iIKzWHrA";
const ONLINE_READY = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_") && !!window.supabase;
const $ = id => document.getElementById(id);
const DBKEY = "sc_v2_data", QUEUEKEY = "sc_v2_queue";
let client=null, currentUser=null, currentProfile=null, demo=false;
const blankData=()=>({students:[],lessons:[],attendance:[],assignments:[],submissions:[],quizzes:[],grades:[]});
let data=loadData();
function loadData(){try{return {...blankData(),...JSON.parse(localStorage.getItem(DBKEY)||"{}")}}catch{return blankData()}}
function persist(){localStorage.setItem(DBKEY,JSON.stringify(data));render()}
function queue(){try{return JSON.parse(localStorage.getItem(QUEUEKEY)||"[]")}catch{return []}}
function saveQueue(q){localStorage.setItem(QUEUEKEY,JSON.stringify(q))}
function uid(){return (crypto?.randomUUID?.()||("local-"+Date.now()+"-"+Math.random().toString(36).slice(2)))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const D={
fa:{appName:"کلاس هوشمند",appSub:"مدیریت آموزش کامپیوتر پایه اول تا ششم",setupTitle:"اتصال آنلاین هنوز تنظیم نشده",setupBody:"برای حساب واقعی و همگام‌سازی اینترنتی، تنظیمات Supabase را طبق راهنمای همراه فایل انجام بده. حالت محلی همین حالا قابل آزمایش است.",signIn:"ورود به سامانه",signInHelp:"برای ورود آنلاین از حسابی که در سرور ساخته شده استفاده کن.",email:"ایمیل",password:"رمز عبور",signInBtn:"ورود",demoTitle:"ورود آزمایشی بدون اینترنت",demoDesc:"حالت آزمایشی برای بررسی امکانات روی همین دستگاه است و جایگزین حساب آنلاین امن نیست.",demoTeacher:"ورود آزمایشی مدرس",demoStudent:"ورود آزمایشی دانش‌آموز",sync:"همگام‌سازی",logout:"خروج",students:"دانش‌آموزان",lessons:"درس‌ها",assignments:"تکالیف",pending:"در انتظار همگام‌سازی",home:"خانه",studentsPage:"دانش‌آموزان",attendance:"حضور و غیاب",quizzes:"آزمون و نمرات",backup:"پشتیبان‌گیری",quickActions:"دسترسی سریع",homeIntro:"از منو برای مدیریت کلاس و مشاهده محتوای آموزشی استفاده کن.",offlineHeading:"استفاده آفلاین",offlineText:"اطلاعات این دستگاه در حافظه مرورگر ذخیره می‌شود. برای جلوگیری از ازدست‌رفتن اطلاعات، مرتب پشتیبان بگیر. همگام‌سازی آنلاین فقط پس از تنظیم سرور فعال می‌شود.",latestLessons:"آخرین درس‌ها",addStudent:"افزودن دانش‌آموز",fullName:"نام و نام خانوادگی",grade:"پایه تحصیلی",studentEmail:"ایمیل ورود دانش‌آموز",tempPassword:"رمز موقت (حداقل ۸ نویسه)",createAccount:"ساخت حساب آنلاین",accountNote:"در حالت آزمایشی، فقط کارت دانش‌آموز روی همین دستگاه ساخته می‌شود. ساخت حساب واقعی نیازمند تابع سرور است.",studentRoster:"فهرست دانش‌آموزان",newLesson:"درس جدید",title:"عنوان",content:"متن درس",link:"لینک فایل/ویدئو (اختیاری)",saveLesson:"ذخیره درس",lessonLibrary:"کتابخانه درس‌ها",markAttendance:"ثبت حضور و غیاب",student:"دانش‌آموز",date:"تاریخ",status:"وضعیت",save:"ثبت",attendanceRecords:"سوابق حضور و غیاب",newAssignment:"تعریف تکلیف",deadline:"مهلت انجام",instructions:"توضیحات تکلیف",saveAssignment:"ذخیره تکلیف",assignmentList:"فهرست تکالیف",submitWork:"ارسال پاسخ تکلیف",chooseAssignment:"انتخاب تکلیف",answer:"پاسخ دانش‌آموز",sendAnswer:"ذخیره پاسخ",mySubmissions:"پاسخ‌های من",reviewSubmissions:"بررسی پاسخ‌ها",createQuiz:"ساخت آزمون ساده",question:"سؤال",options:"گزینه‌ها (هر گزینه در یک خط)",correct:"شماره گزینه صحیح (از 1 شروع می‌شود)",publishQuiz:"انتشار آزمون",quizList:"آزمون‌ها",gradebook:"دفتر نمرات",backupTitle:"پشتیبان‌گیری",backupBody:"از اطلاعات این دستگاه فایل JSON بگیر و در جای امن نگه دار.",downloadBackup:"دانلود پشتیبان",print:"چاپ",chooseBackup:"انتخاب فایل پشتیبان",restore:"بازیابی",dataSafety:"امنیت اطلاعات",safetyBody:"اطلاعات آموزشی دانش‌آموزان خصوصی است. رمزهای عبور را در فایل پشتیبان ذخیره نکن. نسخه آزمایشی محلی رمزگذاری‌شده نیست.",clearLocal:"پاک‌کردن داده‌های محلی",footerNote:"نسخه اولیه قابل توسعه",teacher:"مدرس",studentRole:"دانش‌آموز",present:"حاضر",absent:"غایب",late:"با تأخیر",allGrades:"همه پایه‌ها",delete:"حذف",noStudents:"دانش‌آموزی ثبت نشده است.",noLessons:"درسی ثبت نشده است.",noAssignments:"تکلیفی ثبت نشده است.",noAttendance:"سابقه‌ای ثبت نشده است.",noQuizzes:"آزمونی ثبت نشده است.",noSubmissions:"پاسخی ثبت نشده است.",noGrades:"هنوز نمره‌ای ثبت نشده است.",savedLocal:"روی همین دستگاه ذخیره شد. برای حفظ اطلاعات پشتیبان بگیر.",savedOnline:"ذخیره شد.",needsSetup:"اتصال آنلاین تنظیم نشده است. راهنمای SETUP-FA را ببین.",loginFailed:"ورود ناموفق بود؛ ایمیل و رمز عبور را بررسی کن.",badBackup:"فایل پشتیبان معتبر نیست.",confirmRestore:"اطلاعات فعلی با فایل پشتیبان جایگزین شود؟",restored:"بازیابی انجام شد.",confirmClear:"همه داده‌های محلی پاک شوند؟",cleared:"داده‌های محلی پاک شد.",deleteConfirm:"این مورد حذف شود؟",created:"حساب/رکورد ایجاد شد.",quizSaved:"آزمون ذخیره شد.",answerSaved:"پاسخ ذخیره شد.",gradeSaved:"نمره ثبت شد.",syncDone:"همگام‌سازی تمام شد.",syncFailed:"همگام‌سازی کامل نشد. اتصال و تنظیمات را بررسی کن.",noPermission:"اجازه انجام این کار را نداری.",gradeLabel:"پایه",takeQuiz:"شرکت در آزمون",submitQuiz:"ثبت پاسخ",correctAnswer:"پاسخ صحیح",score:"نمره",review:"ثبت نمره",studentAnswer:"پاسخ",mark:"نمره از ۱۰۰",saveMark:"ثبت نمره",openLink:"باز کردن منبع",gradeStudent:"دانش‌آموز",accountHint:"برای حساب آنلاین دانش‌آموز، مدرس باید سرور را تنظیم و تابع امن را منتشر کند."},
en:{appName:"Smart Classroom",appSub:"Computer learning management · Grades 1–6",setupTitle:"Online access is not configured",setupBody:"Configure Supabase using the included guide for real accounts and online sync. Local demo mode can be tried now.",signIn:"Sign in",signInHelp:"Use an account created on the server.",email:"Email",password:"Password",signInBtn:"Sign in",demoTitle:"Offline demo sign-in",demoDesc:"Demo mode is for trying the interface on this device; it is not a secure online account.",demoTeacher:"Demo teacher",demoStudent:"Demo student",sync:"Sync",logout:"Log out",students:"Students",lessons:"Lessons",assignments:"Assignments",pending:"Pending sync",home:"Home",studentsPage:"Students",attendance:"Attendance",quizzes:"Quizzes & grades",backup:"Backup",quickActions:"Quick access",homeIntro:"Use the menu to manage classes and view learning materials.",offlineHeading:"Offline use",offlineText:"Data is saved in this browser. Export backups regularly. Online sync is available only after server setup.",latestLessons:"Latest lessons",addStudent:"Add student",fullName:"Full name",grade:"Grade",studentEmail:"Student sign-in email",tempPassword:"Temporary password (8+ characters)",createAccount:"Create online account",accountNote:"Demo mode creates a local student card only. Real accounts require the server function.",studentRoster:"Student roster",newLesson:"New lesson",title:"Title",content:"Lesson text",link:"File/video link (optional)",saveLesson:"Save lesson",lessonLibrary:"Lesson library",markAttendance:"Record attendance",student:"Student",date:"Date",status:"Status",save:"Save",attendanceRecords:"Attendance records",newAssignment:"Create assignment",deadline:"Due date",instructions:"Instructions",saveAssignment:"Save assignment",assignmentList:"Assignments",submitWork:"Submit assignment",chooseAssignment:"Choose assignment",answer:"Student answer",sendAnswer:"Save answer",mySubmissions:"My submissions",reviewSubmissions:"Review submissions",createQuiz:"Create simple quiz",question:"Question",options:"Options (one per line)",correct:"Correct option number (starts at 1)",publishQuiz:"Publish quiz",quizList:"Quizzes",gradebook:"Gradebook",backupTitle:"Backup",backupBody:"Export local data to a JSON file and keep it safe.",downloadBackup:"Download backup",print:"Print",chooseBackup:"Choose backup file",restore:"Restore",dataSafety:"Data safety",safetyBody:"Student education data is private. Never store passwords in backups. Local demo data is not encrypted.",clearLocal:"Clear local data",footerNote:"Extensible MVP",teacher:"Teacher",studentRole:"Student",present:"Present",absent:"Absent",late:"Late",allGrades:"All grades",delete:"Delete",noStudents:"No students yet.",noLessons:"No lessons yet.",noAssignments:"No assignments yet.",noAttendance:"No records yet.",noQuizzes:"No quizzes yet.",noSubmissions:"No submissions yet.",noGrades:"No grades yet.",savedLocal:"Saved on this device. Export a backup to preserve your data.",savedOnline:"Saved.",needsSetup:"Online access is not configured. See SETUP-EN.",loginFailed:"Sign-in failed; check email and password.",badBackup:"Invalid backup file.",confirmRestore:"Replace current data with this backup?",restored:"Restore complete.",confirmClear:"Delete all local data?",cleared:"Local data cleared.",deleteConfirm:"Delete this item?",created:"Record created.",quizSaved:"Quiz saved.",answerSaved:"Answer saved.",gradeSaved:"Grade saved.",syncDone:"Sync completed.",syncFailed:"Sync incomplete. Check connection and configuration.",noPermission:"You do not have permission.",gradeLabel:"Grade",takeQuiz:"Take quiz",submitQuiz:"Submit answer",correctAnswer:"Correct answer",score:"Score",review:"Grade",studentAnswer:"Answer",mark:"Score out of 100",saveMark:"Save grade",openLink:"Open resource",gradeStudent:"Student",accountHint:"For online student accounts, configure the server and deploy the secure function."}
};
const t=k=>(D[$("lang").value]||D.fa)[k]||D.fa[k]||k;
const isTeacher=()=>currentProfile?.role==="teacher";
const isStudent=()=>currentProfile?.role==="student";
function msg(id,s,bad=false){const el=$(id);if(el){el.textContent=s;el.style.color=bad?"#a83232":"#21744b"}}
function gradeName(g){const fa=["همه پایه‌ها","اول","دوم","سوم","چهارم","پنجم","ششم"];return $("lang").value==="fa"?(fa[Number(g)]||g):(Number(g)===0?"All grades":`Grade ${g}`)}
function updateConnection(){const on=navigator.onLine;const el=$("connection");el.textContent=on?($("lang").value==="fa"?"● آنلاین":"● Online"):($("lang").value==="fa"?"● آفلاین":"● Offline");el.className="pill "+(on?"online":"offline")}
function setupOnline(){if(ONLINE_READY){client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);$("setupNotice").classList.add("hidden")}else $("setupNotice").classList.remove("hidden")}
function showWorkspace(){ $("loginScreen").classList.add("hidden");$("workspace").classList.remove("hidden");
 document.querySelectorAll(".teacher-only").forEach(el=>el.classList.toggle("hidden",!isTeacher()));
 document.querySelectorAll(".student-only").forEach(el=>el.classList.toggle("hidden",!isStudent()));
 $("welcomeName").textContent=currentProfile?.display_name||currentProfile?.name||"Smart Classroom";
 $("roleLabel").textContent=t(isTeacher()?"teacher":"studentRole")+(currentProfile?.grade?(" · "+gradeName(currentProfile.grade)):"");
 render();go("home")}
function showLogin(){$("loginScreen").classList.remove("hidden");$("workspace").classList.add("hidden")}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("hidden",p.id!=="page-"+page));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.page===page))}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
function item(title,meta,body="",extra=""){return `<div class="item"><strong>${esc(title)}</strong><small>${esc(meta||"")}</small>${body?`<p>${esc(body)}</p>`:""}${extra||""}</div>`}
function delBtn(table,id){return `<div class="button-row"><button class="danger" type="button" onclick="deleteRecord('${table}','${esc(id)}')">${t("delete")}</button></div>`}
function visibleByGrade(x){return isTeacher()||Number(x.grade)===0||Number(x.grade)===Number(currentProfile?.grade)}
function render(){
 $("statStudents").textContent=data.students.length;$("statLessons").textContent=data.lessons.length;$("statAssignments").textContent=data.assignments.length;$("statPending").textContent=queue().length;
 const lessons=data.lessons.filter(visibleByGrade);
 $("homeLessons").innerHTML=lessons.slice(-4).reverse().map(x=>item(x.title,gradeName(x.grade),x.content||"")).join("")||`<div class="empty">${t("noLessons")}</div>`;
 $("studentRoster").innerHTML=data.students.map(s=>item(s.display_name||s.name,gradeName(s.grade),s.email||"",isTeacher()?delBtn("students",s.id):"")).join("")||`<div class="empty">${t("noStudents")}</div>`;
 $("lessonList").innerHTML=lessons.slice().reverse().map(l=>item(l.title,gradeName(l.grade),l.content||"",`${l.resource_url?`<p><a href="${esc(l.resource_url)}" target="_blank" rel="noopener">${t("openLink")}</a></p>`:""}${isTeacher()?delBtn("lessons",l.id):""}`)).join("")||`<div class="empty">${t("noLessons")}</div>`;
 $("attendanceStudent").innerHTML=data.students.map(s=>`<option value="${esc(s.id)}">${esc(s.display_name||s.name)}</option>`).join("");
 const ats=data.attendance.filter(a=>isTeacher()||a.student_id===currentProfile?.id);
 $("attendanceList").innerHTML=ats.slice().reverse().map(a=>item(data.students.find(s=>s.id===a.student_id)?.display_name||a.student_name||"Student",`${a.date} · ${t(a.status)}`,"",isTeacher()?delBtn("attendance",a.id):"")).join("")||`<div class="empty">${t("noAttendance")}</div>`;
 const assignments=data.assignments.filter(visibleByGrade);
 $("assignmentList").innerHTML=assignments.slice().reverse().map(a=>item(a.title,`${gradeName(a.grade)}${a.due_date?" · "+a.due_date:""}`,a.description||"",isTeacher()?delBtn("assignments",a.id):"")).join("")||`<div class="empty">${t("noAssignments")}</div>`;
 $("submissionAssignment").innerHTML=assignments.map(a=>`<option value="${esc(a.id)}">${esc(a.title)}</option>`).join("");
 const subs=data.submissions.filter(s=>isTeacher()||s.student_id===currentProfile?.id);
 $("submissionList").innerHTML=subs.slice().reverse().map(s=>item(data.assignments.find(a=>a.id===s.assignment_id)?.title||"Assignment",s.created_at?.slice(0,10)||"",s.answer+(s.mark!=null?`\n${t("score")}: ${s.mark}/100`:""))).join("")||`<div class="empty">${t("noSubmissions")}</div>`;
 $("reviewList").innerHTML=data.submissions.slice().reverse().map(s=>`<div class="item"><strong>${esc(data.students.find(x=>x.id===s.student_id)?.display_name||s.student_name||"Student")} · ${esc(data.assignments.find(a=>a.id===s.assignment_id)?.title||"Assignment")}</strong><p>${esc(s.answer)}</p><label>${t("mark")}<input id="mark-${esc(s.id)}" type="number" min="0" max="100" value="${s.mark??""}"></label><button type="button" onclick="gradeSubmission('${esc(s.id)}')">${t("saveMark")}</button></div>`).join("")||`<div class="empty">${t("noSubmissions")}</div>`;
 const quizzes=data.quizzes.filter(visibleByGrade);
 $("quizList").innerHTML=quizzes.slice().reverse().map(q=>{
  if(isTeacher())return item(q.title,gradeName(q.grade),q.question,`${(q.options||[]).map((o,i)=>`<div>${i+1}. ${esc(o)}${i+1===Number(q.correct_index)?` <span class="tag">${t("correctAnswer")}</span>`:""}</div>`).join("")}${delBtn("quizzes",q.id)}`);
  const answered=data.grades.some(g=>g.quiz_id===q.id&&g.student_id===currentProfile?.id);
  if(answered){const g=data.grades.find(g=>g.quiz_id===q.id&&g.student_id===currentProfile?.id);return item(q.title,gradeName(q.grade),q.question,`<span class="score">${t("score")}: ${g.score}/100</span>`)}
  return `<div class="item"><strong>${esc(q.title)}</strong><small>${gradeName(q.grade)}</small><p>${esc(q.question)}</p><form onsubmit="submitQuiz(event,'${esc(q.id)}')">${(q.options||[]).map((o,i)=>`<label class="option"><input type="radio" name="answer-${esc(q.id)}" value="${i+1}" required>${esc(o)}</label>`).join("")}<button class="primary" type="submit">${t("submitQuiz")}</button></form></div>`;
 }).join("")||`<div class="empty">${t("noQuizzes")}</div>`;
 const grades=data.grades.filter(g=>isTeacher()||g.student_id===currentProfile?.id);
 $("gradebook").innerHTML=grades.map(g=>item(data.students.find(s=>s.id===g.student_id)?.display_name||g.student_name||"Student",data.quizzes.find(q=>q.id===g.quiz_id)?.title||"Quiz",`${t("score")}: ${g.score}/100`)).join("")||`<div class="empty">${t("noGrades")}</div>`;
}
function enqueue(op,table,row,id){const q=queue();q.push({op,table,row,id,at:new Date().toISOString()});saveQueue(q)}
async function insertRow(table,row){if(demo||!navigator.onLine||!client){row.id=row.id||uid();row.created_at=row.created_at||new Date().toISOString();localTable(table).push(row);enqueue("insert",table,row);persist();return {local:true}}
 const {data:created,error}=await client.from(table).insert(row).select().single();if(error)return {error};localTable(table).push(created);persist();return {data:created}}
function localTable(table){const map={profiles:"students"};return data[map[table]||table]||[]}
async function syncOnline(){
 if(!client||demo||!currentUser||!navigator.onLine)return;
 try{
  // Load ordinary tables separately. Quiz answer keys are fetched only for teachers.
  const tables=["profiles","lessons","attendance","assignments","submissions","grades"];
  const results=await Promise.all(tables.map(table=>client.from(table).select("*")));
  for(let i=0;i<tables.length;i++){
   const {data:rows,error}=results[i];
   if(error){console.warn("Sync "+tables[i]+":",error.message);continue}
   const key=tables[i]==="profiles"?"students":tables[i];
   if(tables[i]==="profiles")data.students=(rows||[]).filter(x=>x.role==="student");
   else data[key]=rows||[];
  }

  // Students receive only public quiz fields; teachers use a protected RPC.
  const quizResult=isTeacher()
    ? await client.rpc("teacher_list_quizzes")
    : await client.from("quizzes").select("id,title,grade,question,options,created_by,created_at");
  if(quizResult.error){
   console.warn("Quiz sync:",quizResult.error.message);
  }else{
   data.quizzes=quizResult.data||[];
  }
  persist();
 }catch(e){console.warn(e)}
}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!client){msg("loginMsg",t("needsSetup"),true);return}
 const {data:auth,error}=await client.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});
 if(error){msg("loginMsg",error.message,true);return}
 currentUser=auth.user;const {data:p,error:pe}=await client.from("profiles").select("*").eq("id",currentUser.id).single();
 if(pe||!p){await client.auth.signOut();msg("loginMsg","Profile not found. Run the SQL setup.",true);return}
 currentProfile=p;demo=false;await syncOnline();showWorkspace();
});
$("demoTeacher").addEventListener("click",()=>{demo=true;currentUser=null;currentProfile={id:"demo-teacher",role:"teacher",display_name:"مدرس آزمایشی",grade:0};showWorkspace()});
$("demoStudent").addEventListener("click",()=>{demo=true;currentUser=null;currentProfile={id:"demo-student",role:"student",display_name:"دانش‌آموز آزمایشی",grade:1};showWorkspace()});
$("logoutBtn").addEventListener("click",async()=>{if(client&&!demo)await client.auth.signOut();currentUser=null;currentProfile=null;demo=false;showLogin()});
$("syncBtn").addEventListener("click",async()=>{await syncOnline();msg("loginMsg",client&&!demo?t("syncDone"):t("needsSetup"),!client);});
$("studentForm").addEventListener("submit",async e=>{e.preventDefault();if(!isTeacher())return;
 const student={id:uid(),display_name:$("studentName").value.trim(),name:$("studentName").value.trim(),grade:Number($("studentGrade").value),email:$("studentEmail").value.trim()};
 if(demo){data.students.push(student);persist();msg("studentMsg",t("created"));e.target.reset();return}
 if(!client||!currentUser){msg("studentMsg",t("needsSetup"),true);return}
 const {data:resp,error}=await client.functions.invoke("create-student",{body:{email:student.email,password:$("studentPassword").value,display_name:student.display_name,grade:student.grade}});
 if(error||resp?.error){msg("studentMsg",resp?.error||error.message,true);return}
 await syncOnline();msg("studentMsg",t("created"));e.target.reset();
});
$("lessonForm").addEventListener("submit",async e=>{e.preventDefault();if(!isTeacher())return;
 const row={title:$("lessonTitle").value.trim(),grade:Number($("lessonGrade").value),content:$("lessonContent").value.trim(),resource_url:$("lessonLink").value.trim()||null,created_by:currentUser?.id||null};
 const r=await insertRow("lessons",row);if(r.error){msg("lessonMsg",r.error.message,true);return}msg("lessonMsg",r.local?t("savedLocal"):t("savedOnline"));e.target.reset()});
$("assignmentForm").addEventListener("submit",async e=>{e.preventDefault();if(!isTeacher())return;
 const row={title:$("assignmentTitle").value.trim(),grade:Number($("assignmentGrade").value),due_date:$("assignmentDue").value||null,description:$("assignmentDescription").value.trim(),created_by:currentUser?.id||null};
 const r=await insertRow("assignments",row);if(r.error){msg("assignmentMsg",r.error.message,true);return}msg("assignmentMsg",r.local?t("savedLocal"):t("savedOnline"));e.target.reset()});
$("attendanceDate").value=new Date().toISOString().slice(0,10);
$("attendanceForm").addEventListener("submit",async e=>{e.preventDefault();if(!isTeacher())return;const sid=$("attendanceStudent").value;if(!sid){msg("attendanceMsg",t("noStudents"),true);return}
 const row={id:uid(),student_id:sid,date:$("attendanceDate").value,status:$("attendanceStatus").value,created_by:currentUser?.id||null};
 const r=await insertRow("attendance",row);if(r.error){msg("attendanceMsg",r.error.message,true);return}msg("attendanceMsg",r.local?t("savedLocal"):t("savedOnline"));e.target.reset();$("attendanceDate").value=new Date().toISOString().slice(0,10)});
$("submissionForm").addEventListener("submit",async e=>{e.preventDefault();if(!isStudent())return;const row={id:uid(),assignment_id:$("submissionAssignment").value,student_id:currentProfile.id,answer:$("submissionText").value.trim(),created_at:new Date().toISOString(),mark:null};if(!row.assignment_id){msg("submissionMsg",t("noAssignments"),true);return}
 const r=await insertRow("submissions",row);if(r.error){msg("submissionMsg",r.error.message,true);return}msg("submissionMsg",r.local?t("savedLocal"):t("answerSaved"));e.target.reset()});
$("quizForm").addEventListener("submit",async e=>{e.preventDefault();if(!isTeacher())return;const opts=$("quizOptions").value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean),correct=Number($("quizCorrect").value);if(opts.length<2||correct<1||correct>opts.length){msg("quizMsg","گزینه‌ها یا شماره پاسخ صحیح معتبر نیست.",true);return}
 const row={id:uid(),title:$("quizTitle").value.trim(),grade:Number($("quizGrade").value),question:$("quizQuestion").value.trim(),options:opts,correct_index:correct,created_by:currentUser?.id||null};
 const r=await insertRow("quizzes",row);if(r.error){msg("quizMsg",r.error.message,true);return}msg("quizMsg",r.local?t("savedLocal"):t("quizSaved"));e.target.reset()});
window.submitQuiz=async(event,id)=>{
 event.preventDefault();
 if(!isStudent())return;
 const q=data.quizzes.find(x=>x.id===id);
 if(!q)return;
 const selected=Number(new FormData(event.target).get("answer-"+id));
 if(!selected)return;

 // Demo mode is local-only; secure online grading is performed by the server.
 if(demo||!navigator.onLine||!client){
  if(!demo&&!navigator.onLine){
   alert("برای ثبت امن آزمون باید به اینترنت وصل شوید. در این نسخه پاسخ آفلاین ثبت نمی‌شود.");
   return;
  }
  const score=selected===Number(q.correct_index)?100:0;
  data.grades.push({
   id:uid(),quiz_id:id,student_id:currentProfile.id,
   selected_index:selected,score,created_at:new Date().toISOString()
  });
  persist();
  return;
 }

 const {data:score,error}=await client.rpc("submit_quiz_answer",{
  p_quiz_id:id,
  p_selected_index:selected
 });
 if(error){alert(error.message);return}
 data.grades.push({
  id:uid(),quiz_id:id,student_id:currentProfile.id,
  selected_index:selected,score:Number(score),
  created_at:new Date().toISOString()
 });
 render();
};
window.gradeSubmission=async id=>{if(!isTeacher())return;const sub=data.submissions.find(x=>x.id===id);const score=Number($("mark-"+id).value);if(!sub||!Number.isFinite(score)||score<0||score>100){alert("Enter a score from 0 to 100");return}sub.mark=score;persist();if(client&&!demo&&navigator.onLine){const {error}=await client.from("submissions").update({mark:score}).eq("id",id);if(error)alert(error.message)}};
window.deleteRecord=async(table,id)=>{if(!isTeacher()||!confirm(t("deleteConfirm")))return;const key=table==="profiles"?"students":table;data[key]=(data[key]||[]).filter(x=>x.id!==id);if(demo||!client||!navigator.onLine){enqueue("delete",table,{id},id);persist();return}
 const {error}=await client.from(table).delete().eq("id",id);if(error)alert(error.message);else await syncOnline()};
$("exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({app:"Smart Classroom",version:2,exported_at:new Date().toISOString(),data},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="smart-classroom-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$("restoreBtn").addEventListener("click",async()=>{const f=$("backupFile").files[0];if(!f)return;try{const parsed=JSON.parse(await f.text()),d=parsed.data||parsed;if(!["students","lessons","attendance","assignments","submissions","quizzes","grades"].every(k=>Array.isArray(d[k])))throw Error();if(confirm(t("confirmRestore"))){data=d;persist();alert(t("restored"))}}catch{alert(t("badBackup"))}});
$("clearBtn").addEventListener("click",()=>{if(confirm(t("confirmClear"))){data=blankData();localStorage.removeItem(QUEUEKEY);persist();alert(t("cleared"))}});
$("printBtn").addEventListener("click",()=>window.print());
function applyLanguage(){const lang=$("lang").value;document.documentElement.lang=lang;document.documentElement.dir=lang==="fa"?"rtl":"ltr";document.querySelectorAll("[data-t]").forEach(el=>el.textContent=t(el.dataset.t));updateConnection();render()}
$("lang").addEventListener("change",applyLanguage);window.addEventListener("online",()=>{updateConnection();syncOnline()});window.addEventListener("offline",updateConnection);
setupOnline();applyLanguage();updateConnection();
if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
if(client){client.auth.getSession().then(async({data:session})=>{if(session.session){currentUser=session.session.user;const {data:p}=await client.from("profiles").select("*").eq("id",currentUser.id).single();if(p){currentProfile=p;await syncOnline();showWorkspace()}}})}
