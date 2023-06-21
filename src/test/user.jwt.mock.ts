export const jwtRoleMock = {
    "exp": 1687293453,
    "iat": 1687257453,
    "jti": "48bee742-5469-4c0d-a6bf-522f30c86e54",
    "iss": "https://oauth.komponent-m.ru:8443/realms/frigate-realm",
    "aud": [
        "realm-management",
        "account"
    ],
    "sub": "e54f8216-a5bb-4b95-8908-84bd2ef50549",
    "typ": "Bearer",
    "azp": "frigate-cli",
    "session_state": "611b076b-6ee8-4e25-b57b-47d4fd264e38",
    "acr": "1",
    "allowed-origins": [
        "*"
    ],
    "realm_access": {
        "roles": [
            "offline_access",
            "default-roles-frigate_app",
            "view-roles",
            "admin",
            "uma_authorization",
            "birdseyeRole"
        ]
    },
    "resource_access": {
        "realm-management": {
            "roles": [
                "view-realm",
                "view-identity-providers",
                "manage-identity-providers",
                "impersonation",
                "realm-admin",
                "create-client",
                "manage-users",
                "query-realms",
                "view-authorization",
                "query-clients",
                "query-users",
                "manage-events",
                "manage-realm",
                "view-events",
                "view-users",
                "view-clients",
                "manage-authorization",
                "manage-clients",
                "query-groups"
            ]
        },
        "account": {
            "roles": [
                "manage-account",
                "manage-account-links",
                "view-profile"
            ]
        }
    },
    "scope": "profile",
    "sid": "611b076b-6ee8-4e25-b57b-47d4fd264e38",
    "preferred_username": "frigate-admin@komponent-m.ru",
    "given_name": "",
    "family_name": ""
}