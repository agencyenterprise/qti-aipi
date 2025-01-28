import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import InteractionRenderer from '../components/interactions/InteractionRenderer';

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
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
            {item.title}
          </h3>
          <div className="space-y-6">
            {item.itemBody.interactions.map((interaction, index) => (
              <InteractionRenderer
                key={index}
                interaction={interaction}
                mode="preview"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 