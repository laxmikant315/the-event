import {
  Button,
  Col,
  InputNumber,
  notification,
  Popconfirm,
  Row,
  Space,
  Spin,
  Statistic,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import StockCard from "../stock-card/stock-card.component";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const getTechColor = (techIndex: number) => {
  return `rgba(${techIndex > 50 ? 115 : 255}, ${techIndex > 50 ? 209 : 77}, ${
    techIndex > 50 ? 60 : 79
  }, ${techIndex > 50 ? techIndex / 100 : (100 - techIndex) / 100})`;
};
const TopLetControls = ({ data: dataFromProps, refresh, setRefresh }: any) => {
  const [data, setData] = useState(dataFromProps);
  const { progress, last_price, techIndex } = JSON.parse(
    data.additionalInfo || "{}"
  );
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    orderType: "MARKET",
    price: data.buyPrice,
  });
  const techColor = getTechColor(techIndex);

  return (
    <Popconfirm
      disabled={data.orderExecuting}
      placement="bottomRight"
      title={
        <Row justify="space-between">
          <Space>
            <Switch
              checkedChildren="Limit"
              unCheckedChildren="Market"
              onChange={(checked) => {
                setOrderInfo({
                  ...orderInfo,
                  orderType: checked ? "LIMIT" : "MARKET",
                });
              }}
            />

            <InputNumber<string>
              min="0"
              step="0.05"
              value={orderInfo.price}
              disabled={orderInfo.orderType === "MARKET"}
              onChange={(newPrice) => {
                setOrderInfo({
                  ...orderInfo,
                  price: newPrice,
                });
              }}
              stringMode
            />
          </Space>
        </Row>
      }
      onConfirm={async () => {
        let price = 0;
        if (orderInfo.orderType === "LIMIT") {
          price = orderInfo.price;
        }
        setOrderLoading(true);
        const order = await axios.get(
          `${serverUrl}/buy/${orderInfo.orderType}/${data.id}/${price}`
        );

        if (order.data && order.data.status === "order_completed") {
          notification.success({
            message: "Order Success",
            description: "Order successfully placed.",
          });
          if (setRefresh && refresh) {
            setRefresh(refresh + 1);
          }
        } else if (order.data && order.data.status === "open_order_placed") {
          notification.warning({
            message: "Order Success",
            description: "Order placed but not executed yet",
          });
          setData({ ...data, orderExecuting: true });
        } else {
          notification.error({
            message: "Order Failed",
            description:
              order.data.reason == "low_margin"
                ? "Due to unsuffiecient margin, please add funds."
                : "Order placing failed.",
          });
        }
        setOrderLoading(false);
      }}
      okText="Submit"
      cancelText="Cancel"
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
      icon={null}
    >
      <Button
        type="text"
        size="small"
        disabled={data.orderExecuting}
        loading={orderLoading}
        style={{
          background: data.orderExecuting ? "#fa8c16" : techColor,
          color: "#fff",
        }}
      >
        {data.orderExecuting ? "Buying..." : "Buy"}
      </Button>
    </Popconfirm>
  );
};

const AlertStockCard = ({
  item: itemFromProp,
  alertId,
  setRefresh,
  refresh,
  index = 0,
}: any) => {
  const [item, setItem] = useState(itemFromProp);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (alertId && !item) {
        setLoading(true);
        const alerts: any = await axios.get(
          `${serverUrl}/alerts/${index}/False/${alertId}`,
          {
            timeout: 100000,
          }
        );
        setLoading(false);
        if (alerts && alerts.data && alerts.data.length) {
          setItem(alerts.data[0]);
        } else {
          notification.error({
            message: "Alert ID " + alertId + " not found!!!",
          });
        }
      }
    })();
  }, []);

  return item ? (
    <>
      {loading && <Spin />}
      <StockCard
        id={item.symbol}
        data={item}
        onfetch={() =>
          axios.get(`${serverUrl}/alerts/${index}/True/${item.id}`)
        }
        topLeftControls={
          <TopLetControls
            data={item}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        }
        descriptions={
          <Row gutter={16} style={{ marginBottom: 10 }}>
            {/* <Col span={8}></Col> */}
            <Col span={12}>
              <Statistic
                title="Volumed on"
                value={moment(item.tradeDate).format("D MMM h:mm a")}
                precision={0}
                valueStyle={{ fontSize: 14 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Buy Signal on"
                value={moment(item.buyDate).format("D MMM h:mm a")}
                precision={0}
                valueStyle={{ fontSize: 14 }}
              />
            </Col>

            {/* <Col span={8}></Col> */}
          </Row>
        }
      />
    </>
  ) : null;
};
export default AlertStockCard;
