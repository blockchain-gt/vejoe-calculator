/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import Select from './Select'
import Title from './Title'
import SelectToken from './SelectToken'
import DisplayBox from './DisplayBox'
import InlineBox from './InlineBox'
import ResultsDisplay from './ResultsDisplay'
function Calc() {
    // const [todos, setTodos] = useState([])
    // const addTodo = todo => {
    //     if(!todo.text || /^\s*$/.test(todo.text)) {
    //         return
    //     }

    //     const newTodos = [todo,...todos];

    //     setTodos(newTodos)
    // }
    // const completeTodo = id => {
    //   let updatedTodos = todos.map(todo => {
    //     if (todo.id === id) {
    //       todo.isComplete = !todo.isComplete
    //     }
    //     return todo;
    //   })
    //   setTodos(updatedTodos)
    // }
    // const removeTodo = id => {
    //   const removeArr = [...todos].filter(todo => todo.id !== id);
    //   setTodos(removeArr);
    // }
    // const updateTodo = (todoId, newValue) => {
    //   if(!newValue.text || /^\s*$/.test(newValue.text)) {
    //     return
    //   }
    //   setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)))
    // }
  return (
    <div>
        <Title />
        <SelectToken id="sToken"/>
        <DisplayBox text={"Pool Liquidity"}/>
        <InlineBox title={"Pool Share"}/>
        <ResultsDisplay />
        {/* <TodoForm onSubmit={addTodo} />
        <Todo 
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}/> */}
    </div>
  )
}

export default Calc