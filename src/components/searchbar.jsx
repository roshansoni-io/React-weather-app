import { useState } from "react";

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

const Searchbar = ({ onLocationSelect, status }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStatus = (msg) => {
    if (typeof status === "function") status(msg);
    setLoading(true);
  };

  const fetchSuggestions = async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      handleStatus("Searching...");
      const res = await fetch(`${GEO_API}?name=${encodeURIComponent(q)}&count=5`);
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const selectSuggestion = (s) => {
    onLocationSelect({
      label: `${s.name}, ${s.country}`,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
    });
    setQuery("");
    setSuggestions([]);
  };

  const handleGeo = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSelect({
          name: "Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  return (
    <div className="sticky top-0 z-50 pt-6 px-6">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        
        {/* Branding - Minimal */}
        <div className="hidden md:flex items-center gap-2 mr-4">
          <div className="w-8 h-8 rounded-xl bg-brand-accent rotate-12 flex items-center justify-center text-white font-black text-xs">W</div>
          <span className="text-xs font-black uppercase tracking-[0.3em]">Aether</span>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-sm opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Explore city or coordinates..."
            className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-brand-accent/20 transition-all placeholder:text-brand-muted/50"
          />
          
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden">
              {suggestions.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => selectSuggestion(s)}
                  className="p-3 rounded-xl hover:bg-brand-accent/10 cursor-pointer flex items-center justify-between group/item"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{s.name}</span>
                    <span className="text-[10px] text-brand-muted">{s.admin1 ? `${s.admin1}, ` : ''}{s.country}</span>
                  </div>
                  <span className="text-xs opacity-0 group-hover/item:opacity-100 transition-opacity">↗</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Locate Action */}
        <button 
          onClick={handleGeo}
          className="w-12 h-12 glass-panel flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all hover:scale-105 active:scale-95"
          title="Detect Location"
        >
          {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : "📍"}
        </button>

      </div>
    </div>
  );
};

export default Searchbar;