import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const WMO = {
  0: ["Clear", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],
  51: ["Drizzle: light", "🌦️"],
  53: ["Drizzle: mod", "🌦️"],
  55: ["Drizzle: dense", "🌧️"],
  61: ["Rain: slight", "🌧️"],
  63: ["Rain: mod", "🌧️"],
  65: ["Rain: heavy", "🌧️"],
  71: ["Snow: slight", "🌨️"],
  73: ["Snow: mod", "🌨️"],
  75: ["Snow: heavy", "❄️"],
  95: ["Thunderstorm", "⛈️"],
};

const HourlyCard = ({ hourly }) => {
  if (!hourly) return null;

  const currHour = new Date().getHours();
  const data = hourly.time.slice(currHour, currHour + 24).map((time, i) => {
    const idx = currHour + i;
    return {
      time: new Date(time).toLocaleTimeString([], { hour: 'numeric' }),
      temp: hourly.temp[idx],
      code: hourly.code[idx],
      precip: hourly.precip[idx]
    };
  });

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-brand-muted uppercase tracking-[0.2em]">24h Forecast</h3>
        <div className="flex gap-4">
            <LegendItem color="#818cf8" label="Temp" />
            <LegendItem color="#fb7185" label="Rain" />
        </div>
      </div>
      
      {/* Graph Area */}
      <div className="h-48 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              interval={3}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#1e2230', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#818cf8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Scroll List (for Icons/Precip) */}
      <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
        {data.map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-3 min-w-[40px]">
            <span className="text-[10px] font-bold text-brand-muted">{h.time}</span>
            <span className="text-xl">{WMO[h.code]?.[1] || "❓"}</span>
            <span className="text-xs font-black">{Math.round(h.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 bg-brand-surface border-brand-accent/20 shadow-xl">
        <p className="text-[10px] font-black text-brand-muted uppercase mb-1">{payload[0].payload.time}</p>
        <p className="text-lg font-black text-brand-text">{payload[0].value}°C</p>
      </div>
    );
  }
  return null;
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
        <span className="text-[9px] font-black uppercase text-brand-muted tracking-widest">{label}</span>
    </div>
);

export default HourlyCard;