import { Avatar, Button, Col, List, Row, Skeleton, Space, Switch } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { ReloadOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
const serverUrl = process.env.REACT_APP_SERVER_URL;
const Notifications = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(`${serverUrl}/notifications/${index}`, {
        timeout: 100000,
      });
      const datesSet: any = new Set(
        alerts.data.map((x: any) => x["date_created"].slice(0, 10))
      );
      setDates([...datesSet]);
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index, refresh]);
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
                  return (
                    <Row
                      justify="center"
                      style={{
                        margin: 20,
                        background: "#030303",
                        borderRadius: 10,
                      }}
                    >
                      <Col>
                        <Title level={5}>
                          {" "}
                          {moment(date).format("DD MMM YYYY")}
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
                                  <a href="https://ant.design">
                                    {item.heading}
                                  </a>
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
