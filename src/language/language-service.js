const {LinkedList} = require('./linked-list');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  updateLanguageScore(db, user_id, total_score) {
    return db.from("language").update({ total_score }).where({ user_id });
  },

  getNextWord(db, id) {
    if (id === null) {
      return;
    }
    return db
      .from("word")
      .select("original", "correct_count", "incorrect_count")
      .where({ id })
      .first();
  },
  getWord(db, id) {
    if (id === null) {
      return;
    }
    return db.from("word").select("*").where({ id }).first();
  },
  updateWord(db, id, fields) {
    if (id === null) {
      return;
    }
    return db
      .from("word")
      .where({ id })
      .update({ ...fields });
  },
  async populateList(db, head) {
    let word;
    word = await this.getWord(db, head);

    let list = new LinkedList();
    let id = word.id;
    while (id) {
      id = word.next;
      list.insertAfter(word);
      word = await this.getWord(db, id);
    }
    return list;
  },

  updateWords(db, list, user_id) {
    return db.transaction(async (trx) => {
      let current = list.head;
      await trx
        .into("language")
        .where({ user_id })
        .update({ head: current.value.id });
      while (current !== null) {
        await trx
          .into("word")
          .where({ id: current.value.id })
          .update({
            next: current.next !== null ? current.next.value.id : null,
          });
        current = current.next;
      }
    });
  },
};

module.exports = LanguageService;