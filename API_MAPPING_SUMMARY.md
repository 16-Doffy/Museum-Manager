# API Mapping Summary

## Project Structure
- **SuperAdmin** → `admin-portal`
- **Admin/Staff/Manager** → `museum-portal` 
- **Visitor** → `visitor-portal`

## Swagger API Endpoints Mapping

### 1. Account Management (SuperAdmin - admin-portal)
```
POST   /api/v1/accounts/{roleId}/{museumId}  - Create account
GET    /api/v1/accounts/{id}                 - Get account by ID
DELETE /api/v1/accounts/{id}                 - Delete account
PUT    /api/v1/accounts/{id}                 - Update account
GET    /api/v1/accounts                      - Get all accounts
```

### 2. Role Management (SuperAdmin - admin-portal)
```
GET    /api/v1/roles                         - Get all roles
POST   /api/v1/roles                         - Add new role
GET    /api/v1/roles/{id}                    - Get role by ID
DELETE /api/v1/roles/{id}                    - Delete role
PUT    /api/v1/roles/{id}                    - Update role
```

### 3. Museum Management (SuperAdmin - admin-portal)
```
POST   /api/v1/museums                       - Create museum
GET    /api/v1/museums                       - Get all museums (paging)
DELETE /api/v1/museums/{id}                  - Delete museum (soft delete)
GET    /api/v1/museums/{id}                  - Get museum by ID
PUT    /api/v1/museums/{id}                  - Update museum
```

### 4. Area Management (Admin/Staff/Manager - museum-portal)
```
POST   /api/v1/areas                         - Create area
GET    /api/v1/areas                         - Get all areas (paging)
PATCH  /api/v1/areas/{id}                    - Update area
DELETE /api/v1/areas/{id}                    - Delete area
GET    /api/v1/areas/{id}                    - Get area by ID
PATCH  /api/v1/areas/{id}/activate           - Activate area
PATCH  /api/v1/areas/{id}/maintain           - Set area to maintenance
```

### 5. Artifact Management (Admin/Staff/Manager - museum-portal)
```
POST   /api/v1/artifacts                     - Create artifact
GET    /api/v1/artifacts                     - Get all artifacts (paging/filtering)
GET    /api/v1/artifacts/{id}                - Get artifact by ID
PATCH  /api/v1/artifacts/{id}                - Update artifact
DELETE /api/v1/artifacts/{id}                - Soft delete artifact
GET    /api/v1/artifacts/code/{artifactCode} - Get artifact by code
PATCH  /api/v1/artifacts/{id}/activate       - Activate artifact
PATCH  /api/v1/artifacts/{artifactId}/assign-display-position/{displayPositionId} - Assign to display position
PATCH  /api/v1/artifacts/{artifactId}/remove-display-position - Remove from display position
POST   /api/v1/artifacts/{artifactId}/media  - Add media to artifact
PUT    /api/v1/artifacts/{artifactId}/media/{mediaId} - Update artifact media
DELETE /api/v1/artifacts/{artifactId}/media/{mediaId} - Soft delete artifact media
```

### 6. Display Position Management (Admin/Staff/Manager - museum-portal)
```
POST   /api/v1/display-postions              - Create display position
GET    /api/v1/display-postions              - Get all display positions (paging)
PATCH  /api/v1/display-postions/{id}         - Update display position + move to other area
DELETE /api/v1/display-postions/{id}         - Soft delete display position
GET    /api/v1/display-postions/{id}         - Get display position by ID
PATCH  /api/v1/display-postions/{id}/active  - Activate display position
PATCH  /api/v1/display-postions/{id}/maintain - Set display position to maintenance
```

### 7. Visitor Management (Visitor - visitor-portal)
```
GET    /api/v1/visitor                       - Get all visitors
POST   /api/v1/visitor                       - Create visitor
GET    /api/v1/visitor/{id}                  - Get visitor by ID
PUT    /api/v1/visitor/{id}                  - Update visitor
DELETE /api/v1/visitor/{id}                  - Delete visitor
```

### 8. Interaction Management (All roles)
```
GET    /api/v1/interaction                   - Get all interactions
POST   /api/v1/interaction                   - Create interaction
GET    /api/v1/interaction/{id}              - Get interaction by ID
PUT    /api/v1/interaction/{id}              - Update interaction
DELETE /api/v1/interaction/{id}              - Delete interaction
```

### 9. Authentication (Public Access)
```
POST   /api/v1/auth/login/google             - Login with Google
POST   /api/v1/auth/login                    - Login with email/password
POST   /api/v1/auth/logout                   - Logout
```

## Current Status

### ✅ Completed
- Museum Portal: All endpoints configured
- Admin Portal: All endpoints configured
- API client with auth token handling
- Mock data fallback when API unavailable

### 🔄 In Progress
- Real API integration (currently using mock auth)
- Visitor Portal (not implemented yet)

### 📝 Notes
- All endpoints require authentication (lock icon in Swagger)
- Display Position endpoint has typo: `/display-postions` (not `/display-positions`)
- Soft delete is used for museums, artifacts, display positions
- Paging available for areas, artifacts, museums, display positions
