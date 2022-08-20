import "./App.css";
import { Layout, Menu } from "antd";
import {
  NotificationOutlined,
  EyeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import Alerts from "./pages/alerts/alerts.component";
import Portfolio from "./pages/portfolio/portfolio.component";
import OneSignal from "react-onesignal";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
} from "react-router-dom";
import Notifications from "./pages/notifications/notifications.component";
import NiftyRenko from "./pages/nifty-renko/nifty-renko.component";
import { useEffect } from "react";
const { Header, Content, Footer, Sider } = Layout;

async function runOneSignal() {
  await OneSignal.init({
    appId: "ff0db6eb-ee23-4970-8f1d-57bba758bed6",
  });
  OneSignal.showSlidedownPrompt();
}
OneSignal.on("subscriptionChange", function (isSubscribed) {
  console.log("The user's subscription state is now:", isSubscribed);
});
const App = () => {
  useEffect(() => {
    runOneSignal();
  });

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
                <Route exact path="/watchlist" component={Alerts}></Route>
                <Route exact path="/portfolio" component={Portfolio}></Route>
                <Route exact path="/test" component={NiftyRenko}></Route>
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
