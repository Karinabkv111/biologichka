'use client'

import { useState } from 'react'

// Тестовые данные теста (потом будут из базы)
const testData = {
  id: 1,
  title: 'Тест: Строение клетки',
  subject: 'Биология',
  questions: [
    {
      id: 1,
      text: 'Какая органелла отвечает за синтез белка?',
      type: 'options',
      options: ['Митохондрия', 'Рибосома', 'Лизосома', 'Аппарат Гольджи'],
      correct: 1,
      points: 1,
    },
    {
      id: 2,
      text: 'Сколько хромосом в соматической клетке человека?',
      type: 'number',
      correctNumber: '46',
      points: 1,
    },
    {
      id: 3,
      text: 'Как называется процесс деления клетки, в результате которого образуются две идентичные дочерние клетки?',
      type: 'word',
      correctWord: 'митоз',
      points: 1,
    },
    {
      id: 4,
      text: 'Установите последовательность этапов фотосинтеза: 1) темновая фаза, 2) световая фаза, 3) фотолиз воды, 4) фиксация CO₂',
      type: 'sequence',
      correctSequence: '2314',
      points: 2,
    },
  ],
}

export default function TakeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  const q = testData.questions[currentQuestion]
  const totalQuestions = testData.questions.length

  // Сохранение ответа
  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [q.id]: value })
  }

  // Переход к следующему вопросу
  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Переход к предыдущему вопросу
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Отправка теста на проверку
  const handleSubmit = () => {
    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0

    testData.questions.forEach((q) => {
      const userAnswer = answers[q.id as number]
      let isCorrect = false

      if (q.type === 'options') {
        isCorrect = Number(userAnswer) === q.correct
      } else if (q.type === 'number') {
        isCorrect = userAnswer?.trim() === q.correctNumber?.trim()
      } else if (q.type === 'word') {
        isCorrect = userAnswer?.trim().toLowerCase() === q.correctWord?.trim().toLowerCase()
      } else if (q.type === 'sequence') {
        isCorrect = userAnswer?.replace(/\s/g, '') === q.correctSequence?.replace(/\s/g, '')
      }

      totalPoints += q.points || 1
      if (isCorrect) {
        correctCount++
        earnedPoints += q.points || 1
      }
    })

    setScore({
      correct: correctCount,
      total: totalQuestions,
      points: earnedPoints,
      maxPoints: totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100),
    })
    setSubmitted(true)
  }

  // Экран результатов
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-fuchsia-100 p-8 w-full max-w-lg text-center">
          <div className="text-6xl mb-4">
            {score.percentage >= 80 ? '🎉' : score.percentage >= 50 ? '👍' : '📚'}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Тест завершён!</h1>
          <p className="text-gray-500 mb-6">{testData.title}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{score.correct}/{score.total}</div>
              <div className="text-sm text-gray-500">Правильных ответов</div>
            </div>
            <div className="bg-fuchsia-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-fuchsia-600">{score.points}/{score.maxPoints}</div>
              <div className="text-sm text-gray-500">Баллов</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full transition-all ${
                score.percentage >= 80 ? 'bg-green-500' : score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-6">
            Результат: <span className="text-fuchsia-600">{score.percentage}%</span>
          </p>

          <button
            onClick={() => window.close()}
            className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  // Экран вопроса
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 p-6 mb-4">
          <h1 className="text-lg font-bold text-gray-800">{testData.title}</h1>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-400">Вопрос {currentQuestion + 1} из {totalQuestions}</span>
            <span className="text-sm text-gray-400">Баллов за вопрос: {q.points || 1}</span>
          </div>
          {/* Прогресс-бар */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-fuchsia-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Вопрос */}
        <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 p-6 mb-4">
          <h2 className="text-lg font-medium text-gray-800 mb-6">{q.text}</h2>

          {/* Варианты ответа */}
          {q.type === 'options' && (
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                    answers[q.id] === oi
                      ? 'border-fuchsia-400 bg-fuchsia-50'
                      : 'border-gray-200 hover:border-fuchsia-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === oi}
                    onChange={() => handleAnswer(oi)}
                    className="text-fuchsia-500"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* Ввод числа */}
          {q.type === 'number' && (
            <div>
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full border-2 border-fuchsia-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-fuchsia-400"
                placeholder="Введите число"
              />
            </div>
          )}

          {/* Ввод слова */}
          {q.type === 'word' && (
            <div>
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                placeholder="Введите слово или словосочетание"
              />
            </div>
          )}

          {/* Ввод последовательности */}
          {q.type === 'sequence' && (
            <div>
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-400"
                placeholder="Введите последовательность цифр (например: 3142)"
              />
              <p className="text-xs text-gray-400 mt-1">Только цифры без запятых и пробелов</p>
            </div>
          )}
        </div>

        {/* Кнопки навигации */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            ← Назад
          </button>

          <span className="text-sm text-gray-400">
            {Object.keys(answers).length} из {totalQuestions} отвечено
          </span>

          {currentQuestion < totalQuestions - 1 ? (
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium"
            >
              Далее →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition"
            >
              ✓ Завершить тест
            </button>
          )}
        </div>
      </div>
    </div>
  )
}