const CronParser = require('./cronParser.js');

const cronCommandArr = process.argv[2].split(' ');
const cronParser = new CronParser();
cronParser.parse(cronCommandArr);

