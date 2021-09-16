import {
  Badge,
  Button,
  Card,
  Col,
  Modal,
  notification,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
import { LineChartOutlined } from "@ant-design/icons";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StockCard = ({ data: dataFromProps }: any) => {
  const [data, setData] = useState(dataFromProps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { techIndex } = data;
  const techColor = `rgba(${techIndex > 50 ? 115 : 255}, ${
    techIndex > 50 ? 209 : 77
  }, ${techIndex > 50 ? 60 : 79}, ${
    techIndex > 50 ? techIndex / 100 : (100 - techIndex) / 100
  })`;

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
            title={
              <>
                <Row justify="space-between">
                  <span>
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
                    {data.symbol} <small>{data.last_price}</small>
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
              </>
            }
            bordered={false}
            size="small"
            style={{ marginBottom: 20 }}
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

            <Descriptions bordered size="small">
              <Descriptions.Item label="Buy Date" span={4}>
                {moment(data.buy_date).format("D MMM h:mm a")}
              </Descriptions.Item>
              <Descriptions.Item label="Buy Price" span={4}>
                {data.buy_price}
              </Descriptions.Item>

              <Descriptions.Item label="Target" span={4}>
                {data.target} ({data.targetPer}%)
              </Descriptions.Item>
              <Descriptions.Item label="Stoploss" span={4}>
                {data.stopLoss} ({data.stopLossPer}%)
              </Descriptions.Item>
              <Descriptions.Item label="Value" span={4}>
                x{data.quantity} = {(data.buy_price * data.quantity).toFixed(2)}{" "}
                & Now {(data.last_price * data.quantity).toFixed(2)}
              </Descriptions.Item>
              {data.last_price && (
                <Descriptions.Item label="Current Price" span={4}>
                  {data.last_price}
                </Descriptions.Item>
              )}
            </Descriptions>
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
  const btnRefresh = useRef<any>();

  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(
        `${serverUrl}/portfolio/${isUpdate ? "True" : "False"}`
      );
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index, refresh, isUpdate]);

  useEffect(() => {
    setInterval(() => {
      // setRefresh(refresh + 1);
      if (btnRefresh && btnRefresh.current) {
        btnRefresh.current.click();
      }
    }, 60000);

    setInterval(() => {
      // setRefresh(refresh + 1);
      setIsUpdate(true);
      if (btnRefresh && btnRefresh.current) {
        btnRefresh.current.click();
      }
      setIsUpdate(false);
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
          <Switch
            checkedChildren="Sync On"
            unCheckedChildren="Sync Off"
            defaultChecked={isUpdate}
            loading={loading}
            onClick={() => setIsUpdate(!isUpdate)}
          />
        </Col>
      </Row>
      <Spin spinning={loading} size="large" style={{ color: "green" }}>
        <Row
          gutter={16}
          justify="start"
          style={{ overflow: "auto", height: "100%" }}
        >
          {data
            .sort(
              (x: any, y: any) => Math.abs(y.progress) - Math.abs(x.progress)
            )
            .map((item) => (
              <StockCard data={item} />
            ))}
        </Row>{" "}
      </Spin>
    </div>
  );
};

export default Alerts;
