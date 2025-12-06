import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Status-Farben
        'status-normal': '#10B981',
        'status-warning': '#F59E0B',
        'status-critical': '#EF4444',
        'status-info': '#3B82F6',

        // Encounter-Typ-Farben
        'encounter-inpatient': '#8B5CF6',
        'encounter-outpatient': '#06B6D4',
        'encounter-lab': '#F97316',
        'encounter-imaging': '#EC4899',

        // UI
        'card-bg': '#FFFFFF',
        'card-border': '#E5E7EB',
        'section-bg': '#F9FAFB',
      },
    },
  },
  plugins: [],
};
export default config;
