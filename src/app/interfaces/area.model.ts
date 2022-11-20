export interface Area {
    idArea: number;
    nombre: string;
    isEdit: boolean;
}

export const AreaColumns = [
    {
      key: 'nombre',
      type: 'text',
      label: 'Nombre',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
];