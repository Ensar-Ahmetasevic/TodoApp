const ErrorNotification = ({ error }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-red-500 text-white rounded-lg p-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 4v2m-7-7l-4 4m0 0l4 4m-4-4h18"
            />
          </svg>
          <span className="font-semibold">Error:</span>
          <span className="ml-2">{error.message}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
