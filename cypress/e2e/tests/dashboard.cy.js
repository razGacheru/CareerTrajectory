// cypress/e2e/dashboard_spec.js
describe('Dashboard Page', () => {
    beforeEach(() => {
      // Visit the Dashboard Page
      cy.visit('http://localhost:3000/');
    });
  
    it('should display the login button when the user is not logged in', () => {
      // Clear local storage to simulate user not being logged in
      cy.clearLocalStorage();
  
      // Visit the Dashboard Page
      cy.visit('http://localhost:3000/');
  
      // Check if the login button is visible
      cy.contains('Login').should('be.visible');
      cy.contains('RECOMMENDER SYSTEM').should('be.visible');
    });

    
    it('should display user profile when user data is present', () => {
        // Mock API response with user data
        cy.intercept('GET', 'http://localhost:5000/userDetails', {
            statusCode: 200,
            body: {
                email: 'testuser@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
                skills: 'JavaScript, React, Cypress'
            }
        }).as('getUserDetails');
        
        // Mock localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'mockToken');
            win.localStorage.setItem('id', 'mockId');
        });
        
        // Visit the Dashboard Page
        cy.visit('http://localhost:3000/');
        
        cy.contains('Loading Profile...').should('be.visible');
    });
  
    it('should render the ExploreGraduateCareerPaths, MyPersonalizedCareerPlan, and CareerAdviceLinks components', () => {
      // Mock API response with user data
      cy.intercept('GET', 'http://localhost:5000/userDetails', {
        statusCode: 200,
        body: {
          email: 'testuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          skills: 'JavaScript, React, Cypress'
        }
      }).as('getUserDetails');
  
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mockToken');
        win.localStorage.setItem('id', 'mockId');
      });
  
      // Visit the Dashboard Page
      cy.visit('http://localhost:3000/');
  
      // Check for components
      cy.contains('Explore Graduate Career Paths').should('be.visible');
      cy.contains('Manage Career Plan').should('be.visible');
      cy.contains('Career Trends and Advice').should('be.visible');
    });
  });
  