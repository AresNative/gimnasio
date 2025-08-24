"use client";
import MainForm from "@/components/form/main-form";
import Footer from "@/template/footer";
import { LogInField } from "@/utils/constants/forms/logIn";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/*  <UserRoleRenderer user={user} admin={admin} fallback={children} /> */}
      <article className="flex flex-col items-center  min-h-screen">
        <section className="max-w-md w-full mx-auto my-10 p-6 border bg-[var(--background)] border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <MainForm
            actionType="post-login"
            dataForm={LogInField()}
            message_button="Iniciar Sesión"
            onSuccess={() => {

            }}
          />
        </section>
        <div><label className="text-gray-600 dark:text-gray-200">¿No tienes cuenta?</label><Link className="underline text-red-600" href="register"> Registrar</Link></div>
      </article>
      <Footer />
    </>
  );
}