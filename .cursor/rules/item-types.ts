/**
 * QTI Item Type Definitions and Rules
 */

const itemTypes = {
  interactions: {
    choice: [
      "choiceInteraction",
      "orderInteraction", 
      "associateInteraction",
      "matchInteraction",
      "gapMatchInteraction",
      "inlineChoiceInteraction"
    ],
    text: [
      "textEntryInteraction",
      "extendedTextInteraction"
    ],
    graphical: [
      "hotspotInteraction",
      "selectPointInteraction",
      "graphicOrderInteraction",
      "graphicAssociateInteraction"
    ],
    composite: [
      "positionObjectInteraction",
      "sliderInteraction",
      "uploadInteraction"
    ]
  },

  processing: {
    response: {
      rules: [
        "match",
        "mapResponse",
        "mapResponsePoint"
      ],
      conditions: [
        "responseIf",
        "responseElseIf",
        "responseElse"
      ]
    },
    template: {
      rules: [
        "setTemplateValue",
        "setCorrectResponse",
        "setDefaultValue"
      ]
    }
  },

  feedback: {
    types: [
      "modalFeedback",
      "feedbackBlock",
      "feedbackInline"
    ],
    timing: [
      "during",
      "end"
    ]
  }
};