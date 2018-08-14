const Rx = require('rxjs');
let FloretSubscription;

{
    const _name = Symbol('name');
    const _service = Symbol('service');
    const _router = Symbol('router');
    const _endpoint = Symbol('endpoint');
    const _uri = Symbol('uri');
    const _subject = Symbol('subject');

    FloretSubscription = class FloretSubscription {
        constructor(name, service, router, host) {
            this[_name] = name;
            this[_router] = router;
            this[_service] = service;
            this[_endpoint] = `${host}/${this[_service].name}/subscriptions/${this[_name]}`;
            this[_uri] =  `/subscriptions/${this[_name]}`;
            this[_subject] = new Rx.Subject();
        }

        async init() {
            await this.createSubscriptionEndpoint();
        }

        async createSubscriptionEndpoint() {
            return await this[_router].post( this[_uri], (msg) => {
                this[_subject].next(msg);
            });
        }

        get name() {
            return this[_name];
        }

        set name(name) {
            this[_name] = name;
        }

        get uri() {
            return this[_uri];
        }

        set uri(uri) {
            this[_uri] = uri;
        }

        get endpoint() {
            return this[_endpoint];
        }

        set endpoint(endpoint) {
           this[_endpoint] = endpoint;
        }

        get service() {
            return this[_service];
        }

        get router() {
            return this[_router];
        }

        get observable() {
            return this[_subject];
        }

        set observable(sub) {
            this[_subject] = sub;
        }
    }
}

module.exports = FloretSubscription;