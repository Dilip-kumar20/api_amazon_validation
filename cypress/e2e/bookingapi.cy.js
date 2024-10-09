describe('Booking API Tests', () => {
    let bookingId;
  
    const bookingData = {
      firstname: "testFirstName",
      lastname: "lastName",
      totalprice: 10.11,
      depositpaid: true,
      bookingdates: {
        checkin: "2022-01-01",
        checkout: "2024-01-01"
      },
      additionalneeds: "testAdd"
    };
  
    // Test: Add a new booking (POST)
    it('should add a new booking', () => {
      cy.request({
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        body: bookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        // Assert the status code is 200
        expect(response.status).to.eq(200);
        
        // Save the booking ID for future validation
        bookingId = response.body.bookingid;
        
        // Validate the booking response
        expect(response.body.booking.firstname).to.eq(bookingData.firstname);
        expect(response.body.booking.lastname).to.eq(bookingData.lastname);
        expect(response.body.booking.totalprice).to.eq(10);
        expect(response.body.booking.depositpaid).to.be.true;
        expect(response.body.booking.bookingdates.checkin).to.eq(bookingData.bookingdates.checkin);
        expect(response.body.booking.bookingdates.checkout).to.eq(bookingData.bookingdates.checkout);
        expect(response.body.booking.additionalneeds).to.eq(bookingData.additionalneeds);
      });
    });
  
    // Test: Validate the added booking (GET)
    it('should retrieve the booking by ID', () => {
      cy.request({
        method: 'GET',
        url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      }).then((response) => {
        // Assert the status code is 200
        expect(response.status).to.eq(200);
  
        // Validate that the booking details match the original data
        expect(response.body.firstname).to.eq(bookingData.firstname);
        expect(response.body.lastname).to.eq(bookingData.lastname);
        expect(response.body.totalprice).to.eq(10);
        expect(response.body.depositpaid).to.be.true;
        expect(response.body.bookingdates.checkin).to.eq(bookingData.bookingdates.checkin);
        expect(response.body.bookingdates.checkout).to.eq(bookingData.bookingdates.checkout);
        expect(response.body.additionalneeds).to.eq(bookingData.additionalneeds);
      });
    });
  
    // Test: Negative case (invalid booking ID)
    it('should return 404 when trying to get a booking with an invalid ID', () => {
      cy.request({
        method: 'GET',
        url: 'https://restful-booker.herokuapp.com/booking/999999', // Invalid ID
        failOnStatusCode: false  // Don't fail the test on 404
      }).then((response) => {
        // Assert the status code is 404
        expect(response.status).to.eq(404);
      });
    });
  
    // Test: Negative case (Invalid data while adding a booking)
    it('should return 400 when adding a booking with invalid data', () => {
      const invalidBookingData = {
        firstname: "",
        lastname: "",
        totalprice: -10,
        depositpaid: false,
        bookingdates: {
          checkin: "2022-01-01",
          checkout: "2021-01-01"
        },
        additionalneeds: ""
      };
  
      cy.request({
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        body: invalidBookingData,
        headers: {
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false  // Don't fail the test on 400
      }).then((response) => {
        // Assert the status code is 400
        expect(response.status).to.eq(400);
      });
    });
  
    // Clean up after tests
    after(() => {
      if (bookingId) {
        cy.request({
          method: 'DELETE',
          url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
        }).then((response) => {
          expect(response.status).to.eq(201); // Successful delete returns 201
        });
      }
    });
  });
  