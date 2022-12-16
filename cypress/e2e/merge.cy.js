describe('json-server-reset', () => {
  const reset = () => {
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: [],
        people: [],
      },
    })
  }
  beforeEach(reset)

  const mergeTodos = (todos = []) => cy.request('POST', '/merge', { todos })

  const getPeople = () => cy.request('/people').its('body')

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

  const addPerson = () =>
    cy.request({
      method: 'POST',
      url: '/people',
      body: {
        name: `A person ${Cypress._.random(1e4)}`,
      },
    })

  it('updates people while keeping todos', () => {
    addTodo()
    getTodos().should('deep.equal', [{ id: 1, title: 'do something' }])
    getPeople().should('deep.equal', [])
    mergeTodos()
    getTodos().should('deep.equal', [])
    getPeople().should('deep.equal', [])
    addPerson()
    getPeople().should('have.length', 1)
    mergeTodos()
    getPeople().should('have.length', 1)
    addTodo()
    getPeople().should('have.length', 1)
    getTodos().should('have.length', 1)
    mergeTodos([
      {
        id: 1,
        title: 'first',
      },
      {
        id: 2,
        title: 'second',
      },
    ])
    getPeople().should('have.length', 1)
    getTodos().should('have.length', 2)
  })
})
