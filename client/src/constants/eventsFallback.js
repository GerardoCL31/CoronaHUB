import {
  abanico2,
  CasaFundada,
  chimenea1,
  chimenea2,
  CorazonSanValetin as corazonSanValentin,
  mesa1,
  mesa2,
  navidadSalon,
  navidadSalon2,
  quesoAceitunasJamon,
  saborConTradicion,
  saborConTradicion2,
  salon,
  sanValentinSalon,
  TostasdaJamon,
  transformCloudinaryUrl,
} from "./cloudinaryAssets.js";
import { fallbackHomeEvents } from "./homeEventsFallback.js";

export const fallbackEvents = {
  ...fallbackHomeEvents,
  pageItems: [
    {
      id: "page-1",
      title: "San Valentín - Noche de Amor",
      description:
        "Una velada especial con música suave, tragos temáticos y ambiente romántico. Promos para parejas y sorpresas durante la noche. Ideal para disfrutar en pareja o con amigos.",
      photos: [
        {
          id: "page-1-photo-1",
          imageUrl: "",
          imageAlt: "Decoración romántica en Bar Corona",
        },
        {
          id: "page-1-photo-2",
          imageUrl: "",
          imageAlt: "Mesa especial de San Valentín",
        },
      ],
    },
    {
      id: "page-2",
      title: "Comida navideña",
      description:
        "Mesa navideña elegante con mariscos, embutidos y entradas decoradas. Velas, copas y colores festivos crean un ambiente cálido y familiar. Ideal para una celebración especial.",
      photos: [
        {
          id: "page-2-photo-1",
          imageUrl: "",
          imageAlt: "Mesa navideña en Bar Corona",
        },
        {
          id: "page-2-photo-2",
          imageUrl: "",
          imageAlt: "Cena festiva en Bar Corona",
        },
      ],
    },
  ],
  gallery: [
    { id: "gallery-left", imageUrl: "", imageAlt: "Sabor con tradición" },
    { id: "gallery-grid-1", imageUrl: "", imageAlt: "Tabla de quesos, aceitunas y jamón" },
    { id: "gallery-grid-2", imageUrl: "", imageAlt: "Mesa con brasas y tapas" },
    { id: "gallery-grid-3", imageUrl: "", imageAlt: "Tabla de jamón" },
    { id: "gallery-grid-4", imageUrl: "", imageAlt: "Salón del bar" },
    { id: "gallery-grid-5", imageUrl: "", imageAlt: "Mesa preparada" },
    { id: "gallery-grid-6", imageUrl: "", imageAlt: "Mesa lista para servir" },
    { id: "gallery-right", imageUrl: "", imageAlt: "Sabor con tradición en plato" },
    { id: "gallery-bottom-1", imageUrl: "", imageAlt: "Picoteo y vino" },
    { id: "gallery-bottom-2", imageUrl: "", imageAlt: "Casa fundada Bar Corona" },
    { id: "gallery-bottom-3", imageUrl: "", imageAlt: "Tostadas con jamón" },
  ],
};

const fallbackPhotos = {
  "home-1": corazonSanValentin,
  "home-2": navidadSalon,
  "page-1-photo-1": corazonSanValentin,
  "page-1-photo-2": sanValentinSalon,
  "page-2-photo-1": navidadSalon,
  "page-2-photo-2": navidadSalon2,
  "gallery-left": saborConTradicion,
  "gallery-grid-1": quesoAceitunasJamon,
  "gallery-grid-2": chimenea1,
  "gallery-grid-3": abanico2,
  "gallery-grid-4": salon,
  "gallery-grid-5": mesa1,
  "gallery-grid-6": mesa2,
  "gallery-right": saborConTradicion2,
  "gallery-bottom-1": chimenea2,
  "gallery-bottom-2": CasaFundada,
  "gallery-bottom-3": TostasdaJamon,
};

export const resolveEventImage = ({ id, imageUrl }) =>
  transformCloudinaryUrl(imageUrl?.trim(), "f_auto,q_auto,w_900,c_limit") || fallbackPhotos[id] || "";

export const resolveGalleryImage = ({ id, imageUrl }) =>
  transformCloudinaryUrl(imageUrl?.trim(), "f_auto,q_auto,w_900,c_limit") || fallbackPhotos[id] || "";
