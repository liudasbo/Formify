import Provider from "@/components/provider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "@/lib/i18";
import I18nProvider from "@/components/I18nProvider"; // Įtraukiam naują komponentą

export const metadata = {
  title: "Formify",
  description:
    "A powerful tool for creating custom forms, surveys, and quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <I18nProvider>
          <body className="antialiased">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </I18nProvider>
      </Provider>
    </html>
  );
}
