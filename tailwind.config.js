const docmakerPlugin = require('./src/theme/plugins/docmaker')
const colors = require('./src/theme/data/colors')
const { getDynamicColors } = require('./src/theme/plugins/color-variants')

const borderRadius = {
  none: '0',
  sm: '3px',
  default: '5px',
  lg: '10px',
  xlg: '20px',
  full: '9999em'
}

const boxShadow = {
  none: 'none',
  inset: 'inset 0 0 0 1px rgba(103, 126, 138, 0.25)',
  link: 'inset 0 -4px 0 rgba(103, 126, 138, 0.25)',
  outline: '0 0 0 4px rgba(103, 126, 138, 0.125)',
  1: '0 0 1px rgba(7, 11, 15, 0.05), 0 1px 2px rgba(7, 11, 15, 0.075)'
}

boxShadow[2] = `${boxShadow[1]}, 0 2px 8px rgba(7, 11, 15, 0.1)`
boxShadow[3] = `${boxShadow[2]}, 0 4px 16px rgba(7, 11, 15, 0.125)`
boxShadow[4] = `${boxShadow[3]}, 0 8px 32px rgba(7, 11, 15, 0.1375)`
boxShadow[5] = `${boxShadow[4]}, 0 16px 64px rgba(7, 11, 15, 0.25)`
boxShadow[6] = `0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07)`

const fontFamily = {
  sans: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif'
  ],
  mono: [
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'Courier',
    'Monaco',
    'monospace'
  ]
}

const opacity = {
  0: '0',
  10: '0.1',
  25: '0.25',
  33: '0.33',
  50: '0.5',
  66: '0.66',
  75: '0.75',
  99: '0.99',
  100: '1'
}

const spacing = {
  px: '1px',
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  6: '6px',
  8: '8px',
  10: '10px',
  12: '12px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  36: '36px',
  40: '40px',
  48: '48px',
  56: '56px',
  60: '60px',
  64: '64px',
  80: '80px',
  120: '120px',
  144: '144px',
  150: '150px',
  160: '160px',
  180: '180px',
  200: '200px',
  240: '240px',
  272: '272px',
  296: '296px',
  320: '320px',
  360: '360px',
  380: '380px',
  480: '480px',
  600: '600px',
  640: '640px'
}

const timing = {
  75: '75ms',
  125: '125ms',
  250: '250ms',
  500: '500ms',
  750: '750ms',
  1000: '1000ms'
}

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.ts',
      './src/**/*.tsx',
      './public/index.html'
    ]
  },
  corePlugins: {
    fontSize: false,
    lineHeight: false,
    letterSpacing: false
  },
  plugins: [docmakerPlugin],
  variants: {
    // ...colorVariants,
    textColor: ({ after }) => after(['focus-within']),
    borderColor: ({ after }) => after(['focus-within'])
  },
  theme: {
    borderRadius,
    boxShadow,
    colors: {
      ...colors,
      ...getDynamicColors()
    },
    fontFamily,
    opacity,
    spacing,
    transitionDelay: timing,
    transitionDuration: timing,
    zIndex: {
      beneath: -10,
      0: 0,
      1: 10,
      2: 20,
      3: 30,
      4: 40,
      5: 50
    },
    transitionTimingFunction: {
      default: 'ease',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
    },

    extend: {
      screens: {
        sm: '480px',
        print: { raw: 'print' },
        retina: {
          raw:
            'only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)'
        }
      }
    }
  }
}
