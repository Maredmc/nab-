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
  return (
    <div className="w-[40%] p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Configura il tuo letto</h3>

      {/* Selezione Piedini/Piedone */}
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">Kit di supporto</Label>
        <div className="mt-2 flex gap-2">
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedAddon === "piedini" ? "bg-gray-800 text-white" : "bg-gray-200"
            )}
            onClick={() => updateSelectedAddon("piedini")}
          >
            Piedini 11cm
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedAddon === "piedone" ? "bg-gray-800 text-white" : "bg-gray-200"
            )}
            onClick={() => updateSelectedAddon("piedone")}
          >
            Piedoni 23cm
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedAddon === null ? "bg-gray-800 text-white" : "bg-gray-200"
            )}
            onClick={() => updateSelectedAddon(null)}
          >
            Nessun supporto
          </button>
        </div>
      </div>
    </div>
  )
}

