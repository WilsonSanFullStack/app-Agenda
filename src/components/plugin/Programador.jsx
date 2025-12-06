import React from 'react';

const Programador = () => {
  const handlePortfolioClick = () => {
    window.open('https://wilsonsanchez.vercel.app/', '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    const email = 'harveysanch@gmail.com';
    const subject = 'Consulta sobre App Agenda';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  const handleWhatsAppClick = () => {
    const phone = '573156226982';
    const message = 'Hola Wilson, tengo una consulta sobre App Agenda';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSuggestionsClick = () => {
    const email = 'harveysanch@gmail.com';
    const subject = 'Sugerencias para App Agenda';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  const handleBugReport = () => {
    const email = 'harveysanch@gmail.com';
    const subject = 'Reporte de Error - App Agenda';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            App Agenda
          </h1>
          <div className="text-xl text-gray-600">
            Aplicación desarrollada por{' '}
            <span className="text-blue-600 font-semibold">Wilson Sánchez</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* About Section */}
          <div className="mb-10 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <p className="text-gray-700 text-lg">
              Esta aplicación ha sido creada por{' '}
              <button
                onClick={handlePortfolioClick}
                className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
                title="Ver portafolio de Wilson Sánchez"
              >
                Wilson Sánchez
              </button>{' '}
              con el objetivo principal de facilitar y mantener cuentas claras en sus estadísticas de trabajo.
            </p>
          </div>

          {/* Disclaimer Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-red-600 mb-6 pb-3 border-b-2 border-red-200">
              ⚠️ IMPORTANTE - AVISO LEGAL Y DE RESPONSABILIDAD
            </h2>

            <div className="space-y-6">
              {/* Independencia */}
              <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                  Independencia de la Aplicación
                </h3>
                <p className="text-gray-700">
                  Esta aplicación <strong className="text-red-600">NO hace parte ni forma parte</strong> de ningún modo con el estudio, 
                  empresa o persona con la cual usted trabaja. Es una herramienta independiente creada para 
                  asistir en la organización personal de sus estadísticas.
                </p>
              </div>

              {/* Exención */}
              <div className="p-5 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  Exención de Responsabilidad
                </h3>
                <p className="text-gray-700 mb-4">
                  El programador <strong className="text-red-600">queda exento de cualquier disputa, querella, desacuerdo o inconveniente</strong> 
                  entre usted y su estudio o la persona con la que trabaja.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>No se reserva el derecho de intervenir en conflictos laborales o personales</li>
                  <li>No asegura que los números, datos y demás información que aparecen en esta aplicación sean exactos</li>
                  <li>No se responsabiliza por discrepancias entre los datos mostrados y la realidad</li>
                </ul>
              </div>

              {/* Verificación */}
              <div className="p-5 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">
                  Verificación de Datos
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong className="text-red-600">USTED DEBE CORROBORAR PERSONALMENTE</strong> todos los datos mostrados en la aplicación. 
                  Aunque confío plenamente en la precisión del software desarrollado, <strong className="text-red-600">no me hago responsable</strong> 
                  si por un error humano, falla técnica o cualquier otra circunstancia el software presenta información incorrecta.
                </p>
                <div className="p-4 bg-red-100 rounded-lg border-l-4 border-red-500 mt-4">
                  <p className="text-red-800 font-semibold">
                    Además, debe ser muy diligente con el registro de créditos, préstamos y demás datos que se ingresan en la aplicación.
                  </p>
                </div>
              </div>

              {/* Comparación */}
              <div className="p-5 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  Comparación con Facturas Oficiales
                </h3>
                <p className="text-gray-700 mb-4">
                  Si los datos mostrados por este aplicativo <strong className="text-red-600">no coinciden</strong> con los que su jefe, 
                  estudio o empresa le muestra en su factura de pago oficial:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li>Verifique cuidadosamente los datos en el aplicativo</li>
                  <li>Compárelos detalladamente con la factura oficial</li>
                  <li>Revise las páginas y registros que maneje</li>
                  <li>Contacte directamente con su fuente de pago para aclaraciones</li>
                </ol>
              </div>

              {/* Distribución */}
              <div className="p-5 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="text-xl font-semibold text-pink-800 mb-3">
                  Distribución y Uso
                </h3>
                <p className="text-gray-700 mb-4">
                  Este software es de <strong className="text-green-600">distribución gratuita</strong>. Si alguien le está cobrando por su 
                  distribución, instalación o uso, por favor:
                </p>
                <button
                  onClick={handleContactClick}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300 transform hover:scale-[1.02]"
                >
                  ⚠️ Comunicarse inmediatamente con el programador
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              💬 Comentarios y Sugerencias
            </h2>
            <p className="text-gray-700 mb-6">
              Valoro mucho sus comentarios. Puede enviar:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleSuggestionsClick}
                className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="text-2xl mb-2">💡</div>
                <div className="font-semibold">Sugerencias para mejorar</div>
              </button>
              <button
                onClick={() => alert('¡Muchas gracias! Tu felicitación me motiva a seguir mejorando la aplicación.')}
                className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Felicitaciones</div>
              </button>
              <button
                onClick={handleBugReport}
                className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="text-2xl mb-2">🐛</div>
                <div className="font-semibold">Reportar errores</div>
              </button>
            </div>
          </div>

          {/* Closing Section */}
          <div className="mb-10 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-center">
            <p className="text-xl font-semibold mb-4">
              ¡Gracias por usar este aplicativo!
            </p>
            <p className="mb-6 text-lg">
              Espero sinceramente que les sea de gran ayuda en la organización y control de sus estadísticas laborales.
            </p>
            <div className="italic text-indigo-100">
              <p>Atentamente,</p>
              <p className="text-xl font-bold text-yellow-300 mt-2">
                Wilson Sánchez - Desarrollador
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📞 Información de contacto
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-700">Portafolio: </span>
                <button
                  onClick={handlePortfolioClick}
                  className="text-blue-600 hover:text-blue-800 font-medium underline ml-2"
                >
                  wilsonsanchez.vercel.app
                </button>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Correo electrónico: </span>
                <button
                  onClick={handleContactClick}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                >
                  harveysanch@gmail.com
                </button>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">WhatsApp: </span>
                <button
                  onClick={handleWhatsAppClick}
                  className="text-green-600 hover:text-green-800 font-medium ml-2"
                >
                  +57 315 622 6982
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleContactClick}
                className="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar correo
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.897 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                </svg>
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} App Agenda. Todos los derechos reservados.</p>
          <p className="mt-1">Versión 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Programador;