const Badge = ({ children, type = "default" }) => {
  let className = "badge";

  if (type === "success") className += " badge-success";
  if (type === "warning") className += " badge-warning";
  if (type === "danger") className += " badge-danger";
  if (type === "info") className += " badge-info";

  return <span className={className}>{children}</span>;
};

export default Badge;
