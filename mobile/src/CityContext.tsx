import React, { createContext, useContext, useState } from 'react';
import { CITIES, type City } from './cities';

interface CityState {
  city: City;
  setCity: (c: City) => void;
}

const Ctx = createContext<CityState | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<City>(CITIES[0]);
  return <Ctx.Provider value={{ city, setCity }}>{children}</Ctx.Provider>;
}

export function useCity(): CityState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCity must be used within CityProvider');
  return v;
}
