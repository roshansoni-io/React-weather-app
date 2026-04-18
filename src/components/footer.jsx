const Footer = () => {
  return (
    <footer className="max-w-5xl mx-auto px-6 py-16 text-center border-t border-brand-border mt-12 opacity-40 hover:opacity-100 transition-opacity">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-muted/20 flex items-center justify-center text-[10px] font-black uppercase">A</div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Aether Weather</span>
        </div>
        <p className="text-[10px] font-medium max-w-xs leading-relaxed">
          Crafted with precision using React, Tailwind v4, and the Open-Meteo API. 
          No generic templates, just pure utility.
        </p>
        <div className="flex justify-center gap-8 mt-4">
           {['Archive', 'Telemetry', 'Privacy', 'Legal'].map(link => (
             <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-accent transition-colors">
               {link}
             </a>
           ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;