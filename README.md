
# ACL Frigate features
You can define roles on the keycloack authorization server. 
Based on the roles you have defined, you can grant access on the client in the Access section.
You can also set the birdseye role to define user access through the role.


## Installation
* Installing and configuring the keycloak authorization server
* Create keycloak client for frigate-acl server. You can test them on https://www.keycloak.org/app/
* Create keycloack user for frigate-acl server.
* Grant access to the keycloack user for viewving keycloak roles. Role named - 'view-roles'
* You can check access to the roles by post query to https://your.keycloack.server:8443/admin/realms/frigate-realm/roles. With access_token of course.
* Create users and assing roles for them at keycloak
* Assing admin role to admin user
* Download docker-compose.yml
* Create .env file and define parameters
* Start docker compose up -d

## .env file
```bash
MONGODB_URI=mongodb://username:password@localhost/db-name?authSource=admin
BIRDS_ROLE=birdseyeRole
ADMIN_ROLE=admin
SERVER_HOST=localhost
SERVER_PORT=3333
FRIGATE_LOCAL_SERVER=http://localhost:5000
FRIGATE_FROTEND_SERVER=http://your-server-name.com:port

AUTH_CLIENT_ID=keycloack-client-name
AUTH_CLIENT_SECRET=keycloack-client-secret
AUTH_CLIENT_USERNAME=keycloack-username
AUTH_CLIENT_PASSWORD=keycloack-user-password
AUTH_REALM_PATH=https://your.keycloack.server:8443/realms/frigate-realm
```

### Thanks to
* [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
* [Frigate](https://github.com/blakeblackshear/frigate) backend and frontend nvr server.
* [Keycloak](https://github.com/keycloak/keycloak) Open Source Identity and Access Management solution for modern Applications and Services.