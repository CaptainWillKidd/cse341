const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

/**
 * @swagger
 * tags:
 *   name: Platforms
 *   description: Platform management
 */

/**
 * @swagger
 * /platforms:
 *   get:
 *     tags: [Platforms]
 *     summary: Get all platforms
 *     responses:
 *       200:
 *         description: List of platforms
 */
router.get('/', async (req, res) => {
  try {
    const collection = db.getCollection('platforms');
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error('GET /platforms error:', err.stack || err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Unable to fetch platforms' });
    } else {
      res.status(500).json({ error: 'Unable to fetch platforms', details: err.message });
    }
  }
});

/**
 * @swagger
 * /platforms/{id}:
 *   get:
 *     tags: [Platforms]
 *     summary: Get a platform by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Platform object
 *       404:
 *         description: Platform not found
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  try {
    const collection = db.getCollection('platforms');
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Platform not found' });
    res.json(doc);
  } catch (err) {
    console.error('GET /platforms/:id error:', err.stack || err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Unable to fetch platform' });
    } else {
      res.status(500).json({ error: 'Unable to fetch platform', details: err.message });
    }
  }
});

/**
 * @swagger
 * /platforms:
 *   post:
 *     tags: [Platforms]
 *     summary: Create a new platform
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Authentication required
 */
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, async (req, res) => {
  const { name, manufacturer, releaseYear } = req.body;
  if (!name || !manufacturer || !releaseYear) {
    return res.status(400).json({ error: 'All fields required: name, manufacturer, releaseYear' });
  }
  try {
    const collection = db.getCollection('platforms');
    const result = await collection.insertOne({ name, manufacturer, releaseYear });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('POST /platforms error:', err.stack || err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Unable to create platform' });
    } else {
      res.status(500).json({ error: 'Unable to create platform', details: err.message });
    }
  }
});

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     tags: [Platforms]
 *     summary: Update a platform
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Updated successfully
 *       404:
 *         description: Platform not found
 *       401:
 *         description: Authentication required
 */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  const { name, manufacturer, releaseYear } = req.body;
  if (!name || !manufacturer || !releaseYear) {
    return res.status(400).json({ error: 'All fields required: name, manufacturer, releaseYear' });
  }
  try {
    const collection = db.getCollection('platforms');
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { name, manufacturer, releaseYear } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Platform not found' });
    res.status(204).send();
  } catch (err) {
    console.error('PUT /platforms/:id error:', err.stack || err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Unable to update platform' });
    } else {
      res.status(500).json({ error: 'Unable to update platform', details: err.message });
    }
  }
});

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     tags: [Platforms]
 *     summary: Delete a platform
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Platform not found
 *       401:
 *         description: Authentication required
 */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  try {
    const collection = db.getCollection('platforms');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Platform not found' });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /platforms/:id error:', err.stack || err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Unable to delete platform' });
    } else {
      res.status(500).json({ error: 'Unable to delete platform', details: err.message });
    }
  }
});

module.exports = router;
