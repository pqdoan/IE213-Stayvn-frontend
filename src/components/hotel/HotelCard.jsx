import { useNavigate } from "react-router-dom";
import Card from "../common/Card";

export default function HotelCard({ hotel }) {
  const nav = useNavigate();

  return (
    <Card>
      <div onClick={() => nav(`/hotel/${hotel.id}`)}>
        <h3>{hotel.name}</h3>
        <p>{hotel.location}</p>
        <strong>{hotel.price}₫</strong>
      </div>
    </Card>
  );
}
