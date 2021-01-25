import React, { FC, useState } from 'react'
import Popup from '../../popup'
import SegmentedControl from '../../segmented-control'
import EditableCopyExisting from './copy-existing'
import EditableCreateNew from './create-new'

type EditablePopupProps = {
  isVisible: boolean
  onRequestClose: Fn
}

const EditablePopupProps: FC<EditablePopupProps> = ({
  isVisible,
  onRequestClose
}) => {
  const [segment, setSegment] = useState(0)

  return (
    <Popup
      position='center'
      alignment='center'
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      hideArrow
      overlayCloseOnClick
      contentClassName='rounded-default'
    >
      <div className='rounded-default w-480 py-12 px-16 bg-white border border-gray-300 overflow-hidden'>
        <div className='flex items-center justify-center mb-28'>
          <SegmentedControl
            value={segment}
            onChangeValue={setSegment}
            options={['Create new', 'Copy existing']}
          />
        </div>
        {segment === 0 && <EditableCreateNew />}
        {segment === 1 && <EditableCopyExisting />}
      </div>
    </Popup>
  )
}

export default EditablePopupProps
