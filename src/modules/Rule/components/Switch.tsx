import React,{useEffect} from "react"
import { useSelector,useDispatch } from "react-redux";

import { Switch } from "antd"

import { getChecked } from "@/model/storage/selector"

const SwitchView = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch.storage.getYapiRules()

  }, [dispatch])

  const checked = useSelector(getChecked)

  const _onSwitch = (checked:boolean) => {
    dispatch.storage.switchEnable(checked)
  }

  return (
    <Switch 
    checked={checked}
    checkedChildren="Close API"
    unCheckedChildren="Mock API" 
    onChange={_onSwitch}/>
  )
}

export default SwitchView