const routes = require('next-routes')();

routes  .add('/results','/results')
        .add('/candidates','/candidates')
        .add('/bills','/bills/index')
        .add('/bills/propose','/bills/propose')       //will have a form where winnnig party can propose a billl
        .add('/bills/transactions','/bills/transactions')  //will show all the transactions done by party
        .add('/bills/requests','/bills/requests');
        //.add('/bills/:request','');     will ask the voters to upvote downvote for passing a bill   
module.exports = routes;