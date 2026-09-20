import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';

export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  dueDate?: string;
  priority?: Priority;
  completed: boolean;
  createdAt: string;
};

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
};

type Action =
  | { type: 'hydrate'; todos: Todo[] }
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string };

function reducer(state: TodoState, action: Action): TodoState {
  switch (action.type) {
    case 'hydrate':
      return { todos: action.todos, isLoading: false };
    case 'add':
      return { ...state, todos: [action.todo, ...state.todos] };
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      };
    case 'delete':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

type TodoContextValue = {
  todos: Todo[];
  isLoading: boolean;
  addTodo: (title: string, opts?: { dueDate?: string; priority?: Priority }) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

type TodoProviderProps = {
  children: ReactNode;
  /** Called whenever a todo transitions from incomplete to complete. */
  onComplete?: () => void;
};

export function TodoProvider({ children, onComplete }: TodoProviderProps) {
  const [state, dispatch] = useReducer(reducer, { todos: [], isLoading: true });

  useEffect(() => {
    loadJSON<Todo[]>(STORAGE_KEYS.todos, []).then((todos) => dispatch({ type: 'hydrate', todos }));
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveJSON(STORAGE_KEYS.todos, state.todos);
    }
  }, [state.todos, state.isLoading]);

  const addTodo: TodoContextValue['addTodo'] = (title, opts) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({
      type: 'add',
      todo: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: trimmed,
        dueDate: opts?.dueDate,
        priority: opts?.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
  };

  const toggleTodo = (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    dispatch({ type: 'toggle', id });
    if (todo && !todo.completed) {
      onComplete?.();
    }
  };

  const deleteTodo = (id: string) => dispatch({ type: 'delete', id });

  return (
    <TodoContext.Provider
      value={{ todos: state.todos, isLoading: state.isLoading, addTodo, toggleTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within a TodoProvider');
  return ctx;
}
