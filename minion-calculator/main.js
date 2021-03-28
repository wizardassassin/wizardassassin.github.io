const deepCopyFunction = (inObject) => {
    let outObject, value, key
    if (typeof inObject !== "object" || inObject === null) {
        return inObject
    }
    outObject = Array.isArray(inObject) ? [] : {}
    for (key in inObject) {
        value = inObject[key]
        outObject[key] = deepCopyFunction(value)
    }
    return outObject
}
const nestedArray = (array) => {
    let arr = [];
    for (let index = 0; index < array; index++) arr.push([])
    return arr
}
fetch('./equations.json')
    .then(res => res.json())
    .then(minions => {
        fetch('https://api.hypixel.net/skyblock/bazaar')
            .then(res => res.json())
            .then(json => {
                const name = Object.getOwnPropertyNames(json.products);
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                const value = name.map(x => {
                    if (json['products'][x]['buy_summary'][0] == undefined) return 0
                    return json['products'][x]['buy_summary'][0]['pricePerUnit']
                });
                const result = {};
                name.forEach((u, i) => result[u] = value[i]);

                const profit = [];
                const parseV = nestedArray(11);
                const names = Object.getOwnPropertyNames(minions);
                for (const types of names) {
                    const testt = [];
                    const test = Object.getOwnPropertyNames(minions[types].items);
                    for (const typee of test) {
                        testt.push(minions[types].items[typee] * result[typee])
                    };

                    const tiers = [];
                    for (let index = 0; index < 11; index++) {
                        const profit = Number(((0.75 / minions[types].tier[index]) * (testt.reduce(reducer) + result['ENCHANTED_DIAMOND'] * 0.1)).toFixed(4))
                        tiers.push(profit)
                        parseV[index].push(profit)
                    }
                    profit.push(tiers)
                };
                const point = {};
                names.forEach((a, b) => point[a] = profit[b]);

                for (const rows in point) {
                    const parenttbl = document.getElementById("rows");
                    const newtr = document.createElement('tr');
                    const firstth = document.createElement('th');
                    firstth.innerHTML = rows;
                    firstth.setAttribute('scope', 'rownames');
                    newtr.appendChild(firstth)
                    for (const values of point[rows]) {
                        const newtd = document.createElement('td');
                        newtd.innerHTML = values;
                        newtr.appendChild(newtd)
                    }
                    parenttbl.appendChild(newtr)
                }

                console.log(names)
                console.log(point)
                console.log(parseV)
                let minionParse = nestedArray(52);
                let minionParse2 = deepCopyFunction(parseV);
                minionParse2.forEach(element => {
                    element.sort((a, b) => b - a)
                })
                minionParse2.forEach(x => {
                    x.forEach((y, yi) => {
                        minionParse[yi].push(y);
                    })
                });
                console.log(minionParse)
                let namedArray = [];
                for (const type of minionParse) {
                    let temptbl = document.getElementById("rows");
                    let temptr = document.createElement('tr');
                    let tempth = document.createElement('th');
                    let namedObj = {};
                    let counter = 1;
                    tempth.innerHTML = "Best Minions";
                    temptr.appendChild(tempth)
                    tempth.setAttribute('scope', 'rownames');
                    type.forEach((tierss, tempindex) => {
                        let temptd = document.createElement('td');
                        let miniontemp = names[parseV[tempindex].indexOf(tierss)]
                        temptd.innerHTML = `${miniontemp}:<br>${tierss}`;
                        temptr.appendChild(temptd)
                        namedObj[miniontemp + '-' + counter] = tierss
                        counter++
                    })
                    temptbl.appendChild(temptr)
                    namedArray.push(namedObj)
                }
                console.log(namedArray)
            });
    });