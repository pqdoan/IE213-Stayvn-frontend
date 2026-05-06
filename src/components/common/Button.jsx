const Button = ({ children, variant = "primary", ...props }) => {
  let className = "btn";

  if (variant === "outline") className += " btn-outline";
  if (variant === "danger") className += " btn-danger";

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
