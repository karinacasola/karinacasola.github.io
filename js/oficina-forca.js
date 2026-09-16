const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // Banco de dados atualizado com foco em Arduino e pyFirmata2
        const database = [
            { 
                text: "MICROPYTHON", 
                hint: "Linguagem que o Arduino Uno R3 NÃO consegue rodar nativamente devido à sua limitação de apenas 2KB de RAM.",
                explanation: "Como o Uno não possui memória suficiente para rodar essa linguagem internamente, utilizamos o protocolo Firmata para que o Python rode no PC e apenas envie instruções à placa."
            },
            { 
                text: "FIRMATA", 
                hint: "Protocolo de comunicação (via biblioteca pyFirmata2) que conecta a lógica no PC com a aquisição de dados na placa.",
                explanation: "Ele transforma a placa em uma unidade escrava. O computador roda o Python (cérebro) e o microcontrolador apenas executa as ordens, lidando com portas digitais e analógicas."
            },
            { 
                text: "PORTENTA", 
                hint: "Modelo de placa da fundação Arduino (ex: modelo C33) que, diferente do Uno, suporta rodar MicroPython nativamente.",
                explanation: "Placas como a Portenta C33 ou a Nano ESP32 possuem processadores mais potentes e mais memória, sendo alternativas viáveis para quando você não quer depender do computador conectado o tempo todo."
            }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
        // Controle de fim de jogo e looping
        const gameFinished = ref(false);
        const playerLost = ref(false);
        const currentDate = ref(new Date().toLocaleDateString('pt-BR'));
        
        let availablePuzzles = [...database];
        
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U'],
            ['I', 'O', 'P', 'A', 'S', 'D', 'F'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X'],
            ['C', 'V', 'B', 'N', 'M']
        ];

        const gallowsFrames = [
            `  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========` 
        ];

        const currentAsciiArt = computed(() => gallowsFrames[mistakes.value]);

        const displayedWordGroups = computed(() => {
            if (!currentPuzzle.value.text) return [];
            return currentPuzzle.value.text.split(' ').map(word => {
                return word.split('').map(char => {
                    if (guessedLetters.value.includes(char) || gameOver.value) {
                        return char;
                    }
                    return '-';
                });
            });
        });

        const gameOver = computed(() => mistakes.value >= maxMistakes);
        
        const victory = computed(() => {
            if (!currentPuzzle.value.text) return false;
            const lettersOnly = currentPuzzle.value.text.replace(/ /g, '').split('');
            return lettersOnly.every(char => guessedLetters.value.includes(char));
        });

        const isLastQuestion = computed(() => availablePuzzles.length === 0);

        const initGame = () => {
            if (availablePuzzles.length === 0 || playerLost.value) {
                gameFinished.value = true;
                
                if (score.value === database.length && typeof confetti === 'function') {
                    confetti({ particleCount: 200, spread: 90, origin: { y: 0.3 } });
                }
                return;
            }

            const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
            currentPuzzle.value = availablePuzzles[randomIndex];
            availablePuzzles.splice(randomIndex, 1);
            
            guessedLetters.value = [];
            mistakes.value = 0;
        };

        const guessLetter = (letter) => {
            if (gameOver.value || victory.value || gameFinished.value || guessedLetters.value.includes(letter)) return;
            
            guessedLetters.value.push(letter);
            
            if (!currentPuzzle.value.text.includes(letter)) {
                mistakes.value++;
                
                if (mistakes.value >= maxMistakes) {
                    playerLost.value = true;
                    gameFinished.value = true;
                }
            } else if (victory.value) {
                score.value++;
                
                setTimeout(() => {
                    if (!gameFinished.value) {
                        initGame();
                    }
                }, 3000); 
            }
        };

        const getKeyClass = (key) => {
            if (!guessedLetters.value.includes(key)) return '';
            if (currentPuzzle.value.text.includes(key)) return 'correct';
            return 'wrong';
        };
        
        const handleKeyPress = (e) => {
            if (gameFinished.value) return; 
            const char = e.key.toUpperCase();
            const isValid = keyboardLayout.some(row => row.includes(char));
            if (isValid) guessLetter(char);
        };

        const restartGame = () => {
            availablePuzzles = [...database];
            score.value = 0;
            playerLost.value = false;
            gameFinished.value = false;
            initGame();
        };

        const exportToPDF = () => {
            const element = document.getElementById('report-card');
            
            // Força o scroll pro topo antes de tirar o "print" do html2canvas para evitar cortes
            window.scrollTo(0, 0);

            const opt = {
                margin:       0.5,
                // Nome ajustado conforme solicitado
                filename:     `relatorio-oficina-${new Date().getTime()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: '#0f172a'
                    // Removido scrollY: 0 e windowWidth fixo para parar de "espremer" e cortar o PDF
                },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        };

        onMounted(() => {
            initGame();
            window.addEventListener('keydown', handleKeyPress);
        });

        return {
            currentPuzzle, displayedWordGroups, guessedLetters, mistakes, score,
            currentAsciiArt, gameOver, victory, keyboardLayout, guessLetter, getKeyClass, 
            initGame, gameFinished, isLastQuestion, currentDate, restartGame, exportToPDF
        };
    }
}).mount('#app');