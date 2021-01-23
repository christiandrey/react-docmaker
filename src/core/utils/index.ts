import formatRelative from 'date-fns/formatRelative'

// ----------------------------------------------------------------
// UTILITY
// ----------------------------------------------------------------

export function nil<T>(value: T): boolean {
  return typeof value === 'undefined' || value === null
}

export function notNil<T>(value: T): boolean {
  return !nil(value)
}

// ----------------------------------------------------------------
// OBJECT
// ----------------------------------------------------------------

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

// ----------------------------------------------------------------
// DOCMAKER
// ----------------------------------------------------------------
