const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Page",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      coins: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      valorCoins: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      moneda: {
        type: DataTypes.ENUM[("USD", "EUR", "GBP")],
        allowNull: false,
      },
      mensual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      tope: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      descuento: {
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
