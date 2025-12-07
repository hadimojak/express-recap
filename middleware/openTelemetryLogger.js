import { trace, context, SpanStatusCode } from "@opentelemetry/api";

/**
 * OpenTelemetry middleware for route monitoring
 * Captures the same context as Elasticsearch logger for consistent UI
 */
export const openTelemetryLogger = () => {
  return async (req, res, next) => {
    const tracer = trace.getTracer("express-recap", "1.0.0");
    const startTime = Date.now();
    const { requestId } = req;

    // Start a span for this request
    const span = tracer.startSpan(`${req.method} ${req.path}`, {
      kind: 1, // SERVER
      attributes: {
        // Request Information
        method: req.method,
        url: req.originalUrl || req.url,
        path: req.path,
        route: req.route?.path || req.path,
        protocol: req.protocol,
        hostname: req.hostname,
        userAgent: req.get("user-agent") || "",
        requestId: requestId || "",
        clientIp: req.ip || req.connection?.remoteAddress || "",
        peerIp: req.socket?.remoteAddress || "",
        
        // Request Details
        requestBodySize: JSON.stringify(req.body).length,
        contentType: req.get("content-type") || "",
        queryParams: JSON.stringify(req.query),
        routeParams: JSON.stringify(req.params),
      },
    });

    // Store span in request for later use
    req.span = span;

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override res.json to capture response
    res.json = function (data) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Extract response data (same structure as Elasticsearch logger)
      const responseData = {
        http: {
          statusCode: statusCode,
          statusMessage: res.statusMessage || getStatusMessage(statusCode),
          statusCategory: getStatusCategory(statusCode),
          statusCodeGroup: `${Math.floor(statusCode / 100)}xx`,
        },
        headers: res.getHeaders ? res.getHeaders() : {},
        body: sanitizeResponse(data),
        timing: {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          responseTimeMs: responseTime,
        },
        success: statusCode >= 200 && statusCode < 400,
        error: statusCode >= 400 ? (data?.error || data?.message || res.statusMessage) : null,
        hasError: statusCode >= 400,
      };

      // Update span with response attributes
      span.setAttributes({
        statusCode: statusCode,
        statusMessage: res.statusMessage || getStatusMessage(statusCode),
        statusCategory: getStatusCategory(statusCode),
        statusCodeGroup: `${Math.floor(statusCode / 100)}xx`,
        responseBodySize: JSON.stringify(data).length,
        responseContentType: res.get("content-type") || "application/json",
        responseTimeMs: responseTime,
        responseTime: `${responseTime}ms`,
        success: statusCode >= 200 && statusCode < 400,
        hasError: statusCode >= 400,
        errorMessage: statusCode >= 400 ? (data?.error || data?.message || res.statusMessage) : "",
      });

      // Add response data as event with clear structure
      span.addEvent("ResponseData", {
        responseData: JSON.stringify(responseData),
        responseDataJson: JSON.stringify(responseData, null, 2),
      });

      // Set span status based on HTTP status code
      if (statusCode >= 500) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: res.statusMessage || "Server Error",
        });
      } else if (statusCode >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: res.statusMessage || "Client Error",
        });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      // End the span
      span.end();

      // Call original json method
      return originalJson(data);
    };

    // Handle errors
    const originalError = res.status.bind(res);
    res.status = function (code) {
      if (code >= 400) {
        span.setAttributes({
          statusCode: code,
          hasError: true,
          errorMessage: getStatusMessage(code),
        });
      }
      return originalError(code);
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
 * Sanitize response data
 */
function sanitizeResponse(data) {
  if (!data || typeof data !== "object") return data;

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

