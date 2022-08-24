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
      <h3>Add Rules</h3>
      <div className="ar-content">
      <Tabs defaultActiveKey="1" onChange={_onChange}>
        <TabPane tab="Add" key="1">
          <AddRules />
        </TabPane>
        <TabPane tab="Batch Add" key="2">
          <BatchAddRules/>
        </TabPane>
      </Tabs>
      </div>
    </div>
  )
}

export default RulesView