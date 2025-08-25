"use client";
import { cn } from '@/utils/functions/cn';
import AppMenu from './menu';
import { ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SwitchToggle } from '@/components/switch-mode';

interface HeaderProps {
    title: string;
    showMenuButton?: boolean;
    showBackButton?: boolean;
    className?: string;
    defaultBack?: string;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showMenuButton = true,
    showBackButton = false,
    className = '',
    defaultBack = '/'
}) => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false); // Estado interno

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        // Solo añade el event listener en el cliente
        window.addEventListener('scroll', handleScroll);

        // Comprueba el scroll inicial
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <header
            className={cn(
                `sticky top-0 z-40 transition-all duration-300 safe-area-top`,
                showBackButton || isScrolled
                && 'bg-[var(--background)]/30 border-b border-gray-200 dark:border-gray-700',
                className
            )}
            aria-label="Cabecera principal"
        >
            <section className="p-2 flex items-center justify-between">
                <ul className="flex items-center gap-2  backdrop-blur-lg">
                    {showBackButton && (
                        <button
                            onClick={() => router.push(defaultBack)}
                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            aria-label="Volver atrás"
                        >
                            <ArrowLeft
                                className={cn(
                                    "h-6 w-6",
                                    isScrolled ? "text-red-700" : "text-white"
                                )}
                            />
                        </button>
                    )}

                    <h1
                        className={cn(
                            "tracking-tight truncate pb-2 pt-0 font-bold",
                            showBackButton ?? "text-center m-auto", isScrolled ? "text-red-700 text-2xl" : "text-red-700 text-5xl",
                        )}
                        aria-level={1}
                    >
                        <img src="/favicon.svg" alt="Logo" className={cn(showBackButton ? "size-35" : "size-10", " inline-block mr-2")} /> Valle Fit
                    </h1>
                </ul>

                <div className={cn("flex items-center")}>
                    <SwitchToggle />
                    {showMenuButton && <AppMenu isScrolled={isScrolled} />}
                </div>
            </section>
        </header >
    );
};

export default Header;