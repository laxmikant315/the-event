import {
  Badge,
  Button,
  Card,
  Col,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";

import { LineChartOutlined } from "@ant-design/icons";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import TechIndexChart from "../../components/tech-index-chart.component";
import Indicator from "../indicator/indicator.component";
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StockCard = ({ data: dataFromProps }: any) => {
  const [data, setData] = useState(dataFromProps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTechIndexVisible, setIsTechIndexVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { techIndex } = data;
  const techColor = `rgba(${techIndex > 50 ? 115 : 255}, ${
    techIndex > 50 ? 209 : 77
  }, ${techIndex > 50 ? 60 : 79}, ${
    techIndex > 50 ? techIndex / 100 : (100 - techIndex) / 100
  })`;

  const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;
  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        setLoading(true);
        const portfolio = await axios.get(
          `${serverUrl}/portfolio/True/${data.symbol}`
        );
        if (portfolio.data && portfolio.data.length) {
          setData(portfolio.data[0]);
        }
        setLoading(false);
      })();
    }
  }, [isModalVisible]);

  return (
    <>
      <Modal
        title="Technical"
        footer=""
        width={800}
        bodyStyle={{ height: 400 }}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <iframe
          src={`https://mo.streak.tech/?utm_source=context-menu&utm_medium=kite&stock=NSE:${data.symbol}&theme=dark`}
          style={{ height: "100%", width: "100%", border: 0 }}
        />
      </Modal>
      <Col xs={24} sm={12} md={12} lg={12} xl={6} span={8}>
        <Badge
          status="warning"
          count="P"
          style={{ display: data.isInPositions ? "block" : "none" }}
        >
          <Card
            headStyle={{ padding: 0 }}
            title={
              <span style={{ margin: 0 }}>
                <Row justify="space-between">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      loading={loading}
                      type="text"
                      size="small"
                      onClick={() => setIsModalVisible(true)}
                      style={{
                        background: techColor,
                      }}
                    >
                      <BarChartOutlined /> {techIndex}
                    </Button>

                    {"   "}
                    <Modal
                      title="Tech Index Journey"
                      visible={isTechIndexVisible}
                      onCancel={() => setIsTechIndexVisible(false)}
                    >
                      <TechIndexChart data={data.indexProgress} />
                    </Modal>
                    <Popover
                      popupVisible={!isMobile}
                      content={<TechIndexChart data={data.indexProgress} />}
                      title="Tech Index Journey"
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (isMobile) setIsTechIndexVisible(true);
                        }}
                      >
                        &nbsp;{data.symbol}{" "}
                      </span>
                    </Popover>
                  </span>
                  <span
                    style={{ color: data["pnl"] > 0 ? "#73d13d" : "#ff4d4f" }}
                  >
                    <Button
                      type="text"
                      size="large"
                      target="_blank"
                      href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
                    >
                      <LineChartOutlined />
                    </Button>
                    {data.pnl.toFixed(2)}

                    <Popconfirm
                      placement="bottomRight"
                      title={"Are you sure?"}
                      onConfirm={async () => {
                        const order = await axios.get(
                          `${serverUrl}/sell/${data.symbol}`
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
                  </span>
                </Row>
              </span>
            }
            bordered={false}
            size="small"
            style={{ marginBottom: 10 }}
          >
            <Row justify="space-around">
              <Col lg={17} xs={17} sm={17} md={17}>
                {data["pnl"] > 0 ? (
                  <Progress
                    size="small"
                    percent={+data["progress"].toFixed(1)}
                    status="active"
                    strokeColor="#73d13d"
                  />
                ) : (
                  <Progress
                    percent={+Math.abs(data["progress"]).toFixed(1)}
                    status="active"
                    strokeColor="#ff4d4f"
                  />
                )}
              </Col>
              <Col lg={5}>
                <Progress
                  // type="circle"
                  percent={data.timePer}
                  steps={10}
                  size="small"
                  status={
                    data["pnl"] < 0 && data.timePer >= 100
                      ? "exception"
                      : data.timePer > 100
                      ? "success"
                      : "active"
                  }
                  strokeColor={data["pnl"] > 0 ? "#73d13d" : "#ff4d4f"}
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 10 }}>
              <Col span={8}>
                <Statistic
                  title="Quantity"
                  value={data.quantity}
                  precision={0}
                  // valueStyle={{ color: "#3f8600" }}
                />
              </Col>

              <Col span={8}>
                <Statistic
                  title="Invested"
                  value={(data.buy_price * data.quantity).toFixed(2)}
                  precision={0}
                  // valueStyle={{ color: "#3f8600" }}
                  prefix={"₹"}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Current Value"
                  value={(data.last_price * data.quantity).toFixed(2)}
                  precision={0}
                  prefix={"₹"}
                  // valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={8}></Col>
              <Col span={8}>
                <Statistic
                  title="Buy Date"
                  value={moment(data.buy_date).format("D MMM h:mm a")}
                  precision={0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col lg={24} xs={24} sm={24} xl={24}>
                <Indicator
                  data={{
                    stoplossPer: data.stopLossPer,
                    targetPer: data.targetPer,

                    buyPrice: data.buy_price,
                    target: data.target,
                    stoploss: data.stopLoss,
                    currentPrice: data.last_price,
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Badge>
      </Col>
    </>
  );
};

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [refreshAll, setRefreshAll] = useState(0);
  const btnRefresh = useRef<any>();
  const btnRefreshAll = useRef<any>();

  // const [isUpdate, setIsUpdate] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(`${serverUrl}/portfolio/False`);
      setData(alerts.data);
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
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3}>Portfolio</Title>
        </Col>
        <Col>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            loading={loading}
            ref={btnRefresh}
            onClick={() => setRefresh(refresh + 1)}
          />
          <Button
            type="primary"
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
      <Spin spinning={loading} size="large" style={{ color: "green" }}>
        <Row
          gutter={16}
          justify="start"
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
              <StockCard id={item.symbol} data={item} />
            ))}
        </Row>{" "}
      </Spin>
    </div>
  );
};

export default Alerts;
