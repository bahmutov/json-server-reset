/* eslint-env mocha */
/* global cy */
describe('json-server-reset', () => {
  const reset = () => {
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: []
      }
    })
  }
  beforeEach(reset)

  const getTodos = () => cy.request('/todos').its('body')

  const addTodo = () =>
    cy.request({
      method: 'POST',
      url: '/todos',
      body: {
        id: 1,
        title: 'do something'
      }
    })

  it('starts with empty list of todos', () => {
    getTodos().should('deep.equal', [])
  })

  it('can add a todo', () => {
    addTodo()
    getTodos().should('deep.equal', [{ id: 1, title: 'do something' }])
  })

  it('can reset todos', () => {
    addTodo()
    reset()
    getTodos().should('deep.equal', [])
  })
})
