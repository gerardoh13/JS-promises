
let deckId, names

document.getElementById("btnOne").addEventListener("click", partOne)
document.getElementById("btnTwo").addEventListener("click", partTwo)
document.getElementById("btnThree").addEventListener("click", partThree)

function clearPage() {
    console.clear()
    deckId = ""
    names = []
    document.body.style.backgroundColor = 'white'
    document.getElementById("partOne").innerText = ""
    $('#getCard').show()
    $("#partTwo").hide()
    document.getElementById("partTwoDiv").innerText = ""
    $("#partThree").hide()
    document.getElementById("pokeArea").innerText = ""
}

document.getElementById("getCard").addEventListener("click", getCard)
document.getElementById("getPokemon").addEventListener("click", getPokemon)

function getPokemon(){
    let baseURL = "https://pokeapi.co/api/v2/pokemon/"
    let pokeData = []
    document.getElementById("pokeArea").innerText = ""
    axios.get(baseURL)
    .then(res => {
        let count = res.data.count
        return axios.get(`${baseURL}?limit=${count}`)
    })
    .then(res => {
        randomPokemon = _.sampleSize(res.data.results, 3)
        return Promise.all(randomPokemon.map(poke => axios.get(poke.url)))
    })
    .then(pokeArr => {
        for (let pokemon of pokeArr){
            pokeData.push({name: pokemon.data.name, imgSrc: pokemon.data.sprites.front_default})
        }
        return Promise.all(pokeArr.map(p => axios.get(p.data.species.url)))
    })
    .then(pokeArr => {
        let pokeDex = pokeArr.map(p => {
            let description = p.data.flavor_text_entries.find(
                entry => entry.language.name === "en"
            )
            return description ? description.flavor_text : "No description available"
        })
        pokeDex.forEach((p, i) => {
            createPokemonCard(pokeData[i], p)
        });
    })
}

function createPokemonCard(obj, desc) {
    let card = `
    <div class="card col ms-3" style="width: 18rem;">
    <img src=${obj.imgSrc} class="card-img-top" alt="pokemon pic">
    <div class="card-body">
      <h5 class="card-title">${obj.name}</h5>
      <p class="card-text">${desc}</p>
    </div>
  </div>
    `
    $("#pokeArea").append(card)

}

function getCard() {
    if (!deckId){
        return
    }
    let baseURL = "https://deckofcardsapi.com/api/deck";
    axios.get(`${baseURL}/${deckId}/draw?count=1`)
    .then(res => {
        let imgSrc = res.data.cards[0].image
        let angle = Math.random() * 90
        let card = document.createElement("img")
        card.setAttribute("src", imgSrc)
        card.classList.add("cardPic")
        card.style.transform = `rotate(${angle}deg)`
        document.getElementById("partTwoDiv").append(card)
        if (res.data.remaining === 0){
            $('#getCard').hide()
        }
    })
}

function partOne() {
    let baseURL = "http://numbersapi.com";
    clearPage()
    axios.get(`${baseURL}/2?json`)
        .then(res => {
            $("#partOne").append(`<p>${res.data.text}</p><hr>`)
            return axios.get(`${baseURL}/5,9,17?json`)
        })
        .then(res => {
            let resObj = res.data
            for (let key in resObj) {
                $("#partOne").append(`<p>${resObj[key]}</p>`)
            }
            return Promise.all(
                Array.from({ length: 4 }, () => {
                    return $.getJSON(`${baseURL}/27?json`);
                })
            )
        })
        .then(res => {
            $("#partOne").append("<hr>")
            for (let fact of res) {
                $("#partOne").append(`<p>${fact.text}</p>`)
            }
        })
}

function partTwo() {
    let baseURL = "https://deckofcardsapi.com/api/deck";
    clearPage()
    document.body.style.backgroundColor = 'green'
    axios.get(`${baseURL}/new/draw/?count=1`)
        .then(res => {
            let card = res.data.cards[0]
            console.log(`card: ${card.value} of ${card.suit}`)
            return axios.get(`${baseURL}/new/draw/?count=1`)
        })
        .then(res => {
            let cardOne = res.data.cards[0]
            cardArr = [cardOne]
            axios.get(`${baseURL}/${res.data.deck_id}/draw?count=1`)
                .then(res => {
                    let cardTwo = res.data.cards[0]
                    cardArr.push(cardTwo)
                    for (let card of cardArr) {
                        console.log(`card: ${card.value} of ${card.suit}`)
                    }
                })
        })
        .then(() => {
            axios.get(`${baseURL}/new/shuffle/?deck_count=1`)
            .then(res => {
                deckId = res.data.deck_id
                $("#partTwo").show()
            })
        })
}

function partThree() {
    let baseURL = "https://pokeapi.co/api/v2/pokemon/"
    clearPage()
    document.body.style.backgroundColor = 'cadetblue'
    axios.get(baseURL)
    .then(res => {
        let count = res.data.count
        return axios.get(`${baseURL}?limit=${count}`)
    })
    .then(res => {
        console.log(res.data)
        randomPokemon = _.sampleSize(res.data.results, 3)
        return Promise.all(randomPokemon.map(poke => axios.get(poke.url)))
    })
    .then(pokeArr => {
        for (let pokemon of pokeArr){
            console.log(pokemon.data)
        }
    })
    .then(() => {
        axios.get(baseURL)
        .then(res => {
            let count = res.data.count
            return axios.get(`${baseURL}?limit=${count}`)
        })
        .then(res => {
            randomPokemon = _.sampleSize(res.data.results, 3)
            return Promise.all(randomPokemon.map(poke => axios.get(poke.url)))
        })
        .then(pokeArr => {
            for (let pokemon of pokeArr){
                names.push(pokemon.data.name)
            }
            return Promise.all(pokeArr.map(p => axios.get(p.data.species.url)))
        })
        .then(pokeArr => {
            let pokeDex = pokeArr.map(p => {
                let description = p.data.flavor_text_entries.find(
                    entry => entry.language.name === "en"
                )
                return description ? description.flavor_text : "No description available"
            })
            pokeDex.forEach((p, i) => {
                console.log(`${names[i]}: ${p}`)
            });
        })
        .then(() => {
            $("#partThree").show()
        })
    })
}

