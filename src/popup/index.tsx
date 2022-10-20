import React from "react";
import "./styles.scss";

import StoreProvider from "@/providers/StoreProvider";
import { store } from "@/model/store";
import { Button } from "antd";

import RulesView from "@/modules/Rule";
import RulesList from "@/modules/Rule/RulesList";
import MockApiView from "@/modules/Rule/components/Switch";
import LoginView from "@/modules/Rule/components/Login";

import usePageSize from "@/hooks/usePageSize";

const Popup: React.FC = () => {
  const _store = store(null, null);

  const { small, medium } = usePageSize();

  const onSetting = () => {
    window && window.open("/index.html");
  };

  const renderBody = () => {
    if (small || medium) {
      return (
        <div className="rules-list-wrap">
          <RulesList />
        </div>
      );
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
    );
  };

  return (
    <div className="box-wrap">
      <StoreProvider store={_store}>
        <h1>
          <div>
            <span style={{ marginRight: 16 }}>US Proxy </span>
            {(small || medium) && (
              <Button size="small" onClick={onSetting}>
                Setting
              </Button>
            )}
          </div>
          <div>
            <LoginView />
            <MockApiView />
          </div>
        </h1>
        <div className="yapi-proxy">{renderBody()}</div>
      </StoreProvider>
    </div>
  );
};

export default Popup;
