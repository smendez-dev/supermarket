export interface Movement {
    descripcion: string;
    usuario: string;
    tablaAfectada: string;
    fecha: Date;
}

export const MovementColumns = [
    {
      key: 'descripcion',
      type: 'text',
      label: 'Descripcion',
    },
    {
      key: 'usuario',
      type: 'text',
      label: 'Usuario',
    },
    {
      key: 'tablaAfectada',
      type: 'text',
      label: 'Tabla Afectada',
    },
    {
      key: 'fecha',
      type: 'text',
      label: 'Fecha',
    },
];