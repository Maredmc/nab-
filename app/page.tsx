"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import ConfigPanel from "./components/ConfigPanel";
import Navbar from "./components/Navbar";
import { Expand, Ruler } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const BedModel = dynamic(() => import("./components/BedModel"), { ssr: false });

export default function BedConfigurator() {
  const [bedSize, setBedSize] = useState("single");
  const [sideRails, setSideRails] = useState("none");
  const [evolutionKit, setEvolutionKit] = useState("none"); // Stato per piedini/piedoni
  const [bedColor, setBedColor] = useState("#F5DEB3"); // Colore predefinito (legno naturale)
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [totalPrice, setTotalPrice] = useState(339);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className={`relative ${isFullscreen ? "w-full" : "w-[60%]"}`}>
          <Canvas camera={{ position: [0, 2, 8] }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <BedModel
              size={bedSize}
              sideRails={sideRails}
              evolutionKit={evolutionKit} // Passa lo stato evolutionKit
              color={bedColor}
              showDimensions={showDimensions}
            />
            <OrbitControls
              enableZoom={true}
              enableRotate={true}
              enablePan={false}
              target={[0, 0, 0]}
              autoRotate={false}
            />
          </Canvas>
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
        {!isFullscreen && (
          <ConfigPanel
            bedSize={bedSize}
            sideRails={sideRails}
            evolutionKit={evolutionKit} // Passa lo stato evolutionKit
            bedColor={bedColor}
            updateBedSize={setBedSize}
            updateSideRails={setSideRails}
            updateEvolutionKit={setEvolutionKit} // Gestione dello stato evolutionKit
            updateBedColor={setBedColor}
            updateTotalPrice={setTotalPrice}
          />
        )}
      </div>
      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-medium">€{totalPrice}</div>
          <button className="px-16 py-3 bg-[#79aea3] text-white rounded-lg hover:bg-[#6b9d93] transition-colors font-medium">
            Aggiungi al carrello
          </button>
        </div>
      </div>
      {/* Technical specs dialog */}
      <Dialog open={showTechSpecs} onOpenChange={setShowTechSpecs}>
        <DialogContent className="max-w-3xl">
          <div className="p-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-10%20alle%2020.48.54-OSGH9uJQRkzNdgfMHgPvZzyxBO92cI.png"
              alt="Technical specifications"
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
