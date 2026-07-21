import { Alert, Button, Descriptions, Modal, Tag } from "antd";
import moment from "moment";
import { useState } from "react";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";

const serverUrl = `${process.env.REACT_APP_SERVER_URL}/api/v1/main`;

export default ({ data }: any) => {
	console.log({ data })
	const {
		update_date,
		our_buy_or_sell,
		indmoney_buy_or_sell,
		news_sentiments_count,
		latest_news,
		insights,
		stock_name,
		symbol,
		liveData
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
				<Descriptions
					title={
						<>
							<a href={indUrl} target="_blank" rel="noopener noreferrer">
								IndMoney
							</a>
							<Button
								type="text"
								size="small"
								target="_blank"
								icon={<ReloadOutlined />}
								href={`${serverUrl}/check_stock_details_today/${symbol}`}
							/>

						</>
					}
				>
					<Descriptions.Item label="Updated">
						{moment(update_date, moment.ISO_8601, true).fromNow()}
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
				<Descriptions title={"Live Data"}>
					<Descriptions.Item label="RSI">
						{liveData.rsi || 0}
					</Descriptions.Item>

					<Descriptions.Item label="MacD">
						{liveData.macd.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="SMA">
						{liveData.sma.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="EMA">
						{liveData.ema.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="ATR">
						{liveData.atr.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="BB High">
						{liveData.bb_high.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="BB Low">
						{liveData.bb_low.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="MacD Signal">
						{liveData.macd_signal.toFixed(2) || 0}
					</Descriptions.Item>
					<Descriptions.Item label="MacD Diff">
						{liveData.macd_diff.toFixed(2) || 0}
					</Descriptions.Item>

				</Descriptions>
			</Modal>
		</>
	);
};
