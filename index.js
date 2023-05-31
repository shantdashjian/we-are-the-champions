import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
import {getDatabase, ref, push, onValue, update} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js'

const appSettings = {
	databaseURL: "https://we-are-the-champions-506bc-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, 'endorsements')

const endorsementTextEl = document.getElementById('endorsement-text')
const endorsementFromEl = document.getElementById('endorsement-from')
const endorsementToEl = document.getElementById('endorsement-to')
const publishFormEl = document.getElementById('publish-form')
const endorsementsListEl = document.getElementById('endorsements-list')

publishFormEl.addEventListener('submit', (e) => {
	e.preventDefault()
	push(endorsementsInDB, {
		text: endorsementTextEl.value,
		from: endorsementFromEl.value,
		to: endorsementToEl.value,
		hearts: 0
	})
	publishFormEl.reset()
})

onValue(endorsementsInDB, (snapshot) => {
	if (snapshot.exists()) {
		const endorsements = Object.entries(snapshot.val()).reverse()
		let innerHTML = ''
		endorsements.forEach(endorsementEntry => {
			const endorsementKey = endorsementEntry[0]
			const endorsementValue = endorsementEntry[1]
			innerHTML += `
				<div class="endorsement flex column">
					<p class="to">To ${endorsementValue.to}</p>	
					<p class="text">${endorsementValue.text}</p>	
					<div class="from-hearts-container flex">
						<p class="from">From ${endorsementValue.from}</p>
						<div class="hearts-container">
							<i class="fa-solid fa-heart" onclick="increaseHearts('${endorsementKey}', '${endorsementValue.hearts}')"></i>
							<span class="hearts-count">${endorsementValue.hearts}</span>
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



