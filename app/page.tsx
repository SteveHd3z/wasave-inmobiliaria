"use client";

import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import WhatsAppButton from "./shared/components/WhatsAppButton";
import HeroSection from "./features/home/HeroSection";
import SegurosSection from "./features/seguros/SegurosSection";
import TramitesLegalesSection from "./features/tramites-legales/TramitesLegalesSection";
import MantenimientoSection from "./features/mantenimiento/MantenimientoSection";
import CompraVentaSection from "./features/compra-venta/CompraVentaSection";
import RepresentanteLegalSection from "./features/representante-legal/RepresentanteLegalSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <SegurosSection />
        <TramitesLegalesSection />
        <MantenimientoSection />
        <CompraVentaSection />
        <RepresentanteLegalSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
