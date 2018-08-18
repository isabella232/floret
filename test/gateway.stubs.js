module.exports = (sinon, floret) => {
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
    console.log('createNewRoute stub called');

    return [{
      host: '192.168.1.68',
      created_at: 1534218595,
      connect_timeout: 60000,
      id: '9c00be92-7ae8-4748-bd06-routeIdMock',
      protocol: 'http',
      name: 'mock-floret',
      read_timeout: 60000,
      port: 8082,
      path: '/',
      updated_at: 1534218595,
      retries: 5,
      write_timeout: 60000,
      service: {
        id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
      },
    }];
  });

  sinon.stub(floret.gateway, 'getServiceByName').callsFake((obj) => {
    console.log('getServiceByName stub called');
    console.log('returning, ', JSON.stringify({
      host: '192.168.1.68',
      created_at: 1534218595,
      connect_timeout: 60000,
      id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
      protocol: 'http',
      name: 'mock-floret',
      read_timeout: 60000,
      port: 8082,
      path: '/',
      updated_at: 1534218595,
      retries: 5,
      write_timeout: 60000,

    }));

    return {
      host: '192.168.1.68',
      created_at: 1534218595,
      connect_timeout: 60000,
      id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
      protocol: 'http',
      name: 'mock-floret',
      read_timeout: 60000,
      port: 8082,
      path: '/',
      updated_at: 1534218595,
      retries: 5,
      write_timeout: 60000,

    };
  });

  sinon.stub(floret.gateway, 'getServiceRoutes').callsFake((name) => {
    console.log(`getServiceRoutes stub called: ${name}`);
    if (name.indexOf('-channel') > -1) {
      console.log('channel routes');
      return [
        {
          created_at: 1534439100,
          strip_path: false,
          hosts: null,
          preserve_host: false,
          regex_priority: 0,
          updated_at: 1534440199,
          paths: [
            '/unit-test-floret/channels/interruption',
            '/',
          ],
          service: {
            id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
          },
          methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
          ],
          protocols: [
            'http',
            'https',
          ],
          id: 'a680501f-c6e4-4acf-87ef-6417af20e7d3',
        },
      ];
    } if (name.indexOf('-subscriber') > -1) {
      console.log('subscriber routes');
      return [
        {
          created_at: 1534439123,
          strip_path: false,
          hosts: null,
          preserve_host: false,
          regex_priority: 0,
          updated_at: 1534440189,
          paths: [
            '/unit-test-floret/channels/interruption/subscriber/unit-test-floret-2/subscriptions/interruption-sub',
            '/',
          ],
          service: {
            id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
          },
          methods: [
            'GET',
            'POST',
            'OPTIONS',
            'DELETE',
          ],
          protocols: [
            'http',
            'https',
          ],
          id: 'e726aa37-83b1-4239-a26b-5fac5ff6df15',
        },
      ];
    }
    console.log('api routes');
    return [
      {
        created_at: 1534439100,
        strip_path: false,
        hosts: null,
        preserve_host: false,
        regex_priority: 0,
        updated_at: 1534440199,
        paths: [
          '/unit-test-floret/service/interruption',
          '/unit-test-floret/service',
          '/unit-test-floret/service-status',
          '/unit-test-floret/floret.json',
          '/unit-test-floret/healthcheck',
          '/unit-test-floret/healthcheck/ping',
          '/unit-test-floret/subscribe',
          '/',
        ],
        service: {
          id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
        },
        methods: [
          'GET',
          'POST',
          'PUT',
          'PATCH',
          'DELETE',
        ],
        protocols: [
          'http',
          'https',
        ],
        id: '66891729-b853-4e23-a622-82d52e9d3673',
      },
    ];
  });

  sinon.stub(floret.gateway, 'subscribe').callsFake(() => {
    console.log('subscribe stub called');
    return [];
  });

  sinon.stub(floret.gateway, 'discoverChannels').callsFake(() => {
    console.log('discoverChannels stub called');
    return [];
  });

  sinon.stub(floret.gateway, 'getAPIs').resolves({
    data: [
      {
        name: 'api1',
      },
      {
        name: 'api2',
      }],
  });

  sinon.stub(floret.gateway, 'getAPI').callsFake((name) => {
    console.log('getAPI stub');
    if (!name) {
      throw new Error('bad api request');
    }
    return {
      name,
    };
  });

  sinon.stub(floret.gateway, 'discoverAPISpecs').callsFake(() => {
    console.log('apispecs stub');
    return [{ name: 'apiSpec1' }];
  });

  sinon.stub(floret.gateway, 'send').callsFake((options) => {
    console.log('send stub');
    return options.body;
  });

  sinon.stub(floret.gateway, 'addService').callsFake(({
    name, protocol = 'http', host, port, path, retries = 5, connect_timeout = 60000, write_timeout = 60000, read_timeout = 60000,
  }) => {
    console.log('addService stub');
    return {
      name,
      host,
      port,
      protocol,
      path,
      retries,
      connect_timeout,
      write_timeout,
      read_timeout,
    };
  });

  sinon.stub(floret.gateway, 'addRoute').callsFake(({
    serviceName, protocols = ['http', 'https'], methods, hosts, paths = [], strip_path = false, preserve_host = false,
  }) => {
    console.log('addRoute stub');
    return {
      next: null,
      data: [
        {
          created_at: 1534439123,
          strip_path: false,
          hosts: null,
          preserve_host: false,
          regex_priority: 0,
          updated_at: 1534440189,
          paths: [
            '/unit-test-floret/healthcheck',
            `/unit-test-floret/${serviceName}`,
            '/',
          ],
          service: {
            id: '9c00be92-7ae8-4748-bd06-serviceIdMock',
          },
          methods,
          protocols: [
            'http',
            'https',
          ],
          id: 'e726aa37-83b1-4239-a26b-5fac5ff6df15',
        },
      ],
    };
  });

  sinon.stub(floret.gateway, 'gatewayHealthCheck').callsFake(() => ({
    ping: {
      healthy: true,
    },
    'api-gateway': {
      healthy: true,
      message: 'api gateway at unit test localhost',
    },
  }));

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
