const list = document.querySelector(".list");
const apiURL = 'https://pokeapi.co/api/v2/pokemon'
const searchInput = document.getElementById('search__input')

let pagesHelper = {
    next: null,
    previous: null,
    lastFetch: apiURL,
}

searchInput.addEventListener("keypress", e => {
    if (e.code === 'Enter' && searchInput.value !== '') {
        searchPokemon(searchInput.value)
    }
})

searchInput.addEventListener("keyup", e => {
    if (searchInput.value === '') {
        getData(pagesHelper.lastFetch)
    }
})

function updatePagesHelper(data) {
    if (data === 'reset') {
        pagesHelper = {
            ...pagesHelper,
            next: null,
            previous: null,
        }
    }
    if (data.next) {
        pagesHelper = {
            ...pagesHelper,
            next: data.next
        }
    }
    if (data.previous) {
        pagesHelper = {
            ...pagesHelper,
            previous: data.previous
        }
    }
}

function handlePage(move) {
    if (move === 'next') {
        getData(pagesHelper.next)
    } else if (move === 'previous') {
        getData(pagesHelper.previous)
    }
}

function getData(url) {
    fetch(url)
        .then(response => {
            response.json().then(data => {
                list.innerHTML = ''
                const pokemonArray = createPokemonArray(data)
                updatePagesHelper(data)
                buildList(pokemonArray)
                pagesHelper = {
                    ...pagesHelper,
                    lastFetch: url,
                }
            })
        })
}

function searchPokemon(search) {
    fetch(`${apiURL}/${search}`)
        .then(response => {
            response.json().then(data => {
                if (data) {
                    list.innerHTML = ''
                    const pokemonArray = [createSinglePokemon(data)]
                    updatePagesHelper('reset')
                    buildList(pokemonArray)
                }
            })
        })
}

function createSinglePokemon(data) {
    return {
        name: data.name,
        url: data.sprites.other['official-artwork'].front_default
    }
}

function createPokemonArray(data) {
    const pokemonArray = []
    data.results.forEach(pokemon => {
        pokemonArray.push({
            name: pokemon.name,
            url: getPokemonPhotoURL(pokemon.url),
        })
    })
    return pokemonArray
}

function buildList(pokemonArray) {
    pokemonArray.forEach(pokemon => {
        const html = `
            <li class='items'>
                <img class='image' src=${pokemon.url}>
                <p class='name'>${pokemon.name}</p>
            </li>
        `
        list.innerHTML += html
    })
}

function getPokemonPhotoURL(url) {
    const parcialURL = url.split('/')
    const pokemonId = parcialURL[parcialURL.length-2]
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
}

getData(apiURL)