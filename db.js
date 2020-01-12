class DB {
    constructor(dbFile){
        this.dbFile = dbFile;
        this.JSON5 = require('json5');
        this.fs =  require('fs').promises;
    }
    add(profile){
        return new Promise((resolve,reject) => {
            const allUsers = this.list()
            .then((allUsers) => {
                allUsers = this.JSON5.parse(allUsers);
                if(allUsers.filter(item => item.userId == profile.userId)[0]){
                    reject('User ID already exists!');
                }else{
                    allUsers.push(profile);
                    console.log(allUsers)
                    this.fs.writeFile(this.dbFile , this.JSON5.stringify(allUsers))
                    .then(result => resolve('Successfully wrote to the file'))
                    .catch(e => reject(e));
                }
            })
                .catch(e => reject(e));  
        });
    }
    list(){
        return this.fs.readFile(this.dbFile);
    }
    findDB(userId){
        return new Promise((resolve,reject) => {
        const allUsers = this.list()
        .then(allUsers => resolve(allUsers.filter((item) => item.userId == userId)))
        .catch(e => reject(e));

     });
    }
}
let database = new DB('db.json5');
