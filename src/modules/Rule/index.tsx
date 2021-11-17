import React from "react";
import "./styles.scss";

import {Tabs} from 'antd';

import AddRules from "./components/AddRules";
import BatchAddRules from "./components/BatchAddRules"


const { TabPane } = Tabs;


const RulesView:React.FC = () => {

  const _onChange = (key:string) =>{
    console.log(key)
  }

  return(
    <div className="add-rules">
      <h3>添加规则</h3>
      <div className="ar-content">
      <Tabs defaultActiveKey="1" onChange={_onChange}>
        <TabPane tab="添加" key="1">
          <AddRules />
        </TabPane>
        <TabPane tab="批量添加" key="2">
          <BatchAddRules/>
        </TabPane>
      </Tabs>
      </div>
    </div>
  )
}

export default RulesView