const Axios = require('axios');
require('dotenv/config');
exports.getListTranding = async (req, res) => {

    var date = new Date(); // Date Now

    date.setDate(date.getDate() - 30); // Set Date Now - 30 days as the new date for get the trending repositories in the last 30 days
    try {

        // i'm using Axios to send HTTP Request to the github endpoint 

        const response = await Axios.get(`${process.env.GITHUB}/search/repositories?q=created:>${date.toISOString().split('T')[0]}&page=1&per_page=100&sort=stars&order=desc`);

        if (!response) {
            res.status(404).json({
                data: null
            })
        }

        // get items from response
        const { items } = response.data;

        // to get number of repos by language ; i used reduce and Map()
        //
        // in the first action countsMap gonna be initialiazed by new Map() , take language as a key and 1 as a value .
        // 
        // in the remaining actions, countsMap will add 1 to the last value of counter goted by key.
        //
        // if the language (key) dosen't exist in the countsMap, then we will add a new key with 1 as a value.

        const numberOfReposByLanguage = items.reduce((countsMap, item) => countsMap.set(item.language, countsMap.get(item.language) + 1 || 1), new Map());

        // im using a new map to list the repos (values) by programming language (key) 

        let ListReposByLanguageMap = new Map();
        items.forEach((item) => {
            let array;
            if (ListReposByLanguageMap.get(item.language)) {
                array = ListReposByLanguageMap.get(item.language);
                array.push(item.full_name);
            } else {
                array = [item.full_name]
            }
            ListReposByLanguageMap.set(item.language, array);
        });

        // merge maps to get a single array contain the number and list of repos

        const finleArray = [];
        let count = 0;
        for (let [key, value] of numberOfReposByLanguage) {
            count = count + value;
            finleArray.push({
                language: key,
                numberRepos: value,
                listRepos: ListReposByLanguageMap.get(key)
            })
        }

        // Sort language by numberRepos

        finleArray.sort((a, b) => {
            if (a.numberRepos > b.numberRepos) {
                return -1
            } else if (a.numberRepos < b.numberRepos) {
                return 1
            } else {
                return 0
            }
        })
        res.json(finleArray)
    } catch (err) {
        console.log(err);
        res.status(500).json('Internal error');
    }

}