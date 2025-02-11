"use client"

import { useEffect, useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ConfigPanelProps {
  bedSize: string
  sideRails: string
  evolutionKit: string
  bedColor: string
  updateBedSize: (size: string) => void
  updateSideRails: (rails: string) => void
  updateEvolutionKit: (kit: string) => void
  updateBedColor: (color: string) => void
  updateTotalPrice: (price: number) => void
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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showDrawer, setShowDrawer] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const colorOptions = [
    { id: "natural", name: "Legno naturale", hex: "#D4B78F" },
    { id: "white", name: "Bio paint (bianco 9010)", hex: "#FFFFFF" },
  ]

  const bedSizes = [
    { id: "single", name: "Letto singolo", dimensions: "190x80 cm" },
    { id: "reduced_single", name: "Letto singolo ridotto", dimensions: "160x80 cm" },
    { id: "one_and_half", name: "Letto una piazza e mezzo", dimensions: "190x120 cm" },
  ]

  const sideRailOptions = [
    { id: "none", name: "Senza sponde" },
    { id: "half", name: "Set metà superiore letto" },
    { id: "full", name: "Set completo" },
    { id: "ends", name: "Set testiera + pediera" },
  ]

  const evolutionKitOptions = [
    { id: "none", name: "Nessun kit" },
    { id: "small", name: "Piedini 11cm" },
    { id: "large", name: "Piedoni 23cm" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (panelRef.current) {
        const scrollPosition = panelRef.current.scrollTop
        const scrollHeight = panelRef.current.scrollHeight - panelRef.current.clientHeight
        const progress = (scrollPosition / scrollHeight) * 100
        setScrollProgress(progress)
      }
    }

    const panel = panelRef.current
    if (panel) {
      panel.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (panel) {
        panel.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    let price = 339 // Prezzo base

    // Calcolo del prezzo in base alle selezioni
    if (bedSize === "one_and_half") price += 50
    if (sideRails === "half") price += 30
    if (sideRails === "full") price += 60
    if (sideRails === "ends") price += 40
    if (evolutionKit === "small") price += 20
    if (evolutionKit === "large") price += 40
    if (bedColor === "white") price += 25
    if (showDrawer) price += 100 // Prezzo ipotetico per il cassettone

    updateTotalPrice(price)
  }, [bedSize, sideRails, evolutionKit, bedColor, showDrawer, updateTotalPrice])

  useEffect(() => {
    setShowDrawer(evolutionKit === "large")
  }, [evolutionKit])

  return (
    <div className="w-[40%] relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gray-200">
        <div
          className="absolute top-0 left-0 w-full bg-[#79aea3] transition-all duration-300 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
      <div ref={panelRef} className="h-full p-8 pb-32 overflow-y-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-medium">nabè letto evolutivo</h1>
            <div className="flex justify-center gap-12 text-sm">
              <div className="text-center">
                <div className="text-2xl font-medium">
                  {bedSizes.find((size) => size.id === bedSize)?.dimensions.split("x")[0] || "190"}
                </div>
                <div className="text-gray-500">cm lunghezza</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium">
                  {bedSizes.find((size) => size.id === bedSize)?.dimensions.split("x")[1] || "80"}
                </div>
                <div className="text-gray-500">cm larghezza</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Colore</Label>
            <div className="grid grid-cols-2 gap-4">
              {colorOptions.map((color) => (
                <button key={color.id} className="group relative" onClick={() => updateBedColor(color.id)}>
                  <div
                    className={cn(
                      "w-full h-14 rounded-lg border-2 transition-all",
                      bedColor === color.id ? "border-[#79aea3]" : "border-transparent group-hover:border-[#79aea3]/50",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-gray-500 whitespace-nowrap">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Dimensione</Label>
            {bedSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => updateBedSize(size.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 border rounded-lg transition-all",
                  bedSize === size.id ? "border-[#79aea3] bg-[#79aea3]/5" : "hover:border-[#79aea3]/50",
                )}
              >
                <div className="space-y-1 text-left">
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm text-gray-500">{size.dimensions}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Sponde protettive</Label>
            {sideRailOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updateSideRails(option.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 border rounded-lg transition-all",
                  sideRails === option.id ? "border-[#79aea3] bg-[#79aea3]/5" : "hover:border-[#79aea3]/50",
                )}
              >
                <div className="font-medium">{option.name}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Kit evolutivo</Label>
            {evolutionKitOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updateEvolutionKit(option.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 border rounded-lg transition-all",
                  evolutionKit === option.id ? "border-[#79aea3] bg-[#79aea3]/5" : "hover:border-[#79aea3]/50",
                )}
              >
                <div className="font-medium">{option.name}</div>
              </button>
            ))}
          </div>

          {showDrawer && (
            <div className="space-y-4">
              <Label className="text-lg">Cassettone</Label>
              <button
                onClick={() => setShowDrawer(!showDrawer)}
                className={cn(
                  "w-full flex items-center justify-between p-4 border rounded-lg transition-all",
                  showDrawer ? "border-[#79aea3] bg-[#79aea3]/5" : "hover:border-[#79aea3]/50",
                )}
              >
                <div className="font-medium">Aggiungi cassettone</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

