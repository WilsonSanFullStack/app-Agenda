const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Sender",
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.x,
        primaryKey: true,
      },
      coins: {
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
