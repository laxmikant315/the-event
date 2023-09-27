import "./App.css";
import { Button, Layout, Menu } from "antd";
import {
  NotificationOutlined,
  EyeOutlined,
  DollarCircleOutlined,
  DotChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Alerts from "./pages/alerts/alerts.component";
import Portfolio from "./pages/portfolio/portfolio.component";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from "react-router-dom";
import Notifications from "./pages/notifications/notifications.component";
import Report from "./pages/report/report.component";
import Login from "./pages/login/login.component";
import AppProvider from "./providers/app.provider";
import { LoadInterceptor } from "./helpers/interceptor";
import KiteLogin from "./pages/kite-login/kite-login.component";
const { Content, Sider } = Layout;
const App = () => {
  const onLogout = () => {
    localStorage.removeItem("machine_token");
    localStorage.removeItem("machine_refresh_token");
    location.pathname = "/";
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadInterceptor />
      <Router>
        {" "}
        <AppProvider>
          <Switch>
            <Route exact path="/login" component={Login}></Route>
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
                    <Menu.Item key="6" icon={<DotChartOutlined />}>
                      <NavLink to="/report" activeClassName="active">
                        Report
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="7" icon={<UserOutlined />}>
                      <NavLink to="/kiteLogin" activeClassName="active">
                        Kite Login
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="8">
                      <Button type="link" onClick={onLogout}>
                        Logout
                      </Button>
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Layout>
                  {/* <Header
        className="site-layout-sub-header-background"
        style={{ padding: 0 }}
      /> */}
                  <Content
                    style={{
                      margin: "4px 10px 0px",
                      background:
                        "url(https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZGFyayUyMHNwYWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80)",
                    }}
                  >
                    <div
                      className="site-layout-background"
                      style={{
                        padding: 0,
                        minHeight: 360,
                        backdropFilter:
                          "brightness(1.5) saturate(2) hue-rotate(370deg) blur(10px)",
                        WebkitBackdropFilter:
                          "brightness(1.5) saturate(2) hue-rotate(370deg) blur(10px)",
                      }}
                    >
                      <Switch>
                        <Route exact path="/" component={Portfolio}></Route>
                        <Route
                          exact
                          path="/watchlist"
                          component={Alerts}
                        ></Route>
                        <Route
                          exact
                          path="/portfolio"
                          component={Portfolio}
                        ></Route>
                        <Route
                          exact
                          path="/notifications"
                          component={Notifications}
                        ></Route>
                        <Route exact path="/report" component={Report}></Route>
                        <Route
                          exact
                          path="/kiteLogin"
                          component={KiteLogin}
                        ></Route>
                      </Switch>
                    </div>
                  </Content>
                  {/* <Footer style={{ textAlign: "center" }}>Teksa ©2021</Footer> */}
                </Layout>
              </Layout>
            </Router>
          </Switch>
        </AppProvider>
      </Router>
    </div>
  );
};

export default App;
