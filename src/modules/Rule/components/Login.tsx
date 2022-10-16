import React from "react"
import { useSelector,useDispatch } from "react-redux";

import { Switch } from "antd"

import { getLogin } from "@/model/storage/selector"

const LoginView = () => {
  const dispatch = useDispatch()

  const checked = useSelector(getLogin)

  const _onSwitch = (checked:boolean) => {
    dispatch.storage.loginEnable(checked)
  }

  return (
    <Switch 
    style={{marginRight:20}}
    checked={checked}
    checkedChildren="Auto Logout"
    unCheckedChildren="Auto Login" 
    onChange={_onSwitch}/>
  )
}

export default LoginView