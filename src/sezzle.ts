import {
  Authentication,
  CardData,
  ConstructorInput,
  CreateCaptureAmount,
  CreateOrderByCustomer,
  CreatePreApprove,
  CreateSession,
  CreateUpChargeAmount,
  CreateVirtualCard,
  CreateWebhooks,
  CustomerList,
  CustomerObject,
  OrderByCustomer,
  OrderDetails,
  PreApprove,
  Price,
  ReAuthorize,
  RefundTransaction,
  ReleaseTransaction,
  Session,
  SessionResponse,
  TokenInfo,
  TokenizationResponse,
  TriggerTestWebhook,
  UpChargeTransaction,
  UpdateCardSession,
  UpdateOrder,
  VirtualCardResponse,
  Webhook,
} from "./dto";

export class Sezzle {
  private SEZZLE_BASE_URL = "https://gateway.sezzle.com/v2";
  private secrets: { public: string; secret: string };
  private tokenInfo: TokenInfo;

  constructor(input: ConstructorInput) {
    if (input.environment === "sandbox") {
      this.SEZZLE_BASE_URL = "https://sandbox.gateway.sezzle.com/v2";
    }
    if (!input.publicKey || !input.secretKey) {
      console.error("Public key and Secret Key must be set!");
    }
    this.secrets = { public: input.publicKey, secret: input.secretKey };
    this.tokenInfo = {};
  }
  /**
   * This endpoint creates a session in our system, and it returns the URL that you should redirect the user to. You can use a session to create an order.
   * @param {CreateSession}
   * @returns {Promise<SessionResponse>}
   */
  async createSession(input: CreateSession): Promise<SessionResponse> {
    return this.genericSession({
      ...input,
      customer: { ...input?.customer, tokenize: false },
    }) as Promise<SessionResponse>;
  }

  /**
   * This endpoint creates a session in our system, and it returns the URL that you should redirect the user to. You can use this to create an order and tokenize a customer.
   * @param {CreateSession}
   * @returns {Promise<SessionResponse>}
   */
  async createTokenizeSession(
    input: CreateSession
  ): Promise<TokenizationResponse> {
    return this.genericSession({
      ...input,
      customer: { ...input?.customer, tokenize: true },
    }) as Promise<TokenizationResponse>;
  }

  async getSession(session_uuid: string): Promise<Session> {
    try {
      const auth = await this.getAuthentication();

      return this.sendRequest(`/session/${session_uuid}`, auth, "GET");
    } catch (err) {
      console.error("Error while getting session");
      throw err;
    }
  }
  /**
   * This endpoint creates a card session in our system, and it returns the URL that you should redirect the user to. A card session represents the issuance of a Sezzle virtual card to a Sezzle user and/or the agreement of a Sezzle user to use the virtual card as payment. Use the card session endpoints to create and update a card session.
   * @param {CreateVirtualCard}
   * @returns {VirtualCardResponse}
   */
  async createVirtualCardSession(
    input: CreateVirtualCard
  ): Promise<VirtualCardResponse> {
    const auth = await this.getAuthentication();

    try {
      return this.sendRequest("/session/card", auth, "POST", input);
    } catch (err) {
      console.error("Error while creating card session", { err });
      throw err;
    }
  }
  /**
   * ou can use this endpoint to request card data with the checkout card token. The card token is temporary and only available for a limited time. This endpoint is only needed when a card session is created with a card response format of token.
   * @param {string} token
   * @returns
   */
  async getCardData(token: string): Promise<CardData> {
    const auth = await this.getAuthentication();

    try {
      return this.sendRequest(`/session/card/token/${token}`, auth, "GET");
    } catch (err) {
      console.error("Error while getting card data", { err });
      throw err;
    }
  }

  async updateCardSession(input: UpdateCardSession) {
    const auth = await this.getAuthentication();

    try {
      return this.sendRequest(
        `/session/${input.session_uuid}/card`,
        auth,
        "PATCH",
        { order_id: input.order_id }
      );
    } catch (err) {
      console.error("Error while updating card session");
      throw err;
    }
  }

  /**
   * Use this endpoint to get details on an existing order.
   * @param {string} order_uuid
   * @returns {OrderDetails}
   */
  async getOrder(order_uuid: string): Promise<OrderDetails> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/order/${order_uuid}`, auth, "GET");
  }

  /**
   * Use this endpoint to update an existing order. Only the reference ID can be updated. Reference IDs are what shows up in your Merchant Dashboard for the orders and can be used to link your internal system and Sezzle.
   * @param {UpdateOrder}
   */

  async updateOrder(input: UpdateOrder): Promise<void> {
    const auth = await this.getAuthentication();

    await this.sendRequest(`/order/${input.order_uuid}`, auth, "PATCH", {
      reference_id: input.reference_id,
    });
  }

  /**
   * Use this endpoint to capture an amount by order. An example use-case is when an order is broken into multiple shipments, and prior to the shipment you need to capture part of the funds.
   * @param {CreateCaptureAmount}
   * @returns
   */
  async captureAmountByOrder(
    input: CreateCaptureAmount
  ): Promise<{ uuid: string }> {
    const crypto = await import("crypto");
    const auth = await this.getAuthentication();

    return this.sendRequest(
      `/order/${input.order_uuid}/capture`,
      auth,
      "POST",
      { capture_amount: input.capture_amount },
      {
        "Sezzle-Request-Id": crypto
          .randomBytes(12)
          .toString("hex")
          .slice(0, 12),
      }
    );
  }

  /**
   * Use this endpoint to reauthorize an amount by order. An order can only be reauthorized after the initial authorization has expired. Any attempts to reauthorize before the authorization expires will fail. An authorization can be released before expiration, thus allowing the order to be reauthorized.
   * @param {}
   */
  async reAuthorizeAmountByOrder(
    input: Price & { order_uuid: string }
  ): Promise<ReAuthorize> {
    const auth = await this.getAuthentication();
    const { order_uuid, ...rest } = input;

    const crypto = await import("crypto");

    return this.sendRequest(
      `/order/${order_uuid}/reauthorize`,
      auth,
      "POST",
      rest,
      {
        "Sezzle-Request-Id": crypto
          .randomBytes(12)
          .toString("hex")
          .slice(0, 12),
      }
    );
  }

  /**
   * Use this endpoint to refund an amount by order. An example use-case is when an order was captured but the customer returned item(s) that requires them to be refunded.
   * @returns Promise<RefundTransaction>
   */
  async refundAmountByOrder(
    input: Price & { order_uuid: string }
  ): Promise<RefundTransaction> {
    const auth = await this.getAuthentication();
    const { order_uuid, ...rest } = input;

    const crypto = await import("crypto");

    return this.sendRequest(`/order/${order_uuid}/refund`, auth, "POST", rest, {
      "Sezzle-Request-Id": crypto.randomBytes(12).toString("hex").slice(0, 12),
    });
  }
  /**
   * Use this endpoint to release an amount by order. An example use-case is when an order is unable to be fully fulfilled and part of the authorization needs to be released. Then a capture can be called for the remaining amount.
   * @returns
   */
  async releaseAmountByOrder(
    input: Price & { order_uuid: string }
  ): Promise<ReleaseTransaction> {
    const auth = await this.getAuthentication();
    const { order_uuid, ...rest } = input;

    const crypto = await import("crypto");

    return this.sendRequest(
      `/order/${order_uuid}/release`,
      auth,
      "POST",
      rest,
      {
        "Sezzle-Request-Id": crypto
          .randomBytes(12)
          .toString("hex")
          .slice(0, 12),
      }
    );
  }

  /**
   * Use this endpoint to upcharge an amount by order. The new order will be sent to the shopper as a Pay In Full order.
   * @warning
   * This API is in development and will be available shortly.
   * @returns
   */
  async upChargeAmountByOrder(
    input: CreateUpChargeAmount
  ): Promise<UpChargeTransaction> {
    const auth = await this.getAuthentication();
    const { order_uuid, ...rest } = input;

    const crypto = await import("crypto");

    return this.sendRequest(
      `/order/${order_uuid}/upcharge`,
      auth,
      "POST",
      rest,
      {
        "Sezzle-Request-Id": crypto
          .randomBytes(12)
          .toString("hex")
          .slice(0, 12),
      }
    );
  }

  /**
   * Use this endpoint to delete a checkout for an order. The request fails if the checkout has already been successfully completed by the customer.
   * @param order_uuid Order Id
   * @returns
   */
  async DeleteCheckout(order_uuid: string): Promise<void> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/order/${order_uuid}/checkout`, auth, "DELETE");
  }

  /**
   * This endpoint can be used to subscribe to webhooks
   * @param {CreateWebhooks}
   * @returns
   */
  async createWebhooks(
    input: CreateWebhooks
  ): Promise<Pick<Webhook, "uuid" | "links">> {
    const auth = await this.getAuthentication();

    return this.sendRequest("/webhooks", auth, "POST", input);
  }

  /**
   * You can get a list of your webhooks using this endpoint
   * @returns
   */
  async listWebhooks(): Promise<Array<Webhook>> {
    const auth = await this.getAuthentication();

    return this.sendRequest("/webhooks", auth, "GET");
  }

  /**
   * You can delete your webhooks using this endpoint
   * @param {string} webhook_uuid
   */
  async deleteWebhook(webhook_uuid: string): Promise<void> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/webhooks/${webhook_uuid}`, auth, "DELETE");
  }

  /**
   * You can trigger a test event using this endpoint. It will send the URL a mimic of the webhook event.
   *  @param {TriggerTestWebhook}
   */
  async triggerTestWebhookEvent(input: TriggerTestWebhook): Promise<void> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/webhooks/test`, auth, "POST", input);
  }

  /**
   * You can use this endpoint to get the current state of a tokenization session.
   * @returns
   */
  async getSessionTokenization(token: string) {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/token/${token}/session`, auth, "POST");
  }

  /**
   * You can use this endpoint to delete an existing customer
   * @param {string} customer_uuid
   * @returns
   */
  async deleteCustomer(customer_uuid: string): Promise<void> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/customer/${customer_uuid}`, auth, "DELETE");
  }

  /**
   * You can use this endpoint to get details on an existing customer
   * @param {string} customer_uuid
   * @returns
   */
  async getCustomer(customer_uuid: string): Promise<CustomerObject> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/customer/${customer_uuid}`, auth, "GET");
  }

  /**
   * You can retrieve a list of existing customers using this endpoint.
   * @returns {Array<CustomerList>}
   */
  async getListOfCustomers(): Promise<Array<CustomerList>> {
    const auth = await this.getAuthentication();

    return this.sendRequest(`/customer`, auth, "GET");
  }

  /**
   * You can use this endpoint to create an order for a customer.
   * Please be sure to check the authorization.approved boolean value for true to determine if the order was created.
   * @param {CreateOrderByCustomer} input
   * @returns {OrderByCustomer}
   */
  async createOrderByCustomer(
    input: CreateOrderByCustomer
  ): Promise<OrderByCustomer> {
    const auth = await this.getAuthentication();
    const { customer_uuid, ...rest } = input;

    const crypto = await import("crypto");

    return this.sendRequest(
      `/customer/${customer_uuid}/order`,
      auth,
      "POST",
      rest,
      {
        "Sezzle-Request-Id": crypto
          .randomBytes(12)
          .toString("hex")
          .slice(0, 12),
      }
    );
  }

  /**
   * The primary purpose of this API is for the merchant to verify a customer will be approved for the order amount prior to creating an order.
   * @param {CreateOrderByCustomer} input
   * @returns {PreApprove}
   */
  async preApproveAmountByCustomer(
    input: CreatePreApprove
  ): Promise<PreApprove> {
    const auth = await this.getAuthentication();
    const { customer_uuid, ...rest } = input;

    return this.sendRequest(
      `/customer/${customer_uuid}/preapprove`,
      auth,
      "POST",
      rest
    );
  }

  private async getAuthentication(): Promise<Authentication> {
    const now = new Date().getTime();

    if (this.tokenInfo?.createdAt && this.tokenInfo?.value?.token) {
      const diffInMillisecond = now - this.tokenInfo.createdAt;
      const diffInMinutes = diffInMillisecond / (1000 * 60);

      if (diffInMinutes < 120) {
        return this.tokenInfo.value;
      }

      const newToken = await this.generateAuthentication();
      this.tokenInfo = {
        createdAt: now,
        value: newToken,
      };

      return newToken;
    }

    // For the first time this function is calling;
    const firstGeneratedToken = await this.generateAuthentication();
    this.tokenInfo = {
      createdAt: now,
      value: firstGeneratedToken,
    };

    return firstGeneratedToken;
  }

  private async generateAuthentication(): Promise<Authentication> {
    try {
      const req = await fetch(`${this.SEZZLE_BASE_URL}/authentication`, {
        method: "POST",
        body: JSON.stringify({
          public_key: this.secrets.public,
          private_key: this.secrets.secret,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      return res;
    } catch (err) {
      console.error("Error while creating auth token", { err });
      throw err;
    }
  }

  private async genericSession(
    input: CreateSession
  ): Promise<TokenizationResponse | SessionResponse> {
    const auth = await this.getAuthentication();

    try {
      return this.sendRequest("/session", auth, "POST", input);
    } catch (err) {
      console.error("Error while creating sezzle order", { err });
      throw err;
    }
  }

  private async sendRequest(
    PATH: string,
    auth: Authentication,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    payload?: Record<string, any>,
    customHeaders = {}
  ) {
    try {
      const req = await fetch(`${this.SEZZLE_BASE_URL}${PATH}`, {
        method: method,
        ...(method !== "GET" && payload && { body: JSON.stringify(payload) }),
        headers: {
          Authorization: `Bearer ${auth.token}`,
          ...(method !== "GET" && { "Content-Type": "application/json" }),
          ...customHeaders,
        },
      });
      const res = await req.json();
      return res;
    } catch (err) {
      throw err;
    }
  }
}
