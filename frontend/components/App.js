import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' });

  setAxiosResErr = err => this.setState({ ...this.state, error: err.response.data.message });

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
      .then(res => {
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
        this.resetForm()
      })
      .catch(this.setAxiosResErr)
  }

  todoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.setAxiosResErr)
  }

  nameInputChange = evt => {
    const { value } = evt.target
    this.setState({ ...this.state, todoNameInput: value })
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td
            return res.data.data
          })
        })
      })
      .catch(this.setAxiosResErr)
  }

  toggleDisplayCompleteds = () => {
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }

  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        <div id='error'>{this.state.error}</div>
        <TodoList
          todos={this.state.todos}
          displayCompleteds={this.state.displayCompleteds}
          toggleCompleted={this.toggleCompleted}
        />
        <Form
          todoFormSubmit={this.todoFormSubmit}
          todoNameInput={this.state.todoNameInput}
          nameInputChange={this.nameInputChange}
          toggleDisplayCompleteds={this.toggleCompleted}
          displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
