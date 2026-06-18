CREATE TABLE "consignment_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_user_id" text NOT NULL,
	"supplier_user_id" text NOT NULL,
	"product_id" uuid,
	"product_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"sell_price" numeric(12, 2) NOT NULL,
	"supplier_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_addition_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_user_id" text NOT NULL,
	"supplier_user_id" text NOT NULL,
	"product_id" uuid,
	"product_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"previous_stock" integer NOT NULL,
	"new_stock" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consignment_history" ADD CONSTRAINT "consignment_history_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "consignment_history" ADD CONSTRAINT "consignment_history_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "consignment_history" ADD CONSTRAINT "consignment_history_product_id_consigned_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."consigned_products"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "stock_addition_history" ADD CONSTRAINT "stock_addition_history_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "stock_addition_history" ADD CONSTRAINT "stock_addition_history_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "stock_addition_history" ADD CONSTRAINT "stock_addition_history_product_id_consigned_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."consigned_products"("id") ON DELETE set null ON UPDATE no action;
