import React, { useState, useEffect } from "react";
import "./TextEntryInteraction.css";
import TextEntryPresentationFactory from "./TextEntryPresentationFactory";

interface TextEntryInteractionProps {
  /**
   * The identifier of the response variable associated with this interaction.
   */
  responseIdentifier: string;

  /**
   * Expected length hint for the response box size
   */
  expectedLength?: string;

  /**
   * Regular expression pattern that response must match
   */
  patternMask?: string;

  /**
   * Custom error message for pattern validation
   */
  patternMaskMessage?: string;

  /**
   * Placeholder text for speech-based environments
   */
  placeholderText?: string;

  /**
   * Format of entered text
   */
  format?: string;

  /**
   * Maximum length override
   */
  maxlength?: string;

  /**
   * Full class list from the node
   */
  className?: string;

  /**
   * Spellcheck override
   */
  spellcheck?: string;

  /**
   * Callback when value changes
   */
  onChange?: (data: { response: string; state?: any }) => void;

  /**
   * Callback when component is ready
   */
  onReady?: (data: { node: any }) => void;

  /**
   * Initial/controlled value
   */
  value?: string;
}

const TextEntryInteraction: React.FC<TextEntryInteractionProps> = ({
  responseIdentifier,
  expectedLength,
  patternMask,
  patternMaskMessage = "Invalid Input",
  placeholderText = "",
  format = "",
  maxlength = "500",
  spellcheck = "false",
  className = "",
  onChange = () => {},
  onReady = () => {},
  value = "",
}) => {
  const [response, setResponse] = useState(value);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [state, setState] = useState<any>({});

  // Create presentation factory instance with full class list
  const presentationFactory = new TextEntryPresentationFactory(className);
  const effectiveMaxLength = presentationFactory.isOrientationVertical()
    ? presentationFactory.getVerticalMaxLength().toString()
    : maxlength;

  // Compute validity status
  const computeIsValid = (value: string): boolean => {
    // A null response is invalid
    if (value === null) return false;
    // An empty string is invalid
    if (value.length < 1) return false;
    // If pattern mask exists, test against it
    if (patternMask && !new RegExp(patternMask).test(value)) return false;
    // text entry interaction with a non-null response is valid
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setResponse(newValue);

    // Validate response
    const isValidResponse = computeIsValid(newValue);
    setIsValid(isValidResponse);

    // Update state
    const newState = {};
    setState(newState);

    onChange({
      response: newValue,
      state: newState,
    });
  };

  useEffect(() => {
    // Initialize component
    const node = {
      getResponse: () => response,
      setResponse: (val: string) => {
        setResponse(val || "");
        setIsValid(computeIsValid(val || ""));
      },
      setIsDisabled: (disabled: boolean) => setIsDisabled(disabled),
      getState: () => state,
      setState: (newState: any) => setState(newState),
      getIsValid: () => isValid,
      setIsValid: (valid: boolean) => setIsValid(valid),
    };

    onReady({
      node,
    });
  }, []);

  return (
    <span className={`qti-text-entry-interaction ${presentationFactory.getWidthClass()} ${presentationFactory.getOrientationClass()}`}>
      <input
        type="text"
        className="text-entry-default"
        value={response}
        onChange={handleChange}
        disabled={isDisabled}
        placeholder={placeholderText}
        maxLength={parseInt(effectiveMaxLength)}
        spellCheck={spellcheck === "true"}
        pattern={patternMask}
        title={patternMaskMessage}
      />
    </span>
  );
};

export default TextEntryInteraction;
