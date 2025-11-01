console.log("Connected script.js file");

const manageSpinner = (status) => {
    if(status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}



const loadLessions = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displayLesson(json.data));
}

const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn");
    console.log(lessonBtns);
    lessonBtns.forEach((btn) => btn.classList.remove("active"));
}

const loadLevelWord = (id) => {
    //console.log(id);
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    //console.log(url);
    fetch(url).then((res) => res.json()).
        then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");
            displayLevelWord(data.data);
        });
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    //console.log(details);
    displayWordDetails(details.data);
}

const createElements = (synonyms) => {
    if (!synonyms || synonyms.length === 0) {
        return '<p class="text-gray-500">No synonyms available</p>';
    }
    return synonyms.map(synonym => `<span class="badge badge-primary mr-2 mb-2">${synonym}</span>`).join('');
}

const displayWordDetails = (word) => {
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation
        })
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Synonym</h2>
            <div class="">${createElements(word.synonyms)}</div>
          </div>
    
    
    `;
    document.getElementById("word_modal").showModal();
};


const displayLevelWord = (words) => {
   
    //console.log(words);
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = " ";
    if (words.length == 0) {
        // alert("no data available at the moment");
        wordContainer.innerHTML = `
         <div class="text-center col-span-full font-bangla py-10 space-y-6">
         <img class = "mx-auto" src= "./assets/alert-error.png">
            <p class="text-xl font-medium text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান । </h2>
        </div>`
        manageSpinner(false);
        return;
        
    }
    words.forEach((word) => {
        console.log(word);
        const card = document.createElement('div');
        card.innerHTML = `   <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : 'Word Not Found :('}</h2>
            <p class="font-semibold">Meaning / Pronounciation</p>
            <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "Meaning Not Found"} / ${word.pronunciation ? word.pronunciation : "Pronounciation not found"}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF30] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF30] hover:bg-[#1A91FF80] "><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
`;
        wordContainer.append(card);
        
    })
    manageSpinner(false);

}



const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = " ";
    for (let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
         <button id="lesson-btn-${lesson.level_no}" onclick= 'loadLevelWord(${lesson.level_no})' class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open-reader"></i> Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.append(btnDiv);
    }
};
loadLessions();

document.getElementById('btn-search').addEventListener("click", () => {
    removeActive();
    const input = document.getElementById('input-search');
    const searchVal = input.value.trim().toLowerCase();
    console.log(searchVal);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json()).then((data) => {
        const allWords = data.data;
        console.log(allWords);
        const filterWords = allWords.filter((words) => 
        words.word.toLowerCase().includes(searchVal));
        displayLevelWord(filterWords);
    });
});