import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function PreviewPage() {
  const { itemId } = useParams();
  
  const item = useSelector((state: RootState) => 
    itemId ? state.questionBank.items.find(item => item.id === itemId) : null
  );

  if (!item) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Item not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The requested item could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {item.title}
          </h3>
          <div className="mt-5">
            {item.itemBody.interactions.map((interaction, index) => (
              <div key={index} className="mt-4">
                <p className="text-base text-gray-700">{interaction.prompt}</p>
                {/* TODO: Render interaction based on type */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 