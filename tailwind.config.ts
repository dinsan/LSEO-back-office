import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1c2333", soft: "#5b6478", faint: "#8b93a5" },
        canvas: "#f2f4f7",
        line: "#dde1e8",
        brand: { DEFAULT: "#0e7c66", dark: "#0a5f4e", tint: "#e3f3ef" },
        danger: { DEFAULT: "#b42318", tint: "#fdeceb" },
      },
      borderRadius: { DEFAULT: "6px" },
    },
  },
  plugins: [],
};
export default config;
