const plugin = require('tailwindcss/plugin')

const SEPARATOR = ':'
const UTILS = [
  'backgroundColor',
  'borderColor',
  'boxShadow',
  'divideColor',
  'placeholderColor',
  'textColor',
  'fill',
  'stroke',
  'borderOpacity',
  'opacity',
  'placeholderOpacity',
  'textOpacity'
]

function getVariants(config) {
  return UTILS.reduce((acc, utility) => {
    acc[utility] = [
      'responsive',
      ...config
        .map(({ prefix, variants }) => [
          ...variants,
          ...variants.map(
            (variant) =>
              `${prefix}${variant === 'default' ? '' : SEPARATOR + variant}`
          )
        ])
        .reduce((acc, curr) => [...acc, ...curr], [])
    ]
    return acc
  }, {})
}

function getColorVariantPlugin(config) {
  return plugin(({ addVariant, e }) => {
    config.forEach(({ prefix, themeSelector, variants }) => {
      variants.forEach((variant) => {
        const pseudo = variant === 'default' ? '' : SEPARATOR + variant
        addVariant(`${prefix}${pseudo}`, ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `${themeSelector} .${e(
              `${prefix}${pseudo}${separator}${className}`
            )}${pseudo}`
          })
        })
      })
    })
  })
}

function getColorVariants(config = []) {
  return [getColorVariantPlugin(config), getVariants(config)]
}

function getDynamicColors() {
  return {
    ...['foreground', 'background'].reduce((a, v) => {
      a[v] = `var(--color-${v})`
      return a
    }, {})
  }
}

module.exports = { getColorVariants, getDynamicColors }
