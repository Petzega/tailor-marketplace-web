// components/layout/terms-content.tsx
import React from "react";

export function TermsContent() {
    return (
        <div className="space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1. Generalidades</h3>
                <p className="mb-4">
                    Bienvenido a Stitch & Style. Al realizar un pedido a través de nuestro sitio web y confirmarlo vía WhatsApp, usted acepta estar sujeto a los siguientes términos y condiciones.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">2. Proceso de Compra</h3>
                <p className="mb-4">
                    Nuestro sitio web funciona como un catálogo digital. Los pedidos se procesan y finalizan exclusivamente a través de WhatsApp. El stock mostrado en la web es referencial; la disponibilidad final se confirmará al momento de coordinar por chat.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">3. Políticas de Pago y Seguridad</h3>
                <p className="mb-4">
                    Por la seguridad de nuestros clientes, <strong>no solicitamos, ni procesamos pagos con tarjetas de crédito o débito a través de la web</strong>. Los únicos métodos de pago aceptados son transferencias bancarias (BCP, Interbank, BBVA), billeteras digitales (Yape, Plin) y pago en efectivo.
                </p>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 my-5">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Políticas de Adelanto por Volumen de Compra:</h4>
                    <p className="mb-3 text-sm">Para garantizar la seriedad de los pedidos que involucran montos mayores, aplicamos el siguiente esquema de adelantos:</p>
                    <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700 mb-3">
                        <li><strong>Compras hasta S/ 100.00:</strong> No requieren adelanto del valor de los productos.</li>
                        <li><strong>Compras mayores a S/ 100.00:</strong> Se solicitará un adelanto del <strong>25%</strong> del valor total del pedido.</li>
                        <li><strong>Compras de S/ 200.00 en adelante:</strong> Se solicitará un adelanto del <strong>50%</strong> del valor total del pedido.</li>
                    </ul>
                    <p className="text-xs font-medium text-gray-500 italic mt-3">
                        * Estos adelantos serán reembolsados en su totalidad única y exclusivamente en caso de que el cliente decida desistir de la compra antes de la entrega o inicio del servicio.
                    </p>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">4. Envíos y Entregas</h3>
                <ul className="list-disc pl-5 space-y-4 mb-4">
                    <li>
                        <strong>Retiro en Tienda:</strong> Totalmente gratuito. Se coordinará el día y hora de recojo por WhatsApp.
                    </li>
                    <li>
                        <strong>Delivery (Modalidad Contra Entrega):</strong> Para brindarle la mayor seguridad y confianza, el pago del valor de sus productos se realizará <strong>contra entrega</strong> (usted paga al momento de tener el producto en sus manos).
                        <br /><br />
                        <span className="italic font-medium">Excepción importante:</span> El costo logístico de envío (<strong>S/ 10.00</strong>) deberá ser abonado <strong>por adelantado</strong> obligatoriamente. Esto nos permite programar y asegurar la ruta del despachador de manera eficiente.
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">5. Cambios y Devoluciones</h3>
                <p className="mb-4">
                    <strong>Para prendas listas para usar (Ready-to-wear):</strong> En Stitch & Style <strong>no realizamos devoluciones de dinero</strong>. Únicamente se aceptan solicitudes de cambio físico dentro de los primeros <strong>3 días calendario</strong> posteriores a la recepción de su pedido.
                </p>

                <p className="mb-4">
                    Todo cambio está sujeto a una rigurosa evaluación por parte de nuestro asesor de ventas, quien verificará que la prenda cumpla con los requisitos obligatorios: estar sin uso, sin lavar, en perfectas condiciones y con sus etiquetas originales intactas. Si el producto es aprobado para cambio, este podrá canjearse por una prenda del mismo valor o utilizarse como parte de pago para un producto de mayor precio. <strong>Queda expresa constancia de que el costo del delivery original no es reembolsable bajo ninguna circunstancia</strong>, y cualquier nuevo gasto logístico de envío generado por el cambio deberá ser asumido íntegramente por el cliente.
                </p>

                <p className="mb-4">
                    <strong>Para servicios de sastrería a medida:</strong> Debido a la naturaleza altamente personalizada del servicio, no se aceptan devoluciones de dinero ni cambios una vez cortada la tela o iniciado el trabajo. Se realizarán las pruebas y ajustes necesarios, detallados en el presupuesto inicial, hasta lograr la conformidad del cliente.
                </p>
            </section>
        </div>
    );
}