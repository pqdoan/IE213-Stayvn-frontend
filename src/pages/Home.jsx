import HotelCard from "../components/hotel/HotelCard";

const data = [
  { id: 1, name: "Resort Nha Trang", location: "Nha Trang", price: 800000 },
  { id: 2, name: "Hotel Đà Nẵng", location: "Đà Nẵng", price: 600000 },
];

export default function Home() {
  return (
    <div>
      <h1>Khách sạn nổi bật</h1>

      <div className="grid grid-3">
        {data.map((h) => (
          <HotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </div>
  );
}
