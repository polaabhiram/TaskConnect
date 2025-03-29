// TaskConnect/backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

// Post a new job
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional-body') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    res.status(500).json({ message: 'Error posting job' });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Apply for a job
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const alreadyApplied = job.applications.some(app => app.worker.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    job.applications.push({ worker: req.user.id });
    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error applying for job' });
  }
});

// Get applications for jobs posted by the professional body
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional-body') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const jobs = await Job.find({ postedBy: req.user.id }).populate({
      path: 'applications',
      populate: { path: 'worker', select: 'name email category' }
    });
    const applications = jobs.flatMap(job =>
      job.applications.map(app => ({
        _id: app._id,
        job: { title: job.title },
        worker: app.worker,
        appliedAt: app.appliedAt
      }))
    );
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;