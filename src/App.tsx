import "./App.css";
import { Alert, Layout, Menu } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Alerts from "./pages/alerts/alerts.component";
import Portfolio from "./pages/portfolio/portfolio.component";
import { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [page, setPage] = useState("alerts");
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
          <Menu.Item
            key="3"
            icon={<UploadOutlined />}
            onClick={() => setPage("portfolio")}
          >
            Portfolio
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<UserOutlined />}
            onClick={() => setPage("alerts")}
          >
            Alerts
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        {/* <Header
        className="site-layout-sub-header-background"
        style={{ padding: 0 }}
      /> */}
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {page === "portfolio" && <Portfolio />}
            {page === "alerts" && <Alerts />}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>Teksa ©2021</Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;
