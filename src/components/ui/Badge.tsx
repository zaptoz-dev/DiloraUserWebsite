export default function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`badge ${className}`}>
      {children}
    </div>
  );
}
