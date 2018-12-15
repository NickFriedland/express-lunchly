/** Routes for Lunchly */

const express = require('express');

const Customer = require('./models/customer');
const Reservation = require('./models/reservation');

const router = new express.Router();

/** Homepage: show list of customers. */

router.get('/', async function(req, res, next) {
  try {
    const customers = await Customer.all();
    return res.render('customer_list.html', { customers });
  } catch (err) {
    return next(err);
  }
});

/** Form to add a new customer. */

router.get('/add/', async function(req, res, next) {
  try {
    return res.render('customer_new_form.html');
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new customer. */

router.post('/add/', async function(req, res, next) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const notes = req.body.notes;

    const customer = new Customer({ firstName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Get top-10 customers by num of reservations made */
router.get('/top-10', async function(req, res, next) {
  try {
    const topTen = await Customer.topTen();

    return res.render('top10.html', { topTen });
  } catch (error) {
    return next(error);
  }
});

/** Show a customer, given their ID. */

router.get('/:id/', async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    const reservations = await customer.getReservations();

    return res.render('customer_detail.html', { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Show a customer, given their full name. */

router.post('/by-name', async function(req, res, next) {
  try {
    const { name } = req.body; // "Anthony Gonzales"
    console.log(req.body);
    const nameArr = name.split(' ');
    const first = nameArr[0];
    const last = nameArr[1];

    const customer = await Customer.getByName(first, last);

    const reservations = await customer.getReservations();

    // console.log(customer);
    // console.log(reservations);

    return res.render('customer_detail.html', { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Show form to edit a customer. */

router.get('/:id/edit/', async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    res.render('customer_edit_form.html', { customer });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a customer. */

router.post('/:id/edit/', async function(req, res, next) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const notes = req.body.notes;

    const customer = new Customer({ firstName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new reservation. */

router.post('/:id/add-reservation/', async function(req, res, next) {
  try {
    const customerId = req.params.id;
    // console.log(new Date(req.body.startAt));
    // console.log(req.body.startAt);
    // console.log(req.body);
    const startAt = new Date(req.body.startAt);
    const numGuests = req.body.numGuests;
    const notes = req.body.notes;

    const reservation = new Reservation({
      customerId,
      startAt,
      numGuests,
      notes
    });
    await reservation.save();

    return res.redirect(`/${customerId}/`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;