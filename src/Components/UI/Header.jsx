import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Menggunakan Lucide React untuk ikon

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-4 bg-white shadow-md font-montreal">
            {/* Bagian Kiri: Logo dan Link */}
            <div className="flex items-center gap-4">
                <img src="/src/assets/logo.png" alt="Logo" className="w-10 h-10" />
                <a
                    href="https://discord.gg/withsuli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-blue-500 text-[12px] md:text-[16px]"
                >
                    Discord.gg/withsuli
                </a>
            </div>

            {/* Bagian Kanan: Navigasi */}
            <div className="flex items-center  md:gap-8">
                {/* Tombol Join Whitelist */}
                <div className="hidden sm:flex gap-5">
                    <span className="font-[300] text-[12px] md:text-[16px] cursor-pointer" onClick={() => navigate('/calculator')}>
                        Future Calculator
                    </span>
                    <span className="font-[300] text-[12px] md:text-[16px] cursor-pointer" onClick={() =>  navigate('/')}>
                        Economic Calendar
                    </span>
                </div>
                <button
                    className="border border-gray-400 px-5 py-2 rounded-full text-[12px] hover:bg-gray-200 md:text-[16px]"
                    onClick={() => window.open("https://tradewithsuli.com/#list", "_blank")}
                >
                    Join Whitelist
                </button>

                {/* Tombol Hamburger (Hanya muncul di mobile) */}
                <button
                    className="sm:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Menu Dropdown untuk Mobile */}
                {isMenuOpen && (
                    <div className="absolute top-16 right-6 bg-white shadow-md rounded-lg py-2 w-48 flex flex-col">
                        <span className="px-4 py-2 text-[14px] hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/calculator')}>
                            Future Calculator
                        </span>
                        <span className="px-4 py-2 text-[14px] hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/')}>
                            Economic Calendar
                        </span>
                    </div>
                )}

                {/* Menu Desktop */}
            </div>
        </header>
    );
};

export default Header;
