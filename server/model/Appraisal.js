
import mongoose from 'mongoose'

const scoresSchema = new mongoose.Schema(
  {
    strategy: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    governance: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    engagement: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    industry: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    leadership: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false },
)

const appraisalSchema = new mongoose.Schema(
  {
    boardMember: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    evaluator: {
      type: String,
      required: true,
      trim: true,
    },
    committee: {
      type: String,
      required: true,
      trim: true,
      enum: ['audit-risk', 'governance', 'remuneration', 'strategy'],
    },
    cycle: {
      type: String,
      required: true,
      trim: true,
    },
    attendance: {
      type: String,
      required: true,
      trim: true,
    },
    tenure: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      required: true,
      trim: true,
      enum: ['reappoint', 'reappoint-support', 'defer'],
    },
    strategicWins: {
      type: String,
      required: true,
      trim: true,
    },
    cultureNote: {
      type: String,
      required: true,
      trim: true,
    },
    boardChairNote: {
      type: String,
      required: true,
      trim: true,
    },
    developmentPriorities: {
      type: [String],
      default: [],
    },
    scores: {
      type: scoresSchema,
      required: true,
    },
    averageScore: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    highPriorityFlags: {
      type: Number,
      min: 0,
      default: 0,
    },
    completion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    submissionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

const Appraisal = mongoose.model('Appraisal', appraisalSchema)

export default Appraisal
