interface ErrorStateProps {
  title?: string;
  message?: string;
}

const ErrorState = ({ 
  title = "Package Not Found", 
  message = "The package you're looking for doesn't exist or has been removed." 
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;