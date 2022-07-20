import React,{useEffect} from "react"
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
    checkedChildren="登出"
    unCheckedChildren="登陆" 
    onChange={_onSwitch}/>
  )
}

export default LoginView