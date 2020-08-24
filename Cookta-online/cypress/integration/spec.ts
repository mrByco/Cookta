const baseUrl = "http://localhost:4200";

it("Load main page", () => {
  cy.visit(baseUrl);
  let foodImg = cy.get('app-navigation-bar').find("img");
  foodImg.should('be.visible');
  foodImg.should('have.attr', 'src').should('eq','assets/cookta-logo-white.png')
});

it('Load a food page', function () {
  const foodUrl: string = baseUrl + "/foods/5f195f117a3bee120c8c47e0";
  cy.visit(foodUrl);

  cy.contains("Albert kekszes csíkos sütemény");

  cy.contains("evőkanál");
  cy.contains("liszt");



  let foodImg = cy.get('app-food-detail').find("img");
  foodImg.should('be.visible');
  foodImg.should('have.attr', 'src').should('eq','https://kuktaimages.blob.core.windows.net/foodimages/5f195f117a3bee120c8c47e1.jpg')
});
