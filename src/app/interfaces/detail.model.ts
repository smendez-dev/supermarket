import { Product } from "./product.model";

export interface Detail {
    idDetalle: number;
    producto: Product;
    subtotal: number;
    peso?: number;
    cantidad?: number;
}

export const DetailColumns = [
    {
      key: 'producto',
      type: 'text',
      label: 'Producto',
    },
    {
      key: 'subtotal',
      type: 'text',
      label: 'Subtotal',
    },
    {
      key: 'peso',
      type: 'text',
      label: 'Peso',
    },
    {
      key: 'cantidad',
      type: 'text',
      label: 'Cantidad',
    },
];