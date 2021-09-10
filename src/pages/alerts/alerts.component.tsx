import { Button, Card, Col, Row, Space } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StockCard = ({ data }: any) => (
  <Col xs={24} sm={12} md={12} lg={8} xl={6} span={8}>
    <Card
      title={`${data.symbol} @${data.buyPrice}`}
      bordered={false}
      size="small"
      style={{ marginBottom: 20 }}
    >
      <Descriptions bordered size="small">
        <Descriptions.Item label="Volume Date" span={4}>
          {moment(data.tradeDate).format("D MMM h:mm a")}
        </Descriptions.Item>
        <Descriptions.Item label="Buy Date" span={4}>
          {moment(data.buyDate).format("D MMM h:mm a")}
        </Descriptions.Item>
        <Descriptions.Item label="Target" span={4}>
          {data.target} ({data.targetPer}%)
        </Descriptions.Item>
        <Descriptions.Item label="Stoploss" span={4}>
          {data.stopLoss} ({data.stopLossPer}%)
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </Col>
);

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const alerts = await axios.get(`${serverUrl}/alerts/${index}`);
      setData(alerts.data);
    })();
  }, [index]);
  return (
    <div
      className="site-card-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3}>Alerts</Title>
        </Col>
        <Col>
          <Space>
            <Button onClick={() => setIndex(index - 1)} disabled={index <= 0}>
              Prev
            </Button>
            <Button onClick={() => setIndex(index + 1)}>Next</Button>
          </Space>
        </Col>
      </Row>
      <Row
        gutter={16}
        justify="start"
        style={{ overflow: "auto", height: "100%" }}
      >
        {data.map((item) => (
          <StockCard data={item} />
        ))}
      </Row>
    </div>
  );
};

export default Alerts;
