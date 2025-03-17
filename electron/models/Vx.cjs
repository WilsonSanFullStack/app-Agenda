const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Vx",
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.x,
        primaryKey: true,
      },
      Creditos: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
