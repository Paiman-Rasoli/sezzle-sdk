import {
  Customer,
  Events,
  INTENT_TYPE,
  Order,
  Price,
  URL_OBJECT,
} from "./types";

export interface ConstructorInput {
  /** API identity key issued by Sezzle */
  publicKey: string;
  /** API secret key issued by Sezzle. */
  secretKey: string;
  /** environment default is production */
  environment?: "sandbox" | "production";
}

/**
 * A valid session object contains at a minimum an Order object or a Customer object with tokenize set to true.
 */
export interface CreateSession {
  /**
   * The HTTP request information used to redirect the customer in the case of a cancellation.
   *
   * @type {URL_OBJECT}
   * @memberof Session
   * @required
   */
  cancel_url: URL_OBJECT;

  /**
   * The HTTP request information used to redirect the customer upon completion of the session.
   *
   * @type {URL_OBJECT}
   * @memberof Session
   * @required
   */
  complete_url: URL_OBJECT;

  /**
   * The customer for this session.
   *
   * @type {Customer}
   * @memberof Session
   * @optional
   */
  customer?: Customer;

  /**
   * The order for this session.
   *
   * @type {Order}
   * @memberof Session
   * @optional
   */
  order?: Order;
}

export interface CreateVirtualCard {
  /**
   * The window origin of the host
   */
  origin: string;

  /**
   * The mode of the session, either 'iframe' or 'popup'
   */
  mode: "iframe" | "popup";

  /**
   * Typically a checkout or cart id, currently used for tracking only
   */
  merchant_reference_id?: string;

  /**
   * The amount of the order in cents
   */
  amount_in_cents?: number;

  /**
   * The 3 character currency code as defined by ISO 4217
   */
  currency?: string;

  /**
   * The customer for this session
   */
  customer?: Omit<Customer, "shipping_address" | "dob" | "tokenize">;

  /**
   * Value of token required to use tokenization
   */
  card_response_format?: "token";
}

export interface UpdateOrder {
  reference_id: string;
  order_uuid: string;
}

export interface CreateCaptureAmount {
  order_uuid: string;
  capture_amount: Price;
}

export type CreateUpChargeAmount = Price & { order_uuid: string } & {
  intent: INTENT_TYPE;
};

export interface CreateWebhooks {
  /** The url you are using to receive webhooks */
  url: string;
  /** An array of events to subscribe to */
  events: Array<Events>;
}

export interface TriggerTestWebhook {
  /** One of the Valid Webhook Events */
  event: Events;
  /** A url to receive the test webhook. If omitted, the test webhook is sent to all urls subscribed to that event. */
  url: string;
}
