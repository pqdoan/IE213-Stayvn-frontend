import "./DestinationCard.css";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();

  if (!destination) {
    console.warn("DestinationCard: destination prop is missing!");
    return null;
  }

  const { name, description, image } = destination;

  const handleExplore = () => {
    navigate("/hotels");
  };

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

        <button className="btn-gold" onClick={handleExplore}>
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
