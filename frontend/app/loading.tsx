import LoadingIndicator from "@/src/components/ui/LoadingIndicator";

export default function Loading() {
  return (
    <LoadingIndicator
      label="Loading page..."
      fullScreen
      className="flex-col"
    />
  );
}
