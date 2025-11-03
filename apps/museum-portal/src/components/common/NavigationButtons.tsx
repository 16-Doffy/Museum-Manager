import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiHome } from 'react-icons/fi';

interface NavigationButtonsProps {
  currentPage: string;
  nextPage?: string;
  nextPageTitle?: string;
}

export default function NavigationButtons({ 
  currentPage, 
  nextPage, 
  nextPageTitle 
}: NavigationButtonsProps) {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNextPage = () => {
    if (nextPage) {
      navigate(nextPage);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      {/* Back to Dashboard */}
      <button
        onClick={handleBackToDashboard}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiHome className="w-4 h-4" />
        Về Dashboard
      </button>

      {/* Current Page Title */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">{currentPage}</h2>
      </div>

      {/* Next Page */}
      {nextPage && nextPageTitle && (
        <button
          onClick={handleNextPage}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors"
        >
          {nextPageTitle}
          <FiArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
