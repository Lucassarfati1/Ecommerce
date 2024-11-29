module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product",
    {
    // Configuraciones de las columnas.
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nombre: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    brand: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    unityPrice: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    id_category: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    id_promotion: {
        allowNull: true,
        type: DataTypes.INTEGER
    }
   
},
    {
    tableName: 'products',
    //Si el nombre de la tabla no coincide con el del modelo
    timestamps: false,
    //Si no tengo timestamps
    });
    Product.associate = (models) => {
        // Relación uno a uno con OrderDetail
        Product.belongsTo(models.Category, {
            foreignKey: 'id_category',
            as: 'category'
        });
        Product.belongsTo(models.Promotion, {
            foreignKey: 'id_promotion',
            as: 'promotion'
        });
    }
    return Product;
    }