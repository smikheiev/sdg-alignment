CREATE TABLE IF NOT EXISTS "product_to_sdg_alignments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"sdg_id" integer,
	"alignment_status" "sdg_alignment"
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_to_sdg_alignments" ADD CONSTRAINT "product_to_sdg_alignments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_to_sdg_alignments" ADD CONSTRAINT "product_to_sdg_alignments_sdg_id_sdgs_id_fk" FOREIGN KEY ("sdg_id") REFERENCES "public"."sdgs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
