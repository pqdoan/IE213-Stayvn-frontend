export default function Input(props) {
  return (
    <input
      {...props}
      style={{
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        width: "100%",
      }}
    />
  );
}
