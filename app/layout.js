import { Inter } from 'next/font/google';
import "./globals.css";
import LiquidBlob from "./components/GlobalLiquid";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});
export const metadata = {
  title: "Liquid App",
  description: "Global liquid hover ripple",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-black text-white min-h-screen">
        {children}
        <LiquidBlob />
      </body>
    </html>
  );
}