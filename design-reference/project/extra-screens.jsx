// extra-screens.jsx — tab destinations: Orders, Chats, Profile (client + driver)
// Exports: COrders, CChats, CProfile, DOrders, DChats, DProfile
const XPAD = 18;

// ── shared bits ────────────────────────────────────────────
function Segmented({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#EDECE6', borderRadius: 14, padding: 4, marginBottom: 16 }}>
      {tabs.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} style={{ flex: 1, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 13.5, background: value === k ? '#fff' : 'transparent', color: value === k ? T.ink : T.txt2, boxShadow: value === k ? '0 1px 4px rgba(0,0,0,.08)' : 'none' }}>{l}</button>
      ))}
    </div>
  );
}

function StatusPill({ kind }) {
  const m = {
    active: ['В дорозі', T.ink, T.accent],
    done: ['Доставлено', T.green, T.greenBg],
    cancel: ['Скасовано', '#C2410C', '#FBEAE0'],
  }[kind];
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: kind==='active'?T.ink:m[1], background: m[2], padding: '4px 10px', borderRadius: 999 }}>{m[0]}</span>;
}

function ChatRow({ initials, name, last, time, unread, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${T.line}` }}>
      <div style={{ position: 'relative' }}>
        <Avatar initials={initials} size={48}/>
        <div style={{ position: 'absolute', bottom: 2, right: 2, width: 11, height: 11, borderRadius: '50%', background: T.green, border: '2px solid #fff' }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
          <span style={{ fontSize: 11.5, color: T.txt3, flexShrink: 0 }}>{time}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ fontSize: 13, color: T.txt2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last}</span>
          {unread > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: T.accent, color: T.ink, fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>{unread}</span>}
        </div>
      </div>
    </button>
  );
}

function Row({ icon, title, detail, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={19} color={T.ink}/></div>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{title}</span>
      {detail && <span style={{ fontSize: 13, fontWeight: 600, color: accent || T.txt3 }}>{detail}</span>}
      <Icon name="chevR" size={17} color={T.txt3}/>
    </button>
  );
}

function ListCard({ children }) {
  return <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radCard, overflow: 'hidden', marginBottom: 16 }}>{children}</div>;
}

// ════════════════════════ CLIENT ════════════════════════════
function COrders({ nav, app }) {
  const [tab, setTab] = React.useState('active');
  const past = [
    ['Дім → Склад «Епіцентр»', 'вчора', '320 ₴', 'done', 5],
    ['Меблі IKEA → Берегово', '3 дні тому', '890 ₴', 'done', 5],
    ['Ужгород → Чоп', 'тиждень тому', '650 ₴', 'cancel', 0],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${XPAD}px 16px` }}>
        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, marginBottom: 16 }}>Замовлення</div>
        <Segmented tabs={[['active','Активні'],['history','Історія']]} value={tab} onChange={setTab}/>
        {tab === 'active' ? (
          app.active ? (
            <button onClick={() => nav.go('tracking')} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1.5px solid ${T.accent}`, borderRadius: T.radCard, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12.5, color: T.txt2, fontWeight: 700 }}>Ужгород → Мукачево</span>
                <StatusPill kind="active"/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials="В" size={42} ring/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Василь М. · Sprinter</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: T.txt2, marginTop: 2 }}><Icon name="clock" size={13} color={T.accentDark}/> Прибуття через 8 хв</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 16 }}>1 250 ₴</span>
              </div>
            </button>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: T.txt3 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Icon name="box" size={28} color={T.txt3}/></div>
              <div style={{ fontWeight: 700, fontSize: 15, color: T.txt2 }}>Немає активних замовлень</div>
              <div style={{ fontSize: 13, marginTop: 4, marginBottom: 18 }}>Створіть нове — водій приїде за 15 хв</div>
              <div style={{ maxWidth: 220, margin: '0 auto' }}><PrimaryBtn icon="arrow" onClick={() => nav.go('create')}>Нове замовлення</PrimaryBtn></div>
            </div>
          )
        ) : (
          <ListCard>
            {past.map(([r, d, p, st, stars], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < past.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Truck size="m" w={26}/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}><StatusPill kind={st}/><span style={{ fontSize: 11.5, color: T.txt3 }}>{d}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{p}</div>
                  {stars > 0 && <div style={{ marginTop: 2 }}><Stars v={stars} size={11}/></div>}
                </div>
              </div>
            ))}
          </ListCard>
        )}
      </div>
      <TabBar active="box" nav={nav} role="client"/>
    </div>
  );
}

function CChats({ nav, app, set }) {
  const chats = [
    { id: 1, initials: 'В', name: 'Василь М.', last: 'Добре. Вантаж великий? Потрібна допомога?', time: 'зараз', unread: 1, sub: 'Mercedes Sprinter' },
    { id: 2, initials: 'О', name: 'Олег П.', last: 'Дякую за замовлення! 👍', time: 'вчора', unread: 0, sub: 'Renault Master' },
    { id: 3, initials: 'OT', name: 'Підтримка Onetachka', last: 'Ваш промокод активовано', time: '2 дні', unread: 0, sub: 'Служба підтримки' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${XPAD}px 16px` }}>
        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, marginBottom: 16 }}>Повідомлення</div>
        {chats.map(c => <ChatRow key={c.id} {...c} onClick={() => { set({ chatWith: { name: c.name, initials: c.initials } }); nav.go('chat'); }}/>)}
      </div>
      <TabBar active="chat" nav={nav} role="client"/>
    </div>
  );
}

function ProfileScreen({ nav, role, name, sub, badge, stats, sections, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${XPAD}px 16px` }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <Avatar initials={name[0]} size={64} ring/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>{name}</div>
            <div style={{ fontSize: 13, color: T.txt2 }}>{sub}</div>
            {badge && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, background: T.greenBg, color: T.green, fontSize: 11.5, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}><Icon name="shield" size={13} color={T.green}/> {badge}</div>}
          </div>
        </div>
        {/* stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          {stats.map(([v, l], i) => (
            <div key={i} style={{ flex: 1, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.5 }}>{v}</div>
              <div style={{ fontSize: 11.5, color: T.txt3, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {sections.map((sec, i) => (
          <React.Fragment key={i}>
            {sec.label && <div style={{ fontSize: 12.5, fontWeight: 700, color: T.txt3, textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 4px 8px' }}>{sec.label}</div>}
            <ListCard>
              {sec.rows.map((r, j) => (
                <div key={j} style={{ borderBottom: j < sec.rows.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                  <Row icon={r[0]} title={r[1]} detail={r[2]} accent={r[3]} onClick={() => r[4] && nav.go(r[4])}/>
                </div>
              ))}
            </ListCard>
          </React.Fragment>
        ))}
      </div>
      <TabBar active="user" nav={nav} role={role}/>
    </div>
  );
}

function CProfile({ nav }) {
  return <ProfileScreen nav={nav} role="client" name="Андрій Коваль" sub="+380 67 123 45 67" badge="Перевірений клієнт"
    stats={[['24','замовлень'],['4.9','рейтинг'],['8 940 ₴','витрачено']]}
    sections={[
      { rows: [['box','Способи оплати','Visa •• 4821', null, 'payments'],['pin','Збережені адреси','3', null, 'addresses'],['spark','Промокоди','2 активні', T.green, 'promos']] },
      { label: 'Безпека', rows: [['shield','Верифікація','пройдено', T.green, 'verify'],['user','Особисті дані', null, null, 'settings']] },
      { label: 'Бізнес', rows: [['box','Onetachka для бізнесу','B2B-акаунт', T.accentDark, 'business']] },
      { rows: [['chat','Підтримка', null, null, 'chats'],['menu','Налаштування', null, null, 'settings'],['arrowUR','Вийти','', '#C2410C', 'onboarding']] },
    ]}/>;
}

// ════════════════════════ DRIVER ════════════════════════════
function DOrders({ nav, app, set }) {
  const [tab, setTab] = React.useState('available');
  const avail = [
    ['Ужгород → Мукачево', 'середній · 42 км', '8 хв', '1 250 ₴', true],
    ['Берегово → Виноградів', 'малий · 28 км', '15 хв', '780 ₴', false],
    ['Чоп → Ужгород', 'великий · 24 км', '20 хв', '1 480 ₴', false],
  ];
  const history = [
    ['Ужгород → Мукачево', 'щойно завершено', '+1 063 ₴'],
    ['Берегово → Виноградів', '2 год тому', '+780 ₴'],
    ['Склад «Епіцентр» → Дім', 'сьогодні', '+420 ₴'],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${XPAD}px 16px` }}>
        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, marginBottom: 16 }}>Замовлення</div>
        <Segmented tabs={[['available','Доступні'],['history','Виконані']]} value={tab} onChange={setTab}/>
        {tab === 'available' ? avail.map(([r, m, eta, p, ai], i) => (
          <button key={i} onClick={() => { set({ jobStep: 0 }); nav.go('dnav'); }} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: ai ? '#FFFDF4' : '#fff', border: `1.5px solid ${ai ? T.accent : T.border}`, borderRadius: 18, padding: 15, marginBottom: 10, position: 'relative' }}>
            {ai && <div style={{ position: 'absolute', top: -10, left: 14, background: T.accent, color: T.ink, fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="spark" size={12} color={T.ink}/> AI підбір</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15.5 }}>{r}</div>
                <div style={{ fontSize: 12.5, color: T.txt2, marginTop: 3 }}>{m}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: T.txt2, marginTop: 3 }}><Icon name="clock" size={13} color={T.accentDark}/> подача {eta}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.5 }}>{p}</div>
                <div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>+85%</div>
              </div>
            </div>
          </button>
        )) : (
          <ListCard>
            {history.map(([r, d, p], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < history.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size="m" w={26}/></div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{r}</div><div style={{ fontSize: 11.5, color: T.txt3 }}>{d}</div></div>
                <span style={{ fontWeight: 800, fontSize: 14.5, color: T.green }}>{p}</span>
              </div>
            ))}
          </ListCard>
        )}
      </div>
      <TabBar active="box" nav={nav} role="driver"/>
    </div>
  );
}

function DChats({ nav, app, set }) {
  const chats = [
    { id: 1, initials: 'А', name: 'Андрій К. (клієнт)', last: 'Дякую! Чекаю біля під\'їзду', time: 'зараз', unread: 1 },
    { id: 2, initials: 'OT', name: 'Диспетчер Onetachka', last: 'Нове замовлення поруч з вами', time: '10 хв', unread: 0 },
    { id: 3, initials: 'М', name: 'Марія (клієнт)', last: 'Все чудово, дякую 🙏', time: 'вчора', unread: 0 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `54px ${XPAD}px 16px` }}>
        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, marginBottom: 16 }}>Повідомлення</div>
        {chats.map(c => <ChatRow key={c.id} {...c} onClick={() => { set({ chatWith: { name: c.name, initials: c.initials } }); nav.go('chat'); }}/>)}
      </div>
      <TabBar active="chat" nav={nav} role="driver"/>
    </div>
  );
}

function DProfile({ nav }) {
  return <ProfileScreen nav={nav} role="driver" name="Василь Мельник" sub="Mercedes Sprinter · AO 1234 CT" badge="Верифікований водій"
    stats={[['870','поїздок'],['4.9','рейтинг'],['2 роки','стаж']]}
    sections={[
      { rows: [['box','Заробіток і виплати','14 280 ₴', T.green, 'earnings'],['shield','Документи','верифіковано', T.green, 'documents'],['user','Транспорт','Sprinter 3.5т', null, 'documents']] },
      { label: 'Статус', rows: [['star','Onetachka Premium','активувати', T.accentDark, 'premium'],['spark','Статистика та бонуси', null, null, 'earnings']] },
      { rows: [['chat','Підтримка водіїв', null, null, 'dchats'],['menu','Налаштування', null, null, 'settings'],['arrowUR','Вийти','', '#C2410C', 'onboarding']] },
    ]}/>;
}

Object.assign(window, { COrders, CChats, CProfile, DOrders, DChats, DProfile, Segmented, ListCard, Row, StatusPill });
