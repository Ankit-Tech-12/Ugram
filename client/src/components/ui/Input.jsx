const Input = ({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <label className="text-xs sm:text-sm text-subtext">
          {label}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        className={`
          w-full
          px-3 sm:px-4
          py-2.5 sm:py-3
          rounded-xl

          bg-card text-text
          border border-border

          text-sm sm:text-base

          placeholder:text-subtext

          focus:outline-none
          focus:ring-2 focus:ring-primary

          transition-all duration-200

          ${error ? "border-red-500 ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />

      {/* Error */}
      {error && (
        <span className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;