import { useState, useEffect } from "react";

const WX_API = "https://api.open-meteo.com/v1/forecast";

export default function useWeather(location) {
  const [meta, setMeta] = useState(null);
  const [now, setNow] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====== Fetch Weather ======
  useEffect(() => {
    if (!location) return;
    let intervalId;

    async function fetchWeather() {
      setLoading(true);
      try {
        const url = `${WX_API}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation,cloud_cover,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset&timezone=auto`;

        const res = await fetch(url);
        const data = await res.json();

        // meta info
        setMeta({
          latitude: data.latitude,
          longitude: data.longitude,
          elevation: data.elevation,
          timezone: data.timezone,
          model: data.model,
        });

        // current conditions
        const c = data.current;
        setNow({
          temp: c.temperature_2m,
          feels: c.apparent_temperature,
          humidity: c.relative_humidity_2m,
          wind: c.wind_speed_10m,
          pressure: c.pressure_msl,
          clouds: c.cloud_cover,
          precip: c.precipitation,
          code: c.weather_code,
        });

        // hourly forecast
        setHourly({
          time: data.hourly.time,
          temp: data.hourly.temperature_2m,
          precip: data.hourly.precipitation,
          clouds: data.hourly.cloud_cover,
          code: data.hourly.weather_code,
        });

        // daily forecast
        setDaily({
          time: data.daily.time,
          tempMax: data.daily.temperature_2m_max,
          tempMin: data.daily.temperature_2m_min,
          precip: data.daily.precipitation_sum,
          code: data.daily.weather_code,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset,
        });
      } catch (err) {
        // Production: log minimal info
        if (import.meta.env.DEV) console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather(); // initial load
    intervalId = setInterval(fetchWeather, 60000); // refresh every 1 min

    return () => clearInterval(intervalId);
  }, [location]);

  // ====== Fetch Place via Reverse Geocoding (Open-Meteo or Nominatim) ======
  useEffect(() => {
    if (!location) return;

    async function fetchPlace() {
      try {
        // Use Nominatim (OpenStreetMap) for free reverse geocoding without API key
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&accept-language=en`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const placeData = await response.json();
        const addr = placeData.address || {};
        
        setPlace({
          name: placeData.display_name,
          city: addr.city || addr.town || addr.village || addr.suburb || "Unknown Place",
          state: addr.state,
          country: addr.country,
          country_code: addr.country_code,
        });
      } catch (err) {
        console.error("Place fetch failed:", err);
        // Fallback to location label if provided
        if (location.label) {
            setPlace({ city: location.name || "Unknown", name: location.label });
        }
      }
    }

    fetchPlace();
  }, [location]);

  return { meta, now, hourly, daily, place, loading };
}