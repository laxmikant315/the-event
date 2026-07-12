import { Alert,  Descriptions, Modal, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default ({ data }: any) => {
	const {
		update_date,
		our_buy_or_sell,
		indmoney_buy_or_sell,
		news_sentiments_count,
		latest_news,
        insights,
        stock_name
	} = data;

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
	const title = `LIVE: ${our_buy_or_sell}`;
	const indUrl = `https://www.indstocks.com/app/stocks/explore/${stock_name}-share-price`;

	return (
		<>
			<Tag
				style={{ cursor: "pointer" }}
				color={
					our_buy_or_sell === "BUY"
						? "green"
						: our_buy_or_sell === "SELL"
							? "red"
							: "blue"
				}
				onClick={showModal}
			>
				{title}
			</Tag>

			<Modal
				title={title}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				
				<Descriptions title={<a href={indUrl} target="_blank" rel="noopener noreferrer">
					IndMoney
				</a>}>
					<Descriptions.Item label="Updated">
						{moment(update_date).fromNow()}
					</Descriptions.Item>
					<Descriptions.Item label="IndMoney">
						{indmoney_buy_or_sell}
					</Descriptions.Item>

				
				</Descriptions>
                <Descriptions title={"Insights"}>
					
					<Descriptions.Item label="Positive Insights">
						{insights.positive || 0}
					</Descriptions.Item>

					<Descriptions.Item label="Negative Insights">
						{insights.negative || 0}
					</Descriptions.Item>
                    <Descriptions.Item label="Neutral Insights">
						{insights.neutral || 0}
					</Descriptions.Item>
				</Descriptions>
				{latest_news &&
					(() => {
						const {
							latest_news_how_much_old_day,
							sentiment,
							news: { description, title, image },
						} = latest_news;

						return (
							<>
								<Descriptions title="Latest News">
									<Descriptions.Item label="Positive News">
										{news_sentiments_count?.positive || 0}
									</Descriptions.Item>

									<Descriptions.Item label="Negative News">
										{news_sentiments_count?.negative || 0}
									</Descriptions.Item>

									<Descriptions.Item label="How old">
										{latest_news_how_much_old_day} days
									</Descriptions.Item>
								</Descriptions>
								{latest_news && (
									<Alert
										message={title}
										icon={<img src={image?.png}></img>}
										description={description}
										type={
											sentiment === "positive"
												? "success"
												: sentiment === "negative"
													? "error"
													: "info"
										}
										showIcon
									/>
								)}
							</>
						);
					})()}
			</Modal>
		</>
	);
};
