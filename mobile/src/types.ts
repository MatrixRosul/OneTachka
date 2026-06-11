export type Role = 'CLIENT' | 'DRIVER';
export type VehicleType = 'CAR' | 'VAN' | 'TRUCK_SMALL' | 'TRUCK_LARGE';
export type OrderStatus =
  | 'SEARCHING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DriverProfile {
  vehicleType: VehicleType;
  capacityKg: number;
  licensePlate: string;
  isAvailable: boolean;
  currentLat: number | null;
  currentLng: number | null;
}

export interface User {
  id: string;
  role: Role;
  fullName: string;
  phone: string;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  driverProfile: DriverProfile | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  clientId: string;
  driverId: string | null;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  cargoType: string;
  weightKg: number;
  vehicleType: VehicleType;
  description: string | null;
  price: string | null;
  scheduledAt: string | null;
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
}

export interface Review {
  id: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  score: number;
  comment: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
