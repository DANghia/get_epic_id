const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

// let a = commit_mess.match(/AB#(\d+)/)
// let item = a[1]
let token = 'Omk3bHVlbzZ3ZXRiejJhbmU1YWsydXk2dDZqZjd1dnFjZjZpYmt3bGZpNm1pamN5NHB4ZHE=';

function options_function(id) {
    return {
        'method': 'GET',
        'url': `https://dev.azure.com/VerbData/Verb/_apis/wit/workitems/${id}?api-version=6.0&$expand=relations`,
        'headers': {
            'Authorization': `Basic ${token}`,
            'Cookie': 'VstsSession=%7B%22PersistentSessionId%22%3A%22e4a9f20c-d415-4231-b4e0-2ebf5c6f27d5%22%2C%22PendingAuthenticationSessionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22CurrentAuthenticationSessionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22SignInState%22%3A%7B%7D%7D'
        }
      }
}

async function get_method(id){
    var options = options_function(id)
    const re = new Promise(function(resolve, reject) {
        request(options, async function (error, response) {
            if (error){
                console.log('error')
                reject(error);
                return
            } 
            let body = response.body
            let ab = body.match(/,"System.Parent":(\d+)/)
            let id1
            try{
                id1 = ab[1]
            } catch {
                id1 = id
            }
            resolve(id1)
          });
    });
    return re;
    // return await request(options, async function (error, response) {
    //     if (error){
    //         console.log('error')
    //         throw new Error(error);
    //     } 
    //     let body = await response.body
    //     let ab = await body.match(/,"System.Parent":(\d+)/)
    //     let id = await ab[1]
    //     await console.log("a"+id)
    //     return await id
    //   });
}



try {
    const commit_mess = core.getInput('commit-mess');
//     const commit_mess = "AB#2071"
    let a = commit_mess.match(/AB#(\d+)/)
    let item = a[1]

    async function get_epic_id(){
        let user_story
        for (let i = 0; i<3; i++){
            user_story = await get_method(item)
            if (user_story == item){
                
                break
            } else {
                item = user_story
            }
        }
        let dataEpic = require('./epic.json');
        await core.setOutput("id", dataEpic[user_story] || 'Fail');
        // let user_story = await get_method(item)
        // await console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa"+user_story)
        // let feature = await get_method(user_story)
        // await console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb"+feature)
        // let epic = await get_method(feature)
        // await console.log("cccccccccccccccccccccccccccc"+epic)
        // // read name epic from id epic
        // let dataEpic = require('./epic.json');
        // await core.setOutput("id", dataEpic[epic] || 'Fail');
    }
    get_epic_id()
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
