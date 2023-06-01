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
		hearts: 0
	})
	publishFormEl.reset()
})

onValue(endorsementsInDB, (snapshot) => {
	if (snapshot.exists()) {
		const endorsements = Object.entries(snapshot.val()).reverse()
		let innerHTML = ''
		endorsements.forEach(endorsementEntry => {
			const [endorsementKey, endorsementValue] = endorsementEntry
			const {endorsementText, endorser, endorsee, hearts} = endorsementValue
			innerHTML += `
				<div class="endorsement flex column round-border">
					<p class="to">To ${endorsee}</p>	
					<p class="text">${endorsementText}</p>	
					<div class="from-hearts-container flex">
						<p class="from">From ${endorser}</p>
						<div class="hearts-container">
							<i class="fa-solid fa-heart" onclick="increaseHearts('${endorsementKey}', '${hearts}')"></i>
							<span class="hearts-count">${hearts}</span>
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

window.increaseHearts = (endorsementKey, endorsementHearts) => {
	const endorsementHeartsRef = ref(database,`endorsements/${endorsementKey}`)
	update(endorsementHeartsRef, {hearts: Number(endorsementHearts) + 1})
}



