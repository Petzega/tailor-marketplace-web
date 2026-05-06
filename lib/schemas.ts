import { z } from "zod";

export const productSizeSchema = z.object({
    size: z.string().min(1, "La talla es requerida"),
    stock: z.coerce.number().int().nonnegative("El stock debe ser un número entero"),
});

export type ProductSizeInput = z.infer<typeof productSizeSchema>;

export const productSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative("El precio no puede ser negativo"),
    stock: z.union([
        z.coerce.number().int().nonnegative(),
        z.string().transform(v => Number(v) || 0)
    ]).default(0),
    category: z.string().min(1, "La categoría es requerida"),
    gender: z.string().nullable().optional(),
    clothingType: z.string().nullable().optional(),
    imageUrl: z.string().optional(),
    sizesData: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const updateProductSchema = productSchema.extend({
    id: z.string().min(1, "El ID del producto es requerido"),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ============================================================================
// ORDERS SCHEMAS
// ============================================================================
export const orderItemSchema = z.object({
    id: z.string().min(1, "El ID del producto es requerido"),
    quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
    price: z.number().nonnegative("El precio no puede ser negativo"),
    size: z.string().optional(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

export const orderCustomerDataSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    docType: z.string().min(1, "El tipo de documento es requerido"),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    phone: z.string().min(1, "El teléfono es requerido"),
    address: z.string().optional(),
    reference: z.string().optional(),
});

export type OrderCustomerDataInput = z.infer<typeof orderCustomerDataSchema>;

export const createOrderSchema = z.object({
    customerData: orderCustomerDataSchema,
    items: z.array(orderItemSchema).min(1, "La orden debe contener al menos un producto").max(50, "La orden no puede contener más de 50 productos"),
    deliveryMethod: z.string().min(1),
    paymentMethod: z.string().min(1),
    subtotal: z.number().nonnegative(),
    deliveryCost: z.number().nonnegative(),
    finalTotal: z.number().nonnegative(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateStatusSchema = z.object({
    orderId: z.string().min(1),
    newStatus: z.string().min(1),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

// ============================================================================
// SERVICES SCHEMAS
// ============================================================================
export const serviceStatusSchema = z.enum(["PENDING", "FITTING", "READY", "DELIVERED"]);

export const saveServiceSchema = z.object({
    id: z.string().optional(),
    customerId: z.string().min(1, "El ID del cliente es obligatorio"),
    serviceType: z.string().min(1, "El tipo de servicio es obligatorio"),
    description: z.string().min(1),
    serviceNotes: z.string().optional().nullable(),
    price: z.coerce.number().nonnegative(),
    deposit: z.coerce.number().nonnegative(),
    fittingDate: z.string().optional().nullable(),
    deliveryDate: z.string().optional().nullable(),
    updatedMeasurements: z.string().optional().nullable(),
});

export type SaveServiceInput = z.infer<typeof saveServiceSchema>;

// ============================================================================
// CUSTOMERS SCHEMAS
// ============================================================================
export const customerSchema = z.object({
    id: z.string().optional(),
    docType: z.string().min(1, "El tipo de documento es requerido"),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    phone: z.string().optional(),
    email: z.string().email("Correo inválido").optional().or(z.literal("")),
    address: z.string().optional(),
    measurements: z.string().optional(),
    notes: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;