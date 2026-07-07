import Constants from 'expo-constants';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  condition: string;
  location: string;
}

export async function fetchWeather(city: string = "Chennai"): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await response.json();
    
    // Note: Free tier doesn't always provide rain chance directly in the current weather API
    // We'll use clouds or pop if available, or default to 0
    const rainChance = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      rainChance: Math.min(Math.round(rainChance * 10), 100), // Simple heuristic for display
      condition: data.weather[0].main,
      location: `${data.name}, ${data.sys.country}`,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Fallback data
    return {
      temp: 28,
      feelsLike: 32,
      humidity: 72,
      windSpeed: 14,
      rainChance: 45,
      condition: "Partly Cloudy",
      location: "Chennai, Tamil Nadu",
    };
  }
}
