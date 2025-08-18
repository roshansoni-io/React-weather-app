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

const NowCard = ({ now, daily }) => {
  if (!now) {
    return (<section class="panel now">
      <h2>Now</h2>
      <div class="now-grid">
        <div class="big-temp">
          <div id="now-icon" class="wx-icon">☀️</div>
          
          <div>
            <div id="now-temp" class="temp">—</div>
            <div id="now-desc" class="subtle">—</div>
            <div id="sun">
              <span id="sunrise">sunrise:  </span>
              <span id="sunset">sunset:</span>
            </div>
          </div>
        </div>
        <ul class="kv">
          <li><span>Feels like</span><strong id="now-feels">—</strong></li>
          <li><span>Humidity</span><strong id="now-humidity">—</strong></li>
          <li><span>Wind</span><strong id="now-wind">—</strong></li>
          <li><span>Pressure</span><strong id="now-pressure">—</strong></li>
          <li><span>Cloud cover</span><strong id="now-clouds">—</strong></li>
          <li><span>Precip (rain)</span><strong id="now-precip">—</strong></li>
        </ul>
      </div>
    </section>
      
    );
  }

  const { desc, icon } = wxCodeToIcon(Number(now.code));

  return (
    <section className="panel now">
      <h2>Now</h2>
      <div className="now-grid">
        <div className="big-temp">
          <div className="wx-icon">{icon}</div>
          <div>
            <div className="temp">{now.temp}°C</div>
            <div className="subtle">{desc}</div>
            <div id="sun">
              <span>sunrise: {daily?.sunrise ? new Date(daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}</span>
              <br />
              <span>sunset: {daily?.sunset ? new Date(daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}</span>
            </div>
          </div>
        </div>
        <ul className="kv">
          <li><span>Feels like</span><strong>{now.feels}°C</strong></li>
          <li><span>Humidity</span><strong>{now.humidity}%</strong></li>
          <li><span>Wind</span><strong>{now.wind} km/h</strong></li>
          <li><span>Pressure</span><strong>{now.pressure} hPa</strong></li>
          <li><span>Cloud cover</span><strong>{now.clouds}%</strong></li>
          <li><span>Precip (rain)</span><strong>{now.precip} mm</strong></li>
        </ul>
      </div>
    </section>
  );
};

export default NowCard;