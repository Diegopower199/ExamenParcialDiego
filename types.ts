export type CitasMedicas = {
    day: number;
    month: number;
    year: number;
    hour: number;
    available: boolean;
    dni: string
};

/*

  day (número del 1 al 31)
month (número del 1 al 12, se debe comprobar que el día es correcto según el mes)
year (número)
hour (número entero del 0 al 23)
available (verdadero o falso)
dni (texto con el dni del paciente en el caso de que la cita haya sido pedida)

*/