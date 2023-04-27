const client_id_spotify = 'c3ec82d6e4b144edb00906ebd114d00c'
const client_secret_spotify = 'ffe7d711fa1e4f03b385d8a3abbd9a6b'
let token = ''

function onTokenJson(json){
    token = json.access_token
}

function onHomeClick(event){
    document.getElementById('quiz').classList.add('hidden')
    document.getElementById('stats').classList.add('hidden')
    document.getElementById('tracks').classList.add('hidden')
    document.getElementById('result-area').classList.remove('hidden')

}

function onResultssJson(json){
    const resultsArea = document.querySelector('#result-area')
    resultsArea.innerHTML = 'ULTIMI RISULTATI'
    resultsArea.classList.add('results')
    for (let i = 0; i<10; i++){
        resultString = json.data[i].home_team.full_name + " " + json.data[i].home_team_score + "-" + json.data[i].visitor_team_score
        + " " + json.data[i].visitor_team.full_name

        const resMatch = document.createElement('div')
        resMatch.innerHTML = resultString

        resultsArea.appendChild(resMatch)
    }
}

function onPJson(json){
    console.log(json)
    const player_id = json.data[0].id
    const statsUrl = 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=' + player_id

    fetch(statsUrl).then(onResponse).then(onStatsPJson)
}

function onMJson(json){
    const statsContainer = document.getElementById('stats-container')
    statsContainer.classList.add('results')
    statsContainer.innerHTML = 'RISULTATI IN REGULAR SEASON'
    for (let i = 0; i<10; i++){
        resultString = json.data[i].home_team.full_name + " " + json.data[i].home_team_score + "-" + json.data[i].visitor_team_score
        + " " + json.data[i].visitor_team.full_name

        const resMatch = document.createElement('div')
        resMatch.innerHTML = resultString

        statsContainer.appendChild(resMatch)
    }
}


function getTeamId(team_param){
    const keys = Object.keys(TEAMS)
    for(k of keys){
        if(TEAMS[k].abbreviation === team_param){
            return TEAMS[k].id
        }
    }

    return ''
}

function onStatsPJson(json){
    console.log(json)
    const statsContainer = document.getElementById('stats-container')
    statsContainer.classList.remove('results')
    statsContainer.innerHTML = ''
    const statsP = Object.keys(json.data[0])
    for (const statistica of statsP){
        const stringStat = statistica + ': ' + json.data[0][statistica]
        const entryP = document.createElement('div')
        entryP.innerHTML = stringStat
        statsContainer.appendChild(entryP)
    }
}

function onResponse(response){
    return response.json()
}

function searchStats(event){
    event.preventDefault()
    const param = document.querySelector('#tipoStat').value;


    if(param === 'giocatori'){
        const input = encodeURIComponent(document.querySelector('#text_input').value)
        searchUrl = 'https://www.balldontlie.io/api/v1/players?search=' + input
        fetch(searchUrl).then(onResponse).then(onPJson)
    }

    if(param === 'partita'){
        searchUrl = 'https://www.balldontlie.io/api/v1/games?start_date=2022-10-01'
        const inputs = document.querySelector('#text_input').value.split(" ")
        for (team_param of inputs){
            const teamId = getTeamId(team_param)
            searchUrl = searchUrl + '&team_ids[]=' + teamId
         }

        fetch(searchUrl).then(onResponse).then(onMJson)
    }
}


fetchUrl = 'https://www.balldontlie.io/api/v1/games?start_date=2023-04-08'
fetch(fetchUrl).then(onResponse).then(onResultssJson)

function onTestClick(event){
    document.getElementById('stats').classList.add('hidden')
    document.getElementById('tracks').classList.add('hidden')
    document.getElementById('result-area').classList.add('hidden')
    const test = document.getElementById('quiz')
    test.classList.remove('hidden')
}

function onStatsClick(event){
    document.getElementById('quiz').classList.add('hidden')
    document.getElementById('tracks').classList.add('hidden')
    document.getElementById('result-area').classList.add('hidden')
    const stats = document.getElementById('stats')
    stats.classList.remove('hidden')
    stats.classList.add('stats')
}

function onTrackClick(event){
    document.getElementById('quiz').classList.add('hidden')
    document.getElementById('stats').classList.add('hidden')
    document.getElementById('result-area').classList.add('hidden')
    const tracks = document.getElementById('tracks')
    tracks.classList.remove('hidden')
}

function onTrackJson(json){
    console.log(json)
    const trackContainer = document.getElementById('track-container')
    trackContainer.innerHTML=''

    const title = document.createElement('div')
    title.innerHTML=  json.tracks.items[0].name +' - ' +json.tracks.items[0].artists[0].name

    const img = document.createElement('img')
    img.src = json.tracks.items[0].album.images[0].url

    trackContainer.appendChild(img)
    trackContainer.appendChild(title)
}

function searchTracks(event){
    event.preventDefault()
    const player = document.querySelector('#tipoGiocatore').value
    const track_name = encodeURIComponent(MAP[player].title)
    const artist_name = encodeURIComponent(MAP[player].artist)

    const searchUrl = 'https://api.spotify.com/v1/search' + '?q=' + track_name +'&type=track&artist:' + artist_name

    fetch(searchUrl, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(onResponse).then(onTrackJson)

}



fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id='+ client_id_spotify +  '&client_secret=' + client_secret_spotify
}).then(onResponse).then(onTokenJson)

const testButton = document.getElementById('test-button')
const statsButton = document.getElementById('stats-button')
const tracksButton = document.getElementById('tracks-button')
const homeButton = document.getElementById('home-button')
const formStats = document.querySelector('#stats form')
const formTracks = document.querySelector('#tracks form')


testButton.addEventListener('click', onTestClick)
statsButton.addEventListener('click', onStatsClick)
tracksButton.addEventListener('click', onTrackClick)
homeButton.addEventListener('click', onHomeClick)
formStats.addEventListener('submit', searchStats)
formTracks.addEventListener('submit', searchTracks)