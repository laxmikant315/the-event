import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../providers/app.provider";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/api/v1/auth";

const Login: React.FC = () => {
  const { token, setToken } = useContext(AppContext);
  useEffect(() => {
    localStorage.removeItem("machine_token");
    localStorage.removeItem("machine_refresh_token");
  }, []);
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { email, password } = values;
    // history.push("/portfolio");
    try {
      const loginRes = await axios.post(`${serverUrl}/login`, {
        email,
        password,
      });
      if (loginRes.status === 200) {
        console.log("loginRes", loginRes);
        setToken(loginRes.data.user.access);
        localStorage.setItem("machine_token", loginRes.data.user.access);
        localStorage.setItem(
          "machine_refresh_token",
          loginRes.data.user.refresh
        );

        history.push("/portfolio");
      }
    } catch (error: any) {
      console.log("error", error);
      alert("Wrong credentials");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const history = useHistory();
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
