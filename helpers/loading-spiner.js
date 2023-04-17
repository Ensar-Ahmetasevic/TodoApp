const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-2"></div>
      <p className="text-white text-sm font-semibold">Loading...</p>
      <p className="text-white text-sm font-semibold">Please wait</p>
    </div>
  );
};

export default LoadingSpinner;
