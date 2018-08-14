let FloretSubscriber;

{
    const _name = Symbol('name');
    const _serviceName = Symbol('serviceName');
    const _endpoint = Symbol('endpoint');
    const _observer = Symbol('observer');

    FloretSubscriber = class FloretSubscriber {
        constructor(subName, serviceName, subEndpoint) {
            if (subName && serviceName && subEndpoint) {
                // the endpoint to post to
                this[_name] = subName;
                this[_endpoint] = subEndpoint;
                this[_serviceName] = serviceName;
            } else {
                throw new Error('FloretSubscriber requires name, service name and endpoint arguments');
            }
        }

        get name(){
            return this[_name];
        }

        set name(name){
            this[_name] = name;
        }

        get observer() {
            return this[_observer];
        }

        set observer(ob){
            this[_observer] = ob;
        }

        get endpoint(){
            return this[_endpoint];
        }

        set endpoint(ep){
            this[_endpoint] = ep;
        }

        get serviceName () {
            return this[_serviceName];
        }

        set serviceName (name) {
            this[_serviceName] = name;
        }
        unsubscribe() {
            this[_observer].unsubscribe();

        }
    }
}

module.exports = FloretSubscriber;