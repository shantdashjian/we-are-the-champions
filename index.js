import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
import {getDatabase, ref, push, onValue, update} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js'

const appSettings = {
	databaseURL: "https://we-are-the-champions-506bc-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, 'endorsements')

const endorsementTextEl = document.getElementById('endorsement-text')
const endorserEl = document.getElementById('endorser')
const endorseeEl = document.getElementById('endorsee')
const publishFormEl = document.getElementById('publish-form')
const endorsementsListEl = document.getElementById('endorsements-list')

publishFormEl.addEventListener('submit', (e) => {
	e.preventDefault()
	push(endorsementsInDB, {
		endorsementText: endorsementTextEl.value,
		endorser: endorserEl.value,
		endorsee: endorseeEl.value,
		likes: 0
	})
	publishFormEl.reset()
})

onValue(endorsementsInDB, (snapshot) => {
	if (snapshot.exists()) {
		const endorsements = updateEndorsementsWith(snapshot)
		let innerHTML = ''
		endorsements.forEach((value, key) => {
			const {endorsementText, endorser, endorsee, likes} = value
			innerHTML += `
				<div class="endorsement flex column round-border">
					<p class="to">To ${endorsee}</p>	
					<p class="text">${endorsementText}</p>	
					<div class="from-likes-container flex">
						<p class="from">From ${endorser}</p>
						<div class="likes-container">
							<i class="fa-solid fa-heart" onclick="like('${key}')"></i>
							<span class="likes-count">${likes}</span>
						</div>	
					</div>
				</div>
			`
		})
		endorsementsListEl.innerHTML = innerHTML
	} else {
		endorsementsListEl.innerHTML = `<h2 class="no-endorsements">There are no endorsements yet ...</h2>`
	}
})

function updateEndorsementsWith(snapshot) {
	const endorsements = getEndorsementsFromLocalStorage()
	let snapshotData = Object.entries(snapshot.val()).reverse();
	let updatedEndorsements = new Map()
	snapshotData.forEach(([ key, value ]) => {
		updatedEndorsements.set(key, {
			...value,
			liked: endorsements.has(key) ? endorsements.get(key).liked : false
		})
	})
	saveEndorsementsInLocalStorage(updatedEndorsements);
	return updatedEndorsements
}

window.like = function(key) {
	let endorsements = getEndorsementsFromLocalStorage()
	let endorsement = endorsements.get(key)
	if (endorsement.liked) {
		endorsement.likes--
	} else {
		endorsement.likes++
	}
	endorsement.liked = !(endorsement.liked)
	saveEndorsementsInLocalStorage(endorsements)
	const endorsementLikesRef = ref(database,`endorsements/${key}`)
	update(endorsementLikesRef, {likes: endorsement.likes})
}

function getEndorsementsFromLocalStorage() {
	return localStorage.getItem('endorsements')
		? new Map(JSON.parse(localStorage.getItem('endorsements')))
		: new Map();
}

function saveEndorsementsInLocalStorage(endorsements) {
	localStorage.setItem('endorsements', JSON.stringify(Array.from(endorsements)))
}



