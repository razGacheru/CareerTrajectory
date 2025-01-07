// cypress/integration/careerAdviceLinks.spec.js

describe('CareerAdviceLinks Component', () => {
    before(() => {
      // Visit the page or component where CareerAdviceLinks is rendered
      cy.visit('http://localhost:3000/'); // Adjust the URL based on where the CareerAdviceLinks component is used
    });
  
    it('should display the button and open the dialog on click', () => {
      // Ensure the button is visible and clickable
      cy.contains('Career Trends and Advice').should('be.visible');
  
      // Click the button to open the dialog
      cy.contains('Career Trends and Advice').click();
  
      // Verify that the dialog is visible
      cy.get('[role="dialog"]').should('be.visible');
  
      // Verify the presence of links in the dialog
      cy.contains('How To Stay Relevant In The GenAI Era')
      cy.contains('Top IT Skills in Demand in 2024')
      cy.contains('Other News Article/Blog Post')
  
      // Click the close icon in the dialog
      cy.get('[aria-label="close"]').click();
  
      // Verify that the dialog is closed
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Career Trends and Advice').click();
    });
  
  });
  