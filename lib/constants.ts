export const ITEMS_PER_PAGE = 12;

// Tipos de Género permitidos
export const GENDERS = [
    "HOMBRE",
    "MUJER",
    "NINO", // Usamos NINO sin la ñ para evitar problemas en URLs o BBDD
    "NINA",
    "UNISEX"
] as const;

// Tipos de Prenda permitidos
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

// 👇 NUEVO: Diccionario centralizado de mensajes de error
export const ERROR_MESSAGES = {
    FILTERS: {
        MIN_GREATER_THAN_MAX: "El precio mínimo no puede ser mayor al máximo.",
        NEGATIVE_PRICE: "Los precios no pueden ser negativos.",
        PRICE_TOO_HIGH: "Por favor, ingresa un precio menor a S/ 50,000.",
        ZERO_VS_ZERO : "El rango de precio debe ser mayor a S/ 0.",
    }
} as const;