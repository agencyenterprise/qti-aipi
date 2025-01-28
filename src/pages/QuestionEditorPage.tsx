import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AssessmentItemForm from '../components/forms/AssessmentItemForm';
import type { AssessmentItem } from '../types/qti';

export default function QuestionEditorPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const item = useSelector((state: RootState) =>
    itemId ? state.questionBank.items.find(item => item.id === itemId) : undefined
  );

  const handleSave = () => {
    navigate('/question-bank');
  };

  const handleCancel = () => {
    navigate('/question-bank');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {itemId ? 'Edit Question' : 'Create New Question'}
          </h1>
          <AssessmentItemForm
            item={item}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
} 