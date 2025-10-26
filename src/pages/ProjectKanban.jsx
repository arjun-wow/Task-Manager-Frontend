import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTaskStore from '../store/taskStore';
import useProjectStore from '../store/projectStore';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { useState } from 'react';
import { AnimatePresence } from "framer-motion"; // <-- 1. IMPORTED

// Match the columns in your design
const columnsConfig = [
  { id: 'TO_DO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

export default function ProjectKanban() {
  const { projectId } = useParams();
  const { tasks, fetchTasks, updateTaskStatus } = useTaskStore();
  const { projects } = useProjectStore();
  const [showModal, setShowModal] = useState(false);
  
  const project = projects.find(p => p.id === Number(projectId));

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const grouped = columnsConfig.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    const taskId = Number(result.draggableId);
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const movedTask = tasks.find(t => t.id === taskId);
    if (!movedTask) return;

    useTaskStore.setState(state => {
      const otherTasks = state.tasks.filter(t => t.id !== taskId);
      return { tasks: [...otherTasks, { ...movedTask, status: newStatus }] };
    });
    
    // Call API
    await updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project?.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Kanban view</p>
        </div>
        <nav className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Link to={`/projects/${projectId}/overview`} className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 text-sm font-medium">Overview</Link>
          <Link to={`/projects/${projectId}/kanban`} className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 shadow text-sm font-medium">Kanban</Link>
          <Link to={`/projects/${projectId}/gantt`} className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 text-sm font-medium">Gantt</Link>
        </nav>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {columnsConfig.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps} 
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 min-h-[300px]"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{col.title} <span className="text-sm text-gray-400">{grouped[col.id]?.length || 0}</span></h3>
                  <div className="space-y-3">
                    {grouped[col.id] && grouped[col.id].map((task, idx) => (
                      <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  <button onClick={() => setShowModal(true)} className="mt-4 text-sm font-medium text-primary w-full text-left p-2 rounded-lg hover:bg-primary/10">
                    + Add task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      {/* 2. WRAP MODAL IN ANIMATEPRESENCE */}
      <AnimatePresence>
        {showModal && <AddTaskModal onClose={()=>setShowModal(false)} projectId={projectId} />}
      </AnimatePresence>
    </div>
  );
}