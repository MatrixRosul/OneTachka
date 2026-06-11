// Великі міста Закарпаття — для вибору «де ви знаходитесь» (контекст підказок + центр карти).
export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  { name: 'Ужгород', lat: 48.6208, lng: 22.2879 },
  { name: 'Мукачево', lat: 48.4414, lng: 22.7178 },
  { name: 'Хуст', lat: 48.1795, lng: 23.2989 },
  { name: 'Берегове', lat: 48.205, lng: 22.6453 },
  { name: 'Виноградів', lat: 48.1503, lng: 23.0258 },
  { name: 'Свалява', lat: 48.5519, lng: 22.9962 },
  { name: 'Тячів', lat: 48.0106, lng: 23.5722 },
  { name: 'Рахів', lat: 48.054, lng: 24.2034 },
  { name: 'Воловець', lat: 48.7088, lng: 23.1456 },
  { name: 'Іршава', lat: 48.3175, lng: 23.0419 },
  { name: 'Перечин', lat: 48.737, lng: 22.471 },
  { name: 'Чоп', lat: 48.4347, lng: 22.2059 },
];

// Коротка адреса: вулиця + місто (без області/індексу/країни).
export function shortAddress(s: string, parts = 2): string {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, parts)
    .join(', ');
}
