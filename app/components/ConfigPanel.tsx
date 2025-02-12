"use client";
import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";

interface ConfigPanelProps {
  bedSize: string;
  sideRails: string;
  evolutionKit: string;
  bedColor: string;
  updateBedSize: (size: string) => void;
  updateSideRails: (rails: string) => void;
  updateEvolutionKit: (kit: string) => void;
  updateBedColor: (color: string) => void;
  updateTotalPrice: (price: number) => void;
}

export default function ConfigPanel({
  bedSize,
  sideRails,
  evolutionKit,
  bedColor,
  updateBedSize,
  updateSideRails,
  updateEvolutionKit,
  updateBedColor,
  updateTotalPrice,
}: ConfigPanelProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let price = 339; // Prezzo base
    if (bedSize === "one_and_half") price += 50;
    if (sideRails === "half") price += 30;
    if (sideRails === "full") price += 60;
    if (sideRails === "ends") price += 40;
    if (evolutionKit === "piedini") price += 20;
    if (evolutionKit === "piedoni") price += 40;
    if (bedColor === "white") price += 25;
    updateTotalPrice(price);
  }, [bedSize, sideRails, evolutionKit, bedColor, updateTotalPrice]);

  return (
    <div className="w-[40%] relative">
      {/* Opzioni di configurazione */}
      <div className="space-y-8">
        <Label className="text-lg">Dimensione</Label>
        {/* Bottoni per selezionare la dimensione */}
        <Label className="text-lg">Colore</Label>
        {/* Opzioni di colore */}
        <Label className="text-lg">Kit Evolutivo</Label>
        {/* Opzioni per piedini/piedoni */}
        {["none", "piedini", "piedoni"].map((option) => (
          <button
            key={option}
            onClick={() => updateEvolutionKit(option)}
            className={cn(
              "w-full flex items-center justify-between p-4 border rounded-lg transition-all",
              evolutionKit === option ? "border-[#79aea3] bg-[#79aea3]/5" : "hover:border-[#79aea3]/50",
            )}
          >
            <div className="font-medium">{option === "none" ? "Nessun Kit" : option}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
