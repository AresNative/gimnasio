"use client";
import MainForm from "@/components/form/main-form";
import Footer from "@/template/footer";
import { LogInField } from "@/utils/constants/forms/logIn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "@/hooks/store";
import { loginUser } from "@/hooks/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/selector";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // ✅ Accedemos al estado de auth
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleLogin = async (_: any, formData: any) => {
    const { email, password } = formData;
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      // ✅ Login correcto
      router.push("/dashboard");
    }
  };

  return (
    <>
      <article className="flex flex-col items-center min-h-screen">
        <section className="max-w-md w-full mx-auto my-10 p-6 border bg-[var(--background)] border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Iniciar Sesión
          </h1>

          <MainForm
            actionType="post-login"
            dataForm={LogInField()}
            message_button={loading ? "Ingresando..." : "Ingresar"}
            onSuccess={handleLogin}
          />

          {error && (
            <p className="mt-3 text-center text-sm text-red-500">{error}</p>
          )}
        </section>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-200">
            ¿No tienes cuenta?
            <Link
              href="/register"
              className="ml-1 underline text-red-600 hover:text-red-800"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </article>

      <Footer />
    </>
  );
}
