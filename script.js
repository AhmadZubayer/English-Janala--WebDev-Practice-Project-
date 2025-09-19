console.log("Connected script.js file");

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

const displayLevelWord = (words) => {
    //console.log(words);
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = " ";
    if(words.length == 0) {
        // alert("no data available at the moment");
         wordContainer.innerHTML = `
         <div class="text-center col-span-full font-bangla py-10 space-y-6">
         <img class = "mx-auto" src= "./assets/alert-error.png">
            <p class="text-xl font-medium text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান । </h2>
        </div>`
        return;
    }
    words.forEach((word) => {
        console.log(word);
        const card = document.createElement('div');
        card.innerHTML = `   <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${
                word.word ? word.word : 'Word Not Found :('}</h2>
            <p class="font-semibold">Meaning / Pronounciation</p>
            <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "Meaning Not Found"} / ${word.pronunciation ? word.pronunciation : "Pronounciation not found"}</div>
            <div class="flex justify-between items-center">
                <button class="btn bg-[#1A91FF30] hover:bg-[#1A91FF80] "><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF30] hover:bg-[#1A91FF80] "><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
`;
        wordContainer.append(card);
    })

}



const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = " ";
    for(let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
         <button id="lesson-btn-${lesson.level_no}" onclick= 'loadLevelWord(${lesson.level_no})' class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open-reader"></i> Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.append(btnDiv);
    }
};
loadLessions();