const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img'),
    toggleButton = document.getElementById('toggle-progress');;
    


const music = new Audio();

const rules = [
    // { 
    //     start: 9, end: 200, action: () => artist.textContent = 'Out of Touch' 
    // },
    // { 
    //     start: 255, end: 400, action: () => artist.textContent = 'Another Artist' 
    // },
    // { 
    //     start: 300, end: 400, action: () => artist.textContent = 'Another Artist' 
    // }
];



const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Flash FM',
        cover: 'assets/cover.jpg',
        artist: '',
    },
    {
        path: 'https://www.youtube.com/embed/-B6N4pIikMw',
        displayName: 'Radio Espantoso',
        cover: 'assets/cover.jpg',
        artist: '',
    }//,
    // {
    //     path: 'assets/3.mp3',
    //     displayName: 'Spaguetti del Rock',
    //     cover: 'assets/3.jpg',
    //     artist: 'Divididos',
    // },
    // {
    //     path: 'assets/4.mp3',
    //     displayName: 'Lady (Hear me Tonight)',
    //     cover: 'assets/4.jpg',
    //     artist: 'Modjo',
    // }

];
songs.forEach((song, index) => {
    if (song.displayName === 'Flash FM') {
        rules.push(
            {
                start: 9, end: 200, action: () => artist.textContent = 'Out of Touch' 
            },
            { 
                start: 255, end: 400, action: () => artist.textContent = 'Another Artist' 
            },
            { 
                start: 300, end: 400, action: () => artist.textContent = 'Another Artist' 
            }

        );
    } else if (song.displayName === 'Radio Espantoso') {
        rules.push(
            {
                start: 9, end: 200, action: () => artist.textContent = 'Tema a confirmar (?' 
            }
        );
    }
});
const introSound = new Audio('assets/intro.mp3'); // Archivo de sonido de 2 segundos

function playMusicWithIntro() {
    // Reproduce el sonido introductorio
    introSound.play();
    introSound.onended = () => {
        // Cuando el sonido introductorio termina, reproduce la música principal
        playMusic();
    };
}

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusicWithIntro();
    }
}

function playMusic() {
    isPlaying = true;
    // Cambiar el ícono del botón de reproducción
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    image.style.animation = 'girar 12s linear infinite';
    music.loop = true; // Habilitar loop para la canción principal
    music.play();
}

// Llama a la función con el intro cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    loadMusic(songs[musicIndex]); // Cargar la primera canción
    playMusicWithIntro(); // Reproducir intro y música
});

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    image.style.animation = 'none'
    music.loop = true;
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function playRandomMusic() {
    // Asegúrate de cargar la música actual
    loadMusic(songs[musicIndex]);

    // Espera a que los metadatos de la música estén disponibles
    music.addEventListener('loadedmetadata', () => {
        // Genera un tiempo aleatorio dentro de la duración del audio
        const randomTime = Math.random() * music.duration;
        music.currentTime = randomTime; // Ajusta el tiempo inicial
    });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    playRandomMusic();
});

function changeMusic(direction) {
    music.loop = false; // Desactiva el loop antes de cambiar de canción
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusicWithIntro();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Formato del tiempo
    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;

    // Verifica las reglas y aplica las acciones si el tiempo está en el rango
    let isInRange = false; // Indicador para saber si está dentro de algún rango
    rules.forEach(rule => {
        if (Math.floor(currentTime) >= rule.start && Math.floor(currentTime) <= rule.end) {
            rule.action();
            isInRange = true; // Marca como "dentro de un rango"
        }
    });

    // Si no está dentro de ningún rango, vacía el contenido del artista
    if (!isInRange) {
        artist.textContent = '';
    }
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Agrega un evento de clic al botón
toggleButton.addEventListener('click', () => {
    if (playerProgress.style.display === 'none') {
        // Mostrar el progreso
        playerProgress.style.display = 'block';
        toggleButton.textContent = 'Desactivar'; // Cambiar texto del botón
    } else {
        // Ocultar el progreso
        playerProgress.style.display = 'none';
        toggleButton.textContent = 'Activar'; // Cambiar texto del botón
    }
});

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', () => changeMusic(1));
prevBtn.addEventListener('click', () => changeMusic(-1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);