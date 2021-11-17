import React from "react"
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;



const BatchAddRules = () => {


  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
  }

  return(
    <div className="batch-rules">
      <Form
        name="rules"
        layout="vertical"
        autoComplete="off"
      >
        <TextArea cols={6}></TextArea>
        <div className="field-note">
          <p>每行一条记录； 每条分别为 Domain/URL, Target, Tags, Order, Note，使用空格隔开；多个标签使用英文逗号,隔开</p>
          <p>#支持泛域名匹配模式</p>
          <p>*.google.com &nbsp; 127.0.0.1:1080 &nbsp; dev &nbsp; 0 &nbsp; 标签、排序、备注都可以省略</p>
          <p>xyz.com &nbsp;&nbsp;&nbsp; 192.168.1.1 &nbsp;&nbsp;&nbsp; test</p>
        </div>
        <Form.Item
          label="统一设置标签"
          name="source"
          required={true}
          rules={[{ required: true, message: '域名/URL 必须填写' }]}
        >
          <Input placeholder="多个标签用逗号隔开" />
        </Form.Item>

        
      </Form>
    </div>
  )
}

export default BatchAddRules