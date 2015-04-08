var parse = require('./lib/parse');
var unrollCrontab = require('./lib/unroll_crontab');
var React = require('react');

var Task = React.createClass({
  render: function() {
    // %02d (1 -> 01, 10 -> 10)
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    // Date -> YYYY-MM-DD hh:mm
    function date2str(date) {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    return <li>
      <time dateTime={this.props.time.toISOString()}>{date2str(this.props.time)}</time>
      <code>{this.props.command}</code>
      </li>;
  },
});

var UnrollCrontabConfig = React.createClass({
  onClickNow: function(e) {
    this.setState({startValueOnEdit: null});
    this.props.updateStartDate(new Date());
  },
  onChange: function(e) {
    var newValue = React.findDOMNode(this.refs.start).value;
    var newDateEpochMs = Date.parse(newValue);
    if (Number.isNaN(newDateEpochMs)) {
      this.setState({startValueOnEdit: newValue});
      return;
    }
    this.setState({startValueOnEdit: null});
    var date = new Date();
    date.setTime(newDateEpochMs);
    this.props.updateStartDate(date);
  },
  getInitialState: function(){
    return {startValueOnEdit: null};
  },
  render: function() {
    return <form className="unrollCrontabConfig">
      <label htmlFor="unrollCrontabConfig-date">Start</label>
      <input type="text" name="start" id="unrollCrontabConfig-date" value={this.state.startValueOnEdit || this.props.startDate.toISOString()} ref="start" onChange={this.onChange} />
      <input type="button" onClick={this.onClickNow} value="Set Now" />
      </form>;
  }
});

var UnrollCrontab = React.createClass({
  update: function() {
    var crontabStr = this.refs.crontab.getDOMNode().value;
    var expressions = parse(crontabStr).expressions;
    var scheduleCount = {};
    expressions.forEach(function(i) {
      var countKey = JSON.stringify(i);
      if (typeof scheduleCount[countKey] === 'undefined') {
        scheduleCount[countKey] = 0;
      }
      i.id = countKey + '@@@' + scheduleCount[countKey]++; // used for React's key prop
    });
    this.setState({tasks: unrollCrontab(expressions)});
  },
  getInitialState: function() {
    return {tasks: (function*(){})(), startDate: new Date()};
  },
  updateStartDate: function(date) {
    this.setState({startDate: date});
  },
  render: function() {
    var taskNodes = [];
    var taskCount = {};
    for (var i = 0; i < 10; i++) {
      var item = this.state.tasks.next();
      if (item.done) break;

      var scheduleId = item.value.id;
      if (typeof taskCount[scheduleId] === 'undefined') {
        taskCount[scheduleId] = 0;
      }
      var key = scheduleId + '@@@' + taskCount[scheduleId]++;

      taskNodes.push(<Task time={item.value.next} command={item.value.command} key={key} />);
    }
    return <div className="unrollCrontab">
      <textarea className="crontab" ref="crontab" onChange={this.update} placeholder="Paste your `crontab -l`"></textarea>
      <UnrollCrontabConfig updateStartDate={this.updateStartDate} startDate={this.state.startDate} />
      <ol className="unrolledTasks">
        {taskNodes}
      </ol>
      </div>;
  }
});

React.render(<UnrollCrontab />, document.querySelector('div'));
