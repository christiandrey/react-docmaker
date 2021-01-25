import React, { FC, memo } from 'react'
import ReactSwitch from 'react-switch'

type SwitchProps = {
  className?: string
  value: boolean
  onChangeValue: (value: boolean) => void
}

const BaseSwitch: FC<SwitchProps> = ({ className, value, onChangeValue }) => {
  return (
    <ReactSwitch
      checked={value}
      className={className}
      onChange={onChangeValue}
      offColor='#ADC5FA'
      onColor='#326FF3'
      checkedIcon={false}
      uncheckedIcon={false}
      handleDiameter={18}
      height={22}
      width={44}
      activeBoxShadow='0 0 0 4px rgba(103, 126, 138, 0.125)'
    />
  )
}

const Switch = memo(BaseSwitch)

export default Switch
