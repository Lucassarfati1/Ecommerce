export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    genre: {
      allowNull: false,
      type: DataTypes.STRING
    },
    age: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_role: { // 👈 Clave foránea hacia la tabla roles
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', // nombre de la tabla
        key: 'id'
      }
    }
  }, {
    tableName: 'users',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'id_user',
      as: 'orders'
    });

    User.belongsTo(models.Role, { // 👈 Relación con Role
      foreignKey: 'id_role',
      as: 'role'
    });
  };

  return User;
};
