export type CategoriaPropiedad = "comercial" | "rural" | "urbano";

export interface Propiedad {
  titulo: string;
  precio: string;
  ubicacion: string;
  descripcion: string;
}

export interface CategoriaTab {
  key: CategoriaPropiedad;
  label: string;
}
