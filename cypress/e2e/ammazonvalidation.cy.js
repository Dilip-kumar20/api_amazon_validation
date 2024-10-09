








describe('Amazon Product Search and Add to Cart', () => {
    it('Search for toys, add two products to cart, and validate prices', () => {
      
      // Step 1: Navigate to Amazon and search for "toys"
      cy.visit('https://www.amazon.com/');
      cy.get('#twotabsearchtextbox').type('toys{enter}');
      cy.get('.s-main-slot', { timeout: 10000 }).should('be.visible');
      // Step 2: On search results page, grab any two products and add them to the cart
      let productPrices = [];
  
       // Select the first product
      cy.get('.s-main-slot .s-result-item') .eq(1).find('.a-link-normal .a-text-normal').first().click();

  // Step 3: On the Product Details page, grab the price and add it to the cart
    cy.get('.a-price').invoke('text').then((priceText) => {
        const firstProductPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        productPrices.push(firstProductPrice); 
      });

  
      // Add to cart
      cy.get('#add-to-cart-button').click();
  
      // Go back to search results to select the second product
      cy.go('back');
      cy.go('back');
       // Select the second product
   
  
      cy.get('.s-main-slot .s-result-item')
        .eq(3).find('.a-link-normal .a-text-normal').first().click();
        
       
        

        // Step 6: On the Product Details page, grab the price of the second product and add it to the cart
    cy.get('.a-price').invoke('text').then((priceText) => {
        const secondProductPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        productPrices.push(secondProductPrice); // Save the price of the second product
      });
  
      // Validate price on Product Details page

//cy.get('.a-offscreen').should("contain", "$18.37")
    //   cy.get('.a-offscreen')
    //     .invoke('text')
    //     .then(priceDetail => {
    //       expect(parseFloat(priceDetail.replace('$', '').replace(',', ''))).to.equal(productPrices[1]);
    //     });
  
      // Add second product to cart
      cy.get('#add-to-cart-button').click();
    //   cy.go('back');
    //   cy.go('back');
      // Step 3: Validate prices in cart and total summary
      cy.xpath("//a[@href='/cart?ref_=sw_gtc']").click(); // View cart

     // cy.get('.sc-list-item', { timeout: 10000 }).should('be.visible');


      // Step 8: Ensure that the cart is populated with items
    cy.get('.sc-list-item', { timeout: 10000 }).should('exist').and('be.visible');

    // Debug: Log the cart content for inspection
    cy.get('.sc-list-item').each(($item, index) => {
      cy.log(`Inspecting cart item ${index + 1}:`, $item.text());
    });

    // Step 9: Validate the prices of the two products in the cart
    cy.get('.sc-list-item').each(($item, index) => {
      const expectedPrice = productPrices[index];

      // Debug: Print the text of the item for manual inspection
      cy.wrap($item).within(() => {
        cy.get('a-price')
          .invoke('text')
          .then((priceText) => {
            cy.log(`Price in cart item ${index + 1}: $${priceText}`);
            const actualPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
            expect(actualPrice).to.equal(expectedPrice); // Assert that the price in the cart matches the saved price
          });
        });
    });
      // Step 8: Validate the prices of the two products in the cart
    // Here we expect the prices of the two products to match the saved values in productPrices
    // cy.get('.sc-list-item').each(($item, index) => {
    //     const expectedPrice = productPrices[index];
    //     cy.wrap($item)
    //       .find('.a-price-whole')
    //       .invoke('text')
    //       .then((priceText) => {
    //         const actualPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    //         expect(actualPrice).to.equal(expectedPrice); // Assert that the price in the cart matches the saved price
    //       });
    //   });


      // Step 10: Proceed to checkout
    cy.get('.a-button-input').contains('Proceed to checkout').click();

    // Step 11: Wait for checkout page to load
    cy.get('.a-row .a-size-medium', { timeout: 10000 }).should('be.visible'); 
  
    //   // Validate price for the first product in the cart
    //   cy.get('.a-price-whole').eq(3).invoke('text').then(cartPrice => {
    //     expect(parseFloat(cartPrice.replace('$', '').replace(',', ''))).to.equal(productPrices[3]);
    //   });
  
    //   // Validate price for the second product in the cart
    //   cy.get('.sc-list-item-content .sc-product-price').eq(1).invoke('text').then(cartPrice => {
    //     expect(parseFloat(cartPrice.replace('$', '').replace(',', ''))).to.equal(productPrices[1]);
    //   });
  
    //   // Validate total price
    //   const totalExpected = productPrices.reduce((acc, price) => acc + price, 0);
    //   cy.get('#sc-subtotal-amount-activecart').invoke('text').then(total => {
    //     expect(parseFloat(total.replace('$', '').replace(',', ''))).to.equal(totalExpected);
    //   });
    });
  });