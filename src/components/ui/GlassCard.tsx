export default function GlassCard({ 
  children, 
  className = "",
  onMouseEnter,
  onMouseLeave,
  onClick
}: { 
  children: React.ReactNode; 
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`glass p-6 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
