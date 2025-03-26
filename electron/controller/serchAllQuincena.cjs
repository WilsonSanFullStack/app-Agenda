const {
  Quincena,
  Day,
  Sender,
  Adult,
  Dirty,
  Vx,
  Moneda,
  Live7,
} = require("../db.cjs");
// const { BrowserWindow } = require("electron");

const getAllsQuincenas = async () => {
  try {
    const pages = await Quincena.findAll({
      attributes: ["name", "id"],
      include: [
        {
          model: Day,
          as: "dias",
          include: [
            { model: Sender, as: "Senders" },
            { model: Dirty, as: "Dirtys" },
            { model: Adult, as: "Adults" },
            { model: Vx, as: "Vxs" },
            { model: Live7, as: "Lives" },
          ],
        },
        {
          model: Moneda,
          as: "Monedas",
        },
      ],
    });

    console.log(pages);
    return pages.map((x) => x.get({ plain: true }));
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al obtener las quincenas",
      error: error.message,
    };
  }
};


module.exports = { getAllsQuincenas };
