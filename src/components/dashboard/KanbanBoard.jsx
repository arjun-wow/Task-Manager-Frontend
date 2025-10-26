import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTaskStore from "../../store/taskStore";
import TaskCard from "../TaskCard";
import { useEffect } from "react";

const columns = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export default function KanbanBoard() {
  const { tasks, fetchTasks, toggleTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const grouped = columns.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const movedTask = grouped[source.droppableId][source.index];
    const newStatus = destination.droppableId;

    await toggleTask(movedTask.id, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-h-[500px] flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-3 text-primary">
                  {col.replace("_", " ")}
                </h2>
                <div className="flex-1 space-y-3">
                  {grouped[col].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
