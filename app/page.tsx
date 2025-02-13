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
  const [evolutionKit, setEvolutionKit] = useState("none");
  const [bedColor, setBedColor] = useState("#F5DEB3"); // Colore predefinito (legno naturale)
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [totalPrice, setTotalPrice] = useState(339);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // NUOVO STATO: Selezione di piedini o piedone
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-3/4 h-screen">
          <Canvas camera={{ position: [0, 1, 2.5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />
            <BedModel selectedAddon={selectedAddon} />
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>

        <div className="w-1/4 bg-white p-4 shadow-lg">
          <ConfigPanel
            bedSize={bedSize}
            sideRails={sideRails}
            evolutionKit={evolutionKit}
            bedColor={bedColor}
            selectedAddon={selectedAddon}
            updateBedSize={setBedSize}
            updateSideRails={setSideRails}
            updateEvolutionKit={setEvolutionKit}
            updateBedColor={setBedColor}
            updateSelectedAddon={setSelectedAddon}
            updateTotalPrice={setTotalPrice}
          />
        </div>
      </div>
    </div>
  );
}
