# Sentry Setup Guide

## Quick Start - Sentry Cloud (Recommended for Testing)

### 1. Create Sentry Account

1. Go to https://sentry.io/signup/
2. Create a new organization
3. Create a new project → Select **Node.js** / **Express**
4. Copy your **DSN** (looks like: `https://abc123@o123456.ingest.sentry.io/1234567`)

### 2. Configure Environment

Add to your `.env` file:

```bash
SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
```

### 3. Test Sentry

```bash
# Start your app
npm run dev

# Trigger a test error
curl http://localhost:3000/user/test-error
```

### 4. View Errors

1. Go to https://sentry.io
2. Navigate to your project
3. Click on **Issues** tab
4. You should see "This is a test error for Sentry!"

---

## Self-Hosted Sentry (Advanced)

### Requirements

- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 20GB+
- **Docker & Docker Compose**

### Installation

```bash
# Clone Sentry self-hosted
cd /home/hadi/Documents
git clone https://github.com/getsentry/self-hosted.git sentry
cd sentry

# Run installation (takes 10-20 minutes)
./install.sh

# Start Sentry
docker compose up -d
```

### Access & Configure

1. Open http://localhost:9000
2. Login with admin credentials created during install
3. Create a new project → Select **Node.js**
4. Copy the DSN

Add to `.env`:
```bash
SENTRY_DSN=http://your-key@localhost:9000/1
```

---

## Testing with User Create API

### Create a User (Success Case)

```bash
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Trigger Error (Invalid Email)

```bash
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid-email"}'
```

This validation error will be logged to Sentry.

### Test Error Endpoint

```bash
curl http://localhost:3000/user/test-error
```

---

## What Gets Captured

- **Errors**: All uncaught exceptions
- **Context**: Request ID, body, route, method
- **Performance**: Request duration, response times
- **User Info**: IP, user agent, headers

---

## Configuration Options

In `sentry.js`, you can adjust:

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  
  // Performance monitoring (0.0 to 1.0)
  tracesSampleRate: 1.0, // 100% for testing, reduce in production
  
  // Enable/disable based on DSN presence
  enabled: !!process.env.SENTRY_DSN,
  
  // Release tracking (optional)
  release: "express-recap@1.0.0",
});
```

---

## Troubleshooting

**No errors appearing in Sentry:**
1. Check `SENTRY_DSN` is set correctly
2. Check console logs for Sentry initialization errors
3. Verify network connectivity to Sentry endpoint

**Self-hosted Sentry not starting:**
```bash
cd /home/hadi/Documents/sentry
docker compose logs -f
```

**Check Sentry status:**
```bash
# Self-hosted
curl http://localhost:9000/_health/

# Cloud
# Just check the web UI
```

---

## Production Recommendations

1. **Reduce sample rate**:
   ```javascript
   tracesSampleRate: 0.1, // 10% of transactions
   ```

2. **Set release tracking**:
   ```javascript
   release: "express-recap@" + process.env.npm_package_version,
   ```

3. **Filter sensitive data**:
   ```javascript
   beforeSend(event) {
     // Remove sensitive data
     if (event.request) {
       delete event.request.cookies;
     }
     return event;
   }
   ```

4. **Set up alerts** in Sentry dashboard for critical errors

