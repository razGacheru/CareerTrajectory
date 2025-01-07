// cypress/integration/careerPlan.spec.js

describe('CareerPlan Page', () => {
    beforeEach(() => {
      // Set up any initial conditions, e.g., mock API responses or log in if needed
      cy.visit('http://localhost:3000/CareerPlan'); // Adjust the URL based on your application's route
    });
  
  
    it('should be able to interact with the input fields and add experience', () => {
      // Wait for loading to complete
      cy.wait(2000); // Adjust wait time if necessary
  
      // Check if the role input field is visible
      cy.get('input[role="combobox"]').first().should('be.visible');
  
      // Type a role into the role input field
      cy.get('input[role="combobox"]').first().type('Software Engineer');
      cy.contains('Software Engineer').click();
      
      // Type years into the years input field
      cy.get('input[role="combobox"]').last().type('3');
      cy.contains('3').click();
      
      // Click on the 'Add' button
      cy.contains('Add').click();
    });
  
    it('should be able to open the skills dialog and select skills', () => {
      // Click the button to open the skills dialog
      cy.get('[data-cy="square-list"]').should('be.visible');
      cy.get('[data-cy="square-list"]').click();
      
    });
    
    it('should enable and click the continue button', () => {
        // Click the 'Continue' button
        cy.contains('Continue').click();
        
        // Verify if the Sankey chart or another element is displayed as expected
        cy.get('[data-cy="sankey-chart"]').should('be.visible');
    });
  });
  