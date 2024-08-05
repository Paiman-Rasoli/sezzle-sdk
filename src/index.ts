import {
  Authentication,
  CardData,
  ConstructorInput,
  CreateSession,
  CreateVirtualCard,
  Session,
  SessionResponse,
  TokenizationResponse,
  UpdateCardSession,
  VirtualCardResponse,
} from "./dto";

class Sezzle {
  private SEZZLE_BASE_URL = "https://gateway.sezzle.com/v2";
  private secrets: { public: string; secret: string };

  constructor(input: ConstructorInput) {
    if (input.environment === "sandbox") {
      this.SEZZLE_BASE_URL = "https://sandbox.gateway.sezzle.com/v2";
    }
    if (!input.publicKey || !input.secretKey) {
      console.error("Public key and Secret Key must be set!");
    }
    this.secrets = { public: input.publicKey, secret: input.secretKey };
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

  private async getAuthentication(): Promise<Authentication> {
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
    method: "GET" | "POST" | "PATCH",
    payload?: Record<string, any>
  ) {
    try {
      const req = await fetch(`${this.SEZZLE_BASE_URL}${PATH}`, {
        method: method,
        ...(method !== "GET" && payload && { body: JSON.stringify(payload) }),
        headers: {
          Authorization: `Bearer ${auth.token}`,
          ...(method !== "GET" && { "Content-Type": "application/json" }),
        },
      });
      const res = await req.json();
      return res;
    } catch (err) {
      throw err;
    }
  }
}
