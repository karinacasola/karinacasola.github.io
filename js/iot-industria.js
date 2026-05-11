const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const database = [
            { 
                text: "PIPELINE", 
                hint: "O 'coração' industrial que transforma ruído em informação. Envolve as etapas de ingestão, pré-processamento e armazenamento.",
                explanation: "O Pipeline de dados é responsável por coletar dados em tempo real (streaming), limpar os ruídos (smoothing) e prepará-los para o modelo de Inteligência Artificial."
            },
            { 
                text: "FIRMATA", 
                hint: "Protocolo de comunicação (pyFirmata2) que permite que um script Python controle a placa Arduino via USB.",
                explanation: "Ele atua conectando a Camada de Aquisição à Camada de Processamento. O Python envia comandos e recebe dados analógicos, como do sensor LDR, atuando como o cérebro da operação."
            },
            { 
                text: "ANOMALIA", 
                hint: "Situação que a IA (como o modelo Isolation Forests) detecta ao avaliar o fluxo de dados em busca de falhas.",
                explanation: "Na detecção de anomalias abordada na aula, o sistema monitora quedas bruscas de luz para prever problemas na operação de forma online e automatizada."
            }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
        // Controle de fim de jogo
        const gameFinished = ref(false);
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
                    if (guessedLetters.value.includes(char) || mistakes.value >= maxMistakes) {
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
            if (availablePuzzles.length === 0) {
                gameFinished.value = true;
                
                if (score.value === 3 && typeof confetti === 'function') {
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
            if (gameOver.value || victory.value || guessedLetters.value.includes(letter)) return;
            guessedLetters.value.push(letter);
            if (!currentPuzzle.value.text.includes(letter)) {
                mistakes.value++;
            }
            if (victory.value) {
                score.value++;
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
            gameFinished.value = false;
            initGame();
        };

        const exportToPDF = () => {
            const element = document.getElementById('report-card');
            
            const opt = {
                margin:       0.5,
                filename:     `relatorio_iot_${new Date().getTime()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: '#0f172a',
                    scrollY: 0, 
                    windowWidth: 1024 
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