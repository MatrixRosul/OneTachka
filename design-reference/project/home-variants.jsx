// home-variants.jsx — 3 directions for the client Home screen
// Exports: HomeMap (A), HomeAction (B), HomeDash (C)
const { useState } = React;

const TOP = 54; // clear status bar / island

// ─────────────────────────────────────────────────────────
// A · MAP-FIRST  (Uber/Bolt pattern)
// ─────────────────────────────────────────────────────────
function HomeMap() {
  const [size, setSize] = useState('m');
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: T.font }}>
      <MapBg/>
      {/* top bar */}
      <div style={{ position: 'absolute', top: TOP, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', padding: '8px 13px 8px 10px', borderRadius: 999, boxShadow: '0 4px 14px rgba(0,0,0,.08)' }}>
          <Icon name="pin" size={17} color={T.accentDark}/>
          <span style={{ fontWeight: 700, fontSize: 13.5, color: T.txt }}>Закарпаття · Ужгород</span>
          <Icon name="chevR" size={14} color={T.txt3} style={{ transform: 'rotate(90deg)' }}/>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.08)' }}>
          <Icon name="bell" size={20} color={T.ink}/>
        </div>
      </div>

      {/* AI price hint floating */}
      <div style={{ position: 'absolute', top: 320, left: 120, background: T.ink, color: '#fff', padding: '9px 13px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 24px rgba(0,0,0,.25)' }}>
        <Icon name="spark" size={16} color={T.accent}/>
        <div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.55)', fontWeight: 600 }}>AI-оцінка маршруту</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>~ 1 250 ₴</div>
        </div>
      </div>

      {/* bottom sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: `${T.radSheet}px ${T.radSheet}px 0 0`, padding: '12px 18px 30px', boxShadow: '0 -12px 40px rgba(0,0,0,.12)' }}>
        <div style={{ width: 38, height: 4.5, borderRadius: 9, background: '#E2E1DB', margin: '0 auto 16px' }}/>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.6, marginBottom: 14 }}>Куди доставити вантаж?</div>

        {/* from → to field */}
        <div style={{ border: `1.5px solid ${T.border}`, borderRadius: 16, padding: '4px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: `1px solid ${T.line}` }}>
            <Icon name="dot" size={14} color={T.green}/>
            <span style={{ fontWeight: 600, fontSize: 15, color: T.txt }}>Ужгород, вул. Капушанська 12</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
            <Icon name="pin" size={16} color={T.accentDark}/>
            <span style={{ fontWeight: 600, fontSize: 15, color: T.txt3 }}>Куди везти?</span>
          </div>
        </div>

        {/* cargo chips */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 16 }}>
          <CargoChip size="s" label="Малий" sub="до 1 т" active={size==='s'} onClick={()=>setSize('s')}/>
          <CargoChip size="m" label="Середній" sub="до 3 т" active={size==='m'} onClick={()=>setSize('m')}/>
          <CargoChip size="l" label="Великий" sub="до 10 т" active={size==='l'} onClick={()=>setSize('l')}/>
        </div>

        <PrimaryBtn icon="arrow">Розрахувати ціну</PrimaryBtn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// B · ACTION-FIRST  (warm cards, friendly)
// ─────────────────────────────────────────────────────────
function HomeAction() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden', padding: `${TOP}px 18px 0` }}>
        {/* greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 13, color: T.txt2, fontWeight: 600 }}>Доброго дня 👋</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Андрію</div>
          </div>
          <Avatar initials="А" ring/>
        </div>

        {/* hero new-order card */}
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 20, color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.12 }}><Truck size="l" color={T.accent} w={140}/></div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.4, maxWidth: 200, lineHeight: 1.15 }}>Замовити вантажівку за 2 хвилини</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 8, marginBottom: 18 }}>Водій приїде вже за 15–20 хв</div>
          <button style={{ background: T.accent, color: T.ink, border: 'none', borderRadius: 12, height: 46, padding: '0 18px', fontWeight: 800, fontSize: 15, fontFamily: T.font, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            Нове замовлення <Icon name="arrow" size={19} color={T.ink}/>
          </button>
        </div>

        {/* cargo type tiles */}
        <div style={{ fontSize: 14, fontWeight: 700, color: T.txt2, marginBottom: 10 }}>Що перевозимо?</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <CargoChip size="s" label="Малий" sub="меблі, техніка" big/>
          <CargoChip size="m" label="Середній" sub="переїзд" big/>
          <CargoChip size="l" label="Великий" sub="будматеріали" big/>
        </div>

        {/* active order tracker */}
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.txt2 }}>Активне замовлення</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green, background: T.greenBg, padding: '4px 10px', borderRadius: 999 }}>В дорозі</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials="В" size={42}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>Василь М. · Mercedes Sprinter</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: T.txt2, marginTop: 2 }}>
                <Icon name="clock" size={13} color={T.txt3}/> Прибуття через 12 хв
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chat" size={19} color={T.accent}/>
            </div>
          </div>
        </div>
      </div>
      <TabBar active="home"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// C · DASHBOARD  (typographic premium, AI-led)
// ─────────────────────────────────────────────────────────
function HomeDash() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden', padding: `${TOP}px 18px 0` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <Logo/>
          <Avatar initials="А"/>
        </div>

        {/* AI smart-price hero */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <Icon name="spark" size={15} color={T.accentDark}/>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.txt2, textTransform: 'uppercase', letterSpacing: 0.5 }}>AI-прогноз вартості</span>
          </div>
          <div style={{ fontSize: 13.5, color: T.txt2, marginBottom: 4 }}>Ужгород → Мукачево · середній вантаж</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 50, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>1 250</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: T.txt2 }}>₴</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.green, background: T.greenBg, padding: '3px 9px', borderRadius: 999, marginLeft: 4 }}>−12%</span>
          </div>
        </div>

        {/* map preview card */}
        <div style={{ position: 'relative', height: 130, borderRadius: T.radCard, overflow: 'hidden', marginBottom: 14, border: `1px solid ${T.border}` }}>
          <MapBg/>
          <div style={{ position: 'absolute', left: 14, bottom: 14, background: '#fff', padding: '8px 13px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}>
            <Icon name="clock" size={15} color={T.ink}/>
            <span style={{ fontWeight: 700, fontSize: 13 }}>42 км · ~55 хв</span>
          </div>
        </div>

        {/* primary CTA */}
        <PrimaryBtn icon="arrow" style={{ marginBottom: 18 }}>Створити замовлення</PrimaryBtn>

        {/* quick grid */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[['box','Мої\nзамовлення'],['clock','Історія'],['star','Рейтинг 4.9']].map(([ic, l]) => (
            <div key={l} style={{ flex: 1, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Icon name={ic} size={21} color={T.ink}/>
              <span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'pre-line', lineHeight: 1.2 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home"/>
    </div>
  );
}

Object.assign(window, { HomeMap, HomeAction, HomeDash });
