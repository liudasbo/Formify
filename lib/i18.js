"use client";
import i18n, { t } from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      logOut: "Log Out",
      logIn: "Log In",
      email: "Email",
      password: "Password",
      invalidEmail: "Invalid email",
      passwordRequired: "Password is required",
      pleaseWait: "Please wait",
      signUp: "Sign Up",
      name: "Name",
      loginForm: {
        title: "Welcome back",
        description: "Log in to your account to continue",
        invalidCredentials: "Invalid email or password",
        dontHaveAccount: "Don't have an account?",
      },

      signUpForm: {
        description: "Sign up to access all the features of the app",
        nameRequired: "Name is required",
        longName: "Name is too long",
        sameEmail: "User with this email already exists",
        haveAccount: "Already have an account?",
      },

      // Theme
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  lt: {
    translation: {
      logOut: "Atsijungti",
      logIn: "Prisijungti",
      email: "El. paštas",
      password: "Slaptažodis",
      invalidEmail: "Neteisingas el. paštas",
      passwordRequired: "Slaptažodis yra privalomas",
      pleaseWait: "Prašome palaukti",
      signUp: "Registruotis",
      name: "Vardas",
      loginForm: {
        title: "Sveiki sugrįžę",
        description: "Prisijunkite prie savo paskyros, kad galėtumėte tęsti",
        invalidCredentials: "Neteisingas el. paštas arba slaptažodis",
        dontHaveAccount: "Neturite paskyros?",
      },

      signUpForm: {
        description:
          "Registruokitės, kad galėtumėte naudotis visomis programėlės funkcijomis",
        nameRequired: "Vardas yra privalomas",
        longName: "Vardas per ilgas",
        sameEmail: "Vartotojas su šiuo el. paštu jau egzistuoja",
        haveAccount: "Jau turite paskyrą?",
      },

      // Theme
      light: "Šviesus",
      dark: "Tamsus",
      system: "Sistema",
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
