const SurvivorId = require('./database/models/survivorId');
const CodeTable = require('./database/models/codeTable');

// Force will reset contents
SurvivorId.sync({force: true});
CodeTable.sync({ force: true });
// Alter will append. If new structure, will add columns
// SurvivorId.sync({ alter: true });
// CodeTable.sync({ alter: true });