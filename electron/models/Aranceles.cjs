const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Aranceles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dolar: {
      type: DataTypes.FLOAT,
      allowNull: false,
      },
      euro: {
      type: DataTypes.FLOAT,
      allowNull: false,
      },
      gbp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      },
      porcentaje: {
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
