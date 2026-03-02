export const ITEMS_PER_PAGE = 12;

// 👇 NUEVO: Tipos de Género permitidos
export const GENDERS = [
    "HOMBRE",
    "MUJER",
    "NINO", // Usamos NINO sin la ñ para evitar problemas en URLs o BBDD
    "NINA",
    "UNISEX"
] as const;

// 👇 NUEVO: Tipos de Prenda permitidos
export const CLOTHING_TYPES = [
    "CAMISA",
    "PANTALON",
    "SHORT",
    "LENCERIA",
    "ROPA_INTERIOR",
    "POLO",
    "ACCESORIOS",
    "VESTIDO"
] as const;

// Exportamos los tipos de TypeScript basados en estas constantes
export type GenderType = typeof GENDERS[number];
export type ClothingType = typeof CLOTHING_TYPES[number];