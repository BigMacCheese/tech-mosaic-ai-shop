
-- Enable the vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add a vector column to store embeddings (using 1536 dimensions for OpenAI text-embedding-3-small)
ALTER TABLE public.products 
ADD COLUMN embedding vector(1536);

-- Create an index on the embedding column for faster similarity searches
CREATE INDEX ON public.products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Add a function to update embeddings trigger
CREATE OR REPLACE FUNCTION update_product_embedding_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
