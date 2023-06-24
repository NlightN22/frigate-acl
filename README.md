
# ACL Frigate features
You can define roles on the keycloack authorization server. 
Based on the roles you have defined, you can grant access on the client in the Access section.
You can also set the birdseye role to define user access through the role.


## How it works
I created proxy-server witch modify answers from frigate API. 
And that is the reason for set frigate server to private localhost (127.0.0.1) and must be closed from external connections!
I don't want to modify frigate backend and frontend too much, and i added only two pages on frontend.
I can't make normal build for frontend, because vite builder had too much modifications, and it does not work correctly. 
And the one more reason to not use builder - frigate production version works on docker with root rights, like node.
I mainly use nestjs, mongodb, mongo-express. Mongo-express is optional


## Installation
* Installing and configuring the keycloak authorization server
* Create keycloak client for frigate-acl server. You can test them on https://www.keycloak.org/app/
* Create keycloack user for frigate-acl server.
* Grant access to the keycloack user for viewving keycloak roles. Role named - 'view-roles'
* You can check access to the roles by post query to https://your.keycloack.server:8443/admin/realms/frigate-realm/roles. With access_token of course.
* Create users and assing roles for them at keycloak
* Assing admin role to admin user
* Create folder /opt/frigate
* Download docker-compose.example.yml from example folder to /opt/frigate
* Download config.example.yml from example folder to /opt/frigate
* Define your params at compose and config files. They has comments and predefined params.
* Check compose config
```bash 
docker compose config
``` 
* Run containers 
```bash
docker compose up -d
```

## example of .env file to start on development mode
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