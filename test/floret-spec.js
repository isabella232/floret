const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const mockery = require('mockery');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Bluebird = require('bluebird');
const Rx = require('rxjs');
const ip = require('ip');
const rp = require('request-promise');
const request = require('request');


chai.use(chaiHttp);

let requestStub;
describe('Floret', () => {
  const Floret = require('../lib/floret');
  const floret = new Floret();
  let server; let
    request;
  const
    gatewayHost = ip.address();


  const gatewayProxyPort = 8000;


  const gatewayAdminPort = 8001;


  const servicePort = 8096;


  const serviceHost = ip.address();


  const serviceName = 'unit-test-floret';


  const serviceURI = '/unit-test-floret';

  const config = {
    name: serviceName,
    port: servicePort,
    uri: serviceURI,
    host: serviceHost,
    root: '../',
    publishDocs: true,
    gatewayHost,
    gatewayProxyPort,
    gatewayAdminPort,
    disconnected: false,
    apis: [],
    channel: [],
    subscriptions: [],
  };

  let floretConfig = new floret.Config(config);
  let spy;
  // start floret service

  let rpPostStub; let
    rpGetStub;
  before(async () => {
    request = sinon.stub(rp, 'Request');
    request.resolves({
      statusCode: 200,
    });
    rpPostStub = sinon.stub(rp, 'post'); // mock rp.post() calls
    rpGetStub = sinon.stub(rp, 'get');// calls to rp.post() return a promise that will resolve to an object

    rpPostStub.returns(Bluebird.resolve({
      fakedResponse: 'Post will return exactly this',
    }));

    rpGetStub.returns(Bluebird.resolve({
      fakedResponse: 'Get will return exactly this',
    }));

    floret.configure(floretConfig);

    require('./gateway.stubs')(sinon, floret);

    server = await floret.listen();
    request = await supertest(server);

    return request;
  });

  it('should have a healthcheck endpoint', async () => await request
    .get(`${floret.baseURI}/healthcheck`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).ping.healthy).equals(true);
    }));

  it('should suppress 409 error', () => {

  });

  it('should throw non-409 errors', () => {

  });

  it('should return its name', () => {
    expect(floret.name).equals(serviceName);
  });

  it('should return its host', () => {
    expect(floret.host).equals(serviceHost);
  });

  it('should return its port', () => {
    expect(floret.port).equals(servicePort);
  });

  it('should return its baseURL', () => {
    expect(floret.baseURL).equals(`http://${serviceHost}:${servicePort}/${serviceName}`);
  });

  it('should return its url', () => {
    expect(floret.url).equals(`${serviceHost}:${servicePort}`);
  });

  it('should return its baseURI', () => {
    expect(floret.baseURI).equals(serviceURI);
  });

  it('should return its uri', () => {
    expect(floret.uri).equals(serviceURI);
  });

  it('should return a Service object', () => {
    assert.instanceOf(floret.service, floret.Service);
  });

  it('should return a router object', () => {
    assert.isObject(floret.router);
  });

  it('should return a Gateway object', () => {
    assert.instanceOf(floret.gateway, floret.Gateway);
  });

  it('should return a config object', () => {
    assert.instanceOf(new floret.Config(floret.config), floret.Config);
  });


  describe('API', () => {
    it('should get api by name', async () => {
      console.log(floret.getAPI('apiTest'));
      const api = await floret.getAPI('apiTest');
      expect(api.name).equals('apiTest');
    });

    it('should return empty object when not found', () => {
      assert.isEmpty(floret.getAPI());
    });

    it('should register api at gateway', () => {

    });

    it('should fail on unsuccessful api registration', () => {

    });

    it('should register external apis at gateway', () => {

    });

    it('should fail when it cannot register external apis at gateway', () => {

    });

    it('should delete api from gateway', () => {
      const spy = sinon.spy(floret.gateway, 'deleteAPI');
      floret.deleteAPI('foo');
      assert(spy.callCount === 1);
      spy.restore();
    });

    it('should delete all apis from gateway', async () => {
      /*
            let spy = sinon.spy(floret.gateway, 'deleteAPI');
            //let newStub = sinon.stub(floret.gateway, 'getAPIs');
            await floret.gateway.deleteAllAPIs();
            //newStub.resolves(apis);
            console.log('(spy.callCount' + (spy.callCount))
            assert(spy.callCount === 2);
            spy.restore();
            */
    });
  });

  describe('API Docs', () => {
    it('should serve an api spec', () => request
      .get(`${floret.baseURI}/api-spec.json`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(JSON.parse(res.text).info.title).to.equal(floret.name);
      }));

    it('should build and return the api spec', () => {
      expect(floret.buildAPISpec([]).info.title).to.equal(floret.name);
    });

    it('should discover all api specs', async () => {
      const specs = await floret.discoverAPISpecs();
      expect(specs[0].name).to.equal('apiSpec1');
    });
  });

  describe('Channels', () => {
    let channels; let testChannel; let rpSpy; let
      handlerFn;

    before(async () => {
      // create a new channel
      const testName = 'channel-test';
      handlerFn = options => rp.post(options);
      rpSpy = sinon.spy(handlerFn);

      testChannel = new floret.Channel({
        name: 'channel-test',
        description: `channel for : ${testName}`,
        endpoint: `${floret.url}/${testName}`,
        serviceName: floret.name,
        uri: `/events/${testName}`,
      }, handlerFn);

      await floret.addChannel(testChannel);
      channel = floret.channels[testName];

      const subCallback = sinon.stub();
      // create a subscriber
      const res = await
      request
        .post(`${floret.baseURI}/subscribe`)
        .send({
          name: 'testSubscriber', url: `${floret.baseURI}/test`, channel: 'channel-test', service: 'mock-floret',
        });


      const key = JSON.parse(res.text).name;
    });

    it('should initialize all channels', () => {

    });

    it('should initialize a single channel', () => {

    });

    it('should add man channels', () => {

    });

    it('should add a single channel', async () => {
      const testName = 'channel-test2';
      const newChan = new floret.Channel(
        {
          name: testName,
          description: `channel for : ${testName}`,
          endpoint: `${floret.url}/${testName}`,
          serviceName: floret.name,
          hostURL: floret.host,
          hostPort: floret.url,
          uri: `/events/${testName}`,
        },
      );
      const res = await floret.addChannel(newChan);
      channel = floret.channels[testName];

      assert.isObject(channel);
    });

    it('should get the channels spec', () => {
      assert.isObject(floret.channels['channel-test'].config());
    });


    it('should broadcast', async () => {
      const script = new floret.Subscription('testScript', floret.service, floret.router, floret.gateway);
      const ob = () => {
        console.log('*************** received');
      };
      await script.init();
      await script.observable.subscribe(ob);
      await script.observable.next('cool');
      const spy = sinon.stub(floret.channels['channel-test'], 'handler').callsFake(() => {

      });

      await floret.channels['channel-test'].broadcast('unit-test-floret', { foo: 'Bar' });
    });

    it('should update a channel', () => {

    });

    it('should delete a channel', () => {


    });

    it('should get all channels', () => {

    });

    it('should set all channels', () => {

    });

    it('should discover channels at gateway', () => {

    });

    it('should create channel api at gateway', () => {

    });

    it('should delete channel at gateway', () => {

    });
  });

  describe('Subscriptions', () => {
    let script; let
      observer;
    before(() => {
      script = new floret.Subscription('testScript', floret.service, floret.router, floret.gateway);
      observer = sinon.stub();
      script.observable.subscribe(observer);
    });

    it('should initialize subscriptions', async () => {
      const res = await expect(async () => await script.init()).to.not.throw();

      assert.isObject(res);
    });

    it('should have a setter for observable', async () => {
      const subject = new Rx.Subject();
      // set a new observable
      script.observable = subject;

      // wrapped in promise, wait until fired to test
      const sub = await script.observable.subscribe((msg) => {
        expect(msg).to.equal('test');
      });

      // invoke
      script.observable.next('test');
      sub.unsubscribe();
    });

    it('should have a setter for endpoint', () => {
      const oldEndpoint = script.endpoint;
      script.endpoint = 'http://127.0.0.1:8096/unit-test-floret/subscription/new';
      assert(script.endpoint !== oldEndpoint);
    });

    it('should have a setter for uri', () => {
      const oldUri = script.uri;
      script.uri = '/unit-test-floret/subscription/newUri';
      assert(script.uri !== oldUri);
    });

    it('should have a setter for name', () => {
      const oldName = script.name;
      script.name = 'newName';
      assert(script.name !== oldName);
    });

    it('should create new subscription endpoints', async () => {
      script.uri = '/subscription/foo';
      // create a new endpoint, and listen for messages
      await script.createSubscriptionEndpoint();

      const onIncoming = (msg) => {
        assert.isObject(msg);
        return msg;
      };

      const sub = script.observable.subscribe(onIncoming);
      const pkg = new floret.Package('bar', 'foo', 'channel-test', { testFor: 'foo' });

      const res = await request
        .post(floret.baseURI + script.uri)
        .send(pkg.toJSON())
        .expect(200);
      sub.unsubscribe();
    });

    it('should return a service', () => {
      assert.isObject(script.service);
    });

    it('should return a router', () => {
      assert.isObject(script.router);
    });

    it('should return Subscription class', () => {
      const Subscription = floret.Subscription;
      const subscription = new Subscription('foo', floret.service, floret.router, floret.gateway);
      assert.instanceOf(subscription, Subscription);
    });
  });

  describe('Subscribers', () => {
    let sub;
    let subKey;
    let Sub;
    before(async () => {
      // create a new channel
      const testName = 'subscriber-test';
      testChannel = new floret.Channel(
        {
          name: testName,
          description: `channel for : ${testName}`,
          endpoint: `${floret.url}/${testName}`,
          serviceName: floret.name,
          hostURL: floret.host,
          hostPort: floret.port,
          uri: `/events/${testName}`,
        },
      );

      await floret.addChannel(testChannel);
      channel = floret.channels[testName];

      const res = await
      request
        .post(`${floret.baseURI}/subscribe`)
        .send({
          name: 'testSubscriber', url: `${floret.baseURI}/test`, channel: 'channel-test', service: 'mock-floret',
        });

      subKey = JSON.parse(res.text).name;
      console.log('looking for ' + subKey)
        console.log(JSON.stringify(floret.channels['channel-test'].subscribers["testSubscriber"]))
      sub = floret.channels['channel-test'].subscribers[subKey];
      console.log(sub.name)
        console.log(sub.observer)
    });

    it('should return Subscriber class', () => {
      const Sub = floret.Subscriber;
      const newSub = new Sub('mockSub', 'mock-floret', `${floret.baseURI}/test`);
      assert.instanceOf(newSub, Sub);
    });

    it('should have an observer', () => {
      assert.isObject(sub.observer);
      assert.isFalse(sub.observer.closed);
    });

    it('should have an observer', () => {
      assert.isObject(sub.observer);
    });

    it('should have a name', () => {
      assert.isString(sub.name);
    });

    it('should have an endpoint', () => {
      assert.isString(sub.endpoint);
    });

    it('should throw an error if not supplied enough arguments', () => {
      expect(() => {
        const newSub = new floret.Subscriber();
      }).to.throw();
    });

    it('should have a name setter', () => {
      sub.name = 'newName';
      assert(floret.channels['channel-test'].subscribers[subKey].name === 'newName');
    });

    it('should have an endpoint setter', () => {
      sub.endpoint = 'http://new.ep';
      assert(floret.channels['channel-test'].subscribers[subKey].endpoint === 'http://new.ep');
    });

    it('should unsubscribe observer', () => {
      sub.unsubscribe();
      assert.isTrue(sub.observer.closed);
    });
  });

  describe('Gateway', () => {
    let gw; let gwSpy; let rpSpy; let
      rpStub;
    const rp = require('request-promise');
    before(async () => {
      floretConfig = {
        name: serviceName,
        port: servicePort,
        uri: serviceURI,
        host: serviceHost,
        environments: {
          local:
                        {
                          gatewayHost,
                          gatewayProxyPort,
                          gatewayAdminPort,
                        },
        },
        publishDocs: true,
      };

      const newConfig = new floret.Config(floretConfig);
      floret.configure(newConfig);
      gw = floret.gateway;
    });

    beforeEach(() => {
      gwSpy = sinon.spy(gw, 'send');
    });
    afterEach(() => {
      gwSpy.restore();
    });

    it('should send http get requests', async () => {
      const res = await gw.send({ uri: 'foo.cool.bar' });
      assert(gwSpy.callCount === 1);
    });

    it('should send http post requests', async () => {
      const res = await gw.send({ uri: 'foo.cool.bar', method: 'post' });
      assert(gwSpy.callCount === 1);
    });

    it('should send http delete requests', async () => {
      const res = await gw.send({ uri: 'foo.cool.bar', method: 'del' });
      assert(gwSpy.callCount === 1);
    });

    it('should send http put requests', async () => {
      const res = await gw.send({ uri: 'foo.cool.bar', method: 'put' });
      assert(gwSpy.callCount === 1);
    });

    it('should send http patch requests', async () => {
      const res = await gw.send({ uri: 'foo.cool.bar', method: 'patch' });
      assert(gwSpy.callCount === 1);
    });
    /*
        it('should suppress 409 errors', async () => {
            rpGetStub.rejects({"statusCode": 409})
            let spy = sinon.spy(gw, 'suppress409');
            let res = await gw.send({"uri": "foo.bar", "method": "get"})
            expect(spy).to.not.throw();
            spy.restore();
        });

        it('should raise non 409 errors', async () => {
            rpGetStub.rejects(401);
            let spy = sinon.spy(gw, 'suppress409');

            try {
               await gw.send({"uri": "foo.bar", "method": "get"}).then( () => {
                   assert(spy.callCount === 1);
               })

            } catch(e){console.log(e)};
        })
        */
  });

  describe('Package', () => {
    let pkg;
    before(() => {
      const config = {
        sender: 'tester',
        receiver: 'foo',
        channel: 'channel-test',
        payload: { foo: 'bar' },
      };

      pkg = new floret.Package(config);
    });

    it('should return a sender', () => {
      assert.isString(pkg.sender);
    });

    it('should set a sender', () => {
      const old = pkg.sender;
      pkg.sender = 'tester-2';
      assert(old !== pkg.sender);
    });

    it('should return a receiver', () => {
      assert.isString(pkg.receiver);
    });

    it('should set a receiver', () => {
      const old = pkg.receiver;
      pkg.receiver = 'baz';
      assert(old !== pkg.receiver);
    });

    it('should return a channel', () => {
      assert.isString(pkg.channel);
    });

    it('should set a channel', () => {
      const old = pkg.channel;
      pkg.channel = 'channel-2';
      assert(old !== pkg.channel);
    });

    it('should return a payload', () => {
      assert.isObject(pkg.payload);
    });

    it('should set a payload', () => {
      const old = Object.create(pkg.payload);
      pkg.payload = { baz: 'payload-2' };
      assert(old !== pkg.payload);
    });
  });

  describe('Service', () => {
    let service;
    before(() => {
      service = floret.service;
    });

    it('should return a port ', () => {
      assert.isNumber(service.port);
    });

    it('should set a port', () => {
      const op = service.port;
      service.port = 1234;
      assert(op !== service.port);
    });

    it('should return a name', () => {
      assert.isString(service.name);
    });

    it('should set a name', () => {
      const oldName = service.name;
      service.name = 'newName';
      assert(oldName !== service.name);
    });

    it('should return a host', () => {
      assert.isString(service.host);
    });

    it('should set a host', () => {
      const oldHost = service.host;
      service.host = 'http://new.com';
      assert(oldHost !== service.host);
    });

    it('should return a proxyURI', () => {
      assert.isString(service.proxyURI);
    });

    it('should set a proxyURI', () => {
      const oldURI = service.proxyURI;
      service.proxyURI = 'newName';
      assert(oldURI !== service.proxyURI);
    });
  });
});
