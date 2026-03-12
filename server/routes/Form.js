import express from 'express'
import Appraisal from '../model/Appraisal.js'
import createSubmissionHash from '../hasher/hash.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const submissionHash = createSubmissionHash(payload)

    const existing = await Appraisal.findOne({ submissionHash })
    if (existing) {
      return res.status(409).json({
        message: 'An identical appraisal already exists.',
      })
    }

    const appraisal = await Appraisal.create({
      ...payload,
      submissionHash,
    })

    return res.status(201).json(appraisal)
  } catch (error) {
    return res.status(400).json({
      message: 'Unable to save appraisal.',
      error: error.message,
    })
  }
})

router.get('/', async (_req, res) => {
  try {
    const appraisals = await Appraisal.find().sort({ createdAt: -1 })
    return res.json(appraisals)
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to fetch appraisals.',
      error: error.message,
    })
  }
})

export default router
