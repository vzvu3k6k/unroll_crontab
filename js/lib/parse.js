var cronParser = require('cron-parser');

// This function is modified version of CronParser.parseString.
function parseCrontabWithCommand (data) {
  var self = this;
  var blocks = data.split('\n');

  var response = {
    variables: {},
    expressions: [],
    errors: {}
  };

  for (var i = 0, c = blocks.length; i < c; i++) {
    var block = blocks[i];
    var matches = null;
    var entry = block.replace(/^\s+|\s+$/g, ''); // Remove surrounding spaces

    if (entry.length > 0) {
      if (entry.match(/^#/)) { // Comment
        continue;
      } else if ((matches = entry.match(/^(.*)=(.*)$/))) { // Variable
        response.variables[matches[1]] = matches[2];
      } else { // Expression?
        var result = null;

        try {
          result = cronParser._parseEntry('0 ' + entry);
          result.command = result.command.join(' ');
          response.expressions.push(result);
        } catch (err) {
          response.errors[entry] = err;
        }
      }
    }
  }

  return response;
};

module.exports = parseCrontabWithCommand;
