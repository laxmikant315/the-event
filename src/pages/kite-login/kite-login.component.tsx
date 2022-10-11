import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

const KiteLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const { pin } = values;
    setLoading(true);
    const res = await axios.get(`${serverUrl}/kiteLogin/${pin}`, {
      timeout: 100000,
    });
    setLoading(false);
    if (res.status === 200 && res.data.status === "SUCCESS") {
      message.success("Successfully logged in");
    } else {
      message.error("Login failed.");
    }
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Card title="Login" bordered={false} style={{ width: 300 }}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ pin: "" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="PIN"
            name="pin"
            rules={[{ required: true, message: "Please input your pin!" }]}
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>{" "}
      </Card>
    </div>
  );
};
export default KiteLogin;
