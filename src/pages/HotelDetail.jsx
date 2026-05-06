import { useParams } from "react-router-dom";

export default function Detail() {
  const { id } = useParams();

  return (
    <div>
      <h2>Chi tiết khách sạn #{id}</h2>
      <button>Đặt phòng</button>
    </div>
  );
}
