// driver-screens.jsx — Onetachka driver app
// Exports: DHome, DIncoming, DNav, DEarnings
const { useState: useStateD, useEffect: useEffectD } = React;
const DPAD = 18;

// ── DRIVER DASHBOARD ───────────────────────────────────────
function DHome({ nav, app, set }) {
  const online = app.online ?? false;
  // when online, surface an incoming request after a moment
  useEffectD(() => {
    if (!online) return;
    const t = setTimeout(() => nav.go('incoming'), 2200);
    return () => clearTimeout(t);
  }, [online]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${DPAD}px 16px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Avatar initials="В" size={46} ring/>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>Василь М.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: T.txt2 }}><Stars v={4.9} size={12}/> · 870 поїздок</div>
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="menu" size={20} color={T.ink}/></div>
        </div>

        {/* online toggle hero */}
        <div style={{ background: online ? T.ink : '#fff', border: `1px solid ${online ? T.ink : T.border}`, borderRadius: T.radCard, padding: 20, marginBottom: 16, transition: 'all .25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: online ? T.accent : T.txt2 }}>{online ? '● Ви на лінії' : '○ Ви офлайн'}</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: online ? '#fff' : T.ink, marginTop: 4 }}>{online ? 'Приймаємо замовлення' : 'Вийти на зміну?'}</div>
            </div>
            <button onClick={() => set({ online: !online })} style={{ width: 64, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer', background: online ? T.accent : '#E2E1DB', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 4, left: online ? 32 : 4, width: 28, height: 28, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.25)' }}/>
            </button>
          </div>
          {online && <div style={{ marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 8 }}><div className="pulse-dot"/> Шукаємо замовлення поруч…</div>}
        </div>

        {/* today earnings */}
        <div style={{ background: T.accent, borderRadius: T.radCard, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, opacity: .7 }}>Зароблено сьогодні</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.5, color: T.ink, marginTop: 2 }}>2 840 ₴</div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
            {[['7','поїздок'],['6.2 год','на лінії'],['184 км','пробіг']].map(([a,b],i)=>(
              <div key={i}><div style={{ fontWeight: 800, fontSize: 16, color: T.ink }}>{a}</div><div style={{ fontSize: 11.5, color: T.ink, opacity: .65 }}>{b}</div></div>
            ))}
          </div>
        </div>

        {/* quick tiles */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={() => nav.go('earnings')} style={{ flex: 1, textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Icon name="box" size={21} color={T.ink}/><span style={{ fontSize: 13, fontWeight: 700 }}>Заробіток і виплати</span>
          </button>
          <button style={{ flex: 1, textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Icon name="shield" size={21} color={T.ink}/><span style={{ fontSize: 13, fontWeight: 700 }}>Документи · <span style={{ color: T.green }}>верифіковано</span></span>
          </button>
        </div>

        {/* verified driver upsell */}
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 16, display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, opacity: .1 }}><Icon name="star" size={90} color={T.accent}/></div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(242,200,75,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="star" size={24} color={T.accent}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: '#fff' }}>Onetachka Premium</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>Пріоритетні замовлення · 0% комісії перший місяць</div>
          </div>
          <Icon name="chevR" size={20} color="rgba(255,255,255,.5)"/>
        </div>
      </div>
      <TabBar active="home" nav={nav} role="driver"/>
    </div>
  );
}

// ── INCOMING REQUEST (takeover + countdown) ────────────────
function DIncoming({ nav, app, set }) {
  const [sec, setSec] = useStateD(15);
  useEffectD(() => {
    if (sec <= 0) { nav.go('dhome'); return; }
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec]);
  const pct = (sec / 15) * 100;
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 170, flexShrink: 0 }}><MapBg dark/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* countdown ring */}
          <div style={{ position: 'relative', width: 78, height: 78 }}>
            <svg width="78" height="78" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="39" cy="39" r="34" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="6"/>
              <circle cx="39" cy="39" r="34" fill="none" stroke={T.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={2*Math.PI*34} strokeDashoffset={2*Math.PI*34*(1-pct/100)} style={{ transition: 'stroke-dashoffset 1s linear' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 26 }}>{sec}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, marginTop: -24, padding: `18px ${DPAD}px 28px`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.txt2 }}>Нове замовлення · середній вантаж</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>1 250 ₴</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: T.txt3 }}>ваш заробіток</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: T.green }}>+1 063 ₴</div>
          </div>
        </div>

        {/* route */}
        <div style={{ background: T.bg, borderRadius: 16, padding: '6px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${T.line}` }}>
            <Icon name="dot" size={13} color={T.green}/>
            <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.txt3, fontWeight: 600 }}>Забрати · 8 хв від вас</div><div style={{ fontWeight: 700, fontSize: 14 }}>Ужгород, Капушанська 12</div></div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 0' }}>
            <Icon name="pin" size={15} color={T.accentDark}/>
            <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.txt3, fontWeight: 600 }}>Доставити · 42 км</div><div style={{ fontWeight: 700, fontSize: 14 }}>Мукачево, Духновича 4</div></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, marginBottom: 16, padding: '0 4px' }}>
          {[['50 км','загальний маршрут'],['~1 год','в дорозі'],['2 вантажники','потрібні']].map(([a,b],i)=>(
            <div key={i}><div style={{ fontWeight: 800, fontSize: 14.5 }}>{a}</div><div style={{ fontSize: 11, color: T.txt3 }}>{b}</div></div>
          ))}
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => nav.go('dhome')} style={{ width: 64, height: 56, borderRadius: T.radBtn, border: `1.5px solid ${T.border}`, background: '#fff', cursor: 'pointer', fontWeight: 700, color: T.txt2, fontFamily: T.font, fontSize: 14 }}>Пропустити</button>
          <button onClick={() => { set({ jobStep: 0 }); nav.go('dnav'); }} style={{ flex: 1, height: 56, borderRadius: T.radBtn, border: 'none', background: T.accent, color: T.ink, cursor: 'pointer', fontWeight: 800, fontSize: 16.5, fontFamily: T.font, boxShadow: '0 8px 20px rgba(242,200,75,.4)' }}>Прийняти замовлення</button>
        </div>
      </div>
    </div>
  );
}

// ── DRIVER NAVIGATION (active job) ─────────────────────────
function DNav({ nav, app, set }) {
  const js = app.jobStep ?? 0;
  const phases = [
    { banner: 'Прямуйте до точки завантаження', sub: 'Ужгород, Капушанська 12', cta: 'Я на місці', dist: '8 хв · 3.2 км' },
    { banner: 'Завантаження вантажу', sub: 'Підтвердьте, коли завантажено', cta: 'Вантаж завантажено', dist: 'Клієнт: Андрій' },
    { banner: 'Прямуйте до точки розвантаження', sub: 'Мукачево, Духновича 4', cta: 'Прибув на місце', dist: '42 км · ~52 хв' },
    { banner: 'Завершення доставки', sub: 'Підтвердьте передачу вантажу', cta: 'Завершити доставку', dist: 'Отримувач: Андрій' },
  ];
  const p = phases[js];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink, display: 'flex', flexDirection: 'column' }}>
      {/* nav banner */}
      <div style={{ padding: `54px ${DPAD}px 16px`, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="arrow" size={30} color={T.accent} style={{ transform: 'rotate(-45deg)' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, color: T.accent, fontWeight: 700 }}>{p.dist}</div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>{p.banner}</div>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}><MapBg dark/></div>
      {/* bottom job sheet */}
      <div style={{ background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, marginTop: -24, padding: `16px ${DPAD}px 28px`, position: 'relative' }}>
        <div style={{ width: 38, height: 4.5, borderRadius: 9, background: '#E2E1DB', margin: '0 auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar initials="А" size={46}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{p.sub}</div>
            <div style={{ fontSize: 12.5, color: T.txt2 }}>Замовлення #OT-4821 · 1 250 ₴</div>
          </div>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: T.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chat" size={20} color={T.ink}/></button>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={20} color={T.ink}/></button>
        </div>
        <PrimaryBtn onClick={() => js < 3 ? set({ jobStep: js + 1 }) : nav.go('earnings')}>{p.cta}</PrimaryBtn>
      </div>
    </div>
  );
}

// ── DRIVER EARNINGS ────────────────────────────────────────
function DEarnings({ nav, app }) {
  const bars = [40, 65, 52, 80, 95, 70, 88];
  const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  const trips = [
    ['Ужгород → Мукачево', 'щойно', '+1 063 ₴'],
    ['Берегово → Виноградів', '2 год тому', '+780 ₴'],
    ['Склад «Епіцентр» → Дім', 'сьогодні', '+420 ₴'],
    ['Ужгород → Чоп', 'вчора', '+650 ₴'],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Заробіток" onBack={() => nav.go('dhome')}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${DPAD}px 16px` }}>
        {/* balance card */}
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 20, color: '#fff', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Доступно до виплати</div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: '2px 0 16px' }}>14 280 ₴</div>
          <PrimaryBtn>Вивести на картку</PrimaryBtn>
        </div>

        {/* week chart */}
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Цей тиждень</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>18 940 ₴</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, gap: 8 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: `${h}%`, background: i === 6 ? T.accent : '#EDECE6', borderRadius: 6 }}/>
                <span style={{ fontSize: 11, color: T.txt3, fontWeight: 600 }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* recent trips */}
        <div style={{ fontSize: 13, fontWeight: 700, color: T.txt2, marginBottom: 8 }}>Останні поїздки</div>
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, overflow: 'hidden' }}>
          {trips.map(([a, b, c], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < trips.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size="m" w={26}/></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{a}</div><div style={{ fontSize: 11.5, color: T.txt3 }}>{b}</div></div>
              <span style={{ fontWeight: 800, fontSize: 14.5, color: T.green }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="" nav={nav} role="driver"/>
    </div>
  );
}

Object.assign(window, { DHome, DIncoming, DNav, DEarnings });
