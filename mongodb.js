const { MongoClient, ObjectID, Db} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database')
    }

     const db = client.db(databaseName)

// db.collection('tasks').updateMany({
//     tyme: 'afternoon'
// }, {
//     $set: {
//         tyme: 'Evening'
//     }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

    // db.collection('tasks').deleteMany({
    //     tyme: 'Evening'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    
    // db.collection('tasks').insertMany([
    //     {
    //         tyme: 'Morning',
    //         task: 'Help mom'
    //     }, {
    //         tyme: 'Afternoon',
    //         task: 'Hurry to the worship of Allah'
    //     }, {
    //         tyme: 'Evening',
    //         task: 'Learn arabia and programming'
    //     }
    // ]).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        _id: ObjectID('6196d18768b1bb20c919126c')
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

}) 



