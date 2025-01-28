import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  addItem,
  deleteItem,
  setFilters,
} from '../store/slices/questionBankSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { AssessmentItem, InteractionType } from '../types/qti-types';

const interactionTypes: InteractionType[] = [
  'choice',
  'order',
  'text-entry',
  'extended-text',
  'match',
  'gap-match',
  'slider',
  'hotspot',
];

const QuestionBank = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector((state: RootState) => state.questionBank);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<AssessmentItem>>({
    title: '',
    prompt: '',
    interactionType: 'choice',
  });

  const handleCreateItem = () => {
    if (!newItem.title?.trim() || !newItem.prompt?.trim()) return;

    const item: AssessmentItem = {
      id: uuidv4(),
      identifier: `item-${uuidv4()}`,
      title: newItem.title.trim(),
      prompt: newItem.prompt.trim(),
      interactionType: newItem.interactionType as InteractionType,
      correctResponse: {
        cardinality: 'single',
        baseType: 'identifier',
        correctResponse: [],
      },
    };

    dispatch(addItem(item));
    setNewItem({
      title: '',
      prompt: '',
      interactionType: 'choice',
    });
    setShowNewModal(false);
  };

  const filteredItems = items.filter((item) => {
    if (filters.interactionType && item.interactionType !== filters.interactionType) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.prompt.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Question Bank</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Question
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.searchQuery || ''}
                onChange={(e) =>
                  dispatch(setFilters({ ...filters, searchQuery: e.target.value }))
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.interactionType || ''}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    ...filters,
                    interactionType: e.target.value || undefined,
                  })
                )
              }
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              {interactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <li key={item.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.prompt}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.interactionType}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => dispatch(deleteItem(item.id))}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredItems.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No questions found. Create one to get started.
            </li>
          )}
        </ul>
      </div>

      {/* New Question Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Create New Question</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question Prompt
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  value={newItem.prompt}
                  onChange={(e) =>
                    setNewItem({ ...newItem, prompt: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question Type
                </label>
                <select
                  id="type"
                  value={newItem.interactionType}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      interactionType: e.target.value as InteractionType,
                    })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  {interactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
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

export default QuestionBank; 