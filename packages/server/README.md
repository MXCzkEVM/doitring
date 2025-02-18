<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Blueberry-related data analysis, signature verification, and proxy services implemented based on [Nest](https://github.com/nestjs/nest).

## Environment

Before running this project, you need to configure the following .env environment variables:

```sh
NEST_PRISMA_DATABASE_URL = "mysql://<user>:<pass>@<host>:<port>/DoitRING?connection_limit=40&pool_timeout=20"

# Service port
NEST_SERVER_PORT = 50015
# Default index block height
NEST_DEFAULT_LAST_BLOCK = 708157
## harsta network alias
NETWORK = "moonchain"

# Owner of the proxy contract
OWNER_PRIVATE_KEY = <owner-private-key>
# Signer, make sure it is the same as the signer deployed with the contract
VERIFIER_PRIVATE_KEY = <verifier-private-key>
```


## Shopping mall

If you want to use the shopping mall feature, make sure to register with Stripe, and view the secret key at `https://dashboard.stripe.com/test/apikeys`, and fill in the following configuration in `.env`:

```sh
NEST_STRIPE_SECRET_KEY = <your-stripe-secret-key>
```

After that, you need to create WooCommerce, create corresponding products and SKU information, and fill in the following configuration:

```sh
WOOC_CONSUMER_URL = <wooc-consumer-url>
NEST_WOOC_CONSUMER_KEY = <wooc-consumer-key>
WOOC_PRODUCT_ID = <wooc-product-id>
WOOC_PRODUCT_VARIABLES = "{
  6: <wooc-variable-id>,
  7: <wooc-variable-id>,
  8: <wooc-variable-id>,
  9: <wooc-variable-id>,
  10: <wooc-variable-id>,
  11: <wooc-variable-id>,
  12: <wooc-variable-id>,
  13: <wooc-variable-id>,
}"
```

# Advisor

If you need support for AI analysis services, make sure to deploy the [doitring_datagrabber](https://github.com/MXCzkEVM/doitring_datagrabber) service, add the following configuration, and restart the server:

```sh
# AI analysis services
NEST_ADVISOR_REST_URL = <advisor-rest-url>
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
