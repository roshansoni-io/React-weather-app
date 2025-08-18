import { useState, useEffect } from "react";

const WX_API = "https://api.open-meteo.com/v1/forecast";

export default function useWeather(location) {
  const [meta, setMeta] = useState(null);
  const [now, setNow] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [Place, setPlace] = useState(null);
  

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
          test: "test",
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
          code: c.weather_code, // WMO code
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
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    
//     const fetchPlace = async (location) => {
//         const apiKey = "pk.506e88bdeb63623b504b34e7ef01f73e";
//         const options = { method: "GET", headers: { accept: "application/json" } };
//       
//         try {
//           const response = await fetch(
//             `https://us1.locationiq.com/v1/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&accept-language=en&addressdetails=1&normalizeaddress=1&key=${apiKey}`,
//             options
//           );
//       
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//       
//           const placeData = await response.json();
//           console.log("Place JSON:", placeData);
//           return placeData;
//         } catch (err) {
//           console.error("Fetch error:", err);
//           return null;
//         }
// 
//       
//       // Example usage:
//      // fetchPlace({ latitude: 26.0484189, longitude: 86.7366956 });
//       
// 
// 
//         setPlace({
//           name: placeData.display_name,
//           road: placeData.address.road,
//           city: placeData.address.city,
//           county: placeData.address.county,
//           state: placeData.address.state,
//           postcode: placeData.address.postcode,
//           country: placeData.address.country,
//           
//           
//           //may cause error
//           district: placeData.address.state_district,
//           country_code: placeData.address.country_code
//         })
//     };
    

        
        
        
    
fetchWeather(); // initial load
    intervalId = setInterval(fetchWeather, 60000); // every 10s

    return () => clearInterval(intervalId); // cleanup
  }, [location]);
  

  return { meta, now, hourly, daily, loading };
}