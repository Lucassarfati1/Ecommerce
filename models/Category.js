export default (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        // Configuraciones de las columnas.
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        }, 
        description: {
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        tableName: 'category',
        // Si el nombre de la tabla no coincide con el del modelo
        timestamps: false, // Si no tengo timestamps
    });

    return Category;
};
