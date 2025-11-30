const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Day",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      page: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      usd: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      euro: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      gbp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      gbpParcial: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      mostrar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      adelantos: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      worked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
