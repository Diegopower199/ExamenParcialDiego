import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CitasMedicasSchema } from "../db/schemas.ts";
import { CitasMedicas } from "../types.ts";
import { citasMedicasCollection } from "../db/mongo.ts";

type GetCitasMedicasContextConDias = RouterContext<"/availableSlots/:day/:month/:year", {
    day: string;
    month: string;
    year: string
} 
& Record<string | number, string | undefined>, Record<string, any>>

type GetCitasMedicasContextSinDias = RouterContext<"/availableSlots/:month/:year", {
    month: string;
    year: string
} 
& Record<string | number, string | undefined>, Record<string, any>>


export const availableSlotsCitaConDia = async (context: GetCitasMedicasContextConDias) => {
    try {
        const citasDia = await citasMedicasCollection.find({ dia: context.params?.day }).toArray();
        if (citasDia.length > 0) {
            context.response.body = citasDia.map((cita: {day: number, month: number, year: number}) => ({
                day: Number(cita.day),
                month: Number(cita.month),
                year: Number(cita.year),
      }));
           
        }
        else {
            context.response.status = 404;
            context.response.body = {
                message: "No hay citas"
            };
        }
    }
    catch (e) {
        console.error(e);
        context.response.status = 500;
    }
}

export const availableSlotsCitaSinDias = async (context: GetCitasMedicasContextSinDias) => {
    try {
        const citasMesAno = await citasMedicasCollection.find({ dia: context.params?.day }).toArray();
        if (citasMesAno.length > 0) {
            context.response.body = citasMesAno.map((cita: { month: number, year: number}) => ({
                month: Number(cita.month),
                year: Number(cita.year),
      }));
           
        }
        else {
            context.response.status = 404;
            context.response.body = {
                message: "No hay citas"
            };
        }
    }
    catch (e) {
        console.error(e);
        context.response.status = 500;
    }
}

/*
Permite a un paciente consultar las citas disponibles en un determinado día o en un determinado mes. Devolverá un array de citas. Si no hay citas disponibles devolverá un array estará vacío.
Hay dos opciones de endpoint
/availableSlots?day=12&month=2&year=2022, devuelve un listado con todas las citas disponibles en el día, mes y año fijados.
/availableSlots?month=2&year=2022, devuelve un listado con todas las citas disponibles en el mes y año fijados.
Si el endpoint no está bien construido (por ejemplo /availableSlots?day=3) devolverá un error 403*/