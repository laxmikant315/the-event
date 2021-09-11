import {
  Button,
  Card,
  Col,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import LineChartOutlined from "@ant-design/icons/lib/icons/LineChartOutlined";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
const serverUrl = process.env.REACT_APP_SERVER_URL;
const StockCard = ({ data }: any) => {
  const { progress, last_price } = JSON.parse(data.additionalInfo || "{}");
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      <Col xs={24} sm={12} md={12} lg={8} xl={6} span={8}>
        <Card
          title={
            <Row justify="space-between">
              <span>
                {data.symbol} @{data.buyPrice}
              </span>
              <span>
                <Button
                  type="text"
                  size="large"
                  onClick={() => setIsModalVisible(true)}
                >
                  <BarChartOutlined />
                </Button>
                <Button
                  type="text"
                  size="large"
                  target="_blank"
                  href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
                >
                  <LineChartOutlined />
                </Button>
              </span>
            </Row>
          }
          bordered={false}
          size="small"
          style={{ marginBottom: 20 }}
        >
          {progress > 0 && (
            <Progress
              percent={+progress.toFixed(1)}
              status="active"
              strokeColor="#73d13d"
            />
          )}
          {progress < 0 && (
            <Progress
              percent={+Math.abs(progress).toFixed(1)}
              status="active"
              strokeColor="#ff4d4f"
            />
          )}
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
            {last_price && (
              <Descriptions.Item label="Current Price" span={4}>
                {last_price}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </Col>
    </>
  );
};

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(
        `${serverUrl}/alerts/${index}/${isUpdate ? "True" : "False"}`
      );
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index, isUpdate, refresh]);
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
            <Button
              type="text"
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => setRefresh(refresh + 1)}
            />
            <Switch
              checkedChildren="Sync On"
              unCheckedChildren="Sync Off"
              defaultChecked={isUpdate}
              loading={loading}
              onClick={() => setIsUpdate(!isUpdate)}
            />

            <Button onClick={() => setIndex(index - 1)} disabled={index <= 0}>
              Prev
            </Button>
            <Button onClick={() => setIndex(index + 1)}>Next</Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={16} style={{ overflow: "auto", height: "100%" }}>
        <Col lg={24} xs={24} sm={24} xl={24}>
          {loading ? (
            <Skeleton />
          ) : (
            <Row
              gutter={16}
              justify="start"
              style={{ overflow: "auto", height: "100%" }}
            >
              {data.map((item) => (
                <StockCard data={item} />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Alerts;
