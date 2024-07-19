'use client'
import type { Option, OptionObject } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { Props } from './types.js'

import { useTranslation } from '../../../../providers/Translation/index.js'
import { ReactSelect } from '../../../ReactSelect/index.js'

const formatOptions = (options: Option[]): OptionObject[] =>
  options.reduce((acc, option) => {
    if (typeof option === 'string') {
      return [
        ...acc,
        {
          label: option,
          value: option,
        },
      ]
    } else if ('options' in option) {
      return [...acc, ...formatOptions(option.options)]
    } else {
      return acc
    }
  }, [])

export const Select: React.FC<Props> = ({
  disabled,
  onChange,
  operator,
  options: optionsFromProps,
  value,
}) => {
  const { i18n } = useTranslation()
  const [options, setOptions] = React.useState(formatOptions(optionsFromProps))

  const isMulti = ['in', 'not_in'].includes(operator)
  let valueToRender

  if (isMulti && Array.isArray(value)) {
    valueToRender = value.map((val) => {
      const matchingOption = options.find((option) => option.value === val)
      return {
        label: matchingOption ? getTranslation(matchingOption.label, i18n) : val,
        value: matchingOption?.value ?? val,
      }
    })
  } else if (value) {
    const matchingOption = options.find((option) => option.value === value)
    valueToRender = {
      label: matchingOption ? getTranslation(matchingOption.label, i18n) : value,
      value: matchingOption?.value ?? value,
    }
  }

  const onSelect = React.useCallback(
    (selectedOption) => {
      let newValue
      if (!selectedOption) {
        newValue = null
      } else if (isMulti) {
        if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => option.value)
        } else {
          newValue = []
        }
      } else {
        newValue = selectedOption.value
      }

      onChange(newValue)
    },
    [isMulti, onChange],
  )

  React.useEffect(() => {
    setOptions(formatOptions(optionsFromProps))
  }, [optionsFromProps])

  React.useEffect(() => {
    if (!isMulti && Array.isArray(value)) {
      onChange(value[0])
    }
  }, [isMulti, onChange, value])

  return (
    <ReactSelect
      disabled={disabled}
      isMulti={isMulti}
      onChange={onSelect}
      options={options.map((option) => ({ ...option, label: getTranslation(option.label, i18n) }))}
      value={valueToRender}
    />
  )
}
