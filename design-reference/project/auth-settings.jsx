// auth-settings.jsx — entry + profile sub-screens
// Exports: Onboarding, Login, Settings, Payments, Addresses, Documents, Promos, Verify, Business, Premium
const AS_PAD = 18;
const asState = React.useState;

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 46, height: 27, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? T.green : '#E2E1DB', position: 'relative', transition: 'background .18s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }}/>
    </button>
  );
}
function ToggleRow({ icon, title, sub, on, set, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderBottom: last ? 'none' : `1px solid ${T.line}` }}>
      {icon && <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={19} color={T.ink}/></div>}
      <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div>{sub && <div style={{ fontSize: 12, color: T.txt3, marginTop: 1 }}>{sub}</div>}</div>
      <Toggle on={on} onClick={set}/>
    </div>
  );
}
function SecLabel({ children }) {
  return <div style={{ fontSize: 12.5, fontWeight: 700, color: T.txt3, textTransform: 'uppercase', letterSpacing: 0.5, margin: '6px 4px 8px' }}>{children}</div>;
}

// ── ONBOARDING ─────────────────────────────────────────────
function Onboarding({ nav }) {
  const [i, setI] = asState(0);
  const slides = [
    { ic: 's', t: 'Вантаж — за пару хвилин', s: 'Вкажіть адресу, оберіть розмір — і водій уже їде до вас.' },
    { ic: 'm', t: 'Чесна ціна наперед', s: 'AI рахує вартість з урахуванням попиту та палива. Жодних сюрпризів.' },
    { ic: 'l', t: 'Перевірені водії поруч', s: 'Рейтинги, верифікація документів і трекінг у реальному часі.' },
  ];
  const s = slides[i];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink, display: 'flex', flexDirection: 'column', padding: `54px ${AS_PAD}px 30px` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo color="#fff" size={18}/>
        <button onClick={() => nav.go('login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.55)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.font }}>Пропустити</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 180, height: 180, borderRadius: 40, background: 'rgba(242,200,75,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
          <Truck size={s.ic} color={T.accent} w={120}/>
        </div>
        <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', letterSpacing: -0.8, maxWidth: 300, lineHeight: 1.12 }}>{s.t}</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', marginTop: 12, maxWidth: 290, lineHeight: 1.45 }}>{s.s}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 22 }}>
        {slides.map((_, k) => <div key={k} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 999, background: k === i ? T.accent : 'rgba(255,255,255,.25)', transition: 'all .2s' }}/>)}
      </div>
      <PrimaryBtn icon="arrow" onClick={() => i < 2 ? setI(i + 1) : nav.go('login')}>{i < 2 ? 'Далі' : 'Почати'}</PrimaryBtn>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────
function Login({ nav }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column', padding: `54px ${AS_PAD}px 30px` }}>
      <button onClick={nav.back} style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${T.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="chevR" size={20} color={T.ink} style={{ transform: 'rotate(180deg)' }}/></button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}><Truck size="m" color={T.ink} w={38}/></div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>Вхід у Onetachka</div>
        <div style={{ fontSize: 14.5, color: T.txt2, marginTop: 6, marginBottom: 26 }}>Введіть номер — надішлемо SMS-код для входу.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 16, padding: '4px 14px', marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: T.ink, padding: '14px 0' }}>🇺🇦 +380</span>
          <div style={{ width: 1, height: 24, background: T.border }}/>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.txt3 }}>67 123 45 67</span>
        </div>
        <PrimaryBtn icon="arrow" onClick={() => nav.go('otp')}>Отримати код</PrimaryBtn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.border }}/><span style={{ fontSize: 12.5, color: T.txt3, fontWeight: 600 }}>або</span><div style={{ flex: 1, height: 1, background: T.border }}/>
        </div>
        <button onClick={() => nav.go('home')} style={{ width: '100%', height: 52, borderRadius: 14, border: `1.5px solid ${T.border}`, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: T.font, color: T.ink }}>Продовжити з Google</button>
        <div style={{ textAlign: 'center', fontSize: 14, color: T.txt2, marginTop: 22 }}>Немає акаунту? <button onClick={() => nav.go('register')} style={{ background: 'none', border: 'none', padding: 0, color: T.ink, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: T.font }}>Зареєструватися</button></div>
      </div>
      <div style={{ fontSize: 11.5, color: T.txt3, textAlign: 'center', lineHeight: 1.5 }}>Натискаючи «Отримати код», ви приймаєте<br/>Умови користування та Політику конфіденційності</div>
    </div>
  );
}

// ── REGISTER ───────────────────────────────────────────────
function AuthField({ icon, label, placeholder, prefix, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.txt3, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 14, padding: '0 14px', height: 52 }}>
        {icon && <Icon name={icon} size={18} color={T.txt3}/>}
        {prefix && <span style={{ fontWeight: 800, fontSize: 15, color: T.ink }}>{prefix}</span>}
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.ink }}/>
      </div>
    </label>
  );
}
function Register({ nav }) {
  const [role, setRole] = asState('client');
  const [name, setName] = asState('');
  const [phone, setPhone] = asState('');
  const [email, setEmail] = asState('');
  const [agree, setAgree] = asState(false);
  const seg = (k, l) => (
    <button key={k} onClick={() => setRole(k)} style={{ flex: 1, height: 54, borderRadius: 14, cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 14.5, background: role === k ? T.ink : '#fff', color: role === k ? '#fff' : T.txt, border: `1.5px solid ${role === k ? T.ink : T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <Icon name={k === 'client' ? 'user' : 'box'} size={20} color={role === k ? '#fff' : T.ink}/>{l}
    </button>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column', padding: `54px ${AS_PAD}px 26px` }}>
      <button onClick={nav.back} style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${T.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Icon name="chevR" size={20} color={T.ink} style={{ transform: 'rotate(180deg)' }}/></button>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 22 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>Створити акаунт</div>
        <div style={{ fontSize: 14.5, color: T.txt2, marginTop: 6, marginBottom: 22 }}>Приєднуйтесь до Onetachka за хвилину.</div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.txt3, marginBottom: 6 }}>Я хочу</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {seg('client', 'Замовляти')}
          {seg('driver', 'Возити вантаж')}
        </div>

        <AuthField icon="user" label="Ім'я та прізвище" placeholder="Андрій Коваль" value={name} onChange={setName}/>
        <AuthField label="Номер телефону" prefix="🇺🇦 +380" placeholder="67 123 45 67" value={phone} onChange={setPhone} type="tel"/>
        <AuthField icon="chat" label="Email (необов'язково)" placeholder="andriy@email.com" value={email} onChange={setEmail} type="email"/>

        <div onClick={() => setAgree(a => !a)} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginTop: 4, marginBottom: 4, cursor: 'pointer' }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${agree ? T.ink : T.border}`, background: agree ? T.ink : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{agree && <Icon name="chevR" size={13} color="#fff"/>}</div>
          <div style={{ fontSize: 12.5, color: T.txt2, lineHeight: 1.45 }}>Я приймаю <span style={{ color: T.ink, fontWeight: 700 }}>Умови користування</span> та <span style={{ color: T.ink, fontWeight: 700 }}>Політику конфіденційності</span></div>
        </div>
      </div>
      <div style={{ paddingTop: 12 }}>
        <PrimaryBtn icon="arrow" onClick={() => nav.go('otp', { _driver: role === 'driver' })}>Зареєструватися</PrimaryBtn>
        <div style={{ textAlign: 'center', fontSize: 14, color: T.txt2, marginTop: 16 }}>Вже є акаунт? <button onClick={() => nav.go('login')} style={{ background: 'none', border: 'none', padding: 0, color: T.ink, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: T.font }}>Увійти</button></div>
      </div>
    </div>
  );
}

// ── OTP (SMS code) ─────────────────────────────────────────
function Otp({ nav, app }) {
  const [code, setCode] = asState(['', '', '', '']);
  const refs = [React.useRef(), React.useRef(), React.useRef(), React.useRef()];
  const [secs, setSecs] = asState(42);
  React.useEffect(() => { if (secs <= 0) return; const t = setTimeout(() => setSecs(s => s - 1), 1000); return () => clearTimeout(t); }, [secs]);
  const filled = code.every(c => c !== '');
  const onDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    setCode(c => { const n = [...c]; n[i] = d; return n; });
    if (d && refs[i + 1]) refs[i + 1].current && refs[i + 1].current.focus();
  };
  const onKey = (i, e) => { if (e.key === 'Backspace' && !code[i] && refs[i - 1]) refs[i - 1].current && refs[i - 1].current.focus(); };
  const home = () => nav.go(app && app._driver ? 'dhome' : 'home');
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column', padding: `54px ${AS_PAD}px 30px` }}>
      <button onClick={nav.back} style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${T.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="chevR" size={20} color={T.ink} style={{ transform: 'rotate(180deg)' }}/></button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}><Icon name="chat" size={30} color={T.ink}/></div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>Введіть код</div>
        <div style={{ fontSize: 14.5, color: T.txt2, marginTop: 6, marginBottom: 28 }}>Ми надіслали SMS на <span style={{ color: T.ink, fontWeight: 700 }}>+380 67 123 45 67</span></div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {code.map((d, i) => (
            <input key={i} ref={refs[i]} value={d} inputMode="numeric" maxLength={1}
              onChange={(e) => onDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
              style={{ flex: 1, minWidth: 0, width: 0, height: 64, textAlign: 'center', borderRadius: 16, border: `1.5px solid ${d ? T.ink : T.border}`, background: '#fff', fontFamily: T.font, fontWeight: 800, fontSize: 26, color: T.ink, outline: 'none' }}/>
          ))}
        </div>
        <PrimaryBtn icon="arrow" onClick={home} disabled={!filled}>Підтвердити</PrimaryBtn>
        <div style={{ textAlign: 'center', fontSize: 13.5, color: T.txt3, marginTop: 20 }}>
          {secs > 0 ? <>Надіслати код повторно через <span style={{ color: T.ink, fontWeight: 700 }}>0:{String(secs).padStart(2, '0')}</span></>
            : <button onClick={() => setSecs(42)} style={{ background: 'none', border: 'none', color: T.ink, fontWeight: 800, fontSize: 13.5, cursor: 'pointer', fontFamily: T.font }}>Надіслати код повторно</button>}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS (with language switch) ────────────────────────
function Settings({ nav, app, set }) {
  const lang = app.lang || 'ua';
  const tg = (k) => set({ [k]: !app[k] });
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Налаштування" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <SecLabel>Мова застосунку</SecLabel>
        <Segmented tabs={[['ua','Українська'],['en','English']]} value={lang} onChange={(v) => set({ lang: v })}/>

        <SecLabel>Сповіщення</SecLabel>
        <ListCard>
          <ToggleRow icon="bell" title="Push-сповіщення" sub="Статус замовлення, акції" on={app.push !== false} set={() => tg('push')}/>
          <ToggleRow icon="chat" title="SMS про водія" on={app.sms === true} set={() => tg('sms')}/>
          <ToggleRow icon="spark" title="Знижки та промокоди" on={app.promo !== false} set={() => tg('promo')} last/>
        </ListCard>

        <SecLabel>Карта та дисплей</SecLabel>
        <ListCard>
          <ToggleRow icon="pin" title="Темна карта вночі" on={app.darkMap === true} set={() => tg('darkMap')}/>
          <ToggleRow icon="box" title="Великий шрифт" sub="Зручніше для читання" on={app.bigText === true} set={() => tg('bigText')} last/>
        </ListCard>

        <SecLabel>Акаунт</SecLabel>
        <ListCard>
          <Row icon="shield" title="Конфіденційність і дані"/>
          <div style={{ borderTop: `1px solid ${T.line}` }}><Row icon="user" title="Видалити акаунт" accent="#C2410C"/></div>
        </ListCard>
        <div style={{ textAlign: 'center', fontSize: 12, color: T.txt3, marginTop: 8 }}>Onetachka · версія 1.0.0 (Закарпаття)</div>
      </div>
    </div>
  );
}

// ── PAYMENTS ───────────────────────────────────────────────
function Payments({ nav }) {
  const cards = [['Visa','•• 4821', true, '#1A1F71'],['Mastercard','•• 0392', false, '#EB001B']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Способи оплати" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <SecLabel>Картки</SecLabel>
        <ListCard>
          {cards.map(([n, num, def, col], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < cards.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: 42, height: 30, borderRadius: 7, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,.85)' }}/></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{n} {num}</div>{def && <div style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Основна картка</div>}</div>
              <Icon name="chevR" size={17} color={T.txt3}/>
            </div>
          ))}
        </ListCard>
        <SecLabel>Швидка оплата</SecLabel>
        <ListCard>
          <Row icon="box" title="Apple Pay"/>
          <div style={{ borderTop: `1px solid ${T.line}` }}><Row icon="box" title="Готівка водію" detail="доступно"/></div>
        </ListCard>
        <div style={{ marginTop: 4 }}><PrimaryBtn color={T.ink} txt="#fff" icon="plus" onClick={() => {}}>Додати картку</PrimaryBtn></div>
      </div>
    </div>
  );
}

// ── ADDRESSES ──────────────────────────────────────────────
function Addresses({ nav }) {
  const addr = [['home','Дім','Ужгород, вул. Капушанська 12'],['box','Робота','Ужгород, пл. Корятовича 1'],['pin','Склад','с. Сторожниця, вул. Миру 8']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Збережені адреси" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <ListCard>
          {addr.map(([ic, t, a], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < addr.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={ic} size={19} color={T.ink}/></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{t}</div><div style={{ fontSize: 12.5, color: T.txt2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a}</div></div>
              <Icon name="chevR" size={17} color={T.txt3}/>
            </div>
          ))}
        </ListCard>
        <PrimaryBtn color={T.ink} txt="#fff" icon="plus" onClick={() => {}}>Додати адресу</PrimaryBtn>
      </div>
    </div>
  );
}

// ── DOCUMENTS / VERIFICATION (driver) ──────────────────────
function Documents({ nav }) {
  const docs = [
    ['Водійське посвідчення', 'Дійсне до 09.2028', 'ok'],
    ['Техпаспорт авто', 'Mercedes Sprinter · AO 1234 CT', 'ok'],
    ['Страховка ОСЦПВ', 'Закінчується за 14 днів', 'warn'],
    ['Паспорт / ID-картка', 'Підтверджено', 'ok'],
    ['Фото з транспортом', 'Підтверджено', 'ok'],
  ];
  const pill = (st) => st === 'ok'
    ? <span style={{ fontSize: 11.5, fontWeight: 700, color: T.green, background: T.greenBg, padding: '4px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="shield" size={12} color={T.green}/> Перевірено</span>
    : <span style={{ fontSize: 11.5, fontWeight: 700, color: '#C2410C', background: '#FBEAE0', padding: '4px 10px', borderRadius: 999 }}>Оновити</span>;
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Документи" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        {/* status banner */}
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 18, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(31,168,106,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="shield" size={26} color={T.green}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Акаунт верифіковано</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>4 з 5 документів актуальні · 1 потребує оновлення</div>
          </div>
        </div>
        <ListCard>
          {docs.map(([t, s, st], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < docs.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="shield" size={18} color={st === 'ok' ? T.ink : '#C2410C'}/></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div><div style={{ fontSize: 12, color: T.txt3 }}>{s}</div></div>
              {pill(st)}
            </div>
          ))}
        </ListCard>
      </div>
    </div>
  );
}

// ── PROMOS (client) ────────────────────────────────────────
function Promos({ nav }) {
  const codes = [['WELCOME', '−100 ₴ на перше замовлення', 'до 30.06'],['ZAKARPATTYA', '−15% на доставку в межах області', 'активний']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Промокоди" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, background: '#fff', border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: '14px 16px', fontSize: 14.5, color: T.txt3, fontWeight: 600 }}>Введіть промокод</div>
          <button style={{ width: 90, borderRadius: 14, border: 'none', background: T.ink, color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: T.font, cursor: 'pointer' }}>Додати</button>
        </div>
        {codes.map(([c, d, e], i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(242,200,75,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="spark" size={24} color={T.accentDark}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>{c}</div>
              <div style={{ fontSize: 12.5, color: T.txt2, marginTop: 2 }}>{d}</div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: T.green, background: T.greenBg, padding: '4px 10px', borderRadius: 999 }}>{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── VERIFY (client trust) ──────────────────────────────────
function Verify({ nav }) {
  const items = [['user','Номер телефону','+380 67 •• 67','ok'],['box','Email','andriy@•••.com','ok'],['shield','Документ (для B2B)','Додати ЄДРПОУ','add']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Верифікація" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <div style={{ textAlign: 'center', padding: '12px 0 22px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Icon name="shield" size={36} color={T.green}/></div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Ви — перевірений клієнт</div>
          <div style={{ fontSize: 13.5, color: T.txt2, marginTop: 4 }}>Це підвищує довіру водіїв і пріоритет підбору</div>
        </div>
        <ListCard>
          {items.map(([ic, t, d, st], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < items.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={ic} size={19} color={T.ink}/></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{t}</div><div style={{ fontSize: 12, color: T.txt3 }}>{d}</div></div>
              {st === 'ok' ? <Icon name="shield" size={18} color={T.green}/> : <span style={{ fontSize: 12.5, fontWeight: 700, color: T.accentDark }}>Додати</span>}
            </div>
          ))}
        </ListCard>
      </div>
    </div>
  );
}

// ── BUSINESS (B2B) ─────────────────────────────────────────
function Business({ nav }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Onetachka для бізнесу" onBack={nav.back}/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `4px ${AS_PAD}px 16px` }}>
        <div style={{ background: T.ink, borderRadius: T.radCard, padding: 22, color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -10, opacity: .1 }}><Truck size="l" color={T.accent} w={150}/></div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: T.accent }}>B2B-АКАУНТ</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 6, maxWidth: 230, lineHeight: 1.15 }}>Логістика для вашого бізнесу</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 8 }}>Єдиний рахунок, звіти, відстрочка платежу</div>
        </div>
        <ListCard>
          <Row icon="box" title="Безготівковий розрахунок"/>
          <div style={{ borderTop: `1px solid ${T.line}` }}><Row icon="spark" title="Знижки на обсяг"/></div>
          <div style={{ borderTop: `1px solid ${T.line}` }}><Row icon="user" title="Кілька співробітників"/></div>
          <div style={{ borderTop: `1px solid ${T.line}` }}><Row icon="shield" title="Закриваючі документи"/></div>
        </ListCard>
        <PrimaryBtn icon="arrow" onClick={() => {}}>Підключити бізнес-акаунт</PrimaryBtn>
      </div>
    </div>
  );
}

// ── PREMIUM (driver subscription) ──────────────────────────
function Premium({ nav }) {
  const feats = ['Пріоритет у підборі замовлень','0% комісії перший місяць','Підвищений ліміт виплат','Значок Premium у профілі','Підтримка 24/7'];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.ink, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="" onBack={nav.back} dark/>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `0 ${AS_PAD}px 16px` }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon name="star" size={42} color={T.ink}/></div>
          <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', letterSpacing: -0.6 }}>Onetachka Premium</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginTop: 6 }}>Більше замовлень — більший заробіток</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: T.radCard, padding: 20, marginBottom: 16 }}>
          {feats.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="chevR" size={13} color={T.ink}/></div>
              <span style={{ color: '#fff', fontSize: 14.5, fontWeight: 600 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.12)`, borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>Місяць</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>299 ₴</div>
          </div>
          <div style={{ flex: 1, background: T.accent, borderRadius: 16, padding: 14, position: 'relative' }}>
            <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 700, opacity: .7 }}>Рік · −30%</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>2 490 ₴</div>
          </div>
        </div>
      </div>
      <div style={{ padding: `0 ${AS_PAD}px 30px` }}><PrimaryBtn onClick={() => nav.back()}>Спробувати безкоштовно</PrimaryBtn></div>
    </div>
  );
}

Object.assign(window, { Onboarding, Login, Register, Otp, Settings, Payments, Addresses, Documents, Promos, Verify, Business, Premium });
