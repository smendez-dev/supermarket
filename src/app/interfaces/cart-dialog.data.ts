import { Product } from "./product.model";

export interface CartDialogData {
    productos: Product[];
}

export interface CartDialogDataRow {
    idProducto: number;
    descripcion: string;
    cantidadDescripcion: string;
    cantidad?: number;
    peso?: number;
    total: number;
    canRemove: boolean;
    isPLU: boolean;
}

export const CartDialogDataColumns = [
    {
      key: 'descripcion',
      type: 'text',
      label: 'Descripcion',
      required: true,
    },
    {
      key: 'cantidadDescripcion',
      type: 'text',
      label: 'Venta x kg',
      required: true,
    },
    {
      key: 'total',
      type: 'text',
      label: 'Total',
      required: true,
    },
    {
      key: 'remove',
      type: 'remove',
      label: '',
    },
];