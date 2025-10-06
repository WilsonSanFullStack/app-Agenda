const { CerradoQ } = require("../db.cjs");
const { getDataQ } = require("./getQData.cjs");

const cerrarQ = async (data) => {
  try {
    //buscamos la quincena y la formatiamos
    const q = await getDataQ(data.id);
    //sacamos los valores del datavalues
    const quincena = q.get({ plain: true });

    // buscar si ya existe un día con el mismo name y page
    const existingQ = await CerradoQ.findOne({
      where: { name: quincena.name },
    });
    // si existe, lo borramos
    if (existingQ) {
      await existingQ.destroy();
    }
    const res = await CerradoQ.create({
      name: quincena.name,
      data: quincena,
    });
    return res;
  } catch (error) {
    return {
      sucess: false,
      message: "Error al cerrar la Quincena",
      error: error,
    };
  }
};

module.exports = { cerrarQ };
