"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner(
  { size = "md", message }: LoadingSpinnerProps,
) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${
          sizeClasses[size]
        } border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      >
      </div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          {message}
        </p>
      )}
    </div>
  );
}
