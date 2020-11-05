import './App.css';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const TodoListContext = createContext();

const Control = (props) => {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = () => {
    const newText = inputRef.current.value.trim();
    addTodo({
      id: Date.now(),
      text: newText,
      complete: false
    });
    inputRef.current.value = "";
  }


  return (
    <div className="control">
      <h1>todos</h1>
      <input
        type="text"
        ref={inputRef}
        className="new-todo"
        placeholder="what needs to be done?"
      />
      <button className="new-todo__button" onClick={onSubmit}>添加</button>
    </div>
  );
}
const Todos = (props) => {
  let todos = useContext(TodoListContext);
  const { removeTodo, toggleTodo } = props
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
          />
        );
      })}
    </ul>
  );
}

const TodoItem = (props) => {
  const {
    todo: { id, text, complete },
    removeTodo,
    toggleTodo,
  } = props;
  const onChange = () => {
    toggleTodo(id);
  }
  const onRemove = () => {
    removeTodo(id)
  }
  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label className={complete ? "complete" : ""}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  );
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const addTodo = useCallback((todo) => {
    setTodos(todos => [...todos, todo])
  }, [])
  const removeTodo = useCallback((id) => {
    setTodos((todos) =>
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  }, [])
  const toggleTodo = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) => {
        return todo.id === id ? {...todo, complete: !todo.complete} : todo
      })
    );
  }, [])

  // 项目启动一次
  useEffect(() => {
    if (localStorage.getItem("_$-todos_")) {
      const todos = JSON.parse(localStorage.getItem("_$-todos_"));
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("_$-todos_", JSON.stringify(todos));
  }, [todos]);


  return (
    <div className="todo-list">
      <TodoListContext.Provider value={todos}>
        <Control addTodo={addTodo} />
        <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} />
      </TodoListContext.Provider>
    </div>
  );
}


export default TodoList;;
