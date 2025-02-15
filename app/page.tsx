"use client"
import { useState, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows } from "@react-three/drei"
import dynamic from "next/dynamic"
import ConfigPanel from "./components/ConfigPanel"
import Navbar from "./components/Navbar"
import { Expand, X, Ruler } from 'lucide-react'
import { MeasurementsOverlay } from "./components/MeasurementsOverlay"

const BedModel = dynamic(() => import("./components/BedModel"), { ssr: false })

export default function BedConfigurator() {
  const [bedSize, setBedSize] = useState("single")
  const [sideRails, setSideRails] = useState("none")
  const [evolutionKit, setEvolutionKit] = useState("none")
  const [bedColor, setBedColor] = useState("natural")
  const [showDrawer, setShowDrawer] = useState(false)
  const [showDimensions, setShowDimensions] = useState(false)
  const [totalPrice, setTotalPrice] = useState(339)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTechSpecs, setShowTechSpecs] = useState(false)
  const [showMeasurements, setShowMeasurements] = useState(false)

  const [selectedSideRails, setSelectedSideRails] = useState<string | null>(null)
  const [selectedSupportKit, setSelectedSupportKit] = useState<string | null>(null)

  const basePrice = 339
  const priceConfig = {
    bedSizes: { single: 0, one_and_half: 50, reduced_single: -20 },
    sideRails: { SpondeMetaSuperiore: 30, SetCompleto: 60 },
    supportKits: { piedini: 20, piedone: 40 },
    colors: { natural: 0, white: 25 },
  }

  useEffect(() => {
    let newPrice = basePrice
    newPrice += priceConfig.bedSizes[bedSize] || 0
    newPrice += selectedSideRails ? priceConfig.sideRails[selectedSideRails] || 0 : 0
    newPrice += selectedSupportKit ? priceConfig.supportKits[selectedSupportKit] || 0 : 0
    newPrice += priceConfig.colors[bedColor] || 0
    setTotalPrice(newPrice)
  }, [bedSize, selectedSideRails, selectedSupportKit, bedColor])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
    }
  }, [])

  const toggleMeasurements = useCallback(() => {
    setShowMeasurements((prev) => !prev)
  }, [])

  // Dimensioni del letto per ogni variante
  const bedDimensions = {
    single: { width: 80, length: 190, height: 90 },
    one_and_half: { width: 120, length: 190, height: 90 },
    reduced_single: { width: 80, length: 160, height: 90 },
  }

  const bgColor = "#e6f0ee"

  return (
    <div className="min-h-screen bg-[#e6f0ee] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <div
          className={`relative w-full md:w-[60%] h-[50vh] md:h-screen ${isFullscreen ? "h-screen" : ""} sticky top-0 z-10`}
        >
          <Canvas shadows camera={{ position: [4, 2, 4], fov: 45 }}>
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.65}
              scale={10}
              blur={1.5}
              far={0.5}
              resolution={512}
              color="#000000"
            />
            <BedModel
              selectedSideRails={selectedSideRails}
              selectedSupportKit={selectedSupportKit}
              bedColor={bedColor}
              bedSize={bedSize}
            />
            {showMeasurements && <MeasurementsOverlay bedSize={bedSize} />}
            <OrbitControls
              enableZoom={true}
              enableRotate={true}
              enablePan={false}
              target={[0, 0, 0]}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={0}
            />
          </Canvas>
          <div className="absolute top-5 right-4 space-x-2 flex z-99999">
            <button
              onClick={toggleMeasurements}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
              title="Mostra dimensioni"
            >
              <Ruler className="w-6 h-6" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
              title={isFullscreen ? "Esci da schermo intero" : "Schermo intero"}
            >
              {isFullscreen ? <X className="w-6 h-6" /> : <Expand className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {!isFullscreen && (
          <div className="w-full md:w-[40%] md:h-screen overflow-y-auto pb-20">
            <ConfigPanel
              bedSize={bedSize}
              sideRails={sideRails}
              evolutionKit={evolutionKit}
              bedColor={bedColor}
              selectedSideRails={selectedSideRails}
              selectedSupportKit={selectedSupportKit}
              updateBedSize={setBedSize}
              updateSideRails={setSideRails}
              updateEvolutionKit={setEvolutionKit}
              updateBedColor={setBedColor}
              updateSelectedSideRails={setSelectedSideRails}
              updateSelectedSupportKit={setSelectedSupportKit}
              updateTotalPrice={setTotalPrice}
              basePrice={basePrice}
              priceConfig={priceConfig}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-medium">€{totalPrice}</div>
          <button className="px-16 py-3 bg-[#79aea3] text-white rounded-lg hover:bg-[#6b9d93] transition-colors font-medium">
            Aggiungi al carrello
          </button>
        </div>
      </div>
    </div>
  )
}
