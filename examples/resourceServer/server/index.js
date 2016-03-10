/**
 * AUTH FLOW - C1.1
 * Initialize a default list of allowed clients. The client that is added describes
 * the client that is used in the resourceServer example project.
 */
function initializeClients() {
    var clients = [
        {
            clientId: 'clientApplication', // unique identifier.
            active: true, // whether this client is enabled or not.
            redirectUri: 'http://localhost:3200/_oauth/MeteorOAuth2Server', // provided by the client.
            clientSecret: '12345' // in production, this should be a randomly generated value. Random.secret() is a good choice.
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


// On startup, update/create the allowed clients.
Meteor.startup(initializeClients);
