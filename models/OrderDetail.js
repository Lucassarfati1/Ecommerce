module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define("OrderDetail",
    {
    // Configuraciones de las columnas.
    
    id_product: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_order: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    unitPrice: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    totalCost: {
        allowNull: false,
        type: DataTypes.INTEGER
    
}
},
    {
    tableName: 'orderDetails',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timesamps
    });
   OrderDetail.associate = (models) => {
    OrderDetail.belongsTo(models.Order, {
        foreignKey: 'id_order',
        as: 'order'
    });
    OrderDetail.belongsTo(models.Product, {
        foreignKey: 'id_product',
        as: 'product'
    });
};
    return OrderDetail;
    }
