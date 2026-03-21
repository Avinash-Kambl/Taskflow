import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Layout/Navbar';
import TaskCard from '../Task/TaskCard';
import TaskModal from '../Task/TaskModal';
import MemberModal from './MemberModal';
import './BoardPage.css';

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProject, loadProject } = useProjects();
  const { tasks, loading, loadTasks, addTask, editTask, removeTask, moveTask } = useTasks();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    loadProject(id).catch(() => navigate('/dashboard'));
    loadTasks(id);
  }, [id]);

  const columns = currentProject?.columns || ['Todo', 'In Progress', 'In Review', 'Done'];

  const getColumnTasks = (col) =>
    tasks.filter((t) => t.status === col).sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    await moveTask(draggableId, destination.droppableId, destination.index);
  };

  const openCreateTask = (status) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (data) => {
    if (editingTask) {
      await editTask(editingTask._id, data);
    } else {
      await addTask({ ...data, projectId: id, status: defaultStatus || columns[0] });
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const isAdmin = currentProject?.members?.find(
    (m) => m.user._id === user?._id || m.user === user?._id
  )?.role === 'Admin' || currentProject?.owner?._id === user?._id;

  if (!currentProject) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="board-page">
      <Navbar title={currentProject.name} />

      <div className="board-topbar">
        <div className="board-topbar-left">
          <div className="board-dot" style={{ background: currentProject.color }} />
          <h2 className="board-name">{currentProject.name}</h2>
          <span className="board-task-count">{tasks.length} tasks</span>
        </div>
        <div className="board-topbar-right">
          {isAdmin && (
            <button className="btn btn-ghost btn-sm" onClick={() => setShowMemberModal(true)}>
              👥 Members ({currentProject.members.length})
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => openCreateTask(columns[0])}>
            + Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns">
            {columns.map((col) => {
              const colTasks = getColumnTasks(col);
              return (
                <div key={col} className="board-column">
                  <div className="column-header">
                    <div className="column-header-left">
                      <span className="column-title">{col}</span>
                      <span className="column-count">{colTasks.length}</span>
                    </div>
                    <button className="column-add-btn" onClick={() => openCreateTask(col)} title="Add task">+</button>
                  </div>

                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`column-tasks ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      >
                        {colTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={snap.isDragging ? 'dragging' : ''}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => openEditTask(task)}
                                  onDelete={() => removeTask(task._id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="column-empty">Drop tasks here</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          defaultStatus={defaultStatus}
          columns={columns}
          members={currentProject.members}
          onSave={handleTaskSave}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}

      {showMemberModal && (
        <MemberModal project={currentProject} onClose={() => setShowMemberModal(false)} />
      )}
    </div>
  );
};

export default BoardPage;
