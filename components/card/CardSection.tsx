interface CardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  accentColour?: string;
}

export function CardSection({
  title,
  children,
  className = "",
  accentColour = "#C4973F",
}: CardSectionProps) {
  return (
    <div className={`py-8 ${className}`}>
      <p
        className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ color: accentColour }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
