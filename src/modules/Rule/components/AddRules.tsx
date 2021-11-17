import React,{useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";

import { Form, Input, Button, Space, notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { RuleType } from "../types"

import { getFormRule } from "@/model/storage/selector"


const AddRules:React.FC = () => {
  const dispatch = useDispatch()
  const formRef = React.createRef<FormInstance>();

  const formRule = useSelector(getFormRule)

  useEffect(() => {
    formRef.current!.setFieldsValue(formRule)
  }, [formRule,formRef])

  const _onFinish = (values: RuleType) => {
    dispatch.storage.addRulesItem(values)

    _onReset()
    notification.success({
      duration:2,
      message: 'wali proxy',
      description:'保存成功!',
    });
  }

  const _onReset = () => {
    formRef.current!.resetFields()
    dispatch.storage.resetFormRule()
  };

  const _onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  return(
    <div className="add-rules">
      <Form
        ref={formRef}
        name="rules"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={_onFinish}
        onFinishFailed={_onFinishFailed}
        autoComplete="off"
        initialValues={{
          checked: false,
          sort:0
        }}
      >
        <Form.Item
          style={{display:'none'}}
          label="ruleKey"
          name="key"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          style={{display:'none'}}
          label="checked"
          name="checked"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="(源)"
          name="host"
          required={true}
          rules={[{ required: true, message: '域名/URL 必须填写' }]}
        >
          <Input placeholder="https://us.qa1fdg.net/v1/friendly/new-otc/get-selector" />
        </Form.Item>
        <Form.Item
          label="(目标)"
          name="target"
          rules={[{ required: true, message: '域名/URL 必须填写' }]}
        >
          <Input placeholder="https://yapi.devfdg.us/mock/binance-mgs-lending/v1/friendly/new-otc/get-selector" />
        </Form.Item>
        <Form.Item
          label="标签"
          name="tag"
        >
          <Input placeholder="多个标签可用逗号隔开" />
        </Form.Item>
        <Form.Item
          label="排序"
          name="sort"
        >
          <Input value={0}  placeholder="值越大排序越靠前" />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
        >
          <Input />
        </Form.Item>
        <Form.Item  wrapperCol={{ offset: 4, span: 20 }}>
          <Space size={20}>
            <Button onClick={_onReset}>取消</Button>
            <Button type="primary" htmlType="submit">确定添加</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddRules