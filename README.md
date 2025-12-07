# express-recap

Express app connecting to Kafka, Elasticsearch, Redis, and PostgreSQL

## Connecting to Elasticsearch with DBeaver-rc

### ⚠️ Important: License Limitation

**Elasticsearch JDBC requires a paid license (Gold/Platinum/Enterprise).** The free Basic license does NOT support JDBC connections. If you see the error:
```
SQL Error: current license is non-compliant for [jdbc]
```

This means your Elasticsearch instance is using the Basic (free) license, which doesn't support JDBC. Use one of the alternative methods below.

### Connection Details Summary
- **Host**: `localhost`
- **Port**: `9200`
- **Username**: `elastic`
- **Password**: `mojak2525`
- **Security**: Enabled (X-Pack Security)
- **Version**: 8.11.0
- **License**: Basic (free) - **JDBC not supported**

---

## Method 1: Using DBeaver HTTP/REST Connection (Recommended for Basic License)

> **Quick Note**: If plugin installation seems complex, consider using **Kibana** (Method 3, Option B) or **Postman/Insomnia** (Method 3, Option C) for a better experience with Elasticsearch.

Since JDBC requires a paid license, use DBeaver's HTTP connection feature:

### Installing REST/HTTP Plugin in DBeaver-rc

1. **Open DBeaver-rc** → Go to **Help** → **Install New Software**

2. **Add Plugin Repository**:
   - Click **Add...** button
   - Name: `DBeaver REST Client` (or any name)
   - Location: `https://dbeaver.io/update/rest-client/`
   - Click **Add**

3. **Install Plugin**:
   - Check the **REST Client** plugin from the list
   - Click **Next** → **Next** → Accept license → **Finish**
   - Restart DBeaver when prompted

**Note**: If the URL `https://dbeaver.io/update/rest-client/` doesn't work or the plugin isn't found:
- Try the main DBeaver update site: `https://dbeaver.io/update/ce/`
- Or check DBeaver's marketplace/plugin repository
- Some versions of DBeaver-rc may have the REST client built-in (see "Alternative" section below)

### Alternative: Using Built-in REST Client

DBeaver-rc may have a built-in REST client. To access it:

1. Go to **Window** → **Show View** → **Other...**
2. Search for "REST" or "HTTP"
3. Open the REST Client view

### Creating HTTP Connection

1. **Open DBeaver-rc** and click "New Database Connection" (or `Ctrl+Shift+N`)

2. **Select "HTTP" or "REST"** from the database list:
   - If you installed the REST Client plugin, you should see "REST Client" or "HTTP" option
   - If not available, use the REST Client view (see above)

3. **Configure Connection**:
   - **Base URL**: `http://localhost:9200`
   - **Authentication**: Basic Auth
   - **Username**: `elastic`
   - **Password**: `mojak2525`

4. **Test and Save** the connection

### Using REST Client View (If Plugin Installed)

1. Open **REST Client** view (Window → Show View → REST Client)
2. Create a new request:
   - Method: `GET`
   - URL: `http://localhost:9200/_cluster/health`
   - Authentication: Basic Auth
     - Username: `elastic`
     - Password: `mojak2525`
3. Click **Execute** to run the request

**Note**: HTTP connections in DBeaver have limited functionality compared to JDBC, but allow you to make REST API calls to Elasticsearch.

---

## Method 2: Using Elasticsearch REST API Directly

You can interact with Elasticsearch using REST API calls. Here are some useful endpoints:

### Check Cluster Health
```bash
curl -u elastic:mojak2525 http://localhost:9200/_cluster/health
```

### List All Indices
```bash
curl -u elastic:mojak2525 http://localhost:9200/_cat/indices?v
```

### Search an Index
```bash
curl -u elastic:mojak2525 "http://localhost:9200/your-index/_search?pretty"
```

### Use SQL API (Available in Basic License)
```bash
curl -u elastic:mojak2525 -X POST "http://localhost:9200/_sql?format=json" \
  -H 'Content-Type: application/json' \
  -d '{"query": "SHOW TABLES"}'
```

---

## Method 3: Using Elasticsearch UI Tools

There are several excellent UI tools for Elasticsearch. Here are the most popular options:

### Option A: Kibana (✅ Already Added to docker-compose.yml)

**Kibana** is the official Elasticsearch UI tool by Elastic. It's already configured in your `docker-compose.yml`!

**To use it:**
1. Start the services: `docker-compose up -d`
2. Wait for Kibana to start (may take 1-2 minutes)
3. Access Kibana at: `http://localhost:5601`
4. Login with:
   - **Username**: `elastic`
   - **Password**: `mojak2525`

**Features:**
- Data visualization and dashboards
- Dev Tools (Console for running queries)
- Index management
- Search and query interface
- Monitoring and analytics

### Option B: Elasticvue (Browser Extension - Recommended for Quick Access)

**Elasticvue** is a free, open-source browser extension for Elasticsearch.

**Installation:**
- **Chrome/Edge**: [Chrome Web Store](https://chrome.google.com/webstore/detail/elasticvue/hkedbapjpblbodpgbajcjnopjchjhhg)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/elasticvue/)

**Configuration:**
- URL: `http://localhost:9200`
- Authentication: Basic Auth
- Username: `elastic`
- Password: `mojak2525`

**Features:**
- Browse indices and documents
- Search and query interface
- Index management
- Cluster information
- No installation required (browser extension)

### Option C: Dejavu (Web-based)

**Dejavu** is an open-source web UI for Elasticsearch.

**Run with Docker:**
```bash
docker run -p 1358:1358 -d appbaseio/dejavu
```

Then access at `http://localhost:1358` and connect to `http://localhost:9200` with Basic Auth.

**Features:**
- Import/export data
- Edit documents
- Search interface
- Index browsing

### Option D: Cerebro (Web Admin Tool)

**Cerebro** is an open-source Elasticsearch web admin tool.

**Run with Docker:**
```bash
docker run -p 9000:9000 -d lmenezes/cerebro
```

Access at `http://localhost:9000` and connect to `http://localhost:9200`.

**Features:**
- Cluster monitoring
- Node management
- Index operations
- Query interface

### Option E: Elasticsearch Head (Browser Extension - Legacy)

**Elasticsearch Head** is a browser extension (older, but still functional).

- Install from browser extension store
- Connect to `http://localhost:9200`
- Use Basic Auth: `elastic` / `mojak2525`

### Option F: Postman/Insomnia (REST API Clients)

For REST API testing:
- Create a new REST API collection
- Base URL: `http://localhost:9200`
- Add Basic Auth: `elastic` / `mojak2525`
- Use Elasticsearch REST API endpoints

---

## Quick Start with Kibana (Recommended)

Since Kibana is already in your `docker-compose.yml`:

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Set Kibana System Password (if needed):**
   
   If Kibana fails to start, you may need to set the `kibana_system` user password manually:
   ```bash
   # Wait for Elasticsearch to be ready
   curl -u elastic:mojak2525 http://localhost:9200/_cluster/health
   
   # Set kibana_system password
   curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
     -u elastic:mojak2525 \
     -H "Content-Type: application/json" \
     -d '{"password":"mojak2525"}'
   
   # Then restart Kibana
   docker-compose restart kibana
   ```

3. **Access Kibana:**
   - URL: `http://localhost:5601`
   - **Login Username**: `elastic` (for accessing Kibana UI)
   - **Login Password**: `mojak2525`
   - Note: Kibana connects to Elasticsearch using `kibana_system` user internally

4. **Use Dev Tools:**
   - Go to **Dev Tools** in the left sidebar
   - Run queries like:
     ```json
     GET /_cluster/health
     GET /_cat/indices?v
     ```

---

## Troubleshooting

### Verify Elasticsearch is Running
```bash
docker ps | grep elasticsearch
```

### Test Connection
```bash
curl -u elastic:mojak2525 http://localhost:9200/_cluster/health
```

### Check License Type
```bash
curl -u elastic:mojak2525 http://localhost:9200/_license
```

### Kibana Not Starting Properly

If Kibana doesn't start, check the following:

1. **Check Kibana Logs:**
   ```bash
   docker-compose logs kibana
   # Or for real-time logs:
   docker-compose logs -f kibana
   ```

2. **Verify Elasticsearch is Healthy:**
   ```bash
   docker-compose ps elasticsearch
   curl -u elastic:mojak2525 http://localhost:9200/_cluster/health
   ```
   Kibana won't start if Elasticsearch isn't ready.

3. **Check Container Status:**
   ```bash
   docker-compose ps
   ```

4. **Restart Kibana:**
   ```bash
   docker-compose restart kibana
   # Or stop and start:
   docker-compose stop kibana
   docker-compose up -d kibana
   ```

5. **Common Issues and Solutions:**

   **Issue: "Unable to connect to Elasticsearch"**
   - Wait for Elasticsearch to be fully healthy (check with `docker-compose ps`)
   - Verify credentials: username `elastic`, password `mojak2525`
   - Check if Elasticsearch is accessible: `curl -u elastic:mojak2525 http://localhost:9200`

   **Issue: "elastic user is forbidden" or "superuser account cannot write to system indices"**
   - This is a common issue with Elasticsearch 8.x
   - Kibana must use `kibana_system` user, not `elastic` user
   - Set the `kibana_system` password:
     ```bash
     curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
       -u elastic:mojak2525 \
       -H "Content-Type: application/json" \
       -d '{"password":"mojak2525"}'
     ```
   - Then restart Kibana: `docker-compose restart kibana`
   - The configuration is already set to use `kibana_system` user

   **Issue: "Kibana server is not ready yet"**
   - This is normal on first start - wait 1-2 minutes
   - Check logs: `docker-compose logs -f kibana`
   - Ensure Elasticsearch healthcheck passes

   **Issue: "License check failed"**
   - This shouldn't happen with Basic license
   - Verify Elasticsearch license: `curl -u elastic:mojak2525 http://localhost:9200/_license`

   **Issue: Container keeps restarting**
   - Check logs for specific error: `docker-compose logs kibana --tail=100`
   - Verify all environment variables are correct
   - Try removing and recreating: 
     ```bash
     docker-compose stop kibana
     docker-compose rm kibana
     docker-compose up -d kibana
     ```

6. **Reset Everything (if needed):**
   ```bash
   docker-compose down
   docker-compose up -d
   # Wait 2-3 minutes for services to start
   ```

7. **Access Kibana:**
   - URL: `http://localhost:5601`
   - Username: `elastic`
   - Password: `mojak2525`
   - If page doesn't load, wait a bit longer (Kibana takes time to initialize)

### If You Need JDBC Support
To use JDBC with DBeaver, you would need to:
1. Upgrade to Elasticsearch Gold/Platinum/Enterprise license (paid)
2. Or use Elasticsearch Cloud (paid service)

For development purposes, the REST API methods above are sufficient and work with the free Basic license.