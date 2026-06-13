export interface ShuttleRoute {
  id: string;
  source: string;
  destination: string;
  oneWayPrice: number;
  roundTripPrice: number;
  durationMinutes: number;
  features: string[];
  schedule: string[];
  description: string;
}

export interface Booking {
  id: string;
  routeId: string;
  source: string;
  destination: string;
  tripType: 'one-way' | 'round-trip';
  date: string;
  returnDate?: string;
  timeSlot: string;
  returnTimeSlot?: string;
  passengers: number;
  passengerName: string;
  email: string;
  phone: string;
  pickupAddress?: string;
  postalCode?: string;
  totalPrice: number;
  bookingCode: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
