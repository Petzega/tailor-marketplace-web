// components/shared/terms-content.tsx
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

                {/* 👇 Recuadro de Adelantos actualizado al tema Azul */}
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-blue-800 my-5">
                    <h4 className="font-bold text-blue-900 mb-3 text-sm sm:text-base">Políticas de Adelanto por Volumen de Compra:</h4>
                    <p className="mb-3 text-sm">Para garantizar la seriedad de los pedidos que involucran montos mayores, aplicamos el siguiente esquema de adelantos:</p>
                    <ul className="list-disc pl-5 text-sm space-y-2 mb-3">
                        <li><strong>Compras hasta S/ 100.00:</strong> No requieren adelanto del valor de los productos.</li>
                        <li><strong>Compras mayores a S/ 100.00:</strong> Se solicitará un adelanto del <strong>25%</strong> del valor total del pedido.</li>
                        <li><strong>Compras de S/ 200.00 en adelante:</strong> Se solicitará un adelanto del <strong>50%</strong> del valor total del pedido.</li>
                    </ul>
                    <p className="text-xs font-medium text-blue-600/80 italic mt-3">
                        * Estos adelantos serán reembolsados en su totalidad única y exclusivamente en caso de que el cliente decida desistir de la compra antes de la entrega o inicio del servicio.
                    </p>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">4. Envíos y Entregas</h3>
                {/* 👇 Recuadro de Cobertura con tema Azul */}
                <p className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                    <strong>Cobertura de envío:</strong> Actualmente, nuestros servicios de delivery y envíos operan de manera exclusiva en la ciudad de <strong>Iquitos, Perú</strong>. La posibilidad de realizar envíos a nivel nacional se encuentra en evaluación y esperamos habilitarla en el futuro para llegar a más destinos.
                </p>
                <ul className="list-disc pl-5 space-y-4 mb-4">
                    <li>
                        <strong>Retiro en Tienda:</strong> Totalmente gratuito. Se coordinará el día y hora de recojo mediante WhatsApp.
                    </li>
                    <li>
                        <strong>Delivery en Iquitos (Modalidad Contra Entrega):</strong> Para brindarle la mayor seguridad y confianza, el pago del valor de sus productos se realizará <strong>contra entrega</strong> (usted paga al momento de tener el producto en sus manos).

                        {/* 👇 Excepción convertida a un recuadro Azul para que no pase desapercibida */}
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-sm">
                            <span className="font-bold">Excepción importante:</span> El costo logístico de envío local (<strong>S/ 10.00</strong>) deberá ser abonado <strong>por adelantado</strong> obligatoriamente. Esto nos permite programar y asegurar la ruta del despachador de manera eficiente.
                        </div>
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">5. Cambios y Devoluciones</h3>
                <p className="mb-4">
                    <strong>Para prendas de catálogo (Ready-to-wear):</strong> En Stitch & Style <strong>no realizamos devoluciones de dinero</strong>. Únicamente se aceptan solicitudes de cambio de talla o modelo dentro de los primeros <strong>7 días calendario</strong> posteriores a la recepción de su pedido.
                </p>

                <p className="mb-4">
                    Todo cambio está sujeto a la evaluación de nuestro asesor de ventas. La prenda debe cumplir con los requisitos obligatorios: estar sin uso, sin lavar, en perfectas condiciones y con sus etiquetas originales intactas. Si el producto es aprobado, podrá canjearse por una prenda del mismo valor o utilizarse como parte de pago para un producto de mayor precio. <strong>El costo del delivery original no es reembolsable bajo ninguna circunstancia</strong>, y cualquier nuevo gasto logístico de envío generado por el cambio dentro de Iquitos deberá ser asumido por el cliente.
                </p>

                <p className="mb-4">
                    <strong>Para servicios de sastrería a medida:</strong> Debido a la naturaleza altamente personalizada del servicio, no se aceptan devoluciones de dinero ni cambios una vez cortada la tela o iniciado el trabajo. Se realizarán las pruebas y ajustes necesarios, detallados en el presupuesto inicial, hasta lograr la conformidad del cliente.
                </p>
            </section>
        </div>
    );
}