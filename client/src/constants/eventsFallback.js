import {
  CorazonSanValetin as corazonSanValentin,
  navidadSalon,
  navidadSalon2,
  sanValentinSalon,
} from "./cloudinaryAssets.js";

export const fallbackEvents = {
  homeTitle: "Próximos eventos",
  homeCards: [
    {
      id: "home-1",
      title: "Cervecitas a mediodía",
      schedule: "Viernes - 13:00 a 16:00",
      note: "Cervezas frías, tapas y buen ambiente al mediodía.",
      imageUrl: "",
      imageAlt: "Cena romántica en Bar Corona",
    },
    {
      id: "home-2",
      title: "Brunch con música chill",
      schedule: "Sábado - 11:00 a 14:30",
      note: "Brunch con música chill, cafés especiales y buen rollo.",
      imageUrl: "",
      imageAlt: "Mesa navideña en Bar Corona",
    },
  ],
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
};

const fallbackPhotos = {
  "home-1": corazonSanValentin,
  "home-2": navidadSalon,
  "page-1-photo-1": corazonSanValentin,
  "page-1-photo-2": sanValentinSalon,
  "page-2-photo-1": navidadSalon,
  "page-2-photo-2": navidadSalon2,
};

export const resolveEventImage = ({ id, imageUrl }) => imageUrl?.trim() || fallbackPhotos[id] || "";
