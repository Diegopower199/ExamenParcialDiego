import {
    MongoClient,
    Database,
  } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
  
  import { CitasMedicasSchema } from "./schemas.ts";
  
  const connectMongoDB = async (): Promise<Database> => {
    const mongo_usr = "Diegopower";
    const mongo_pwd = "diegopower199";
    const db_name = "Cluster0";
    const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster0.fkvpsms.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;
  
    const client = new MongoClient();
    await client.connect(mongo_url);
    const db = client.database(db_name);
    return db;
  };
  
  const db = await connectMongoDB();
  console.info(`MongoDB ${db.name} connected`);




  
  export const citasMedicasCollection = db.collection<CitasMedicasSchema>("CitasMedicas");