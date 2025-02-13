"use client"
import { useEffect, useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ConfigPanelProps {
  bedSize: string
  sideRails: string
  evolutionKit: string
  bedColor: string
  selectedAddon: string | null
  updateBedSize: (size: string) => void
  updateSideRails: (rails: string) => void
  updateEvolutionKit: (kit: string) => void
  updateBedColor: (color: string) => void
  updateSelectedAddon: (addon: string | null) => void
  updateTotalPrice: (price: number) => void
}

export default function ConfigPanel({
  bedSize,
  sideRails,
  evolutionKit,
  bedColor,
  selectedAddon,
  updateBedSize,
  updateSideRails,
  updateEvolutionKit,
  updateBedColor,
  updateSelectedAddon,
  updateTotalPrice,
}: ConfigPanelProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showDrawer, setShowDrawer] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const colorOptions = [
    { id: "natural", name: "Legno naturale", hex: "#D4B78F" },
    { id: "white", name: "Bio paint (bianco 9010)", hex: "#FFFFFF" },
  ]

  return (
    <div className="config-panel">
      <h3>Configura il tuo letto</h3>

      {/* Selezione Piedini/Piedone */}
      <div className="option-group">
        <Label>Kit di supporto</Label>
        <div className="option-buttons">
          <button
            className={cn("option-btn", selectedAddon === "piedini" && "selected")}
            onClick={() => updateSelectedAddon("piedini")}
          >
            Aggiungi Piedini
          </button>
          <button
            className={cn("option-btn", selectedAddon === "piedone" && "selected")}
            onClick={() => updateSelectedAddon("piedone")}
          >
            Aggiungi Piedone
          </button>
          <button
            className={cn("option-btn", selectedAddon === null && "selected")}
            onClick={() => updateSelectedAddon(null)}
          >
            Nessun supporto
          </button>
        </div>
      </div>
    </div>
  )
}

