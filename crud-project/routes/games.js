const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management
 */

/**
 * @swagger
 * /games:
 *   get:
 *     tags: [Games]
 *     summary: Get all games
 *     responses:
 *       200:
 *         description: List of games
 */
router.get('/', async (req, res) => {
  try {
    const collection = db.getCollection('games');
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error('GET /games error:', err.message);
    res.status(500).json({ error: 'Unable to fetch games' });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Get a game by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game object
 *       404:
 *         description: Game not found
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  try {
    const collection = db.getCollection('games');
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Game not found' });
    res.json(doc);
  } catch (err) {
    console.error('GET /games/:id error:', err.message);
    res.status(500).json({ error: 'Unable to fetch game' });
  }
});

/**
 * @swagger
 * /games:
 *   post:
 *     tags: [Games]
 *     summary: Create a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               developer:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *               genre:
 *                 type: string
 *               platform:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req, res) => {
  const { title, developer, releaseDate, genre, platform } = req.body;
  if (!title || !developer || !releaseDate || !genre || !platform) {
    return res.status(400).json({ error: 'All fields required: title, developer, releaseDate, genre, platform' });
  }
  try {
    const collection = db.getCollection('games');
    const result = await collection.insertOne({ title, developer, releaseDate, genre, platform });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('POST /games error:', err.message);
    res.status(500).json({ error: 'Unable to create game' });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     tags: [Games]
 *     summary: Update a game
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
 *               title:
 *                 type: string
 *               developer:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *               genre:
 *                 type: string
 *               platform:
 *                 type: string
 *     responses:
 *       204:
 *         description: Updated successfully
 *       404:
 *         description: Game not found
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  const { title, developer, releaseDate, genre, platform } = req.body;
  if (!title || !developer || !releaseDate || !genre || !platform) {
    return res.status(400).json({ error: 'All fields required: title, developer, releaseDate, genre, platform' });
  }
  try {
    const collection = db.getCollection('games');
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { title, developer, releaseDate, genre, platform } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Game not found' });
    res.status(204).send();
  } catch (err) {
    console.error('PUT /games/:id error:', err.message);
    res.status(500).json({ error: 'Unable to update game' });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Delete a game
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
 *         description: Game not found
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
  try {
    const collection = db.getCollection('games');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Game not found' });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /games/:id error:', err.message);
    res.status(500).json({ error: 'Unable to delete game' });
  }
});

module.exports = router;
