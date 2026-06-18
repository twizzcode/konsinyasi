CREATE TABLE "sales_transaction_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"supplier_user_id" text NOT NULL,
	"product_name" text NOT NULL,
	"supplier_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"supplier_unit_price" numeric(12, 2) NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"supplier_total" numeric(12, 2) NOT NULL,
	"store_total" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"store_user_id" text NOT NULL,
	"status" text DEFAULT 'Selesai' NOT NULL,
	"total_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"supplier_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"store_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_transaction_items" ADD CONSTRAINT "sales_transaction_items_transaction_id_sales_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."sales_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_transaction_items" ADD CONSTRAINT "sales_transaction_items_product_id_consigned_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."consigned_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_transaction_items" ADD CONSTRAINT "sales_transaction_items_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_transactions" ADD CONSTRAINT "sales_transactions_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sales_transactions_code_unique" ON "sales_transactions" USING btree ("code");