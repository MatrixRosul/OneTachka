// Onetachka design tokens — ported from the Claude Design bundle (ui.jsx).
export const T = {
  ink: '#1E3A8A', // brand deep blue
  ink2: '#2A4BA8',
  accent: '#F2C84B', // brand yellow
  accentDark: '#E0B62F',
  bg: '#F5F5F1', // warm off-white app bg
  surface: '#FFFFFF',
  txt: '#1E3A8A',
  txt2: '#6C6F78',
  txt3: '#A4A7AF',
  border: '#EAE9E4',
  line: '#F0EFEA',
  green: '#1FA86A',
  greenBg: '#E6F4EC',
  red: '#B00020',
  radSheet: 30,
  radCard: 22,
  radBtn: 16,
};

// Manrope family names as registered by @expo-google-fonts/manrope.
export const FONT = {
  r: 'Manrope_400Regular',
  m: 'Manrope_500Medium',
  sb: 'Manrope_600SemiBold',
  b: 'Manrope_700Bold',
  xb: 'Manrope_800ExtraBold',
};

// Status → accent colour (matches the design status pills).
export const STATUS_COLOR: Record<string, string> = {
  SEARCHING: '#C98A00',
  ACCEPTED: '#2D6CDF',
  IN_PROGRESS: '#8A2DBF',
  COMPLETED: '#1FA86A',
  CANCELLED: '#999999',
};

export const STATUS_LABEL: Record<string, string> = {
  SEARCHING: 'Пошук',
  ACCEPTED: 'Прийнято',
  IN_PROGRESS: 'В дорозі',
  COMPLETED: 'Доставлено',
  CANCELLED: 'Скасовано',
};

export const VEHICLE_LABEL: Record<string, string> = {
  CAR: 'Легкове',
  VAN: 'Бус',
  TRUCK_SMALL: 'Вантажівка (мала)',
  TRUCK_LARGE: 'Вантажівка (велика)',
};
