export type StoreRole = "owner" | "admin" | "supplier";
export type MemberStatus = "active" | "inactive" | "pending";
export type ProductStatus = "active" | "inactive" | "out_of_stock";
export type StockMovementType = "in" | "out" | "adjustment" | "sale" | "return";
export type PaymentMethod = "cash" | "transfer" | "qris" | "other";
export type TransactionStatus = "completed" | "cancelled" | "refunded";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "INSUFFICIENT_STOCK"
  | "INVALID_ROLE"
  | "DUPLICATE_DATA"
  | "INVALID_PAYMENT"
  | "INVALID_FILE_TYPE"
  | "FILE_TOO_LARGE";
