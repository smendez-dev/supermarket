export interface Sale {
    idVenta: number;
    idFactura: number;
    cajero: string;
    descripcion: string;
    fecha: Date;
}

export const SaleColumns = [
    {
      key: 'cajero',
      type: 'text',
      label: 'Cajero',
    },
    {
      key: 'descripcion',
      type: 'text',
      label: 'Descripcion',
    },
    {
      key: 'fecha',
      type: 'text',
      label: 'Fecha',
    },
];