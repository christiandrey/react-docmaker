import { useState, useCallback, useMemo, MouseEvent } from 'react'
import { useSlate } from 'slate-react'
import { getColorMark, HeadingFormatType, isBlockActive } from '../tools'

type PopupActions = {
  visible: boolean
  open: Fn
  close: Fn
  toggle: Fn
}

export type TextSizeValue = {
  name: HeadingFormatType
  label: string
  value: boolean
}

export function usePopupUtils(initialOpen: boolean = false): PopupActions {
  const [visible, setVisible] = useState(initialOpen)

  const handleOpen = useCallback(() => {
    setVisible(true)
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
  }, [])

  const handleToggle = useCallback(() => {
    setVisible((o) => !o)
  }, [])

  const popupActions: PopupActions = useMemo(
    () => ({
      visible,
      open: handleOpen,
      close: handleClose,
      toggle: handleToggle
    }),
    [handleClose, handleOpen, handleToggle, visible]
  )

  return popupActions
}

export function useTextSizeValue(): TextSizeValue {
  const editor = useSlate()

  const headingOneActive = isBlockActive(editor, 'heading-one')
  const headingTwoActive = isBlockActive(editor, 'heading-two')
  const headingThreeActive = isBlockActive(editor, 'heading-three')

  const results = useMemo(
    () =>
      [
        { name: 'heading-one', label: 'Heading 1', value: headingOneActive },
        { name: 'heading-two', label: 'Heading 2', value: headingTwoActive },
        { name: 'heading-three', label: 'Heading 3', value: headingThreeActive }
      ] as Array<TextSizeValue>,
    [headingOneActive, headingThreeActive, headingTwoActive]
  )

  return results.find((o) => o.value)
}

export function useLeafColorValue(): string {
  const editor = useSlate()
  return getColorMark(editor)
}

export function useMouseDown(fn: Fn): (e: MouseEvent) => void {
  return useCallback(
    (e: MouseEvent) => {
      e?.preventDefault()
      fn?.()
    },
    [fn]
  )
}
