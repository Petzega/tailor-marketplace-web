import { describe, it, expect } from 'vitest';
import { createOrderSchema, productSchema, customerSchema, updateStatusSchema, serviceStatusSchema } from '@/lib/schemas';

describe('createOrderSchema', () => {
  it('should validate a complete order', () => {
    const validOrder = {
      customerData: {
        name: 'Juan Perez',
        docType: 'DNI',
        documentNumber: '12345678',
        phone: '999888777',
      },
      items: [{ id: 'prod1', quantity: 2, price: 50.0 }],
      deliveryMethod: 'DELIVERY',
      paymentMethod: 'YAPE',
      subtotal: 100.0,
      deliveryCost: 10.0,
      finalTotal: 110.0,
    };

    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject empty items', () => {
    const invalidOrder = {
      customerData: { name: 'Juan', docType: 'DNI', documentNumber: '123', phone: '999' },
      items: [],
      deliveryMethod: 'STORE',
      paymentMethod: 'EFECTIVO',
      subtotal: 0,
      deliveryCost: 0,
      finalTotal: 0,
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('should reject negative prices', () => {
    const invalidOrder = {
      customerData: { name: 'Juan', docType: 'DNI', documentNumber: '123', phone: '999' },
      items: [{ id: 'prod1', quantity: 1, price: -10 }],
      deliveryMethod: 'STORE',
      paymentMethod: 'EFECTIVO',
      subtotal: -10,
      deliveryCost: 0,
      finalTotal: -10,
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });
});

describe('productSchema', () => {
  it('should validate a valid product', () => {
    const validProduct = { name: 'Camisa', price: 100, stock: 10, category: 'READY_MADE' };
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidProduct = { name: '', price: 100, stock: 10, category: 'READY_MADE' };
    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('should reject negative price', () => {
    const invalidProduct = { name: 'Camisa', price: -50, stock: 10, category: 'READY_MADE' };
    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});

describe('customerSchema', () => {
  it('should validate a valid customer', () => {
    const validCustomer = { docType: 'DNI', documentNumber: '12345678', name: 'Maria Lopez' };
    const result = customerSchema.safeParse(validCustomer);
    expect(result.success).toBe(true);
  });

  it('should accept valid email', () => {
    const customerWithEmail = { docType: 'DNI', documentNumber: '123', name: 'Maria', email: 'maria@test.com' };
    const result = customerSchema.safeParse(customerWithEmail);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const customerWithBadEmail = { docType: 'DNI', documentNumber: '123', name: 'Maria', email: 'not-an-email' };
    const result = customerSchema.safeParse(customerWithBadEmail);
    expect(result.success).toBe(false);
  });
});

describe('updateStatusSchema', () => {
  it('should validate status update', () => {
    const validUpdate = { orderId: 'ORD-001', newStatus: 'COMPLETED' };
    const result = updateStatusSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });

  it('should reject empty orderId', () => {
    const invalidUpdate = { orderId: '', newStatus: 'COMPLETED' };
    const result = updateStatusSchema.safeParse(invalidUpdate);
    expect(result.success).toBe(false);
  });
});

describe('serviceStatusSchema', () => {
  it('should accept valid statuses', () => {
    expect(serviceStatusSchema.safeParse('PENDING').success).toBe(true);
    expect(serviceStatusSchema.safeParse('FITTING').success).toBe(true);
    expect(serviceStatusSchema.safeParse('READY').success).toBe(true);
    expect(serviceStatusSchema.safeParse('DELIVERED').success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = serviceStatusSchema.safeParse('INVALID');
    expect(result.success).toBe(false);
  });
});
