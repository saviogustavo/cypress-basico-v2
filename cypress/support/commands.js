Cypress.Commands.add('fillMandatoryFieldsAndSubmit', ()=> {
    cy.get('#firstName').type('Sávio')
    cy.get('#lastName').type('Borges')
    cy.get('#email').type('saviosgnb55@hotmail.com') 
    cy.get('#open-text-area').type('text')  

    //cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
})
