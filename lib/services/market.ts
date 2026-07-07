import { Platform } from 'react-native';

export interface MarketPrice {
    id: string;
    crop: string;
    market: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    timestamp: number;
}

// Mock data to simulate API response
// In a real scenario, this would be fetched from https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
const MOCK_DATA: MarketPrice[] = [
    { id: "1", crop: "Rice (Paddy)", market: "Koyambedu", minPrice: 2100, maxPrice: 2350, modalPrice: 2200, timestamp: Date.now() },
    { id: "2", crop: "Wheat", market: "Chennai", minPrice: 2500, maxPrice: 2800, modalPrice: 2650, timestamp: Date.now() },
    { id: "3", crop: "Tomato", market: "Madurai", minPrice: 800, maxPrice: 1200, modalPrice: 1000, timestamp: Date.now() },
    { id: "4", crop: "Onion", market: "Koyambedu", minPrice: 1500, maxPrice: 2000, modalPrice: 1750, timestamp: Date.now() },
    { id: "5", crop: "Potato", market: "Salem", minPrice: 1200, maxPrice: 1600, modalPrice: 1400, timestamp: Date.now() },
    { id: "6", crop: "Cotton", market: "Coimbatore", minPrice: 6200, maxPrice: 6800, modalPrice: 6500, timestamp: Date.now() },
    { id: "7", crop: "Sugarcane", market: "Tiruchirappalli", minPrice: 3100, maxPrice: 3500, modalPrice: 3300, timestamp: Date.now() },
    { id: "8", crop: "Groundnut", market: "Villupuram", minPrice: 5500, maxPrice: 6200, modalPrice: 5800, timestamp: Date.now() },
    { id: "9", crop: "Turmeric", market: "Erode", minPrice: 8000, maxPrice: 9500, modalPrice: 8700, timestamp: Date.now() },
    { id: "10", crop: "Banana", market: "Theni", minPrice: 600, maxPrice: 900, modalPrice: 750, timestamp: Date.now() },
    { id: "11", crop: "Coconut", market: "Pollachi", minPrice: 2800, maxPrice: 3200, modalPrice: 3000, timestamp: Date.now() },
    { id: "12", crop: "Chilli", market: "Guntur", minPrice: 12000, maxPrice: 15000, modalPrice: 13500, timestamp: Date.now() },
    { id: "13", crop: "Maize", market: "Dindigul", minPrice: 1800, maxPrice: 2100, modalPrice: 1950, timestamp: Date.now() },
    { id: "14", crop: "Black Gram", market: "Thanjavur", minPrice: 6800, maxPrice: 7500, modalPrice: 7200, timestamp: Date.now() },
    { id: "15", crop: "Green Gram", market: "Thiruvarur", minPrice: 7000, maxPrice: 7800, modalPrice: 7400, timestamp: Date.now() },
];

// Resource ID for Agmarknet Data
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = "579b464db66ec23bdd000001d2d7348b82c649a741b26aab81117035";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

export async function fetchMarketPrices(offset = 0, limit = 20): Promise<MarketPrice[]> {
    try {
        const url = `${BASE_URL}?api-key=${API_KEY}&format=json&offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.records) {
            return data.records.map((record: any, index: number) => ({
                id: `${offset}_${index}`,
                crop: record.commodity,
                market: record.market,
                minPrice: parseFloat(record.min_price),
                maxPrice: parseFloat(record.max_price),
                modalPrice: parseFloat(record.modal_price),
                timestamp: Date.now(), // API provides arrival_date, but we'll use current for trend
            }));
        }
        return [];
    } catch (error) {
        console.error("Market API Error:", error);
        return [];
    }
}
