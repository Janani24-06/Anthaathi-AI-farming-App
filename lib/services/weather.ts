export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    city: string;
    humidity: number;
    windSpeed: number;
}

const API_KEY = '7818164891a040c2e8b4e9395d90aa3f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (response.status !== 200) {
            console.error('Weather API Error:', data.message);
            return null;
        }

        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            icon: data.weather[0].icon,
            city: data.name,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};
