import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { CitasMedicas } from "../types.ts";

export type CitasMedicasSchema = Omit<CitasMedicas, "id"> & { _id: ObjectId };