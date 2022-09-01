type CodeViewSkeletonProps = {
  className?: string;
};

export default function CodeViewSkeleton({ className }: CodeViewSkeletonProps) {
  return <div className={`min-h-[20rem] grow bg-[#0d1117] ${className}`} />;
}
