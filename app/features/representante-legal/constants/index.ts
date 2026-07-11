import { RepresentanteLegal } from "../types";
import { CONTACT_INFO } from "@shared/constants";

export const REPRESENTANTE_DATA: RepresentanteLegal = {
  nombre: CONTACT_INFO.name,
  cargo: "Representante Legal - Wasave Inmobiliaria",
  biografia: [
    "Profesional especializado en bienes raíces con más de 30 años de experiencia en el mercado inmobiliario internacional. Con presencia en Chicago, Canadá y México, brindando soluciones integrales a familias y empresas en el país.",
  ],
  imagen: "/images/walter.jpg",
  licencia: "/images/certificado.jpg",
};
