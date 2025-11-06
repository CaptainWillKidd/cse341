const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Returns all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', async (req, res) => {
  try {
    const collection = db.getCollection('contacts');
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error('GET /contacts error:', err.message);
    res.status(500).json({ error: 'Unable to fetch contacts' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Returns a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  try {
    const collection = db.getCollection('contacts');
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Contact not found' });
    res.json(doc);
  } catch (err) {
    console.error('GET /contacts/:id error:', err.message);
    res.status(500).json({ error: 'Unable to fetch contact' });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Creates a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created contact
 */
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  // Validar campos obrigatórios
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ 
      error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
    });
  }

  try {
    const collection = db.getCollection('contacts');
    const result = await collection.insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('POST /contacts error:', err.message);
    res.status(500).json({ error: 'Unable to create contact' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Updates an existing contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  // Validar campos obrigatórios
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ 
      error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
    });
  }

  try {
    const collection = db.getCollection('contacts');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName, email, favoriteColor, birthday } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('PUT /contacts/:id error:', err.message);
    res.status(500).json({ error: 'Unable to update contact' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Removes a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  try {
    const collection = db.getCollection('contacts');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /contacts/:id error:', err.message);
    res.status(500).json({ error: 'Unable to delete contact' });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: Automatically generated MongoDB ID
 *         firstName:
 *           type: string
 *           description: First name of the contact
 *         lastName:
 *           type: string
 *           description: Last name of the contact
 *         email:
 *           type: string
 *           description: Email address of the contact
 *         favoriteColor:
 *           type: string
 *           description: Contact's favorite color
 *         birthday:
 *           type: string
 *           format: date
 *           description: Contact's birthday in YYYY-MM-DD format
 *     ContactInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the contact
 *         lastName:
 *           type: string
 *           description: Last name of the contact
 *         email:
 *           type: string
 *           description: Email address of the contact
 *         favoriteColor:
 *           type: string
 *           description: Contact's favorite color
 *         birthday:
 *           type: string
 *           format: date
 *           description: Contact's birthday in YYYY-MM-DD format
 */

module.exports = router;
