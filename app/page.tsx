import { Header, Footer, WhatsAppButton } from "@shared/components";
import { HeroSection } from "@features/home";
import { SegurosSection } from "@features/seguros";
import { ServiciosSection } from "@features/servicios";
import { MantenimientoSection } from "@features/mantenimiento";
import { CompraVentaSection } from "@features/compra-venta";
import { DisponibleSection } from "@features/disponible";
import { RepresentanteLegalSection } from "@features/representante-legal";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <SegurosSection />
        <ServiciosSection />
        <MantenimientoSection />
        <CompraVentaSection />
        <DisponibleSection />
        <RepresentanteLegalSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
