import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTaskStore from '../store/taskStore';
import useProjectStore from '../store/projectStore';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

// Define the columns based on your TaskStatus enum in Prisma
const columnsConfig = [
  { id: 'TO_DO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

export default function ProjectKanban() {
  const { projectId } = useParams();
  const location = useLocation();
  const { tasks, fetchTasks, updateTaskStatus, loading } = useTaskStore();
  const { projects } = useProjectStore();
  const [showModal, setShowModal] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState('TO_DO'); // Default column for new tasks

  const project = projects.find(p => p.id === Number(projectId));

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  // Memoize grouped tasks to prevent recalculation on every render
  const groupedTasks = React.useMemo(() => {
    return columnsConfig.reduce((acc, col) => {
        acc[col.id] = tasks.filter(t => t.status === col.id);
        return acc;
      }, {});
  }, [tasks]);


  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    const taskId = Number(draggableId);
    const newStatus = destination.droppableId; // This is 'TO_DO', 'IN_PROGRESS', or 'DONE'
    
    // --- Optimistic UI Update ---
    // 1. Find the moved task
    const movedTask = tasks.find(t => t.id === taskId);
    if (!movedTask) return;

    // 2. Create a new tasks array with the updated status
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    // 3. Update the Zustand store immediately
    useTaskStore.setState({ tasks: newTasks });
    // --- End Optimistic UI Update ---

    // Call API to persist the change (handle potential errors)
    try {
        await updateTaskStatus(taskId, newStatus);
        // If successful, the state is already updated optimistically.
    } catch (error) {
        console.error("Failed to update task status:", error);
        // Revert the optimistic update if the API call fails
        useTaskStore.setState({ tasks }); // Revert to original tasks array
        alert("Failed to move task. Please try again."); // Simple error feedback
    }
  };

  const openAddTaskModal = (columnId) => {
    setAddingToColumn(columnId); // Set which column triggered the add
    setShowModal(true);
  };

  return (
    <div className="relative space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white drop-shadow-lg">
            {project?.name || 'Loading Project...'}
          </h1>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-300">
            Kanban View
          </p>
        </div>
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-white/10 dark:bg-gray-800/50 rounded-lg border border-white/10 dark:border-gray-700 backdrop-blur-sm">
           <Link 
            to={`/projects/${projectId}/overview`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/overview') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`}
          >
            Overview
          </Link>
          <Link 
            to={`/projects/${projectId}/kanban`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/kanban') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`}
          >
            Kanban
          </Link>
          <Link 
            to={`/projects/${projectId}/gantt`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/gantt') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`}
          >
            Gantt
          </Link>
        </nav>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columnsConfig.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps} 
                  // Subtle glass effect for columns
                  className={`bg-white/5 dark:bg-gray-900/30 rounded-xl p-4 min-h-[400px] border border-white/10 dark:border-gray-700/50 backdrop-blur-sm transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-500/10 dark:bg-blue-900/30' : ''}`}
                >
                  {/* Column Header */}
                  <h3 className="text-lg font-semibold mb-4 text-black dark:text-gray-100 flex justify-between items-center">
                    {col.title} 
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-white/10 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                      {groupedTasks[col.id]?.length || 0}
                    </span>
                  </h3>
                  
                  {/* Task Cards Area */}
                  <div className="space-y-3 min-h-[300px]"> {/* Ensure droppable area has height */}
                     {loading && groupedTasks[col.id]?.length === 0 ? (
                       <p className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
                     ) : groupedTasks[col.id]?.length === 0 ? (
                       <div className="text-center text-sm text-gray-400 dark:text-gray-500 pt-10">No tasks here</div>
                     ) : (
                        groupedTasks[col.id].map((task, idx) => (
                            <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
                            {(prov, snap) => (
                                <div 
                                ref={prov.innerRef} 
                                {...prov.draggableProps} 
                                {...prov.dragHandleProps}
                                style={{...prov.draggableProps.style}} // Important for positioning
                                className={`${snap.isDragging ? 'shadow-xl scale-105' : 'shadow-md'} transition-transform duration-150 ease-in-out`}
                                >
                                <TaskCard task={task} />
                                </div>
                            )}
                            </Draggable>
                        ))
                     )}
                    {provided.placeholder} {/* Essential for @hello-pangea/dnd */}
                  </div>

                  {/* Add Task Button */}
                  <button 
                    onClick={() => openAddTaskModal(col.id)} 
                    className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 w-full text-center p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-gray-200 transition"
                  >
                    <Plus size={16} /> Add task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      {/* Add Task Modal */}
      <AnimatePresence>
        {showModal && 
            <AddTaskModal 
                onClose={()=>setShowModal(false)} 
                projectId={projectId} 
                initialStatus={addingToColumn} // Pass the column status to the modal
            />
        }
      </AnimatePresence>
    </div>
  );
}

// Ensure React is imported if not already globally available or in setup
import React from 'react'; 

