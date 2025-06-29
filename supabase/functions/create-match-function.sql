
-- Create a function to match products based on embedding similarity
CREATE OR REPLACE FUNCTION match_products (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  company text,
  type text,
  description text,
  features text,
  stock int,
  price numeric,
  image_url text,
  embedding vector(1536),
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.company,
    p.type,
    p.description,
    p.features,
    p.stock,
    p.price,
    p.image_url,
    p.embedding,
    p.created_at,
    p.updated_at,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM products p
  WHERE p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
