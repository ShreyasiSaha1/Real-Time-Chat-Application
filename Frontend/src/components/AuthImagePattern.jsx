const AuthImagePattern = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center bg-base-200 p-12 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
               className={`w-20 h-20 rounded-xl bg-[#1f1f3a] shadow-md transition duration-300 transform hover:scale-105 hover:bg-[#2a2a45] hover:shadow-lg ${
               i % 2 === 0 ? "animate-pulse" : ""
          }`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-2">Join our community</h2>
        <p className="text-sm text-gray-400 max-w-xs">
          Connect with friends, share moments, and stay in touch with your loved ones.
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
