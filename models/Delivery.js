export default (sequelize, DataTypes) => {
    const Delivery = sequelize.define("Delivery",
    {
    // Configuraciones de las columnas.
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    }, 
    id_user: {
        
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_order: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    time: {
        allowNull: false,
        type: DataTypes.DATE
    },
    cost: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
},
    {
    tableName: 'deliveries',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timesamps
    });
   
    return Delivery;
    }