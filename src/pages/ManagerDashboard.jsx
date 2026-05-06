import Card from "../components/common/Card";

export default function ManagerDashboard() {
  return (
    <div>
      <h2>Dashboard</h2>

      <div className="grid grid-3">
        <Card>Booking: 48</Card>
        <Card>Revenue: 82M</Card>
        <Card>Pending: 5</Card>
      </div>
    </div>
  );
}
