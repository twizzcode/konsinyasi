CREATE TABLE "store_suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_user_id" text NOT NULL,
	"supplier_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "store_suppliers" ADD CONSTRAINT "store_suppliers_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_suppliers" ADD CONSTRAINT "store_suppliers_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "store_suppliers_store_supplier_unique" ON "store_suppliers" USING btree ("store_user_id","supplier_user_id");