import {
  Button,
  Col,
  notification,
  Popconfirm,
  Row,
  Spin,
  Statistic,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Title from "antd/lib/typography/Title";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import StockCard from "../stock-card/stock-card.component";
import moment from "moment";
import NiftyRenko from "../nifty-renko/nifty-renko.component";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [refreshAll, setRefreshAll] = useState(0);
  const btnRefresh = useRef<any>();
  const btnRefreshAll = useRef<any>();

  // const [isUpdate, setIsUpdate] = useState(true);
  const [details, setDetails] = useState<any>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(`${serverUrl}/portfolio/False`);
      setData(alerts.data);
      const totalInvestment = parseFloat(
        alerts.data
          .map((x: any) => x.buy_price * x.quantity)
          .reduce((x: any, y: any) => x + y)
      );
      const currentValue = parseFloat(
        alerts.data
          .map((x: any) => x.last_price * x.quantity)
          .reduce((x: any, y: any) => x + y)
      );
      const dayPnl = parseFloat(
        alerts.data
          .map((x: any) => x.day_change)
          .reduce((x: any, y: any) => x + y)
      );
      const totalPnl = parseFloat(
        alerts.data.map((x: any) => x.pnl).reduce((x: any, y: any) => x + y)
      );
      const dayPnlPer = (dayPnl / totalInvestment) * 100;
      const totalPnlPer = (totalPnl / totalInvestment) * 100;

      setDetails({
        totalInvestment,
        currentValue,
        dayPnl,
        totalPnl,
        dayPnlPer,
        totalPnlPer,
      });
      console.log(details);
      setLoading(false);
    })();
  }, [index, refresh]);

  useEffect(() => {
    if (refreshAll) {
      (async () => {
        setLoading(true);
        const alerts = await axios.get(`${serverUrl}/portfolio/True`);
        setData(alerts.data);
        setLoading(false);
      })();
    }
  }, [index, refreshAll]);

  useEffect(() => {
    setInterval(() => {
      // setRefresh(refresh + 1);
      if (btnRefresh && btnRefresh.current) {
        btnRefresh.current.click();
      }
    }, 11160000);

    setInterval(() => {
      // setRefresh(refresh + 1);

      if (btnRefresh && btnRefresh.current) {
        btnRefresh.current.click();
      }
    }, 300000);
  }, []);
  return (
    <div
      className="site-card-wrapper"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row justify="space-between" style={{ marginLeft: 20, padding: 3 }}>
        <Col className="hidden-xs">
          <Title level={4} style={{ margin: "10px 30px" }}>
            {"  "}
            Portfolio
          </Title>
        </Col>
        {details && (
          <Col span={9} xs={24} sm={24} lg={12}>
            <Row gutter={50}>
              <Col span={6}>
                <Statistic
                  title="Total investment"
                  valueStyle={{
                    fontSize: 14,
                  }}
                  value={details.totalInvestment}
                  precision={2}
                  prefix="₹"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Current value"
                  valueStyle={{
                    fontSize: 14,
                  }}
                  value={details.currentValue}
                  precision={2}
                  prefix="₹"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Day's P&L"
                  valueStyle={{
                    color: details.dayPnl > 0 ? "#5b9a5d" : "#e25f5b",
                    fontSize: 14,
                  }}
                  value={details.dayPnl?.toFixed(2)}
                  precision={2}
                  prefix="₹"
                  suffix={
                    <small>{`(${details.dayPnlPer?.toFixed(2)}%)`}</small>
                  }
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total P&L"
                  value={details.totalPnl?.toFixed(2)}
                  valueStyle={{
                    color: details.totalPnl > 0 ? "#5b9a5d" : "#e25f5b",
                    fontSize: 14,
                  }}
                  prefix="₹"
                  suffix={
                    <small>{`(${details.totalPnlPer?.toFixed(2)}%)`}</small>
                  }
                  precision={2}
                />
              </Col>
            </Row>
          </Col>
        )}
        <Col xs={24} sm={24} lg={2}>
          <NiftyRenko />
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            ref={btnRefresh}
            onClick={() => setRefresh(refresh + 1)}
          />
          <Button
            type="primary"
            size="small"
            icon={<SyncOutlined />}
            loading={loading}
            ref={btnRefreshAll}
            onClick={() => setRefreshAll(refreshAll + 1)}
          />
          {/* <Switch
            checkedChildren="Sync On"
            unCheckedChildren="Sync Off"
            defaultChecked={isUpdate}
            loading={loading}
            onClick={() => setIsUpdate(!isUpdate)}
          /> */}
        </Col>
      </Row>
      <Spin
        spinning={loading}
        size="large"
        style={{ zIndex: 9999, position: "fixed", top: "35px" }}
      ></Spin>
      <Row
        justify="center"
        gutter={20}
        style={{ overflow: "auto", height: "100%" }}
      >
        {data
          .map((x: any) => ({
            ...x,
            max:
              Math.abs(x.progress) > Math.abs(x.timePer)
                ? Math.abs(x.progress)
                : Math.abs(x.timePer),
          }))
          .sort((x: any, y: any) => y.max - x.max)
          .map((item: any) => (
            <Col xs={24} sm={12} md={12} lg={12} xl={6} span={8}>
              <StockCard
                descriptions={
                  <Row gutter={16} style={{ marginBottom: 10 }}>
                    <Col span={3}>
                      <Statistic
                        title="QTY"
                        value={item.quantity}
                        precision={0}
                        valueStyle={{ fontSize: 14 }}
                        // valueStyle={{ color: "#3f8600" }}
                      />
                    </Col>

                    <Col span={8}>
                      <Statistic
                        title="Invested"
                        value={(item.buy_price * item.quantity).toFixed(2)}
                        precision={0}
                        valueStyle={{ fontSize: 14 }}
                        // valueStyle={{ color: "#3f8600" }}
                        prefix={"₹"}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Value"
                        value={(item.last_price * item.quantity).toFixed(2)}
                        precision={0}
                        prefix={"₹"}
                        valueStyle={{ fontSize: 14 }}
                        // valueStyle={{ color: "#3f8600" }}
                      />
                    </Col>
                    {/* <Col span={8}></Col> */}
                    <Col span={5}>
                      <Statistic
                        title="Buy on"
                        value={moment(item.buy_date).format("D MMM h:mm a")}
                        precision={0}
                        valueStyle={{ fontSize: 12 }}
                      />
                    </Col>
                    {/* <Col span={8}></Col> */}
                  </Row>
                }
                id={item.symbol}
                data={item}
                onfetch={() =>
                  axios.get(`${serverUrl}/portfolio/True/${item.symbol}`)
                }
                topLeftControls={
                  <Popconfirm
                    placement="bottomRight"
                    title={"Are you sure?"}
                    onConfirm={async () => {
                      const order = await axios.get(
                        `${serverUrl}/sell/${item.symbol}`
                      );

                      if (
                        order.data &&
                        order.data.status === "order_completed"
                      ) {
                        notification.success({
                          message: "Order Success",
                          description: "Order successfully placed.",
                        });
                      } else {
                        notification.error({
                          message: "Order Failed",
                          description: "Order placing failed.",
                        });
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ size: "large" }}
                    cancelButtonProps={{ size: "large" }}
                  >
                    <Button type="text" size="small">
                      Sell
                    </Button>
                  </Popconfirm>
                }
              />
            </Col>
          ))}
      </Row>{" "}
    </div>
  );
};

export default Alerts;
