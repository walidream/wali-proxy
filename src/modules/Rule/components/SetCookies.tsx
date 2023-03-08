import React from "react";

import { FormInstance } from "antd/es/form";
import { Form, Input, Space, Button } from "antd";
import { setLocalhostCookie } from "@/background/login";
const { TextArea } = Input;

const SetCookie = () => {
  const formRef = React.createRef<FormInstance>();

  const onFinish = (values: any) => {
    const { cookie } = values;
    try {
      const cookies = cookie.split("; ");
      cookies.forEach((item: any) => {
        const name = item.split("=")[0];
        const value = item.split("=")[1];
        setLocalhostCookie({ name, value });
      });
      console.log("....", cookies);
    } catch (e) {
      console.log("set cookie:", e);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="set-cookie">
      <Form
        ref={formRef}
        name="cookie"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="ruleKey" name="cookie">
          <TextArea rows={6} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Space size={20}>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SetCookie;
