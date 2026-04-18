import { motion as Motion } from "framer-motion";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Cloud, 
  CloudRain, 
  Sunrise, 
  Sunset 
} from "lucide-react";

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

const NowCard = ({ now, daily }) => {
  if (!now) return <SkeletonNow />;

  const [desc, emoji] = WMO[now.code] || ["Unknown", "❓"];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <Motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {/* Hero Tile */}
      <Motion.div 
        variants={itemVariants}
        className="md:col-span-2 glass-panel p-8 relative overflow-hidden group min-h-[240px] flex flex-col justify-between"
      >
        <div className="absolute -top-10 -right-10 text-[14rem] opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 select-none pointer-events-none">
          {emoji}
        </div>
        
        <div>
          <span className="text-[10px] font-black tracking-[0.3em] text-brand-accent uppercase mb-2 block">Atmosphere</span>
          <div className="text-8xl font-black tracking-tighter flex items-start leading-none">
            {Math.round(now.temp)}
            <span className="text-4xl font-light text-brand-muted mt-2 ml-1">°</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-3xl">{emoji}</div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{desc}</div>
            <div className="text-[10px] font-bold text-brand-muted uppercase flex gap-2 mt-1">
               <span>Min {daily?.tempMin?.[0] ?? "—"}°</span>
               <span className="opacity-30">/</span>
               <span>Max {daily?.tempMax?.[0] ?? "—"}°</span>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* Stats Bento */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <StatBlock variants={itemVariants} icon={<Thermometer size={16}/>} label="Feels Like" value={`${now.feels}°`} />
        <StatBlock variants={itemVariants} icon={<Droplets size={16}/>} label="Humidity" value={`${now.humidity}%`} />
        <StatBlock variants={itemVariants} icon={<Wind size={16}/>} label="Wind" value={`${now.wind}`} unit="km/h" />
        <StatBlock variants={itemVariants} icon={<Gauge size={16}/>} label="Pressure" value={now.pressure} unit="hPa" />
      </div>

      {/* Row 2 */}
      <Motion.div variants={itemVariants} className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatRow icon={<Cloud size={20} className="text-brand-muted"/>} label="Clouds" value={`${now.clouds}%`} />
        <StatRow icon={<CloudRain size={20} className="text-brand-accent"/>} label="Rain" value={`${now.precip}mm`} />
        <div className="glass-panel p-5 flex items-center justify-between bg-gradient-to-br from-brand-surface to-brand-accent/[0.03]">
          <SunTime icon={<Sunrise size={18}/>} label="Rise" time={daily?.sunrise?.[0]} />
          <div className="w-px h-8 bg-brand-border mx-2"></div>
          <SunTime icon={<Sunset size={18}/>} label="Set" time={daily?.sunset?.[0]} />
        </div>
      </Motion.div>
    </Motion.div>
  );
};

const StatBlock = ({ icon, label, value, unit, variants }) => (
  <Motion.div variants={variants} className="glass-panel p-5 group hover:border-brand-accent/50 transition-all duration-300">
    <div className="flex items-center gap-2 text-brand-muted mb-3">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black tabular-nums">
      {value}
      {unit && <span className="text-xs font-medium ml-1 opacity-40">{unit}</span>}
    </div>
  </Motion.div>
);

const StatRow = ({ icon, label, value }) => (
  <div className="glass-panel p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
    <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center">
      {icon}
    </div>
    <div>
      <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest block mb-1">{label}</span>
      <span className="text-xl font-bold tabular-nums">{value}</span>
    </div>
  </div>
);

const SunTime = ({ icon, label, time }) => (
  <div className="flex items-center gap-3">
    <div className="text-brand-accent opacity-70">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-brand-muted uppercase leading-none mb-1">{label}</span>
      <span className="text-xs font-bold tabular-nums">
        {time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
      </span>
    </div>
  </div>
);

const SkeletonNow = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    <div className="md:col-span-2 glass-panel h-[240px]"></div>
    <div className="md:col-span-2 grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="glass-panel h-full"></div>)}
    </div>
  </div>
);

export default NowCard;