import React, {
  ChangeEvent,
  FC,
  MutableRefObject,
  useCallback,
  useMemo,
  useState
} from 'react'
import { useEditor } from '../../../core/hooks'
import {
  EditableAttributes,
  EditableElementType,
  EditableRefAttributes,
  getMatchingNodes
} from '../../../core/tools'
import Button from '../../button'
import Field from '../../field'
import Popup from '../../popup'

type ConditionPopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
  onSubmitEditing?: (value: EditableRefAttributes) => void
}

const ConditionPopup: FC<ConditionPopupProps> = ({
  anchorRef,
  isVisible,
  onRequestClose,
  onSubmitEditing
}) => {
  const editor = useEditor()
  const editableNodes = getMatchingNodes(
    editor,
    (o) =>
      o.type === 'editable' &&
      !(o.valueRef as string)?.length &&
      ['options', 'radio'].includes(o.dataType as string)
  ).map((o) => o as EditableElementType<EditableAttributes>)

  const [parent, setParent] = useState('')
  const [value, setValue] = useState('')
  const options = useMemo(
    () => editableNodes.find((o) => o.id === parent)?.options || [],
    [editableNodes, parent]
  )

  const isValid = !!parent?.length && !!value?.length

  const handleChangeParent = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.value

      if (selected === parent) {
        return
      }

      setParent(selected)
      setValue('')
    },
    [parent]
  )

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.value

      if (selected === value) {
        return
      }

      setValue(selected)
    },
    [value]
  )

  const handleRequestClose = useCallback(() => {
    setParent('')
    setValue('')
    onRequestClose?.()
  }, [onRequestClose])

  const handlePressSubmit = useCallback(() => {
    onSubmitEditing?.({
      parent,
      value
    })
    handleRequestClose()
  }, [handleRequestClose, onSubmitEditing, parent, value])

  return (
    <Popup
      position='down'
      alignment='start'
      isVisible={isVisible}
      onRequestClose={handleRequestClose}
      anchorRef={anchorRef}
      transparent
      hideArrow
      overlayCloseOnClick
      contentClassName='rounded-default'
    >
      <div className='rounded-default p-8 space-y-8 w-320 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        <Field label='Only show when...'>
          <select value={parent} onChange={handleChangeParent}>
            <option hidden value=''>
              Choose one
            </option>
            {editableNodes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.defaultValue}({o.label})
              </option>
            ))}
          </select>
        </Field>
        <Field label='equals...'>
          <select value={value} onChange={handleChangeValue}>
            <option hidden value=''>
              Choose one
            </option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <div className='flex justify-end'>
          <Button
            disabled={!isValid}
            className='h-32'
            onPress={handlePressSubmit}
          >
            Add condition
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default ConditionPopup
