"use client";

import { useState } from "react";
/* import { QrReader } from "react-qr-reader"; */
import Footer from "@/template/footer";
import Link from "next/link";

export default function QrScannerPage() {
    const [data, setData] = useState<string>("No se ha escaneado nada aún");

    return (
        <>
            <article className="flex flex-col items-center min-h-screen">
                <section className="max-w-md w-full mx-auto my-10 p-6 border bg-[var(--background)] border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                    <h1 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
                        Escanear Código QR
                    </h1>

                    {/* <div className="w-full h-64 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 mb-4">
                        <QrReader
                            constraints={{ facingMode: "environment" }}
                            onResult={(result, error) => {
                                if (!!result) {
                                    setData(result.getText());
                                }
                                if (!!error) {
                                    // opcional: console.error(error);
                                }
                            }}
                            containerStyle={{ width: "100%", height: "100%" }}
                            videoStyle={{ objectFit: "cover" }}
                        />
                    </div> */}

                    <p className="text-center text-gray-700 dark:text-gray-300">
                        {data}
                    </p>
                </section>

                <div>
                    <label className="text-gray-600 dark:text-gray-200">
                        ¿Quieres volver?
                    </label>
                    <Link className="underline text-red-600 ml-2" href="/">
                        Ir al inicio
                    </Link>
                </div>
            </article>
            <Footer />
        </>
    );
}
