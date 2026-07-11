import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@shared/hooks";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wasave Inmobiliaria",
  description:
    "Soluciones inmobiliarias integrales: seguros, servicios, mantenimiento, compra y venta de propiedades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
