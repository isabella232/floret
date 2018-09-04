const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Bluebird = require('bluebird');
const Rx = require('rxjs');
const ip = require('ip');
const rp = require('request-promise');

chai.use(chaiHttp);
describe('FloretChannel', () => {
    const Floret = require('../../lib/floret');
    const floret = new Floret();

    const config = {
        name: "channelTestSvc",
        port: 8888,
        uri: '/channelTestSvc',
        host: 'http://localhost',
        root: '../../',
        gatewayHost: 'http://127.0.0.1',
        gatewayProxyPort: 8000,
        gatewayAdminPort: 8001,
        apis: [],
        channels: [{
            name: "testChannel",
            uri: "/test-channel",
            description: "a test channel"
        }],
        subscriptions: [],
        gatewayModuleName: 'floret-gateway-kong'
    };


    const channelConfig = {
        name: 'floret-test-channel',
        description: 'a test channel config',
        uri: '/floret-test-channel',
        endpoint: `http://localhost:8888/test/floret-test-channel`,
    };

    const testChannel = new floret.Channel(channelConfig);

    before(async () => {
        await floret.configure(new floret.Config(config));
        require('../stubs/gateway.stubs')(sinon, floret);
        await floret.init();
    });

    it('should create a channel from floret config', () => {
        assert.isDefined(floret.channels['testChannel']);
    });

    it('should create a channel with floret api', () => {
        floret.addChannel(testChannel);
        assert.isDefined(floret.channels[testChannel.name]);
    });

    it('should delete a channel ', () => {
        floret.deleteChannel(testChannel);
        assert.isUndefined(floret.channels[testChannel.name]);
    });

    it('should set a channel name', () => {
        floret.addChannel(testChannel);
        let channel = floret.channels[testChannel.name];
        assert(channel.name === 'floret-test-channel');
        channel.name = 'newName';
        assert(channel.name === 'newName', 'name not channeld');
        floret.deleteChannel(testChannel);
    });

    it('should subscribe and unsubscribe a subscriber', () => {
        let subscriber = new floret.Subscriber('sub1', 'floret-test', 'http://localhost:8888/test');
        let sub = testChannel.subscribe(subscriber);
        assert.isDefined(testChannel.subscribers['sub1'], 'sub1 subscriber exists');
        testChannel.unsubscribe('sub1');
        assert.isUndefined(testChannel.subscribers['sub1'], 'sub1 was unsubscribed and does not exist');
    });

    it('should return the set subscriber if existing', () => {
        let subscriber = new floret.Subscriber('sub1', 'floret-test', 'http://localhost:8888/test');
        let sub = testChannel.subscribe(subscriber);
        let sub2 = testChannel.subscribe(subscriber);
        assert.deepEqual(sub, sub2);
        testChannel.unsubscribe('sub1');
    });

    it('should set all subscribers', () => {
        let subscriber = new floret.Subscriber('sub2', 'floret-test', 'http://localhost:8888/test');
        let sub = testChannel.subscribe(subscriber);
        let allSubs = testChannel.subscribers;
        let copyOfSubs = Object.create(allSubs);
        copyOfSubs['sub3'] = Object.create(copyOfSubs['sub2']);
        testChannel.subscribers = copyOfSubs;
        assert(testChannel.subscribers['sub3'].name === 'sub2')
    });

    it('should return all current subscribers', () => {
       let subscriber = new floret.Subscriber('sub1', 'floret-test', 'http://localhost:8888/test');
       let sub = testChannel.subscribe(subscriber);
       assert.isDefined(testChannel.subscribers[subscriber.name]);
    });



    it('should use a default default broadcaster'), () => {
        testChannel.broadcast({message: 'test'});
        sinon.assert.called(testChannel.defaultBroadcaster);
    };

    it('should use a default handler for broadcasts'), () => {
        testChannel.broadcast({message: 'test'});
        sinon.assert.called(testChannel.defaultEventHandler);
    };
    it('should broadcast a message', () => {
        floret.addChannel(testChannel);
        testChannel.broadcast({message: 'test'});
        sinon.assert.called(floret.gateway.send);
    });
    it('should have a default handler', async() => {
        assert.isDefined(testChannel.handler);
    });

    it('should set a handler', async() => {
        let spy = sinon.spy();
        let oldFn = Object.create(testChannel.handler);
        testChannel.handler = spy;
        testChannel.broadcast({message: 'test'});
        assert(spy.called);
        testChannel.handler = oldFn;
    });

    it('should get and set service names', () => {
        let sn = 'testServiceName';
        let oldName = testChannel.serviceName;
        testChannel.serviceName = sn;
        assert(testChannel.serviceName === sn);
        testChannel.serviceName = oldName;
    });

    it('should get and set uri', () => {
        let uri = 'testURI';
        let oldUri = testChannel.uri;
        testChannel.uri = uri;
        assert(testChannel.uri === uri);
        testChannel.uri = oldUri;
    });

    it('should get and set endpoint', () => {
        let endpoint = 'testEndpoint';
        let oldEndpoint = testChannel.endpoint;
        testChannel.endpoint = endpoint;
        assert(testChannel.endpoint === endpoint);
        testChannel.endpoint = oldEndpoint;
    });

    it('should get and set description', () => {
        let description = 'testDescription';
        let oldDescription = testChannel.description;
        testChannel.description = description;
        assert(testChannel.description === description);
        testChannel.description = oldDescription;
    });

    it('should get and set api name', () => {
        let apiName = 'testApiName';
        let OldApiName = testChannel.apiName;
        testChannel.apiName = apiName;
        assert(testChannel.apiName === apiName);
        testChannel.apiName = OldApiName;
    });

    it('should get and set broadcaster', () => {
        let broadcaster = 'testApiName';
        let oldBoadcaster = testChannel.broadcaster;
        testChannel.broadcaster = broadcaster;
        assert(testChannel.broadcaster === broadcaster);
        testChannel.broadcaster = oldBoadcaster;
    });
});