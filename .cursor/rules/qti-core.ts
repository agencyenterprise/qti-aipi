/**
 * Core QTI 3.0 Development Rules
 */

const qtiCore = {
  specification: {
    version: "3.0",
    documentation: "https://www.imsglobal.org/spec/qti/v3p0/impl",
    compliance: "Strict adherence to QTI 3.0 required"
  },

  architecture: {
    pattern: "Hexagonal (Ports & Adapters)",
    rootDirectory: "qti-aipi",
    primaryObjective: "Build QTI 3.0 compliant assessment editor"
  },

  typeSystem: {
    baseTypes: [
      "identifier",
      "boolean", 
      "integer",
      "float",
      "string",
      "point",
      "pair",
      "directedPair",
      "duration",
      "file",
      "uri"
    ],
    cardinality: [
      "single",
      "multiple",
      "ordered"
    ]
  },

  validation: {
    xmlSchema: "https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd",
    requirements: [
      "All XML must validate against QTI 3.0 schemas",
      "Maintain correct element hierarchy",
      "Use proper namespaces"
    ]
  }
};