'use client'

import { useState, useRef } from 'react'

export default function CheckHomework() {
    const [studentAnswer, setStudentAnswer] = useState(
        'Фотосинтез происходит в хлоропластах. Световая фаза идет на мембранах тилакоидов. Темновая фаза происходит в строме хлоропласта. Исходные вещества: вода и углекислый газ. Продукты: глюкоза и кислород.'
    )

    const [comments, setComments] = useState([])
    const [selectedText, setSelectedText] = useState('')
    const [showCommentInput, setShowCommentInput] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 })
    const [hoveredCommentId, setHoveredCommentId] = useState(null)
    const [tooltip, setTooltip] = useState(null)

    const textRef = useRef(null)
    const commentRefs = useRef({})

    const handleTextSelect = () => {
        const selection = window.getSelection()
        const text = selection.toString().trim()

        if (text.length > 0) {
            setSelectedText(text)
            const range = selection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            setSelectionPosition({
                x: rect.left + rect.width / 2,
                y: rect.top - 10
            })
            setShowCommentInput(true)
        }
    }

    const addComment = () => {
        if (!commentText.trim()) return

        setComments([...comments, {
            id: Date.now(),
            text: commentText,
            selectedText: selectedText,
            date: new Date().toLocaleString('ru-RU'),
            resolved: false,
        }])

        setCommentText('')
        setShowCommentInput(false)
        setSelectedText('')
        window.getSelection().removeAllRanges()
    }

    const deleteComment = (id) => {
        setComments(comments.filter(c => c.id !== id))
    }

    const toggleResolved = (id) => {
        setComments(comments.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c))
    }

    const renderHighlightedText = () => {
        let result = studentAnswer

        const sorted = [...comments].sort((a, b) => b.selectedText.length - a.selectedText.length)

        sorted.forEach(c => {
            const escaped = c.selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const isHovered = hoveredCommentId === c.id
            const highlightClass = isHovered
                ? 'bg-fuchsia-300 ring-2 ring-fuchsia-500 scale-110 inline-block shadow-lg rounded px-1'
                : 'bg-yellow-200'

            result = result.replace(
                new RegExp(`(${escaped})`, 'gi'),
                `<mark 
          class="${highlightClass} cursor-pointer transition-all px-0.5 rounded" 
          data-comment-id="${c.id}"
        >$1</mark>`
            )
        })

        return result
    }

    // Обработчики наведения на mark
    const handleMouseOver = (e) => {
        const mark = e.target.closest('mark[data-comment-id]')
        if (mark) {
            const id = Number(mark.dataset.commentId)
            const comment = comments.find(c => c.id === id)
            if (comment) {
                setHoveredCommentId(id)
                const rect = mark.getBoundingClientRect()
                setTooltip({
                    text: comment.text,
                    selectedText: comment.selectedText,
                    x: rect.right + 12,
                    y: rect.top + rect.height / 2
                })
            }
        } else {
            setHoveredCommentId(null)
            setTooltip(null)
        }
    }

    const handleMouseOut = (e) => {
        const mark = e.target.closest('mark[data-comment-id]')
        if (mark) {
            setTimeout(() => {
                setHoveredCommentId(null)
                setTooltip(null)
            }, 100)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-blue-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        📝 Проверка: Развёрнутое задание
                    </h1>
                    <div className="flex gap-3">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                            ✓ Принять
                        </button>
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                            ↻ На доработку
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Текст ответа */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 p-6 relative">
                            <h3 className="font-medium text-gray-800 mb-2">Ответ ученика:</h3>
                            <p className="text-sm text-gray-400 mb-4">Выделите текст, чтобы добавить комментарий</p>

                            <div
                                ref={textRef}
                                onMouseUp={handleTextSelect}
                                onMouseOver={handleMouseOver}
                                onMouseOut={handleMouseOut}
                                className="text-gray-700 leading-relaxed text-lg p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[200px] cursor-text"
                                dangerouslySetInnerHTML={{ __html: renderHighlightedText() }}
                            />

                            {/* Тултип сбоку от текста */}
                            {tooltip && (
                                <div
                                    className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-fuchsia-200 p-4 w-72 pointer-events-none"
                                    style={{
                                        left: `${tooltip.x}px`,
                                        top: `${tooltip.y}px`,
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    {/* Стрелочка влево */}
                                    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />

                                    <div className="text-xs text-fuchsia-500 font-medium mb-2">
                                        💬 Комментарий
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2 italic">
                                        «{tooltip.selectedText}»
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{tooltip.text}</p>
                                </div>
                            )}

                            {/* Всплывающее окно для добавления комментария */}
                            {showCommentInput && (
                                <div
                                    className="fixed z-50 bg-white rounded-xl shadow-lg border border-fuchsia-200 p-4 w-80"
                                    style={{
                                        left: `${selectionPosition.x}px`,
                                        top: `${selectionPosition.y}px`,
                                        transform: 'translate(-50%, -100%)'
                                    }}
                                >
                                    <p className="text-xs text-gray-400 mb-2">
                                        Выделено: «{selectedText.length > 50 ? selectedText.slice(0, 50) + '...' : selectedText}»
                                    </p>
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                                        placeholder="Ваш комментарий..."
                                        rows={3}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setShowCommentInput(false); setCommentText('') }}
                                            className="flex-1 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            onClick={addComment}
                                            className="flex-1 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white py-1.5 rounded-lg text-sm"
                                        >
                                            Добавить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Панель комментариев */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 p-6">
                            <h3 className="font-medium text-gray-800 mb-4">
                                💬 Комментарии ({comments.length})
                            </h3>

                            {comments.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">
                                    Выделите текст в ответе ученика, чтобы добавить комментарий
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {comments.map(c => (
                                        <div
                                            key={c.id}
                                            ref={(el) => { commentRefs.current[c.id] = el }}
                                            className={`p-3 rounded-xl border text-sm transition-all duration-200 ${hoveredCommentId === c.id
                                                    ? 'ring-4 ring-fuchsia-500 shadow-lg scale-[1.03] bg-fuchsia-50 border-fuchsia-400'
                                                    : c.resolved
                                                        ? 'border-green-200 bg-green-50/50'
                                                        : 'border-fuchsia-200 bg-fuchsia-50/50'
                                                }`}
                                            onMouseEnter={() => setHoveredCommentId(c.id)}
                                            onMouseLeave={() => setHoveredCommentId(null)}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <span className="text-xs text-gray-400">{c.date}</span>
                                                <button
                                                    onClick={() => deleteComment(c.id)}
                                                    className="text-red-400 hover:text-red-600 text-xs"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <p className="text-xs text-fuchsia-600 mb-1 italic">
                                                «{c.selectedText.length > 40 ? c.selectedText.slice(0, 40) + '...' : c.selectedText}»
                                            </p>
                                            <p className="text-gray-700">{c.text}</p>
                                            <button
                                                onClick={() => toggleResolved(c.id)}
                                                className={`text-xs mt-2 ${c.resolved ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                                            >
                                                {c.resolved ? '✅ Исправлено' : 'Отметить как исправленное'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}