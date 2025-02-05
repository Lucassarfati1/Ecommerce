export default (sequelize, DataTypes) => {
    const Promotion = sequelize.define("Promotion",
    {
    // Configuraciones de las columnas.
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    percentage: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
},
    {
    tableName: 'promotion',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timestamps
    });
   
    return Promotion;
    }