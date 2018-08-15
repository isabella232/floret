
let FloretConfigClass;

{
  const _config = Symbol('config');

  FloretConfigClass = class FloretConfig {
    /**
         *
         * @param configObj
         * @param name
         * @param host
         * @param port
         * @param uri
         * @param gatewayHost
         * @param gatewayAdminPort
         * @param gatewayProxyPort
         */
    constructor({
      name, port, root, uri, gatewayHost, gatewayAdminPort, gatewayProxyPort, host,
      documentationPaths, disconnected, logging, apis, channels, subscriptions,
      publishDocs, gatewayModulePath, gatewayModuleName,
    },
    ...[nameOverride, hostOverride, portOverride, uriOverride, gatewayHostOverride,
      gatewayAdminPortOverride, gatewayProxyPortOverride, disconnectedOverride,
      gatewayModulePathOverride, gatewayModuleNameOverride]) {
      this[_config] = {};
      this[_config].name = nameOverride || name;
      this[_config].host = hostOverride || host;
      this[_config].port = portOverride || port;
      this[_config].uri = uriOverride || uri;
      this[_config].gatewayHost = gatewayHostOverride || gatewayHost;
      this[_config].gatewayAdminPort = gatewayAdminPortOverride || gatewayAdminPort;
      this[_config].gatewayProxyPort = gatewayProxyPortOverride || gatewayProxyPort;
      this[_config].gatewayModulePath = gatewayModulePathOverride || gatewayModulePath;
      this[_config].gatewayModuleName = gatewayModuleNameOverride || gatewayModuleName;
      this[_config].endpoint = `${this[_config].host}:${this[_config].port}/${this[_config].name}`;
      this[_config].documentationPaths = documentationPaths;
      this[_config].disconnected = disconnectedOverride || disconnected;

      this[_config].channels = channels || [];
      this[_config].subscriptions = subscriptions || [];
      this[_config].apis = apis || [];
      this[_config].publishDocs = publishDocs !== false;
      this[_config].logging = logging !== true;

      this[_config].root = root;
    }

    /**
         *
         * @returns {*}
         */
    get params() {
      return this[_config];
    }

    get name() {
      return this[_config].name;
    }

    get host() {
      return this[_config].host;
    }

    get uri() {
      return this[_config].uri;
    }

    get gatewayHost() {
      return this[_config].gatewayHost;
    }

    get gatewayAdminPort() {
      return this[_config].gatewayAdminPort;
    }

    get gatewayProxyPort() {
      return this[_config].gatewayProxyPort;
    }

    get gatewayModulePath() {
      return this[_config].gatewayModulePath;
    }

    get gatewayModuleName() {
      return this[_config].gatewayModuleName;
    }

    get endpoint() {
      return this[_config].endpoint;
    }

    get documentationPaths() {
      return this[_config].documentationPaths;
    }
  };
}

module.exports = FloretConfigClass;
