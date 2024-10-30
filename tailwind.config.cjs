/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const { boxShadow } = require('tailwindcss/defaultTheme')
const { screens } = require('tailwindcss/defaultTheme')
const { backgroundImage } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      ...colors,
      // Replace deprecated color names
      lightBlue: 'sky',
      warmGray: 'stone',
      trueGray: 'neutral',
      coolGray: 'gray',
      blueGray: 'slate',
      primary: {
        'blue-base': '#1f90ff',
        'blue-light': '#deedff',
        'grey-lighten-1': '#adb2b6',
        'grey-lighten-4': '#fcfcfd',
        'black-base': '#040a1a',
        'grey-lighten-2': '#fafafa',
        blue: {
          100: '#034CC7',
          200: '#0066AB',
        },
      },
      secondary: {
        'blue-base': '#275be5',
      },
      /* Text colors */
      color: {
        'grey-dark': '#34363A',
        'grey-lighten': '#ADB2B6',
        'grey-base': '#6c7175',
        'grey-lighten-1': '#34363a',
        'dopdown-avatar': 'rgba(255,255,255,0.60)',
        'form-input': 'rgba(0,0,0,.87)',
      },
      accent: {
        'light-grey-200': '#f6f6f6',
        'dropdown-avatar': 'rgba(255,255,255,0.12)',
        'light-grey-100': '#dfe4ea',
      },
      feedback: {
        error: '#DD3819',
        info: '#FF8200',
        'info-base': '#2196f3',
        success: '#4CAF50',
        warning: '#FB8C06',
      },
      hover: {
        'dropdown-avatar': '#e5e7eb',
        'dropdown-option': '#e5e7eb',
      },
      active: {
        'dropdown-avatar': 'rgba(255,255,255,0.24)',
      },
      background: '#f5f7fa',
    },
    fontFamily: {
      sans: ['Sofia Pro'],
    },
    boxShadow: {
      ...boxShadow,
      dropdown: '0px 5px 5px 0px rgba(0, 0, 0, 0.20)',
      cards: '0 20px 40px -20px rgb(0, 0, 0)',
      'input-fees': '0 1px 2px -1px rgba(4, 10, 26, 0.2)',
      'dropdown-fees':
        '0px 5px 5px -3px rgba(0,0,0,.1), 0px 8px 10px 1px rgba(0,0,0,.07), 0px 3px 14px 2px rgba(0,0,0,.12);',
      'dropdown-taps':
        '0px 5px 5px -3px rgba(0,0,0,.1),0px 8px 10px 1px rgba(0,0,0,.07),0px 3px 14px 2px rgba(0,0,0,.12)',
      'form-button':
        '0px 3px 1px -2px rgba(0,0,0,.1),0px 2px 2px 0px rgba(0,0,0,.07),0px 1px 5px 0px rgba(0,0,0,.12)',
      'card-detail':
        '0px 2px 1px -1px rgba(0,0,0,.1), 0px 1px 1px 0px rgba(0,0,0,.07), 0px 1px 3px 0px rgba(0,0,0,.12)',
      'compare-menu':
        '0 6px 16px -8px rgba(4, 10, 26, 0.1), inset -1px 0 0 0 #f5f7fa',
      'dropdown-menu':
        '0px 3px 1px -2px rgba(0, 0, 0, .1), 0px 2px 2px 0px rgba(0, 0, 0, .07), 0px 1px 5px 0px rgba(0, 0, 0, .12);',
      'pricing-card':
        '0px 0px 0px 0px rgba(0, 0, 0, .1), 0px 0px 0px 0px rgba(0, 0, 0, .07), 0px 0px 0px 0px rgba(0, 0, 0, .12)',
      'pricing-menu':
        '0px 5px 5px -3px rgba(0, 0, 0, .1), 0px 8px 10px 1px rgba(0, 0, 0, .07), 0px 3px 14px 2px rgba(0, 0, 0, .12);',
    },
    backgroundImage: {
      ...backgroundImage,
      'gradient-quick-calc':
        'linear-gradient(228.84deg, #2F2D42 4.45%, #004C93 65.04%)',
      'gradient-quick-seller-net-sheet':
        'linear-gradient(228.84deg, #21363A 4.45%, #047790 65.04%)',
      'gradient-quick-buyers-estimate':
        'linear-gradient(228.84deg, #2F2D42 4.45%, #462D8B 65.04%)',
      'gradient-title-calculator':
        'linear-gradient(228.84deg, #2F2D42 4.45%, #003668 65.04%)',
      'gradient-net-sheet':
        'linear-gradient(228.84deg, #21363A 4.45%, #045162 65.04%)',
      'gradient-estimate':
        'linear-gradient(228.84deg, #2F2D42 4.45%, #312062 65.04%)',
      'gradient-settings':
        'linear-gradient(228.84deg, rgba(69, 68, 83, 0.82) 4.45%, #030919 98.26%)',
      'gradient-quickcalc-divider':
        'linear-gradient(228.84deg, #2BFFD9, #3CC4FF)',
      'gradient-quicknetsheet-divider':
        'linear-gradient(231.87deg, #FCFF6A -25.08%, #5FCFBB, #5FCFBB, #5FCFBB)',
      'gradient-quickestimate-divider':
        'linear-gradient(228.84deg, #FF82BE 4.45%, #6C38AF 65.04%)',
      'gradient-titlecalculator-divider':
        'linear-gradient(228.84deg, #3C9EFF, #0763BE)',
      'gradient-netsheet-divider':
        'linear-gradient(228.84deg, #83FFFF 4.45%, #1F8383 65.04%)',
      'gradient-estimate-divider':
        'linear-gradient(228.84deg, #AA6CFA 4.45%, #6538AF 65.04%);',
      'gradient-settings-divider':
        'linear-gradient(228.84deg, rgba(69, 68, 83, 0.82) 4.45%, #030919 98.26%)',
      'gradient-banner':
        'linear-gradient(to bottom, rgba(4, 10, 26, 0.69),rgba(4, 10, 26, 0.68) 9%,rgba(4, 10, 26, 0.65) 18%,rgba(4, 10, 26, 0.6) 25%,rgba(4, 10, 26, 0.55) 32%,rgba(4, 10, 26, 0.49) 38%,rgba(4, 10, 26, 0.42) 44%,rgba(4, 10, 26, 0.35) 49%,rgba(4, 10, 26, 0.28) 55%,rgba(4, 10, 26, 0.21) 61%,rgba(4, 10, 26, 0.15) 67%,rgba(4, 10, 26, 0.09) 74%,rgba(4, 10, 26, 0.05) 82%,rgba(4, 10, 26, 0.02) 90%,rgba(4, 10, 26, 0))',
    },
    variants: {
      extend: {
        display: ['group-hover'],
      },
    },
    screens: {
      ...screens,
      tablet: '960px',
      mobile: '600px',
      'tablet-md': '632px',
      'tablet-mini': '600px',
      'tablet-lg': '1080px',
      'mobile-md': '460px',
    },
    extend: {
      keyframes: {
        loadingAnimation: {
          '0%': { left: '-100%', width: '100%' },
          '50%': { left: '0', width: '100%' },
          '100%': { left: '100%', width: '100%' },
        },
      },
      animation: {
        loadingAnimation: 'loadingAnimation 2s infinite',
      },
    },
  },

  plugins: [],
}
