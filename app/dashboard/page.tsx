"use client";
import Footer from "@/template/footer";
import { useRouter } from "next/navigation";
import { RootState } from "@/hooks/store";
import { useAppDispatch } from "@/hooks/selector";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <>
            <article className="flex flex-col items-center min-h-screen">

            </article>

            <Footer />
        </>
    );
}
