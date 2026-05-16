'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../calendar.css'

export default function StudentDashboard() {
  const [student] = useState({
    id: 1,
    name: 'Саша Иванов',
    progress: 65,
    debts: 2,
    lessonsDone: 8,
    totalLessons: 12,
    paid: true,
  })

  const [activeTab, setActiveTab] = useState('📅 Расписание')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [lessons] = useState([
    { id: 1, date: '2026-05-20', time: '16:00', topic: 'Клеточное строение' },
    { id: 2, date: '2026-05-22', time: '17:00', topic: 'Фотосинтез' },
    { id: 3, date: '2026-05-25', time: '15:00', topic: 'Генетика' },
    { id: 4, date: '2026-05-27', time: '16:00', topic: 'Эволюция' },
  ])

  const [homeworks] = useState([
    { id: 1, title: 'Тест: Строение клетки', deadline: '2026-05-20', status: 'done', score: '8/10' },
    { id: 2, title: 'Развернутое: Фотосинтез', deadline: '2026-05-22', status: 'pending', score: null },
    { id: 3, title: 'Тест: Генетика', deadline: '2026-05-18', status: 'overdue', score: null },
    { id: 4, title: 'Работа над ошибками', deadline: '2026-05-25', status: 'new', score: null },
  ])

  const [profile, setProfile] = useState({
    firstName: 'Саша',
    lastName: 'Иванов',
    birthDate: '2008-05-15',
    phone: '+7 (999) 123-45-67',
    avatar: null,
  })

  const [showProfile, setShowProfile] = useState(false)
  const lessonsOnDate = lessons.filter((l) => l.date === selectedDate.toISOString().split('T')[0])

  const tabs = [
    { id: '📅 Расписание', label: 'Расписание', icon: '/календарь.png' },
    { id: '📚 Материалы', label: 'Материалы', icon: '/материалы.png' },
    { id: '📝 Домашки', label: 'Домашки', icon: '/дз.png' },
    { id: '📊 Прогресс', label: 'Прогресс', icon: '/прогресс.png' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="glass-header border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Привет, {profile.firstName}!
          </h1>
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
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-indigo-600 border border-gray-200'}`}>
              <img src={tab.icon} alt="" width={24} height={24} className="w-6 h-6" />{tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {activeTab === '📅 Расписание' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Моё расписание</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-4">
                <Calendar onChange={(date) => setSelectedDate(date as Date)} value={selectedDate} tileClassName={({ date }) => { const d = date.toISOString().split('T')[0]; return lessons.some((l) => l.date === d) ? 'has-lesson' : '' }} />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-medium text-gray-800 mb-4">Занятия на {selectedDate.toLocaleDateString('ru-RU')}</h3>
                {lessonsOnDate.length === 0 ? <div className="text-center py-8"><p className="text-gray-400 text-sm">Нет занятий</p></div> : (
                  <div className="space-y-3">
                    {lessonsOnDate.map((l) => (
                      <div key={l.id} className="bg-blue-50 border border-indigo-200 rounded-xl p-4">
                        <div className="font-medium text-gray-800">{l.topic}</div>
                        <div className="text-sm text-gray-500 mb-3">{l.time}</div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition">▶ Войти в класс</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === '📚 Материалы' && <StudentMaterials />}

        {activeTab === '📝 Домашки' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Мои задания</h2>
            <div className="grid gap-3">
              {homeworks.map((h) => (
                <div key={h.id} className={`bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition ${h.status === 'overdue' ? 'border-red-300 bg-red-50/50' : h.status === 'done' ? 'border-green-300 bg-green-50/50' : h.status === 'pending' ? 'border-yellow-300 bg-yellow-50/50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${h.status === 'overdue' ? 'bg-red-100 text-red-500' : h.status === 'done' ? 'bg-green-100 text-green-500' : h.status === 'pending' ? 'bg-yellow-100 text-yellow-500' : 'bg-indigo-100 text-indigo-500'}`}>{h.status === 'done' ? '✓' : h.status === 'overdue' ? '!' : '?'}</div>
                      <div>
                        <div className="font-medium text-gray-800">{h.title}</div>
                        <div className="text-sm text-gray-400">Дедлайн: {new Date(h.deadline).toLocaleDateString('ru-RU')}{h.score && ' • Оценка: ' + h.score}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(h.status === 'new' || h.status === 'overdue') && <button onClick={() => window.open('/student/take-test', '_blank')} className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition">Пройти тест</button>}
                      <span className={`text-xs px-2 py-1 rounded-full ${h.status === 'done' ? 'bg-green-100 text-green-600' : h.status === 'overdue' ? 'bg-red-100 text-red-600' : h.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{h.status === 'done' ? 'Сдано' : h.status === 'overdue' ? 'Просрочено' : h.status === 'pending' ? 'На проверке' : 'Новое'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '📊 Прогресс' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Мой прогресс</h2>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4"><span className="text-gray-600">Общий прогресс</span><span className="text-2xl font-bold text-indigo-600">{student.progress}%</span></div>
              <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-indigo-600 to-blue-700 h-3 rounded-full transition-all" style={{ width: `${student.progress}%` }} /></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: 'Уроков пройдено', val: student.lessonsDone, color: 'text-blue-600' }, { label: 'ДЗ сдано', val: homeworks.filter(h => h.status === 'done').length, color: 'text-green-600' }, { label: 'ДЗ в работе', val: homeworks.filter(h => h.status === 'pending' || h.status === 'new').length, color: 'text-yellow-600' }, { label: 'Просрочено', val: student.debts, color: 'text-red-600' }].map((s, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 text-center"><div className={`text-2xl font-bold ${s.color}`}>{s.val}</div><div className="text-sm text-gray-500">{s.label}</div></div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-medium text-gray-800 mb-4">Темы</h3>
              <div className="space-y-3">
                {[{ name: 'Клеточное строение', level: 85, color: 'green' }, { name: 'Фотосинтез', level: 60, color: 'yellow' }, { name: 'Генетика', level: 35, color: 'red' }, { name: 'Эволюция', level: 20, color: 'red' }, { name: 'Митоз и мейоз', level: 70, color: 'green' }].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${t.color === 'green' ? 'bg-green-400' : t.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                    <span className="text-gray-700 flex-1">{t.name}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${t.color === 'green' ? 'bg-green-400' : t.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${t.level}%` }} /></div>
                    <span className="text-sm text-gray-500 w-10 text-right">{t.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowProfile(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Профиль</h3><button onClick={() => setShowProfile(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button></div>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3 overflow-hidden">{profile.avatar ? <img src={profile.avatar} alt="Аватар" className="w-full h-full object-cover" /> : <span className="text-4xl text-gray-400">👤</span>}</div>
                <label className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-indigo-200 transition">Загрузить фото<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setProfile({ ...profile, avatar: ev.target?.result as string }); reader.readAsDataURL(file); } }}/></label>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-500 mb-1">Имя</label><input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Фамилия</label><input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Дата рождения</label><input type="date" value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Номер телефона</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" /></div>
                <button onClick={() => setShowProfile(false)} className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-3 rounded-xl font-medium">Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StudentMaterials() {
  const [selectedSection, setSelectedSection] = useState('Общая биология')
  const sections = ['Общая биология', 'Генетика', 'Анатомия', 'Ботаника', 'Зоология', 'Эволюция', 'Экология']
  const allMaterials = [
    { id: 1, title: 'Конспект: Строение клетки', type: 'pdf', date: '15.05.2026', section: 'Общая биология' },
    { id: 2, title: 'Презентация: Фотосинтез', type: 'pdf', date: '14.05.2026', section: 'Ботаника' },
    { id: 3, title: 'Видео: Митоз и мейоз', type: 'video', date: '10.05.2026', section: 'Общая биология' },
    { id: 4, title: 'Конспект: Генетика', type: 'pdf', date: '12.05.2026', section: 'Генетика' },
  ]
  const sectionFiles = allMaterials.filter(m => m.section === selectedSection)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Мои материалы</h2>
      <div className="flex gap-2 flex-wrap">
        {sections.map(section => (
          <button key={section} onClick={() => setSelectedSection(section)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSection === section ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'}`}>{section}</button>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-medium text-gray-800 mb-4">📁 {selectedSection}</h3>
        {sectionFiles.length === 0 ? <p className="text-gray-400 text-center py-8">Нет материалов в этом разделе</p> : (
          <div className="grid gap-3">
            {sectionFiles.map((file) => (
              <div key={file.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${file.type === 'pdf' ? 'bg-red-400' : 'bg-blue-400'}`}>{file.type === 'pdf' ? 'PDF' : '▶'}</div>
                  <div><div className="font-medium text-gray-800">{file.title}</div><div className="text-sm text-gray-400">{file.date}</div></div>
                </div>
                <button className="text-indigo-500 hover:text-indigo-600 text-sm font-medium">Скачать</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}