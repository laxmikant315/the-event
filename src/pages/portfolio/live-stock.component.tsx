import { Alert, Button, Card, Descriptions, Modal, Tag } from "antd";
import Meta from "antd/lib/card/Meta";
import moment from "moment";
import { useState } from "react";

export default ({ data }: any) => {


    const { update_date,our_buy_or_sell, indmoney_buy_or_sell, new_sentiments_count: { positive, negative }, latest_news } = data

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const title = `LIVE: ${our_buy_or_sell}`
    return <>
        <Tag style={{ cursor: 'pointer' }} color={our_buy_or_sell === "BUY" ? "green" : our_buy_or_sell === "SELL" ? "red" : "blue"} onClick={showModal}>
            {title}
        </Tag >
        <Modal title={title}  visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Descriptions title="Details">
                <Descriptions.Item label="Updated">{moment(update_date).fromNow()
                }</Descriptions.Item>
                <Descriptions.Item label="IndMoney">{indmoney_buy_or_sell
                }</Descriptions.Item>

                <Descriptions.Item label="Positive News">{positive||0}</Descriptions.Item>

                <Descriptions.Item label="Negative News">{negative||0}</Descriptions.Item>

            </Descriptions>
            {latest_news && (() => {
                const { date, latest_news_how_much_old_day, sentiment, news: { description, title ,image} } = latest_news

                return <><Descriptions title="Latest News">
                    

                    <Descriptions.Item label="How many weekdays old">{latest_news_how_much_old_day} days</Descriptions.Item>



                </Descriptions>
                    {latest_news && <Alert
                        message={title}
                        icon={<img src={image?.png}></img>}
                        description={description}
                        type={sentiment === "positive" ? "success" : sentiment === "negative" ? "error" : 'info'}
                        showIcon
                    />
                    }

                </>

            })()}

        </Modal>
    </>
}