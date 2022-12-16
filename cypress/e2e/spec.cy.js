/* eslint-env mocha */
/* global cy */
describe('json-server-reset', () => {
  const reset = () => {
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: [],
      },
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
        title: 'do something',
      },
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

  it('immediately saves DB file', () => {
    cy.readFile('cypress/fixtures/data.json').should('deep.equal', {
      todos: [],
    })
    addTodo()
    cy.readFile('cypress/fixtures/data.json').should('deep.equal', {
      todos: [{ id: 1, title: 'do something' }],
    })
    reset()
    cy.readFile('cypress/fixtures/data.json').should('deep.equal', {
      todos: [],
    })
  })

  context('invalid input', () => {
    it('warns when resetting with non-existing keys', () => {
      cy.request('POST', '/reset', { todos: [] })
      cy.request('POST', '/reset', { people: [] })
    })

    it('rejects resetting with an empty object', () => {
      cy.request({
        method: 'POST',
        url: '/reset',
        body: {},
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', 400)
    })

    it('rejects resetting without an object', () => {
      cy.request({
        method: 'POST',
        url: '/reset',
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', 400)
    })

    it('rejects resetting with an array', () => {
      cy.request({
        method: 'POST',
        url: '/reset',
        body: [],
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', 400)
    })
  })
})
