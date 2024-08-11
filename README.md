# Sezzle SDK

![npm downloads](https://img.shields.io/npm/dt/sezzle-sdk)[1]
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/paiman05)

The Sezzle Sdk library provides convenient access to the Sezzle API from applications written in server-side JavaScript/TypeScript.

![Sezzle Logo](https://docs.sezzle.com/img/Color-Logo.svg)

## ⚙️ Install

Install it locally in your project folder:

```bash
npm i sezzle-sdk
# Or Yarn
yarn add sezzle-sdk
```

### Getting started

```typescript
import { Sezzle } from "sezzle-sdk";

const sdk = new Sezzle({
  publicKey: process.env.SEZZLE_PUBLIC_KEY,
  secretKey: process.env.SEZZLE_PRIVATE_KEY,
  environment: "sandbox", // default is production
});

// return list of created webhooks
const webhooks = await sdk.listWebhooks();

// create a tokenize session
const tokenizeSession = await sdk.createTokenizeSession({
  cancel_url: {
    href: "https://domain.com/list",
  },
  complete_url: {
    href: "https://domain.com/orders",
  },
  customer: {
    tokenize: true,
  },
});
```

## Contribution

- Give us a star :star:
- Fork and Clone! Awesome
- Select existing [issues](https://github.com/Paiman-Rasoli/sezzle-sdk/issues) or create a [new issue](https://github.com/Paiman-Rasoli/sezzle-sdk/issues/new) and give us a PR with your bugfix or improvement. We love it ❤️
