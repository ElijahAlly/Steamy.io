import { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './providers/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{scss,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;