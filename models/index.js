import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize("supermercado", "root", "Remeroide123", {
    host: "localhost",
    dialect: "mysql",
});

const db = {};

const files = fs.readdirSync(__dirname).filter(
    (file) => file !== "index.js" && file.endsWith(".js")
);

console.log("Archivos en models/:", files);

for (const file of files) {
    const { default: modelFunction } = await import(`file://${path.join(__dirname, file)}`);
    const modelInstance = modelFunction(sequelize, DataTypes);
    db[modelInstance.name] = modelInstance;
}

Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("Modelos cargados:", Object.keys(db)); // Verifica que cargue los modelos
await sequelize.sync({ force: false }); // O alter: true si no quieres perder datos

sequelize.sync({ force: false })  // ⚠️ Elimina y recrea todas las tablas
  .then(() => {
    console.log("Tablas sincronizadas correctamente.");
  })
  .catch(err => {
    console.error("Error al sincronizar las tablas:", err);
  });

export default db;
