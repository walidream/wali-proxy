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
    checkedChildren="关闭"
    unCheckedChildren="启用" 
    onChange={_onSwitch}/>
  )
}

export default SwitchView