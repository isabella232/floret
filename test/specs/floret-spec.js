const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Bluebird = require('bluebird');
const Rx = require('rxjs');
const ip = require('ip');
const rp = require('request-promise');

chai.use(chaiHttp);

let requestStub;
let gatewayStub;
describe('Floret', () => {
    const Floret = require('../../lib/floret');
    const floret = new Floret();
    let server, request, gw;

    const gatewayHost = ip.address();
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
        gatewayModuleName: 'floret-gateway-kong'
    };

    let floretConfig = new floret.Config(config);
    let spy;
    // start floret service

    let rpPostStub;
    let rpGetStub;

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

        require('../stubs/gateway.stubs')(sinon, floret);

        gw = floret.gateway;

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
            //const spy = sinon.spy(floret.gateway, 'deleteAPI');
            floret.deleteAPI('foo');
            sinon.assert.called(gw.deleteAPI);

            //assert(spy.callCount === 1);
            //spy.restore();
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
    /*
    todo: rework

    describe('Subscribers', () => {
        let sub;
        let subKey;

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

            floret.addChannel(testChannel);
            floret.initChannel('subscriber-test');
            channel = floret.channels[testName];

            const res = await
                request
                    .post(`${floret.baseURI}/subscribe`)
                    .send({
                        name: 'testSubscriber',
                        url: `${floret.baseURI}/test`,
                        channel: 'channel-test',
                        service: 'mock-floret',
                    });


            subKey = JSON.parse(res.text).name;
            sub = floret.channels['subscriber-test'].subscribers[subKey];
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
    */
    describe('Package', () => {
        let pkg;
        before(() => {
            const config = {
                sender: 'tester',
                receiver: 'foo',
                channel: 'channel-test',
                payload: {foo: 'bar'},
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
            pkg.payload = {baz: 'payload-2'};
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
