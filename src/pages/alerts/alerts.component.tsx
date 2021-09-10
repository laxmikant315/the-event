import { Button, Card, Col, Row, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const StockCard = ({ data }: any) => (
  <Col xs={24} sm={12} md={6} lg={8} xl={6} span={8}>
    <Card
      title={`${data.symbol} @${data.buyPrice}`}
      bordered={false}
      style={{ marginBottom: 20 }}
    >
      <p>Volume Date : {data.tradeDate}</p>
      <p>Buy Date : {data.buyDate}</p>
      <p>
        Target : {data.target} ({data.targetPer}%)
      </p>
      <p>
        Stoploss : {data.stopLoss} ({data.stopLossPer}%)
      </p>
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
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Space>
          <Button onClick={() => setIndex(index - 1)} disabled={index <= 0}>
            Prev
          </Button>
          <Button onClick={() => setIndex(index + 1)}>Next</Button>
        </Space>
        <br />
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
