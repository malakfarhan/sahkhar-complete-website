const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'API error');
  return json.data as T;
}

const post = (path: string, body: object) =>
  req(path, { method: 'POST', body: JSON.stringify(body) });

// ── Cars ────────────────────────────────────────────────
export const apiGetCars       = ()                    => req<any[]>('/cars.php');
export const apiAddCar        = (car: object)         => post('/cars.php', { action: 'add', ...car });
export const apiUpdateCar     = (id: number, car: object) => post('/cars.php', { action: 'update', id, ...car });
export const apiDeleteCar     = (id: number)          => post('/cars.php', { action: 'delete', id });

// ── Locations ───────────────────────────────────────────
export const apiGetLocations    = ()                         => req<any[]>('/locations.php');
export const apiAddLocation     = (loc: object)              => post('/locations.php', { action: 'add', ...loc });
export const apiUpdateLocation  = (id: string, loc: object)  => post('/locations.php', { action: 'update', id, ...loc });
export const apiDeleteLocation  = (id: string)               => post('/locations.php', { action: 'delete', id });

// ── Slides ──────────────────────────────────────────────
export const apiGetSlides    = ()                         => req<any[]>('/slides.php');
export const apiAddSlide     = (slide: object)            => post('/slides.php', { action: 'add', ...slide });
export const apiUpdateSlide  = (id: number, slide: object) => post('/slides.php', { action: 'update', id, ...slide });
export const apiDeleteSlide  = (id: number)               => post('/slides.php', { action: 'delete', id });

// ── Bookings ────────────────────────────────────────────
export const apiGetBookings = (filters?: { status?: string; date?: string; search?: string }) => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.date) params.set('date', filters.date);
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  return req<any[]>(`/bookings.php${qs ? '?' + qs : ''}`);
};
export const apiAddBooking          = (booking: object)               => post('/bookings.php', { action: 'add', ...booking });
export const apiUpdateBookingStatus = (id: string, status: string)    => post('/bookings.php', { action: 'update-status', id, status });
export const apiDeleteBooking       = (id: string)                    => post('/bookings.php', { action: 'delete', id });

export interface ActivityLog {
  id: number; log_id: string; action_type: string; description: string;
  username: string; entity_type: string; entity_id: string; booking_id: string | null;
  old_value: string | null; new_value: string | null; created_at: string;
}
export const apiGetActivityLogs = (filters?: { bookingId?: string; limit?: number }) => {
  const params = new URLSearchParams();
  if (filters?.bookingId) params.set('bookingId', filters.bookingId);
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return req<ActivityLog[]>(`/activity_logs.php${qs ? '?' + qs : ''}`);
};

// ── Auth ────────────────────────────────────────────────
export const apiLogin = (username: string, password: string) =>
  post('/auth.php', { username, password });

// ── Users ───────────────────────────────────────────────
export const apiGetUsers            = ()                                    => req<any[]>('/users.php');
export const apiAddUser             = (user: object)                        => post('/users.php', { action: 'add', ...user });
export const apiDeleteUser          = (id: string)                          => post('/users.php', { action: 'delete', id });
export const apiUpdateUserPassword  = (id: string, password: string)        => post('/users.php', { action: 'update-password', id, password });
