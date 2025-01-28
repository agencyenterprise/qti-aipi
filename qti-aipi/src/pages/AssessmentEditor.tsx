import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  updateTest,
  addSection,
  addItemToSection,
} from '../store/slices/assessmentsSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { AssessmentSection, AssessmentItem } from '../types/qti-types';

const AssessmentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const test = useSelector((state: RootState) =>
    state.assessments.tests.find((t) => t.id === id)
  );
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    if (!test) {
      navigate('/assessments');
    }
  }, [test, navigate]);

  if (!test) return null;

  const handleCreateSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: AssessmentSection = {
      id: uuidv4(),
      identifier: `section-${uuidv4()}`,
      title: newSectionTitle.trim(),
      items: [],
      required: true,
      visible: true,
    };

    dispatch(addSection({ testId: test.id, section: newSection }));
    setNewSectionTitle('');
    setShowNewSectionModal(false);
  };

  const handleAddItem = (sectionId: string, item: AssessmentItem) => {
    dispatch(addItemToSection({ testId: test.id, sectionId, item }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/assessments')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {test.title}
            </h1>
            <p className="text-sm text-gray-500">
              {test.description || 'No description'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewSectionModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Section
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {test.testParts[0]?.sections.map((section) => (
          <div
            key={section.id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {section.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {section.items.length} items
                </p>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement item selection modal
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {section.items.map((item) => (
                  <li key={item.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.prompt}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {item.interactionType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {section.items.length === 0 && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No items in this section. Add some to get started.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* New Section Modal */}
      {showNewSectionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Create New Section</h2>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Section Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewSectionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSection}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentEditor; 