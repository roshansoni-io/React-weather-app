const WMO = {
  0: ["Clear", "☀️", "🌙"],
  1: ["Mainly clear", "🌤️", "🌙"],
  2: ["Partly cloudy", "⛅", "🌙☁️"],
  3: ["Overcast", "☁️", "☁️"],
  
  45: ["Fog", "🌫️", "🌫️"],
  48: ["Depositing rime fog", "🌫️", "🌫️"],
  
  51: ["Drizzle: light", "🌦️", "🌧️"],
  53: ["Drizzle: moderate", "🌦️", "🌧️"],
  55: ["Drizzle: dense", "🌧️", "🌧️"],
  
  56: ["Freezing drizzle: light", "🌧️", "🌧️"],
  57: ["Freezing drizzle: dense", "🌧️", "🌧️"],
  
  61: ["Rain: slight", "🌧️", "🌧️"],
  63: ["Rain: moderate", "🌧️", "🌧️"],
  65: ["Rain: heavy", "🌧️", "🌧️"],
  
  66: ["Freezing rain: light", "🌧️", "🌧️"],
  67: ["Freezing rain: heavy", "🌧️", "🌧️"],
  
  71: ["Snow fall: slight", "🌨️", "🌨️"],
  73: ["Snow fall: moderate", "🌨️", "🌨️"],
  75: ["Snow fall: heavy", "❄️", "❄️"],
  
  77: ["Snow grains", "❄️", "❄️"],
  
  80: ["Rain showers: slight", "🌦️", "🌧️"],
  81: ["Rain showers: moderate", "🌦️", "🌧️"],
  82: ["Rain showers: violent", "⛈️", "⛈️"],
  
  85: ["Snow showers: slight", "🌨️", "🌨️"],
  86: ["Snow showers: heavy", "❄️", "❄️"],
  
  95: ["Thunderstorm: slight/mod.", "⛈️", "⛈️"],
  96: ["Thunderstorm with slight hail", "⛈️", "⛈️"],
  99: ["Thunderstorm with heavy hail", "⛈️", "⛈️"]
};

const HourlyCard = ({ hourly }) => {
  if (!hourly) {
    return (
    <section className="panel hourly">
        <h2>Next 24 hours</h2>
        <div className="scroll-row">
            <div className="hour-card">
              <div>—</div>
              <div className="wx-icon">☀️</div>
              <div>—°C</div>
              <div className="subtle">—</div>
            </div>
        </div>
      </section>
    );
  }

  // take only first 24 entries
  const currTime = new Date().getHours();
  const hours = hourly.time.slice(currTime-1, currTime+24).map((time, i) => {
    const date = new Date(time);
    const label = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const temp = hourly.temp[i];
    const [desc, icon] = WMO[hourly.code[i]] || ["?", "❓"];
    const precip = hourly.precip[i];

    return { label, temp, desc, icon, precip };
  });

  return (
    <section className="panel hourly">
      <h2>Next 24 hours</h2>
      <div className="scroll-row">
        {hours.map((h, i) => (
          <div key={i} className="hour-card">
            <div>{h.label}</div>
            <div className="wx-icon">{h.icon}</div>
            <div>{h.temp}°C</div>
            <div className="subtle">{h.precip > 0 ? `${h.precip}mm` : "— —"}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyCard;