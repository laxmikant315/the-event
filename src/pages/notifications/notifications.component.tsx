import {
  Avatar,
  Button,
  Col,
  List,
  Popconfirm,
  Popover,
  Row,
  Skeleton,
  Space,
  Switch,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { ReloadOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
import StockCard from "../stock-card/stock-card.component";
import AlertStockCard from "../alerts/alerts-stock-card.component";
import { Input } from "antd";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/api/v1/main";

const { Search } = Input;

const Notifications = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(
        `${serverUrl}/notifications/${index}${
          searchInput ? "/" + searchInput : ""
        }`,
        {
          timeout: 100000,
        }
      );
      const datesSet: any = new Set(
        alerts.data.map((x: any) => x["date_created"].slice(0, 10))
      );
      setDates([...datesSet]);
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index, refresh, searchInput]);

  const onSearch = (value: string) => setSearchInput(value);
  return (
    <div
      className="site-card-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ marginLeft: 20 }}>
            Notification Center
          </Title>
          <Search
            placeholder="Search"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </Col>
        <Col>
          <Space>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => setRefresh(refresh + 1)}
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
            <>
              {dates &&
                dates.map((date: string) => {
                  const filtered = data.filter(
                    (x: any) => x["date_created"].slice(0, 10) === date
                  );
                  const soldItems: any = filtered.filter((x: any) =>
                    x.heading.toLowerCase().includes("sold")
                  );
                  const sum: any = soldItems.reduce(
                    (x: any, y: any) => {
                      const xAmount =
                        (x.heading &&
                          parseFloat(
                            x.heading.split(" ")[
                              x.heading.split(" ").indexOf("₹") + 1
                            ]
                          )) ||
                        0;
                      const yAmount =
                        (y.heading &&
                          parseFloat(
                            y.heading.split(" ")[
                              y.heading.split(" ").indexOf("₹") + 1
                            ]
                          )) ||
                        0;
                      return { heading: "₹ " + (xAmount + yAmount) };
                    },
                    { heading: "₹ 0" }
                  );
                  const sumAmount = +sum.heading.split(" ")[1];

                  return (
                    <Row
                      justify="center"
                      style={{
                        margin: 20,
                        background: "#0303037a",
                        borderRadius: 10,
                      }}
                    >
                      <Col>
                        <Title level={5}>
                          {" "}
                          {moment(date).format("DD MMM YYYY")}
                          {sumAmount ? (
                            <span
                              style={{
                                color: sumAmount > 0 ? "#73d13d" : "#ff4d4f",
                              }}
                            >
                              {"  ₹ " + sumAmount.toFixed(2)}
                            </span>
                          ) : (
                            ""
                          )}
                        </Title>
                      </Col>
                      <Col lg={24} xs={24} sm={24} xl={24}>
                        <List
                          size="small"
                          style={{ margin: 5 }}
                          itemLayout="horizontal"
                          dataSource={filtered}
                          renderItem={(item: any) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    style={{ backgroundColor: "#87d068" }}
                                    icon={<NotificationOutlined />}
                                  />
                                }
                                title={
                                  <Popover
                                    trigger={"click"}
                                    content={
                                      <AlertStockCard alertId={item.alert_id} />
                                    }
                                  >
                                    <a>{item.heading}</a>
                                  </Popover>
                                }
                                description={item.contents}
                              />
                            </List.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  );
                })}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default Notifications;
