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

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
} from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  return (
    <Router>
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
          <Menu theme="dark" mode="inline">
            <Menu.Item key="3" icon={<UploadOutlined />}>
              <NavLink to="/portfolio" activeClassName="active">
                {" "}
                Portfolio{" "}
              </NavLink>
            </Menu.Item>

            <Menu.Item key="4" icon={<UserOutlined />}>
              <NavLink to="/alerts" activeClassName="active">
                Alerts
              </NavLink>
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
              <Switch>
                <Route exact path="/" component={Portfolio}></Route>
                <Route exact path="/alerts" component={Alerts}></Route>
                <Route exact path="/portfolio" component={Portfolio}></Route>
              </Switch>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>Teksa ©2021</Footer> */}
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
