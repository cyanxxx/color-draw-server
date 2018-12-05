const Qs = require('../db/index');
export function getRandomSubject() {
    var rand = Math.random();
    return new Promise((reslove, reject) => {
        Qs.findOne({
            random: {
                $gte: rand
            }
        }, (err, result) => {
            reslove(result)
        })
    })
} 
     
