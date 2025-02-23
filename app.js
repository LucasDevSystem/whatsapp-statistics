/*
* app.js
*
* Message format:
{
  date: 2019-07-04T13:39:00.000Z,
  author: '+1 123 123 123 123',
  message: 'Message here.'
}
*
* Users format:
* ['Person 1', 'Person 2']
*/
const fs = require('fs');
const whatsapp = require('whatsapp-chat-parser');
const parseUserList = require('./parseUserList');
const dayjs = require('dayjs');

// Analytics
const userMessagesAndZombies = require('./analytics/userMessagesAndZombies');
const elonMuskers = require('./analytics/elonMuskers');
const wordCloud = require('./analytics/wordCloud');
const thanks = require('./analytics/thankers');



var myArgs = process.argv.slice(2);

if (myArgs[0] == '--help'){
    console.log('\nzapzap.txt deve ser no seguinte formato:');
    console.log('‎[15/06/16 14:07:29] Fausto Silva: ta pegando fogo BICHO!');
    console.log('\nuserList.txt deve conter os contatos separados por virgula')
    console.log('Thiago Ventura, Fausto, +55 69 99999-9999\n');
    console.log('\nUse o comando --days para filtrar os dias:');
    console.log('ex: "--days 10" ele retorna a analise a partir de 10 dias\n');
    return ;
}

let days;

if (myArgs[0] == '--days'){   
    days=parseInt(myArgs[1]);
    selectedDays = true;
}

console.log('Loading files!')

let rawHistory;
let rawUsers;

try {
  rawHistory = fs.readFileSync('zapzap.txt', 'utf8');
  rawUsers = fs.readFileSync('userList.txt', 'utf8');
} catch (e) {
    console.log('Menssagem: '+ e.message);
    return ;
}

async function runSync(){
  console.log('Parsing files')
  let history;
  let users;
  try {
    history = await whatsapp.parseString(rawHistory);
    users = parseUserList(rawUsers);
  } catch (err) {
    console.log(err);
  }

  if (selectedDays == true){
    let LastDate = dayjs( new Date(history[history.length - 1].date));
    let newDate = LastDate.subtract(days, 'days');

    history  = history.filter((item) => {
      return  item.date > new Date(newDate.toISOString());
    });
  }
  console.log('Loaded:', history.length, 'messages.');
  console.log('Loaded:', users.length, 'users.');
  console.log('History start:', history[0].date, 'end:', history[history.length - 1].date);

  //Run analytics
  userMessagesAndZombies(users, history);
  elonMuskers(history);
  wordCloud(history);
  thanks(history);
}

runSync();
