const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

router.get('/applications', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching applications for user:', req.user);
    if (req.user.role !== 'professional-body') {
      console.log('Access denied: User role is not professional-body');
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('Querying jobs with postedBy:', req.user.id);
    const jobs = await Job.find({ postedBy: req.user.id }).populate({
      path: 'applications.worker',
      select: 'name email category'
    });
    console.log('Raw jobs data with populated workers:', jobs);
    const applications = jobs.flatMap(job =>
      job.applications.map(app => ({
        _id: app._id,
        job: { _id: job._id, title: job.title },
        worker: app.worker,
        appliedAt: app.appliedAt,
        status: app.status
      }))
    );
    console.log('Processed applications with populated workers:', applications);
    if (applications.length === 0) {
      console.log('No applications found for this user');
    }
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err.message, err.stack);
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    console.log('Apply request received for job ID:', req.params.id);
    console.log('Authenticated user:', req.user);
    if (req.user.role !== 'worker') {
      console.log('Access denied: User role is not worker');
      return res.status(403).json({ message: 'Access denied' });
    }
    const job = await Job.findById(req.params.id);
    console.log('Found job:', job);
    if (!job) {
      console.log('Job not found');
      return res.status(404).json({ message: 'Job not found' });
    }
    const alreadyApplied = job.applications.some(app => app.worker.toString() === req.user.id);
    if (alreadyApplied) {
      console.log('Already applied');
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    job.applications.push({ worker: req.user.id });
    console.log('Application pushed, job before save:', job);
    await job.save();
    console.log('Job after save:', await Job.findById(req.params.id));
    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying for job:', err.message, err.stack);
    res.status(500).json({ message: 'Error applying for job', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name');
    const sanitizedJobs = jobs.map(job => ({
      ...job.toObject(),
      postedBy: job.postedBy ? { name: job.postedBy.name || 'Unknown' } : { name: 'Unknown' }
    }));
    res.json(sanitizedJobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

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

router.post('/applications/:applicationId/accept', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional-body') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { applicationId } = req.params;
    const job = await Job.findOne({ 'applications._id': applicationId });
    if (!job) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = 'accepted';
    await job.save();
    res.json({ message: 'Application accepted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error accepting application' });
  }
});

router.post('/applications/:applicationId/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional-body') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { applicationId } = req.params;
    const job = await Job.findOne({ 'applications._id': applicationId });
    if (!job) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = 'rejected';
    await job.save();
    res.json({ message: 'Application rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting application' });
  }
});

module.exports = router;