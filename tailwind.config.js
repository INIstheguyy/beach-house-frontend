/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#E6F0F5',
  				'100': '#CCE1EB',
  				'200': '#99C3D7',
  				'300': '#66A5C3',
  				'400': '#3387AF',
  				'500': '#0A4D68',
  				'600': '#083D53',
  				'700': '#062E3E',
  				'800': '#041E29',
  				'900': '#020F14',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#FEF7F1',
  				'100': '#FDEEE3',
  				'200': '#FBDDC7',
  				'300': '#F9CCAB',
  				'400': '#F7BB8F',
  				'500': '#F4A261',
  				'600': '#F18A3D',
  				'700': '#E06417',
  				'800': '#B44F12',
  				'900': '#873B0D',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#FCF1EE',
  				'100': '#F9E3DD',
  				'200': '#F3C7BB',
  				'300': '#EDAB99',
  				'400': '#E78F77',
  				'500': '#E76F51',
  				'600': '#E04A27',
  				'700': '#B6381C',
  				'800': '#892A15',
  				'900': '#5C1C0E',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}