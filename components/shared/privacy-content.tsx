// components/shared/privacy-content.tsx
import React from "react";

export function PrivacyContent() {
    return (
        <div className="space-y-8 sm:space-y-10 text-gray-600 text-sm sm:text-base leading-relaxed">
            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Generalidades</h3>
                <p className="mb-4">
                    En <strong>Stitch & Style</strong>, valoramos y respetamos tu privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, protegemos y compartimos tu información personal cuando visitas nuestro sitio web y utilizas nuestros servicios. Al navegar por nuestro catálogo y comunicarte con nosotros vía WhatsApp, aceptas las prácticas descritas en este documento.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Información que recopilamos</h3>
                <p className="mb-4">
                    Dado nuestro modelo de atención personalizada, recopilamos información de dos maneras:
                </p>
                <ul className="list-disc pl-5 space-y-4 mb-4">
                    <li>
                        <strong>Información proporcionada directamente por ti:</strong> Cuando decides finalizar un pedido, te redirigimos a WhatsApp. Es allí donde te solicitaremos datos estrictamente necesarios para procesar tu compra, tales como: nombre completo, número de teléfono, dirección de entrega (en Iquitos) y referencias para el envío.
                    </li>
                    <li>
                        <strong>Información de navegación (Cookies):</strong> Nuestro sitio web puede recopilar datos técnicos básicos (como tipo de navegador, tiempo de visita y páginas vistas) para mejorar tu experiencia de usuario y optimizar nuestro catálogo. Esta información es anónima y no te identifica personalmente.
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. ¿Cómo utilizamos tu información?</h3>
                <p className="mb-4">Los datos que nos proporcionas se utilizan única y exclusivamente para los siguientes fines:</p>
                <ul className="list-disc pl-5 space-y-3 mb-4">
                    <li>Procesar, confirmar y enviar tus pedidos de prendas o servicios de sastrería.</li>
                    <li>Coordinar los detalles del delivery o el recojo en tienda.</li>
                    <li>Enviarte actualizaciones sobre el estado de tu pedido.</li>
                    <li>Atender tus consultas, reclamos o solicitudes de cambio de prendas.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">4. Protección de Datos Financieros</h3>
                <div className="bg-blue-50 p-5 sm:p-6 rounded-2xl border border-blue-100 text-blue-800 my-6 shadow-sm">
                    <p>
                        Para garantizar tu máxima seguridad, <strong>Stitch & Style no solicita, procesa ni almacena datos de tarjetas de crédito o débito a través de este sitio web</strong>. Todos los pagos se realizan de manera externa mediante transferencias bancarias (BCP, Interbank, BBVA), billeteras digitales (Yape, Plin) o pago en efectivo contra entrega.
                    </p>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">5. Compartir tu información</h3>
                <p className="mb-4">
                    Tu privacidad es fundamental para nosotros. <strong>No vendemos, alquilamos ni comercializamos tu información personal a terceros.</strong> Solo compartiremos los datos estrictamente necesarios (nombre, dirección y teléfono) con nuestro personal logístico interno o motorizados de confianza con el único propósito de concretar la entrega de tu pedido.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">6. Tus Derechos (Derechos ARCO)</h3>
                <p className="mb-4">
                    De acuerdo con la legislación peruana, tienes derecho a ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) sobre tus datos personales. Si deseas actualizar tu información de envío, corregir algún dato o solicitar que eliminemos tu historial de chat y pedidos de nuestra base de datos, puedes comunicarte directamente con nuestro equipo de atención al cliente a través de nuestro canal oficial de WhatsApp.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">7. Cambios en la Política de Privacidad</h3>
                <p className="mb-4">
                    Nos reservamos el derecho de actualizar o modificar esta política en cualquier momento para reflejar cambios en nuestras prácticas operativas o exigencias legales. Te recomendamos revisar esta página periódicamente.
                </p>
            </section>
        </div>
    );
}