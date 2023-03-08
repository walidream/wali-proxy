import React from "react";
import "./styles.scss";

import { Tabs } from "antd";

import AddRules from "./components/AddRules";
import SetCookie from "./components/SetCookies";

const { TabPane } = Tabs;

const RulesView: React.FC = () => {
  const _onChange = (key: string) => {
    console.log("table", key);
  };

  return (
    <div className="add-rules">
      <h3>Add Rules</h3>
      <div className="ar-content">
        <Tabs defaultActiveKey="1" onChange={_onChange}>
          <TabPane tab="Add" key="1">
            <AddRules />
          </TabPane>
          <TabPane tab="Set Cookie" key="2">
            <SetCookie />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RulesView;
