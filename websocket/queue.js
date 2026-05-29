const matchingQueue = {
  ভূত: [], // Male queue
  পেত্নী: [] // Female queue
};

const activeSessions = new Map();
const matchingUsers = new Set();

module.exports = {
  matchingQueue,
  activeSessions,
  matchingUsers
};
