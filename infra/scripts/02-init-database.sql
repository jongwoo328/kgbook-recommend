\connect kgbook
CREATE EXTENSION vector;
CREATE TABLE kgbook.public.category (
  cid INTEGER PRIMARY KEY,
  category TEXT,
  mall TEXT,
  depth1 TEXT,
  depth2 TEXT,
  depth3 TEXT,
  depth4 TEXT,
  depth5 TEXT,
  category_vector vector(1536)
);
