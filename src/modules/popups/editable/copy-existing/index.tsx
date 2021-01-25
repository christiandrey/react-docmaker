import React, { FC } from 'react'
import Button from '../../../button'
import Field from '../../../field'

type EditableCopyExistingProps = {}

const EditableCopyExisting: FC<EditableCopyExistingProps> = () => {
  return (
    <div>
      <Field label='Copy from' className='mb-18'>
        <select>
          <option>Choose one</option>
        </select>
      </Field>
      <Field label='Default value' className='mb-18'>
        <input placeholder='Default' />
      </Field>
      <div className='flex justify-end pt-24'>
        <Button className='h-32'>Insert</Button>
      </div>
    </div>
  )
}

export default EditableCopyExisting
