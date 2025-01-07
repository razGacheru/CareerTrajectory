// cypress/e2e/loginSignup_spec.js

describe('LoginSignup Component', () => {
  beforeEach(() => {
    // Visit your login/signup page
    cy.visit('http://localhost:3000/loginSignUp'); 
  });

  it('should display login form by default', () => {
    cy.contains('Login').should('be.visible');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
  });

  it('should switch to Sign Up form', () => {
    // Click on Sign Up button
    cy.contains('Sign Up').click();
    
    // Verify Sign Up form elements
    cy.contains('Sign Up').should('be.visible');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="First Name"]').should('exist');
    cy.get('input[placeholder="Last Name"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.get('input[placeholder="Confirm Password"]').should('exist');
  });

  it('should submit login form and handle errors', () => {
    // Enter login credentials
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    
    // Mock the fetch call for login
    cy.intercept('POST', 'http://localhost:5000/login', {
      statusCode: 400,
      body: { Error: 'Invalid credentials' },
    }).as('loginRequest');
    
    // Click submit
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.contains('Login Error').should('be.visible');
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should submit sign-up form successfully', () => {
    // Switch to Sign Up form
    cy.contains('Sign Up').click();
    
    // Fill in signup details
    cy.get('input[placeholder="Email"]').type('newuser@example.com');
    cy.get('input[placeholder="First Name"]').type('John');
    cy.get('input[placeholder="Last Name"]').type('Doe');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    
    // Mock the fetch call for sign-up
    cy.intercept('POST', 'http://localhost:5000/register', {
      statusCode: 200,
      body: { 
        token: 'mockToken', 
        id: 'mockId' 
      },
    }).as('signUpRequest');
    
    // Click submit
    cy.get('button[type="submit"]').click();
    
    // Check for successful redirection
    cy.url().should('include', '/');
  });

});
