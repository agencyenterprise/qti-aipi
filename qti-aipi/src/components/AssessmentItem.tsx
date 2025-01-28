import React, { useState } from 'react';
import type { AssessmentItem, OutcomeDeclaration, TemplateProcessing, Stylesheet } from '../types/assessment-item';
import { ItemBodyComponent } from './ItemBody';
import { BaseType, Cardinality, ResponseDeclaration } from '../types/qti-types';

interface AssessmentItemProps {
  /**
   * The assessment item data
   */
  item: AssessmentItem;

  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;

  /**
   * Callback when any response changes
   */
  onResponseChange?: (responseIdentifier: string, response: string | string[] | string[][]) => void;

  /**
   * Callback when the assessment item changes in edit mode
   */
  onItemChange?: (updates: Partial<AssessmentItem>) => void;

  /**
   * The current response values keyed by responseIdentifier
   */
  values?: Record<string, string | string[] | string[][]>;

  /**
   * The current outcome values keyed by outcomeIdentifier
   */
  outcomeValues?: Record<string, boolean>;
}

export const AssessmentItemComponent: React.FC<AssessmentItemProps> = ({
  item,
  isEditing = false,
  onResponseChange,
  onItemChange,
  values = {},
  outcomeValues = {}
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  // Validation helpers
  const validateResponseDeclaration = (declaration: ResponseDeclaration): boolean => {
    if (!declaration.identifier || !declaration.cardinality || !declaration.baseType) {
      return false;
    }
    return true;
  };

  const validateStringIdentifier = (value: string): boolean => {
    // xs:normalizedString validation
    return /^[^\s]+(\s[^\s]+)*$/.test(value);
  };

  const validateMaxAttempts = (value: number): boolean => {
    return value > 0;
  };

  const handleItemBodyChange = (updates: Partial<typeof item.itemBody>) => {
    if (!onItemChange) return;
    onItemChange({ itemBody: { ...item.itemBody, ...updates } });
  };

  const handleResponseDeclarationChange: (index: number, updates: Partial<ResponseDeclaration>) => void = (index, updates) => {
    if (!onItemChange || !item.responseDeclarations) return;
    const newDeclarations = [...item.responseDeclarations];
    const updatedDeclaration = { ...newDeclarations[index], ...updates };
    
    // Validate before updating
    if (validateResponseDeclaration(updatedDeclaration as ResponseDeclaration)) {
      newDeclarations[index] = updatedDeclaration;
      onItemChange({ responseDeclarations: newDeclarations });
    }
  };

  const handleOutcomeDeclarationChange = (index: number, updates: Partial<OutcomeDeclaration>) => {
    if (!onItemChange || !item.outcomeDeclarations) return;
    const newDeclarations = [...item.outcomeDeclarations];
    newDeclarations[index] = { ...newDeclarations[index], ...updates };
    onItemChange({ outcomeDeclarations: newDeclarations });
  };

  const handleTemplateProcessingChange = (updates: Partial<TemplateProcessing>) => {
    if (!onItemChange) return;
    onItemChange({
      templateProcessing: item.templateProcessing
        ? { ...item.templateProcessing, ...updates }
        : updates as TemplateProcessing
    });
  };

  const handleStylesheetChange = (index: number, updates: Partial<Stylesheet>) => {
    if (!onItemChange) return;
    const newStylesheets = [...(item.stylesheets || [])];
    newStylesheets[index] = { ...newStylesheets[index], ...updates };
    onItemChange({ stylesheets: newStylesheets });
  };

  const addStylesheet = () => {
    if (!onItemChange) return;
    const newStylesheet: Stylesheet = {
      href: '',
      type: 'text/css'
    };
    onItemChange({
      stylesheets: [...(item.stylesheets || []), newStylesheet]
    });
  };

  const removeStylesheet = (index: number) => {
    if (!onItemChange || !item.stylesheets) return;
    const newStylesheets = item.stylesheets.filter((_, i) => i !== index);
    onItemChange({ stylesheets: newStylesheets });
  };

  const handleStringIdentifierChange = (value: string) => {
    if (!onItemChange) return;
    if (value === '' || validateStringIdentifier(value)) {
      onItemChange({ stringIdentifier: value });
    }
  };

  const handleMaxAttemptsChange = (value: string) => {
    if (!onItemChange) return;
    const numValue = parseInt(value);
    if (!isNaN(numValue) && validateMaxAttempts(numValue)) {
      onItemChange({ maxAttempts: numValue });
    }
  };

  return (
    <div className="qti-assessment-item">
      {isEditing && (
        <div className="space-y-4">
          {/* Show all attributes toggle */}
          <div className="flex justify-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAllAttributes}
                onChange={(e) => setShowAllAttributes(e.target.checked)}
              />
              <span className="text-sm">Show all attributes</span>
            </label>
          </div>

          {/* Required Attributes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Identifier *</label>
              <input
                type="text"
                value={item.identifier}
                onChange={(e) => onItemChange?.({ identifier: e.target.value })}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onItemChange?.({ title: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Adaptive *</label>
              <input
                type="checkbox"
                checked={item.adaptive}
                onChange={(e) => onItemChange?.({ adaptive: e.target.checked })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time Dependent *</label>
              <input
                type="checkbox"
                checked={item.timeDependent}
                onChange={(e) => onItemChange?.({ timeDependent: e.target.checked })}
                required
              />
            </div>
          </div>

          {/* Optional Attributes */}
          {showAllAttributes && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Tool Name</label>
                  <input
                    type="text"
                    value={item.toolName || ''}
                    onChange={(e) => onItemChange?.({ toolName: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tool Version</label>
                  <input
                    type="text"
                    value={item.toolVersion || ''}
                    onChange={(e) => onItemChange?.({ toolVersion: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Language</label>
                  <input
                    type="text"
                    value={item.lang || ''}
                    onChange={(e) => onItemChange?.({ lang: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Label</label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => onItemChange?.({ label: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Base URI</label>
                  <input
                    type="text"
                    value={item.base || ''}
                    onChange={(e) => onItemChange?.({ base: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">String Identifier</label>
                  <input
                    type="text"
                    value={item.stringIdentifier || ''}
                    onChange={(e) => handleStringIdentifierChange(e.target.value)}
                    className="mt-1 block w-full"
                    pattern="^[^\s]+(\s[^\s]+)*$"
                    title="Must be a normalized string (no leading/trailing/consecutive whitespace)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Attempts</label>
                  <input
                    type="number"
                    value={item.maxAttempts || ''}
                    onChange={(e) => handleMaxAttemptsChange(e.target.value)}
                    min="1"
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Validate Responses</label>
                  <input
                    type="checkbox"
                    checked={item.validateResponses || false}
                    onChange={(e) => onItemChange?.({ validateResponses: e.target.checked })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Allow Review</label>
                  <input
                    type="checkbox"
                    checked={item.allowReview || false}
                    onChange={(e) => onItemChange?.({ allowReview: e.target.checked })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Show Feedback</label>
                  <input
                    type="checkbox"
                    checked={item.showFeedback || false}
                    onChange={(e) => onItemChange?.({ showFeedback: e.target.checked })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Show Solution</label>
                  <input
                    type="checkbox"
                    checked={item.showSolution || false}
                    onChange={(e) => onItemChange?.({ showSolution: e.target.checked })}
                  />
                </div>
              </div>

              {/* Stylesheets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Stylesheets</h3>
                  <button
                    onClick={addStylesheet}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    + Add Stylesheet
                  </button>
                </div>
                {item.stylesheets?.map((stylesheet, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                    <div>
                      <label className="block text-sm font-medium">HREF *</label>
                      <input
                        type="text"
                        value={stylesheet.href}
                        onChange={(e) => handleStylesheetChange(index, { href: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Type *</label>
                      <input
                        type="text"
                        value={stylesheet.type}
                        onChange={(e) => handleStylesheetChange(index, { type: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Media</label>
                      <input
                        type="text"
                        value={stylesheet.media || ''}
                        onChange={(e) => handleStylesheetChange(index, { media: e.target.value })}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Title</label>
                      <input
                        type="text"
                        value={stylesheet.title || ''}
                        onChange={(e) => handleStylesheetChange(index, { title: e.target.value })}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <button
                      onClick={() => removeStylesheet(index)}
                      className="text-red-600 hover:text-red-700 col-span-2"
                    >
                      Remove Stylesheet
                    </button>
                  </div>
                ))}
              </div>

              {/* Template Processing */}
              {item.templateProcessing && (
                <div className="space-y-2">
                  <h3 className="font-medium">Template Processing</h3>
                  <div className="space-y-2">
                    {item.templateProcessing.templateRules.map((rule, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                        <div>
                          <label className="block text-sm font-medium">Type</label>
                          <select
                            value={rule.type}
                            onChange={(e) => {
                              const newRules = [...item.templateProcessing!.templateRules];
                              newRules[index] = { ...rule, type: e.target.value as typeof rule.type };
                              handleTemplateProcessingChange({ templateRules: newRules });
                            }}
                            className="mt-1 block w-full"
                          >
                            <option value="setTemplateValue">Set Template Value</option>
                            <option value="setDefaultValue">Set Default Value</option>
                            <option value="setCorrectResponse">Set Correct Response</option>
                            <option value="templateCondition">Template Condition</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Expression</label>
                          <input
                            type="text"
                            value={rule.expression || ''}
                            onChange={(e) => {
                              const newRules = [...item.templateProcessing!.templateRules];
                              newRules[index] = { ...rule, expression: e.target.value };
                              handleTemplateProcessingChange({ templateRules: newRules });
                            }}
                            className="mt-1 block w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Identifier</label>
                          <input
                            type="text"
                            value={rule.identifier || ''}
                            onChange={(e) => {
                              const newRules = [...item.templateProcessing!.templateRules];
                              newRules[index] = { ...rule, identifier: e.target.value };
                              handleTemplateProcessingChange({ templateRules: newRules });
                            }}
                            className="mt-1 block w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Value</label>
                          <input
                            type="text"
                            value={rule.value || ''}
                            onChange={(e) => {
                              const newRules = [...item.templateProcessing!.templateRules];
                              newRules[index] = { ...rule, value: e.target.value };
                              handleTemplateProcessingChange({ templateRules: newRules });
                            }}
                            className="mt-1 block w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Declarations */}
              {item.responseDeclarations?.map((declaration, index) => (
                <div key={declaration.identifier} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium mb-2">Response Declaration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Identifier *</label>
                      <input
                        type="text"
                        value={declaration.identifier}
                        onChange={(e) => handleResponseDeclarationChange(index, { identifier: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Base Type *</label>
                      <select
                        value={declaration.baseType}
                        onChange={(e) => handleResponseDeclarationChange(index, { baseType: e.target.value as BaseType })}
                        className="mt-1 block w-full"
                        required
                      >
                        <option value="identifier">Identifier</option>
                        <option value="boolean">Boolean</option>
                        <option value="integer">Integer</option>
                        <option value="float">Float</option>
                        <option value="string">String</option>
                        <option value="point">Point</option>
                        <option value="pair">Pair</option>
                        <option value="directedPair">Directed Pair</option>
                        <option value="duration">Duration</option>
                        <option value="file">File</option>
                        <option value="uri">URI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Cardinality *</label>
                      <select
                        value={declaration.cardinality}
                        onChange={(e) => handleResponseDeclarationChange(index, { cardinality: e.target.value as Cardinality })}
                        className="mt-1 block w-full"
                        required
                      >
                        <option value="single">Single</option>
                        <option value="multiple">Multiple</option>
                        <option value="ordered">Ordered</option>
                        <option value="record">Record</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Template Identifier</label>
                      <input
                        type="text"
                        value={declaration.templateIdentifier || ''}
                        onChange={(e) => handleResponseDeclarationChange(index, { templateIdentifier: e.target.value })}
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Outcome Declarations */}
              {item.outcomeDeclarations?.map((declaration, index) => (
                <div key={declaration.identifier} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium mb-2">Outcome Declaration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Identifier *</label>
                      <input
                        type="text"
                        value={declaration.identifier}
                        onChange={(e) => handleOutcomeDeclarationChange(index, { identifier: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Cardinality *</label>
                      <select
                        value={declaration.cardinality}
                        onChange={(e) => handleOutcomeDeclarationChange(index, { cardinality: e.target.value as Cardinality })}
                        className="mt-1 block w-full"
                        required
                      >
                        <option value="single">Single</option>
                        <option value="multiple">Multiple</option>
                        <option value="ordered">Ordered</option>
                        <option value="record">Record</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Feedback */}
          {item.modalFeedback?.map((feedback, index) => (
            <div key={feedback.identifier} className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Modal Feedback</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Identifier *</label>
                  <input
                    type="text"
                    value={feedback.identifier}
                    onChange={(e) => {
                      const newFeedback = [...(item.modalFeedback || [])];
                      newFeedback[index] = { ...feedback, identifier: e.target.value };
                      onItemChange?.({ modalFeedback: newFeedback });
                    }}
                    className="mt-1 block w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Content *</label>
                  <textarea
                    value={feedback.content}
                    onChange={(e) => {
                      const newFeedback = [...(item.modalFeedback || [])];
                      newFeedback[index] = { ...feedback, content: e.target.value };
                      onItemChange?.({ modalFeedback: newFeedback });
                    }}
                    className="mt-1 block w-full"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Body */}
      <div className="mt-4">
        <ItemBodyComponent
          itemBody={item.itemBody}
          isEditing={isEditing}
          onResponseChange={onResponseChange}
          onItemBodyChange={handleItemBodyChange}
          values={values}
          outcomeValues={outcomeValues}
        />
      </div>

      {/* Modal Feedback */}
      {item.modalFeedback?.map(feedback => {
        const shouldShow = outcomeValues[feedback.outcomeIdentifier] && feedback.showHide === 'show';
        return shouldShow ? (
          <div
            key={feedback.identifier}
            className="mt-4 p-4 bg-blue-50 rounded"
          >
            {feedback.title && (
              <h3 className="font-medium mb-2">{feedback.title}</h3>
            )}
            <div dangerouslySetInnerHTML={{ __html: feedback.content }} />
          </div>
        ) : null;
      })}
    </div>
  );
}; 