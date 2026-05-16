'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../calendar.css'

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('📅 Календарь')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [showAddHomework, setShowAddHomework] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [homeworkType, setHomeworkType] = useState('test')
  const [showProfile, setShowProfile] = useState(false)

  const [profile, setProfile] = useState({
    firstName: 'Карина',
    lastName: 'Биолог',
    birthDate: '1995-03-20',
    phone: '+7 (999) 000-00-00',
    avatar: null,
    about: 'Репетитор по биологии. Готовлю к ЕГЭ и ОГЭ. Опыт работы — 10 лет. Авторская методика подготовки.',
  })

  const [testQuestions, setTestQuestions] = useState([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }])
  const [openQuestion, setOpenQuestion] = useState('')

  const [lessons, setLessons] = useState([])
  const [lessonsLoaded, setLessonsLoaded] = useState(false)

  // Загрузка уроков из Supabase
  useEffect(() => {
    const loadLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('date', { ascending: false })

      if (data) {
        setLessons(data.map(l => ({
          id: l.id,
          date: l.date,
          time: l.time?.slice(0, 5),
          topic: l.topic,
          studentId: l.student_id || 0,
          materialLink: l.material_link || '',
        })))
      }
      setLessonsLoaded(true)
    }
    loadLessons()
  }, [])
  const [students, setStudents] = useState([
    { id: 1, name: 'Саша Иванов', email: 'sasha@mail.ru', progress: 65, debts: 2, lessonsDone: 8, totalLessons: 12, paid: true },
    { id: 2, name: 'Маша Петрова', email: 'masha@mail.ru', progress: 88, debts: 0, lessonsDone: 10, totalLessons: 10, paid: true },
    { id: 3, name: 'Дима Сидоров', email: 'dima@mail.ru', progress: 34, debts: 5, lessonsDone: 4, totalLessons: 12, paid: false },
  ])

  const [materials, setMaterials] = useState([
    { id: 1, title: 'Конспект: Строение клетки', type: 'pdf', date: '15.05.2026', isPublic: false, section: 'Общая биология', link: '/materials/cell-structure.pdf' },
    { id: 2, title: 'Презентация: Фотосинтез', type: 'pdf', date: '14.05.2026', isPublic: true, section: 'Ботаника', link: '/materials/photosynthesis.pdf' },
    { id: 3, title: 'Видео: Митоз и мейоз', type: 'video', date: '10.05.2026', isPublic: false, section: 'Общая биология', link: '/materials/mitosis.mp4' },
  ])

  const [homeworks, setHomeworks] = useState([
    { id: 1, title: 'Тест: Строение клетки', type: 'test', studentId: 1, deadline: '2026-05-20', status: 'done', questions: [{ id: 1, text: 'Какая органелла отвечает за синтез белка?', options: ['Митохондрия', 'Рибосома', 'Лизосома', 'Аппарат Гольджи'], correct: 1 }] },
    { id: 2, title: 'Развернутое: Фотосинтез', type: 'open', studentId: 1, deadline: '2026-05-22', status: 'pending', description: 'Опишите процесс фотосинтеза. Укажите световую и темновую фазы.' },
  ])

  const [newLesson, setNewLesson] = useState({ date: new Date().toISOString().split('T')[0], time: '16:00', topic: '', studentId: '', materialLink: '' })
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' })
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'pdf', file: null })
  const [newHomework, setNewHomework] = useState({ title: '', type: 'test', studentId: '', deadline: '', description: '' })

  const lessonsOnDate = lessons.filter((l) => l.date === selectedDate.toISOString().split('T')[0])
  const studentLessons = selectedStudent ? lessons.filter((l) => l.studentId === selectedStudent.id) : []

  const addLesson = async () => {
    if (!newLesson.topic || !newLesson.studentId) { alert('Заполните тему и выберите ученика'); return }

    const { error } = await supabase
      .from('lessons')
      .insert({
        teacher_id: '08cab416-ba60-4363-8f95-432ad5058bc2',
        date: newLesson.date,
        time: newLesson.time,
        topic: newLesson.topic,
        material_link: newLesson.materialLink || null
      })

    if (error) { alert('Ошибка сохранения: ' + error.message); return }

    // Перезагружаем уроки
    const { data } = await supabase.from('lessons').select('*').order('date', { ascending: false })
    if (data) setLessons(data.map(l => ({ id: l.id, date: l.date, time: l.time?.slice(0, 5), topic: l.topic, studentId: l.student_id || 0, materialLink: l.material_link || '' })))

    setShowAddLesson(false)
    setNewLesson({ date: new Date().toISOString().split('T')[0], time: '16:00', topic: '', studentId: '', materialLink: '' })
  }

  const deleteLesson = (id) => { if (confirm('Удалить урок?')) setLessons(lessons.filter((l) => l.id !== id)) }
  const addStudent = () => {
    if (!newStudent.name || !newStudent.email) return
    setStudents([...students, { id: Date.now(), name: newStudent.name, email: newStudent.email, progress: 0, debts: 0, lessonsDone: 0, totalLessons: 0, paid: true }])
    setShowAddStudent(false)
    setNewStudent({ name: '', email: '', password: '' })
  }
  const addMaterial = () => {
    if (!newMaterial.title) { alert('Введите название материала'); return }
    if (!newMaterial.file) { alert('Выберите файл'); return }
    setMaterials([...materials, { id: Date.now(), title: newMaterial.title, type: newMaterial.type, date: new Date().toLocaleDateString('ru-RU'), isPublic: false, section: 'Общая биология', link: '/materials/' + newMaterial.file.name, fileName: newMaterial.file.name, fileSize: (newMaterial.file.size / 1024 / 1024).toFixed(1) + ' МБ' }])
    setShowAddMaterial(false)
    setNewMaterial({ title: '', type: 'pdf', file: null })
  }
  const togglePublic = (id) => setMaterials(materials.map((m) => m.id === id ? { ...m, isPublic: !m.isPublic } : m))
  const copyLink = (link) => navigator.clipboard.writeText(link).then(() => alert('Ссылка скопирована!'))
  const deleteMaterial = (id) => { if (confirm('Удалить материал?')) setMaterials(materials.filter((m) => m.id !== id)) }
  const addHomework = () => {
    if (!newHomework.title || !newHomework.studentId || !newHomework.deadline) { alert('Заполните название, выберите ученика и дедлайн'); return }
    const hw = { id: Date.now(), title: newHomework.title, type: homeworkType, studentId: Number(newHomework.studentId), deadline: newHomework.deadline, status: 'new', ...(homeworkType === 'test' ? { questions: testQuestions } : { description: openQuestion }) }
    setHomeworks([...homeworks, hw])
    setShowAddHomework(false)
    setTestQuestions([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }])
    setOpenQuestion('')
    setNewHomework({ title: '', type: 'test', studentId: '', deadline: '', description: '' })
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <header className="glass border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{selectedStudent.name}</h1>
            </div>
            <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-sm">👤</span>}
              </div>
              Профиль
            </button>
          </div>
        </header>
        <StudentTabs student={selectedStudent} lessons={studentLessons} students={students} deleteLesson={deleteLesson} materials={materials} homeworks={homeworks.filter(h => h.studentId === selectedStudent.id)} profile={profile} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="glass border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Твои 100 баллов</h1>
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-sm">👤</span>}
            </div>
            Профиль
          </button>
        </div>
      </header>

      <nav className="glass px-4 py-3">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { id: '👥 Ученики', label: 'Ученики', icon: '/ученик.png' },
            { id: '📚 Материалы', label: 'Материалы', icon: '/материалы.png' },
            { id: '📝 Задания', label: 'Задания', icon: '/дз.png' },
            { id: '📅 Календарь', label: 'Календарь', icon: '/календарь.png' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-blue-700 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-indigo-600 border border-gray-200'}`}>
              <img src={tab.icon} alt="" width={24} height={24} className="w-6 h-6" />{tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {activeTab === '👥 Ученики' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Мои ученики</h2>
              <button onClick={() => setShowAddStudent(true)} className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium btn-pulse">+ Добавить ученика</button>
            </div>
            {students.map((s) => (
              <button key={s.id} onClick={() => setSelectedStudent(s)} className="w-full glass-card rounded-2xl p-5 flex justify-between hover:shadow-md transition text-left animate-in">
                <div>
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-400">Прогресс: {String(s.progress)}% · Уроков: {String(s.lessonsDone)}/{String(s.totalLessons)}</div>
                </div>
                <div className="flex items-center gap-3">
                  {s.debts > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{String(s.debts)} долга</span>}
                  {!s.paid && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Не оплачено</span>}
                  <span className="text-gray-300">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === '📚 Материалы' && <MaterialsManager materials={materials} setMaterials={setMaterials} supabase={supabase} />}

        {activeTab === '📝 Задания' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Домашние задания</h2>
              <button onClick={() => window.open('/teacher/create-homework', '_blank')} className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium">+ Создать задание</button>
            </div>
            {homeworks.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center"><p className="text-gray-400">Нет созданных заданий</p><p className="text-gray-300 text-sm mt-1">Нажмите «+ Создать задание»</p></div>
            ) : (
              <div className="grid gap-3">
                {homeworks.map((h) => {
                  const s = students.find((st) => st.id === h.studentId)
                  return (
                    <div key={h.id} className="glass-card rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${h.type === 'test' ? 'bg-purple-400' : 'bg-blue-400'}`}>{h.type === 'test' ? '📝' : '✍️'}</div>
                        <div>
                          <div className="font-medium text-gray-800">{h.title}</div>
                          <div className="text-sm text-gray-400">{h.type === 'test' ? 'Тест' : 'Развернутое'} • {s?.name || 'Не назначено'} • До {new Date(h.deadline).toLocaleDateString('ru-RU')}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${h.status === 'done' ? 'bg-green-100 text-green-600' : h.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{h.status === 'done' ? 'Сдано' : h.status === 'pending' ? 'На проверке' : 'Новое'}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === '📅 Календарь' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Календарь занятий</h2>
              <button onClick={() => setShowAddLesson(true)} className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition">+ Добавить урок</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-4">
                <Calendar onChange={(date) => setSelectedDate(date as Date)} value={selectedDate} tileClassName={({ date }) => { const d = date.toISOString().split('T')[0]; return lessons.some((l) => l.date === d) ? 'has-lesson' : '' }} />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-medium text-gray-800 mb-4">Занятия на {selectedDate.toLocaleDateString('ru-RU')}</h3>
                {lessonsOnDate.length === 0 ? <p className="text-gray-400 text-sm">Нет занятий</p> : (
                  <div className="space-y-3">
                    {lessonsOnDate.map((l) => {
                      const s = students.find((st) => st.id === l.studentId)
                      return (
                        <div key={l.id} className="bg-blue-50 border border-indigo-200 rounded-xl p-3 flex justify-between items-center">
                          <div><div className="font-medium text-gray-800">{l.topic}</div><div className="text-sm text-gray-500">{l.time} • {s?.name || 'Неизвестно'}</div></div>
                          <button onClick={() => deleteLesson(l.id)} className="text-red-400 hover:text-red-600 text-lg ml-3" title="Удалить урок"><img src="/ведро.png" alt="Удалить" width={20} height={20} /></button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowProfile(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Профиль</h3><button onClick={() => setShowProfile(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button></div>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3 overflow-hidden">{profile.avatar ? <img src={profile.avatar} alt="Аватар" className="w-full h-full object-cover" /> : <span className="text-4xl text-gray-400">👤</span>}</div>
                <label className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-indigo-200 transition">Загрузить фото<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setProfile({ ...profile, avatar: ev.target.result }); reader.readAsDataURL(file); } }} /></label>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-500 mb-1">Имя</label><input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Фамилия</label><input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Дата рождения</label><input type="date" value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Номер телефона</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Обо мне <span className="text-xs text-indigo-400">(видно ученикам)</span></label><textarea value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24 resize-none" placeholder="Расскажите о себе..." /></div>
                <button onClick={() => setShowProfile(false)} className="w-full bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-3 rounded-xl font-medium">Сохранить</button>
              </div>
            </div>
          </div>
        )}

        {showAddLesson && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Новый урок</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-600 mb-1">Дата</label><input type="date" value={newLesson.date} onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Время</label><input type="time" value={newLesson.time} onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Тема</label><input type="text" value={newLesson.topic} onChange={(e) => setNewLesson({ ...newLesson, topic: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Например: Строение клетки" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Ученик</label><select value={newLesson.studentId} onChange={(e) => setNewLesson({ ...newLesson, studentId: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2"><option value="">Выберите ученика</option>{students.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
                <div><label className="block text-sm text-gray-600 mb-1">Ссылка на материал</label><input type="text" value={newLesson.materialLink || ''} onChange={(e) => setNewLesson({ ...newLesson, materialLink: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Вставьте ссылку из «Материалы»" /></div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowAddLesson(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button onClick={addLesson} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Добавить</button></div>
            </div>
          </div>
        )}

        {showAddStudent && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Добавить ученика</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-600 mb-1">Имя</label><input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Иван Петров" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Email</label><input type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="ivan@mail.ru" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Пароль</label><input type="password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="••••••••" /></div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowAddStudent(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button onClick={addStudent} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Добавить</button></div>
            </div>
          </div>
        )}

        {showAddMaterial && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Загрузить материал</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-600 mb-1">Название</label><input type="text" value={newMaterial.title} onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Конспект: Строение клетки" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Тип</label><select value={newMaterial.type} onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2"><option value="pdf">PDF</option><option value="video">Видео</option></select></div>
                <div><label className="block text-sm text-gray-600 mb-1">Файл</label><input type="file" accept={newMaterial.type === 'pdf' ? '.pdf' : '.mp4,.mov,.avi,.webm'} onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-500 hover:border-indigo-400 transition cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-indigo-600 hover:file:bg-indigo-100" />{newMaterial.file && <p className="text-xs text-green-600 mt-1">✅ Выбран: {newMaterial.file.name} ({(newMaterial.file.size / 1024 / 1024).toFixed(1)} МБ)</p>}</div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => { setShowAddMaterial(false); setNewMaterial({ title: '', type: 'pdf', file: null }) }} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button onClick={addMaterial} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Загрузить</button></div>
            </div>
          </div>
        )}

        {showAddHomework && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Создать домашнее задание</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-600 mb-2">Тип задания</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setHomeworkType('test')} className={`p-3 rounded-xl border-2 text-center transition ${homeworkType === 'test' ? 'border-indigo-400 bg-blue-50' : 'border-gray-200 hover:border-indigo-200'}`}><div className="text-2xl mb-1">📝</div><div className="text-sm font-medium">Тест</div><div className="text-xs text-gray-400">Автопроверка</div></button><button type="button" onClick={() => setHomeworkType('open')} className={`p-3 rounded-xl border-2 text-center transition ${homeworkType === 'open' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}><div className="text-2xl mb-1">✍️</div><div className="text-sm font-medium">Развернутое</div><div className="text-xs text-gray-400">Ручная проверка</div></button></div></div>
                <div><label className="block text-sm text-gray-600 mb-1">Название задания</label><input type="text" value={newHomework.title} onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Тест: Строение клетки" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Назначить ученику</label><select value={newHomework.studentId} onChange={(e) => setNewHomework({ ...newHomework, studentId: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2"><option value="">Выберите ученика</option>{students.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
                <div><label className="block text-sm text-gray-600 mb-1">Дедлайн</label><input type="date" value={newHomework.deadline} onChange={(e) => setNewHomework({ ...newHomework, deadline: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                {homeworkType === 'test' && (
                  <div className="space-y-4"><label className="block text-sm text-gray-600 font-medium">Вопросы теста</label>
                    {testQuestions.map((q, qi) => (
                      <div key={q.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">Вопрос {qi + 1}</span>{testQuestions.length > 1 && <button onClick={() => setTestQuestions(testQuestions.filter((_, i) => i !== qi))} className="text-red-400 hover:text-red-600 text-sm">Удалить</button>}</div><input type="text" value={q.text} onChange={(e) => { const u = [...testQuestions]; u[qi].text = e.target.value; setTestQuestions(u) }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3" placeholder="Текст вопроса" /><div className="space-y-2">{q.options.map((opt, oi) => (<div key={oi} className="flex items-center gap-2"><input type="radio" name={`correct-${q.id}`} checked={q.correct === oi} onChange={() => { const u = [...testQuestions]; u[qi].correct = oi; setTestQuestions(u) }} className="text-indigo-500" /><input type="text" value={opt} onChange={(e) => { const u = [...testQuestions]; u[qi].options[oi] = e.target.value; setTestQuestions(u) }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={`Вариант ${oi + 1}`} /></div>))}</div></div>
                    ))}
                    <button onClick={() => setTestQuestions([...testQuestions, { id: Date.now(), text: '', options: ['', '', '', ''], correct: 0 }])} className="w-full border-2 border-dashed border-gray-300 rounded-xl py-2 text-sm text-gray-500 hover:border-indigo-400 transition">+ Добавить вопрос</button>
                  </div>
                )}
                {homeworkType === 'open' && <div><label className="block text-sm text-gray-600 mb-1">Текст задания</label><textarea value={openQuestion} onChange={(e) => setOpenQuestion(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 h-32" placeholder="Опишите процесс фотосинтеза..." /></div>}
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => { setShowAddHomework(false); setTestQuestions([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }]); setOpenQuestion(''); setNewHomework({ title: '', type: 'test', studentId: '', deadline: '', description: '' }) }} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button onClick={addHomework} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Создать</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function MaterialsManager({ materials, setMaterials }) {
  const [selectedSection, setSelectedSection] = useState('Общая биология')
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddFile, setShowAddFile] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newFile, setNewFile] = useState({ title: '', type: 'pdf', isPublic: false, file: null })
  const [sections, setSections] = useState(['Общая биология', 'Генетика', 'Анатомия', 'Ботаника', 'Зоология', 'Эволюция', 'Экология'])
  const sectionFiles = materials.filter(m => m.section === selectedSection)

  const addSection = () => { if (newSectionName.trim() && !sections.includes(newSectionName.trim())) { setSections([...sections, newSectionName.trim()]); setNewSectionName(''); setShowAddSection(false) } }
  const addFile = async () => {
    try {
      if (!newFile.title.trim()) {
        alert('Введите название')
        return
      }

      if (!newFile.file) {
        alert('Выберите файл')
        return
      }

      const safeFileName =
        Date.now() +
        '-' +
        newFile.file.name.replace(/[^\w.-]/g, '_')

      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(safeFileName, newFile.file)

      if (uploadError) {
        console.error(uploadError)
        alert(uploadError.message)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('materials')
        .getPublicUrl(safeFileName)

      const { error: dbError } = await supabase
        .from('materials')
        .insert({
          title: newFile.title,
          type: newFile.type,
          section: selectedSection,
          is_public: newFile.isPublic,
          file_url: publicUrl,
        })

      if (dbError) {
        console.error(dbError)
        alert(dbError.message)
        return
      }

      setMaterials([
        ...materials,
        {
          id: Date.now(),
          title: newFile.title,
          type: newFile.type,
          date: new Date().toLocaleDateString('ru-RU'),
          isPublic: newFile.isPublic,
          section: selectedSection,
          link: publicUrl,
        },
      ])

      setNewFile({
        title: '',
        type: 'pdf',
        isPublic: false,
        file: null,
      })

      setShowAddFile(false)

      alert('Файл успешно загружен')
    } catch (err) {
      console.error(err)
      alert('Ошибка загрузки')
    }
  }
  const togglePublic = (id) => { setMaterials(materials.map(m => m.id === id ? { ...m, isPublic: !m.isPublic } : m)) }
  const deleteFile = (id) => { if (confirm('Удалить файл?')) setMaterials(materials.filter(m => m.id !== id)) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-800">База материалов</h2><div className="flex gap-2"><button onClick={() => setShowAddSection(true)} className="border border-indigo-300 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition">+ Раздел</button><button onClick={() => setShowAddFile(true)} className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium">+ Файл</button></div></div>
      <div className="flex gap-2 flex-wrap">{sections.map(section => (<button key={section} onClick={() => setSelectedSection(section)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSection === section ? 'bg-gradient-to-r from-indigo-500 to-blue-700 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'}`}>{section}</button>))}</div>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-medium text-gray-800 mb-4">📁 {selectedSection}</h3>
        {sectionFiles.length === 0 ? <p className="text-gray-400 text-center py-8">Нет файлов в этом разделе</p> : (
          <div className="grid gap-3">{sectionFiles.map((file) => (
            <div key={file.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${file.type === 'pdf' ? 'bg-red-400' : 'bg-blue-400'}`}>{file.type === 'pdf' ? 'PDF' : '▶'}</div><div><div className="font-medium text-gray-800">{file.title}</div><div className="text-sm text-gray-400">{file.date} • {file.isPublic ? '🌐 Публичный' : '🔒 Приватный'}</div></div></div>
              <div className="flex items-center gap-2"><button onClick={() => { navigator.clipboard.writeText(file.link); alert('Ссылка скопирована: ' + file.link) }} className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">🔗 Копировать</button><button onClick={() => togglePublic(file.id)} className={`text-xs px-3 py-1 rounded-full ${file.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{file.isPublic ? 'Публичный' : 'Приватный'}</button><button onClick={() => deleteFile(file.id)} className="text-red-400 hover:text-red-600 ml-2"><img src="/ведро.png" alt="Удалить" width={18} height={18} /></button></div>
            </div>
          ))}</div>
        )}
      </div>
      {showAddSection && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowAddSection(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}><h3 className="text-lg font-semibold text-gray-800 mb-4">Новый раздел</h3><input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Название раздела" /><div className="flex gap-3 mt-4"><button onClick={() => setShowAddSection(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button onClick={addSection} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Добавить</button></div></div></div>)}
      {showAddFile && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}><h3 className="text-lg font-semibold text-gray-800 mb-4">Новый файл в раздел «{selectedSection}»</h3><div className="space-y-4"><div><label className="block text-sm text-gray-500 mb-1">Название</label><input type="text" value={newFile.title} onChange={e => setNewFile({ ...newFile, title: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="Конспект: Строение клетки" /></div><div><label className="block text-sm text-gray-500 mb-1">Тип</label><select value={newFile.type} onChange={e => setNewFile({ ...newFile, type: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2"><option value="pdf">PDF</option><option value="video">Видео</option></select></div><div><label className="block text-sm text-gray-500 mb-1">Файл</label><input type="file" accept={newFile.type === 'pdf' ? '.pdf' : '.mp4,.mov,.avi,.webm'} onChange={e => setNewFile({ ...newFile, file: e.target.files[0] })} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-500 hover:border-indigo-400 transition cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-indigo-600" />{newFile.file && <p className="text-xs text-green-600 mt-1">✅ Выбран: {newFile.file.name} ({(newFile.file.size / 1024 / 1024).toFixed(1)} МБ)</p>}</div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newFile.isPublic} onChange={e => setNewFile({ ...newFile, isPublic: e.target.checked })} className="text-indigo-500" /><span className="text-sm text-gray-600">Сделать публичным (видно ученикам)</span></label></div><div className="flex gap-3 mt-4"><button onClick={() => { setShowAddFile(false); setNewFile({ title: '', type: 'pdf', isPublic: false, file: null }) }} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl">Отмена</button><button
        type="button"
        onClick={() => {
          console.log('BUTTON CLICK')
          addFile()
        }} className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-700 text-white py-2 rounded-xl">Добавить</button></div></div></div>)}
    </div>
  )
}

function StudentTabs({ student, lessons, students, deleteLesson, materials, homeworks, profile }) {
  const [tab, setTab] = useState('lessons')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const lessonsOnDate = lessons.filter((l) => l.date === selectedDate.toISOString().split('T')[0])

  return (
    <>
      <nav className="glass px-4 py-3">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {['📅 Уроки', '📊 Прогресс', '📝 Домашки', '⚠️ Дедлайны', '💰 Статистика'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{t}</button>
          ))}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        {tab === '📅 Уроки' && (
          <div className="space-y-6"><h2 className="text-lg font-semibold text-gray-800">Уроки {student.name}</h2>
            <div className="grid md:grid-cols-2 gap-6"><div className="glass-card rounded-2xl p-4"><Calendar onChange={(date) => setSelectedDate(date as Date)} value={selectedDate} tileClassName={({ date }) => { const d = date.toISOString().split('T')[0]; return lessons.some((l) => l.date === d) ? 'has-lesson' : '' }} /></div>
              <div className="glass-card rounded-2xl p-6"><h3 className="font-medium text-gray-800 mb-4">Занятия на {selectedDate.toLocaleDateString('ru-RU')}</h3>{lessonsOnDate.length === 0 ? <p className="text-gray-400 text-sm">Нет занятий</p> : lessonsOnDate.map((l) => (<div key={l.id} className="bg-blue-50 border border-indigo-200 rounded-xl p-4 mb-3"><div className="font-medium text-gray-800">{l.topic}</div><div className="text-sm text-gray-500 mb-2">{l.time}</div><div className="flex gap-2 flex-wrap"><button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium">▶ Войти в класс</button>{l.materialLink && <a href={l.materialLink} target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition inline-block">📥 Материал</a>}</div></div>))}</div>
            </div>
          </div>
        )}
        {tab === '📊 Прогресс' && (<div className="glass-card rounded-2xl p-6"><h2 className="text-lg font-semibold text-gray-800">Прогресс: {student.name}</h2><div className="text-3xl font-bold text-indigo-600 mb-2">{student.progress}%</div><div className="w-full bg-gray-200 rounded-full h-3 mb-4"><div className="bg-gradient-to-r from-indigo-500 to-blue-700 h-3 rounded-full" style={{ width: `${student.progress}%` }} /></div></div>)}
        {tab === '📝 Домашки' && (
          <div className="space-y-4"><h2 className="text-lg font-semibold text-gray-800">Домашние задания</h2>
            {(!homeworks || homeworks.length === 0) ? <p className="text-gray-400">Нет заданий</p> : homeworks.map((h) => (
              <div key={h.id} className={`bg-white rounded-2xl shadow-sm border p-4 flex items-center justify-between ${h.status === 'overdue' ? 'border-red-300 bg-red-50/50' : h.status === 'done' ? 'border-green-300 bg-green-50/50' : h.status === 'pending' ? 'border-yellow-300 bg-yellow-50/50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${h.status === 'overdue' ? 'bg-red-100 text-red-500' : h.status === 'done' ? 'bg-green-100 text-green-500' : h.status === 'pending' ? 'bg-yellow-100 text-yellow-500' : 'bg-indigo-100 text-indigo-500'}`}>{h.status === 'done' ? '✓' : h.status === 'overdue' ? '!' : '?'}</div><div><div className="font-medium text-gray-800">{h.title}</div><div className="text-sm text-gray-400">Дедлайн: {new Date(h.deadline).toLocaleDateString('ru-RU')}</div></div></div>
                <span className={`text-xs px-2 py-1 rounded-full ${h.status === 'done' ? 'bg-green-100 text-green-600' : h.status === 'overdue' ? 'bg-red-100 text-red-600' : h.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{h.status === 'done' ? 'Сдано' : h.status === 'overdue' ? 'Просрочено' : h.status === 'pending' ? 'На проверке' : 'Новое'}</span>
              </div>
            ))}
          </div>
        )}
        {tab === '⚠️ Дедлайны' && (<div className="glass-card rounded-2xl p-6"><h2 className="text-lg font-semibold text-gray-800">Просроченные дедлайны</h2>{student.debts > 0 ? <div className="bg-red-50 border border-red-200 rounded-xl p-4"><div className="font-medium text-red-800">Тест: Строение клетки</div><div className="text-sm text-red-500">Дедлайн: 15 мая</div></div> : <p className="text-green-600">✅ Все задания сданы вовремя!</p>}</div>)}
        {tab === '💰 Статистика' && (<div className="glass-card rounded-2xl p-6"><h2 className="text-lg font-semibold text-gray-800">Статистика занятий</h2><div className="grid grid-cols-3 gap-4"><div className="text-center p-4 bg-blue-50 rounded-xl"><div className="text-2xl font-bold text-blue-600">{student.lessonsDone}</div><div className="text-sm text-gray-500">Проведено</div></div><div className="text-center p-4 bg-blue-50 rounded-xl"><div className="text-2xl font-bold text-indigo-600">{student.totalLessons}</div><div className="text-sm text-gray-500">Оплачено</div></div><div className="text-center p-4 bg-yellow-50 rounded-xl"><div className="text-2xl font-bold text-yellow-600">{student.totalLessons - student.lessonsDone}</div><div className="text-sm text-gray-500">Осталось</div></div></div></div>)}
      </main>
    </>
  )
}