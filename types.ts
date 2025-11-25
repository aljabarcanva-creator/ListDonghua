export type FilmStatus = 'In Progress' | 'Complete' | 'Belum di Tonton';

export interface Film {
  id: string;
  title: string;
  status: FilmStatus;
  episodes: number;
  date: string; // ISO Date string (YYYY-MM-DD)
}

export interface FilmFormData {
  title: string;
  status: FilmStatus;
  episodes: number;
  date: string;
}