const Button = ({ children, variant = "primary", className = "", ...props }) => {
  let buttonClassName = "btn";

  if (variant === "outline") buttonClassName += " btn-outline";
  if (variant === "danger") buttonClassName += " btn-danger";
  if (className) buttonClassName += ` ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
