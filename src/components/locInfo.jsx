import { motion as Motion } from "framer-motion";
import { MapPin, Navigation, Mountain, RefreshCw } from "lucide-react";

const LocationInfo = ({ location, meta, place }) => {
  if (!location) return null;

  return (
    <Motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
        <MapPin size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-brand-accent mb-4">
          <MapPin size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Telemetry</span>
        </div>

        <h2 className="text-3xl font-black tracking-tighter mb-1 break-words">
          {place?.city || location.name}
        </h2>
        
        {place?.name && (
          <p className="text-[10px] font-bold text-brand-muted uppercase leading-relaxed mb-6 max-w-[200px]">
            {place.name}
          </p>
        )}

        <div className="space-y-4 border-t border-brand-border pt-6 mt-2">
          <DataRow icon={<Navigation size={12}/>} label="Coordinates" value={`${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`} />
          <DataRow icon={<Mountain size={12}/>} label="Elevation" value={`${meta?.elevation ?? "—"}m`} />
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
              <span className="text-[8px] font-black text-brand-muted uppercase tracking-widest">Active Link</span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-brand-muted/50 uppercase tracking-tighter">
              <RefreshCw size={8} className="animate-spin-slow" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

const DataRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-2">
      <span className="text-brand-muted opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className="text-[9px] font-black text-brand-muted uppercase tracking-tighter">{label}</span>
    </div>
    <span className="text-[10px] font-black tabular-nums">{value}</span>
  </div>
);

export default LocationInfo;