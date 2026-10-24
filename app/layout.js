import "./globals.css";

export const metadata = {
  title: "FlowSentry — AI Integration Failure Investigator",
  description:
    "AI integration failure investigator powered directly by Google Hosted Gemma API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0F19] text-gray-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
