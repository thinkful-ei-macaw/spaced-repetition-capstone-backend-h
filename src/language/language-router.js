const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    let headWord = req.language.head;
    let totalScore = req.language.total_score;
    let nextWord;
    try {
      nextWord = await LanguageService.getNextWord(req.app.get("db"), headWord);
    } catch (error) {
      next(error);
    }
    res.status(200).json({
      nextWord: nextWord.original,
      totalScore: totalScore,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
    });
  })

languageRouter
.post('/guess', jsonBodyParser, async (req, res, next) => {
  let guess = req.body.guess ? req.body.guess.trim().toLowerCase() : "";
  let headWord = req.language.head;
  let wordList;
  let newMemoryValue;

  if (!req.body.guess) {
    return res.status(400).json({ error: "Missing 'guess' in request body" });
  }

  try {
    headWord = await LanguageService.getWord(req.app.get("db"), headWord);
    let correctCount = headWord.correct_count;
    let incorrectCount = headWord.incorrect_count;
    let totalScore = req.language.total_score;
    let isCorrect = false;
    if (guess === headWord.translation) {
      newMemoryValue = headWord.memory_value * 2;
      isCorrect = true;
      await LanguageService.updateWord(req.app.get("db"), headWord.id, {
        ...headWord,
        memory_value: newMemoryValue,
        correct_count: ++correctCount,
      });

      await LanguageService.updateLanguageScore(
        req.app.get("db"),
        req.user.id,
        ++totalScore
      );
    }

    if (guess !== headWord.translation) {
      newMemoryValue = 1;
      await LanguageService.updateWord(req.app.get("db"), headWord.id, {
        ...headWord,
        memory_value: newMemoryValue,
        incorrect_count: ++incorrectCount,
      });
    }

    wordList = await LanguageService.populateList(
      req.app.get("db"),
      headWord.id
    );

    wordList.moveHead(newMemoryValue);
    await LanguageService.updateWords(req.app.get("db"), wordList, req.user.id);
    const nextWord = wordList.head.value;
    return res.status(200).json({
      nextWord: nextWord.original,
      totalScore: totalScore,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      answer: headWord.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter
