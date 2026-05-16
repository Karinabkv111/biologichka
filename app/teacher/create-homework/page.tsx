'use client'

if (typeof window !== 'undefined') {
  const origError = console.error
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('quill')) return
    origError.apply(console, args)
  }
}
import { useState } from 'react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

// Справочник заданий ЕГЭ
const egeTasks = {
  1: { topic: 'Современная биология – комплексная наука. Биологические науки и изучаемые ими проблемы.', form: 'Работа с таблицей (с рисунком и без рисунка)', level: 'Б', points: 1, hint: 'options' },
  2: { topic: 'Методы биологической науки. Наблюдение, измерение, эксперимент, систематизация, анализ.', form: 'Множественный выбор', level: 'Б', points: 2, hint: 'options' },
  3: { topic: 'Генетическая информация в клетке. Хромосомный набор. Трофические цепи и сети.', form: 'Решение биологических расчётных задач', level: 'Б', points: 1, hint: 'number' },
  4: { topic: 'Моно- и дигибридное, анализирующее скрещивание.', form: 'Решение биологической задачи', level: 'Б', points: 1, hint: 'number' },
  5: { topic: 'Клетка как биологическая система. Организм как биологическая система.', form: 'Задание с рисунком', level: 'Б', points: 1, hint: 'word' },
  6: { topic: 'Клетка как биологическая система. Организм как биологическая система.', form: 'Установление соответствия (с рисунком)', level: 'П', points: 2, hint: 'sequence' },
  7: { topic: 'Клетка как биологическая система. Организм как биологическая система. Селекция. Биотехнология.', form: 'Множественный выбор (с рисунком и без рисунка)', level: 'Б', points: 2, hint: 'options' },
  8: { topic: 'Клетка как биологическая система. Организм как биологическая система. Селекция. Биотехнология.', form: 'Установление последовательности (без рисунка)', level: 'П', points: 2, hint: 'sequence' },
  9: { topic: 'Многообразие организмов. Грибы. Растения. Животные.', form: 'Задание с рисунком', level: 'Б', points: 1, hint: 'word' },
  10: { topic: 'Многообразие организмов. Грибы. Растения. Животные.', form: 'Установление соответствия', level: 'П', points: 2, hint: 'sequence' },
  11: { topic: 'Многообразие организмов. Грибы. Растения. Животные.', form: 'Множественный выбор (с рисунком и без рисунка)', level: 'Б', points: 2, hint: 'options' },
  12: { topic: 'Многообразие организмов. Основные систематические категории, их соподчинённость.', form: 'Установление последовательности', level: 'Б', points: 2, hint: 'sequence' },
  13: { topic: 'Организм человека.', form: 'Задание с рисунком', level: 'Б', points: 1, hint: 'word' },
  14: { topic: 'Организм человека.', form: 'Установление соответствия', level: 'П', points: 2, hint: 'sequence' },
  15: { topic: 'Организм человека.', form: 'Множественный выбор (с рисунком и без рисунка)', level: 'Б', points: 2, hint: 'options' },
  16: { topic: 'Организм человека.', form: 'Установление последовательности', level: 'П', points: 2, hint: 'sequence' },
  17: { topic: 'Эволюция живой природы.', form: 'Множественный выбор (работа с текстом)', level: 'Б', points: 2, hint: 'options' },
  18: { topic: 'Экосистемы и присущие им закономерности. Биосфера.', form: 'Множественный выбор (без рисунка)', level: 'Б', points: 2, hint: 'options' },
  19: { topic: 'Эволюция живой природы. Происхождение человека. Экосистемы и присущие им закономерности. Биосфера.', form: 'Установление соответствия (без рисунка)', level: 'П', points: 2, hint: 'sequence' },
  20: { topic: 'Общебиологические закономерности. Человек и его здоровье.', form: 'Работа с таблицей (с рисунком и без рисунка)', level: 'П', points: 2, hint: 'options' },
  21: { topic: 'Анализ экспертных данных в табличной или графической форме', form: 'Анализ данных', level: 'Б', points: 2, hint: 'options' },
  22: { topic: 'Применение биологических знаний в практических ситуациях, анализ экспериментальных данных (методология эксперимента)', form: 'Развёрнутое', level: 'П', points: 3, hint: 'open' },
  23: { topic: 'Применение биологических знаний в практических ситуациях, анализ экспериментальных данных (выводы и прогнозы)', form: 'Развёрнутое', level: 'В', points: 3, hint: 'open' },
  24: { topic: 'Задание с изображением биологического объекта', form: 'Развёрнутое с рисунком', level: 'В', points: 3, hint: 'open' },
  25: { topic: 'Обобщение и применение знаний о человеке и многообразии организмов', form: 'Развёрнутое', level: 'В', points: 3, hint: 'open' },
  26: { topic: 'Обобщение и применение знаний по общей биологии в новой ситуации', form: 'Развёрнутое', level: 'В', points: 3, hint: 'open' },
  27: { topic: 'Решение задач по цитологии и эволюции органического мира', form: 'Развёрнутое (задача)', level: 'В', points: 3, hint: 'open' },
  28: { topic: 'Решение задач по генетике на применение знаний в новой ситуации', form: 'Развёрнутое (задача)', level: 'В', points: 3, hint: 'open' },
}

const levelNames = { 'Б': 'Базовый', 'П': 'Повышенный', 'В': 'Высокий' }
const hintNames = {
  'options': 'Варианты ответа',
  'number': 'Ввод числа',
  'word': 'Ввод слова',
  'sequence': 'Ввод последовательности',
  'open': 'Развёрнутый ответ'
}

export default function CreateHomework() {
  const [homeworkType, setHomeworkType] = useState('test')
  const [exam, setExam] = useState('ЕГЭ')
  const [grade, setGrade] = useState('11')
  const [taskNumber, setTaskNumber] = useState('1')
  const [points, setPoints] = useState('1')
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [studentId, setStudentId] = useState('')
  const [openQuestion, setOpenQuestion] = useState('')
  
  const [testQuestions, setTestQuestions] = useState([
    { id: 1, text: '', answerType: 'options', options: ['', '', '', ''], correct: '', correctNumber: '', correctWord: '', correctSequence: '', image: null }
  ])

  const students = [
    { id: 1, name: 'Саша Иванов' },
    { id: 2, name: 'Маша Петрова' },
    { id: 3, name: 'Дима Сидоров' },
  ]

  // Текущая информация о задании
  const taskInfo = egeTasks[taskNumber as keyof typeof egeTasks]
  const taskNumbers = exam === 'ЕГЭ' ? Array.from({length: 28}, (_, i) => i + 1) : Array.from({length: 26}, (_, i) => i + 1)

  const handleTaskNumberChange = (num) => {
    setTaskNumber(num)
    const info = egeTasks[num]
    if (info) {
      setPoints(String(info.points))
      // Если задание развёрнутое — переключаем тип
      if (info.hint === 'open') {
        setHomeworkType('open')
      } else {
        setHomeworkType('test')
      }
    }
  }

  const handleImageUpload = (qi, oi, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const updated = [...testQuestions]
      if (oi === null) {
        updated[qi].image = ev.target.result
      } else {
        if (!updated[qi].optionImages) updated[qi].optionImages = []
        updated[qi].optionImages[oi] = ev.target.result
      }
      setTestQuestions(updated)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!title) return alert('Введите название задания')
    const hw = {
      id: Date.now(),
      title,
      exam,
      grade,
      taskNumber,
      points: Number(points),
      type: homeworkType,
      studentId: studentId ? Number(studentId) : null,
      deadline,
      status: 'new',
      ...(homeworkType === 'test'
        ? { questions: testQuestions }
        : { description: openQuestion }
      )
    }
    alert('Задание создано!\n' + JSON.stringify(hw, null, 2))
    window.close()
  }

  const updateQuestion = (qi, field, value) => {
    const updated = [...testQuestions]
    updated[qi][field] = value
    
    if (field === 'answerType') {
      updated[qi].correct = ''
      updated[qi].correctNumber = ''
      updated[qi].correctWord = ''
      updated[qi].correctSequence = ''
    }
    
    setTestQuestions(updated)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Конструктор задания</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 p-6 space-y-6">
          {/* Тип задания */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Тип задания</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setHomeworkType('test')} className={`p-3 rounded-xl border-2 text-center transition ${homeworkType === 'test' ? 'border-fuchsia-400 bg-fuchsia-50' : 'border-gray-200'}`}>
                <span className="text-2xl">📝</span>
                <div className="text-sm font-medium mt-1">Тест (часть 1)</div>
              </button>
              <button onClick={() => setHomeworkType('open')} className={`p-3 rounded-xl border-2 text-center transition ${homeworkType === 'open' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-2xl">✍️</span>
                <div className="text-sm font-medium mt-1">Развёрнутое (часть 2)</div>
              </button>
            </div>
          </div>

          {/* Параметры */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Название</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" placeholder="Название" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Экзамен</label>
              <select value={exam} onChange={(e) => setExam(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2">
                <option>ЕГЭ</option><option>ОГЭ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Класс</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2">
                {['8','9','10','11'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">№ задания</label>
              <select value={taskNumber} onChange={(e) => handleTaskNumberChange(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2">
                {taskNumbers.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Баллы</label>
              <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} className="w-full border border-fuchsia-300 rounded-xl px-3 py-2 bg-fuchsia-50 font-medium text-fuchsia-700" />
            </div>
          </div>

          {/* Информация о задании */}
          {taskInfo && (
            <div className="bg-gradient-to-r from-fuchsia-50 to-blue-50 rounded-xl border border-fuchsia-200 p-5 space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg">📌 Задание {taskNumber}</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Тема:</span>
                  <p className="text-gray-700 font-medium mt-1">{taskInfo.topic}</p>
                </div>
                <div>
                  <span className="text-gray-400">Форма представления:</span>
                  <p className="text-gray-700 font-medium mt-1">{taskInfo.form}</p>
                </div>
                <div>
                  <span className="text-gray-400">Уровень сложности:</span>
                  <p className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      taskInfo.level === 'Б' ? 'bg-green-100 text-green-700' :
                      taskInfo.level === 'П' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {levelNames[taskInfo.level]}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Рекомендуемый тип ответа:</span>
                  <p className="text-gray-700 font-medium mt-1">{hintNames[taskInfo.hint]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Вопросы теста */}
          {homeworkType === 'test' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Вопросы теста</h3>
              {testQuestions.map((q, qi) => (
                <div key={q.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium">Вопрос {qi + 1}</span>
                    {testQuestions.length > 1 && (
                      <button onClick={() => setTestQuestions(testQuestions.filter((_, i) => i !== qi))} className="text-red-400 text-sm">Удалить</button>
                    )}
                  </div>
                  
                  <ReactQuill
                    theme="snow"
                    value={q.text}
                    onChange={(val) => updateQuestion(qi, 'text', val)}
                    placeholder="Текст вопроса..."
                    className="bg-white rounded-lg mb-3"
                  />

                  <div className="mb-3">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(qi, null, e)} className="text-sm text-gray-500" />
                    {q.image && <img src={q.image} alt="Вопрос" className="mt-2 max-h-40 rounded-lg" />}
                  </div>

                  {/* Тип ответа и правильный ответ */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Тип ответа и правильный ответ</label>
                    <select
                      value={q.answerType}
                      onChange={(e) => updateQuestion(qi, 'answerType', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                    >
                      <option value="options">Варианты ответа</option>
                      <option value="number">Ввод числа</option>
                      <option value="word">Ввод слова / словосочетания</option>
                      <option value="sequence">Ввод последовательности цифр</option>
                    </select>

                    {q.answerType === 'options' && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                        <label className="text-xs font-medium text-gray-500 block">Варианты (отметьте правильный ⭐)</label>
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input type="radio" name={`correct-${q.id}`} checked={q.correct === String(oi)} onChange={() => updateQuestion(qi, 'correct', String(oi))} className="text-green-500" />
                            <input type="text" value={opt} onChange={(e) => { const u = [...testQuestions]; u[qi].options[oi] = e.target.value; setTestQuestions(u) }} className={`flex-1 border rounded-lg px-3 py-2 text-sm ${q.correct === String(oi) ? 'border-green-400 bg-green-50' : 'border-gray-300'}`} placeholder={`Вариант ${oi + 1}`} />
                            {q.correct === String(oi) && <span className="text-green-500 text-xs font-medium">✓ Правильный</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.answerType === 'number' && (
                      <div className="bg-white rounded-lg p-3 border border-green-200 bg-green-50/30">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Правильный ответ — число</label>
                        <input type="text" value={q.correctNumber} onChange={(e) => updateQuestion(qi, 'correctNumber', e.target.value)} className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Например: 42" />
                        <p className="text-xs text-gray-400 mt-1">Ученик должен ввести точно такое же число</p>
                      </div>
                    )}

                    {q.answerType === 'word' && (
                      <div className="bg-white rounded-lg p-3 border border-blue-200 bg-blue-50/30">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Правильный ответ — слово или словосочетание</label>
                        <input type="text" value={q.correctWord} onChange={(e) => updateQuestion(qi, 'correctWord', e.target.value)} className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Например: митохондрия" />
                        <p className="text-xs text-gray-400 mt-1">Проверка без учёта регистра (МиТоХоНдРиЯ = митохондрия)</p>
                      </div>
                    )}

                    {q.answerType === 'sequence' && (
                      <div className="bg-white rounded-lg p-3 border border-purple-200 bg-purple-50/30">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Правильная последовательность цифр</label>
                        <input type="text" value={q.correctSequence} onChange={(e) => updateQuestion(qi, 'correctSequence', e.target.value)} className="w-full border border-purple-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Например: 3142" />
                        <p className="text-xs text-gray-400 mt-1">Только цифры без запятых и пробелов</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setTestQuestions([...testQuestions, { id: Date.now(), text: '', answerType: 'options', options: ['', '', '', ''], correct: '', correctNumber: '', correctWord: '', correctSequence: '', image: null }])}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-2 text-sm text-gray-500 hover:border-fuchsia-400 transition"
              >
                + Добавить вопрос
              </button>
            </div>
          )}

          {/* Развёрнутое задание */}
          {homeworkType === 'open' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Текст задания с развёрнутым ответом</label>
              <ReactQuill
                theme="snow"
                value={openQuestion}
                onChange={setOpenQuestion}
                placeholder="Введите текст задания..."
                className="bg-white rounded-lg"
                style={{ minHeight: '200px' }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Назначить ученику</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2">
                <option value="">Выберите ученика</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Дедлайн</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => window.close()} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium">Отмена</button>
            <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white py-3 rounded-xl font-medium">Сохранить задание</button>
          </div>
        </div>
      </div>
    </div>
  )
}