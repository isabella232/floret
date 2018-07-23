module.exports = (sinon, floret) =>{


// capture all the request

// test the gateway functions

// stub the gateway methods

/*
sinon.stub(floret.gateway,'createChannelAPI').resolves(() =>{
    console.log('createChannelAPI stub called')
});

sinon.stub(floret.gateway,'createSubscriptionAPI').resolves(() =>{
    console.log('createSubscriptionAPI stub called')
});

sinon.stub(floret.gateway,'deleteChannelAPI').resolves(() =>{
    console.log('deleteChannelAPI stub called')
});

sinon.stub(floret.gateway,'deleteAllAPIs').resolves(() =>{
    console.log('deleteAllAPIs stub called')
});

sinon.stub(floret.gateway,'register').resolves(() =>{
    console.log('register stub called')
});

sinon.stub(floret.gateway,'discover').resolves(() =>{
    console.log('discover stub called')
});

sinon.stub(floret.gateway,'discoverChannels').callsFake(() =>{
    console.log('discoverChannels stub called')
    return [];
});

sinon.stub(floret.gateway,'discoverAllChannels').resolves(() =>{
    console.log('discoverAllChannels stub called')
});

sinon.stub(floret.gateway,'discoverServices').resolves(() =>{
    console.log('discoverServices stub called')
});

sinon.stub(floret.gateway,'discoverServiceChannels').resolves(() =>{
    console.log('discoverServiceChannels stub called')
});

sinon.stub(floret.gateway,'discoverSubscribers').callsFake(() =>{
    console.log('discoverSubscribers stub called');
    return [];
});

sinon.stub(floret.gateway,'register').resolves(() =>{
        console.log('register stub called')
    });
    sinon.stub(floret.gateway,'discover').resolves(() =>{
        console.log('discover stub called')
    });
    sinon.stub(floret.gateway,'discoverAllChannels').resolves(() =>{
        console.log('discoverAllChannels stub called')
    });
*/
    sinon.stub(floret.gateway, 'createNewRoute').callsFake((obj) => {
        console.log('createNewRoute stub called')

        return [{
            "host": "192.168.1.68",
            "created_at": 1534218595,
            "connect_timeout": 60000,
            "id": "9c00be92-7ae8-4748-bd06-routeIdMock",
            "protocol": "http",
            "name": "mock-floret",
            "read_timeout": 60000,
            "port": 8082,
            "path": "/",
            "updated_at": 1534218595,
            "retries": 5,
            "write_timeout": 60000,
            "service": {
                "id": "9c00be92-7ae8-4748-bd06-serviceIdMock"
            }
        }]
    });

    sinon.stub(floret.gateway, 'getServiceByName').callsFake((obj) => {
        console.log('getServiceByName stub called')

        return {
            "host": "192.168.1.68",
            "created_at": 1534218595,
            "connect_timeout": 60000,
            "id": "9c00be92-7ae8-4748-bd06-serviceIdMock",
            "protocol": "http",
            "name": "mock-floret",
            "read_timeout": 60000,
            "port": 8082,
            "path": "/",
            "updated_at": 1534218595,
            "retries": 5,
            "write_timeout": 60000

        }
    });

    sinon.stub(floret.gateway,'subscribe').callsFake(() =>{
        console.log('subscribe stub called')
        return [];
    });

    sinon.stub(floret.gateway,'discoverChannels').callsFake(() =>{
        console.log('discoverChannels stub called')
        return [];
    });

    sinon.stub(floret.gateway,'getAPIs').resolves({"data": [
            {
                "name": "api1"
            },
            {
                "name": "api2"
            }]}
    );

    sinon.stub(floret.gateway,'getAPI').callsFake((name) => {

        if (!name) {

            throw new Error('bad api request');
        }
        return {
            "name": name
        }
    });

    sinon.stub(floret.gateway,'discoverAPISpecs').callsFake(() =>{
        console.log('apispecs stub')
        return [{"name": "apiSpec1"}];
    });

/*
sinon.stub(floret.gateway,'apiRequestByName').resolves(() =>{
    console.log('apiRequestByName stub called')
});

sinon.stub(floret.gateway,'apiRequestByURI').resolves(() =>{
    console.log('apiRequestByURI stub called')
});

sinon.stub(floret.gateway,'getAPIsWithUpstreamURL').resolves(() =>{
    console.log('getAPIsWithUpstreamURL stub called')
});

sinon.stub(floret.gateway,'addAPI').resolves(() =>{
    console.log('addAPI stub called')

});

sinon.stub(floret.gateway,'deleteAPI').resolves(() =>{
    console.log('deleteAPI stub called')
});

sinon.stub(floret.gateway,'subscribeTo').resolves( () => {
    console.log('subscribeTo stub called');
});

sinon.stub(floret.gateway,'unsubscribe').resolves(() =>{
    console.log('unsubscribe stub called')
});
sinon.stub(floret.gateway,'loadSubscribers').resolves(() =>{
    console.log('loadSubscribers stub called')
});

sinon.stub(floret.gateway,'discoverAPISpecs').callsFake(() =>{
    console.log('apispecs stub')
    return [{"name": "apiSpec1"}];
});
sinon.stub(floret.gateway,'').callsFake(() =>{
    console.log(' stub called')
});
sinon.stub(floret.gateway,'').callsFake(() =>{
    console.log(' stub called')
});
sinon.stub(floret.gateway,'').callsFake(() =>{
    console.log(' stub called')
});
sinon.stub(floret.gateway,'').callsFake(() =>{
    console.log(' stub called')
});
sinon.stub(floret.gateway,'').callsFake(() =>{
    console.log(' stub called')
});
*/

};