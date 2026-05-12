import { useState, useRef, useEffect } from "react";

// ── PERSISTENT STORAGE HELPERS ────────────────────────
async function storageLoad(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}
async function storageSave(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}

// ── PALETTE ──────────────────────────────────────────
const C = {
  navy:"#07111F", navyMid:"#0D1E35", navyLt:"#132844",
  gold:"#C9A84C", goldLt:"#E5C96A", goldDk:"#8C6E28",
  cream:"#FAF6EE", white:"#FFFFFF", amber:"#D4845A",
  green:"#2A6E49", red:"#C0392B", muted:"#7A8899",
  border:"rgba(201,168,76,0.18)", kakao:"#FEE500",
};

// ── i18n ─────────────────────────────────────────────
const T = {
  en:{
    appName:"Agape Family Christian Church",
    appSub:"Jakin & Boaz Education Mission Center",
    vision:"MATURE FAITH, BETTER LIFE",
    verse:"But grow in the grace and knowledge of our Lord and Savior Jesus Christ. — 2 Peter 3:18",
    tabs:["Home","Mission","Gallery","Notice","Support","About"],
    tabIcons:["🏠","🌍","📷","📢","🙏","✝️"],
    heroTitle:"Going to\nAll Nations",
    heroBtn1:"Support Now",
    heroBtn2:"About Us",
    statLabels:["Mission Countries","Missionaries","Monthly Donors"],
    upcomingEvents:"Upcoming Events",
    seeAll:"See all",
    featuredMission:"Featured Mission",
    recentPhotos:"Recent Photos",
    activeMissions:"Active Missions",
    goal:"Goal",
    supporters:"supporters",
    supportBtn:"Support",
    donateTitle:"Mission Support",
    donateSubFn:(name)=>`Supporting: ${name}`,
    customAmt:"Custom amount (₩)",
    payMethods:["Bank Transfer","KakaoTalk"],
    donateSubmitFn:(amt)=>`Confirm ₩${amt}`,
    toastMsg:"🙏 Thank you! God bless you abundantly!",
    bankInfo:"Hana Bank (하나은행)\nAccount Holder: Kim Sung Nyun (김성년)\nAccount No: 132-891505-76807",
    bankNote:"* After transfer, please send your name & purpose via KakaoTalk",
    noticeTitle:"Announcements",
    noticeEmpty:"No announcements yet.",
    addNotice:"+ Add Notice",
    noticeForm:{title:"Title",body:"Content",submit:"Post",cancel:"Cancel"},
    galleryTitle:"Photo Gallery",
    galleryHint:"Tap an album to view photos",
    uploadBtn:"📷 Upload Photos",
    uploadHint:"Tap to select photos from your device",
    uploadDone:"Photos uploaded!",
    shareKakao:"Share on KakaoTalk",
    shareMsg:"Sharing via KakaoTalk",
    aboutTitle:"About the Church",
    schedule:"Worship Schedule",
    leadership:"Church Leadership",
    contact:"Contact",
    address:"Address",
    phone:"Phone",
    academy:"Timothy Academy",
    worshipSchedule:[
      {label:"General Worship Service", time:"Sunday, 9:30 am"},
      {label:"Prayer Meeting",          time:"Friday, 7:00–8:00 pm"},
      {label:"Youth Fellowship",        time:"Every 2nd & 4th Saturday 7:00–8:00 pm"},
      {label:"Timothy Academy",         time:"Tue 8–10 am · Thu/Sat 1:30–4:00 pm"},
    ],
    gcashNote:"Real GCash payments require GCash merchant account integration (available when app is live).",
  },
  ko:{
    appName:"아가페 패밀리 크리스챤 교회",
    appSub:"야긴보아즈 교육선교센터",
    vision:"성숙한 믿음, 더 나은 삶",
    verse:"오직 우리 주 곧 구주 예수 그리스도의 은혜와 그를 아는 지식에서 자라 가라 — 베드로후서 3:18",
    tabs:["홈","선교","갤러리","공지","후원","소개"],
    tabIcons:["🏠","🌍","📷","📢","🙏","✝️"],
    heroTitle:"열방을 향해\n나아가는 교회",
    heroBtn1:"후원하기",
    heroBtn2:"교회소개",
    statLabels:["선교 국가","파송 선교사","월 후원자"],
    upcomingEvents:"다가오는 일정",
    seeAll:"전체보기",
    featuredMission:"긴급 선교 후원",
    recentPhotos:"최근 사진",
    activeMissions:"진행 중인 선교",
    goal:"목표",
    supporters:"명 후원 중",
    supportBtn:"후원하기",
    donateTitle:"선교 후원",
    donateSubFn:(name)=>`후원 선교: ${name}`,
    customAmt:"직접 입력 (₱)",
    payMethods:["계좌이체","카카오톡 문의"],
    donateSubmitFn:(amt)=>`₩${amt} 후원하기`,
    toastMsg:"🙏 감사합니다! 하나님께서 풍성히 갚아 주실 것입니다!",
    bankInfo:"하나은행\n예금주: 김성년\n계좌번호: 132-891505-76807",
    bankNote:"* 입금 후 카카오톡으로 성함과 후원 목적을 알려주시면 감사합니다",
    noticeTitle:"공지사항",
    noticeEmpty:"등록된 공지사항이 없습니다.",
    addNotice:"+ 공지 등록",
    noticeForm:{title:"제목",body:"내용",submit:"등록",cancel:"취소"},
    galleryTitle:"사진 갤러리",
    galleryHint:"앨범을 탭하면 사진을 볼 수 있습니다",
    uploadBtn:"📷 사진 업로드",
    uploadHint:"기기에서 사진을 선택하세요",
    uploadDone:"사진이 업로드되었습니다!",
    shareKakao:"카카오톡으로 공유",
    shareMsg:"카카오톡으로 공유합니다",
    aboutTitle:"교회 소개",
    schedule:"예배 시간",
    leadership:"교역자 소개",
    contact:"연락처",
    address:"주소",
    phone:"전화",
    academy:"티모시 아카데미",
    worshipSchedule:[
      {label:"주일 예배",    time:"일요일 오전 9:30"},
      {label:"금요 기도회",  time:"금요일 오후 7:00–8:00"},
      {label:"청년 모임",    time:"매 2·4주 토요일 오후 7:00–8:00"},
      {label:"티모시 아카데미", time:"화 오전 8–10시 · 목/토 오후 1:30–4:00"},
    ],
    gcashNote:"",
  },
};

// ── DATA ─────────────────────────────────────────────
const STAFF = [
  {role:"Senior Pastor",             roleKo:"담임목사",    name:"Rev. Kim Sung Nyun"},
  {role:"Educational Pastor",        roleKo:"교육목사",    name:"Rev. Kang Sang Soo"},
  {role:"Head Pastor",               roleKo:"수석목사",    name:"Ptr. Gerome Mananzala"},
  {role:"Head, Christian Education", roleKo:"기독교교육부", name:"Ptr. Mark Joseph Frago"},
  {role:"Head, Senior Department",   roleKo:"시니어부",    name:"Ptr. Dexter Dioneda"},
  {role:"Head, Single Adult Dept.",  roleKo:"싱글어덜트부",name:"Ptr. Mclarry De Guzman"},
  {role:"Head, Youth Department",    roleKo:"청년부",      name:"Ptr. Alexander Bien Jr."},
  {role:"Head, Music Team",          roleKo:"음악팀",      name:"Ptr. Raymon Espuerta"},
];

const MISSIONS = [
  {id:1,flag:"🇵🇭",country:"Philippines",area:"San Mateo, Rizal",
   name:"Jakin & Boaz Education Mission",nameKo:"야긴보아즈 교육선교",
   desc:"Timothy Academy empowers children with faith, knowledge, and life skills — building the next generation of Christian leaders in Banaba.",
   descKo:"티모시 아카데미를 통해 바나바 지역 아이들에게 믿음, 지식, 삶의 기술을 가르치며 다음 세대 크리스천 리더를 세웁니다.",
   raised:385000,goal:500000,donors:127,
   tag:"Education",tagKo:"교육선교"},
  {id:2,flag:"🇵🇭",country:"Philippines",area:"San Mateo, Rizal",
   name:"Medical & Gospel Mission",nameKo:"의료 및 복음 선교",
   desc:"Free medical missions bring healing and the Good News to underprivileged communities in Rizal province — caring for body and soul.",
   descKo:"리잘 지역 소외된 이웃들에게 무료 의료 서비스와 복음을 전하며 몸과 영혼을 함께 돌봅니다.",
   raised:210000,goal:400000,donors:84,
   tag:"Medical",tagKo:"의료선교"},
  {id:3,flag:"🇵🇭",country:"Philippines",area:"San Mateo, Rizal",
   name:"Scholarship Mission",nameKo:"장학금 선교",
   desc:"Supporting deserving students with scholarships so that financial hardship never stands between a child and their God-given potential.",
   descKo:"경제적 어려움으로 학업을 포기하지 않도록 장학금을 지원하여 하나님이 주신 가능성을 꽃피울 수 있게 돕습니다.",
   raised:98000,goal:300000,donors:56,
   tag:"Scholarship",tagKo:"장학금"},
];

const EVENTS = [
  {month:"MAY",day:"18",tag:"Sunday Service",tagKo:"주일예배",   title:"Mission Sunday Special Worship",titleKo:"선교주일 특별예배",     time:"9:30 AM",loc:"Main Sanctuary"},
  {month:"MAY",day:"23",tag:"Prayer",        tagKo:"기도회",     title:"Friday Night Prayer",           titleKo:"금요 기도회",            time:"7:00 PM",loc:"Prayer Room"},
  {month:"MAY",day:"24",tag:"Youth",         tagKo:"청년부",     title:"Youth Fellowship & Praise",     titleKo:"청년 예배 및 찬양",      time:"7:00 PM",loc:"Fellowship Hall"},
  {month:"JUN",day:"06",tag:"Academy",       tagKo:"아카데미",   title:"Children's Day Celebration",    titleKo:"어린이날 행사",          time:"8:00 AM",loc:"Education Center"},
  {month:"JUN",day:"13",tag:"Seminar",       tagKo:"세미나",     title:"Mission Business Seminar",      titleKo:"선교 비즈니스 세미나",   time:"2:00 PM",loc:"Room 301"},
];

const ALBUMS_INIT = [
  {id:1,title:"Sunday Worship",titleKo:"주일 예배",date:"May 11, 2026",
   cover:"https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&q=80",
   photos:[
     {url:"https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&q=80",cap:"Sunday Morning Worship"},
     {url:"https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80",cap:"Praise & Worship Team"},
     {url:"https://images.unsplash.com/photo-1548625361-58a9b86aa83b?w=600&q=80",cap:"Congregation in Prayer"},
     {url:"https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=600&q=80",cap:"Holy Communion"},
   ]},
  {id:2,title:"Timothy Academy",titleKo:"티모시 아카데미",date:"May 8, 2026",
   cover:"https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80",
   photos:[
     {url:"https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",cap:"Bible Class"},
     {url:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",cap:"Children Learning"},
     {url:"https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",cap:"Afternoon Session"},
   ]},
  {id:3,title:"Youth Fellowship",titleKo:"청년 모임",date:"Apr 26, 2026",
   cover:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
   photos:[
     {url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",cap:"Youth Night"},
     {url:"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",cap:"Praise Night"},
   ]},
  {id:4,title:"Mission Outreach",titleKo:"선교 아웃리치",date:"Apr 19, 2026",
   cover:"https://images.unsplash.com/photo-1596478558591-d25f4b29c745?w=400&q=80",
   photos:[
     {url:"https://images.unsplash.com/photo-1596478558591-d25f4b29c745?w=600&q=80",cap:"Community Outreach"},
     {url:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",cap:"Feeding Program"},
     {url:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",cap:"Supply Distribution"},
   ]},
];

const NOTICES_INIT = [
  {id:1,date:"May 11, 2026",titleEn:"Mission Sunday — Special Offering",titleKo:"선교주일 특별 헌금",
   bodyEn:"This Sunday we will receive a special offering for our Philippines mission. Please pray and give generously.",
   bodyKo:"이번 주일에는 필리핀 선교를 위한 특별 헌금을 드립니다. 기도하며 넉넉히 드려 주세요."},
  {id:2,date:"May 8, 2026",titleEn:"Timothy Academy — New Enrollment Open",titleKo:"티모시 아카데미 신입생 모집",
   bodyEn:"Timothy Academy is now accepting new students for the June session. Contact the church office for details.",
   bodyKo:"6월 학기 티모시 아카데미 신입생을 모집합니다. 교회 사무실로 문의해 주세요."},
  {id:3,date:"May 1, 2026",titleEn:"Mission Business Seminar — June 13",titleKo:"선교 비즈니스 세미나 — 6월 13일",
   bodyEn:"Join us for a seminar on mission-integrated business strategies. Open to all members.",
   bodyKo:"선교와 비즈니스를 통합한 전략 세미나에 참여하세요. 모든 성도 대상입니다."},
];

// ── STYLES ───────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Noto Sans KR',sans-serif;background:${C.navy};color:${C.cream};overflow-x:hidden;}
.shell{max-width:430px;margin:0 auto;min-height:100vh;background:${C.navy};display:flex;flex-direction:column;}

/* HEADER */
.hdr{background:${C.navyMid};padding:14px 16px 0;position:sticky;top:0;z-index:100;border-bottom:1px solid ${C.border};}
.hdr-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.brand-en{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:${C.gold};line-height:1.2;letter-spacing:.5px;}
.brand-sub{font-size:9px;color:rgba(201,168,76,.6);margin-top:1px;}
.hdr-right{display:flex;align-items:center;gap:8px;}
.lang-toggle{display:flex;background:rgba(255,255,255,.06);border-radius:20px;overflow:hidden;border:1px solid ${C.border};}
.lang-btn{padding:5px 11px;border:none;background:none;font-size:11px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;color:${C.muted};transition:all .15s;}
.lang-btn.on{background:${C.gold};color:${C.navy};font-weight:700;}
.cross-ic{width:34px;height:34px;border-radius:50%;border:1.5px solid ${C.gold};display:flex;align-items:center;justify-content:center;background:rgba(201,168,76,.08);}
.tabs{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex:0 0 auto;padding:8px 13px;background:none;border:none;border-bottom:2px solid transparent;color:${C.muted};font-size:11px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;display:flex;flex-direction:column;align-items:center;gap:2px;transition:all .2s;}
.tab.on{color:${C.gold};border-bottom-color:${C.gold};}
.tab-ic{font-size:16px;}

/* CONTENT */
.body{flex:1;overflow-y:auto;padding-bottom:24px;}

/* HERO */
.hero{background:linear-gradient(160deg,${C.navyLt} 0%,#152e52 55%,#0b2040 100%);padding:24px 18px 22px;position:relative;overflow:hidden;}
.hero::after{content:'';position:absolute;bottom:-50px;right:-50px;width:200px;height:200px;background:radial-gradient(circle,rgba(201,168,76,.1) 0%,transparent 65%);border-radius:50%;}
.hero-eye{font-size:10px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.hero-ttl{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:${C.white};line-height:1.25;margin-bottom:5px;white-space:pre-line;}
.hero-verse{font-size:11px;color:rgba(250,246,238,.6);font-style:italic;line-height:1.6;margin-bottom:18px;border-left:2px solid rgba(201,168,76,.35);padding-left:10px;}
.hero-btns{display:flex;gap:10px;}
.btn-g{background:linear-gradient(135deg,${C.gold},${C.goldDk});color:${C.navy};border:none;padding:11px 20px;border-radius:24px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR',sans-serif;box-shadow:0 4px 14px rgba(201,168,76,.35);transition:transform .15s;}
.btn-g:active{transform:scale(.97);}
.btn-o{background:transparent;color:${C.gold};border:1.5px solid ${C.gold};padding:11px 18px;border-radius:24px;font-size:13px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:14px 16px 0;}
.stat{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;padding:13px 8px;text-align:center;}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:${C.gold};}
.stat-l{font-size:10px;color:${C.muted};margin-top:2px;}

/* SECTION */
.sec{padding:18px 16px 0;}
.sec-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.sec-ttl{font-family:'Cormorant Garamond',serif;font-size:18px;color:${C.cream};}
.see-all{font-size:11px;color:${C.gold};cursor:pointer;}

/* MISSION CARD */
.mcard{background:${C.navyMid};border:1px solid ${C.border};border-radius:16px;padding:15px;margin-bottom:12px;position:relative;overflow:hidden;}
.mcard::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(${C.gold},${C.amber});}
.mcard-top{display:flex;gap:10px;margin-bottom:8px;}
.mflag{font-size:24px;}
.mloc{font-size:10px;color:${C.gold};letter-spacing:1.5px;text-transform:uppercase;}
.mname{font-family:'Cormorant Garamond',serif;font-size:15px;color:${C.white};}
.mdesc{font-size:11px;color:${C.muted};line-height:1.5;margin-bottom:10px;}
.pbar-lbl{display:flex;justify-content:space-between;font-size:11px;color:${C.muted};margin-bottom:4px;}
.pbar-amt{color:${C.gold};font-weight:700;}
.pbar{height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;}
.pbar-fill{height:100%;background:linear-gradient(90deg,${C.gold},${C.amber});border-radius:3px;}
.mcard-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.mdonors{font-size:11px;color:${C.muted};}
.btn-sm{background:rgba(201,168,76,.12);color:${C.gold};border:1px solid rgba(201,168,76,.4);padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Noto Sans KR',sans-serif;}

/* EVENT CARD */
.ecard{background:${C.navyMid};border:1px solid rgba(255,255,255,.05);border-radius:14px;padding:13px;display:flex;gap:12px;margin-bottom:10px;}
.ebox{min-width:42px;background:linear-gradient(135deg,${C.gold},${C.goldDk});border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:7px 4px;}
.emon{font-size:8px;font-weight:700;color:${C.navy};letter-spacing:1px;}
.eday{font-size:21px;font-weight:700;color:${C.navy};line-height:1;}
.etag{font-size:9px;color:${C.amber};letter-spacing:1px;text-transform:uppercase;margin-bottom:2px;}
.ettl{font-size:13px;font-weight:600;color:${C.white};margin-bottom:3px;}
.emeta{font-size:11px;color:${C.muted};}

/* GALLERY */
.gal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 16px;}
.alb{background:${C.navyMid};border-radius:14px;overflow:hidden;border:1px solid ${C.border};cursor:pointer;transition:transform .15s;}
.alb:active{transform:scale(.97);}
.alb-img{width:100%;aspect-ratio:4/3;object-fit:cover;}
.alb-info{padding:9px 10px 11px;}
.alb-ttl{font-size:12px;font-weight:600;color:${C.cream};margin-bottom:2px;}
.alb-meta{font-size:10px;color:${C.muted};}
.upload-area{margin:0 16px 16px;border:2px dashed rgba(201,168,76,.3);border-radius:14px;padding:20px;text-align:center;cursor:pointer;background:rgba(201,168,76,.04);transition:all .15s;}
.upload-area:hover{border-color:${C.gold};background:rgba(201,168,76,.08);}
.upload-lbl{font-size:13px;color:${C.gold};font-weight:600;margin-bottom:4px;}
.upload-hint{font-size:11px;color:${C.muted};}

/* VIEWER */
.vw-overlay{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:300;display:flex;flex-direction:column;}
.vw-hdr{display:flex;justify-content:space-between;align-items:center;padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.08);}
.vw-ttl{font-family:'Cormorant Garamond',serif;font-size:17px;color:${C.cream};}
.vw-close{background:rgba(255,255,255,.1);border:none;color:${C.cream};font-size:18px;width:34px;height:34px;border-radius:50%;cursor:pointer;}
.vw-main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 16px;}
.vw-img{width:100%;max-height:52vh;object-fit:contain;border-radius:12px;}
.vw-cap{font-size:12px;color:${C.muted};margin-top:10px;text-align:center;}
.vw-nav{display:flex;align-items:center;gap:18px;padding:10px 16px;justify-content:center;}
.vw-btn{background:rgba(201,168,76,.15);border:1px solid ${C.border};color:${C.gold};width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.vw-btn:disabled{opacity:.3;cursor:default;}
.vw-dots{display:flex;gap:6px;}
.vw-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;transition:all .2s;}
.vw-dot.on{background:${C.gold};width:18px;border-radius:3px;}
.vw-strip{display:flex;gap:6px;padding:0 16px 20px;overflow-x:auto;scrollbar-width:none;}
.vw-strip::-webkit-scrollbar{display:none;}
.vw-thumb{width:54px;height:40px;object-fit:cover;border-radius:7px;opacity:.5;cursor:pointer;border:1.5px solid transparent;flex-shrink:0;transition:all .2s;}
.vw-thumb.on{opacity:1;border-color:${C.gold};}

/* NOTICE */
.notice-list{padding:0 16px 16px;}
.notice-card{background:${C.navyMid};border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:15px;margin-bottom:10px;cursor:pointer;}
.notice-date{font-size:10px;color:${C.muted};margin-bottom:4px;}
.notice-ttl{font-size:14px;font-weight:600;color:${C.cream};margin-bottom:5px;line-height:1.35;}
.notice-body{font-size:12px;color:rgba(250,246,238,.65);line-height:1.65;}
.notice-add-btn{display:block;width:calc(100% - 32px);margin:0 16px 14px;padding:13px;background:rgba(201,168,76,.1);border:1.5px dashed rgba(201,168,76,.4);border-radius:14px;color:${C.gold};font-size:13px;font-weight:600;cursor:pointer;text-align:center;font-family:'Noto Sans KR',sans-serif;}
.notice-form{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;padding:16px;margin:0 16px 14px;}
.nf-input{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:11px 13px;color:${C.cream};font-size:13px;font-family:'Noto Sans KR',sans-serif;margin-bottom:10px;outline:none;}
.nf-input:focus{border-color:${C.gold};}
.nf-input::placeholder{color:${C.muted};}
.nf-textarea{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:11px 13px;color:${C.cream};font-size:13px;font-family:'Noto Sans KR',sans-serif;margin-bottom:12px;outline:none;resize:none;min-height:80px;}
.nf-textarea:focus{border-color:${C.gold};}
.nf-textarea::placeholder{color:${C.muted};}
.nf-btns{display:flex;gap:8px;}
.nf-submit{flex:1;padding:11px;background:linear-gradient(135deg,${C.gold},${C.goldDk});border:none;border-radius:10px;color:${C.navy};font-size:13px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR',sans-serif;}
.nf-cancel{padding:11px 16px;background:rgba(255,255,255,.06);border:none;border-radius:10px;color:${C.muted};font-size:13px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;}

/* DONATE */
.dpage{padding:16px;}
.acard{background:${C.navyMid};border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:16px;margin-bottom:14px;}
.acard-ttl{font-family:'Cormorant Garamond',serif;font-size:16px;color:${C.gold};margin-bottom:10px;}
.atext{font-size:12px;color:rgba(250,246,238,.75);line-height:1.75;white-space:pre-line;}
.gcash-note{background:rgba(254,229,0,.08);border:1px solid rgba(254,229,0,.25);border-radius:10px;padding:10px 12px;margin-top:10px;font-size:11px;color:rgba(254,229,0,.85);line-height:1.55;}

/* KAKAO SHARE BTN */
.kakao-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;background:${C.kakao};border:none;border-radius:14px;color:#3A1D1D;font-size:14px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR',sans-serif;margin-bottom:10px;box-shadow:0 4px 14px rgba(254,229,0,.3);transition:transform .15s;}
.kakao-btn:active{transform:scale(.98);}

/* DONATE MODAL */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:flex-end;justify-content:center;z-index:200;}
.modal{background:${C.navyMid};border-radius:22px 22px 0 0;padding:20px 18px 40px;width:100%;max-width:430px;animation:su .3s ease;border-top:1px solid ${C.border};}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:36px;height:4px;background:rgba(255,255,255,.12);border-radius:2px;margin:0 auto 16px;}
.modal-ttl{font-family:'Cormorant Garamond',serif;font-size:20px;color:${C.cream};margin-bottom:3px;}
.modal-sub{font-size:12px;color:${C.muted};margin-bottom:16px;}
.amt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
.amt-btn{padding:11px 6px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);border-radius:12px;color:${C.cream};font-size:12px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;transition:all .15s;}
.amt-btn.on{background:rgba(201,168,76,.15);border-color:${C.gold};color:${C.gold};}
.cinput{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.09);border-radius:12px;padding:12px 14px;color:${C.cream};font-size:14px;font-family:'Noto Sans KR',sans-serif;margin-bottom:12px;outline:none;}
.cinput:focus{border-color:${C.gold};}
.cinput::placeholder{color:${C.muted};}
.pmethods{display:flex;gap:8px;margin-bottom:14px;}
.pmethod{flex:1;padding:10px 4px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);border-radius:11px;color:${C.muted};font-size:11px;cursor:pointer;text-align:center;font-family:'Noto Sans KR',sans-serif;transition:all .15s;}
.pmethod.on{border-color:${C.gold};color:${C.gold};background:rgba(201,168,76,.1);}
.gcash-modal-note{font-size:10px;color:rgba(254,229,0,.7);background:rgba(254,229,0,.06);border-radius:8px;padding:8px 10px;margin-bottom:14px;line-height:1.5;}
.btn-donate{width:100%;padding:14px;background:linear-gradient(135deg,${C.gold},${C.goldDk});border:none;border-radius:14px;color:${C.navy};font-size:15px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR',sans-serif;box-shadow:0 5px 18px rgba(201,168,76,.38);transition:transform .15s;}
.btn-donate:active{transform:scale(.98);}

/* ABOUT */
.about-sec{padding:16px;}
.staff-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.staff-row:last-child{border:none;}
.staff-role{font-size:11px;color:${C.muted};}
.staff-name{font-size:12px;color:${C.cream};font-weight:500;text-align:right;}
.contact-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.contact-row:last-child{border:none;}
.cicon{width:34px;height:34px;background:rgba(201,168,76,.1);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.clabel{font-size:10px;color:${C.muted};}
.cval{font-size:12px;color:${C.cream};font-weight:500;}

/* TOAST */
.toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);background:${C.green};color:#fff;padding:11px 22px;border-radius:22px;font-size:13px;font-weight:600;z-index:400;font-family:'Noto Sans KR',sans-serif;box-shadow:0 4px 18px rgba(42,110,73,.5);animation:tin .3s,tout .3s 2.4s forwards;white-space:nowrap;}
.toast.kakao-toast{background:#c8a800;color:#3A1D1D;}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(-14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes tout{to{opacity:0}}
`;

// ── ALBUM VIEWER ─────────────────────────────────────
function AlbumViewer({ album, lang, onClose }) {
  const [idx, setIdx] = useState(0);
  const ph = album.photos[idx];
  const ttl = lang==="ko" ? (album.titleKo||album.title) : album.title;
  return (
    <div className="vw-overlay">
      <div className="vw-hdr">
        <div className="vw-ttl">{ttl}</div>
        <button className="vw-close" onClick={onClose}>✕</button>
      </div>
      <div className="vw-main">
        <img className="vw-img" src={ph.url} alt={ph.cap}/>
        <div className="vw-cap">{ph.cap}</div>
      </div>
      <div className="vw-nav">
        <button className="vw-btn" onClick={()=>setIdx(i=>i-1)} disabled={idx===0}>‹</button>
        <div className="vw-dots">
          {album.photos.map((_,i)=>(
            <div key={i} className={`vw-dot${i===idx?" on":""}`} onClick={()=>setIdx(i)}/>
          ))}
        </div>
        <button className="vw-btn" onClick={()=>setIdx(i=>i+1)} disabled={idx===album.photos.length-1}>›</button>
      </div>
      <div className="vw-strip">
        {album.photos.map((p,i)=>(
          <img key={i} className={`vw-thumb${i===idx?" on":""}`} src={p.url} alt="" onClick={()=>setIdx(i)}/>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────
export default function App() {
  const [lang, setLang]           = useState("ko");
  const [tab, setTab]             = useState("home");
  const [albums, setAlbums]       = useState(ALBUMS_INIT);
  const [notices, setNotices]     = useState(NOTICES_INIT);
  const [selAlbum, setSelAlbum]   = useState(null);
  const [showDonate, setShowDonate] = useState(false);
  const [selMission, setSelMission] = useState(null);
  const [selAmt, setSelAmt]       = useState(5000);
  const [custAmt, setCustAmt]     = useState("");
  const [payM, setPayM]           = useState("GCash");
  const [toast, setToast]         = useState(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [nfTitle, setNfTitle]     = useState("");
  const [nfBody, setNfBody]       = useState("");
  const [loaded, setLoaded]       = useState(false);
  const fileRef = useRef();

  // ── 앱 시작 시 저장된 데이터 불러오기 ──
  useEffect(() => {
    (async () => {
      const savedNotices = await storageLoad("afcc-notices", null);
      const savedLang    = await storageLoad("afcc-lang", "ko");
      // 사진은 base64로 저장된 것만 복원 (objectURL은 세션 만료)
      const savedAlbumMeta = await storageLoad("afcc-album-meta", null);
      if (savedNotices) setNotices(savedNotices);
      if (savedLang)    setLang(savedLang);
      if (savedAlbumMeta) {
        // 저장된 텍스트 앨범(공지형)만 복원, 기본 앨범은 유지
        const extra = savedAlbumMeta.filter(a => a._persisted);
        if (extra.length) setAlbums(prev => [...extra, ...prev.filter(a => !a._persisted)]);
      }
      setLoaded(true);
    })();
  }, []);

  // ── 공지사항 변경 시 자동 저장 ──
  useEffect(() => {
    if (loaded) storageSave("afcc-notices", notices);
  }, [notices, loaded]);

  // ── 언어 설정 저장 ──
  useEffect(() => {
    if (loaded) storageSave("afcc-lang", lang);
  }, [lang, loaded]);

  const t = T[lang];
  const showToast = (msg, type="green") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 2800);
  };

  const openDonate = m => { setSelMission(m); setShowDonate(true); };

  const submitDonate = () => {
    setShowDonate(false);
    showToast(t.toastMsg);
  };

  const handleUpload = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});
    // base64로 변환해서 저장 가능하게
    Promise.all(files.map(f => new Promise(res => {
      const reader = new FileReader();
      reader.onload = ev => res({ url: ev.target.result, cap: f.name.replace(/\.[^.]+$/,"") });
      reader.readAsDataURL(f);
    }))).then(newPhotos => {
      const newAlbum = {
        id: Date.now(),
        title: "My Upload",
        titleKo: "업로드 사진",
        date: today,
        cover: newPhotos[0].url,
        photos: newPhotos,
        _persisted: true,
      };
      setAlbums(prev => {
        const updated = [newAlbum, ...prev];
        // 추가된 앨범만 따로 저장
        const toSave = updated.filter(a => a._persisted);
        storageSave("afcc-album-meta", toSave);
        return updated;
      });
      showToast(t.uploadDone);
    });
    e.target.value = "";
  };

  const submitNotice = () => {
    if (!nfTitle.trim()) return;
    const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});
    setNotices(prev=>[{
      id:Date.now(), date:today,
      titleEn:nfTitle, titleKo:nfTitle,
      bodyEn:nfBody, bodyKo:nfBody,
    },...prev]);
    setNfTitle(""); setNfBody(""); setShowNoticeForm(false);
    showToast(lang==="ko"?"공지가 등록되었습니다 ✅":"Notice posted ✅");
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const shareKakao = () => {
    const txt = lang==="ko"
      ? `아가페 패밀리 크리스챤 교회 | 야긴보아즈 교육선교센터\n선교 후원에 함께해 주세요! 🙏`
      : `Agape Family Christian Church | Jakin & Boaz Education Mission Center\nJoin us in supporting world missions! 🙏`;
    if (navigator.share) {
      navigator.share({ title:"AFCC Mission", text:txt }).catch(()=>{});
    } else {
      navigator.clipboard?.writeText(txt);
    }
    showToast(t.shareMsg, "kakao");
  };

  const AMTS = [1000,3000,5000,10000,20000,50000];

  // ── PAGES ──
  const Home = () => (
    <>
      <div className="hero">
        <div className="hero-eye">✝ Agape Family Christian Church</div>
        <div className="hero-ttl">{t.heroTitle}</div>
        <div className="hero-verse">{t.verse}</div>
        <div className="hero-btns">
          <button className="btn-g" onClick={()=>setTab("donate")}>{t.heroBtn1}</button>
          <button className="btn-o" onClick={()=>setTab("about")}>{t.heroBtn2}</button>
        </div>
      </div>
      <div className="stats">
        {["12","38","2,400"].map((n,i)=>(
          <div className="stat" key={i}>
            <div className="stat-n">{n}</div>
            <div className="stat-l">{t.statLabels[i]}</div>
          </div>
        ))}
      </div>
      <div className="sec" style={{marginTop:18}}>
        <div className="sec-hdr">
          <div className="sec-ttl">{t.upcomingEvents}</div>
          <div className="see-all" onClick={()=>setTab("events")}>{t.seeAll}</div>
        </div>
        {EVENTS.slice(0,2).map((e,i)=>(
          <div className="ecard" key={i}>
            <div className="ebox"><div className="emon">{e.month}</div><div className="eday">{e.day}</div></div>
            <div>
              <div className="etag">{lang==="ko"?e.tagKo:e.tag}</div>
              <div className="ettl">{lang==="ko"?e.titleKo:e.title}</div>
              <div className="emeta">🕐 {e.time} · 📍 {e.loc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="sec" style={{marginTop:16}}>
        <div className="sec-hdr">
          <div className="sec-ttl">{t.featuredMission}</div>
          <div className="see-all" onClick={()=>setTab("mission")}>{t.seeAll}</div>
        </div>
        <MCard m={MISSIONS[0]} lang={lang} t={t} onDonate={openDonate}/>
      </div>
      <div className="sec" style={{marginTop:16,paddingBottom:20}}>
        <div className="sec-hdr">
          <div className="sec-ttl">{t.recentPhotos}</div>
          <div className="see-all" onClick={()=>setTab("gallery")}>{t.seeAll}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {albums.slice(0,2).flatMap(a=>a.photos.slice(0,2)).slice(0,6).map((ph,i)=>(
            <img key={i} src={ph.url} alt="" onClick={()=>setSelAlbum(albums[Math.floor(i/2)])}
              style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:10,cursor:"pointer"}}/>
          ))}
        </div>
      </div>
    </>
  );

  const Mission = () => (
    <div className="sec" style={{paddingTop:18,paddingBottom:18}}>
      <div className="sec-ttl" style={{marginBottom:14}}>{t.activeMissions}</div>
      {MISSIONS.map(m=><MCard key={m.id} m={m} lang={lang} t={t} onDonate={openDonate}/>)}
    </div>
  );

  const Gallery = () => (
    <>
      <div className="sec" style={{paddingTop:18,paddingBottom:12}}>
        <div className="sec-hdr">
          <div className="sec-ttl">{t.galleryTitle}</div>
        </div>
        <div style={{fontSize:11,color:C.muted,marginBottom:14}}>{t.galleryHint}</div>
        <div className="upload-area" onClick={()=>fileRef.current.click()}>
          <div className="upload-lbl">{t.uploadBtn}</div>
          <div className="upload-hint">{t.uploadHint}</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload}/>
      </div>
      <div className="gal-grid">
        {albums.map(a=>(
          <div className="alb" key={a.id} onClick={()=>setSelAlbum(a)}>
            <img className="alb-img" src={a.cover} alt={a.title}/>
            <div className="alb-info">
              <div className="alb-ttl">{lang==="ko"?(a.titleKo||a.title):a.title}</div>
              <div className="alb-meta">{a.date} · {a.photos.length} photos</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const Notice = () => (
    <>
      <div className="sec" style={{paddingTop:18,paddingBottom:12}}>
        <div className="sec-hdr">
          <div className="sec-ttl">{t.noticeTitle}</div>
          <div style={{fontSize:10,color:C.green,background:"rgba(42,110,73,.15)",border:"1px solid rgba(42,110,73,.3)",borderRadius:10,padding:"3px 9px"}}>
            💾 {lang==="ko"?"자동저장":"Auto-saved"}
          </div>
        </div>
      </div>
      <button className="notice-add-btn" onClick={()=>setShowNoticeForm(v=>!v)}>
        {showNoticeForm ? (lang==="ko"?"✕ 닫기":"✕ Close") : t.addNotice}
      </button>
      {showNoticeForm && (
        <div className="notice-form">
          <input className="nf-input" placeholder={t.noticeForm.title} value={nfTitle} onChange={e=>setNfTitle(e.target.value)}/>
          <textarea className="nf-textarea" placeholder={t.noticeForm.body} value={nfBody} onChange={e=>setNfBody(e.target.value)}/>
          <div className="nf-btns">
            <button className="nf-cancel" onClick={()=>{setShowNoticeForm(false);setNfTitle("");setNfBody("");}}>{t.noticeForm.cancel}</button>
            <button className="nf-submit" onClick={submitNotice}>{t.noticeForm.submit}</button>
          </div>
        </div>
      )}
      <div className="notice-list">
        {notices.length===0 && <div style={{textAlign:"center",color:C.muted,fontSize:13,padding:"20px 0"}}>{t.noticeEmpty}</div>}
        {notices.map(n=>(
          <div className="notice-card" key={n.id} style={{position:"relative"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div className="notice-date">{n.date}</div>
              <button onClick={()=>deleteNotice(n.id)}
                style={{background:"rgba(192,57,43,.15)",border:"1px solid rgba(192,57,43,.3)",color:"#e07060",borderRadius:8,padding:"2px 9px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>
                {lang==="ko"?"삭제":"Delete"}
              </button>
            </div>
            <div className="notice-ttl">{lang==="ko"?n.titleKo:n.titleEn}</div>
            <div className="notice-body">{lang==="ko"?n.bodyKo:n.bodyEn}</div>
          </div>
        ))}
      </div>
    </>
  );

  const Donate = () => (
    <div className="dpage">
      <div style={{marginBottom:16}}>
        <div className="sec-ttl">{t.donateTitle}</div>
        <div style={{fontSize:12,color:C.muted,marginTop:4}}>{lang==="ko"?"여러분의 후원이 열방을 변화시킵니다":"Your support transforms the nations"}</div>
      </div>
      {/* KakaoTalk share */}
      <button className="kakao-btn" onClick={shareKakao}>
        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 4.91 2 8.5c0 2.3 1.48 4.33 3.72 5.5L4.8 17.2c-.08.2.14.38.32.27L9 15.06c.33.04.66.06 1 .06 4.42 0 8-2.91 8-6.5S14.42 2 10 2z" fill="#3A1D1D"/></svg>
        {t.shareKakao}
      </button>
      {MISSIONS.map(m=>(
        <div key={m.id} className="mcard" style={{marginBottom:14}}>
          <div className="mcard-top">
            <span className="mflag">{m.flag}</span>
            <div>
              <div className="mloc">{m.country}</div>
              <div className="mname">{lang==="ko"?m.nameKo:m.name}</div>
            </div>
          </div>
          <div className="pbar-lbl">
            <span>{Math.round((m.raised/m.goal)*100)}% funded</span>
            <span className="pbar-amt">₱{m.raised.toLocaleString()}</span>
          </div>
          <div className="pbar"><div className="pbar-fill" style={{width:`${Math.round((m.raised/m.goal)*100)}%`}}/></div>
          <button className="btn-g" style={{width:"100%",marginTop:12}} onClick={()=>openDonate(m)}>
            {lang==="ko"?"이 선교 후원하기":"Support this Mission"}
          </button>
        </div>
      ))}
      <div className="acard">
        <div className="acard-ttl">🏦 {lang==="ko"?"하나은행 계좌이체":"Hana Bank Transfer"}</div>
        {/* 계좌 정보 박스 */}
        <div style={{background:"rgba(201,168,76,.07)",border:"1.5px solid rgba(201,168,76,.3)",borderRadius:12,padding:"16px 14px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:10,color:C.muted,letterSpacing:1}}>{lang==="ko"?"은행":"BANK"}</span>
            <span style={{fontSize:14,fontWeight:700,color:C.cream}}>{lang==="ko"?"하나은행":"Hana Bank"}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:10,color:C.muted,letterSpacing:1}}>{lang==="ko"?"예금주":"ACCOUNT HOLDER"}</span>
            <span style={{fontSize:14,fontWeight:700,color:C.cream}}>김성년 (Kim Sung Nyun)</span>
          </div>
          <div style={{borderTop:"1px solid rgba(201,168,76,.2)",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:3}}>{lang==="ko"?"계좌번호":"ACCOUNT NO."}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.gold,letterSpacing:1}}>132-891505-76807</div>
            </div>
            <button onClick={()=>{navigator.clipboard?.writeText("13289150576807");showToast(lang==="ko"?"계좌번호가 복사되었습니다 ✅":"Account number copied ✅");}}
              style={{background:"rgba(201,168,76,.2)",border:"1px solid rgba(201,168,76,.5)",color:C.gold,borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              {lang==="ko"?"복사":"Copy"}
            </button>
          </div>
        </div>
        <div style={{fontSize:11,color:"rgba(250,246,238,.65)",lineHeight:1.7,marginBottom:8}}>
          {t.bankNote}
        </div>
        {/* 카카오톡 후원 안내 버튼 */}
        <button className="kakao-btn" style={{marginBottom:0}} onClick={shareKakao}>
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 4.91 2 8.5c0 2.3 1.48 4.33 3.72 5.5L4.8 17.2c-.08.2.14.38.32.27L9 15.06c.33.04.66.06 1 .06 4.42 0 8-2.91 8-6.5S14.42 2 10 2z" fill="#3A1D1D"/></svg>
          {lang==="ko"?"카카오톡으로 후원 문의":"Donate Inquiry via KakaoTalk"}
        </button>
      </div>
    </div>
  );

  const About = () => (
    <div className="about-sec">
      <div className="acard">
        <div className="acard-ttl">✝ {t.aboutTitle}</div>
        <div style={{fontSize:12,color:"rgba(250,246,238,.75)",lineHeight:1.75}}>
          <strong style={{color:C.goldLt}}>Agape Family Christian Church</strong><br/>
          아가페 패밀리 크리스챤 교회<br/><br/>
          <em style={{color:C.gold}}>Jakin and Boaz Education Mission Center<br/>야긴보아즈 교육선교센터</em><br/><br/>
          Founded 2010 · San Mateo, Rizal, Philippines<br/><br/>
          <em style={{color:C.muted}}>"{t.verse}"</em>
        </div>
      </div>
      <div className="acard">
        <div className="acard-ttl">🕊 {t.schedule}</div>
        {t.worshipSchedule.map((s,i)=>(
          <div key={i} style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{fontSize:11,color:C.gold,marginBottom:2}}>✝ {s.label}</div>
            <div style={{fontSize:12,color:C.cream}}>{s.time}</div>
          </div>
        ))}
      </div>
      <div className="acard">
        <div className="acard-ttl">👥 {t.leadership}</div>
        {STAFF.map((s,i)=>(
          <div className="staff-row" key={i}>
            <span className="staff-role">{lang==="ko"?s.roleKo:s.role}</span>
            <span className="staff-name">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="acard">
        <div className="acard-ttl">📞 {t.contact}</div>
        {[
          {ic:"📍",label:t.address, val:"No. 4, Dama De Noche St., Doña Pepeng, Banaba, San Mateo, Rizal"},
          {ic:"📞",label:t.phone,   val:"028-733-7427"},
          {ic:"🏫",label:t.academy, val:"Tue 8–10am · Thu/Sat 1:30–4pm"},
        ].map((c,i)=>(
          <div className="contact-row" key={i}>
            <div className="cicon">{c.ic}</div>
            <div><div className="clabel">{c.label}</div><div className="cval">{c.val}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabIds = ["home","mission","gallery","notice","donate","about"];

  // 로딩 중 화면
  if (!loaded) return (
    <>
      <style>{STYLES}</style>
      <div className="shell" style={{alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
        <div style={{textAlign:"center"}}>
          <div style={{marginBottom:16}}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <rect x="21" y="4" width="6" height="28" rx="2.5" fill={C.gold}/>
              <rect x="4" y="18" width="40" height="6" rx="2.5" fill={C.gold}/>
            </svg>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.gold,marginBottom:6}}>
            Agape Family Christian Church
          </div>
          <div style={{fontSize:12,color:C.muted,marginBottom:20}}>야긴보아즈 교육선교센터</div>
          <div style={{width:36,height:36,border:`3px solid rgba(201,168,76,.2)`,borderTop:`3px solid ${C.gold}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-top">
            <div>
              <div className="brand-en">AGAPE FAMILY CHRISTIAN CHURCH</div>
              <div className="brand-sub">Jakin &amp; Boaz Education Mission Center</div>
            </div>
            <div className="hdr-right">
              <div className="lang-toggle">
                <button className={`lang-btn${lang==="ko"?" on":""}`} onClick={()=>setLang("ko")}>한국어</button>
                <button className={`lang-btn${lang==="en"?" on":""}`} onClick={()=>setLang("en")}>ENG</button>
              </div>
              <div className="cross-ic">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <rect x="7.5" y="1" width="3" height="16" rx="1" fill={C.gold}/>
                  <rect x="1" y="6" width="16" height="3" rx="1" fill={C.gold}/>
                </svg>
              </div>
            </div>
          </div>
          <div className="tabs">
            {t.tabs.map((lbl,i)=>(
              <button key={i} className={`tab${tab===tabIds[i]?" on":""}`} onClick={()=>setTab(tabIds[i])}>
                <span className="tab-ic">{t.tabIcons[i]}</span>{lbl}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="body">
          {tab==="home"    && <Home/>}
          {tab==="mission" && <Mission/>}
          {tab==="gallery" && <Gallery/>}
          {tab==="notice"  && <Notice/>}
          {tab==="donate"  && <Donate/>}
          {tab==="about"   && <About/>}
        </div>

        {/* ALBUM VIEWER */}
        {selAlbum && <AlbumViewer album={selAlbum} lang={lang} onClose={()=>setSelAlbum(null)}/>}

        {/* DONATE MODAL */}
        {showDonate && (
          <div className="modal-ov" onClick={()=>setShowDonate(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-handle"/>
              <div className="modal-ttl">{selMission?.flag} {t.donateTitle}</div>
              <div className="modal-sub">{t.donateSubFn(lang==="ko"?selMission?.nameKo:selMission?.name)}</div>
              <div className="amt-grid">
                {AMTS.map(a=>(
                  <button key={a} className={`amt-btn${selAmt===a?" on":""}`}
                    onClick={()=>{setSelAmt(a);setCustAmt("");}}>
                    ₩{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input className="cinput" placeholder={t.customAmt} value={custAmt}
                onChange={e=>{setCustAmt(e.target.value);setSelAmt(null);}}/>
              {/* 하나은행 계좌 안내 */}
              <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.3)",borderRadius:12,padding:"13px 14px",marginBottom:14}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:6}}>{lang==="ko"?"입금 계좌":"Transfer Account"}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.cream,marginBottom:3}}>{lang==="ko"?"하나은행 · 김성년":"Hana Bank · Kim Sung Nyun"}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.gold,fontWeight:700}}>132-891505-76807</div>
                  <button onClick={()=>{navigator.clipboard?.writeText("13289150576807");showToast(lang==="ko"?"복사됨 ✅":"Copied ✅");}}
                    style={{background:"rgba(201,168,76,.2)",border:"1px solid rgba(201,168,76,.4)",color:C.gold,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    {lang==="ko"?"복사":"Copy"}
                  </button>
                </div>
              </div>
              <button className="btn-donate" onClick={submitDonate}>
                {t.donateSubmitFn(custAmt?parseInt(custAmt||0).toLocaleString():(selAmt?.toLocaleString()||"0"))}
              </button>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className={`toast${toast.type==="kakao"?" kakao-toast":""}`}>{toast.msg}</div>
        )}
      </div>
    </>
  );
}

// ── MISSION CARD COMPONENT ────────────────────────────
function MCard({ m, lang, t, onDonate }) {
  const pct = Math.round((m.raised/m.goal)*100);
  return (
    <div className="mcard">
      <div className="mcard-top">
        <span className="mflag">{m.flag}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <div className="mloc">{m.country} · {m.area}</div>
            <span style={{fontSize:9,background:"rgba(201,168,76,.18)",color:C.gold,border:"1px solid rgba(201,168,76,.35)",borderRadius:10,padding:"1px 7px",fontWeight:700,letterSpacing:.5,flexShrink:0}}>
              {lang==="ko"?m.tagKo:m.tag}
            </span>
          </div>
          <div className="mname">{lang==="ko"?m.nameKo:m.name}</div>
        </div>
      </div>
      <div className="mdesc">{lang==="ko"?m.descKo:m.desc}</div>
      <div className="pbar-lbl">
        <span>{t.goal} ₱{(m.goal/1000).toFixed(0)}K</span>
        <span className="pbar-amt">₱{m.raised.toLocaleString()}</span>
      </div>
      <div className="pbar"><div className="pbar-fill" style={{width:`${pct}%`}}/></div>
      <div className="mcard-foot">
        <span className="mdonors">👥 {m.donors} {t.supporters}</span>
        <button className="btn-sm" onClick={()=>onDonate(m)}>{t.supportBtn}</button>
      </div>
    </div>
  );
}
