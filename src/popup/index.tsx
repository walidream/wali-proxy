import React from 'react'
import "./styles.scss"

import StoreProvider from "@/providers/StoreProvider"
import {store} from "@/model/store"
import { Button } from "antd"

import RulesView from '@/modules/Rule'
import RulesList from '@/modules/Rule/RulesList'
import SwitchView from '@/modules/Rule/components/Switch';
import LoginView from '@/modules/Rule/components/Login'

import usePageSize from "@/hooks/usePageSize"


const Popup:React.FC = () => {
  const _store = store(null,null)
  
  const {small, medium } = usePageSize()

  const _onClick = () => {
    window && window.open("/index.html")
  }

  const _renderBody = () => {
    if(small || medium){
      return (
        <div className="rules-list-wrap">
          <RulesList />
        </div>
      )
    }
    return (
      <React.Fragment>
        <div className="rules-wrap">
          <RulesView />
        </div>
        <div className="rules-list-wrap">
          <RulesList />
        </div>
      </React.Fragment>
    )
  }

  return(
    <div className="box-wrap">
      <StoreProvider store={_store}>
        <h1>
          <div>
            <span style={{marginRight:16}}>Wali Proxy </span>
            {(small || medium) && <Button size='small' onClick={_onClick}>Setting</Button>}
          </div>
          <div>
            <LoginView />
            <SwitchView />
          </div>
        </h1>
        <div className="yapi-proxy">
          {_renderBody()}
        </div>
      </StoreProvider>
    </div>
  )
}

export default Popup