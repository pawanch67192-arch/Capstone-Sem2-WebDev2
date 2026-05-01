import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useApp } from '../../context/AppContext'
import { XP_VALUES, isOverdue, formatDueDate } from '../../utils/gameLogic'
import { Plus, CheckCircle, Trash2, Edit3, GripVertical, X, Calendar, Flag } from 'lucide-react'
import clsx from 'clsx'

const PRIORITY_OPTIONS = [
  { value: 'easy',   label: 'Easy',   xp: 10, color: 'priority-easy' },
  { value: 'medium', label: 'Medium', xp: 20, color: 'priority-medium' },
  { value: 'hard',   label: 'Hard',   xp: 50, color: 'priority-hard' },
]

function TaskForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', description: '', priority: 'medium', dueDate: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="card border-quest-500/30 space-y-4">
      <h3 className="font-display font-bold text-white">{initial ? 'Edit Task' : 'New Quest'}</h3>
      <input className="input" placeholder="Task title..." value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
      <textarea className="input resize-none h-20" placeholder="Description (optional)..." value={form.description} onChange={e => set('description', e.target.value)} />
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 font-display uppercase tracking-wide mb-1 block">Priority</label>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(p => (
              <button key={p.value} type="button"
                onClick={() => set('priority', p.value)}
                className={clsx('flex-1 py-2 rounded-lg border text-xs font-display font-bold transition-all', p.color,
                  form.priority === p.value ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-70')}>
                {p.label} +{p.xp}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 font-display uppercase tracking-wide mb-1 block">Due Date</label>
          <input type="date" className="input w-40" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button onClick={() => form.title.trim() && onSave(form)} className="btn-primary">
          {initial ? '✓ Save Changes' : '+ Add Quest'}
        </button>
      </div>
    </div>
  )
}

function TaskCard({ task, index, onComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task.dueDate)
  const dueLabel = formatDueDate(task.dueDate)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}
          className={clsx('card-glow group transition-all', snapshot.isDragging && 'rotate-1 scale-[1.02] shadow-2xl shadow-quest-500/20')}>
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <div {...provided.dragHandleProps} className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing mt-0.5 flex-shrink-0">
              <GripVertical size={18} />
            </div>

            {/* Complete Button */}
            <button onClick={(e) => onComplete(task.id, e)}
              className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-600 hover:border-quest-500 hover:bg-quest-500/20 transition-all mt-0.5 flex items-center justify-center group/btn">
              <CheckCircle size={14} className="text-quest-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white font-semibold text-sm leading-tight">{task.title}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {task.description && <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{task.description}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full border', `priority-${task.priority}`)}>
                  {task.priority} +{XP_VALUES[task.priority]} XP
                </span>
                {dueLabel && (
                  <span className={clsx('flex items-center gap-1 text-xs', overdue ? 'text-red-400' : 'text-gray-500')}>
                    <Calendar size={11} />
                    {dueLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default function TasksPage() {
  const { state, actions } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filter, setFilter] = useState('all') // all | easy | medium | hard

  const filtered = filter === 'all' ? state.tasks : state.tasks.filter(t => t.priority === filter)

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(state.tasks)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    actions.reorderTasks(items)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Quest Log</h2>
          <p className="text-gray-400 text-sm">{state.tasks.length} active tasks</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditTask(null) }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Quest
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'easy', 'medium', 'hard'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('px-4 py-1.5 rounded-full text-sm font-display font-semibold capitalize transition-all',
              filter === f ? 'bg-quest-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white')}>
            {f === 'all' ? 'All Tasks' : f}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && !editTask && (
        <TaskForm onSave={(data) => { actions.addTask(data); setShowForm(false) }} onCancel={() => setShowForm(false)} />
      )}

      {/* Edit form */}
      {editTask && (
        <TaskForm initial={editTask}
          onSave={(data) => { actions.updateTask({ ...editTask, ...data }); setEditTask(null) }}
          onCancel={() => setEditTask(null)} />
      )}

      {/* Tasks */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="font-display text-xl text-gray-400">No quests found</p>
          <p className="text-gray-600 text-sm mt-1">Add a new task to begin your adventure!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {filtered.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i}
                    onComplete={(id, e) => actions.completeTask(id, e)}
                    onEdit={(t) => { setEditTask(t); setShowForm(false) }}
                    onDelete={actions.deleteTask} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Completed count */}
      {state.completedTasks.length > 0 && (
        <p className="text-center text-gray-600 text-sm">
          ✓ {state.completedTasks.length} tasks completed all time
        </p>
      )}
    </div>
  )
}
