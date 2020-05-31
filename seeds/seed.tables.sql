BEGIN;

TRUNCATE
  "word",
  "language",
  "user" RESTART IDENTITY CASCADE; 

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'spanishcapstone',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'el zorro', 'the fox', 2),
  (2, 1, 'la vaca', 'the cow', 3),
  (3, 1, 'el ratón', 'the mouse', 4),
  (4, 1, 'el conejo', 'the rabbit', 5),
  (5, 1, 'el águila', 'the eagle', 6),
  (6, 1, 'el cisne', 'the swan', 7),
  (7, 1, 'el búho', 'the owl', 8),
  (8, 1, 'la rata', 'the rat', 9),
  (9, 1, 'la abeja', 'the bee', 10),
  (10, 1, 'el mono', 'the monkey', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
