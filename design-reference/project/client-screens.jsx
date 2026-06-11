// client-screens.jsx — Onetachka client app
// Exports: CHome, CCreate, CMatching, CDrivers, CTracking, CChat, CRating
const { useState, useEffect, useRef } = React;

const PAD = 18;
const ROUTE = { from: 'Ужгород, вул. Капушанська 12', to: 'Мукачево, вул. Духновича 4', km: 42, min: 55 };
const DRIVERS = [
  { id: 1, name: 'Василь М.', car: 'Mercedes Sprinter', plate: 'AO 1234 CT', rating: 4.9, trips: 870, eta: 8, price: 1250, ai: true, v: 'm' },
  { id: 2, name: 'Олег П.', car: 'Renault Master', plate: 'AO 5521 EH', rating: 4.8, trips: 540, eta: 12, price: 1190, v: 'm' },
  { id: 3, name: 'Іван К.', car: 'Citroën Jumper', plate: 'AO 9087 BK', rating: 4.7, trips: 310, eta: 15, price: 1090, v: 's' },
];

// ── HOME ───────────────────────────────────────────────────
function CHome({ nav, app, set }) {
  const sizes = [['s','Малий','до 8 м³'],['m','Середній','до 18 м³'],['l','Великий','до 45 м³']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${PAD}px 16px` }}>
        {/* top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '8px 13px 8px 10px', borderRadius: 999, border: `1px solid ${T.border}` }}>
            <Icon name="pin" size={16} color={T.accentDark}/>
            <span style={{ fontWeight: 700, fontSize: 13, color: T.txt }}>Ужгород</span>
            <Icon name="chevR" size={13} color={T.txt3} style={{ transform: 'rotate(90deg)' }}/>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Icon name="bell" size={19} color={T.ink}/>
              <div style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: T.accent, border: '1.5px solid #fff' }}/>
            </div>
            <Avatar initials="А"/>
          </div>
        </div>

        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, marginBottom: 16, lineHeight: 1.1 }}>Куди доставити<br/>вантаж сьогодні?</div>

        {/* search trigger */}
        <button onClick={() => nav.go('create')} style={{ width: '100%', textAlign: 'left', background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 16, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="search" size={20} color={T.txt3}/>
          <span style={{ fontWeight: 600, fontSize: 15.5, color: T.txt3 }}>Вкажіть адресу призначення</span>
        </button>

        {/* cargo quick chips */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 18 }}>
          {sizes.map(([s, l, sub]) => (
            <CargoChip key={s} size={s} label={l} sub={sub} active={app.size === s} onClick={() => { set({ size: s }); nav.go('create'); }}/>
          ))}
        </div>

        {/* active order */}
        {app.active && (
          <button onClick={() => nav.go('tracking')} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: T.ink, border: 'none', borderRadius: T.radCard, padding: 16, color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,.55)' }}>Активне замовлення</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: T.ink, background: T.accent, padding: '4px 10px', borderRadius: 999 }}>В дорозі</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials="В" size={42}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Василь М. · Mercedes Sprinter</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>
                  <Icon name="clock" size={13} color={T.accent}/> Прибуття через 8 хв
                </div>
              </div>
              <Icon name="chevR" size={20} color="rgba(255,255,255,.5)"/>
            </div>
          </button>
        )}

        {/* AI price teaser */}
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Icon name="spark" size={15} color={T.accentDark}/>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.txt2, textTransform: 'uppercase', letterSpacing: 0.5 }}>AI-прогноз вартості</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 12.5, color: T.txt2, marginBottom: 2 }}>Ужгород → Мукачево</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>1 100–1 300</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.txt2 }}>₴</span>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green, background: T.greenBg, padding: '4px 9px', borderRadius: 999 }}>↓ вигідно</span>
          </div>
        </div>

        {/* recent */}
        <div style={{ fontSize: 13, fontWeight: 700, color: T.txt2, marginBottom: 8 }}>Нещодавні маршрути</div>
        {[['Дім → Склад «Епіцентр»','вчора · 320 ₴'],['Меблі IKEA → Берегово','3 дні тому · 890 ₴']].map(([a, b], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: i === 0 ? `1px solid ${T.line}` : 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="clock" size={17} color={T.txt2}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{a}</div>
              <div style={{ fontSize: 12, color: T.txt3 }}>{b}</div>
            </div>
            <Icon name="arrowUR" size={18} color={T.txt3}/>
          </div>
        ))}
      </div>
      <TabBar active="home" nav={nav} role="client"/>
    </div>
  );
}

// ── small inputs for the create form ───────────────────────
function CStepper({ value, onChange, min = 1, max = 99, step = 1, suffix }) {
  const btn = (txt, fn, dis) => (
    <button onClick={fn} disabled={dis} style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${T.border}`, background: dis ? T.bg : '#fff', color: dis ? T.txt3 : T.ink, fontSize: 20, fontWeight: 700, fontFamily: T.font, cursor: dis ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{txt}</button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {btn('−', () => onChange(Math.max(min, value - step)), value <= min)}
      <span style={{ minWidth: 54, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{value}{suffix ? ` ${suffix}` : ''}</span>
      {btn('+', () => onChange(Math.min(max, value + step)), value >= max)}
    </div>
  );
}
function CNumField({ value, onChange, suffix, step = 1, label }) {
  return (
    <label style={{ flex: 1, minWidth: 0, display: 'block' }}>
      {label && <div style={{ fontSize: 11.5, color: T.txt3, fontWeight: 600, marginBottom: 5 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 12, padding: '0 12px', height: 48 }}>
        <input type="number" inputMode="numeric" value={value} step={step} min={0}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', background: 'none', fontFamily: T.font, fontWeight: 800, fontSize: 16, color: T.ink }}/>
        {suffix && <span style={{ fontSize: 13, fontWeight: 700, color: T.txt3, flexShrink: 0 }}>{suffix}</span>}
      </div>
    </label>
  );
}

// ── CREATE ORDER ───────────────────────────────────────────
function CCreate({ nav, app, set }) {
  const [mode, setMode] = useState('euro');        // euro | usa | exact
  const [pallets, setPallets] = useState(2);
  const [height, setHeight] = useState(200);       // cm
  const [box, setBox] = useState({ l: 80, w: 60, h: 80, qty: 1 }); // cm
  const [weight, setWeight] = useState(500);       // kg, precise
  const [oversized, setOversized] = useState(false);
  const [when, setWhen] = useState('now');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [extras, setExtras] = useState({ loaders: false, tail: false });

  // ── volume → auto vehicle pick ──
  const palletArea = mode === 'usa' ? 1.0 * 1.2 : 1.2 * 0.8; // m²
  const volumeM3 = mode === 'exact'
    ? (Number(box.l) / 100) * (Number(box.w) / 100) * (Number(box.h) / 100) * Number(box.qty || 1)
    : palletArea * (Number(height || 0) / 100) * Number(pallets || 1);
  const w = Number(weight) || 0;
  const FLEET = {
    s: { name: 'Mercedes Sprinter', sub: 'до 1.5 т · 8 м³', size: 's', base: 690 },
    m: { name: 'Вантажівка 3 тонни', sub: 'до 3 т · 18 м³', size: 'm', base: 1180 },
    l: { name: 'Вантажівка 10 тонн', sub: 'до 10 т · 45 м³', size: 'l', base: 1820 },
  };
  const veh = oversized ? FLEET.l
    : (w <= 1200 && volumeM3 <= 9) ? FLEET.s
    : (w <= 3000 && volumeM3 <= 20) ? FLEET.m
    : FLEET.l;
  const extra = (extras.loaders ? 250 : 0) + (extras.tail ? 180 : 0);
  const price = veh.base + extra;

  const seg = (k, l, on, fn) => (
    <button key={k} onClick={fn} style={{ flex: 1, height: 42, borderRadius: 12, cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 13, background: on ? T.ink : '#fff', color: on ? '#fff' : T.txt, border: `1.5px solid ${on ? T.ink : T.border}` }}>{l}</button>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Нове замовлення" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${PAD}px 8px` }}>
        {/* addresses */}
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: `1px solid ${T.line}` }}>
            <Icon name="dot" size={14} color={T.green}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.txt3, fontWeight: 600 }}>Звідки</div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ROUTE.from}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0' }}>
            <Icon name="pin" size={16} color={T.accentDark}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.txt3, fontWeight: 600 }}>Куди</div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ROUTE.to}</div>
            </div>
            <Icon name="pin" size={18} color={T.txt3}/>
          </div>
        </div>

        {/* size */}
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 9 }}>Розмір вантажу</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {seg('euro', 'Європалети', mode==='euro', () => setMode('euro'))}
          {seg('usa', 'Амер. палети', mode==='usa', () => setMode('usa'))}
          {seg('exact', 'Точні розміри', mode==='exact', () => setMode('exact'))}
        </div>

        {mode !== 'exact' ? (
          <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: `1px solid ${T.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Кількість палет</div>
                <div style={{ fontSize: 12, color: T.txt3 }}>{mode === 'usa' ? 'Американська · 100 × 120 см' : 'Європалета · 120 × 80 см'}</div>
              </div>
              <CStepper value={pallets} onChange={setPallets} min={1} max={20}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Висота вантажу</div>
                <div style={{ fontSize: 12, color: T.txt3 }}>Вкажіть окремо, у сантиметрах</div>
              </div>
              <div style={{ width: 120 }}><CNumField value={height} onChange={setHeight} suffix="см" step={10}/></div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: T.txt3, fontWeight: 600, marginBottom: 10 }}>Розміри однієї коробки, см</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <CNumField label="Довжина" value={box.l} onChange={(v)=>setBox(b=>({...b,l:v}))} suffix="см"/>
              <CNumField label="Ширина" value={box.w} onChange={(v)=>setBox(b=>({...b,w:v}))} suffix="см"/>
              <CNumField label="Висота" value={box.h} onChange={(v)=>setBox(b=>({...b,h:v}))} suffix="см"/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>Кількість коробок</div>
              <CStepper value={box.qty} onChange={(v)=>setBox(b=>({...b,qty:v}))} min={1} max={99}/>
            </div>
          </div>
        )}

        {/* weight */}
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 9 }}>Вага вантажу</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 10 }}>
          <CNumField value={weight} onChange={setWeight} suffix="кг" step={10}/>
        </div>
        <div onClick={()=>setOversized(o=>!o)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${oversized ? T.accentDark : T.border}`, borderRadius: 14, padding: '13px 14px', marginBottom: oversized ? 8 : 18, cursor: 'pointer' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>Негабаритний вантаж</div>
            <div style={{ fontSize: 12, color: T.txt3 }}>Нестандартні розміри або форма</div>
          </div>
          <div style={{ width: 44, height: 26, borderRadius: 999, background: oversized ? T.green : '#E2E1DB', position: 'relative', transition: 'background .18s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: oversized ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
          </div>
        </div>
        {oversized && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(242,200,75,.14)', borderRadius: 12, padding: '11px 13px', marginBottom: 18 }}>
            <Icon name="shield" size={16} color={T.accentDark}/>
            <span style={{ fontSize: 12.5, color: T.txt2, fontWeight: 600 }}>Обов'язково вкажіть точну вагу та розміри вантажу</span>
          </div>
        )}

        {/* auto-picked vehicle */}
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 16, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(242,200,75,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Truck size={veh.size} color={T.accent} w={42}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Icon name="spark" size={13} color={T.accent}/>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: 0.5 }}>Програма підібрала машину</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{veh.name}</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>{veh.sub} · ≈{volumeM3.toFixed(1)} м³ вантажу</div>
          </div>
        </div>

        {/* when */}
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 9 }}>Коли подати транспорт</div>
        <div style={{ display: 'flex', gap: 9, marginBottom: when === 'time' ? 10 : 18 }}>
          {[['now','Зараз'],['time','Запланувати']].map(([k, l]) => (
            <button key={k} onClick={()=>setWhen(k)} style={{ flex: 1, height: 46, borderRadius: 14, cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 14.5, background: when===k ? T.ink : '#fff', color: when===k ? '#fff' : T.txt, border: `1.5px solid ${when===k ? T.ink : T.border}` }}>{l}</button>
          ))}
        </div>
        {when === 'time' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: T.txt3, fontWeight: 600, marginBottom: 5 }}>День</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 12, padding: '0 12px', height: 48 }}>
                <Icon name="clock" size={17} color={T.accentDark}/>
                <input type="date" value={day} onChange={(e)=>setDay(e.target.value)} style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 14.5, color: T.ink }}/>
              </div>
            </label>
            <label style={{ width: 130 }}>
              <div style={{ fontSize: 11.5, color: T.txt3, fontWeight: 600, marginBottom: 5 }}>Час</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 12, padding: '0 12px', height: 48 }}>
                <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 14.5, color: T.ink }}/>
              </div>
            </label>
          </div>
        )}

        {/* extras */}
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 9 }}>Додатково</div>
        {[['loaders','Вантажники (2 особи)','+250 ₴'],['tail','Гідроборт','+180 ₴']].map(([k, l, p]) => (
          <div key={k} onClick={()=>setExtras(e=>({ ...e, [k]: !e[k] }))} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 14, padding: '13px 14px', marginBottom: 9, cursor: 'pointer' }}>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{l}</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.txt2 }}>{p}</span>
            <div style={{ width: 44, height: 26, borderRadius: 999, background: extras[k] ? T.green : '#E2E1DB', position: 'relative', transition: 'background .18s' }}>
              <div style={{ position: 'absolute', top: 3, left: extras[k] ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* sticky price + CTA */}
      <div style={{ background: '#fff', borderTop: `1px solid ${T.line}`, padding: `12px ${PAD}px 30px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon name="spark" size={15} color={T.accentDark}/>
          <span style={{ fontSize: 12.5, color: T.txt2, fontWeight: 600 }}>AI-оцінка з урахуванням попиту та палива</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{price.toLocaleString('uk')} ₴</span>
        </div>
        <PrimaryBtn icon="arrow" onClick={() => { set({ size: veh.size, price }); nav.go('matching'); }}>Знайти вантажівку</PrimaryBtn>
      </div>
    </div>
  );
}

// ── MATCHING (searching) ───────────────────────────────────
function CMatching({ nav, app }) {
  useEffect(() => { const t = setTimeout(() => nav.go('drivers'), 2600); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink }}>
      <MapBg dark/>
      <BackHeader title="" onBack={nav.back} dark/>
      {/* radar */}
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="radar"><div className="radar-ring"/><div className="radar-ring r2"/><div className="radar-core"><Truck size="m" color={T.ink} w={34}/></div></div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, padding: `16px ${PAD}px 34px`, textAlign: 'center' }}>
        <div style={{ width: 38, height: 4.5, borderRadius: 9, background: '#E2E1DB', margin: '0 auto 18px' }}/>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>Шукаємо вантажівки поруч…</div>
        <div style={{ fontSize: 13.5, color: T.txt2, marginTop: 6, marginBottom: 16 }}>AI підбирає найкращі вантажівки за рейтингом, ціною та відстанню</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 4 }}>
          {[['8','вантажівок поруч'],['~2 хв','до підбору'],['4.8★','серед. рейтинг']].map(([a,b],i)=>(
            <div key={i}><div style={{ fontWeight: 800, fontSize: 18 }}>{a}</div><div style={{ fontSize: 11.5, color: T.txt3 }}>{b}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DRIVER SELECTION ───────────────────────────────────────
function CDrivers({ nav, app, set }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink }}>
      <MapBg/>
      <BackHeader title="" onBack={nav.back} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, padding: `14px ${PAD}px 28px`, maxHeight: '74%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 38, height: 4.5, borderRadius: 9, background: '#E2E1DB', margin: '0 auto 14px' }}/>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.4, marginBottom: 12 }}>3 вантажівки готові виїхати</div>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DRIVERS.map(d => (
            <button key={d.id} onClick={() => { set({ driver: d, active: true, step: 0, price: d.price }); nav.go('tracking'); }} style={{ textAlign: 'left', cursor: 'pointer', background: d.ai ? '#FFFDF4' : '#fff', border: `1.5px solid ${d.ai ? T.accent : T.border}`, borderRadius: 18, padding: 14, position: 'relative' }}>
              {d.ai && <div style={{ position: 'absolute', top: -10, left: 14, background: T.accent, color: T.ink, fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="spark" size={12} color={T.ink}/> AI рекомендує</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={d.name[0]} size={48} ring={d.ai}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 15.5 }}>{d.name}</span>
                    <Stars v={d.rating} size={12}/>
                  </div>
                  <div style={{ fontSize: 12.5, color: T.txt2, marginTop: 2 }}>{d.car} · {d.trips} поїздок</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: T.txt2, marginTop: 3 }}>
                    <Icon name="clock" size={13} color={T.accentDark}/> подача {d.eta} хв
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.5 }}>{d.price.toLocaleString('uk')} ₴</div>
                  <div style={{ fontSize: 11, color: T.txt3 }}>фікс. ціна</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TRACKING ───────────────────────────────────────────────
function CTracking({ nav, app, set }) {
  const d = app.driver || DRIVERS[0];
  const steps = [
    { t: 'Замовлення прийнято', s: `${d.name} виїхав до вас` },
    { t: 'Водій прибув', s: 'Завантаження вантажу' },
    { t: 'Вантаж у дорозі', s: 'Прямує до Мукачева' },
    { t: 'Доставлено', s: 'Дякуємо!' },
  ];
  const step = app.step ?? 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <MapBg/>
        <BackHeader title="" onBack={() => nav.go('home')} />
        <div style={{ position: 'absolute', top: 56, left: 16, background: T.ink, color: '#fff', padding: '8px 14px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="clock" size={16} color={T.accent}/>
          <span style={{ fontWeight: 800, fontSize: 14 }}>{step >= 3 ? 'Доставлено' : `~ ${[8,2,40,0][step]} хв`}</span>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, padding: `16px ${PAD}px 28px`, marginTop: -24, position: 'relative', maxHeight: '62%', overflowY: 'auto' }}>
        <div style={{ width: 38, height: 4.5, borderRadius: 9, background: '#E2E1DB', margin: '0 auto 16px' }}/>
        {/* driver card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Avatar initials={d.name[0]} size={50} ring/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 800, fontSize: 16 }}>{d.name}</span><Stars v={d.rating} size={12}/></div>
            <div style={{ fontSize: 12.5, color: T.txt2 }}>{d.car} · {d.plate}</div>
          </div>
          <button onClick={() => nav.go('chat')} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: T.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chat" size={20} color={T.ink}/></button>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={20} color={T.ink}/></button>
        </div>
        <div style={{ height: 1, background: T.line, marginBottom: 16 }}/>
        <StepBar steps={steps} current={step}/>
        {/* demo advance */}
        {step < 3
          ? <PrimaryBtn color={T.ink} txt="#fff" onClick={() => set({ step: step + 1 })}>{['Водій прибув','Почати доставку','Підтвердити доставку'][step]}</PrimaryBtn>
          : <PrimaryBtn onClick={() => nav.go('rating')}>Оцінити поїздку</PrimaryBtn>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13.5 }}>
          <span style={{ color: T.txt2 }}>Вартість · {ROUTE.km} км</span>
          <span style={{ fontWeight: 800 }}>{(app.price || d.price).toLocaleString('uk')} ₴</span>
        </div>
      </div>
    </div>
  );
}

// ── CHAT ───────────────────────────────────────────────────
function CChat({ nav, app }) {
  const dft = app.driver || DRIVERS[0];
  const peer = app.chatWith || { name: dft.name, initials: dft.name[0] };
  const [msgs, setMsgs] = useState([
    { me: false, t: 'Доброго дня! Виїхав до вас, буду за 8 хвилин 🚚' },
    { me: true, t: 'Дякую! Чекаю біля під\'їзду' },
    { me: false, t: 'Добре. Вантаж великий? Потрібна допомога?' },
  ]);
  const quick = ['Так, потрібні вантажники', 'Я на місці', 'Зателефонуйте мені'];
  const send = (t) => setMsgs(m => [...m, { me: true, t }]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: `1px solid ${T.line}`, padding: '54px 14px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={nav.back} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', background: T.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevR" size={19} color={T.ink} style={{ transform: 'rotate(180deg)' }}/></button>
        <Avatar initials={peer.initials} size={40}/>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{peer.name}</div><div style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>● у мережі</div></div>
        <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={19} color={T.ink}/></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: `16px ${PAD}px`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '78%', background: m.me ? T.ink : '#fff', color: m.me ? '#fff' : T.ink, border: m.me ? 'none' : `1px solid ${T.border}`, borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 13px', fontSize: 14.5, fontWeight: 500, lineHeight: 1.35 }}>{m.t}</div>
        ))}
      </div>
      <div style={{ padding: `8px ${PAD}px 0`, display: 'flex', gap: 7, overflowX: 'auto' }}>
        {quick.map(q => <button key={q} onClick={() => send(q)} style={{ whiteSpace: 'nowrap', flexShrink: 0, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 999, padding: '8px 13px', fontSize: 12.5, fontWeight: 700, fontFamily: T.font, cursor: 'pointer', color: T.txt }}>{q}</button>)}
      </div>
      <div style={{ padding: `10px ${PAD}px 28px`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 999, padding: '12px 16px', fontSize: 14.5, color: T.txt3 }}>Повідомлення…</div>
        <button onClick={() => send('👍')} style={{ width: 46, height: 46, borderRadius: '50%', border: 'none', background: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrow" size={21} color={T.ink}/></button>
      </div>
    </div>
  );
}

// ── RATING ─────────────────────────────────────────────────
function CRating({ nav, app, set }) {
  const d = app.driver || DRIVERS[0];
  const [stars, setStars] = useState(5);
  const [tip, setTip] = useState(0);
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: `64px ${PAD}px 16px`, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.green, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={36} color="#fff" style={{ transform: 'rotate(0)' }}/>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Вантаж доставлено!</div>
        <div style={{ fontSize: 14, color: T.txt2, marginTop: 6, marginBottom: 22 }}>Ужгород → Мукачево · {ROUTE.km} км · 54 хв</div>

        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 20, marginBottom: 16 }}>
          <Avatar initials={d.name[0]} size={56} ring/>
          <div style={{ fontWeight: 800, fontSize: 17, marginTop: 10 }}>{d.name}</div>
          <div style={{ fontSize: 13, color: T.txt2, marginBottom: 16 }}>Як пройшла поїздка?</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setStars(n)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>
                <Icon name="star" size={34} color={n <= stars ? T.accent : '#E2E1DB'}/>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 16, marginBottom: 16, textAlign: 'left' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Додати чайові водію</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 50, 100, 200].map(v => (
              <button key={v} onClick={() => setTip(v)} style={{ flex: 1, height: 44, borderRadius: 12, cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 14, background: tip===v ? T.ink : T.bg, color: tip===v ? '#fff' : T.txt, border: `1.5px solid ${tip===v ? T.ink : T.border}` }}>{v === 0 ? 'Без' : `${v} ₴`}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', borderTop: `1px solid ${T.line}`, padding: `12px ${PAD}px 30px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14.5 }}>
          <span style={{ color: T.txt2 }}>Загалом сплачено</span>
          <span style={{ fontWeight: 800 }}>{((app.price || d.price) + tip).toLocaleString('uk')} ₴</span>
        </div>
        <PrimaryBtn onClick={() => { set({ active: false, step: 0 }); nav.go('home'); }}>Готово</PrimaryBtn>
      </div>
    </div>
  );
}

Object.assign(window, { CHome, CCreate, CMatching, CDrivers, CTracking, CChat, CRating });
