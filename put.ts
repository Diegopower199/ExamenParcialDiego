import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CitasMedicasSchema } from "../db/schemas.ts";
import { CitasMedicas } from "../types.ts";
import { citasMedicasCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

type PutCitasMedicasContext = RouterContext<"/bookSlot/:id", {
    id: string;
  } 
  & Record<string | number, string | undefined>, Record<string, any>>


  export const putReleaseCita = async (context: PutCitasMedicasContext) => {

    //console.log(!context.params?.day,  !context.params?.month,  !context.params?.year, !context.params?.hour, !context.params?.dni)
    try {
        if (!context.params?.day || !context.params?.month || !context.params?.year || !context.params?.hour || !context.params?.dni ) {
            context.response.status = 400;
            context.response.body = { message: "Faltan datos" };
            return;
        }
      if (context.params?.id) {
        const cita: CitasMedicasSchema | undefined = await citasMedicasCollection.findOne({
          _id: new ObjectId(context.params.id),
        });
  
        if (cita) {
          if (!cita.available) {
            await citasMedicasCollection.updateOne(
              {
                _id: cita._id,
              },
              {
                $set: {
                    available: true,
                },
              }
            );
            context.response.status = 200;
            return;
          } else {
            context.response.status = 404;
            context.response.body = { message: "Dia del cita no disponible" };
          }
        }

      }
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
  };
