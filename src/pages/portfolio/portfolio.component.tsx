import {
  Button,
  Col,
  notification,
  Popconfirm,
  Result,
  Row,
  Spin,
  Statistic,
} from "antd";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Title from "antd/lib/typography/Title";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import StockCard from "../stock-card/stock-card.component";
import moment from "moment";
import NiftyRenko from "../nifty-renko/nifty-renko.component";
import { AppContext } from "../../providers/app.provider";
import { useHistory } from "react-router-dom";

const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

const Alerts = () => {
  const [data, setData] = useState<any>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [refreshAll, setRefreshAll] = useState(0);
  const btnRefresh = useRef<any>();
  const btnRefreshAll = useRef<any>();

  // const [isUpdate, setIsUpdate] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const {
    availableMargin,
    wsData,
    setInstrumentTokens,
    orginalDetails,
    setOriginalDetails,
  } = useContext(AppContext);
  const [niftyValues, setNiftyValues] = useState<any>(null);
  const [nifty500Values, setNifty500Values] = useState<any>(null);
  useEffect(() => {
    const niftyWsData = wsData && wsData.find((x: any) => x.token === 256265);
    console.log("niftyWsData", niftyWsData);
    if (niftyWsData) {
      setNiftyValues(niftyWsData);
    }
    const nifty500WsData =
      wsData && wsData.find((x: any) => x.token === 268041);
    if (nifty500WsData) {
      setNifty500Values(nifty500WsData);
    }

    if (data && data.length) {
      for (let item of wsData) {
        const selected: any = data.find(
          (x: any) => x.instrument_token === item.token
        );

        if (selected) {
          const index = data.findIndex(
            (x: any) => x.instrument_token === item.token
          );
          selected.last_price = item.lastPrice;
          if (!selected.isInPositions) {
            selected.day_change = item.absoluteChange * selected.quantity;
            selected.day_change_percentage = item.change;
          } else {
            selected.day_change =
              (item.lastPrice - selected.buy_price) * selected.quantity;
            selected.day_change_percentage =
              (item.lastPrice * 100) / selected.buy_price - 100;
          }
          const newData: any = [...data];
          newData[index] = selected;
          setData(newData);

          // setData([...data, selected]);
        }
      }
    }
  }, [wsData]);
  useEffect(() => {
    let totalInvestment = 0,
      currentValue = 0,
      dayPnl = 0,
      totalPnl = 0,
      dayPnlPer = 0,
      totalPnlPer = 0;
    if (data && data.length) {
      totalInvestment = parseFloat(
        data
          .map((x: any) => x.buy_price * x.quantity)
          .reduce((x: any, y: any) => x + y)
      );
      currentValue = parseFloat(
        data
          .map((x: any) => x.last_price * x.quantity)
          .reduce((x: any, y: any) => x + y)
      );
      dayPnl = parseFloat(
        data.map((x: any) => x.day_change).reduce((x: any, y: any) => x + y)
      );
      totalPnl = parseFloat(
        data.map((x: any) => x.pnl).reduce((x: any, y: any) => x + y)
      );
      if (orginalDetails) {
        const diff = dayPnl - orginalDetails.dayPnl;
        totalPnl = totalPnl + diff;

        dayPnlPer = (dayPnl / totalInvestment) * 100;
        totalPnlPer = (totalPnl / totalInvestment) * 100;
      }
    }
    setDetails({
      totalInvestment,
      currentValue,
      dayPnl,
      totalPnl,
      dayPnlPer,
      totalPnlPer,
    });
  }, [data]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(`${serverUrl}/portfolio/False`);
      let dayPnl = 0;
      let dayPnlList = {};
      if (alerts.data && alerts.data.length) {
        dayPnl = parseFloat(
          alerts.data
            .map((x: any) => x.day_change)
            .reduce((x: any, y: any) => x + y)
        );
        dayPnlList = alerts.data.map((x: any) => ({
          symbol: x.symbol,
          day_change: x.day_change,
        }));
        setData(alerts.data);
        setInstrumentTokens(alerts.data.map((x: any) => x.instrument_token));
      }
      setOriginalDetails({ ...orginalDetails, dayPnl, dayPnlList });

      setLoading(false);
    })();
  }, [index, refresh]);

  useEffect(() => {
    if (refreshAll) {
      (async () => {
        setLoading(true);
        const alerts = await axios.get(`${serverUrl}/portfolio/True`);
        const dayPnl = parseFloat(
          alerts.data
            .map((x: any) => x.day_change)
            .reduce((x: any, y: any) => x + y)
        );
        const dayPnlList = alerts.data.map((x: any) => ({
          symbol: x.symbol,
          day_change: x.day_change,
        }));
        setOriginalDetails({ ...orginalDetails, dayPnl, dayPnlList });
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
  const history = useHistory();
  return (
    <div
      className="site-card-wrapper"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row justify="space-between" style={{ marginLeft: 25, padding: 3 }}>
        <Col className="hidden-xs">
          <Title level={4} style={{ margin: "10px 30px" }}>
            {"  "}
            Portfolio
          </Title>
        </Col>

        {details && (
          <Col span={9} xs={24} sm={24} lg={16}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Statistic
                title="Total investment"
                valueStyle={{
                  fontSize: 13,
                }}
                value={details.totalInvestment}
                precision={2}
                prefix="₹"
              />

              <Statistic
                title="Current value"
                valueStyle={{
                  fontSize: 13,
                }}
                value={details.currentValue}
                precision={2}
                prefix="₹"
              />

              <Statistic
                title="Day's P&L"
                valueStyle={{
                  color: details.dayPnl > 0 ? "#5b9a5d" : "#e25f5b",
                  fontSize: 13,
                }}
                value={details.dayPnl?.toFixed(2)}
                precision={2}
                prefix="₹"
                suffix={<small>{`(${details.dayPnlPer?.toFixed(2)}%)`}</small>}
              />

              <Statistic
                title="Total P&L"
                value={details.totalPnl?.toFixed(2)}
                valueStyle={{
                  color: details.totalPnl > 0 ? "#5b9a5d" : "#e25f5b",
                  fontSize: 13,
                }}
                prefix="₹"
                suffix={
                  <small>{`(${details.totalPnlPer?.toFixed(2)}%)`}</small>
                }
                precision={2}
              />

              <Statistic
                title="Available Fund"
                value={availableMargin?.toFixed(2)}
                valueStyle={{
                  fontSize: 13,
                }}
                prefix="₹"
                precision={2}
              />

              {niftyValues && (
                <a
                  target="_blank"
                  href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${"NIFTY"}`}
                >
                  <Statistic
                    title="Nifty 50"
                    valueStyle={{
                      fontSize: 13,
                      width: 100,
                      color: niftyValues.change > 0 ? "#5b9a5d" : "#e25f5b",
                    }}
                    valueRender={() => (
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{niftyValues.lastPrice}</span>{" "}
                        <span>
                          ({niftyValues.change.toFixed(2)}
                          %)
                        </span>
                      </span>
                    )}
                  />
                </a>
              )}

              {nifty500Values && (
                <a
                  target="_blank"
                  href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${"CNX500"}`}
                >
                  <Statistic
                    title="Nifty 500"
                    valueStyle={{
                      color: nifty500Values.change > 0 ? "#5b9a5d" : "#e25f5b",
                      fontSize: 13,
                      width: 100,
                    }}
                    valueRender={() => (
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span> {nifty500Values.lastPrice} </span>{" "}
                        <span>
                          ({nifty500Values.change.toFixed(2)}
                          %){" "}
                        </span>
                      </span>
                    )}
                  />
                </a>
              )}
            </div>
          </Col>
        )}
        <Col
          xs={24}
          sm={24}
          lg={4}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <NiftyRenko />
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            ref={btnRefresh}
            onClick={() => setRefresh(refresh + 1)}
          />
          {/* <Button
            type="primary"
            size="small"
            icon={<SyncOutlined />}
            loading={loading}
            ref={btnRefreshAll}
            onClick={() => setRefreshAll(refreshAll + 1)}
          /> */}
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
        {!loading && (
          <>
            {!data.length && (
              <Result
                title="Your portfolio is empty"
                extra={
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => history.push("/notifications")}
                  >
                    Go to Notifications
                  </Button>
                }
              />
            )}
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
          </>
        )}
      </Row>{" "}
    </div>
  );
};

export default Alerts;
