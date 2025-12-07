# express-recap

Express app connecting to Kafka, Elasticsearch, Redis, and PostgreSQL

## Connecting to Elasticsearch with DBeaver-rc

### Prerequisites
1. Make sure Elasticsearch is running (via Docker Compose)
2. DBeaver-rc installed on your system

### Connection Steps

1. **Open DBeaver-rc** and click on "New Database Connection" (or press `Ctrl+Shift+N`)

2. **Select Elasticsearch** from the database list:
   - Search for "Elasticsearch" in the database selection dialog
   - If Elasticsearch driver is not installed, DBeaver will prompt you to download it

3. **Configure Connection Settings**:
   - **Host**: `localhost`
   - **Port**: `9200`
   - **Database/Schema**: Leave empty or use `_all` to see all indices
   - **Username**: `elastic`
   - **Password**: `mojak2525`

4. **Advanced Settings** (if needed):
   - **Connection URL**: `http://localhost:9200`
   - **Use SSL**: Unchecked (unless you've configured SSL)
   - **Connection Timeout**: 30 seconds (default)

5. **Test Connection**:
   - Click "Test Connection" to verify the connection works
   - If successful, click "Finish" to save the connection

### Connection Details Summary
- **Host**: `localhost`
- **Port**: `9200`
- **Username**: `elastic`
- **Password**: `mojak2525`
- **Security**: Enabled (X-Pack Security)
- **Version**: 8.11.0

### Troubleshooting

If you encounter connection issues:

1. **Verify Elasticsearch is running**:
   ```bash
   docker ps | grep elasticsearch
   ```

2. **Test connection via curl**:
   ```bash
   curl -u elastic:mojak2525 http://localhost:9200/_cluster/health
   ```

3. **Check firewall settings** - Ensure port 9200 is accessible

4. **Driver Issues**: If DBeaver doesn't have the Elasticsearch driver:
   - Go to Window → DBeaver → Driver Manager
   - Search for "Elasticsearch"
   - Install the Elasticsearch JDBC driver if available
   - Note: Some versions of DBeaver may require manual driver installation

### Alternative: Using HTTP Connection

If the JDBC driver doesn't work, you can also use DBeaver's HTTP connection feature:
1. Create a new connection
2. Select "HTTP" or "REST" connection type
3. Use the base URL: `http://localhost:9200`
4. Add Basic Authentication with username `elastic` and password `mojak2525`