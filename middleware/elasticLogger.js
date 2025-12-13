import { elasticsearchClient } from "../services/index.js";

/**
 * Extract complete incoming request context
 */
function extractIncomingContext(req) {
  return {
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    route: req.route ? {
      path: req.route.path,
      methods: req.route.methods,
    } : null,
    query: req.query,
    params: req.params,
    body: req.body,
    sanitizedBody: sanitizeBody(req.body),
    headers: {
      ...req.headers,
      "user-agent": req.get("user-agent"),
      "content-type": req.get("content-type"),
      accept: req.get("accept"),
      referer: req.get("referer"),
      origin: req.get("origin"),
      authorization: req.get("authorization") ? "[REDACTED]" : undefined,
    },
    cookies: req.cookies,
    signedCookies: req.signedCookies,
    ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
    ips: req.ips,
    protocol: req.protocol,
    secure: req.secure,
    hostname: req.hostname,
    subdomains: req.subdomains,
    xhr: req.xhr,
    connection: {
      remoteAddress: req.connection?.remoteAddress,
      remotePort: req.connection?.remotePort,
    },
    socket: {
      remoteAddress: req.socket?.remoteAddress,
      remotePort: req.socket?.remotePort,
    },
  };
}

/**
 * Extract complete outgoing response context - all response data in one field
 */
function extractOutgoingContext(res, data, responseTime, startTime) {
  const statusCode = res.statusCode;
  const statusMessage = res.statusMessage || getStatusMessage(statusCode);
  const statusCategory = getStatusCategory(statusCode);

  return {
    // HTTP Status Information
    http: {
      statusCode: statusCode,
      statusMessage: statusMessage,
      statusCategory: statusCategory,
      statusCodeGroup: `${Math.floor(statusCode / 100)}xx`,
    },

    // Response Headers
    headers: res.getHeaders ? res.getHeaders() : {},

    // Response Body
    body: sanitizeResponse(data),
    rawBody: data, // Keep original for reference

    // Timing Information
    timing: {
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      responseTimeMs: responseTime,
    },

    // Response Metadata
    success: statusCode >= 200 && statusCode < 400,
    error: statusCode >= 400 ? (data?.error || data?.message || statusMessage) : null,
    hasError: statusCode >= 400,

    // Additional Response Info
    contentType: res.get ? res.get("content-type") : undefined,
    contentLength: res.get ? res.get("content-length") : undefined,
  };
}

/**
 * Middleware to log API requests to Elasticsearch
 * @param {string} indexName - Elasticsearch index name
 */
export const elasticsearchLogger = (indexName = "user") => {
  return  (req, res, next) => {
    const startTime = Date.now();
    const { requestId } = req;

    // Capture incoming context
    const incomingContext = extractIncomingContext(req);

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override res.json to capture response
    res.json = function (data) {
      const responseTime = Date.now() - startTime;

      // Capture all response data in one field
      const response = extractOutgoingContext(res, data, responseTime, startTime);

      // Complete API context log
      const apiContext = {
        // General context
        requestId,
        timestamp: new Date().toISOString(),

        // Incoming API context
        incoming: incomingContext,

        // All response data in one field as JSON object (for querying)
        responseData: response,

        // All response data as JSON string (for viewing in Kibana UI)
        responseDataJson: JSON.stringify(response, null, 2),
      };

      // Log to Elasticsearch asynchronously (don't block response)
      logToElasticsearch(indexName, apiContext).catch((err) => {
        console.error("Failed to log to Elasticsearch:", err.message);
      });

      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

/**
 * Get HTTP status message from status code
 */
function getStatusMessage(statusCode) {
  const statusMessages = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    520: "Unknown Error",
    521: "Web Server Is Down",
    522: "Connection Timed Out",
    523: "Origin Is Unreachable",
    524: "A Timeout Occurred",
  };
  return statusMessages[statusCode] || "Unknown Status";
}

/**
 * Get status category
 */
function getStatusCategory(statusCode) {
  if (statusCode >= 200 && statusCode < 300) return "success";
  if (statusCode >= 300 && statusCode < 400) return "redirect";
  if (statusCode >= 400 && statusCode < 500) return "client_error";
  if (statusCode >= 500) return "server_error";
  return "unknown";
}

/**
 * Sanitize request body to remove sensitive information
 */
function sanitizeBody(body) {
  if (!body || typeof body !== "object") return body;

  const sanitized = { ...body };
  const sensitiveFields = [
    "password",
    "token",
    "secret",
    "apiKey",
    "authorization",
  ];

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[**********]";
    }
  });

  return sanitized;
}

/**
 * Sanitize response data
 */
function sanitizeResponse(data) {
  if (!data || typeof data !== "object") return data;

  // Only log essential response data to avoid large documents
  if (data.user && typeof data.user === "object") {
    return {
      success: data.success,
      message: data.message,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: data.user.createdAt,
      },
      errors: data.errors,
      error: data.error,
    };
  }

  return {
    success: data.success,
    message: data.message,
    error: data.error,
    errors: data.errors,
  };
}

/**
 * Log data to Elasticsearch
 */
async function logToElasticsearch(indexName, logData) {
  try {
    await elasticsearchClient.index({
      index: indexName,
      document: logData,
    });
  } catch (error) {
    console.error("Elasticsearch logging error:", error);
    throw error;
  }
}