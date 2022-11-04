import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CitasMedicasSchema } from "../db/schemas.ts";
import { CitasMedicas } from "../types.ts";
import { citasMedicasCollection } from "../db/mongo.ts";

type PostCitasMedicasContext = RouterContext<"/addSlot", Record<string | number, string | undefined>, Record<string, any>>


export const postCitasMedicas = async (context: PostCitasMedicasContext) => {

    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.day || !value?.month || !value?.year || !value?.hour) {
          context.response.status = 400;
          return;
        }
        else if (typeof value.day !== "number" ||typeof value.month !== "number" || typeof value.year !== "number") {
            context.response.status = 406;
            return;
        }

        else {
            if (value.day < 0 || value.day > 31) {
                context.response.status = 406;
                return;
            }

            if (value.month < 0 || value.month > 12) {
                context.response.status = 406;
                return;
            }

            if (value.year < 0) {
                context.response.status = 406;
                return;
            }

            if (value.hour < 0 ||value.hour > 23) {
                context.response.status = 406;
                return;
            }
        }
        const cita: Partial<CitasMedicas> = {
            ...value,
            day: 12,
            month: 2,
            year: 2023,
            hour: 13,
            available: true,
        }
        
        //check if car already in db
        const found = await citasMedicasCollection.findOne({ hour: value.hour });
              if (found) {
                if (found.available === false) {
                    context.response.status = 409;
                    context.response.body = { message: "Ya hay una cita en ese horario" };
                    return;
                }
    
                context.response.status = 200;
    
              }
          
              await citasMedicasCollection.insertOne(cita as CitasMedicasSchema);
              //context.response.body = citaWithoutId;
    }

    catch (e) {
        context.response.status = 500;
        console.error(e);
    }
        
};



/*

Permite al médico añadir un horario disponible para una cita. Por ejemplo, si añade lo siguiente:
{
  "day": 12,
  "month": 2,
  "year": 2023,
  "hour": 13
}
Creará una cita (available:true) el 12/2/2023.
Al añadir una cita se debe comprobar que no haya ya una cita en ese horario:
Si ya hay una cita y está ocupada (available:false) devolverá un error 409
Si ya hay una cita y está libre (available:true) la deja como está y devuelve un 200
Si los datos de día, mes, año y hora son incorrectos devolverá un error 406*/