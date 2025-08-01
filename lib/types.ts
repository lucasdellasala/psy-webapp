// API Response Types based on Postman Collection

export interface Topic {
  id: string;
  name: string;
  description?: string;
}

export interface SessionType {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  modality: 'online' | 'in_person';
  price?: number;
}

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  description: string;
  experience: string;
  topics: Topic[];
  modalities: ('online' | 'in_person')[];
  sessionTypes: SessionType[];
  availabilitySummary?: {
    freeSlotsCount: number;
  };
}

export interface AvailabilitySlot {
  id: string;
  startInPatientTz: string;
  endInPatientTz: string;
  startUtc: string;
  endUtc: string;
}

export interface DayAvailability {
  date: string;
  dayLabel: string;
  dayNumber: string;
  bookableStarts: AvailabilitySlot[];
}

export interface Session {
  id: string;
  therapistId: string;
  therapistName: string;
  sessionTypeId: string;
  sessionType: string;
  startUtc: string;
  endUtc: string;
  startInPatientTz: string;
  endInPatientTz: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientTz: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  therapistId: string;
  sessionTypeId: string;
  startUtc: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientTz: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Query Parameters
export interface TherapistsQueryParams {
  topicIds?: string;
  modality?: 'online' | 'in_person';
  limit?: number;
  offset?: number;
  weekStart?: string;
  sessionTypeId?: string;
  stepMin?: number;
  orderBy?: 'scarcity' | 'name' | 'experience';
  requireAll?: boolean;
}

export interface AvailabilityQueryParams {
  weekStart?: string;
  sessionTypeId: string;
  patientTz?: string;
  stepMin?: number;
} 