const API_KEY = 'bd1fc4a60cacccbba6648d10f89b8d0b';
const BASE_URL = 'https://api.agromonitoring.com/agro/1.0';

/**
 * Helper to add a delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Polygon {
    id: string;
    name: string;
    geo_json: any;
    center: [number, number];
    area: number;
    user_id: string;
}

export interface SoilData {
    dt: number;
    t10: number; // Soil temperature at 10cm depth (K)
    moisture: number; // Soil moisture (m3/m3)
    t0: number; // Surface temperature"
}

export interface NDVIData {
    dt: number;
    stats: {
        max: number;
        mean: number;
        median: number;
        min: number;
        p25: number;
        p75: number;
        std: number;
    };
}

export const agromonitoring = {
    createPolygon: async (name: string, coordinates: [number, number][]): Promise<Polygon> => {
        // Map Leaflet [lat, lng] to GeoJSON [lng, lat]
        const lngLatCoords = coordinates.map(([lat, lng]) => [lng, lat]);

        // Ensure polygon is closed (first point == last point)
        if (lngLatCoords[0][0] !== lngLatCoords[lngLatCoords.length - 1][0] ||
            lngLatCoords[0][1] !== lngLatCoords[lngLatCoords.length - 1][1]) {
            lngLatCoords.push(lngLatCoords[0]);
        }

        const response = await fetch(`${BASE_URL}/polygons?appid=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                geo_json: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [lngLatCoords]
                    }
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to create polygon: ${err}`);
        }

        return response.json();
    },

    getSoilData: async (polygonId: string): Promise<SoilData> => {
        const response = await fetch(`${BASE_URL}/soil?polyid=${polygonId}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch soil data');
        return response.json();
    },

    getNDVIHistory: async (polygonId: string, start: number, end: number): Promise<NDVIData[]> => {
        const response = await fetch(`${BASE_URL}/ndvi/history?polyid=${polygonId}&start=${start}&end=${end}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch NDVI data');
        return response.json();
    },

    getSatelliteTile: (polygonId: string) => {
        // Agro monitoring search API returns tile lists. 
        // For a simple mock/demo, we'll return a placeholder that looks like a satellite view
        // Real implementation would use the /image/search endpoint
        return `http://api.agromonitoring.com/agro/1.0/image/search?polyid=${polygonId}&appid=${API_KEY}`;
    }
};
