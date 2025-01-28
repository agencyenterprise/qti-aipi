import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { addTest, deleteTest } from '../store/slices/assessmentsSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { AssessmentTest } from '../types/qti-types';

const AssessmentList = () => {
  const dispatch = useDispatch();
  const { tests } = useSelector((state: RootState) => state.assessments);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateAssessment = () => {
    if (!newTitle.trim()) return;

    const newTest: AssessmentTest = {
      id: uuidv4(),
      title: newTitle.trim(),
      testParts: [
        {
          id: uuidv4(),
          identifier: 'part1',
          sections: [],
          navigationMode: 'linear',
          submissionMode: 'individual',
        },
      ],
    };

    dispatch(addTest(newTest));
    setNewTitle('');
    setShowNewModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Assessments</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Assessment
        </button>
      </div>

      {/* Assessment List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {tests.map((test) => (
            <li key={test.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {test.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {test.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/assessments/${test.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => dispatch(deleteTest(test.id))}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {tests.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No assessments yet. Create one to get started.
            </li>
          )}
        </ul>
      </div>

      {/* New Assessment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Create New Assessment</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assessment Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssessment}
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

export default AssessmentList; 