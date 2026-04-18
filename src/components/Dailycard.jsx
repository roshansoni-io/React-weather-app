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

const DailyCard = ({ daily }) => {
  if (!daily) return null;

  return (
    <div className="glass-panel p-6">
      <h3 className="text-xs font-black text-brand-muted uppercase tracking-[0.2em] mb-6">7-Day Outlook</h3>
      
      <div className="space-y-6">
        {daily.time.map((day, i) => (
          <div key={day} className="flex items-center gap-4">
            <span className="w-10 text-xs font-black text-brand-muted uppercase">
              {i === 0 ? "Today" : new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            
            <span className="text-xl">{WMO[daily.code[i]][1]}</span>
            
            {/* Temp Range Slider Effect */}
            <div className="flex-1 flex items-center gap-3">
              <span className="text-[10px] font-bold w-6 text-right opacity-60">{daily.tempMin[i]}°</span>
              <div className="flex-1 h-1 bg-brand-border rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-full"
                  style={{ 
                    left: '20%', 
                    right: '20%' 
                  }}
                ></div>
              </div>
              <span className="text-[10px] font-bold w-6">{daily.tempMax[i]}°</span>
            </div>

            {daily.precip[i] > 0 && (
               <span className="text-[9px] font-black text-brand-accent w-10 text-right">
                 {Math.round(daily.precip[i])}mm
               </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyCard;