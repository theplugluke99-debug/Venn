"use client";

interface CardCTAProps {
  ctaText: string;
  ctaType: string;
  ctaValue: string | null;
  brandColour: string;
  agencyName: string | null;
}

export function CardCTA({
  ctaText,
  ctaType,
  ctaValue,
  brandColour,
  agencyName,
}: CardCTAProps) {
  function handleCTA() {
    if (!ctaValue) return;
    switch (ctaType) {
      case "calendly":
      case "link":
      case "video":
        window.open(ctaValue, "_blank", "noopener noreferrer");
        break;
      case "reply":
        window.location.href = `mailto:${ctaValue}?subject=I saw what you put together`;
        break;
    }
  }

  return (
    <div className="py-10 text-center">
      {agencyName ? (
        <p className="text-xs text-gray-400 mb-6">
          Prepared for you by <span className="font-medium text-gray-300">{agencyName}</span>
        </p>
      ) : null}
      <button
        onClick={handleCTA}
        className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium rounded transition-all duration-150 hover:opacity-90 active:scale-95"
        style={{ backgroundColor: brandColour, color: "#0A0907" }}
      >
        {ctaText}
      </button>
      {ctaType === "reply" && ctaValue ? (
        <p className="mt-3 text-xs text-gray-400">{ctaValue}</p>
      ) : null}
    </div>
  );
}
