export default (sequelize, DataTypes) => {
    const Pay = sequelize.define("Pay",
    {
    // Configuraciones de las columnas.
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_user: {
        allowNull: false,
        type: DataTypes.INTEGER
    },id_order: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    securityNumber: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
    ,
     card: {
        allowNull: false,
        type: DataTypes.STRING
    },
    nameCard: {
        allowNull: false,
        type: DataTypes.STRING
    },
    maturity: {
        allowNull: false,
        type: DataTypes.DATE
    }
},
    {
    tableName: 'pay',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timestamps
    });
    Pay.associate = (models) => {
        Pay.belongsTo(models.Order, {
            foreignKey: 'id_order',
            as: 'order'
        });
        
    };
    return Pay;
    }