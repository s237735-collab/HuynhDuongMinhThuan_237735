const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: new RegExp(search, 'i') },
          { fullName: new RegExp(search, 'i') }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
