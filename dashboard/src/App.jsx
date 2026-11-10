import { supabase } from './lib/supabase';
import React, { useEffect, useMemo, useState } from 'react';
const initialRobots = [
 {id:'UGV-01',name:'Scout Alpha',state:'Exploring',battery:86,x:27,y:39,area:64,signal:'Strong',task:'Sector A · North corridor',color:'#54d6b0'},
 {id:'UGV-02',name:'Scout Beta',state:'Searching',battery:62,x:66,y:58,area:48,signal:'Strong',task:'Sector B · Main hall',color:'#77a9ff'},
 {id:'UGV-03',name:'Scout Gamma',state:'Returning',battery:29,x:48,y:77,area:31,signal:'Fair',task:'Returning to base',color:'#c49aff'}
];
const initialEvents = [
 {time:'14:32:08',type:'victim',title:'Possible victim detected',detail:'Sector B · Grid B4 · UGV-02',level:'High'},
 {time:'14:29:41',type:'hazard',title:'Elevated temperature alert',detail:'Sector A · Grid A2 · UGV-01',level:'Warning'},
 {time:'14:24:16',type:'robot',title:'UGV-03 returning to base',detail:'Battery reached 30%',level:'Info'},
 {time:'14:18:52',type:'system',title:'Mission started',detail:'Warehouse collapse simulation',level:'Info'}
];
function Badge({children,tone='green'}){return <span className={`badge ${tone}`}><i/>{children}</span>}
function MapPanel({robots}){return <section className="panel map-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE SITUATIONAL AWARENESS</p><h2>Disaster zone map</h2></div><div className="map-actions"><span className="live-dot">LIVE SIMULATION</span><button className="icon-button">☷</button></div></div><div className="map-wrap"><svg className="map" viewBox="0 0 760 420" role="img" aria-label="Illustrative disaster zone map with robot and event markers"><defs><pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" fill="none" stroke="#dce5e8" strokeWidth="1"/></pattern><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#f3b56b" strokeWidth="3" opacity=".45"/></pattern></defs><rect width="760" height="420" fill="#f5f8f6"/><rect width="760" height="420" fill="url(#grid)"/><path d="M28 35 H290 V142 H28 Z M324 35 H715 V175 H324 Z M28 190 H240 V380 H28 Z M275 215 H510 V380 H275 Z M545 205 H720 V380 H545 Z" fill="#e9efec" stroke="#cbd8d3" strokeWidth="2"/><path d="M290 35 L324 35 L324 175 L715 175 L715 205 L545 205 L545 380 L510 380 L510 215 L275 215 L275 190 L290 190 Z" fill="#fff" stroke="#d7e0dc" strokeWidth="2"/><path d="M324 35 H715 V175 H324 Z" fill="url(#hatch)" opacity=".55"/><path d="M38 152 L240 152 M240 152 L240 370 M330 190 L690 190" stroke="#c4d1cb" strokeWidth="5" strokeDasharray="10 8" fill="none"/><g fill="#71847c" fontSize="12" fontWeight="700"><text x="48" y="58">SECTOR A</text><text x="345" y="58">SECTOR B</text><text x="48" y="216">SECTOR C</text><text x="300" y="245">CENTRAL HALL</text><text x="565" y="235">SECTOR D</text></g><g fill="#d5e2dc" stroke="#aebfb6"><rect x="65" y="80" width="150" height="45" rx="5"/><rect x="370" y="83" width="125" height="53" rx="5"/><rect x="530" y="82" width="140" height="53" rx="5"/><rect x="70" y="265" width="125" height="72" rx="5"/><rect x="310" y="275" width="150" height="65" rx="5"/><rect x="585" y="270" width="100" height="75" rx="5"/></g><g fill="#879991" fontSize="10"><text x="111" y="107">BLOCK A1</text><text x="408" y="113">BLOCK B2</text><text x="574" y="113">BLOCK B3</text><text x="108" y="304">BLOCK C1</text><text x="356" y="310">BLOCK C2</text><text x="610" y="310">BLOCK D1</text></g><g><circle cx="428" cy="155" r="17" fill="#f5a34a" opacity=".18"/><path d="M428 143 L440 164 H416 Z" fill="#ee9a37"/><text x="428" y="159" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">!</text><text x="448" y="151" fontSize="11" fill="#a66a22" fontWeight="700">HAZARD</text></g><g><circle cx="610" cy="185" r="18" fill="#e56b72" opacity=".18"/><circle cx="610" cy="185" r="9" fill="#e56b72"/><path d="M606 185 h8 M610 181 v8" stroke="white" strokeWidth="2"/><text x="625" y="189" fontSize="11" fill="#b94c55" fontWeight="700">VICTIM</text></g>{robots.map(r=><g key={r.id} transform={`translate(${60 + Number(r.x)*64},${360 - Number(r.y)*50})`}><circle r="22" fill={r.color} opacity=".16"/><circle r="12" fill={r.color} stroke="#fff" strokeWidth="3"/><path d="M-5 -2 L5 -2 L0 6 Z" fill="#10243a"/><text x="18" y="4" fontSize="11" fontWeight="700" fill="#263b4a">{r.id}</text></g>)}<g transform="translate(24 392)"><circle r="5" fill="#54d6b0"/><text x="12" y="4" fontSize="10" fill="#6e8078">ROBOT</text><circle cx="83" r="5" fill="#e56b72"/><text x="95" y="4" fontSize="10" fill="#6e8078">VICTIM</text><path d="M170 -6 L177 7 H163 Z" fill="#ee9a37"/><text x="184" y="4" fontSize="10" fill="#6e8078">HAZARD</text></g></svg><div className="map-foot"><span>Map source: demonstration layout · Not connected to SLAM yet</span><span>Scale: illustrative</span></div></div></section>}
function RobotCard({robot}){return <div className="robot-card"><div className="robot-top"><div className="robot-avatar" style={{'--robot':robot.color}}>⌁</div><div className="robot-ident"><strong>{robot.id}</strong><span>{robot.name}</span></div><Badge tone={robot.state==='Returning'?'orange':'green'}>{robot.state}</Badge></div><div className="robot-task">{robot.task}</div><div className="battery-row"><span>Battery</span><strong>{Math.round(robot.battery)}%</strong></div><div className="progress"><span style={{width:`${robot.battery}%`,background:robot.battery<35?'#eea14b':robot.color}}/></div><div className="robot-bottom"><span>Area searched <b>{robot.area}%</b></span><span>Signal <b>{robot.signal}</b></span></div></div>}
function EventItem({event}){const symbol=event.type==='victim'?'✚':event.type==='hazard'?'!':event.type==='robot'?'⌁':'●';return <div className="event-item"><div className={`event-symbol ${event.type}`}>{symbol}</div><div className="event-copy"><strong>{event.title}</strong><span>{event.detail}</span></div><div className="event-meta"><b className={event.level.toLowerCase()}>{event.level}</b><time>{event.time}</time></div></div>}
export default function App(){const[robots,setRobots]=useState(initialRobots);const[events,setEvents]=useState(initialEvents);const[connected,setConnected]=useState(true);const[clock,setClock]=useState(new Date());const[activeTab,setActiveTab]=useState('Overview');const[missionRunning,setMissionRunning]=useState(true);useEffect(() => {
  let active = true;

  const fetchRobots = async () => {
    const { data, error } = await supabase
      .from("robots")
      .select("*")
      .order("robot_id");

    if (error) {
      console.error("Robot fetch error:", error.message);
      return;
    }

    if (active && Array.isArray(data) && data.length > 0) {
      setRobots(data.map(row => {
        const fallback = initialRobots.find(r => r.id === row.robot_id) || {};

        return {
          ...fallback,
          id: row.robot_id,
          name: row.robot_name,
          state: row.status,
          battery: Number(row.battery_level ?? fallback.battery ?? 0),
          x: Number(row.current_x ?? fallback.x ?? 50),
          y: Number(row.current_y ?? fallback.y ?? 50),
        };
      }));
    }
  };

  fetchRobots();

  const channel = supabase
    .channel("robots-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "robots",
      },
      () => {
        fetchRobots();
      }
    )
    .subscribe(status => {
      console.log("Realtime subscription status:", status);
    });

  const clockTimer = setInterval(() => {
    setClock(new Date());
  }, 1000);

  return () => {
    active = false;
    clearInterval(clockTimer);
    supabase.removeChannel(channel);
  };
}, []);const averageBattery=useMemo(()=>Math.round(robots.reduce((a,r)=>a+r.battery,0)/robots.length),[robots]);const totalProgress=Math.round(robots.reduce((a,r)=>a+r.area,0)/robots.length);const time=clock.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});function addDemoEvent(){const now=new Date().toLocaleTimeString([],{hour12:false});setEvents(p=>[{time:now,type:'victim',title:'New demo victim marker added',detail:'Sector C · Generated dashboard event',level:'High'},...p].slice(0,6))}return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">R</div><div><b>ResQ</b><small>COMMAND CENTER</small></div></div><div className="workspace-label">WORKSPACE</div><nav>{['Overview','Live Map','Robots','Victims & Hazards','Mission History','Cloud Sync'].map((item,i)=><button key={item} onClick={()=>setActiveTab(item)} className={activeTab===item?'nav-item active':'nav-item'}><span>{['▦','⌖','▣','⚑','◷','☁'][i]}</span>{item}{item==='Cloud Sync'&&<em>PHASE 2</em>}</button>)}</nav><div className="sidebar-bottom"><div className="edge-card"><div className="edge-icon">⌁</div><div><b>Edge station</b><span><i className="status-pip"/> Local network active</span></div></div><div className="sidebar-user"><div className="user-avatar">DR</div><div><b>Disaster Response</b><span>Operator console</span></div><span className="dots">•••</span></div></div></aside><main className="main-content"><header className="topbar"><div><div className="breadcrumb">Workspace <span>/</span> {activeTab}</div><h1>{activeTab==='Overview'?'Mission overview':activeTab}</h1></div><div className="top-actions"><div className="connection"><span className={`connection-dot ${connected?'':'off'}`}/><div><b>{connected?'Edge connected':'Disconnected'}</b><small>{connected?'Local network · Demo mode':'No edge connection'}</small></div></div><button className="outline-button" onClick={()=>setConnected(v=>!v)}>{connected?'Simulate offline':'Reconnect demo'}</button><div className="clock">{time}<small>LOCAL TIME</small></div></div></header><section className="welcome-row"><div><p className="eyebrow">DISASTER RESPONSE OPERATIONS</p><h2>Good afternoon, Operator <span>✦</span></h2><p className="muted">Monitor your fleet, review detections and track mission progress.</p></div><div className="mission-state"><span className="pulse"/><div><small>MISSION STATUS</small><b>{missionRunning?'Active operation':'Mission paused'}</b></div><button onClick={()=>setMissionRunning(v=>!v)}>{missionRunning?'Pause mission':'Resume mission'}</button></div></section><section className="stats-grid"><div className="stat-card"><div className="stat-label">ROBOTS ONLINE <span>▣</span></div><strong>03 <small>/ 03</small></strong><div className="stat-note positive">All simulated units connected</div></div><div className="stat-card"><div className="stat-label">VICTIMS DETECTED <span>✚</span></div><strong>02</strong><div className="stat-note warning">1 requires verification</div></div><div className="stat-card"><div className="stat-label">ACTIVE HAZARDS <span>⚠</span></div><strong>01</strong><div className="stat-note warning">Elevated temperature · Sector A</div></div><div className="stat-card"><div className="stat-label">AVG. BATTERY <span>ϟ</span></div><strong>{averageBattery}<small>%</small></strong><div className="stat-note">{averageBattery<45?'Fleet battery is low':'Fleet power is healthy'}</div></div><div className="stat-card"><div className="stat-label">SEARCH PROGRESS <span>◴</span></div><strong>{totalProgress}<small>%</small></strong><div className="mini-progress"><span style={{width:`${totalProgress}%`}}/></div></div></section><div className="content-grid"><MapPanel robots={robots}/><section className="panel fleet-panel"><div className="panel-heading"><div><p className="eyebrow">FLEET MANAGEMENT</p><h2>Robot status</h2></div><button className="text-button" onClick={()=>setActiveTab('Robots')}>View all →</button></div><div className="robot-list">{robots.map(r=><RobotCard key={r.id} robot={r}/>)}</div></section></div><div className="bottom-grid"><section className="panel events-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE EVENT STREAM</p><h2>Victims & hazard alerts</h2></div><button className="text-button" onClick={addDemoEvent}>+ Add demo event</button></div><div className="events-list">{events.slice(0,4).map((e,i)=><EventItem key={`${e.time}-${i}`} event={e}/>)}</div></section><section className="panel progress-panel"><div className="panel-heading"><div><p className="eyebrow">MISSION TRACKING</p><h2>Search progress</h2></div><span className="subtle-tag">DEMO DATA</span></div><div className="progress-summary"><strong>{totalProgress}%</strong><span>of target area explored</span></div><div className="large-progress"><span style={{width:`${totalProgress}%`}}/></div><div className="progress-stats"><div><span>Explored</span><b>1,280 m²</b></div><div><span>Remaining</span><b>720 m²</b></div><div><span>Elapsed</span><b>00:42:18</b></div></div><div className="sync-note"><span>☁</span><div><b>Remote cloud sync</b><small>Phase 2 · AWS integration planned</small></div><Badge tone="orange">Not configured</Badge></div></section></div><footer><span>ResQ · Multi-Robot Disaster Response System</span><span>Prototype UI · Demonstration data only · Not connected to ROS 2 or AWS</span></footer></main></div>}
