export default function GlassCard({ 
  children, 
  className = "",
  onMouseEnter,
  onMouseLeave
}: { 
  children: React.ReactNode; 
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div 
      className={`glass p-6 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
