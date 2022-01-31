import "./App.css";
import { Layout, Menu } from "antd";
import {
  NotificationOutlined,
  EyeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import Alerts from "./pages/alerts/alerts.component";
import Portfolio from "./pages/portfolio/portfolio.component";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
} from "react-router-dom";
import Notifications from "./pages/notifications/notifications.component";
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
            <Menu.Item key="3" icon={<DollarCircleOutlined />}>
              <NavLink to="/portfolio" activeClassName="active">
                {" "}
                Portfolio{" "}
              </NavLink>
            </Menu.Item>

            <Menu.Item key="4" icon={<EyeOutlined />}>
              <NavLink to="/watchlist" activeClassName="active">
                Watchlist
              </NavLink>
            </Menu.Item>
            <Menu.Item key="5" icon={<NotificationOutlined />}>
              <NavLink to="/notifications" activeClassName="active">
                Notifications
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
                <Route exact path="/watchlist" component={Alerts}></Route>
                <Route exact path="/portfolio" component={Portfolio}></Route>
                <Route
                  exact
                  path="/notifications"
                  component={Notifications}
                ></Route>
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
