import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Switch } from "antd";

import { getDevLogin, getQaLogin } from "@/model/storage/selector";

const LoginView = () => {
  const dispatch = useDispatch();

  const devChecked = useSelector(getDevLogin);
  const qaChecked = useSelector(getQaLogin);

  console.log("=====devChecked---qaChecked", devChecked, qaChecked);
  const _onDevSwitch = (checked: boolean) => {
    if (qaChecked === false) {
      console.log("dev");
      dispatch.storage.devLoginEnable(checked);
    }
  };

  const _onQaSwitch = (checked: boolean) => {
    if (devChecked === false) {
      console.log("qa");
      dispatch.storage.qaLoginEnable(checked);
    }
  };

  return (
    <Fragment>
      <Switch
        style={{ marginRight: 20 }}
        checked={devChecked}
        checkedChildren="Dev Logout"
        unCheckedChildren="Dev Login"
        onChange={_onDevSwitch}
      />
      <Switch
        style={{ marginRight: 20 }}
        checked={qaChecked}
        checkedChildren="Qa Logout"
        unCheckedChildren="Qa Login"
        onChange={_onQaSwitch}
      />
    </Fragment>
  );
};

export default LoginView;
