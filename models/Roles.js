export default (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'roles',
    timestamps: false,
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'id_role',
      as: 'users'
    });
  };

  return Role;
};
