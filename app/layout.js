import "./globals.css";

export const metadata = {
  title: "Contract Analyzer",
  description: "AI-powered contract review tool"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="max-w-5xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
