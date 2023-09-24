import { useEffect, useState } from "react";
import "./App.css";
import { ToggleButton } from "./toggleButton";
import { useAutoAnimate } from '@formkit/auto-animate/react'



export default function App() {

  
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  
  /* const [selected, setSelected] = useState(false); */
  const [parent, enableAnimations] = useAutoAnimate({duration: 500})
  const [todo, setTodo] = useState("");
  // boolean state to know if we are editing (this will let us display
  // different inputs based on a condition (conditional rendering)
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  // object state to set so we know which todo item we are editing
  const [currentTodo, setCurrentTodo] = useState({});
  /* const [style, setStyle] = useState("cont"); */

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  // function to get the value of the edit input and set the new state
  function handleEditInputChange(e) {
    // set the new state value to what's currently in the edit input box
    setCurrentTodo({ ...currentTodo, text: e.target.value });
    console.log(currentTodo);
  }
 

  function handleFormSubmit(e) {
    e.preventDefault();
    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: todos.length + 1,
          text: todo.trim(),
          styled: 'todo-list-item',
          selected: false
        }
      ]);
    }

    setTodo("");
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(removeItem);
  }
  // function to edit a todo item
  function handleUpdateTodo(id, updatedTodo) {
    // here we are mapping over the todos array - the idea is check if the todo.id matches the id we pass into the function
    // if the id's match, use the second parameter to pass in the updated todo object
    // otherwise just use old todo
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });
    // set editing to false because this function will be used inside a onSubmit function - which means the data was submited and we are no longer editing
    setIsEditing(false);
    // update the todos state with the updated todo
    setTodos(updatedItem);
  }
  function handleClearAll(todos) {
    // clear all items
    // empty the todos array
    todos = []
    // call setTodos to apply that to the whole script
    setTodos(todos)
  }
  // function to handle when the "Edit" button is clicked
  function handleEditClick(todo) {
    // set editing to true
    setIsEditing(true);
    // set the currentTodo to the todo item that was clicked
    setCurrentTodo({ ...todo });
  }
  function handleCompletedClick(todo) {
    // set editing to true
    if (todo.selected===false){
    console.log('Goto True')
    console.log(todo.selected)    
    todo.styled = "todo-completed-item"
    todo.selected = true
    console.log(todo.styled)}
    else {     
        console.log('Goto False')
        console.log(todo)        
        todo.styled = "todo-list-item"
        todo.selected = false
        console.log(todo.styled)}    
    // set the currentTodo to the todo item that was clicked 
        setCurrentTodo({ ...todo })
        console.log(isCompleted)
        return(todo)
  }

  return (
    <div className="App">
      {/* We need to conditionally render different inputs based on if we are in editing mode */}
      {isEditing ? (
        // if we are editing - display the edit todo input
        // make sure to add the handleEditFormSubmit function in the "onSubmit" prop
        <form onSubmit={handleEditFormSubmit}>
          {/* we've added an h2 element */}
          <h2>Edit Todo</h2>
          {/* also added a label for the input */}
          <label className="textbox" htmlFor="editTodo">Edit todo: </label>
          {/* notice that the value for the update input is set to the currentTodo state */}
          {/* also notice the handleEditInputChange is being used */}
          <input            
            name="editTodo"
            type="text"
            className="textbox"
            placeholder="Edit todo"
            value={currentTodo.text}
            onChange={handleEditInputChange}
          />
          {/* here we added an "update" button element - use the type="submit" on the button which will still submit the form when clicked using the handleEditFormSubmit function */}
          <button className="buttons" type="submit">Update</button>
          {/* here we added a "Cancel" button to set isEditing state back to false which will cancel editing mode */}
          <button className="buttons" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        // if we are not editing - display the add todo input
        // make sure to add the handleFormSubmit function in the "onSubmit" prop
        <form onSubmit={handleFormSubmit}>
          {/* we've added an h2 element */}
          <h2>Add Todo</h2>
          {/* also added a label for the input */}
          <label className="textbox" htmlFor="todo">Add todo: </label>
          
          <input
            name="todo"
            type="text"
            className="textbox"
            placeholder="Create a new todo"
            value={todo}
            onChange={handleInputChange}
          />
          {/* here we just added a "Add" button element - use the type="submit" on the button which will still submit the form when clicked using the handleFormSubmit function */}
          <button class="buttons" type="submit">Add</button>
          
        </form>
        
      )}
   
      <ul ref={parent}>
        {todos.map((todo) => (
          
          
            <li key={todo.id} className={todo.styled}>
            {`${todo.text}`}
            
              {/* we are passing the entire todo object to the handleEditClick function*/}
              <button className="buttons" onClick={() => handleEditClick(todo)}>Edit</button>
              <button className="buttons" onClick={() => handleDeleteClick(todo.id)}>Delete</button>
              <div className="todo-toggle">
                <ToggleButton
                selected={todo.selected}
                toggleSelected={() => {
                handleCompletedClick(todo);}}/></div></li>
          
        ))}
      </ul>
     
      <div><button class="buttons" onClick={() => handleClearAll(todos)}>ClearAll</button></div>
      
    </div>
 );

}
