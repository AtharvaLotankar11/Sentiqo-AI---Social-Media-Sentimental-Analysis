const config = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6366F1",
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
        },
        secondary: {
          light: "#4ADE80",
          DEFAULT: "#22C55E",
          dark: "#16A34A",
        },
        accent: {
          light: "#FBBF24",
          DEFAULT: "#F59E0B",
          dark: "#D97706",
        },
        positive: "#22C55E",
        negative: "#EF4444",
        neutral: "#6B7280",
        dark: "#111827",
        light: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      spacing: {
        '0': '0',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
      borderRadius: {
        '8': '8px',
      }
    },
  },
  plugins: [],
};

export default config;
