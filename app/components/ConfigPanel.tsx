import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ConfigPanelProps {
  bedSize: string
  sideRails: string
  evolutionKit: string
  bedColor: string
  selectedSideRails: string | null
  selectedSupportKit: string | null
  updateBedSize: (size: string) => void
  updateSideRails: (rails: string) => void
  updateEvolutionKit: (kit: string) => void
  updateBedColor: (color: string) => void
  updateSelectedSideRails: (rails: string | null) => void
  updateSelectedSupportKit: (kit: string | null) => void
  updateTotalPrice: (price: number) => void
  basePrice: number
  priceConfig: {
    bedSizes: { [key: string]: number }
    sideRails: { [key: string]: number }
    supportKits: { [key: string]: number }
    colors: { [key: string]: number }
  }
}

const bedDimensions = {
  single: { width: 80, length: 190, height: 90 },
  one_and_half: { width: 120, length: 190, height: 90 },
  reduced_single: { width: 80, length: 160, height: 90 },
}

export default function ConfigPanel({
  bedSize,
  sideRails,
  evolutionKit,
  bedColor,
  selectedSideRails,
  selectedSupportKit,
  updateBedSize,
  updateSideRails,
  updateEvolutionKit,
  updateBedColor,
  updateSelectedSideRails,
  updateSelectedSupportKit,
  updateTotalPrice,
  basePrice,
  priceConfig,
}: ConfigPanelProps) {
  return (
    <div className="w-full h-full p-6 bg-white shadow-lg rounded-t-lg overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-2">Zero+ il letto evolutivo</h2>
      <div className="grid gap-2 mb-6 text-sm text-gray-600">
        <p>Larghezza: {bedDimensions[bedSize].width}cm</p>
        <p>Lunghezza: {bedDimensions[bedSize].length}cm</p>
        <p>Profondità: {bedDimensions[bedSize].height}cm</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Configura il tuo letto</h3>

      {/* Selezione Dimensione */}
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">Dimensione del letto</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              bedSize === "single" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateBedSize("single")}
          >
            Singolo 190x80
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              bedSize === "one_and_half" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateBedSize("one_and_half")}
          >
            Una piazza e mezza 190x120
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              bedSize === "reduced_single" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateBedSize("reduced_single")}
          >
            Singolo ridotto 160x80
          </button>
        </div>
      </div>

      {/* Selezione Sponde */}
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">Set sponde</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSideRails === "SpondeMetaSuperiore" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSideRails("SpondeMetaSuperiore")}
          >
            Set Metà Superiore letto
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSideRails === "SetCompleto" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSideRails("SetCompleto")}
          >
            Set completo
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSideRails === null ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSideRails(null)}
          >
            Senza sponde
          </button>
        </div>
      </div>

      {/* Selezione Piedini/Piedone */}
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">Kit di supporto</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSupportKit === "piedini" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSupportKit("piedini")}
          >
            Kit Piedini 11cm
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSupportKit === "piedone" ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSupportKit("piedone")}
          >
            Kit Piedoni 23cm
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              selectedSupportKit === null ? "bg-[#79aea3] text-white" : "bg-gray-200",
            )}
            onClick={() => updateSelectedSupportKit(null)}
          >
            Letto a terra
          </button>
        </div>
      </div>

      {/* Selezione Colore */}
      <div className="mb-24">
        <Label className="block text-sm font-medium text-gray-700">Colore del letto</Label>
        <div className="mt-2 flex gap-2">
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              bedColor === "natural" ? "bg-[#79aea3] text-white" : "bg-[#F5DEB3]",
            )}
            onClick={() => updateBedColor("natural")}
          >
            Naturale
          </button>
          <button
            className={cn(
              "px-4 py-2 border rounded-md text-sm",
              bedColor === "white" ? "bg-[#79aea3] text-white" : "bg-white",
            )}
            onClick={() => updateBedColor("white")}
          >
            Bianco
          </button>
        </div>
      </div>
    </div>
  )
}
