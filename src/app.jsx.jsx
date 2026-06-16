import { useState } from "react";

const PLATFORMS = {
  flights: [
    { name:"Ryanair.com",    url:"https://www.ryanair.com",    commission:"0%",  logo:"✈" },
    { name:"EasyJet.com",    url:"https://www.easyjet.com",    commission:"0%",  logo:"✈" },
    { name:"Wizz Air",       url:"https://wizzair.com",        commission:"0%",  logo:"✈" },
    { name:"ITA Airways",    url:"https://www.itaairways.com", commission:"0%",  logo:"✈" },
    { name:"Google Flights", url:"https://flights.google.com", commission:"0%",  logo:"🔍" },
    { name:"Skyscanner",     url:"https://www.skyscanner.it",  commission:"~1%", logo:"🔍" },
    { name:"Kiwi.com",       url:"https://www.kiwi.com",       commission:"~3%", logo:"🥝" },
  ],
  hotels: [
    { name:"Diretto Hotel",  url:"",                           commission:"0%",  logo:"📞" },
    { name:"HotelBeds",      url:"https://www.hotelbeds.com",  commission:"~8%", logo:"🛏" },
    { name:"Hotels.com",     url:"https://www.hotels.com",     commission:"~12%",logo:"🏨" },
    { name:"Expedia",        url:"https://www.expedia.it",     commission:"~15%",logo:"📦" },
  ],
  resorts: [
    { name:"Sito Diretto",   url:"",                           commission:"0%",  logo:"🌴" },
    { name:"Alpitour",       url:"https://www.alpitour.it",    commission:"~5%", logo:"🌴" },
    { name:"Valtur",         url:"https://www.valtur.it",      commission:"~5%", logo:"🌴" },
    { name:"Club Med",       url:"https://www.clubmed.it",     commission:"0%",  logo:"🌴" },
    { name:"TUI",            url:"https://www.tui.it",         commission:"~7%", logo:"✈🌴" },
  ],
};

// ══════════════════════════════════════════════════════════════
// 🔗 GENERATORE LINK PROFONDI
// ══════════════════════════════════════════════════════════════
function buildFlightLinks({ orig, dest, destCity, dateOut, dateReturn, pax, airline }) {
  const d1 = dateOut || "";
  const d2 = dateReturn || "";
  const fmt = d => d.replace(/-/g,""); // 20240810
  const fmtSky = d => d; // 2024-08-10

  return [
    {
      name: "Google Flights",
      logo: "🔍",
      commission: "0%",
      url: `https://www.google.com/travel/flights?q=voli+da+${orig}+a+${dest}+${d1}`,
    },
    {
      name: "Skyscanner",
      logo: "🔍",
      commission: "~1%",
      url: `https://www.skyscanner.it/trasporti/voli/${orig.toLowerCase()}/${dest.toLowerCase()}/${fmt(d1)}/${fmt(d2)}/?adults=${pax}&cabinclass=economy`,
    },
    {
      name: airline.includes("Ryanair") ? "Ryanair.com" : airline.includes("EasyJet") ? "EasyJet.com" : airline.includes("Wizz") ? "Wizz Air" : airline.includes("ITA") ? "ITA Airways" : "Kiwi.com",
      logo: "✈",
      commission: "0%",
      url: airline.includes("Ryanair")
        ? `https://www.ryanair.com/it/it/trip/flights/select?adults=${pax}&teens=0&children=0&infants=0&dateOut=${d1}&dateIn=${d2}&isConnectedFlight=false&isReturn=true&discount=0&promoCode=&originIata=${orig}&destinationIata=${dest}&tpAdults=${pax}&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=${d1}&tpEndDate=${d2}&tpDiscount=0&tpPromoCode=&tpOriginIata=${orig}&tpDestinationIata=${dest}`
        : airline.includes("EasyJet")
        ? `https://www.easyjet.com/it#/booking/select-flights?bookingFlow=Return&originIata=${orig}&destinationIata=${dest}&departDate=${d1}&returnDate=${d2}&adults=${pax}&children=0&infants=0`
        : airline.includes("Wizz")
        ? `https://wizzair.com/it-it/flights/${orig}/${dest}/${d1}/${d2}/${pax}/0/0/0`
        : `https://www.kiwi.com/it/search/${orig}/${dest}/${d1}/${d2}?adults=${pax}`,
    },
  ];
}

function buildHotelLinks({ destCity, dateOut, dateReturn, pax, hotelName, boardType }) {
  const checkin  = dateOut    || "";
  const checkout = dateReturn || "";
  const encoded  = encodeURIComponent(destCity||"");
  const hotelEnc = encodeURIComponent(hotelName||"");
  const boardMap = { ro:"nflt=mealplan%3D1", bb:"nflt=mealplan%3D2", hb:"nflt=mealplan%3D3", fb:"nflt=mealplan%3D4", ai:"nflt=mealplan%3D9", any:"" };
  const boardFilter = boardMap[boardType||"any"]||"";
  return [
    {
      name: "Booking.com",
      logo: "🏨",
      commission: "~15%",
      url: `https://www.booking.com/search.it.html?ss=${encoded}&checkin=${checkin}&checkout=${checkout}&group_adults=${pax}&no_rooms=1${boardFilter?"&"+boardFilter:""}`,
    },
    {
      name: "Hotels.com",
      logo: "🛏",
      commission: "~12%",
      url: `https://it.hotels.com/search.do?q-destination=${encoded}&q-check-in=${checkin}&q-check-out=${checkout}&q-rooms=1&q-room-0-adults=${pax}`,
    },
    {
      name: "Google Hotels",
      logo: "🔍",
      commission: "0%",
      url: `https://www.google.com/travel/hotels?q=${hotelEnc}+${encoded}&checkin=${checkin}&checkout=${checkout}&adults=${pax}`,
    },
    {
      name: "Expedia",
      logo: "📦",
      commission: "~15%",
      url: `https://www.expedia.it/Hotel-Search?destination=${encoded}&startDate=${checkin}&endDate=${checkout}&adults=${pax}`,
    },
  ];
}

function buildResortLinks({ destCity, dateOut, dateReturn, pax, resortName, chain }) {
  const encoded = encodeURIComponent(destCity||"");
  const checkin  = dateOut    || "";
  const checkout = dateReturn || "";
  const chainLow = (chain||"").toLowerCase();
  return [
    {
      name: chainLow.includes("alpitour") ? "Alpitour" : chainLow.includes("valtur") ? "Valtur" : chainLow.includes("club") ? "Club Med" : chainLow.includes("tui") ? "TUI" : chainLow.includes("iberostar") ? "Iberostar" : "Sito Diretto",
      logo: "🌴",
      commission: chainLow.includes("alpitour")||chainLow.includes("valtur") ? "~5%" : "0%",
      url: chainLow.includes("alpitour")
        ? `https://www.alpitour.it/offerte-vacanze/?dest=${encoded}&partenza=${checkin}&ritorno=${checkout}&adulti=${pax}`
        : chainLow.includes("valtur")
        ? `https://www.valtur.it/offerte/?destinazione=${encoded}`
        : chainLow.includes("club")
        ? `https://www.clubmed.it/l/villaggi-e-resort?query=${encoded}`
        : chainLow.includes("tui")
        ? `https://www.tui.it/offerte/?destination=${encoded}&depDate=${checkin}`
        : chainLow.includes("iberostar")
        ? `https://www.iberostar.com/it/hotel/${encoded}/`
        : `https://www.google.com/search?q=${encodeURIComponent(resortName||"")}+sito+ufficiale`,
    },
    {
      name: "Booking.com",
      logo: "🏨",
      commission: "~15%",
      url: `https://www.booking.com/search.it.html?ss=${encoded}&checkin=${checkin}&checkout=${checkout}&group_adults=${pax}&no_rooms=1&nflt=property_type%3D4`,
    },
    {
      name: "TripAdvisor",
      logo: "🦉",
      commission: "~8%",
      url: `https://www.tripadvisor.it/Search?q=${encoded}+resort&searchSessionId=`,
    },
  ];
}


const ORIGINS = [
  { city:"Bologna",            iata:"BLQ", region:"Emilia Romagna" },
  { city:"Rimini",             iata:"RMI", region:"Emilia Romagna" },
  { city:"Venezia Marco Polo", iata:"VCE", region:"Veneto" },
  { city:"Verona",             iata:"VRN", region:"Veneto" },
  { city:"Milano Malpensa",    iata:"MXP", region:"Lombardia" },
  { city:"Milano Bergamo",     iata:"BGY", region:"Lombardia" },
  { city:"Pisa",               iata:"PSA", region:"Toscana" },
  { city:"Firenze",            iata:"FLR", region:"Toscana" },
  { city:"Roma Fiumicino",     iata:"FCO", region:"Lazio" },
  { city:"Roma Ciampino",      iata:"CIA", region:"Lazio" },
  { city:"Napoli",             iata:"NAP", region:"Campania" },
  { city:"Bari",               iata:"BRI", region:"Puglia" },
  { city:"Ancona",             iata:"AOI", region:"Marche" },
  { city:"Torino",             iata:"TRN", region:"Piemonte" },
  { city:"Catania",            iata:"CTA", region:"Sicilia" },
  { city:"Palermo",            iata:"PMO", region:"Sicilia" },
  { city:"Cagliari",           iata:"CAG", region:"Sardegna" },
];

// ══════════════════════════════════════════════════════════════
// 🗺️ DESTINAZIONI
// ══════════════════════════════════════════════════════════════
const DEST = {
  "Sardegna":       { iata:"CAG", tier:"short"  },
  "Sicilia":        { iata:"PMO", tier:"short"  },
  "Atene":          { iata:"ATH", tier:"medium" },
  "Corfù":          { iata:"CFU", tier:"medium" },
  "Mykonos":        { iata:"JMK", tier:"medium" },
  "Santorini":      { iata:"JTR", tier:"medium" },
  "Rodi":           { iata:"RHO", tier:"medium" },
  "Creta":          { iata:"HER", tier:"medium" },
  "Croazia":        { iata:"SPU", tier:"short"  },
  "Barcellona":     { iata:"BCN", tier:"medium" },
  "Ibiza":          { iata:"IBZ", tier:"medium" },
  "Palma Maiorca":  { iata:"PMI", tier:"medium" },
  "Tenerife":       { iata:"TFN", tier:"medium" },
  "Malta":          { iata:"MLA", tier:"short"  },
  "Tunisi":         { iata:"TUN", tier:"short"  },
  "Marrakech":      { iata:"RAK", tier:"short"  },
  "Lisbona":        { iata:"LIS", tier:"medium" },
  "Londra":         { iata:"LHR", tier:"medium" },
  "Parigi":         { iata:"CDG", tier:"medium" },
  "Amsterdam":      { iata:"AMS", tier:"medium" },
  "Praga":          { iata:"PRG", tier:"short"  },
  "Vienna":         { iata:"VIE", tier:"short"  },
  "Budapest":       { iata:"BUD", tier:"short"  },
  "Dubai":          { iata:"DXB", tier:"long"   },
  "New York":       { iata:"JFK", tier:"long"   },
  "Tokyo":          { iata:"NRT", tier:"long"   },
  "Bali":           { iata:"DPS", tier:"long"   },
  "Maldive":        { iata:"MLE", tier:"long"   },
};

const HOTEL_FILTERS = [
  { id:"pool",      label:"🏊 Piscina" },
  { id:"beach",     label:"🏖️ Fronte spiaggia" },
  { id:"breakfast", label:"🍳 Colazione inclusa" },
  { id:"spa",       label:"🧖 Spa" },
  { id:"gym",       label:"💪 Palestra" },
  { id:"parking",   label:"🅿️ Parcheggio" },
  { id:"wifi",      label:"📶 WiFi gratuito" },
  { id:"ac",        label:"❄️ Aria condizionata" },
  { id:"restaurant",label:"🍽️ Ristorante" },
  { id:"kids",      label:"👶 Servizi bambini" },
  { id:"pets",      label:"🐾 Pet friendly" },
  { id:"view",      label:"🌅 Vista panoramica" },
];

const RESORT_FILTERS = [
  { id:"allinclusive", label:"🍹 All Inclusive" },
  { id:"ultraai",      label:"⭐ Ultra All Inclusive" },
  { id:"beach",        label:"🏖️ Spiaggia privata" },
  { id:"pool",         label:"🏊 Piscina" },
  { id:"kids",         label:"👶 Kids Club" },
  { id:"spa",          label:"🧖 Spa" },
  { id:"animation",    label:"🎭 Animazione" },
  { id:"windsurf",     label:"🏄 Windsurf" },
  { id:"snorkeling",   label:"🤿 Snorkeling" },
  { id:"tennis",       label:"🎾 Tennis" },
  { id:"golf",         label:"⛳ Golf" },
];

// ══════════════════════════════════════════════════════════════
// 🎲 ENGINE MOCK
// ══════════════════════════════════════════════════════════════
const AIRLINES = [
  { name:"Ryanair",         budget:true,  pfIdx:0 },
  { name:"EasyJet",         budget:true,  pfIdx:1 },
  { name:"Wizz Air",        budget:true,  pfIdx:2 },
  { name:"Vueling",         budget:false, pfIdx:5 },
  { name:"ITA Airways",     budget:false, pfIdx:3 },
  { name:"Lufthansa",       budget:false, pfIdx:4 },
  { name:"Air France",      budget:false, pfIdx:4 },
  { name:"British Airways", budget:false, pfIdx:4 },
  { name:"Emirates",        budget:false, pfIdx:4 },
  { name:"Turkish Airlines",budget:false, pfIdx:5 },
];
const HOTEL_COS  = ["Hilton","Marriott","NH Hotels","Ibis","Novotel","Best Western","Meliá","Radisson","Four Seasons","Hyatt"];
const RESORT_COS = ["Club Med","Riu Hotels","Barceló","TUI Blue","Valtur","Alpitour","Iberostar","Seaside Hotels"];
const ALL_HOTEL_AMENITIES = ["WiFi gratuito","Colazione inclusa","Piscina","Palestra","Spa","Parcheggio","Ristorante","Bar","Aria condizionata","Fronte spiaggia","Vista panoramica","Pet friendly","Servizi bambini"];

function seedRandom(seed){ let s=seed; return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; }; }
function getNights(a,b){ if(!a||!b) return 7; return Math.max(1,Math.ceil((new Date(b)-new Date(a))/86400000)); }
function pick(arr,r){ return arr[Math.floor(r()*arr.length)]; }

function genFlights({ dest, dateOut, dateReturn, pax, flexWeeks, originIata }){
  const info = DEST[dest]||{iata:"???",tier:"medium"};
  const origin = ORIGINS.find(o=>o.iata===originIata)||ORIGINS[0];
  const seed = (dest+dateOut+pax+(originIata||"BLQ")).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const r = seedRandom(seed);
  const prices = { short:[18,140], medium:[45,320], long:[220,980] };
  const [mn,mx] = prices[info.tier];
  const nights = getNights(dateOut,dateReturn);
  const count = 8+Math.floor(r()*5);
  return Array.from({length:count},(_,i)=>{
    const al = pick(AIRLINES,r);
    const factor = al.budget?0.52:1.18;
    const pppOW = Math.round((mn+r()*(mx-mn))*factor);
    const pppRT = Math.round(pppOW*(1.6+r()*0.4));
    const totOW = pppOW*pax, totRT=pppRT*pax;
    const stops = al.budget?(r()<0.78?0:1):(r()<0.45?0:r()<0.82?1:2);
    const dh=5+Math.floor(r()*17), dm=[0,10,20,30,40,50][Math.floor(r()*6)];
    const dur=info.tier==="short"?1+r()*2:info.tier==="medium"?2.5+r()*3.5:8+r()*6;
    const ah=(dh+Math.floor(dur))%24, am=(dm+Math.round((dur%1)*60))%60;
    const comfort=al.budget?Math.round(2+r()*1.5):Math.round(3+r()*2);
    const punct=Math.round(60+r()*38);
    const score=Math.round(((mx-pppOW)/(mx-mn))*55+comfort*7+(stops===0?10:0)+(al.budget?5:0));
    const flexVariants = flexWeeks>0?Array.from({length:flexWeeks*2},(_,w)=>{
      const offset=(w%2===0?1:-1)*Math.ceil((w+1)/2)*7;
      const adjPrice=Math.round(pppRT*(0.85+r()*0.3));
      const d=new Date(dateOut); d.setDate(d.getDate()+offset);
      return { offset, date:d.toLocaleDateString("it-IT",{day:"2-digit",month:"short"}), price:adjPrice*pax };
    }):[];
    return {
      id:`FL-${seed}-${i}`, airline:al.name, budget:al.budget,
      pppOW, pppRT, totOW, totRT, pax, stops,
      dep:`${String(dh).padStart(2,"0")}:${String(dm).padStart(2,"0")}`,
      arr:`${String(ah).padStart(2,"0")}:${String(am).padStart(2,"0")}`,
      dur:`${Math.floor(dur)}h ${Math.round((dur%1)*60)}m`,
      comfort, punct, score, nights,
      baggage:!al.budget||r()<0.22,
      cls:al.budget?"Economy":(r()<0.6?"Economy":r()<0.88?"Business":"First"),
      orig:origin.iata, dest:info.iata,
      platform:PLATFORMS.flights[al.pfIdx]||PLATFORMS.flights[5],
      flexVariants,
    };
  }).sort((a,b)=>a.totRT-b.totRT);
}

function genHotels({ dest, dateOut, dateReturn, pax, filters }){
  const seed=(dest+dateOut).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const r=seedRandom(seed+1);
  const n=getNights(dateOut,dateReturn);
  const filterMap={pool:"Piscina",beach:"Fronte spiaggia",breakfast:"Colazione inclusa",spa:"Spa",gym:"Palestra",parking:"Parcheggio",wifi:"WiFi gratuito",ac:"Aria condizionata",restaurant:"Ristorante",kids:"Servizi bambini",pets:"Pet friendly",view:"Vista panoramica"};
  const all=Array.from({length:10+Math.floor(r()*5)},(_,i)=>{
    const co=pick(HOTEL_COS,r);
    const stars=2+Math.floor(r()*4);
    const ppn=Math.round(38+r()*(stars*70));
    const tot=ppn*n;
    const rating=Math.round((3.1+r()*1.9)*10)/10;
    const revs=Math.floor(150+r()*4000);
    const amenities=ALL_HOTEL_AMENITIES.filter((_,idx)=>idx<4?r()>0.3:r()>0.55);
    const score=Math.round((rating/5)*50+(1-ppn/500)*30+(stars/5)*20);
    const zones=["Centro storico","Fronte mare","Zona elegante","Vicino aeroporto","Zona turistica","Vista panoramica"];
    const pf=PLATFORMS.hotels[Math.floor(r()*PLATFORMS.hotels.length)];
    return { id:`HT-${seed}-${i}`, name:`${co} ${dest}${i>0?" "+["Grand","Luxury","Boutique","Premium","Classic","Elite"][i%6]:""}`, stars, ppn, tot, n, rating, revs, amenities, score, zone:pick(zones,r), cancel:r()<0.6?"Gratuita":"Non rimborsabile", platform:pf };
  }).sort((a,b)=>b.score-a.score);
  if(!filters||filters.length===0) return all;
  return all.filter(h=>filters.every(f=>h.amenities.includes(filterMap[f]||"")));
}

function genResorts({ dest, dateOut, dateReturn, pax, filters }){
  const seed=(dest+dateOut).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const r=seedRandom(seed+2);
  const n=getNights(dateOut,dateReturn);
  const all=Array.from({length:8+Math.floor(r()*4)},(_,i)=>{
    const co=pick(RESORT_COS,r);
    const treat=pick(["All Inclusive","Ultra All Inclusive","Pensione Completa","Mezza Pensione"],r);
    const ppn=Math.round(95+r()*250);
    const tot=ppn*n*pax;
    const rating=Math.round((3.7+r()*1.3)*10)/10;
    const features={beach:r()<0.72,pool:true,kids:r()<0.5,spa:r()<0.55,animation:r()<0.8,windsurf:r()<0.4,snorkeling:r()<0.5,tennis:r()<0.45,golf:r()<0.25,allinclusive:treat.includes("All"),ultraai:treat.includes("Ultra")};
    const sportsArr=["Windsurf","Snorkeling","Tennis","Calcio","Yoga","Acquagym","Beach Volley","Kayak"].filter(()=>r()>0.52).slice(0,5);
    const score=Math.round((rating/5)*44+(treat.includes("Ultra")?25:treat.includes("All")?18:8)+(1-ppn/380)*30);
    const pfName=co.split(" ")[0].toLowerCase();
    const pf=PLATFORMS.resorts.find(p=>p.name.toLowerCase().includes(pfName))||PLATFORMS.resorts[0];
    return { id:`RS-${seed}-${i}`, name:`${co} ${dest}${i>0?" "+["Beach","Village","Paradise","Escape","Retreat"][i%5]:""}`, co, treat, ppn, tot, n, rating, sportsArr, score, pax, features, platform:pf };
  }).sort((a,b)=>b.score-a.score);
  if(!filters||filters.length===0) return all;
  return all.filter(r2=>filters.every(f=>r2.features[f]));
}

// ══════════════════════════════════════════════════════════════
// 🎨 UI ATOMS
// ══════════════════════════════════════════════════════════════
const eur=n=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

function CommBadge({pct}){
  const c=pct==="0%"?"#10b981":parseFloat(pct)<5?"#f59e0b":"#ef4444";
  return <span style={{fontSize:"0.58rem",padding:"1px 6px",borderRadius:8,background:c+"20",border:`1px solid ${c}44`,color:c,fontWeight:700}}>comm.{pct}</span>;
}
function QpBadge({score}){
  const c=score>=75?"#10b981":score>=50?"#f59e0b":"#ef4444";
  const l=score>=75?"Ottimo Q/P":score>=50?"Buono Q/P":"Discreto";
  return <span style={{fontSize:"0.62rem",padding:"2px 8px",borderRadius:10,background:c+"20",border:`1px solid ${c}44`,color:c,fontWeight:700,display:"inline-flex",alignItems:"center",gap:3}}><span style={{width:5,height:5,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}</span>;
}
function Stars({n}){ return <span style={{color:"#f59e0b",fontSize:"0.8rem"}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>; }
function MultiLinks({links}){
  if(!links||links.length===0) return null;
  return <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:9}}>
    {links.map((p,i)=>(
      <a key={i} href={p.url} target="_blank" rel="noreferrer"
        onClick={e=>e.stopPropagation()}
        style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)",fontSize:"0.68rem",textDecoration:"none",transition:"all 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
        {p.logo} <span style={{fontWeight:600}}>{p.name}</span> <CommBadge pct={p.commission}/>
        <span style={{fontSize:"0.6rem",opacity:0.5}}>↗</span>
      </a>
    ))}
  </div>;
}
function CardWrap({accent,selected,best,onClick,children}){
  return <div onClick={onClick} style={{borderRadius:14,padding:"14px 16px",cursor:"pointer",position:"relative",border:selected?`1.5px solid ${accent}`:best?`1.5px solid ${accent}55`:`1px solid rgba(255,255,255,0.07)`,background:selected?accent+"0d":"rgba(255,255,255,0.022)",transition:"border 0.18s"}}>
    {best&&!selected&&<span style={{position:"absolute",top:-9,left:14,background:"#10b981",color:"#fff",fontSize:"0.58rem",fontWeight:800,padding:"2px 8px",borderRadius:20}}>✦ MIGLIOR Q/P</span>}
    {selected&&<span style={{position:"absolute",top:-9,left:14,background:accent,color:"#000",fontSize:"0.58rem",fontWeight:800,padding:"2px 8px",borderRadius:20}}>SELEZIONATO ✓</span>}
    {children}
  </div>;
}

function FlightCard({f,sel,best,onSel,showAR,dateOut,dateReturn}){
  const [showFlex,setShowFlex]=useState(false);
  const displayPrice=showAR?f.totRT:f.totOW;
  const displayPPP=showAR?f.pppRT:f.pppOW;
  const deepLinks = buildFlightLinks({ orig:f.orig, dest:f.dest, destCity:f.dest, dateOut, dateReturn, pax:f.pax, airline:f.airline });
  return <CardWrap accent="#38bdf8" selected={sel} best={best} onClick={onSel}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontWeight:700,color:"#e2e8f0",fontSize:"0.88rem"}}>{f.airline}</span>
        {f.budget&&<span style={{fontSize:"0.58rem",padding:"1px 7px",borderRadius:8,background:"#10b98120",border:"1px solid #10b98155",color:"#10b981",fontWeight:700}}>LOW COST</span>}
        <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.32)",background:"rgba(255,255,255,0.06)",padding:"1px 7px",borderRadius:6}}>{f.cls}</span>
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:"1.15rem",fontWeight:800,color:"#38bdf8"}}>{eur(displayPrice)}</div>
        <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.32)"}}>{eur(displayPPP)}/pers · {f.pax} pass. · {showAR?"A/R":"Solo andata"}</div>
        {showAR&&f.nights>0&&<div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.25)"}}>{f.nights} notti · ritorno incluso</div>}
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:9,flexWrap:"wrap"}}>
      <div style={{textAlign:"center"}}><div style={{fontWeight:800,color:"#fff",fontSize:"0.95rem"}}>{f.dep}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{f.orig}</div></div>
      <div style={{flex:1,minWidth:60,textAlign:"center"}}>
        <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.32)",marginBottom:2}}>{f.dur} · {f.stops===0?"Diretto":`${f.stops} scalo`}</div>
        <div style={{height:1,background:"linear-gradient(90deg,#38bdf8,rgba(56,189,248,0.18))",position:"relative"}}><div style={{position:"absolute",right:0,top:-3,width:6,height:6,borderRadius:"50%",background:"#38bdf8"}}/></div>
      </div>
      <div style={{textAlign:"center"}}><div style={{fontWeight:800,color:"#fff",fontSize:"0.95rem"}}>{f.arr}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{f.dest}</div></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:9,flexWrap:"wrap"}}>
      <QpBadge score={f.score}/>
      <span style={{fontSize:"0.64rem",color:"rgba(255,255,255,0.32)"}}>{f.baggage?"🧳 Bagaglio incl.":"🎒 Solo cabina"} · {f.punct}% puntuale</span>
      <span style={{marginLeft:"auto"}}><CommBadge pct={f.platform?.commission||"0%"}/></span>
    </div>
    <MultiLinks links={deepLinks}/>
    {f.flexVariants&&f.flexVariants.length>0&&<>
      <button onClick={e=>{e.stopPropagation();setShowFlex(!showFlex);}} style={{marginTop:8,fontSize:"0.68rem",background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:7,padding:"3px 10px",color:"#38bdf8",cursor:"pointer"}}>
        {showFlex?"▲ Nascondi":"🗓️ Date flessibili ±"+Math.ceil(f.flexVariants.length/2)+" settimane"}
      </button>
      {showFlex&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
        {f.flexVariants.sort((a,b)=>a.price-b.price).map((v,i)=>(
          <span key={i} style={{fontSize:"0.65rem",padding:"3px 9px",borderRadius:8,background:i===0?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.04)",border:i===0?"1px solid #10b98155":"1px solid rgba(255,255,255,0.08)",color:i===0?"#10b981":"rgba(255,255,255,0.5)"}}>
            {v.offset>0?"+":""}{v.offset}gg ({v.date}) {eur(v.price)} {i===0?"✦ più economico":""}
          </span>
        ))}
      </div>}
    </>}
  </CardWrap>;
}

function HotelCard({h,sel,best,onSel,dest,dateOut,dateReturn,boardType}){
  const deepLinks = buildHotelLinks({ destCity:dest, dateOut, dateReturn, pax:h.n?1:1, hotelName:h.name, boardType });
  return <CardWrap accent="#a78bfa" selected={sel} best={best} onClick={onSel}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
      <div><div style={{fontWeight:700,color:"#e2e8f0",fontSize:"0.88rem",marginBottom:4}}>{h.name}</div><div style={{display:"flex",alignItems:"center",gap:8}}><Stars n={h.stars}/><span style={{color:"rgba(255,255,255,0.38)",fontSize:"0.7rem"}}>📍 {h.zone}</span></div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:"1.15rem",fontWeight:800,color:"#a78bfa"}}>{eur(h.tot)}</div><div style={{fontSize:"0.64rem",color:"rgba(255,255,255,0.32)"}}>{eur(h.ppn)}/notte · {h.n} notti</div></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:9,marginTop:9,flexWrap:"wrap"}}>
      <div style={{background:"#f59e0b20",border:"1px solid #f59e0b44",borderRadius:8,padding:"3px 9px",display:"flex",alignItems:"center",gap:4}}><span style={{color:"#f59e0b",fontWeight:800,fontSize:"0.86rem"}}>{h.rating}</span><span style={{color:"rgba(255,255,255,0.32)",fontSize:"0.65rem"}}>({h.revs.toLocaleString("it")} rec.)</span></div>
      <QpBadge score={h.score}/>
      <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.32)"}}>🔄 {h.cancel}</span>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{h.amenities.map(a=><span key={a} style={{fontSize:"0.62rem",padding:"2px 8px",borderRadius:6,background:"rgba(167,139,250,0.1)",color:"#c4b5fd",border:"1px solid rgba(167,139,250,0.18)"}}>{a}</span>)}</div>
    <MultiLinks links={deepLinks}/>
  </CardWrap>;
}

function ResortCard({r,sel,best,onSel,dest,dateOut,dateReturn}){
  const deepLinks = buildResortLinks({ destCity:dest, dateOut, dateReturn, pax:r.pax, resortName:r.name, chain:r.co });
  return <CardWrap accent="#fb923c" selected={sel} best={best} onClick={onSel}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
      <div>
        <div style={{fontWeight:700,color:"#e2e8f0",fontSize:"0.88rem",marginBottom:5}}>{r.name}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <span style={{background:"#fb923c20",color:"#fb923c",fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:6,border:"1px solid #fb923c44"}}>{r.treat}</span>
          {r.features.beach&&<span style={{background:"rgba(56,189,248,0.1)",color:"#38bdf8",fontSize:"0.65rem",padding:"2px 8px",borderRadius:6,border:"1px solid rgba(56,189,248,0.2)"}}>🏖️ Spiaggia</span>}
          {r.features.kids&&<span style={{background:"rgba(250,204,21,0.1)",color:"#fbbf24",fontSize:"0.65rem",padding:"2px 8px",borderRadius:6,border:"1px solid rgba(250,204,21,0.2)"}}>👶 Kids Club</span>}
          {r.features.spa&&<span style={{background:"rgba(167,139,250,0.1)",color:"#a78bfa",fontSize:"0.65rem",padding:"2px 8px",borderRadius:6,border:"1px solid rgba(167,139,250,0.2)"}}>🧖 Spa</span>}
        </div>
      </div>
      <div style={{textAlign:"right"}}><div style={{fontSize:"1.15rem",fontWeight:800,color:"#fb923c"}}>{eur(r.tot)}</div><div style={{fontSize:"0.64rem",color:"rgba(255,255,255,0.32)"}}>{eur(r.ppn)}/notte · {r.pax} pers.</div></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:9,marginTop:9,flexWrap:"wrap"}}>
      <div style={{background:"#f59e0b20",border:"1px solid #f59e0b44",borderRadius:8,padding:"3px 9px"}}><span style={{color:"#f59e0b",fontWeight:800,fontSize:"0.86rem"}}>{r.rating}</span></div>
      <QpBadge score={r.score}/>
      {r.features.animation&&<span style={{fontSize:"0.64rem",color:"rgba(255,255,255,0.38)"}}>🎭 Animazione</span>}
    </div>
    {r.sportsArr.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{r.sportsArr.map(s=><span key={s} style={{fontSize:"0.62rem",padding:"2px 8px",borderRadius:6,background:"rgba(251,146,60,0.1)",color:"#fdba74",border:"1px solid rgba(251,146,60,0.18)"}}>{s}</span>)}</div>}
    <MultiLinks links={deepLinks}/>
  </CardWrap>;
}

function Summary({sel,pax,onReset}){
  const tot=(sel.fl?.totRT||0)+(sel.ht?.tot||sel.rs?.tot||0);
  if(!sel.fl&&!sel.ht&&!sel.rs) return null;
  const SumRow=({c,icon,label,val,pf})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9,flexWrap:"wrap",gap:4}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <span>{icon}</span><span style={{color:c,fontSize:"0.8rem"}}>{label}</span>
        {pf&&<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:"0.6rem",padding:"1px 6px",borderRadius:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.38)"}}>{pf.name} <CommBadge pct={pf.commission}/></span>}
      </div>
      <span style={{color:c,fontWeight:700,fontSize:"0.88rem"}}>{val}</span>
    </div>
  );
  return <div style={{background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.22)",borderRadius:18,padding:20,marginTop:22}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <span style={{color:"#10b981",fontWeight:800,fontSize:"0.92rem"}}>🏆 Selezione corrente</span>
      <button onClick={onReset} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"3px 11px",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"0.72rem"}}>Azzera</button>
    </div>
    {sel.fl&&<SumRow c="#38bdf8" icon="✈️" label={`${sel.fl.airline} · ${sel.fl.orig}→${sel.fl.dest} A/R (${sel.fl.cls})`} val={eur(sel.fl.totRT)} pf={sel.fl.platform}/>}
    {sel.ht&&<SumRow c="#a78bfa" icon="🏨" label={`${sel.ht.name} · ${sel.ht.n} notti`} val={eur(sel.ht.tot)} pf={sel.ht.platform}/>}
    {sel.rs&&<SumRow c="#fb923c" icon="🌴" label={`${sel.rs.name} · ${sel.rs.treat}`} val={eur(sel.rs.tot)} pf={sel.rs.platform}/>}
    <div style={{borderTop:"1px solid rgba(16,185,129,0.16)",paddingTop:11,display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
      <div><div style={{color:"rgba(255,255,255,0.5)",fontWeight:600,fontSize:"0.85rem"}}>TOTALE STIMATO</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.28)",marginTop:2}}>volo A/R incluso</div></div>
      <span style={{fontSize:"1.4rem",fontWeight:800,color:"#10b981"}}>{eur(tot)}</span>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════
// 🚀 APP
// ══════════════════════════════════════════════════════════════
const TABS=[
  {key:"fl",label:"✈️ Voli",   color:"#38bdf8"},
  {key:"ht",label:"🏨 Hotel",  color:"#a78bfa"},
  {key:"rs",label:"🌴 Resort", color:"#fb923c"},
];

export default function App(){
  const [step,setStep]=useState("search");
  const [form,setForm]=useState({dest:"",dateOut:"",dateRet:"",adults:2,children:[],pax:2,flexWeeks:0,originIata:"BLQ",boardType:"any"});
  const [showAR,setShowAR]=useState(true);
  const [hotelFilters,setHotelFilters]=useState([]);
  const [resortFilters,setResortFilters]=useState([]);
  const [showHF,setShowHF]=useState(false);
  const [showRF,setShowRF]=useState(false);
  const [data,setData]=useState({fl:[],ht:[],rs:[]});
  const [sel,setSel]=useState({fl:null,ht:null,rs:null});
  const [tab,setTab]=useState("fl");
  const [msg,setMsg]=useState("");
  const [prog,setProg]=useState(0);

  const steps=["🔍 Ricerca in corso...","✈️ Voli Ryanair, EasyJet, ITA...","🏨 Hotel con filtri selezionati...","🌴 Resort e villaggi...","📊 Calcolo score Q/P...","🏆 Ordinamento offerte..."];

  function toggleF(arr,setArr,id){ setArr(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }

  function search(){
    if(!form.dest.trim()) return;
    setStep("loading"); setProg(0);
    let i=0;
    const iv=setInterval(()=>{
      setMsg(steps[i%steps.length]);
      setProg(Math.min(95,Math.round((i+1)/steps.length*95)));
      i++;
      if(i>=steps.length){
        clearInterval(iv);
        setTimeout(()=>{
          const totalPax = form.adults + form.children.length;
          const p={dest:form.dest,dateOut:form.dateOut,dateReturn:form.dateRet,pax:totalPax,flexWeeks:form.flexWeeks,originIata:form.originIata};
          const fl=genFlights(p);
          const ht=genHotels({...p,filters:hotelFilters});
          const rs=genResorts({...p,filters:resortFilters});
          setData({fl,ht,rs});
          setSel({fl:fl[0]||null,ht:null,rs:null});
          setTab("fl");
          setProg(100);
          setTimeout(()=>setStep("results"),280);
        },380);
      }
    },500);
  }

  function reset(){ setStep("search"); setData({fl:[],ht:[],rs:[]}); setSel({fl:null,ht:null,rs:null}); }

  const originInfo = ORIGINS.find(o=>o.iata===form.originIata)||ORIGINS[0];
  const originsByRegion = ORIGINS.reduce((acc,o)=>{ if(!acc[o.region]) acc[o.region]=[]; acc[o.region].push(o); return acc; },{});

  return <div style={{minHeight:"100vh",background:"#06060e",color:"#e2e8f0",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700;800&display=swap');
      @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      *{box-sizing:border-box}
      ::-webkit-scrollbar{width:3px}
      ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
      input,select,button{outline:none;font-family:inherit}
      input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
      a{text-decoration:none}
    `}</style>

    {/* NAV */}
    <nav style={{background:"rgba(255,255,255,0.025)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:29,height:29,borderRadius:8,background:"linear-gradient(135deg,#38bdf8,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✈</div>
        <div>
          <span style={{fontWeight:800,fontSize:"0.88rem"}}>TravelAgent <span style={{color:"#38bdf8"}}>Pro</span></span>
          <span style={{color:"rgba(255,255,255,0.28)",fontSize:"0.68rem",marginLeft:8}}>{originInfo.city} {originInfo.iata} · Commissioni minime</span>
        </div>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {[["✈ Ryanair/EasyJet","#38bdf8"],["🏨 HotelBeds","#a78bfa"],["🌴 Alpitour/Direct","#fb923c"]].map(([l,c])=>(
          <span key={l} style={{padding:"2px 8px",borderRadius:20,background:c+"18",border:`1px solid ${c}30`,color:c,fontSize:"0.62rem",fontWeight:600}}>{l}</span>
        ))}
      </div>
    </nav>

    {/* SEARCH */}
    {step==="search"&&<div style={{maxWidth:620,margin:"40px auto",padding:"0 16px",animation:"fadeIn 0.45s ease"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <h1 style={{fontSize:"clamp(1.5rem,5vw,2.3rem)",fontWeight:800,margin:"0 0 10px",letterSpacing:"-0.03em",lineHeight:1.1}}>
          Voli · Hotel · Resort<br/>
          <span style={{background:"linear-gradient(90deg,#38bdf8,#a78bfa,#fb923c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Commissioni minime garantite</span>
        </h1>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.85rem",margin:0}}>17 aeroporti italiani · Prezzi A/R · Date flessibili · Filtri avanzati</p>
      </div>

      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:22,display:"flex",flexDirection:"column",gap:14}}>

        {/* Aeroporto partenza */}
        <div>
          <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>🛫 Aeroporto di partenza</label>
          <select value={form.originIata} onChange={e=>setForm(f=>({...f,originIata:e.target.value}))}
            style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:"0.88rem"}}>
            {Object.entries(originsByRegion).map(([region,airports])=>(
              <optgroup key={region} label={"── "+region} style={{background:"#0f0f1e"}}>
                {airports.map(o=><option key={o.iata} value={o.iata} style={{background:"#0f0f1e"}}>{o.city} ({o.iata})</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Destinazione */}
        <div>
          <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>📍 Destinazione</label>
          <input list="dests" value={form.dest} onChange={e=>setForm(f=>({...f,dest:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Es. Sardegna, Atene, Dubai, Barcellona…"
            style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:"0.92rem"}}
            onFocus={e=>e.target.style.borderColor="#38bdf8"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
          <datalist id="dests">{Object.keys(DEST).map(d=><option key={d} value={d}/>)}</datalist>
        </div>

        {/* Date */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {[["Data andata","dateOut"],["Data ritorno","dateRet"]].map(([l,k])=>(
            <div key={k}>
              <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>{l}</label>
              <input type="date" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                style={{width:"100%",padding:"11px 12px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:"0.85rem"}}/>
            </div>
          ))}
        </div>

        {/* Date flessibili */}
        <div>
          <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>🗓️ Date flessibili</label>
          <div style={{display:"flex",gap:6}}>
            {[{v:0,l:"Date fisse"},{v:1,l:"±1 sett."},{v:2,l:"±2 sett."},{v:3,l:"±3 sett."}].map(({v,l})=>(
              <button key={v} onClick={()=>setForm(f=>({...f,flexWeeks:v}))}
                style={{flex:1,padding:"8px 0",borderRadius:9,border:form.flexWeeks===v?"1.5px solid #38bdf8":"1px solid rgba(255,255,255,0.1)",background:form.flexWeeks===v?"rgba(56,189,248,0.1)":"rgba(255,255,255,0.03)",color:form.flexWeeks===v?"#38bdf8":"rgba(255,255,255,0.42)",fontWeight:700,cursor:"pointer",fontSize:"0.72rem"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Passeggeri dettagliati */}
        <div>
          <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>👥 Passeggeri</label>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Adulti */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10}}>
              <div><div style={{fontWeight:600,fontSize:"0.85rem"}}>👤 Adulti</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>18+ anni</div></div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>setForm(f=>({...f,adults:Math.max(1,f.adults-1)}))} style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.05)",color:"#fff",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontWeight:800,fontSize:"1rem",minWidth:20,textAlign:"center"}}>{form.adults}</span>
                <button onClick={()=>setForm(f=>({...f,adults:Math.min(9,f.adults+1)}))} style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(56,189,248,0.4)",background:"rgba(56,189,248,0.1)",color:"#38bdf8",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
            {/* Bambini */}
            <div style={{padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:form.children.length>0?10:0}}>
                <div><div style={{fontWeight:600,fontSize:"0.85rem"}}>👶 Bambini</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>0-17 anni</div></div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <button onClick={()=>setForm(f=>({...f,children:f.children.slice(0,-1)}))} disabled={form.children.length===0} style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.05)",color:form.children.length===0?"rgba(255,255,255,0.2)":"#fff",cursor:form.children.length===0?"not-allowed":"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontWeight:800,fontSize:"1rem",minWidth:20,textAlign:"center"}}>{form.children.length}</span>
                  <button onClick={()=>setForm(f=>({...f,children:[...f.children,2]}))} disabled={form.children.length>=6} style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(251,146,60,0.4)",background:"rgba(251,146,60,0.1)",color:"#fb923c",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
              {/* Età bambini */}
              {form.children.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {form.children.map((age,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.4)"}}>Bimbo {i+1}</div>
                    <select value={age} onChange={e=>setForm(f=>({...f,children:f.children.map((a,j)=>j===i?parseInt(e.target.value):a)}))}
                      style={{padding:"5px 8px",borderRadius:8,background:"rgba(251,146,60,0.1)",border:"1px solid rgba(251,146,60,0.3)",color:"#fb923c",fontSize:"0.8rem",fontWeight:700}}>
                      {Array.from({length:18},(_,a)=><option key={a} value={a} style={{background:"#0f0f1e"}}>{a===0?"<1":a} {a===1?"anno":"anni"}</option>)}
                    </select>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        </div>

        {/* Tipo pensione Hotel */}
        <div>
          <label style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>🍽️ Tipo pensione (Hotel)</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {[
              {v:"any",    l:"Qualsiasi"},
              {v:"ro",     l:"Solo pernottamento"},
              {v:"bb",     l:"B&B"},
              {v:"hb",     l:"Mezza pensione"},
              {v:"fb",     l:"Pensione completa"},
              {v:"ai",     l:"All Inclusive"},
            ].map(({v,l})=>(
              <button key={v} onClick={()=>setForm(f=>({...f,boardType:v}))}
                style={{padding:"6px 11px",borderRadius:9,border:form.boardType===v?"1.5px solid #a78bfa":"1px solid rgba(255,255,255,0.1)",background:form.boardType===v?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.03)",color:form.boardType===v?"#a78bfa":"rgba(255,255,255,0.45)",fontWeight:form.boardType===v?700:400,cursor:"pointer",fontSize:"0.72rem"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Filtri Hotel */}
        <div>
          <button onClick={()=>setShowHF(!showHF)} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px solid rgba(167,139,250,0.3)",background:"rgba(167,139,250,0.06)",color:"#a78bfa",fontWeight:700,cursor:"pointer",fontSize:"0.8rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>🏨 Filtri Hotel {hotelFilters.length>0?`· ${hotelFilters.length} attivi`:""}</span><span>{showHF?"▲":"▼"}</span>
          </button>
          {showHF&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {HOTEL_FILTERS.map(f=>(
              <button key={f.id} onClick={()=>toggleF(hotelFilters,setHotelFilters,f.id)}
                style={{padding:"5px 10px",borderRadius:8,border:hotelFilters.includes(f.id)?"1.5px solid #a78bfa":"1px solid rgba(255,255,255,0.1)",background:hotelFilters.includes(f.id)?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.03)",color:hotelFilters.includes(f.id)?"#a78bfa":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.72rem",fontWeight:hotelFilters.includes(f.id)?700:400}}>
                {f.label}
              </button>
            ))}
          </div>}
        </div>

        {/* Filtri Resort */}
        <div>
          <button onClick={()=>setShowRF(!showRF)} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px solid rgba(251,146,60,0.3)",background:"rgba(251,146,60,0.06)",color:"#fb923c",fontWeight:700,cursor:"pointer",fontSize:"0.8rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>🌴 Filtri Resort {resortFilters.length>0?`· ${resortFilters.length} attivi`:""}</span><span>{showRF?"▲":"▼"}</span>
          </button>
          {showRF&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {RESORT_FILTERS.map(f=>(
              <button key={f.id} onClick={()=>toggleF(resortFilters,setResortFilters,f.id)}
                style={{padding:"5px 10px",borderRadius:8,border:resortFilters.includes(f.id)?"1.5px solid #fb923c":"1px solid rgba(255,255,255,0.1)",background:resortFilters.includes(f.id)?"rgba(251,146,60,0.15)":"rgba(255,255,255,0.03)",color:resortFilters.includes(f.id)?"#fb923c":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.72rem",fontWeight:resortFilters.includes(f.id)?700:400}}>
                {f.label}
              </button>
            ))}
          </div>}
        </div>

        <button onClick={search} disabled={!form.dest.trim()}
          style={{padding:"13px",borderRadius:11,border:"none",background:form.dest.trim()?"linear-gradient(135deg,#38bdf8,#6366f1)":"rgba(255,255,255,0.05)",color:"#fff",fontWeight:800,fontSize:"0.92rem",cursor:form.dest.trim()?"pointer":"not-allowed",boxShadow:form.dest.trim()?"0 6px 26px rgba(56,189,248,0.22)":"none",transition:"all 0.18s"}}>
          🚀 Cerca con commissioni minime
        </button>
      </div>
    </div>}

    {/* LOADING */}
    {step==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",gap:20,animation:"fadeIn 0.3s ease"}}>
      <div style={{width:50,height:50,borderRadius:"50%",border:"2.5px solid rgba(56,189,248,0.15)",borderTop:"2.5px solid #38bdf8",animation:"spin 0.85s linear infinite"}}/>
      <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:"0.98rem",marginBottom:5}}>{msg}</div><div style={{color:"rgba(255,255,255,0.28)",fontSize:"0.75rem"}}>{form.originIata} → {form.dest} · {form.adults} adulti{form.children.length>0?` · ${form.children.length} bambini`:""}</div></div>
      <div style={{width:240,height:3,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#38bdf8,#6366f1)",width:`${prog}%`,transition:"width 0.48s ease",borderRadius:3}}/></div>
      <span style={{color:"#38bdf8",fontSize:"0.75rem",fontWeight:600}}>{prog}%</span>
    </div>}

    {/* RESULTS */}
    {step==="results"&&<div style={{maxWidth:820,margin:"0 auto",padding:"20px 16px 68px",animation:"fadeIn 0.38s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{margin:"0 0 3px",fontWeight:800,fontSize:"1.15rem"}}>📍 {form.dest}</h2>
          <div style={{color:"rgba(255,255,255,0.38)",fontSize:"0.75rem"}}>{form.originIata}→{DEST[form.dest]?.iata||"?"} · {form.adults} adulti{form.children.length>0?` · ${form.children.length} bambini (${form.children.join(", ")} anni)`:""} · {data.fl.length} voli · {data.ht.length} hotel · {data.rs.length} resort</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,overflow:"hidden"}}>
            <button onClick={()=>setShowAR(true)} style={{padding:"6px 12px",border:"none",background:showAR?"rgba(56,189,248,0.2)":"transparent",color:showAR?"#38bdf8":"rgba(255,255,255,0.4)",fontWeight:showAR?700:400,cursor:"pointer",fontSize:"0.72rem"}}>✈️ A/R</button>
            <button onClick={()=>setShowAR(false)} style={{padding:"6px 12px",border:"none",background:!showAR?"rgba(56,189,248,0.2)":"transparent",color:!showAR?"#38bdf8":"rgba(255,255,255,0.4)",fontWeight:!showAR?700:400,cursor:"pointer",fontSize:"0.72rem"}}>Solo andata</button>
          </div>
          <button onClick={reset} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"6px 13px",color:"rgba(255,255,255,0.46)",cursor:"pointer",fontSize:"0.76rem"}}>← Nuova ricerca</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:3,marginBottom:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:3}}>
        {TABS.map(t=>{
          const cnt=t.key==="fl"?data.fl.length:t.key==="ht"?data.ht.length:data.rs.length;
          return <button key={t.key} onClick={()=>setTab(t.key)}
            style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab===t.key?t.color+"16":"transparent",color:tab===t.key?t.color:"rgba(255,255,255,0.35)",fontWeight:tab===t.key?700:400,cursor:"pointer",fontSize:"0.75rem",borderBottom:tab===t.key?`2px solid ${t.color}`:"2px solid transparent",transition:"all 0.16s",whiteSpace:"nowrap"}}>
            {t.label} <span style={{opacity:0.55}}>({cnt})</span>{sel[t.key]?" ✓":""}
          </button>;
        })}
      </div>

      {tab==="ht"&&hotelFilters.length>0&&<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:10,fontSize:"0.72rem",color:"#c4b5fd",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        🔍 {hotelFilters.map(f=>HOTEL_FILTERS.find(x=>x.id===f)?.label).join(" · ")}
        <button onClick={()=>setHotelFilters([])} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"2px 8px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.65rem"}}>Rimuovi filtri</button>
      </div>}
      {tab==="rs"&&resortFilters.length>0&&<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(251,146,60,0.07)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:10,fontSize:"0.72rem",color:"#fdba74",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        🔍 {resortFilters.map(f=>RESORT_FILTERS.find(x=>x.id===f)?.label).join(" · ")}
        <button onClick={()=>setResortFilters([])} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"2px 8px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.65rem"}}>Rimuovi filtri</button>
      </div>}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {tab==="fl"&&(data.fl.length>0?data.fl.map((f,i)=><FlightCard key={f.id} f={f} sel={sel.fl?.id===f.id} best={i===0} onSel={()=>setSel(s=>({...s,fl:f}))} showAR={showAR} dateOut={form.dateOut} dateReturn={form.dateRet}/>):<div style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.3)"}}>Nessun volo trovato</div>)}
        {tab==="ht"&&(data.ht.length>0?data.ht.map((h,i)=><HotelCard key={h.id} h={h} sel={sel.ht?.id===h.id} best={i===0} onSel={()=>setSel(s=>({...s,ht:h,rs:null}))} dest={form.dest} dateOut={form.dateOut} dateReturn={form.dateRet} boardType={form.boardType}/>):<div style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.3)"}}>Nessun hotel con questi filtri. <button onClick={()=>setHotelFilters([])} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",textDecoration:"underline"}}>Rimuovi filtri</button></div>)}
        {tab==="rs"&&(data.rs.length>0?data.rs.map((r,i)=><ResortCard key={r.id} r={r} sel={sel.rs?.id===r.id} best={i===0} onSel={()=>setSel(s=>({...s,rs:r,ht:null}))} dest={form.dest} dateOut={form.dateOut} dateReturn={form.dateRet}/>):<div style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.3)"}}>Nessun resort con questi filtri. <button onClick={()=>setResortFilters([])} style={{background:"none",border:"none",color:"#fb923c",cursor:"pointer",textDecoration:"underline"}}>Rimuovi filtri</button></div>)}
      </div>

      <Summary sel={sel} pax={form.pax} onReset={()=>setSel({fl:null,ht:null,rs:null})}/>

      <div style={{marginTop:22,padding:"11px 14px",borderRadius:10,background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.14)",fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",lineHeight:1.85}}>
        <strong style={{color:"rgba(99,102,241,0.65)"}}>ℹ️ Modalità Demo</strong> · Per dati live: <strong style={{color:"#e2e8f0"}}>Voli</strong> → developers.amadeus.com · <strong style={{color:"#e2e8f0"}}>Hotel</strong> → hotelbeds.com (8% comm.) · <strong style={{color:"#e2e8f0"}}>Resort</strong> → alpitour.it / valtur.it
      </div>
    </div>}
  </div>;
}
