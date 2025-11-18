const Contact = require("../models/Contact");
const mongoose = require("mongoose");
// const ObjectId = require("mongodb").ObjectId;
 
const getAll = async (req, res, next) => {
  try {
    const contacts = await Contact.find().lean();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};
 
const getSingle = async (req, res, next) => {
  // const contactId = new ObjectId(req.params.id);
  // const result = await mongodb
  //   .getDatabase()
  //   .db()
  //   .collection("contacts")
  //   .find({ _id: contactId });
  // result.toArray().then((contact) => {
  //   res.setHeader("content-type", "application/json");
  //   res.status(200).json(contact[0]);
  // });
  try {
    const { id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Must use a valid contact id to find a contact." });
    }
 
    const contact = await Contact.findById(id).lean();
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(contact);
  } catch (error) {
    const err = new Error("Error fetching contacts");
    err.status = 400;
    next(err);
  }
};
 
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).send({
        message: "Data to create can not be empty!",
      });
    }
 
    const newContact = { firstName, lastName, email, favoriteColor, birthday };
    // const result = await mongodb
    //   .getDatabase()
    //   .db()
    //   .collection("contacts")
    //   .insertOne(newContact);
    const result = await Contact.create(newContact);
    res.status(201).json({
      message: "Contact creatd successefully",
      contactId: result._id,
    });
  } catch (error) {
    const err = new Error("Some error occurred while creating the contact.");
    err.status = 500;
    next(err);
  }
};
 
const updateByid = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
 
    // const id = new ObjectId(req.params.id);
    const contact_id = req.params.id;
    // const result = await mongodb
    //   .getDatabase()
    //   .db()
    //   .collection("contacts")
    //   .updateOne(
    //     { _id: id },
    //     { $set: { firstName, lastName, email, favoriteColor, birthday } }
    //   );
    const result = await Contact.findByIdAndUpdate(
      contact_id,
      { firstName, lastName, email, favoriteColor, birthday },
      { new: true, runValidators: true }
    );
 
    if (!result) {
      res.status(404).send({
        message: `Cannot update Contact with id=${id}. Maybe Contact was not found!`,
      });
    } else res.send({ message: "Contact was updated successfully." });
  } catch (error) {
    // res
    //   .status(500)
    //   .json({ message: "Error updating contact", error: err.message });
    const err = new Error("'Some error occurred while updating the contact.'");
    err.status = 500;
    next(err);
  }
};
 
const deleteByid = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    // const result = await mongodb
    //   .getDatabase()
    //   .db()
    //   .collection("contacts")
    //   .deleteOne({ _id: contactId });
    const result = Contact.findByIdAndDelete(contactId);
    if (!result) {
      return res.status(404).json({
        message: `Contact with id=${contactId} not found.`,
      });
    }
 
    res.status(200).json({
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    const err = new Error("'Some error occurred while updating the contact.'");
    err.status = 500;
    next(err);
  }
};
 
module.exports = {
  getAll,
  getSingle,
  updateByid,
  deleteByid,
  create,
};