'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function TestPage() {
  const [date, setDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Тест календаря</h1>
      
      <Calendar onChange={setDate} value={date} />
      
      <p>Выбрано: {date.toLocaleDateString('ru-RU')}</p>

      <br />
      
      <button 
        onClick={() => setShowForm(true)}
        style={{
          background: 'linear-gradient(to right, #d946ef, #3b82f6)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 12,
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        + Добавить урок
      </button>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 16,
            width: 400
          }}>
            <h2>Новый урок</h2>
            <p>Дата: {date.toLocaleDateString('ru-RU')}</p>
            <input type="time" defaultValue="16:00" style={{ width: '100%', padding: 8, margin: '10px 0', borderRadius: 8, border: '1px solid #ccc' }} />
            <input type="text" placeholder="Тема урока" style={{ width: '100%', padding: 8, margin: '10px 0', borderRadius: 8, border: '1px solid #ccc' }} />
            <br />
            <button onClick={() => setShowForm(false)} style={{ marginRight: 10, padding: '8px 20px', borderRadius: 8, border: '1px solid #ccc', background: '#f3f4f6' }}>Отмена</button>
            <button onClick={() => { alert('Урок добавлен!'); setShowForm(false); }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#8b5cf6', color: 'white' }}>Добавить</button>
          </div>
        </div>
      )}
    </div>
  )
}