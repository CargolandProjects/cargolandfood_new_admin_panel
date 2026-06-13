export const COUNTRIES = ["Nigeria"];

export const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

export const CITIES: Record<string, string[]> = {
  Lagos: [
    "Lagos Mainland",
    "Lagos Island",
    "Ikoyi",
    "Victoria Island",
    "Lekki",
    "Ajah",
    "Epe",
    "Ikorodu",
    "Badagry",
    "Mushin",
    "Surulere",
    "Yaba",
    "Ikeja",
    "Gbagada",
    "Magodo",
    "Sangotedo",
  ],
  Ogun: [
    "Abeokuta",
    "Sagamu",
    "Ijebu-Ode",
    "Ijebu-Igbo",
    "Remo",
    "Imeko",
    "Ipokia",
  ],
  Oyo: [
    "Ibadan",
    "Ogbomoso",
    "Oyo",
    "Iseyin",
    "Saki",
    "Eruwa",
  ],
  Osun: [
    "Osogbo",
    "Ife",
    "Ijesha",
    "Ilesha",
    "Ondo",
  ],
  Ondo: [
    "Akure",
    "Owo",
    "Ondo",
    "Okitipupa",
  ],
  Ekiti: [
    "Ado-Ekiti",
    "Ikere",
    "Ijero",
    "Oye",
  ],
  Kwara: [
    "Ilorin",
    "Offa",
    "Jebba",
  ],
  Kogi: [
    "Lokoja",
    "Okene",
    "Idah",
  ],
  Niger: [
    "Minna",
    "Bida",
    "Suleja",
  ],
  Nasarawa: [
    "Lafia",
    "Keffi",
    "Nasarawa",
  ],
  Plateau: [
    "Jos",
    "Bukuru",
    "Pankshin",
  ],
  Kaduna: [
    "Kaduna",
    "Zaria",
    "Kafanchan",
  ],
  Kano: [
    "Kano",
    "Kumbotso",
    "Tarauni",
  ],
  Katsina: [
    "Katsina",
    "Daura",
    "Funtua",
  ],
  Kebbi: [
    "Birnin Kebbi",
    "Argungu",
  ],
  Sokoto: [
    "Sokoto",
    "Gusau",
  ],
  Zamfara: [
    "Gusau",
    "Kaura Namoda",
  ],
  Yobe: [
    "Damaturu",
    "Potiskum",
  ],
  Borno: [
    "Maiduguri",
    "Biu",
  ],
  Gombe: [
    "Gombe",
    "Bajoga",
  ],
  Adamawa: [
    "Yola",
    "Girei",
  ],
  Taraba: [
    "Jalingo",
    "Wukari",
  ],
  Bauchi: [
    "Bauchi",
    "Azare",
  ],
  Jigawa: [
    "Dutse",
    "Hadejia",
  ],
  Benue: [
    "Makurdi",
    "Gboko",
  ],
  Enugu: [
    "Enugu",
    "Nsukka",
  ],
  Ebonyi: [
    "Abakaliki",
    "Onueke",
  ],
  Anambra: [
    "Onitsha",
    "Awka",
    "Nnewi",
  ],
  Imo: [
    "Owerri",
    "Orlu",
    "Okigwe",
  ],
  Abia: [
    "Umuahia",
    "Aba",
  ],
  "Cross River": [
    "Calabar",
    "Ogoja",
  ],
  Delta: [
    "Warri",
    "Asaba",
    "Sapele",
  ],
  Bayelsa: [
    "Yenagoa",
    "Brass",
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Bonny",
  ],
  FCT: [
    "Abuja",
    "Gwagwalada",
  ],
};

export const ZONE_TYPES = [
  { value: "CITY", label: "City (Coverage)" },
  { value: "LOCAL", label: "Local (Neighbourhood)" },
  { value: "EXPRESS", label: "Express" },
  { value: "PROMO", label: "Promo/Campaign" },
];

export const ZONE_TYPE_COLORS: Record<string, { fill: string; stroke: string; light: string }> = {
  CITY: {
    fill: "#0EA5E9",
    stroke: "#0284C7",
    light: "#E0F2FE",
  },
  LOCAL: {
    fill: "#22C55E",
    stroke: "#16A34A",
    light: "#F0FDF4",
  },
  EXPRESS: {
    fill: "#F97316",
    stroke: "#EA580C",
    light: "#FFF7ED",
  },
  PROMO: {
    fill: "#EC4899",
    stroke: "#DB2777",
    light: "#FDF2F8",
  },
};
