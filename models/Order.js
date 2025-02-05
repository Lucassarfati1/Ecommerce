export default (sequelize, DataTypes) => {
    const Order = sequelize.define("Order",
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
    },
    total: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    discount: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    id_delivery: {
        allowNull: true,
        type: DataTypes.INTEGER
    },
    id_pay: {
        allowNull: true,
        type: DataTypes.INTEGER
    }
},
    {
    tableName: 'orders',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timestamps
    });
    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
        Order.hasMany(models.OrderDetail, {
            foreignKey: 'id_order',
            as: 'orders'
        });
        Order.belongsTo(models.Delivery, {
            foreignKey: 'id_delivery',
            as: 'delivery'
        });
        Order.belongsTo(models.Pay, {
            foreignKey: 'id_pay',
            as: 'pay'
        })
    };
    return Order;
    }