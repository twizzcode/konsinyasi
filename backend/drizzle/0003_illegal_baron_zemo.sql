CREATE TABLE "consigned_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_user_id" text NOT NULL,
	"supplier_user_id" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"sell_price" numeric(12, 2) NOT NULL,
	"supplier_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consigned_products" ADD CONSTRAINT "consigned_products_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consigned_products" ADD CONSTRAINT "consigned_products_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;