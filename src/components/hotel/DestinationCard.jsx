import "./DestinationCard.css";

const DestinationCard = ({ destination }) => {
  // Kiểm tra dữ liệu đầu vào
  if (!destination) {
    console.warn("DestinationCard: destination prop is missing!");
    return null;
  }

  const { name, description, image } = destination;

  return (
    <div className="destination-card">
      <img
        src={image || "https://via.placeholder.com/300x200"}
        alt={name || "Điểm đến"}
        className="destination-image"
      />
      <div className="destination-info">
        <h3>{name || "Chưa có tên"}</h3>
        <p>{description || "Chưa có mô tả"}</p>
        <button className="btn-gold">Khám phá ngay</button>
      </div>
    </div>
  );
};

export default DestinationCard;
