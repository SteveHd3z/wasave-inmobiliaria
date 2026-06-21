export default function Footer() {
  return (
    <footer
      className="static bottom-0 left-0 right-0 border-t py-6"
      style={{
        backgroundColor: "var(--primary-dark)",
        borderColor: "var(--border-color)",
        color: "var(--primary-light)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-lg">Wasave Inmobiliaria</p>
            <p className="text-sm opacity-80">
              Soluciones inmobiliarias integrales
            </p>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-semibold">Walter Salazar</p>
            <p className="text-sm opacity-80">Tel: 314 744 8237</p>
            <p className="text-sm opacity-80">wasaveinmobiliaria@gmail.com</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center text-xs opacity-60" style={{ borderColor: "var(--border-color)" }}>
          <p>&copy; {new Date().getFullYear()} Wasave Inmobiliaria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
