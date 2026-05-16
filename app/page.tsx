'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../lib/supabase'
import React, { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) { alert('Нужно согласие на обработку данных'); return }
    setError('')
    
    console.log('Отправляю:', { email, password, role })
    
    const { data, error: loginError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('role', role)
      .single()

    console.log('Ответ:', { data, loginError })

    if (loginError || !data) {
      setError('Неверный email, пароль или роль')
      return
    }

    if (role === 'teacher') router.push('/teacher')
    else router.push('/student')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-sky-100 flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md p-2">
            <Image src="/logo.png" alt="Твои 100 баллов" width={64} height={64} className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Твои 100 баллов</h1>
          <p className="text-gray-400 text-sm mt-1">Биология с душой и результатом</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-600 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition bg-white/50" placeholder="ваш@email.ru" required /></div>
          <div><label className="block text-sm font-medium text-gray-600 mb-1">Пароль</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition bg-white/50" placeholder="••••••••" required /></div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setRole('student')} className={`p-4 rounded-xl border-2 transition-all text-center ${role === 'student' ? 'border-indigo-400 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white/50 hover:border-indigo-200'}`}>
              <Image src="/ученик.png" alt="Ученик" width={40} height={40} className="mx-auto mb-1" />
              <div className={`text-sm font-medium ${role === 'student' ? 'text-indigo-600' : 'text-gray-500'}`}>Ученик</div>
            </button>
            <button type="button" onClick={() => setRole('teacher')} className={`p-4 rounded-xl border-2 transition-all text-center ${role === 'teacher' ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-200 bg-white/50 hover:border-blue-200'}`}>
              <Image src="/учитель.png" alt="Учитель" width={40} height={40} className="mx-auto mb-1" />
              <div className={`text-sm font-medium ${role === 'teacher' ? 'text-blue-600' : 'text-gray-500'}`}>Учитель</div>
            </button>
          </div>

          <label className="flex items-start gap-2 cursor-pointer"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-4 h-4 text-indigo-500" /><span className="text-xs text-gray-500">Я согласен(на) на обработку персональных данных и принимаю условия политики конфиденциальности</span></label>

          <button type="submit" disabled={!agree} className={`w-full py-3 rounded-xl font-medium shadow-lg transition ${agree ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-indigo-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Войти</button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">Нет аккаунта? Обратитесь к учителю</p>
      </div>
    </div>
  )
}