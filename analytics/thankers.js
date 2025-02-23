/*
* Analytics that:
* Find thanks messages
*/

module.exports = function(history) {
    let thanksMessages = 0;
    let kindPeople = {};

    for (let entry of history){
      if (entry.message.match(/Obrigado|Obrigada|obrigado|obrigada|Valeu|valeu|vlw|obg|thx|thanks|thank|brigado|brigada|obrigado!|obrigada!|Obrigado!|Obrigada!|obg!|thx!|thanks!|thank!|brigado!|brigada!|🙏/)) {
        thanksMessages += 1;

        if (!kindPeople[entry.author]){
          kindPeople[entry.author] = 0;
        }
        kindPeople[entry.author] += 1;
      }
    }

    console.log('\nTotal de Mr./Ms. Gratidão 🙏:', thanksMessages)

    let countArray = [];
    if (thanksMessages > 0){

    for (let key in kindPeople){
      countArray.push({
        'author' : key,
        'count': kindPeople[key]
      });
    }
    countArray = countArray.sort(compare).reverse();
    // Print top 10 users in friendly format
    console.log('Top 10 Mr./Ms. Gratidão 🙏:')
    let topUsers = 10;

    if(thanksMessages <= 10){
      topUsers = thanksMessages;
    }

    for (let userCount = 0; userCount < topUsers; userCount++){
      console.log('@' + countArray[userCount].author, ':', countArray[userCount].count)
    }
    console.log();

  
}else {
  console.log("que povo mal agradecido");
     }
  function compare( a, b ) {
    if ( a.count < b.count ){
      return -1;
    }
    if ( a.count > b.count ){
      return 1;
    }
    return 0;
  }
}
