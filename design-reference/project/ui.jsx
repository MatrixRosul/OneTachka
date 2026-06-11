// ui.jsx — Onetachka shared design tokens + primitives
// Exports to window: T (tokens), Icon, Truck, CargoChip, PrimaryBtn, TabBar, MapBg, Avatar, Logo

const T = {
  ink:    '#1E3A8A',   // brand deep blue
  ink2:   '#2A4BA8',
  accent: '#F2C84B',   // brand yellow
  accentDark: '#E0B62F',
  bg:     '#F5F5F1',   // warm off-white app bg
  surface:'#FFFFFF',
  txt:    '#1E3A8A',
  txt2:   '#6C6F78',
  txt3:   '#A4A7AF',
  border: '#EAE9E4',
  line:   '#F0EFEA',
  green:  '#1FA86A',
  greenBg:'#E6F4EC',
  radSheet: 30,
  radCard: 22,
  radBtn: 16,
  font: "'Manrope', -apple-system, system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, 'SF Mono', monospace",
};

// ── Minimal stroke icons ───────────────────────────────────
function Icon({ name, size = 24, color = T.ink, stroke = 2, fill = 'none', style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:   <><path {...p} d="M3 11.5 12 4l9 7.5"/><path {...p} d="M5.5 10v9.5h13V10"/></>,
    box:    <><path {...p} d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path {...p} d="M3 8l9 5 9-5M12 13v8"/></>,
    chat:   <><path {...p} d="M4 5h16v11H9l-5 4V5Z"/></>,
    user:   <><circle {...p} cx="12" cy="8" r="3.6"/><path {...p} d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5"/></>,
    pin:    <><path {...p} d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.8 7 11Z"/><circle {...p} cx="12" cy="10" r="2.4"/></>,
    arrow:  <><path {...p} d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowUR:<><path {...p} d="M7 17 17 7M8 7h9v9"/></>,
    clock:  <><circle {...p} cx="12" cy="12" r="8.5"/><path {...p} d="M12 7.5V12l3 2"/></>,
    star:   <><path fill={color} stroke={color} strokeWidth="1" d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z"/></>,
    spark:  <><path {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path {...p} d="M7 7l2.5 2.5M14.5 14.5 17 17M17 7l-2.5 2.5M9.5 14.5 7 17"/></>,
    shield: <><path {...p} d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z"/><path {...p} d="m9 12 2 2 4-4"/></>,
    plus:   <><path {...p} d="M12 5v14M5 12h14"/></>,
    search: <><circle {...p} cx="11" cy="11" r="7"/><path {...p} d="m20 20-3.5-3.5"/></>,
    dot:    <><circle cx="12" cy="12" r="4" fill={color}/></>,
    chevR:  <><path {...p} d="m9 6 6 6-6 6"/></>,
    menu:   <><path {...p} d="M4 7h16M4 12h16M4 17h16"/></>,
    bell:   <><path {...p} d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path {...p} d="M10 20a2 2 0 0 0 4 0"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>{paths[name]}</svg>;
}

// ── Truck silhouette (size variants) — simple geometry ─────
function Truck({ size = 'm', color = T.ink, w = 46 }) {
  // small=van, m=box truck, l=big truck — drawn as simple boxes
  const cfg = {
    s: { body: [14, 8, 18, 12], cab: [2, 12, 12, 8], wheels: [9, 26] },
    m: { body: [12, 5, 22, 15], cab: [2, 11, 10, 9], wheels: [8, 28] },
    l: { body: [10, 3, 28, 17], cab: [1, 10, 9, 10], wheels: [7, 21, 32] },
  }[size];
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 44 28">
      <rect x={cfg.cab[0]} y={cfg.cab[1]} width={cfg.cab[2]} height={cfg.cab[3]} rx="2.5" fill={color}/>
      <rect x={cfg.body[0]} y={cfg.body[1]} width={cfg.body[2]} height={cfg.body[3]} rx="2.5" fill={color} opacity="0.92"/>
      {cfg.wheels.map((x, i) => <circle key={i} cx={x} cy="25" r="3.4" fill={color}/>)}
    </svg>
  );
}

// ── Cargo size chip / card ─────────────────────────────────
function CargoChip({ size, label, sub, active, onClick, big }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, cursor: 'pointer', textAlign: 'left',
      background: active ? T.ink : T.surface,
      border: `1.5px solid ${active ? T.ink : T.border}`,
      borderRadius: 16, padding: big ? '14px 14px 12px' : '11px 10px',
      display: 'flex', flexDirection: 'column', gap: big ? 10 : 6,
      transition: 'all .18s ease', minWidth: 0,
    }}>
      <Truck size={size} color={active ? T.accent : T.ink} w={big ? 44 : 38}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: big ? 15 : 13.5, color: active ? '#fff' : T.txt, letterSpacing: -0.2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: active ? 'rgba(255,255,255,.6)' : T.txt3, marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

function PrimaryBtn({ children, onClick, color = T.accent, txt = T.ink, style, icon, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      width: '100%', height: 56, border: 'none', borderRadius: T.radBtn, cursor: disabled ? 'default' : 'pointer',
      background: color, color: txt, fontFamily: T.font, fontWeight: 800, fontSize: 16.5,
      letterSpacing: -0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: disabled ? 'none' : (color === T.accent ? '0 8px 20px rgba(242,200,75,.35)' : '0 8px 20px rgba(30,58,138,.28)'),
      opacity: disabled ? 0.45 : 1, transition: 'opacity .18s',
      ...style,
    }}>
      {children}{icon && <Icon name={icon} size={20} color={txt}/>}
    </button>
  );
}

function Avatar({ size = 40, initials = 'А', ring }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#2A4BA8,#1E3A8A)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, border: ring ? `2px solid ${T.accent}` : 'none',
    }}>{initials}</div>
  );
}

function Logo({ color = T.ink, size = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: size + 6, height: size + 6, borderRadius: 8, background: T.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Truck size="m" color={T.ink} w={size}/>
      </div>
      <span style={{ fontWeight: 800, fontSize: size, color, letterSpacing: -0.5 }}>onetachka</span>
    </div>
  );
}

const TAB_MAP = {
  client: { home: 'home', box: 'orders', chat: 'chats', user: 'profile' },
  driver: { home: 'dhome', box: 'dorders', chat: 'dchats', user: 'dprofile' },
};
function TabBar({ active = 'home', nav, role = 'client' }) {
  const items = [['home','Головна'],['box','Замовлення'],['chat','Чат'],['user','Профіль']];
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 8px 4px', background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)', borderTop: `1px solid ${T.line}`,
    }}>
      {items.map(([n, l]) => {
        const on = n === active;
        return (
          <button key={n} onClick={() => nav && nav.go(TAB_MAP[role][n])} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1,
            border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0',
          }}>
            <Icon name={n} size={23} color={on ? T.ink : T.txt3} stroke={on ? 2.4 : 2}/>
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 600, color: on ? T.ink : T.txt3 }}>{l}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Abstract stylized map background ───────────────────────
function MapBg({ children, dark }) {
  const land = dark ? '#16224F' : '#E9E8E1';
  const block = dark ? '#22317A' : '#F3F2EC';
  const road = dark ? '#33459C' : '#FFFFFF';
  return (
    <div style={{ position: 'absolute', inset: 0, background: land, overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 402 874" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {/* city blocks */}
        {[[30,120,90,80],[140,90,120,70],[280,140,90,110],[20,260,110,90],[160,250,80,120],[260,300,120,80],[40,430,90,100],[150,420,140,90],[300,470,80,120],[30,620,120,80],[170,600,110,110],[290,640,90,90]].map((b,i)=>(
          <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="10" fill={block}/>
        ))}
        {/* roads */}
        <path d="M-20 200 H440 M-20 400 H440 M-20 590 H440" stroke={road} strokeWidth="14" fill="none"/>
        <path d="M130 -20 V900 M270 -20 V900" stroke={road} strokeWidth="14" fill="none"/>
        {/* route line */}
        <path d="M70 720 C 120 620, 180 560, 200 460 S 300 300, 330 180" stroke={T.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="0.1 16" opacity="0.85"/>
        <path d="M70 720 C 120 620, 180 560, 200 460 S 300 300, 330 180" stroke={T.accent} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* pins */}
        <g>
          <circle cx="70" cy="720" r="9" fill={T.ink}/><circle cx="70" cy="720" r="3.5" fill="#fff"/>
        </g>
        <g>
          <path d="M330 180 c0 -10 -8 -16 -8 -24 a8 8 0 0 1 16 0 c0 8 -8 14 -8 24Z" fill={T.accent} transform="translate(-1,-2)"/>
          <circle cx="330" cy="156" r="4" fill={T.ink}/>
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: dark ? 'linear-gradient(180deg,rgba(22,34,79,.2),rgba(22,34,79,.5))' : 'linear-gradient(180deg,rgba(245,245,241,.1),rgba(245,245,241,.35))' }}/>
      {children}
    </div>
  );
}

// ── Back / screen header ───────────────────────────────────
function BackHeader({ title, onBack, right, dark }) {
  const fg = dark ? '#fff' : T.ink;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '54px 16px 10px' }}>
      <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${dark ? 'rgba(255,255,255,.15)' : T.border}`, background: dark ? 'rgba(255,255,255,.08)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <Icon name="chevR" size={20} color={fg} style={{ transform: 'rotate(180deg)' }}/>
      </button>
      <div style={{ flex: 1, fontWeight: 800, fontSize: 19, letterSpacing: -0.4, color: fg }}>{title}</div>
      {right}
    </div>
  );
}

// ── Vertical step progress (tracking) ──────────────────────
function StepBar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current, now = i === current;
        return (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? T.green : now ? T.accent : '#fff', border: `2px solid ${done ? T.green : now ? T.accent : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {done && <Icon name="chevR" size={12} color="#fff" style={{ transform: 'rotate(0)' }}/>}
                {now && <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.ink }}/>}
              </div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 26, background: done ? T.green : T.border }}/>}
            </div>
            <div style={{ paddingBottom: 16, paddingTop: 1 }}>
              <div style={{ fontWeight: now ? 800 : 700, fontSize: 14.5, color: done || now ? T.ink : T.txt3 }}>{s.t}</div>
              {s.s && <div style={{ fontSize: 12, color: T.txt2, marginTop: 1 }}>{s.s}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Driver offer / mini card row ───────────────────────────
function Stars({ v = 4.9, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <Icon name="star" size={size} color={T.accentDark}/>
      <span style={{ fontWeight: 700, fontSize: size }}>{v}</span>
    </span>
  );
}

Object.assign(window, { T, Icon, Truck, CargoChip, PrimaryBtn, TabBar, MapBg, Avatar, Logo, BackHeader, StepBar, Stars });

