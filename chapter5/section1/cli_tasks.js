const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args.shift();
const taskDescription = args.join(' ');
const file = path.join(__dirname, '.tasks');

switch(command) {
  case 'list':
    listTasks(file);
    break;
  case 'add':
    addTask(file, taskDescription);
    break;
  default:
    console.log(`Usage: ${process.argv.slice(0, 2).join(' ')} list|add [taskDescription]`);
}

function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, (tasks) => {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  })
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, (tasks) => {
    tasks.forEach((task) => console.log(task));
  })
}

function loadOrInitializeTaskArray(file, callback) {
  fs.exists(file, (exists) => {
    if(!exists) return callback([]);

    fs.readFile(file, 'utf8', (err, data) => {
      if(err) throw err;

      const tasks = JSON.parse(data.toString() || '[]');
      callback(tasks);
    })
  });
}

function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', (err) => {
    if(err) throw err;
    console.log('Saved!');
  });
}
