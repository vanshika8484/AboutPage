import "./globals.css";
import GlobalLiquidHover from "../app/components/GlobalLiquid";

export const metadata = {
  title: "Liquid App",
  description: "Global liquid hover ripple",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
        <GlobalLiquidHover />
      </body>
    </html>
  );
}