/**
 * Initialize a default list of allowed clients. The client that is added describes
 * the client that is used in the resourceServer example project.
 */
function initializeClients() {
    var clients = [
        {
            clientId: 'resourceServerClient',
            active: true,
            redirectUri: 'http://localhost:3101',
            clientSecret: '12345'
        }
    ];

    console.log('Upserting', clients.length, 'clients');
    for (var i = 0; i < clients.length; ++i) {
        var client = clients[i];
        oAuth2Server.collections.client.upsert(
            {
                clientId: client.clientId
            },
            {
                $set: client
            }
        );
    }
}

// on startup, update/create the allowed clients.
Meteor.startup(initializeClients);

