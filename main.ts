import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { removeCitaMedica } from "./resolvers/delete.ts";
import { postCitasMedicas } from "./resolvers/post.ts"
import { putReleaseCita } from "./resolvers/put.ts";

import {availableSlotsCitaSinDias, availableSlotsCitaConDia } from "./resolvers/get.ts"
/*
import { removeCar } from "./resolvers/delete.ts";
import { askCar } from "./resolvers/get.ts";
import { addCar } from "./resolvers/post.ts";
import { releaseCar } from "./resolvers/put.ts";*/



const router = new Router ();

router.get("/test", (context) => {
    context.response.body = "Todo ok";
});

router.post("/addSlot", postCitasMedicas);
router.delete("/removeSlot/:id/:day/:month/:year/:hour", removeCitaMedica);
router.put("/bookSlot/:id", putReleaseCita);

router.get("/availableSlots/:month/:year", availableSlotsCitaSinDias )
router.get("/availableSlots/:day/:month/:year", availableSlotsCitaConDia);


const app = new Application ();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7778});