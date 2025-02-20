import React from "react";
const Header = () => {
    return (
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-4 bg-white shadow-md">
            {/* Bagian Kiri: Logo dan Link */}
            <div className="flex items-center gap-4">
                <img src="/src/assets/logo.png" alt="Logo" className="w-10 h-10" />
                <a
                    href="https://discord.gg/withsuli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 font-semibold hover:text-blue-500 text-base md:text-lg"
                >
                    Discord.gg/withsuli
                </a>
            </div>

            {/* Bagian Kanan: Navigasi */}
            <div className="flex items-center gap-5 md:gap-8">
                <span className="text-gray-600 font-medium text-base md:text-lg hidden sm:block">
                    Economic Calendar
                </span>
                <button className="border border-gray-400 px-5 py-2 rounded-full text-gray-700 hover:bg-gray-200 text-base md:text-lg" onClick={() => window.open("https://tradewithsuli.com/#list", "_blank")}>
                    Join Whitelist
                </button>
            </div>
        </header>
    );
};

export default Header;