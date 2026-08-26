export default function Orb() {
  return (
    <div className="relative size-[400px] md:size-[600px] flex-shrink-0 flex items-center justify-center animate-float">
      {/* Very faint, thin concentric rings */}
      <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(1.2)' }}></div>
      <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(1)' }}></div>
      <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(0.8)' }}></div>
      <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(0.6)' }}></div>
      
      {/* Outer red/pink glow behind the orb */}
      <div className="absolute w-2/3 h-2/3 bg-[#ff3c00]/30 rounded-full blur-[80px]"></div>

      {/* Glass Orb */}
      <div className="relative w-[320px] h-[320px] rounded-full overflow-hidden shadow-2xl backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/20 via-transparent to-black/50" 
           style={{ boxShadow: 'inset 0 0 40px rgba(255, 60, 0, 0.4), 0 20px 40px rgba(0,0,0,0.5)' }}>
        
        {/* Top reflection highlight */}
        <div className="absolute top-0 left-[15%] right-[15%] h-[40%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-md opacity-70 transform -translate-y-1/3"></div>

        {/* Center glowing core (red/orange) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,60,0,0.6)_0%,_transparent_70%)] opacity-80"></div>

        {/* Waveform Visualization */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] z-10 px-12">
          {[...Array(40)].map((_, i) => {
            // Generate a diamond-like height profile for the waveform
            const distanceFromCenter = Math.abs(20 - i) / 20;
            const maxHeight = (1 - Math.pow(distanceFromCenter, 1.5)) * 100;
            const delay = `${Math.random() * 0.5}s`;
            
            return (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-gradient-to-t from-[#ff9d00] via-[#ff3c00] to-[#5828dc] shadow-[0_0_10px_rgba(255,60,0,0.8)]"
                style={{ 
                  height: `${maxHeight}%`,
                  animation: `waveform ${1 + Math.random()}s ease-in-out infinite alternate ${delay}`
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
