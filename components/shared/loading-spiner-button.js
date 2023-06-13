const LoadingSpinnerButton = () => {
  return (
    <div className="flex items-center">
      <div className="border border-solid border-gray-300 border-t-4 rounded-full w-5 h-5 animate-spin mr-2"></div>
      <span>Loading...</span>
    </div>
  );
};

export default LoadingSpinnerButton;
