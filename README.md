# Cron Expression Parser

## Overview
This script parses out a cron expression string and outputs the expected values. The values need to be in the following order:

- Minute(s) (Allowed values: 0-59)
- Hour(s) (Allowed values: 0-23)
- Day(s) of the month (Allowed values: 1-31)
- Month(s) (Allowed values: 1-12)
- Day(s) of the week (Allowed values: 1-7)
- Command

There are also a set of allowed special characters.

- `*` - any value
- `,` - value list separator
- `-`	- range of values
- `/`	- step values

The script was built so there are no dependencies outside of Node. This allows the script to run in many environments without issue.

## Installing dependencies
There aren't any dependencies necessary to run the script. However, if you wish to run tests, you will need to run the install command.

`npm install`

## Requirements
- Node v12.18.4

## Running the script
The script takes in a string as the expression.

`~$ node cronParser.js "*/15 0 1,15 * 1-5 /usr/bin/find"`

## Examples

```
~$ node cronParser.js "*/15 0 1,15 * 1-5 /usr/bin/find"

  minute        0 15 30 45
  hour          0
  day of month  1 15
  month         1 2 3 4 5 6 7 8 9 10 11 12
  day of week   1 2 3 4 5
  command       /usr/bin/find
```

```
$ node cronParser.js "*/15 0 1,15 */3 * /usr/bin/find"

  minute        0 15 30 45
  hour          0
  day of month  1 15
  month         1 4 7 10
  day of week   1 2 3 4 5 6 7
  command       /usr/bin/find
```

## Running Tests
The tests use Jest, so make sure that is installed. To run, use `npm run test`. You should not see any failures if the project is fresh.

## Limitations
- The parser does not currently allow compound expressions e.g. `1-5/6 or 1,2,10-15`
- There is no checking for days of the month against the month itself e.g. if February is set as month, it does not check if days are between 1-28/29
- No Leap year checking
- Integer values only. Does not accept DEC or MON for values
