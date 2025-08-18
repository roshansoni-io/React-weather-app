import { useState, useEffect } from "react";

function useWeather(location) {
  const [meta, setMeta] = useState(null);
  const [now, setNow] = useState(null);
  const [daily, setDaily] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    let intervalId;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weathercode&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode`
        );
        const data = await res.json();
        setMeta(data);
        setNow(data.current);
        setHourly(data.hourly);
        setDaily(data.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather(); // initial load
    intervalId = setInterval(fetchWeather, 10000); // every 10s

    return () => clearInterval(intervalId); // cleanup
  }, [location]);

  return { meta, now, daily, hourly, loading };
}

export default useWeather;