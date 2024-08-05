import { CreateSession } from "./inputs";

export interface Authentication {
  token: string;
  expiration_date: string;
  merchant_uuid: string;
}

export interface URL_OBJECT {
  /**
   * The URL used when redirecting a customer.
   *
   * @type {string}
   * @memberof UrlObject
   * @required
   */
  href: string;

  /**
   * The HTTP request method used when redirecting a customer.
   * Currently, only the GET method is supported. If omitted, will default to GET.
   *
   * @type {string}
   * @memberof UrlObject
   * @optional
   */
  method?: string;
}

export interface Address {
  /**
   * The name on the address.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  name?: string;

  /**
   * The street and number of the address.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  street?: string;

  /**
   * The apt or unit.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  street2?: string;

  /**
   * The city.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  city?: string;

  /**
   * The 2 character state code.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  state?: string;

  /**
   * The postal delivery code.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  postal_code?: string;

  /**
   * The 2 character country code.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  country_code?: string;

  /**
   * The phone number at the delivery location.
   *
   * @type {string}
   * @memberof Address
   * @optional
   */
  phone_number?: string;
}

export interface Price {
  /**
   * The amount of the item in cents
   *
   * @type {number}
   * @memberof Price
   * @optional
   */
  amount_in_cents?: number;

  /**
   * The 3 character currency code as defined by ISO 4217
   *
   * @type {string}
   * @memberof Price
   * @optional
   */
  currency?: string;
}

export interface Item {
  /**
   * The name of the item.
   *
   * @type {string}
   * @memberof Item
   * @optional
   */
  name?: string;

  /**
   * The SKU identifier.
   *
   * @type {string}
   * @memberof Item
   * @optional
   */
  sku?: string;

  /**
   * The quantity purchased.
   *
   * @type {number}
   * @memberof Item
   * @optional
   */
  quantity?: number;

  /**
   * The price object.
   *
   * @type {Price}
   * @memberof Item
   * @optional
   */
  price?: Price;
}

export interface Discount {
  /**
   * The description of the discount.
   *
   * @type {string}
   * @memberof Discount
   * @optional
   */
  name?: string;

  /**
   * A price object representing the amount of the discount.
   *
   * @type {Price}
   * @memberof Discount
   * @optional
   */
  amount?: Price;
}

export interface Notification {
  /**
   * The SMS phone number of the notification.
   *
   * @type {string}
   * @memberof Notification
   * @optional
   */
  to_sms_phone?: string;

  /**
   * The email address of the notification.
   *
   * @type {string}
   * @memberof Notification
   * @optional
   */
  to_email?: string;

  /**
   * The 2-character ISO 639 language code of the notification.
   * Acceptable values are "en" and "fr-CA".
   * Will default to English if not provided.
   *
   * @type {string}
   * @memberof Notification
   * @optional
   */
  language?: string;
}

export interface Tokenize {
  /**
   * This token represents the merchant request to tokenize a customer.
   * This token can only be used one time. Once a user accepts/denies tokenization,
   * this token and its approval URL will be obsolete.
   *
   * @type {string}
   * @memberof Tokenize
   * @optional
   */
  token?: string;

  /**
   * The expiration of the request token in ISO 8601 date/time format.
   *
   * @type {string}
   * @memberof Tokenize
   * @optional
   */
  expiration?: string;

  /**
   * The URL for the user to accept tokenization.
   * This URL does not create an order, it is only used for tokenizing a customer.
   *
   * @type {string}
   * @memberof Tokenize
   * @optional
   */
  approval_url?: string;
}

export type INTENT_TYPE = "AUTH" | "CAPTURE";

export interface Order {
  /**
   * Accepted values are "AUTH" or "CAPTURE".
   * If your checkout flow requires the user to confirm their checkout on your site after being approved by Sezzle, use "AUTH" as your intent.
   * If you prefer the checkout be captured immediately, use "CAPTURE".
   *
   * @type {""}
   * @memberof Order
   * @required
   */
  intent: INTENT_TYPE;

  /**
   * Your reference ID for this order.
   *
   * @type {string}
   * @memberof Order
   * @required
   */
  reference_id: string;

  /**
   * Your description for this order.
   *
   * @type {string}
   * @memberof Order
   * @required
   */
  description: string;

  /**
   * A Price object containing the amount of the order, which must be at least 100.
   * All fields of the Price object are required.
   *
   * @type {Price}
   * @memberof Order
   * @required
   */
  order_amount: Price;

  /**
   * Flag to indicate if you would like us to collect shipping information for this checkout from the customer.
   * If omitted, defaults to false.
   *
   * @type {boolean}
   * @memberof Order
   * @optional
   */
  requires_shipping_info?: boolean;

  /**
   * The financing options of the checkout. Only one option can be included.
   *
   * @type {Array<string>}
   * @memberof Order
   * @optional
   */
  checkout_financing_options?: string[];

  /**
   * The items being purchased.
   *
   * @type {Item[]}
   * @memberof Order
   * @optional
   */
  items?: Item[];

  /**
   * The discounts applied to this order. Must be included in total.
   *
   * @type {Discount[]}
   * @memberof Order
   * @optional
   */
  discounts?: Discount[];

  /**
   * Object for any custom data you want to submit with the checkout.
   * You are not limited to the key-value pairs shown in the example, and you may use any key-value pairs you like.
   *
   * @type {Metadata}
   * @memberof Order
   * @optional
   */
  metadata?: Record<string, string>;

  /**
   * The shipping fees applied to this order. Must be included in the total.
   *
   * @type {Price}
   * @memberof Order
   * @optional
   */
  shipping_amount?: Price;

  /**
   * The taxes applied to this order. Must be included in the total.
   *
   * @type {Price}
   * @memberof Order
   * @optional
   */
  tax_amount?: Price;

  /**
   * The expiration for the order checkout in ISO 8601 date/time format.
   *
   * @type {string}
   * @memberof Order
   * @optional
   */
  checkout_expiration?: string;

  /**
   * The mode for the order checkout. Defaults to redirect if not provided.
   * If iframe or popup is provided, then the cancel and complete URLs must include the origin of the parent window.
   *
   * @type {string}
   * @memberof Order
   * @optional
   */
  checkout_mode?: string;

  /**
   * A Notification object for sending checkout URL to the customer.
   *
   * @type {Notification}
   * @memberof Order
   * @optional
   */
  send_checkout_url?: Notification;

  /**
   * Localizes the checkout. Accepted values are en-US (English, United States), en-CA (English, Canada) and fr-CA (French, Canada).
   * Defaults to en-US if not provided.
   *
   * @type {string}
   * @memberof Order
   * @optional
   */
  locale?: string;
}

export interface Customer {
  /**
   * Determines whether to tokenize the customer.
   * If omitted, will default to false.
   *
   * @type {boolean}
   * @memberof Customer
   * @optional
   */
  tokenize?: boolean;

  /**
   * The customer's email address.
   *
   * @type {string}
   * @memberof Customer
   * @optional
   */
  email?: string;

  /**
   * The customer's first name.
   *
   * @type {string}
   * @memberof Customer
   * @optional
   */
  first_name?: string;

  /**
   * The customer's last name.
   *
   * @type {string}
   * @memberof Customer
   * @optional
   */
  last_name?: string;

  /**
   * The customer's phone number.
   *
   * @type {string}
   * @memberof Customer
   * @optional
   */
  phone?: string;

  /**
   * The customer's date of birth in YYYY-MM-DD format.
   *
   * @type {string}
   * @memberof Customer
   * @optional
   */
  dob?: string;

  /**
   * The customer's billing address.
   *
   * @type {Address}
   * @memberof Customer
   * @optional
   */
  billing_address?: Address;

  /**
   * The customer's shipping address.
   *
   * @type {Address}
   * @memberof Customer
   * @optional
   */
  shipping_address?: Address;
}

export interface Link {
  href: string;
  method: string;
  rel: string;
}
export interface TokenizeDetails {
  /**
   * Token representing the merchant request to tokenize a customer.
   *
   * @type {string}
   */
  token?: string;

  /**
   * Expiration of the request token in ISO 8601 date/time format.
   *
   * @type {string}
   */
  expiration?: string;

  /**
   * URL for the user to accept tokenization.
   *
   * @type {string}
   */
  approval_url?: string;

  /**
   * An array of links related to the tokenization.
   *
   * @type {Array<Link>}
   */
  links?: Array<Link>;
}
export interface TokenizationResponse {
  /**
   * Unique identifier for the tokenization response.
   *
   * @type {string}
   */
  uuid: string;

  /**
   * An array of links related to the tokenization response.
   *
   * @type {Array<{ href: string; method: string; rel: string }>}
   */
  links: Array<Link>;

  /**
   * Tokenize object containing tokenization details.
   *
   * @type {TokenizeDetails}
   */
  tokenize: TokenizeDetails;
}

export interface OrderResponse {
  /**
   * Unique identifier for the order.
   *
   * @type {string}
   */
  uuid: string;

  /**
   * URL to the checkout page for this order.
   *
   * @type {string}
   */
  checkout_url: string;

  /**
   * Intent of the order, e.g., "AUTH" or "CAPTURE".
   *
   * @type {string}
   */
  intent: INTENT_TYPE;

  /**
   * An array of links related to the order.
   *
   * @type {Array<Link>}
   */
  links: Array<Link>;
}

export interface SessionResponse {
  /**
   * Unique identifier for the session response.
   *
   * @type {string}
   */
  uuid: string;

  /**
   * An array of links related to the session response.
   *
   * @type {Array<Link>}
   */
  links: Array<Link>;

  /**
   * Order object associated with the session.
   *
   * @type {Order}
   */
  order: OrderResponse;
}

export type Session = SessionResponse & Pick<TokenizationResponse, "tokenize">;

export interface VirtualCardResponse {
  uuid: string;
  /** The dashboard_url is a URL which the customer should be redirected to.  */
  dashboard_url: string;
}

export interface CardData {
  cvv_number: string;
  /** return type MMYY */
  expiration_date: string;
  first_name: string;
  last_name: string;
  pan: string;
}

export interface UpdateCardSession {
  session_uuid: string;
  order_id: string;
}
