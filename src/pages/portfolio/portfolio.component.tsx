import { Button, Card, Col, Progress, Row, Skeleton, Space, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";

import { LineChartOutlined } from "@ant-design/icons";
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StockCard = ({ data }: any) => (
  <Col xs={24} sm={12} md={12} lg={8} xl={6} span={8}>
    <Card
      title={
        <Row justify="space-between">
          <span>
            {data.symbol} <small>{data.last_price}</small>
          </span>
          <span style={{ color: data["pnl"] > 0 ? "#73d13d" : "#ff4d4f" }}>
            <Button
              type="text"
              size="large"
              target="_blank"
              href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
            >
              <LineChartOutlined />
            </Button>
            {data.pnl.toFixed(2)}
          </span>
        </Row>
      }
      bordered={false}
      size="small"
      style={{ marginBottom: 20 }}
    >
      {data["pnl"] > 0 ? (
        <Progress
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
          x{data.quantity} = {(data.buy_price * data.quantity).toFixed(2)} & Now{" "}
          {(data.last_price * data.quantity).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </Col>
);

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(`${serverUrl}/portfolio`);
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index]);
  return (
    <div
      className="site-card-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3}>Portfolio</Title>
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
