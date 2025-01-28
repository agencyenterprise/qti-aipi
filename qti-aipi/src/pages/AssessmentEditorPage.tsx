import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { AssessmentTest } from '../types/qti';

interface Section {
  id: string;
  title: string;
  items: string[];
}

export default function AssessmentEditorPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);

  const assessment = useSelector((state: RootState) => 
    state.assessments.assessments.find(a => a.id === assessmentId)
  );

  useEffect(() => {
    if (assessment) {
      setTitle(assessment.title);
      // Transform assessment sections into our format
      setSections(assessment.testParts[0]?.assessmentSections || []);
    }
  }, [assessment]);

  const handleAddSection = () => {
    setIsAddingSectionOpen(true);
  };

  const handleSaveSection = (sectionTitle: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: sectionTitle,
      items: []
    };
    setSections([...sections, newSection]);
    setIsAddingSectionOpen(false);
  };

  const handleSaveAssessment = () => {
    const assessmentData: AssessmentTest = {
      id: assessmentId || crypto.randomUUID(),
      title,
      qtiVersion: '3.0',
      testParts: [{
        identifier: 'part1',
        navigationMode: 'linear',
        submissionMode: 'individual',
        assessmentSections: sections
      }],
      outcomeDeclarations: [],
      metadata: {
        toolName: 'QTI Editor',
        toolVersion: '1.0'
      }
    };

    if (assessmentId) {
      dispatch({ type: 'assessments/updateAssessment', payload: assessmentData });
    } else {
      dispatch({ type: 'assessments/addAssessment', payload: assessmentData });
    }
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {assessmentId ? 'Edit Assessment' : 'Create New Assessment'}
        </h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Assessment Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter assessment title"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
          <button
            onClick={handleAddSection}
            className="btn-primary"
          >
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`p-4 rounded-lg border ${
                activeSection === section.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveSection(
                      activeSection === section.id ? null : section.id
                    )}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {activeSection === section.id ? 'Collapse' : 'Expand'}
                  </button>
                  <button
                    onClick={() => {
                      setSections(sections.filter(s => s.id !== section.id));
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {activeSection === section.id && (
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {section.items.length} items
                    </span>
                    <button
                      onClick={() => {
                        // TODO: Implement item selection modal
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Add Items
                    </button>
                  </div>
                  {section.items.length > 0 ? (
                    <div className="space-y-2">
                      {section.items.map((itemId, index) => (
                        <div
                          key={itemId}
                          className="flex justify-between items-center p-2 bg-white rounded border border-gray-200"
                        >
                          <span className="text-sm text-gray-900">
                            Item {index + 1}
                          </span>
                          <button
                            onClick={() => {
                              const newItems = [...section.items];
                              newItems.splice(index, 1);
                              setSections(sections.map(s =>
                                s.id === section.id
                                  ? { ...s, items: newItems }
                                  : s
                              ));
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No items added to this section
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAddingSectionOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Section
            </h3>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mb-4"
              placeholder="Enter section title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveSection(e.currentTarget.value);
                }
              }}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingSectionOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  handleSaveSection(input.value);
                }}
                className="btn-primary"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAssessment}
          className="btn-primary"
        >
          Save Assessment
        </button>
      </div>
    </div>
  );
} 