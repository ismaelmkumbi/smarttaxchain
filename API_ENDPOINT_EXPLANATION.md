# API Endpoint Request Explanation

## The Two Requests You're Seeing

### 1. `OPTIONS http://localhost:3000/taxpayers` - 204 No Content ✅

**This is NORMAL and EXPECTED!**

- **What it is:** A CORS (Cross-Origin Resource Sharing) preflight request
- **Why it happens:** The browser automatically sends this before making certain cross-origin requests
- **When:** Before POST, PUT, DELETE, or requests with custom headers
- **Status 204:** Means "No Content" - the server is saying "CORS is allowed, proceed"
- **This is NOT an error** - it's the browser checking if the actual request is allowed

### 2. `GET http://localhost:3000/api/taxpayers?` - 404 Not Found ❌

**This is the ACTUAL request that's failing**

- **What it is:** The actual API call to get the list of taxpayers
- **Why 404:** The endpoint exists in `server.js` but might be:
  1. Server not running
  2. Authentication token missing/invalid
  3. Query parameter issue
  4. Route not matching exactly

## How the Endpoint Building Works

### Frontend Code Flow:

1. **`traApiService.js`** calls:

   ```javascript
   this.request('/taxpayers?queryParams');
   ```

2. **`request()` method** transforms it:

   ```javascript
   // Input: '/taxpayers?queryParams'
   // Output: '/api/taxpayers?queryParams'
   ```

3. **`api.js`** (axios) makes the request:
   ```javascript
   baseURL: 'http://localhost:3000/';
   url: '/api/taxpayers?queryParams';
   // Final URL: http://localhost:3000/api/taxpayers?queryParams
   ```

### Backend Route:

```javascript
app.get('/api/taxpayers', authenticateToken, (req, res) => {
  // Returns list of taxpayers
});
```

## Why You Might See 404

1. **Server not running:** Make sure `node server.js` is running
2. **Authentication:** The endpoint requires `Authorization: Bearer <token>` header
3. **Query params:** The `?` at the end might cause issues if empty

## Solution

The `/api/taxpayers/register` endpoint has been added to `server.js`.

**To test:**

1. Make sure server is running: `node server.js`
2. Make sure you're logged in (have a token)
3. The registration should now work

## Summary

- ✅ `OPTIONS /taxpayers` - Normal CORS preflight (ignore this)
- ❌ `GET /api/taxpayers?` - Actual request (should work now with proper auth)
- ✅ `POST /api/taxpayers/register` - Registration endpoint (now added to server)
