/**
 * API Integration Rules and Patterns
 */

const apiIntegration = {
  baseUrl: "/api/v1",
  
  resources: {
    assessmentTest: {
      endpoints: {
        list: { method: "GET", path: "/assessment-tests" },
        create: { method: "POST", path: "/assessment-tests" },
        get: { method: "GET", path: "/assessment-tests/:id" },
        update: { method: "PUT", path: "/assessment-tests/:id" },
        delete: { method: "DELETE", path: "/assessment-tests/:id" }
      },
      requiredFields: ["identifier", "title"]
    },

    section: {
      endpoints: {
        list: { method: "GET", path: "/sections" },
        create: { method: "POST", path: "/sections" },
        get: { method: "GET", path: "/sections/:id" },
        update: { method: "PUT", path: "/sections/:id" },
        delete: { method: "DELETE", path: "/sections/:id" }
      },
      requiredFields: ["identifier", "title", "assessmentTestId", "sequence"]
    },

    item: {
      endpoints: {
        list: { method: "GET", path: "/items" },
        create: { method: "POST", path: "/items" },
        get: { method: "GET", path: "/items/:id" },
        update: { method: "PUT", path: "/items/:id" },
        delete: { method: "DELETE", path: "/items/:id" }
      },
      requiredFields: ["identifier", "title", "type", "content"]
    }
  },

  responseFormat: {
    success: {
      status: [200, 201],
      structure: {
        data: "Required - Contains the response payload",
        meta: "Optional - Contains pagination, counts, etc."
      }
    },
    error: {
      status: [400, 401, 403, 404, 500],
      structure: {
        error: {
          code: "Required - Error code",
          message: "Required - Human readable message",
          details: "Optional - Additional error context"
        }
      }
    }
  },

  implementation: {
    dataFetching: {
      library: "axios",
      pattern: "Custom hooks with SWR/React Query",
      errorHandling: "Global error boundary + local error states"
    },
    stateManagement: {
      loading: "Required for all async operations",
      caching: "Implement caching strategy using SWR/React Query",
      optimisticUpdates: "Implement for better UX"
    },
    security: {
      headers: {
        required: ["Authorization", "Content-Type"],
        format: {
          Authorization: "Bearer {token}",
          "Content-Type": "application/json"
        }
      }
    }
  },

  validation: {
    request: {
      body: "Zod schema validation before API calls",
      params: "Type-safe parameter validation",
      headers: "Required headers verification"
    },
    response: {
      data: "Type validation against defined interfaces",
      error: "Error response handling and typing"
    }
  }
};