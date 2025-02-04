import "./globals.css";

export const metadata = {
  title: "Formify",
  description:
    "A powerful tool for creating custom forms, surveys, and quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
