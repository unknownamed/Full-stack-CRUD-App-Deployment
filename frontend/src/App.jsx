import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaCheck } from 'react-icons/fa';

// Use production endpoint if deployed on Vercel, otherwise use local backend
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api/todos' : '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await axios.post(API_URL, { title });
      setTodos([res.data, ...todos]);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-xl w-full border border-white">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center tracking-tight">
          Focus Todos ✨
        </h1>
        
        <form onSubmit={addTodo} className="flex mb-8 space-x-3">
          <input
            type="text"
            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner text-gray-700 text-lg"
            placeholder="새로운 할 일을 입력하세요..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            추가
          </button>
        </form>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center">
              <span className="text-6xl mb-4">📝</span>
              <p className="text-xl text-gray-400 font-medium">아직 할 일이 없습니다.<br/>멋진 하루를 시작해볼까요?</p>
            </div>
          ) : (
            todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ease-in-out group ${
                  todo.completed 
                    ? 'bg-gray-50/50 border-gray-100 scale-95 opacity-75' 
                    : 'bg-white border-purple-100 shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div 
                  className="flex items-center space-x-4 cursor-pointer flex-1 overflow-hidden" 
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                >
                  <button
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      todo.completed 
                        ? 'bg-gradient-to-br from-green-400 to-green-500 border-transparent shadow-md' 
                        : 'border-gray-300 hover:border-purple-500 bg-white'
                    }`}
                  >
                    {todo.completed && <FaCheck className="text-white text-sm" />}
                  </button>
                  <span className={`text-xl truncate transition-all duration-300 ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'
                  }`}>
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                  title="삭제"
                >
                  <FaTrash className="text-lg" />
                </button>
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
