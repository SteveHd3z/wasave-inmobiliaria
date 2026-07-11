export interface Cobertura {
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface Seguro {
  titulo: string;
  descripcion: string;
  icono: string;
  coberturas: Cobertura[];
}
