import { Film, FilmFormData } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbxI6rYokkWaH5_wHojm67nhLWe2cqfm6AH3o7oGduTjz_Pa824_dm1cx8sW28Z9XCrG/exec";

// Helper to map API data to App data
const mapApiDataToFilm = (item: any): Film => {
    // Handle date formatting from ISO string or other formats
    let dateStr = item.date;
    if (dateStr && typeof dateStr === 'string' && dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
    }

    return {
        id: item.rowIndex.toString(), // Use rowIndex from sheet as unique ID
        title: item.judul,
        status: item.status,
        episodes: Number(item.episode),
        date: dateStr
    };
};

export const fetchFilms = async (): Promise<Film[]> => {
    try {
        const response = await fetch(`${API_URL}?action=read`);
        const result = await response.json();
        if (result.status === 'success') {
            return result.data.map(mapApiDataToFilm);
        }
        throw new Error(result.message || 'Failed to fetch');
    } catch (error) {
        console.error("Error fetching films:", error);
        return [];
    }
};

export const addFilmToSheet = async (film: FilmFormData): Promise<boolean> => {
    try {
        const payload = {
            judul: film.title,
            status: film.status,
            episode: film.episodes,
            date: film.date
        };
        
        // Use text/plain to avoid CORS preflight issues with GAS
        const response = await fetch(`${API_URL}?action=add`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        return result.status === 'success';
    } catch (error) {
        console.error("Error adding film:", error);
        return false;
    }
};

export const updateFilmInSheet = async (id: string, film: FilmFormData): Promise<boolean> => {
    try {
        const payload = {
            rowIndex: id,
            judul: film.title,
            status: film.status,
            episode: film.episodes,
            date: film.date
        };

        const response = await fetch(`${API_URL}?action=edit`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result.status === 'success';
    } catch (error) {
        console.error("Error updating film:", error);
        return false;
    }
};

export const deleteFilmFromSheet = async (id: string): Promise<boolean> => {
    try {
        const payload = { rowIndex: id };
        
        const response = await fetch(`${API_URL}?action=delete`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result.status === 'success';
    } catch (error) {
        console.error("Error deleting film:", error);
        return false;
    }
};
