const {LinkedList} = require('./linked-list');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
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
  async populateLinkedList(db, head) {
    const ll = new LinkedList({
      id: language.id,
      name: language.name,
      total_score: language.total_score,
    })

    let word = words.find(w => w.id === language.head)

    ll.insert({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    })

    while (word.next) {
      word = words.find(w => w.id === word.next)

      ll.insert({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }

    return ll
  },

  updateLinkedList(db, linkedLanguage) {
    return db.transaction(trx =>
      Promise.all([
        db('language')
          .transacting(trx)
          .where('id', linkedLanguage.id)
          .update({
            total_score: linkedLanguage.total_score,
            head: linkedLanguage.head.value.id,
          }),
        ...linkedLanguage.map(node =>
          db('word')
            .transacting(trx)
            .where('id', node.value.id)
            .update({
              memory_value: node.value.memory_value,
              correct_count: node.value.correct_count,
              incorrect_count: node.value.incorrect_count,
              next: node.next ? node.next.value.id : null,
            })
        )
      ])
    )
  }

  // updateWords(db, list, user_id) {
  //   return db.transaction(async (trx) => {
  //     let current = list.head;
  //     await trx
  //       .into("language")
  //       .where({ user_id })
  //       .update({ head: current.value.id });
  //     while (current !== null) {
  //       await trx
  //         .into("word")
  //         .where({ id: current.value.id })
  //         .update({
  //           next: current.next !== null ? current.next.value.id : null,
  //         });
  //       current = current.next;
  //     }
  //   });
  // },

}

module.exports = LanguageService
