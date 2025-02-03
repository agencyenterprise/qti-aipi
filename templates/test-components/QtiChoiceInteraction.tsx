import React, { useEffect, useRef, useState } from "react";
import { Choice } from "./qti";
import "./QtiChoiceInteraction.css";
import ChoiceGroup from "./ChoiceGroup";

type CardinalityType = "single" | "multiple";

const isMultipleCardinality = (cardinality: CardinalityType): boolean =>
  cardinality === "multiple";

interface ExtendedChoice extends Choice {
  identifier: string;
  isChecked?: () => boolean;
  setCorrectSolution?: () => void;
  setIncorrectSolution?: () => void;
  setExpectedSolution?: () => void;
  setIgnoreSolution?: () => void;
  setIsDisabled?: (disabled: boolean) => void;
  setChecked?: (checked: boolean) => void;
  setTabIndex?: (index: string) => void;
  setFocus?: () => void;
}

export interface QtiChoiceInteractionProps {
  responseIdentifier: string;
  maxChoices?: string;
  minChoices?: string;
  shuffle?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  dataMaxSelectionsMessage?: string;
  dataMinSelectionsMessage?: string;
  children: React.ReactNode;
  onResponseChange?: (identifier: string, value: any) => void;
  response?: any;
  prompt?: React.ReactNode;
  cardinality?: CardinalityType;
}

const QtiChoiceInteraction: React.FC<QtiChoiceInteractionProps> = ({
  responseIdentifier,
  maxChoices = "1",
  minChoices = "0",
  shuffle = "false",
  orientation,
  className = "",
  dataMaxSelectionsMessage,
  dataMinSelectionsMessage,
  children,
  onResponseChange,
  response,
  prompt,
  cardinality: propCardinality = "single",
}) => {
  const [responseState, setResponseState] = useState<string | string[] | null>(
    null
  );
  const [state, setState] = useState<any>(null);
  const [isValidResponse, setIsValidResponse] = useState(false);
  const [cardinality, setCardinality] = useState<CardinalityType>("single");
  const [minSelectionsMessage, setMinSelectionsMessage] = useState("");
  const [maxSelectionsMessage, setMaxSelectionsMessage] = useState("");
  const [choices, setChoices] = useState<ExtendedChoice[]>([]);
  const [firstChoice, setFirstChoice] = useState<ExtendedChoice | null>(null);
  const [lastChoice, setLastChoice] = useState<ExtendedChoice | null>(null);
  const [currentChoice, setCurrentChoice] = useState<ExtendedChoice | null>(
    null
  );
  const [isRadio, setIsRadio] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [priorState, setPriorState] = useState<any>(null);
  const [isQtiValid, setIsQtiValid] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);

  // Initialize component
  useEffect(() => {
    try {
      // Use the provided cardinality prop
      const computedCardinality = propCardinality;


      setCardinality(computedCardinality);
      setIsRadio(!isMultipleCardinality(computedCardinality));
      setIsShuffle(shuffle === "true");

      // Compute messages
      computeMaxSelectionsMessage();
      computeMinSelectionsMessage();

      // Get prior state if any
      const priorStateData = getPriorState(responseIdentifier);
      setPriorState(priorStateData);

      // Validate props
      validateProps();

      // Notify store of interaction (mock for now)
      if (rootRef.current) {
        defineInteraction();
      }
    } catch (err) {
      console.error("[QtiChoiceInteraction][Error]", err);
      setIsQtiValid(false);
      throw err;
    }
  }, [responseIdentifier, shuffle, propCardinality]);

  const validateProps = () => {
    if (!responseIdentifier) {
      throw new Error("responseIdentifier is required");
    }

    // Validate maxChoices and minChoices
    const maxChoicesNum = parseInt(maxChoices);
    const minChoicesNum = parseInt(minChoices);

    if (maxChoicesNum < minChoicesNum) {
      throw new Error("maxChoices must be greater than or equal to minChoices");
    }
  };

  const defineInteraction = () => {
    // Mock store.defineInteraction for now
    console.log("Defining interaction:", {
      identifier: responseIdentifier,
      interactionType: "Choice",
      node: {
        resetValue,
        getIsValid: () => isValidResponse,
        getInvalidResponseMessage: () => minSelectionsMessage,
      },
      resetValue,
      isValidResponse,
      invalidResponseMessage: minSelectionsMessage,
      maxSelectionsMessage,
    });
  };

  const computeMaxSelectionsMessage = () => {
    if (dataMaxSelectionsMessage) {
      setMaxSelectionsMessage(dataMaxSelectionsMessage);
      return;
    }
    const maxChoicesNum = parseInt(maxChoices);
    setMaxSelectionsMessage(
      maxChoicesNum === 0
        ? ""
        : `You are permitted a maximum of ${maxChoicesNum} choice${
            maxChoicesNum > 1 ? "s" : ""
          } for this question.\n\nPlease unselect one of your choices before making another choice.`
    );
  };

  const computeMinSelectionsMessage = () => {
    if (dataMinSelectionsMessage) {
      setMinSelectionsMessage(dataMinSelectionsMessage);
      return;
    }
    const minChoicesNum = parseInt(minChoices);
    setMinSelectionsMessage(
      minChoicesNum === 0
        ? ""
        : `You must make at least ${minChoicesNum} choice${
            minChoicesNum > 1 ? "s" : ""
          } for this question.`
    );
  };

  const getPriorState = (identifier: string) => {
    // This should come from store
    return null;
  };

  const handleChoiceGroupReady = (data: {
    choices: ExtendedChoice[];
    firstChoice: ExtendedChoice | null;
    lastChoice: ExtendedChoice | null;
  }) => {
    setChoices(data.choices);
    setFirstChoice(data.firstChoice);
    setLastChoice(data.lastChoice);

    if (isRadio && data.firstChoice) {
      data.firstChoice.setTabIndex?.("0");
    }

    if (priorState) {
      restoreValue(priorState.value);
    }

    const computedResponse = computeResponse();
    setResponseState(computedResponse);
    setState(computeState());
    setIsValidResponse(computeIsValid());
  };

  const handleSetChecked = (
    choice: { identifier: string; checked: string },
    restoring = false
  ) => {
    choices.forEach((simpleChoice) => {
      if (isRadio) {
        simpleChoice.setChecked?.(false);
        simpleChoice.setTabIndex?.("-1");
      }
      if (simpleChoice.identifier === choice.identifier) {
        setCurrentChoice(simpleChoice);
      }
    });

    if (choice.checked === "true") {
      if (!checkMaxChoicesLimit()) {
        currentChoice?.setChecked?.(true);
      } else {
        currentChoice?.setChecked?.(false);
      }
    } else {
      currentChoice?.setChecked?.(false);
    }

    if (!restoring) {
      const computedResponse = computeResponse();
      setResponseState(computedResponse);
      evaluateValidity();
      currentChoice?.setFocus?.();
    }

    currentChoice?.setTabIndex?.("0");
  };

  const computeResponse = () => {
    if (isRadio) {
      const checkedChoice = choices.find((choice) => choice.isChecked?.());
      return checkedChoice ? checkedChoice.identifier : null;
    }

    const checkedChoices = choices.filter((choice) => choice.isChecked?.());
    return checkedChoices.length > 0
      ? checkedChoices.map((c) => c.identifier)
      : null;
  };

  const computeState = () => {
    return {
      order: choices.map((choice) => choice.identifier),
    };
  };

  const computeIsValid = () => {
    const minChoicesNum = parseInt(minChoices);
    if (minChoicesNum === 0) return true;
    if (responseState === null) return false;
    if (cardinality === "single") return true;
    if (cardinality === "multiple" && Array.isArray(responseState)) {
      return responseState.length >= minChoicesNum;
    }
    return false;
  };

  const evaluateValidity = () => {
    const currentValidity = computeIsValid();
    if (isValidResponse !== currentValidity) {
      setIsValidResponse(currentValidity);
      // Notify store of validity change
    }
  };

  const checkMaxChoicesLimit = () => {
    const maxChoicesNum = parseInt(maxChoices);
    if (isRadio || maxChoicesNum === 0) return false;
    if (
      responseState &&
      Array.isArray(responseState) &&
      responseState.length === maxChoicesNum
    ) {
      // Notify about max selections
      // Mock store.NotifyInteractionSelectionsLimit
      console.log("Max selections reached:", maxSelectionsMessage);
      return true;
    }
    return false;
  };

  const restoreValue = (value: string | string[] | null) => {
    if (value === null) return;

    if (isRadio) {
      handleSetChecked({ identifier: value as string, checked: "true" }, true);
    } else if (Array.isArray(value)) {
      value.forEach((identifier) => {
        handleSetChecked({ identifier, checked: "true" }, true);
      });
    }

    setIsValidResponse(computeIsValid());
  };

  const resetValue = () => {
    console.log("[ResetValue][identifier]", responseIdentifier);

    choices.forEach((choice) => {
      choice.setChecked?.(false);
      if (isRadio) {
        choice.setTabIndex?.("-1");
      }
    });

    setCurrentChoice(null);
    setPriorState(null);
  };

  const handleSetFocusNextChoice = (identifier: string) => {
    if (isRadio) {
      removeChoiceFromTabOrder(identifier);
    }
    const nextIdentifier = findNextIdentifier(identifier);
    if (nextIdentifier) {
      setFocusChoice(nextIdentifier);
    }
  };

  const handleSetFocusPreviousChoice = (identifier: string) => {
    if (isRadio) {
      removeChoiceFromTabOrder(identifier);
    }
    const prevIdentifier = findPreviousIdentifier(identifier);
    if (prevIdentifier) {
      setFocusChoice(prevIdentifier);
    }
  };

  const findNextIdentifier = (identifier: string) => {
    if (identifier === lastChoice?.identifier) {
      return firstChoice?.identifier;
    }
    const currentIndex = choices.findIndex((c) => c.identifier === identifier);
    return currentIndex >= 0 ? choices[currentIndex + 1]?.identifier : null;
  };

  const findPreviousIdentifier = (identifier: string) => {
    if (identifier === firstChoice?.identifier) {
      return lastChoice?.identifier;
    }
    const currentIndex = choices.findIndex((c) => c.identifier === identifier);
    return currentIndex > 0 ? choices[currentIndex - 1]?.identifier : null;
  };

  const setFocusChoice = (identifier: string | undefined) => {
    if (!identifier) return;
    const choice = choices.find((c) => c.identifier === identifier);
    if (choice) {
      setCurrentChoice(choice);
      choice.setTabIndex?.("0");
      choice.setFocus?.();
    }
  };

  const removeChoiceFromTabOrder = (identifier: string) => {
    const choice = choices.find((c) => c.identifier === identifier);
    choice?.setTabIndex?.("-1");
  };

  const handleSetActiveDescendant = (id: string) => {
    // This should be handled by ChoiceGroup
  };

  const handleChange = (value: any) => {
    onResponseChange?.(responseIdentifier, value);
  };

  if (!isQtiValid) return null;


  return (
    <div
      ref={rootRef}
      className={`qti-choice-interaction`}
      data-max-selections-message={dataMaxSelectionsMessage}
      data-min-selections-message={dataMinSelectionsMessage}
    >
      {prompt}
      <ChoiceGroup
        responseIdentifier={responseIdentifier}
        cardinality={cardinality}
        shuffle={shuffle}
        maxChoices={maxChoices}
        minChoices={minChoices}
        stackingClass={className.split(' ').find(cls => cls.startsWith('qti-choices-stacking-')) || ''}
        orientationClass={className.split(' ').find(cls => cls.startsWith('qti-orientation-')) || ''}
        onChoiceGroupReady={handleChoiceGroupReady}
        onSetChecked={(identifier, checked) =>
          handleSetChecked({ identifier, checked: checked ? "true" : "false" })
        }
        onSetFocusNextChoice={(choice) =>
          handleSetFocusNextChoice(choice.identifier)
        }
        onSetFocusPreviousChoice={(choice) =>
          handleSetFocusPreviousChoice(choice.identifier)
        }
        onSetActiveDescendant={handleSetActiveDescendant}
        onChange={handleChange}
        value={response}
      >
        {children}
      </ChoiceGroup>
    </div>
  );
};

export default QtiChoiceInteraction;
