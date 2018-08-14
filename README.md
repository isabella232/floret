![Event Flow](images/floret-logo.png) *floret - Noun: one of the small flowers making up a composite flower head.*
# Floret Microservices
## Overview
###  A microservice framework for node

Floret.js is a library for building microservices in nodejs environments.  
  
Floret builds your microservice based upon the floret.json configuration file you provide.  Configure service details (host, port, uri, etc), 
channels and subscriptions for event-driven, service-to-service communication, apis, gateway information and more.

### Rapid service development
With a few lines of code, your floret microservice will:  

* self-register with an api gateway
* create healthcheck endpoints
* generate an Open API spec
* create an api for managing pub/sub operations
* discover channels and their subscribers from the gateway
* discover subscriptions to other floret services

### Architectural Requirements
Refer [here](#architecture-overview) to understand floret's microservice architecture.

## Installation 

### Prerequisites

Floret requires __node v8.x__ or higher.


Floret requires an api gateway for communication features.  Kong API Gateway is currently supported.  
  [See here](#kong-install) for container-based deployment instructions.

```
$ npm i floret
```

### Get Started with Example Guides and Projects
#### Guides
[stand-alone service](https://github.com/Acxiom/floret-example/blob/develop/guides/stand-alone-service.md)

[hello-galaxy-microservices](https://github.com/Acxiom/floret-example/blob/develop/guides/hello-galaxy.md)

#### Projects
[floret-chat](https://github.com/Acxiom/floret-example/tree/develop/projects/floret-chat)


# Appendix

## <a name="architecture-overview">Architecture</a>
### Core libraries
Floret is built upon [KOA](https://github.com/koajs/koa).  KOA provides the http middleware framework for writing web applications and apis.  
Floret uses reactive programming concepts to handle observable incoming events.  See [rxjs](http://reactivex.io/rxjs/) for more details.

### Floret Environment
Floret services are event driven, publishing and subscribing to event data via a central API Gateway.  The illustration  
below is an example of a floret.  Each floret service provide specific functionality.

![Ecosystem](images/floret-ecosystem-ex.png)


## <a name="kong-install">Installing Kong API Gateway</a>

Floret uses [Kong API Gateway](https://getkong.org/) CE version > 0.14.x

The recommended way to run your gateway is with docker containers.  
https://hub.docker.com/_/kong/

#### Example Run commands for Kong + Cassandra

#### postgres
```
docker run -d --name kong-database-14 \
                -p 5432:5432 \
                -e "POSTGRES_USER=kong" \
                -e "POSTGRES_DB=kong" \
                postgres:9.5
```    

#### db staging
````
docker run --rm \
    --link kong-database-14:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    kong:0.14.0-alpine kong migrations up
````

#### kong
````
docker run -d --name kong-14 \
    --link kong-database-14:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database-14" \
    -e "POSTGRES_USER=kong" \
    -e "POSTGRES_DB=kong" \
    -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
    -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" \
    -e "KONG_ADMIN_LISTEN_SSL=0.0.0.0:8444" \
    -p 8000:8000 \
    -p 8443:8443 \
    -p 8001:8001 \
    -p 8444:8444 \
    kong:0.14.0-alpine
````

#### Verifying installation
The default gateway api port is 8000.  The default gateway admin port is 8001.

Verify installation with this url
````
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:8001/status
````

````
HTTP/1.1 200 OK
Date: Tue, 05 Jun 2018 16:30:53 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Access-Control-Allow-Origin: *
Server: kong/0.12.2

{"database":{"reachable":true},"server":{"connections_writing":1,"total_requests":1312,"connections_handled":1291,"connections_accepted":1291,"connections_reading":0,"connections_active":1,"connections_waiting":0}
````

## <a name="floret-basics">Basic Concepts</a>
#### Custom APIs
Add custom API endpoints to the built-in floret http server.

app/routes/routes.js
````
    module.exports = (app) => {
        app.router.get('/hello-world', async(ctx, next) => {
            ctx.body = "Hello World";
        });
        
        app.router.post('/hello-world', async(ctx, next) => {
            console.log('Incoming message to /hello-world');
            console.log(ctx.body);
        });
    }
    
    // index.js
    ...
    const floret = new Floret(floretConfig);
    ...
    // include any apis (routes) your web api will serve
    const routes = require('./app/routes/routes')(floret);
    
    floret.listen(() => {
        // make your api public by registering it at the gateway
        floret.registerAPI(`hello-world`, '/hello-world', 'GET,POST').then( (res) => {
            console.log('api hello-world created at the api gateway');
        })
    });
    
````

### Pub/Sub
Floret has a built-in pub/sub model for event-driven communication with other floret services.  
Publishers emit messages on subscribable channels.  A subscription to a channel in effect means 
that the published messages will be POSTed to the subscriber-provided api endpoint.

Subscriptions can be created dynamically after both the Publisher and Subscriber services are active.  

#### Channels
Messages are published to channels, and channels can be subscribed to.  Channels can be  
defined statically or dynamically.

##### Static Channel
````
    const soapboxConfig = {
        "name": "soapbox",
        "description": "a channel for rants",
        "hostURL": floretConfig.serviceHost,
        "hostPort": floretConfig.servicePort,
        "uri": "/soapbox"
    };
    
    ...
    let soapboxChannel = new floret.Channel(soapboxConfig);
    floret.channels = [soapboxChannel];
    floret.listen(()=>{});
    ...
````    
##### Dynamic Channel
````
    // create new channels under the /rooms/ uri
    floret.router.post('/rooms/:channel', async (ctx, next) => {
        let channelName = ctx.params.channel;
        let channel = app.channels[channelName];

        if (!channel){
            let newChannel = new floret.Channel({
                "name": room,
                "description": "general topics",
                "endpoint": `${floret.url}/rooms/${channel}`,
                "serviceName": floret.name,
                "hostURL": floret.host,
                "hostPort": floret.url,
                "uri": "/rooms/" + channelName
            });
            
            await app.addChannel(newChannel);
        }
    });

````
#### Subscriptions
Similar to a webhook, a subscription is the configured landing spot for incoming service messages.

##### Create a new subscription with multiple handlers
````    
    ...
    const floret = new Floret(floretConfig);
    
    // creates a new handler function    
    let fooHandler = (ctx) => {
        let pkg = new floret.Package(ctx.body);
        console.log('received message: ' + JSON.stringify(pkg.payload))
    });
    
    let barHandler = (ctx) => {
        let pkg = new floret.Package(ctx.body);
        console.log('received message: ' + JSON.stringify(pkg.payload))
    });
    
    // create a subscription object    
    let bazSubscription = new floret.Subscription('fooSubscription', floret.service, floret.router, floret.gateway);
    
    // attach 1 or more handler functions to the subscription event 
    bazSubscription.observable.subscribe(fooHandler);
    bazSubscription.observable.subscribe(barHandler);
    
    // add to array of subscriptions, which will be invoked during floret initialization
    floret.addSubscription(bazSubscription);
    ...
````
##### Subscribe to a Floret Service by name and channel
````
    ...
    floret.listen().then(() =>{
        // subscribe to a service once floret is up.  specify a subscription
        let subscriberId = floret.subscribe('baz', 'bazChannel', bazSubscription);
    })
````
##### Subscribe a Floret Service to another via the REST API
````
    POST http://api-gateway:8000/baz/subscribe/
    Content-Type application/json
    body:
    {
        "name": "example-service",
        "url": "http://192.168.1.158:8084/example-service/subscription/bazSubscription",
        "channel": "bazChannel"
    }
````  
##### Unsubscribe from a Floret Service 
````
    ...
    floret.unsubscribe('baz', 'bazChannel', subscriberId);
````    
##### Unsubscribe a Floret Service from another via the REST API
````
    POST http://api-gateway:8000/baz/unsubscribe/
    Content-Type application/json
    body:
    {
        "channelName": "baz",
        "url": "http://192.168.1.158:8084/example-service/subscription/bazSubscription",
        "channel": "bazChannel"
    }
````
#### Channel and Subscriber discovery process

When a floret service stands up, an immediate survey of the api gateway occurs.  It immediately discovers  
all of its channels registered at the gateway, and builds any it has not already created. When a new channel  
is created, subscribers of each channel are discovered.  They are attached and become observers of the channel.  

Self-discovery of channels and subscribers allows horizontal scaling of floret services that stand up and  
become aware of the services current state.    

### Documentation

Floret creates an Open API spec for your api at bootstrap.  It exposes a /api-spec.json resource, and this url can be
used by consuming applications.  One such application may be Swagger UI, which is deployed as a floret core service called
api-doc.  Upon standing up, a notification of new documentation is sent to api-doc, which in turn hosts the spec.

#### Documenting Custom APIs

If you added custom apis with your service, you'll want to document them in the Open API spec.  To do so, just add annotations
above your api like this:
````
    /**
     * @swagger
     * /test/it/out:
     *   get:
     *     description: test doc
     *     responses:
     *       200:
     *         description: bar bang
     *     tags: [pulse]
     */
    floret.router.get('/test/it/out', (ctx) => {
        console.log('test/it/out')
    })
````

Once your documentation is registered with floret api-doc service, it will appear in swagger ui.

![Swagger UI](images/swagger-ui.png)

## Authors
[clint brown - clint.brown.atx@gmail.com](mailto:clint.brown.atx@gmail.com) | [github - cbrown23](https://github.com/cbrown23)
