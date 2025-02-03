import React, { useState, useCallback } from "react";
import TextEntryInteractionAdapter from "./TextEntryInteractionAdapter";
// import ExtendedTextInteractionAdapter from "./ExtendedTextInteractionAdapter";
import QtiInlineChoiceInteraction from "./QtiInlineChoiceInteraction";
import QtiChoiceInteraction from "./QtiChoiceInteraction";
import "./QtiAssessmentItem.css";

interface QtiAssessmentItemProps {
  template: string;
  writingMode?: "vertical-rl" | "horizontal-tb";
  textOrientation?: "upright" | "mixed";
  textTransform?: "fullwidth" | "none";
  onResponseChange?: (identifier: string, value: any) => void;
  responses?: Record<string, any>;
}

const QtiAssessmentItem: React.FC<QtiAssessmentItemProps> = ({
  template,
  writingMode = "horizontal-tb",
  textOrientation = "mixed",
  textTransform = "none",
  onResponseChange,
  responses = {},
}) => {
  const [localResponses, setLocalResponses] =
    useState<Record<string, any>>(responses);

  const handleResponseChange = useCallback(
    (identifier: string, value: any) => {
      setLocalResponses((prev) => ({ ...prev, [identifier]: value }));
      onResponseChange?.(identifier, value);
    },
    [onResponseChange]
  );

  const getCardinalityFromResponseDeclaration = (
    doc: Document,
    responseIdentifier: string
  ): "single" | "multiple" => {
    const responseDeclaration = doc.querySelector(
      `qti-response-declaration[identifier="${responseIdentifier}"]`
    );
    return (responseDeclaration?.getAttribute("cardinality") || "single") as
      | "single"
      | "multiple";
  };

  const renderInteraction = (node: Element, doc: Document) => {
    const interactionType = node.tagName.toLowerCase();
    const responseIdentifier = node.getAttribute("response-identifier");
    const className = node.getAttribute("class") || "";

    if (!responseIdentifier) return null;

    const currentResponse = localResponses[responseIdentifier] || "";

    switch (interactionType) {
      // case "qti-extended-text-interaction":
      //   return (
      //     <ExtendedTextInteractionAdapter
      //       key={responseIdentifier}
      //       node={node}
      //       onResponseChange={(identifier, value) => {
      //         // Handle response change
      //         console.log("Extended text response:", identifier, value);
      //       }}
      //       responseValue=""
      //     />
      //   );
      case "qti-text-entry-interaction":
        return (
          <TextEntryInteractionAdapter
            key={responseIdentifier}
            node={node}
            onResponseChange={(identifier, value) => {
              // Handle response change
              console.log("Text entry response:", identifier, value);
            }}
            responseValue=""
          />
        );
      case "qti-choice-interaction": {
        const choices = Array.from(
          node.getElementsByTagName("qti-simple-choice")
        ).map((choice) => ({
          identifier: choice.getAttribute("identifier") || "",
          content: choice.innerHTML,
          fixed: choice.getAttribute("fixed") === "true",
        }));

        const prompt = node.querySelector("qti-prompt")?.innerHTML || undefined;

        // Get cardinality from response declaration
        const cardinality = getCardinalityFromResponseDeclaration(
          doc,
          responseIdentifier
        );

        return (
          <div className="interaction-container">
            {prompt && (
              <div
                className="qti-prompt"
                dangerouslySetInnerHTML={{ __html: prompt }}
              />
            )}
            <QtiChoiceInteraction
              key={responseIdentifier}
              responseIdentifier={responseIdentifier}
              maxChoices={node.getAttribute("max-choices") || undefined}
              minChoices={node.getAttribute("min-choices") || undefined}
              shuffle={node.getAttribute("shuffle") || undefined}
              className={className}
              orientation={
                className.includes("qti-orientation-horizontal")
                  ? "horizontal"
                  : "vertical"
              }
              dataMaxSelectionsMessage={
                node.getAttribute("data-max-selections-message") || undefined
              }
              dataMinSelectionsMessage={
                node.getAttribute("data-min-selections-message") || undefined
              }
              onResponseChange={handleResponseChange}
              response={currentResponse}
              cardinality={cardinality}
            >
              {choices.map((choice) => (
                <div
                  key={choice.identifier}
                  data-qti-type="qti-simple-choice"
                  data-identifier={choice.identifier}
                  data-fixed={choice.fixed}
                >
                  <div dangerouslySetInnerHTML={{ __html: choice.content }} />
                </div>
              ))}
            </QtiChoiceInteraction>
          </div>
        );
      }

      case "qti-inline-choice-interaction": {
        const choices = Array.from(
          node.getElementsByTagName("qti-inline-choice")
        ).map((choice) => ({
          identifier: choice.getAttribute("identifier") || "",
          content: choice.innerHTML,
        }));

        return (
          <QtiInlineChoiceInteraction
            key={responseIdentifier}
            responseIdentifier={responseIdentifier || ""}
            shuffle={node.getAttribute("shuffle") || "false"}
            required={node.getAttribute("required") || "false"}
            dataPrompt={node.getAttribute("data-prompt") || "Choose..."}
            minChoices={node.getAttribute("min-choices") || "0"}
            maxChoices={node.getAttribute("max-choices") || "1"}
            dataMinSelectionsMessage={
              node.getAttribute("data-min-selections-message") || ""
            }
            choices={choices}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderNode = (
    node: Element | Text,
    index: number,
    doc: Document
  ): React.ReactNode => {
    // Handle text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      return <React.Fragment key={index}>{node.textContent}</React.Fragment>;
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    if (tagName.includes("interaction")) {
      return renderInteraction(element, doc);
    }

    // Handle div, p, blockquote and other HTML elements
    if (["div", "p", "blockquote", "span"].includes(tagName)) {
      const children = Array.from(element.childNodes).map((child, index) =>
        renderNode(child as Element | Text, index, doc)
      );

      const className = element.getAttribute("class") || "";
      const attributes: { [key: string]: string } = {
        key: `${tagName}-${index}`,
        className,
      };

      // Copy other attributes
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name !== "class") {
          attributes[attr.name] = attr.value;
        }
      });

      return React.createElement(tagName, attributes, children);
    }

    // For other elements, preserve their HTML
    return (
      <span
        key={`${element.tagName}-${index}`}
        dangerouslySetInnerHTML={{ __html: element.outerHTML }}
      />
    );
  };

  const processTemplate = () => {
    if (!template) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(template, "text/xml");
    const itemBody = doc.querySelector("qti-item-body");

    if (!itemBody) return null;

    // Add a stable key based on node type and position
    const generateKey = (node: Element | Text, index: number) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return `text-${index}`;
      }
      const element = node as Element;
      const type = element.tagName.toLowerCase();
      const identifier =
        element.getAttribute("identifier") ||
        element.getAttribute("response-identifier");
      return identifier ? `${type}-${identifier}` : `${type}-${index}`;
    };

    return Array.from(itemBody.childNodes).map((node, index) => {
      const key = generateKey(node as Element | Text, index);
      const renderedNode = renderNode(node as Element | Text, index, doc);

      // If the rendered node is already a React element with a key, return it
      if (React.isValidElement(renderedNode) && renderedNode.key != null) {
        return renderedNode;
      }

      // Otherwise wrap it in a Fragment with our generated key
      return <React.Fragment key={key}>{renderedNode}</React.Fragment>;
    });
  };

  const containerClassName = `
    ${"qti-assessment-item"}
    ${writingMode === "vertical-rl" ? "vertical-rl" : ""}
    ${textOrientation === "upright" ? "text-orientation-upright" : ""}
    ${textTransform === "fullwidth" ? "text-transform-fullwidth" : ""}
  `.trim();

  return <div className={containerClassName}>{processTemplate()}</div>;
};

export default QtiAssessmentItem;
