class DB {
    constructor(dbFile){
        this.dbFile = dbFile;
        this.fs =  require('fs').promises;
    }
    add(profile){
        return new Promise((resolve,reject) => {
            this.list()
            .then((allUsers) => {
                allUsers = JSON.parse(allUsers);
                if(allUsers.filter(item => item.userId == profile.userId)[0]){
                    reject('User ID already exists!');
                }else{
                    allUsers.push(profile);
                    console.log(allUsers)
                    this.fs.writeFile(this.dbFile ,JSON.stringify(allUsers))
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
    find(userId){
        return new Promise((resolve,reject) => {
        const allUsers = this.list()
        .then(result => {
            result = JSON.parse(result);
            resolve(result.filter((item) => item.id == userId)[0])
        })
        .catch(e => reject(e));
     });
    }
}
module.exports = DB;