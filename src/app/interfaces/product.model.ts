import { Area } from "./area.model";

export interface Product {
    idProducto: number;
    area: Area;
    plu?: number;
    ean?: number;
    descripcion: string;
    peso?: number;
    precio: number;
    cantidad?: number;
    isEdit: boolean;
    isAdd: boolean;
}

export const ProductColumns = [
    {
      key: 'plu',
      type: 'number',
      label: 'PLU',
    },
    {
      key: 'ean',
      type: 'number',
      label: 'EAN',
    },
    {
      key: 'area',
      type: 'text',
      label: 'Area',
      required: true,
    },
    {
      key: 'descripcion',
      type: 'text',
      label: 'Descripción',
      required: true,
    },
    {
      key: 'peso',
      type: 'number',
      label: 'Peso (g)',
    },
    {
      key: 'precio',
      type: 'number',
      label: 'Precio (col)',
      required: true,
    },
    {
      key: 'cantidad',
      type: 'number',
      label: 'Cantidad',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
];