CREATE TABLE IF NOT EXISTS bfDb (
  bf_gid VARCHAR(255) PRIMARY KEY,
  bf_oid VARCHAR(255) NOT NULL,
  bf_cid VARCHAR(255) NOT NULL,
  bf_sid VARCHAR(255),
  bf_tid VARCHAR(255),
  class_name VARCHAR(255),
  last_updated TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE,
  props JSONB NOT NULL,
  sort_value BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sort_value ON bfDb(sort_value);
CREATE INDEX IF NOT EXISTS idx_bf_oid ON bfDb(bf_oid);
CREATE INDEX IF NOT EXISTS idx_bf_cid ON bfDb(bf_cid);
CREATE INDEX IF NOT EXISTS idx_bf_sid ON bfDb(bf_sid);
CREATE INDEX IF NOT EXISTS idx_bf_tid ON bfDb(bf_tid);
CREATE INDEX IF NOT EXISTS idx_class_name ON bfDb(class_name);