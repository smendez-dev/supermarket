import { Detail } from "./detail.model";

export interface Invoice {
    idFactura: number;
    total: number;
    cajero: string;
    caja: number;
    fecha: Date;
    detalles: Detail[];
}

export const InvoiceColumns = [
    {
      key: 'total',
      type: 'text',
      label: 'Total',
    },
    {
      key: 'cajero',
      type: 'text',
      label: 'Cajero',
    },
    {
      key: 'caja',
      type: 'text',
      label: 'Caja',
    },
    {
      key: 'fecha',
      type: 'text',
      label: 'Fecha',
    },
];