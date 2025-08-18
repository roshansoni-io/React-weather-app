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

const wxCodeToIcon = (code) => {
  const pair = WMO[code] || ["Unknown", "❓"];
  return { desc: pair[0], icon: pair[1] };
};

const DailyCard = ({ daily }) => {
  if (!daily) return (
    <section className="panel now">
        <h2>daily</h2>
        <p>Loading...</p>
      </section>
    
    );
  

  return (
    <section className="panel">
      <h2>7-Day Forecast</h2>
      <div className="">
        {daily.time.map((day, i) => (
          <div key={day} className="day">
            <h3 className="name" >{new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}</h3>
            <div className="weather">
            <span className="wx-icon">
              {WMO[daily.code[i]][1]}
            </span>
            
            <p className="precip">🌧 {daily.precip[i]} mm</p>
            </div>
            <div className="tempInfo">
              <p className="hi"><span className="hi">{daily.tempMax[i]}°
              </span> / <span className="lo">
              {daily.tempMin[i]}°
              </span></p>
              <p className="sun"><span className="sunrise">☀️
              {new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              </span> 
              <span className="sunset">
                 🌙 {new Date(daily.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
                 </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyCard;