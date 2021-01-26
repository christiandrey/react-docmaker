import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react'
import { useEditor, useOrphanNodes } from '../../../../core/hooks'
import {
  EditableAttributes,
  EditableElementType,
  getEditableAttributes,
  getEditableAttributesValidity,
  getMatchingNodes
} from '../../../../core/tools'
import Button from '../../../button'
import Field from '../../../field'

type EditableCopyExistingProps = {
  onSubmit?: (attributes: EditableAttributes) => void
}

const EditableCopyExisting: FC<EditableCopyExistingProps> = ({ onSubmit }) => {
  const editor = useEditor()
  const [orphanNodes] = useOrphanNodes()
  const editableNodes = useMemo(
    () =>
      getMatchingNodes(
        editor,
        (o) => o.type === 'editable' && !(o.valueRef as string)?.length
      )
        .concat(orphanNodes)
        .map((o) => o as EditableElementType<EditableAttributes>),
    [editor, orphanNodes]
  )

  const [valueRef, setValueRef] = useState('')
  const [defaultValue, setDefaultValue] = useState('')
  const dataType = useMemo(
    () => editableNodes?.find((o) => o.id === valueRef)?.dataType,
    [editableNodes, valueRef]
  )

  const isValid = useMemo(
    () =>
      getEditableAttributesValidity(
        { valueRef, defaultValue, dataType },
        false,
        true
      ),
    [dataType, defaultValue, valueRef]
  )

  const handleChangeValueRef = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value

      if (value === valueRef) {
        return
      }

      setValueRef(value)
      setDefaultValue(
        editableNodes.find((o) => o.id === value)?.defaultValue || ''
      )
    },
    [editableNodes, valueRef]
  )

  const handleChangeDefaultValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDefaultValue(e.target.value)
    },
    []
  )

  const handlePressSubmit = useCallback(() => {
    const data = getEditableAttributes({ valueRef, defaultValue, dataType })

    onSubmit?.(data)
  }, [dataType, defaultValue, onSubmit, valueRef])

  return (
    <div>
      <Field label='Copy from' className='mb-18'>
        <select value={valueRef} onChange={handleChangeValueRef}>
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
      <Field label='Default value' className='mb-18'>
        <input
          value={defaultValue}
          onChange={handleChangeDefaultValue}
          placeholder='Default'
        />
      </Field>
      <div className='flex justify-end pt-24'>
        <Button
          disabled={!isValid}
          className='h-32'
          onPress={handlePressSubmit}
        >
          Insert
        </Button>
      </div>
    </div>
  )
}

export default EditableCopyExisting
