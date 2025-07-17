const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Cerrado",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      sender : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dirty : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vx : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      live7 : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dolar : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      euro : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lb : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      daysWorked : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
