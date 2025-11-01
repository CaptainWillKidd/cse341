const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

// GET all contacts
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

// GET contact by id
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

module.exports = router;
