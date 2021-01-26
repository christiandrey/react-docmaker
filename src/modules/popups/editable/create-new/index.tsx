import React, {
  ChangeEvent,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
  KeyboardEvent
} from 'react'
import Button from '../../../button'
import Field from '../../../field'
import Switch from '../../../switch'
import { FaRegTrashAlt } from 'react-icons/fa'
import { AiFillPlusCircle } from 'react-icons/ai'
import Icon from '../../../icon'
import {
  EditableAttributes,
  EditableDataType,
  EditableOption,
  getEditableAttributes,
  getEditableAttributesValidity
} from '../../../../core/tools'
import {
  DATE_FORMATS,
  EDITABLE_DATA_TYPES,
  TIME_FORMATS
} from '../../../../core/constants'
import { formatDate, generateUUID } from '../../../../core/utils'

type EditableCreateNewProps = {
  onSubmit?: (attributes: EditableAttributes) => void
}

const EditableCreateNew: FC<EditableCreateNewProps> = ({ onSubmit }) => {
  const now = useRef(new Date()).current
  const dataTypeOptions = useRef(Object.entries(EDITABLE_DATA_TYPES)).current
  const dateFormatOptions = useRef(DATE_FORMATS.map((o) => formatDate(now, o)))
    .current
  const timeFormatOptions = useRef(TIME_FORMATS.map((o) => formatDate(now, o)))
    .current

  const [dataType, setDataType] = useState<EditableDataType>(
    '' as EditableDataType
  )
  const [defaultValue, setDefaultValue] = useState('')
  const [dateTimeFormat, setDateTimeFormat] = useState('')
  const [label, setLabel] = useState('')
  const [multiline, setMultiline] = useState(false)
  const [options, setOptions] = useState<Array<EditableOption>>([])
  const [editingOption, setEditingOption] = useState('')
  const [showTip, setShowTip] = useState(false)
  const [tip, setTip] = useState('')

  const isValid = useMemo(
    () =>
      getEditableAttributesValidity(
        {
          dataType,
          dateTimeFormat,
          defaultValue,
          label,
          options,
          tip
        },
        showTip
      ),
    [dataType, dateTimeFormat, defaultValue, label, options, showTip, tip]
  )

  const handlePressDeleteOption = useCallback(
    (id: string) => {
      const eventualValue = [...options]
      const index = eventualValue.findIndex((o) => o.id === id)

      if (~index) {
        eventualValue.splice(index, 1)
        setOptions(eventualValue)
      }
    },
    [options]
  )

  const handlePressAddOption = useCallback(() => {
    const label = editingOption?.trim()

    if (!label?.length) {
      return
    }

    const id = generateUUID()

    setOptions((groundValue) => [...groundValue, { id, label }])
    setEditingOption('')
  }, [editingOption])

  const handleEditingOptionKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key?.toLowerCase() === 'enter') {
        e.preventDefault()
        handlePressAddOption()
      }
    },
    [handlePressAddOption]
  )

  const handlePressSubmit = useCallback(() => {
    const data = getEditableAttributes(
      {
        dataType,
        dateTimeFormat,
        multiline,
        defaultValue,
        label,
        options,
        tip
      },
      showTip
    )

    onSubmit?.(data)
  }, [
    dataType,
    dateTimeFormat,
    defaultValue,
    label,
    multiline,
    onSubmit,
    options,
    showTip,
    tip
  ])

  const handleChangeDataType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as EditableDataType

      if (value === dataType) {
        return
      }

      setDataType(value)

      if (value === 'date' || value === 'time') {
        setDateTimeFormat('')
      }
    },
    [dataType]
  )

  const handleChangeDateTimeFormat = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setDateTimeFormat(e.target.value)
    },
    []
  )

  const handleChangeEditingOption = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEditingOption(e.target.value)
    },
    []
  )

  const handleChangeLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
  }, [])

  const handleChangeDefaultValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDefaultValue(e.target.value)
    },
    []
  )

  const handleChangeTip = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTip(e.target.value)
  }, [])

  return (
    <div>
      <div className='flex items-end space-x-12 mb-18'>
        <Field label='Type' className='flex-1'>
          <select value={dataType} onChange={handleChangeDataType}>
            <option hidden value=''>
              Choose one
            </option>
            {dataTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        {dataType === 'text' && (
          <div className='flex flex-1 justify-start items-center space-x-8 pb-6'>
            <div>Multiline</div>
            <Switch value={multiline} onChangeValue={setMultiline} />
          </div>
        )}
        {dataType === 'date' && (
          <Field label='Date format'>
            <select
              value={dateTimeFormat}
              onChange={handleChangeDateTimeFormat}
            >
              <option hidden value=''>
                Choose a format
              </option>
              {dateFormatOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        )}
        {dataType === 'time' && (
          <Field label='Time format'>
            <select
              value={dateTimeFormat}
              onChange={handleChangeDateTimeFormat}
            >
              <option hidden value=''>
                Choose a format
              </option>
              {timeFormatOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      {['radio', 'options'].includes(dataType) && (
        <div className='mb-18'>
          <div className='text-blue-500 block mb-4 text-subhead font-medium'>
            Options
          </div>
          <div className='space-y-6'>
            {options?.map((o) => (
              <div
                key={o.id}
                onClick={() => handlePressDeleteOption(o.id)}
                className='flex items-center justify-between px-8 h-32 w-full border border-gray-200 bg-gray-100 rounded-default'
              >
                <span className='text-gray-500'>{o.label}</span>
                <Icon className='cursor-pointer text-gray-500 transition-colors duration-250'>
                  <FaRegTrashAlt />
                </Icon>
              </div>
            ))}
            <div className='flex items-center justify-between px-8 h-32 w-full border border-gray-200 rounded-default transition:colors transition:shadow duration-250 focus-within:shadow-outline focus-within:border-blue-500'>
              <input
                value={editingOption}
                className='border-none h-full w-full bg-transparent m-0'
                placeholder='+ Add an option'
                onChange={handleChangeEditingOption}
                onKeyDown={handleEditingOptionKeydown}
              />
              <Icon
                onPress={handlePressAddOption}
                className='cursor-pointer text-blue-500 transition-colors duration-250 hover:text-blue-600'
              >
                <AiFillPlusCircle />
              </Icon>
            </div>
          </div>
        </div>
      )}
      <Field label='Label' className='mb-18'>
        <input
          value={label}
          onChange={handleChangeLabel}
          placeholder='Question label'
        />
      </Field>
      <Field label='Default value' className='mb-18'>
        <input
          value={defaultValue}
          onChange={handleChangeDefaultValue}
          placeholder='Default'
        />
      </Field>
      <div className='flex flex-1 justify-between items-center mb-18'>
        <div>Show description</div>
        <Switch value={showTip} onChangeValue={setShowTip} />
      </div>
      {showTip && (
        <Field label='Description' className='mb-18'>
          <input
            value={tip}
            onChange={handleChangeTip}
            placeholder='Lorem ipsum...'
          />
        </Field>
      )}
      <div className='flex justify-end pt-24'>
        <Button
          disabled={!isValid}
          onPress={handlePressSubmit}
          className='h-32'
        >
          Insert
        </Button>
      </div>
    </div>
  )
}

export default EditableCreateNew
