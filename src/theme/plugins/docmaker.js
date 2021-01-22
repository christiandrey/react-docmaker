const plugin = require('tailwindcss/plugin')

function getSquareUtils(spacing = {}) {
  return Object.keys(spacing).reduce((a, i) => {
    a[`.s-${i}`] = {
      height: spacing[i],
      width: spacing[i]
    }

    return a
  }, {})
}

const textUtils = {
  '.text-title': {
    fontSize: '58px',
    lineHeight: '80px'
  },
  '.text-semi-title': {
    fontSize: '42px',
    lineHeight: '57px'
  },
  '.text-heading-1': {
    fontSize: '32px',
    lineHeight: '42px'
  },
  '.text-heading-2': {
    fontSize: '20px',
    lineHeight: '25px'
  },
  '.text-heading-3': {
    fontSize: '18px',
    lineHeight: '23px'
  },
  '.text-headline': {
    fontSize: '16px',
    lineHeight: '20px'
  },
  '.text-body': {
    fontSize: '14px',
    lineHeight: '18px'
  },
  '.text-subhead': {
    fontSize: '12px',
    lineHeight: '15px'
  },
  '.text-footnote': {
    fontSize: '10px',
    lineHeight: '13px'
  }
}

module.exports = plugin(function ({ addBase, addUtilities, theme }) {
  addBase({
    '*::selection': {
      backgroundColor: 'rgba(50, 111, 243, 0.25)'
    },
    '*:focus, button:focus': {
      outline: 'none'
    },
    body: {
      backgroundColor: theme('colors.background'),
      color: theme('colors.foreground'),
      ...textUtils['.text-body']
    },
    svg: {
      pointerEvents: 'none'
    },
    '.flex-row-reverse': {
      '& > *': { '--space-x-reverse': '1' }
    },
    '.flex-col-reverse': {
      '& > *': { '--space-y-reverse': '1' }
    }
  })

  addUtilities({
    '.will-transform': {
      willChange: 'transform'
    },
    '.cursor-resizing, .cursor-resizing *': {
      cursor: 'ew-resize'
    },
    '.cursor-dragging, .cursor-dragging *': {
      cursor: 'grabbing'
    }
  })

  addUtilities(
    {
      ...textUtils
    },
    {
      variants: ['responsive']
    }
  )

  addUtilities(
    {
      ...getSquareUtils(theme('spacing'))
    },
    {
      variants: ['responsive']
    }
  )
})
