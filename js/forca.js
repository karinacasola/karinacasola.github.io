const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // --- Banco de Palavras ---
        const database = [
            { text: "MIO DIO", hint: "Expressão clássica de choque e desespero italiano." },
            { text: "MATTEO", hint: "O grande amor imigrante de Giuliana." },
            { text: "GIULIANA", hint: "A mocinha que sofre do primeiro ao último capítulo." },
            { text: "AS TRES GRACAS", hint: "O trio inseparável que dá nome à novela." },
            { text: "TESTE DE DNA", hint: "O terror das vilãs na reta final da novela." },
            { text: "AMNESIA", hint: "Condição médica que atinge quem descobre um grande segredo." },
            { text: "BARRACO", hint: "Geralmente acontece no meio de um casamento ou velório." },
            { text: "HERANCA", hint: "O motivo de 90% das brigas na família rica da novela." }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
        // Teclado separado em fileiras exatamente como no print
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U'],
            ['I', 'O', 'P', 'A', 'S', 'D', 'F'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X'],
            ['C', 'V', 'B', 'N', 'M']
        ];

        const gallowsFrames = [
            `
  +---+
  |   |
      |
      |
      |
      |
=========`, 
            `
  +---+
  |   |
  O   |
      |
      |
      |
=========`, 
            `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`, 
            `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`, 
            `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`, 
            `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`, 
            `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========` 
        ];

        const currentAsciiArt = computed(() => gallowsFrames[mistakes.value]);

        // Agrupa as palavras para evitar que uma palavra quebre na metade
        const displayedWordGroups = computed(() => {
            if (!currentPuzzle.value.text) return [];
            
            return currentPuzzle.value.text.split(' ').map(word => {
                return word.split('').map(char => {
                    if (guessedLetters.value.includes(char) || mistakes.value >= maxMistakes) {
                        return char;
                    }
                    return '-'; // O tracinho azul flutuante igual ao seu print
                });
            });
        });

        const gameOver = computed(() => mistakes.value >= maxMistakes);
        
        const victory = computed(() => {
            if (!currentPuzzle.value.text) return false;
            const lettersOnly = currentPuzzle.value.text.replace(/ /g, '').split('');
            return lettersOnly.every(char => guessedLetters.value.includes(char));
        });

        const initGame = () => {
            let newPuzzle;
            do {
                newPuzzle = database[Math.floor(Math.random() * database.length)];
            } while (currentPuzzle.value.text === newPuzzle.text && database.length > 1);

            currentPuzzle.value = newPuzzle;
            guessedLetters.value = [];
            mistakes.value = 0;

            if(victory.value) score.value++;
        };

        const guessLetter = (letter) => {
            if (gameOver.value || victory.value || guessedLetters.value.includes(letter)) return;

            guessedLetters.value.push(letter);

            if (!currentPuzzle.value.text.includes(letter)) {
                mistakes.value++;
            }

            if (victory.value) triggerConfetti();
        };

        const getKeyClass = (key) => {
            if (!guessedLetters.value.includes(key)) return '';
            if (currentPuzzle.value.text.includes(key)) return 'correct';
            return 'wrong';
        };

        const triggerConfetti = () => {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#3e8eff', '#10B981', '#ffffff']
                });
            }
        };

        const handleKeyPress = (e) => {
            const char = e.key.toUpperCase();
            // Permite digitação se a tecla for uma letra válida
            const isValid = keyboardLayout.some(row => row.includes(char));
            if (isValid) guessLetter(char);
        };

        onMounted(() => {
            initGame();
            window.addEventListener('keydown', handleKeyPress);
        });

        return {
            currentPuzzle,
            displayedWordGroups,
            guessedLetters,
            mistakes,
            score,
            currentAsciiArt,
            gameOver,
            victory,
            keyboardLayout,
            guessLetter,
            getKeyClass,
            initGame
        };
    }
}).mount('#app');