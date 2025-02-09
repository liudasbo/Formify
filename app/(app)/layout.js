import Provider from "@/components/provider";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "@/lib/i18";
import I18nProvider from "@/components/I18nProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
          <body className="antialiased [--header-height:calc(theme(spacing.14))]">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset>{children}</SidebarInset>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </body>
        </I18nProvider>
      </Provider>
    </html>
  );
}
