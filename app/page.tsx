"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import ConfigPanel from "./components/ConfigPanel";
import Navbar from "./components/Navbar";
import { Expand, Ruler } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Importa dinamicamente il componente BedModel per evitare problemi con SSR
const BedModel = dynamic(() => import("./components/BedModel"), { ssr: false });

export default function BedConfigurator() {
  // Stati per le opzioni di configurazione
  const [bedSize, setBedSize] = useState("190x80"); // Dimensione predefinita
  const [sideRails, setSideRails] = useState("none");
  const [evolutionKit, setEvolutionKit] = useState("none");
  const [isBioPaint, setIsBioPaint] = useState(false); // Stato per Bio Paint
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [totalPrice, setTotalPrice] = useState(339); // Prezzo predefinito
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTechSpecs, setShowTechSpecs] = useState(false);

  // Funzione per attivare/disattivare la modalità a schermo intero
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Aggiorna la dimensione del letto e il prezzo corrispondente
  const updateBedSize = (newSize: string) => {
    setBedSize(newSize);
    if (newSize === "160x80") setTotalPrice(300);
    else if (newSize === "200x90") setTotalPrice(380);
    else setTotalPrice(339); // Prezzo predefinito
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Contenitore principale */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sezione del modello 3D */}
        <div className={`relative ${isFullscreen ? "w-full" : "w-[60%]"}`}>
<Canvas camera={{ position: [0, 1.5, 10] }}> {/* Allontana ulteriormente la telecamera */}
  {/* Luci realistiche */}
  <ambientLight intensity={0.5} />
  <directionalLight
    position={[5, 10, 5]}
    intensity={1.5}
    castShadow
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
    shadow-camera-far={50}
    shadow-camera-left={-10}
    shadow-camera-right={10}
    shadow-camera-top={10}
    shadow-camera-bottom={-10}
  />
  <pointLight position={[1, 2, 3]} intensity={0.8} />

  {/* Modello del letto */}
  <BedModel
    size="190x80"
    sideRails="none"
    evolutionKit="none"
    isBioPaint={false}
    showDimensions={false}
  />

  {/* OrbitControls per ruotare il modello manualmente */}
  <OrbitControls
    enableZoom={true}
    enableRotate={true}
    enablePan={false}
    target={[0, 0, 0]}
    autoRotate={false}
  />
</Canvas>

          {/* Pulsanti inferiori */}
          <div className="absolute bottom-4 right-4 space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <Expand className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowTechSpecs(true)}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <Ruler className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Sezione del pannello di configurazione */}
        {!isFullscreen && (
          <ConfigPanel
            bedSize={bedSize}
            sideRails={sideRails}
            evolutionKit={evolutionKit}
            isBioPaint={isBioPaint}
            updateBedSize={updateBedSize}
            updateSideRails={setSideRails}
            updateEvolutionKit={setEvolutionKit}
            toggleBioPaint={() => setIsBioPaint(!isBioPaint)}
            updateTotalPrice={setTotalPrice}
          />
        )}
      </div>

      {/* Barra inferiore fissa */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-medium">€{totalPrice}</div>
          <button className="px-16 py-3 bg-[#79aea3] text-white rounded-lg hover:bg-[#6b9d93] transition-colors font-medium">
            Aggiungi al carrello
          </button>
        </div>
      </div>

      {/* Dialog per specifiche tecniche */}
      <Dialog open={showTechSpecs} onOpenChange={setShowTechSpecs}>
        <DialogContent className="max-w-3xl">
          <div className="p-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-10%20alle%2020.48.54-OSGH9uJQRkzNdgfMHgPvZzyxBO92cI.png"
              alt="Specifiche tecniche"
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
