import { useState, useCallback, useMemo } from 'react'

type PopupActions = {
  visible: boolean
  open: Fn
  close: Fn
  toggle: Fn
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
