/**
 * @summary Starts the ColdTrack fake API and persists mutations in db.js.
 * @author Codex Assistant
 */
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const data = require('./db.js');

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();
const dbPath = path.join(__dirname, 'db.js');
const port = 3000;

/**
 * Writes the current lowdb state back to server/db.js.
 *
 * @returns {void}
 */
function persistDatabase() {
  const currentData = router.db.getState();
  const fileContent = `/**\n * @summary JSON Server fake API data source for ColdTrack.\n * @author Codex Assistant\n */\nmodule.exports = ${JSON.stringify(currentData, null, 2)};\n`;
  fs.writeFileSync(dbPath, fileContent, 'utf8');
}

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((request, response, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    response.on('finish', persistDatabase);
  }
  next();
});
server.use(router);

server.listen(port, () => {
  console.log(`ColdTrack fake API is running at http://localhost:${port}`);
});
