import crypto from 'node:crypto'

function createSubmissionHash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

export default createSubmissionHash
