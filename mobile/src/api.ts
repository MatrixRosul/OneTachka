import type {
  AuthResponse,
  DriverProfile,
  Order,
  OrderStatus,
  Review,
  Role,
  User,
  VehicleType,
} from './types';
import { readToken, writeToken } from './storage';

// On web we derive the backend host from the page itself, so the same export
// works on localhost, LAN IP, or an iPhone hotspot without rebuilding.
// Native: set EXPO_PUBLIC_API_URL (LAN IP / 10.0.2.2 for Android emulator).
function defaultBase(): string {
  const g: any = globalThis;
  const host = g?.location?.hostname;
  if (host) return `http://${host}:8010`;
  return 'http://localhost:8010';
}
const BASE = process.env.EXPO_PUBLIC_API_URL ?? defaultBase();

let token: string | null = null;

export async function loadToken(): Promise<string | null> {
  token = await readToken();
  return token;
}

export async function setToken(t: string | null): Promise<void> {
  token = t;
  await writeToken(t);
}

export function getToken(): string | null {
  return token;
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = data?.error;
    throw new ApiError(err?.code ?? 'error', err?.message ?? res.statusText, res.status);
  }
  return data as T;
}

export interface OrderCreateBody {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  cargoType: string;
  weightKg: number;
  vehicleType: VehicleType;
  description?: string;
  price?: number;
  scheduledAt?: string;
}

export const api = {
  register: (b: { role: Role; fullName: string; phone: string; password: string }) =>
    request<AuthResponse>('POST', '/auth/register', b),
  login: (b: { phone: string; password: string }) =>
    request<AuthResponse>('POST', '/auth/login', b),
  me: () => request<User>('GET', '/me'),

  putProfile: (b: { vehicleType: VehicleType; capacityKg: number; licensePlate: string }) =>
    request<DriverProfile>('PUT', '/driver/profile', b),
  setAvailability: (b: { isAvailable: boolean; currentLat?: number; currentLng?: number }) =>
    request<DriverProfile>('PATCH', '/driver/availability', b),

  createOrder: (b: OrderCreateBody) => request<Order>('POST', '/orders', b),
  myOrders: () => request<Order[]>('GET', '/orders'),
  availableOrders: () => request<Order[]>('GET', '/orders/available'),
  accept: (id: string) => request<Order>('POST', `/orders/${id}/accept`),
  setStatus: (id: string, status: OrderStatus) =>
    request<Order>('POST', `/orders/${id}/status`, { status }),
  cancel: (id: string) => request<Order>('POST', `/orders/${id}/cancel`),
  setPrice: (id: string, price: number) =>
    request<Order>('POST', `/orders/${id}/price`, { price }),
  review: (id: string, b: { score: number; comment?: string }) =>
    request<Review>('POST', `/orders/${id}/review`, b),
};

export function errText(ex: unknown): string {
  return ex instanceof ApiError ? ex.message : String(ex);
}
