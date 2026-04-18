const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/5 dark:bg-white/10
        rounded-xl

        ${className}
      `}
    >
      {/* shimmer */}
      <div
        className="
          absolute inset-0
          -translate-x-full
          animate-[shimmer_1.5s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />
    </div>
  );
};

export default Skeleton;