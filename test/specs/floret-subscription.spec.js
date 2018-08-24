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

describe('Subscriptions', () => {
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


    let script;
    let
        observer;
    before(() => {
        floret.configure(new floret.Config(config));
        //name, service, router, host
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
    /* todo: evaluate this
    it('should create new subscription endpoints', async () => {
        script.uri = '/subscription/foo';
        // create a new endpoint, and listen for messages
        await script.createSubscriptionEndpoint();

        const onIncoming = (msg) => {
            assert.isObject(msg);
            return msg;
        };

        const sub = script.observable.subscribe(onIncoming);
        const pkg = new floret.Package('bar', 'foo', 'channel-test', {testFor: 'foo'});

        const res = await request
            .post(floret.baseURI + script.uri)
            .send(pkg.toJSON())
            .expect(200);
        sub.unsubscribe();
    }); */

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