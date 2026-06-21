import { Header, Footer, WhatsAppButton } from "@shared/components";
import { HeroSection } from "@features/home";
import { SegurosSection } from "@features/seguros";
import { TramitesLegalesSection } from "@features/tramites-legales";
import { MantenimientoSection } from "@features/mantenimiento";
import { CompraVentaSection } from "@features/compra-venta";
import { RepresentanteLegalSection } from "@features/representante-legal";

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
