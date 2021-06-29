const maxMinutes = 59;
const maxHours = 23;
const maxDaysOfWeek = 7;
const maxMonths = 12;
const maxDaysOfMonth = 31;

function CronParser() {
  /**
   * Gets the correct start value based on type.
   * 
   * @param {String} type The type of value 
   * @returns Number
   */
  this.getStart = (type) => {
    return type == 'MINUTE' || type == 'HOUR' ? 0 : 1
  }

  /**
   * Gets the max value based on the specified type.
   * 
   * @param {String} type The type of value
   * @returns number
   */
  this.getMax = (type) => {
    switch(type) {
      case 'MINUTE': return maxMinutes;
      case 'HOUR': return maxHours;
      case 'MONTH': return maxMonths;
      case 'DAYSOFMONTH': return maxDaysOfMonth;
      case 'DAYSOFWEEK': return maxDaysOfWeek;
    }
  }

  /**
   * Gets all values within a set of values inclusive.
   * 
   * @param {Number} start Starting value of range
   * @param {Number} end Ending value of range
   * @returns Array of numbers
   */
  this.range = (start, end) => {
    return Array.from({length: (end-(start-1))}, (_, i) => (start) + i);
  }

  /**
   * Gets all of the values for a specified type.
   * 
   * @param {String} type The type of value
   * @returns Array of numbers
   */
  this.allOf = (type) => {
    let end = this.getMax(type)
    return this.range(this.getStart(type), end)
  }
  /**
   * Gets every num values from the max number based on the type.
   * 
   * @param {Object} num Array of numeric values
   * @param {String} type The type of value
   */
  this.step = (num, type) => {
    if (num.length != 2) {
      throw new Error(`Invalid step value at type ${type}. Exiting Script`)
    }
    let max = this.getMax(type);
    let start = this.getStart(type);
    let incrementBy = parseInt(num[1])
    let values = [];

    if (incrementBy > max) {
      throw new Error(`Invalid step value at type ${type}. Exiting Script`)
    }

    if (num[0] != '*') {
      start = parseInt(num[0])
    }

    while (start <= max) {
      values.push(start)
      start += incrementBy
    }

    return values;
  }
  
  /**
   * Validates values for if they are outside of expected range.
   * 
   * @param {Object} arg Array of numeric values
   * @param {String} type The type of value 
   * @returns Array of numbers
   */
  this.validateRange = (range, type) => {
    let max = this.getMax(type)
    let start = this.getStart(type)
    if (range.length == 0 || (range[range.length-1] > max || range[0] < start)) {
      throw new Error(`Value at ${type} is outside of expected range. Exiting Script`);
    } 
    
    return range
  }
  
  /**
   * Validates comma separated list.
   * 
   * @param {Object} arg Array of numeric values
   * @returns Array of numeric values
   */
  this.validateComma = (arg) => {
    arg.forEach(val=> {
      if (isNaN(parseInt(val))) {
        throw new Error("Invalid comma value. Exiting Script");
      }
    })
    return arg
  }
  
  /**
   * Formats the table with all values.
   * 
   * @param {Object} minutes Array of minutes
   * @param {Object} hours Array of hours
   * @param {Object} daysOfMonth Array of days of the month
   * @param {Object} months Array of months
   * @param {Object} daysOfWeek Array of days of the week
   * @param {String} command Command to run
   */
  this.formatTable = (minutes, hours, daysOfMonth, months, daysOfWeek, command) => {
    console.log(
      `minute        ${minutes.join(' ')}\n` +
      `hour          ${hours.join(' ')}\n` +
      `day of month  ${daysOfMonth.join(' ')}\n` +
      `month         ${months.join(' ')}\n` +
      `day of week   ${daysOfWeek.join(' ')}\n` +
      `command       ${command}\n`
    )
  }

  /**
   * Serves as the main parser for all values.
   * 
   * @param {String} arg Value associated to the type
   * @param {String} type The type of value
   * @returns Array of numeric values
   */
  this.parseByType = (arg, type) => {
    if (arg.includes(',')) {
      return this.validateComma(arg.split(','))
    } else if (arg.includes('/')) {
      return this.step(arg.split('/'), type)
    } else if (arg.includes('-')) {
      let nums = arg.split('-').filter(a=>a.length>0)
      if (nums.length != 2) throw new Error(`Invalid range value at type ${type}`);
      return this.validateRange(this.range(parseInt(nums[0]), parseInt(nums[1])), type)
    } else if (arg.includes('*')) {
      if (arg.length != 1) throw new Error(`Invalid all value at type ${type}`);
      return this.validateRange(this.allOf(type), type)
    } else {
      if (isNaN(parseInt(arg))) throw new Error(`Invalid single value at type ${type}`)
      return this.validateRange([parseInt(arg)], type)
    }
  }

  /**
   * Entry point of the script. Facilitates the logic of the script.
   */
  this.parse = (cronCommandArr) => {

    if (cronCommandArr.length != 6) {
      throw new Error("Invalid Cron expression. Exiting Script");
    }

    const minuteArg = cronCommandArr[0];
    const hourArg = cronCommandArr[1];
    const dayOfMonthArg = cronCommandArr[2];
    const monthArg = cronCommandArr[3];
    const dayOfWeekArg = cronCommandArr[4];
    const commandArg = cronCommandArr[5];

    let minuteArr = this.parseByType(minuteArg, 'MINUTE');
    let hourArr = this.parseByType(hourArg, 'HOUR');
    let dayOfMonthArr = this.parseByType(dayOfMonthArg, 'DAYSOFMONTH');
    let monthArr = this.parseByType(monthArg, 'MONTH');
    let dayOfWeekArr = this.parseByType(dayOfWeekArg, 'DAYSOFWEEK');

    this.formatTable(minuteArr, hourArr, dayOfMonthArr, monthArr, dayOfWeekArr, commandArg)
  }
}

module.exports = CronParser;
