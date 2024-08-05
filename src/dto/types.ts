import { CreateOrderInput } from "./inputs";

export interface OrderResult {}

export interface Order {
  createOrder: (input: CreateOrderInput) => Promise<OrderResult>;
}

export interface Goods {
  /**
   * The type of the goods for the order.
   * - '01': Tangible Goods
   * - '02': Virtual Goods
   */
  goodsType: "01" | "02";

  /**
   * The category of the goods.
   * - '0000': Electronics & Computers
   * - '1000': Books, Music & Movies
   * - '2000': Home, Garden & Tools
   * - '3000': Clothes, Shoes & Bags
   * - '4000': Toys, Kids & Baby
   * - '5000': Automotive & Accessories
   * - '6000': Game & Recharge
   * - '7000': Entertainment & Collection
   * - '8000': Jewelry
   * - '9000': Domestic Service
   * - 'A000': Beauty Care
   * - 'B000': Pharmacy
   * - 'C000': Sports & Outdoors
   * - 'D000': Food, Grocery & Health Products
   * - 'E000': Pet Supplies
   * - 'F000': Industry & Science
   * - 'Z000': Others
   */
  goodsCategory:
    | "0000"
    | "1000"
    | "2000"
    | "3000"
    | "4000"
    | "5000"
    | "6000"
    | "7000"
    | "8000"
    | "9000"
    | "A000"
    | "B000"
    | "C000"
    | "D000"
    | "E000"
    | "F000"
    | "Z000";

  /**
   * The unique identifier for the goods.
   */
  referenceGoodsId: string;

  /**
   * The name of the goods.
   * Should not contain special characters or emojis.
   * Maximum length: 256 characters.
   */
  goodsName: string;

  /**
   * Optional detailed description of the goods.
   * Maximum length: 256 characters.
   */
  goodsDetail?: string;

  /**
   * Optional pricing information for the goods.
   */
  goodsUnitAmount?: {
    /**
     * The currency code for the price (e.g., 'USD').
     */
    currency: string;

    /**
     * The price amount of the goods.
     */
    amount: number;
  };
}
