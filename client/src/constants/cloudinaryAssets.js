const buildCloudinaryUrl = (path, transformations = "f_auto,q_auto") =>
  `https://res.cloudinary.com/djuisin8z/image/upload/${transformations}/${path}`;

export const transformCloudinaryUrl = (url, transformations = "f_auto,q_auto") => {
  if (typeof url !== "string" || !url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/${transformations}/`);
};

const image = (path, transformations) => buildCloudinaryUrl(path, transformations);

export const cerveza = image("v1770895089/cerveza_p5cjk0.png", "f_auto,q_auto,w_96,h_96,c_limit");
export const abanico2 = image("v1770895089/abanico2_vbecyy.png", "f_auto,q_auto,w_900,c_limit");
export const CasaFundada = image("v1770895087/CasaFundada_lbpuio.png", "f_auto,q_auto,w_900,c_limit");
export const TostasdaJamon = image(
  "v1770895087/TostasdaJamon_wwjmwb.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const sol = image("v1770895086/sol_xvukir.png", "f_auto,q_auto,w_96,h_96,c_limit");
export const saborConTradicion2 = image(
  "v1770895085/saborConTradicci%C3%B3n2_qd40oi.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const sanValentinSalon = image(
  "v1770895085/sanValentinSalon_znqqp9.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const salon = image("v1770895083/salon_wjhucf.png", "f_auto,q_auto,w_900,c_limit");
export const saborConTradicion = image(
  "v1770895082/saborConTradicci%C3%B3n_vq7q7w.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const quesoUvas = image("v1770895081/quesoUvas_ju3n6f.png", "f_auto,q_auto,w_900,c_limit");
export const navidadSalon2 = image(
  "v1770895080/navidadSalon2_rxyp6y.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const quesoAceitunasJamon = image(
  "v1770895079/quesoAceitunasJamon_hh8slv.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const portada = image("v1770895079/portada_r3enac.png", "f_auto,q_auto,w_1400,c_fill,g_auto");
export const portadaMobile = image(
  "v1770895079/portada_r3enac.png",
  "f_auto,q_auto,w_720,c_fill,g_auto"
);
export const navidadSalon = image(
  "v1770895079/navidadSalon_cf7yae.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const mesaComida = image("v1770895077/mesaComida_flcyvs.png", "f_auto,q_auto,w_900,c_limit");
export const mesaChimenea = image(
  "v1770895076/mesaChimenea_o6uf19.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const mesa1 = image("v1770895076/mesa1_pxknru.png", "f_auto,q_auto,w_900,c_limit");
export const mesa2 = image("v1770895075/mesa2_gsz1xm.png", "f_auto,q_auto,w_900,c_limit");
export const mapa = image("v1770895074/mapa_shw024.png", "f_auto,q_auto,w_640,c_limit");
export const chimenea2 = image("v1770895074/chimenea2_gw5b6q.png", "f_auto,q_auto,w_900,c_limit");
export const CorazonSanValetin = image(
  "v1770895073/CorazonSanValetin_hexlu9.png",
  "f_auto,q_auto,w_900,c_limit"
);
export const logo = image("v1770895073/logo_oxr3iw.png", "f_auto,q_auto,w_320,c_limit");
export const comidaBarra = image("v1770895073/comidaBarra_vkwjdk.png", "f_auto,q_auto,w_900,c_limit");
export const chimenea1 = image("v1770895072/chimenea1_bwfaak.png", "f_auto,q_auto,w_900,c_limit");
