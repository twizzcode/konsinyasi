CREATE TABLE "supplier_payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_user_id" text NOT NULL,
	"supplier_user_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supplier_payouts" ADD CONSTRAINT "supplier_payouts_store_user_id_user_id_fk" FOREIGN KEY ("store_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_payouts" ADD CONSTRAINT "supplier_payouts_supplier_user_id_user_id_fk" FOREIGN KEY ("supplier_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
