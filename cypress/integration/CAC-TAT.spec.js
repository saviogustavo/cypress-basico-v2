/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

    beforeEach(() =>{
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', ()=> {
        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', ()=> {
        const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

        cy.get('#firstName').type('Sávio') //.should('have.value', 'Sávio')  {{ Os should comentados servem para verificar se os valores são iguais aos esperados }}
        cy.get('#lastName').type('Borges') //.should('have.value', 'Borges')
        cy.get('#email').type('saviosgnb55@hotmail.com') //.should('have.value', 'saviosgnb55@hotmail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})  // {{O delay serve pra abreviar o tempo que levaria pra digitar todo o texto da variável}}

        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', ()=>{
        cy.get('#firstName').type('Sávio')
        cy.get('#lastName').type('Borges')
        cy.get('#email').type('saviosgnb55hotmail.com')

        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', ()=>{
        cy.get('#phone')
            .type('abcdefghijklmnopqrstuvxz')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', ()=>{
        cy.get('#firstName').type('Sávio')
        cy.get('#lastName').type('Borges') 
        cy.get('#email').type('saviosgnb55@hotmail.com') 
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Text')
        
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', ()=> {
        cy.get('#firstName')
            .type('Sávio')
            .should('have.value', 'Sávio')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Borges')
            .should('have.value', 'Borges')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('saviosgnb55@hotmail.com')
            .should('have.value', 'saviosgnb55@hotmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('996000472')
            .should('have.value', '996000472')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', ()=> {
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error')
            .should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', ()=> {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', ()=> {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', ()=> {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', ()=> {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', ()=> {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', ()=> {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(($radio)=>{
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', ()=> {
        cy.get('#check input[type="checkbox"]')
        .as('checkboxes')
        .check()
        .should('be.checked')

        cy.get('@checkboxes').last().uncheck()
    })

    it('seleciona um arquivo da pasta fixtures', ()=> {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(($input)=>{
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', ()=>{
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(($input)=>{
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', ()=> {
        cy.fixture("example.json").as('sampleFIle')
        cy.get('input[type="file"]')
        .selectFile('@sampleFIle')
        .should(($input)=>{
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', ()=> {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', ()=> {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
    })
  })
  