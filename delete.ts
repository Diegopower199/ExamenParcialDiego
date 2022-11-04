import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CitasMedicasSchema } from "../db/schemas.ts";
import { CitasMedicas } from "../types.ts";
import { citasMedicasCollection } from "../db/mongo.ts";

type DeleteCitasMedicasContext = RouterContext<"/removeSlot/:id/:day/:month/:year/:hour", {
    id: string;
    day: string;
    month: string;
    year: string;
    hour: string
  } 
  & Record<string | number, string | undefined>, Record<string, any>>


export const removeCitaMedica = async (context: DeleteCitasMedicasContext) => {
    try {

    const ID = context.params?.id
      const dia   = Number(context.params?.day);
      const mes = Number(context.params?.month);
      const ano  = Number(context.params?.year);
      const hora = Number(context.params?.hour);

      const cita = await citasMedicasCollection.findOne({ day: dia, month: mes, year: ano, hour: hora});

      ///removeSlot?day=12&month=2&year=2023&hour=13.
  
      
  
      if (!cita) {
        context.response.status = 404;
        context.response.body = {
          message: "cita not found",
        };
        return;
      }
  
      if (cita) {
        if (cita.available === false) {
          context.response.status = 403;
          context.response.body = {
            message: "Cita ocupada",
          };
          return;
        } else {
          await citasMedicasCollection.deleteOne({ ID });
          context.response.status = 200;
        }
      }
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
  };

  /*
  Permite al médico eliminar un horario disponible para una cita. Lo hará a través de los datos: day, month, year, hour utilizando el siguiente formato: /removeSlot?day=12&month=2&year=2023&hour=13.
Al eliminar una cita se debe comprobar que haya ya una cita en ese horario:
Si ya hay una cita y está ocupada (available:false) devolverá un error 403
Si ya hay una cita y está libre (available:true) la elimina y devuelve un 200
*/