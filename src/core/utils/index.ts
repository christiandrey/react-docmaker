import formatRelative from 'date-fns/formatRelative'

export type ImageDimensions = {
  width: number
  height: number
}

// ----------------------------------------------------------------
// UTILITY
// ----------------------------------------------------------------

export function nil<T>(value: T): boolean {
  return typeof value === 'undefined' || value === null
}

export function notNil<T>(value: T): boolean {
  return !nil(value)
}

export function getImageSizeAsync(url: string): Promise<ImageDimensions> {
  if (!url) {
    return null
  }

  return new Promise((resolve) => {
    const img = document.createElement('img')

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }

    img.onerror = () => {
      resolve(null)
    }

    img.src = url
  })
}

// ----------------------------------------------------------------
// NUMBER
// ----------------------------------------------------------------
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// ----------------------------------------------------------------
// DATETIME
// ----------------------------------------------------------------

export function fromNow(dateTime: ValidDate): string {
  return formatRelative(new Date(dateTime), new Date())
}

// ----------------------------------------------------------------
// STRING
// ----------------------------------------------------------------

export function toTitleCase(text: string) {
  if (nil(text)) {
    return text
  }
  return `${text[0]?.toUpperCase()}${text?.substr(1).toLowerCase()}`
}

export function toCapitalizedFirst(text: string) {
  if (nil(text)) {
    return text
  }
  return `${text[0]?.toUpperCase()}${text?.substr(1)}`
}

export function stripHTMLEntities(text: string) {
  return text
    ?.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/"/g, '&nbsp;')
}

export function isHexColor(text: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(text)
}

export function areEqualColors(left: string, right: string) {
  left = left?.replace(/^#/gi, '')?.toLowerCase()
  right = right?.replace(/^#/gi, '')?.toLowerCase()

  return left === right
}
