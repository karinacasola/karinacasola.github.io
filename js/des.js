const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const database = [
            { 
                text: "PREDITIVO", 
                hint: "Modelo de desenvolvimento onde o planejamento é feito de forma extensiva no início. [cite: 48, 49]",
                explanation: "É ideal para cenários com requisitos muito claros e rígidos, onde o risco de errar é fatal (ex: sonda espacial). [cite: 99, 100]"
            },
            { 
                text: "ADAPTATIVO", 
                hint: "Modelo que aceita que requisitos podem mudar, focando em aprender com o processo. [cite: 82, 83]",
                explanation: "Ideal para cenários onde o cliente não sabe bem o que quer, englobando métodos como Prototipação e Espiral. [cite: 84, 86, 99]"
            },
            { 
                text: "AGIL", 
                hint: "Metodologia com foco em entregas rápidas, constantes e satisfação total do cliente. [cite: 91, 92]",
                explanation: "É a melhor escolha quando há mudança constante, inovação e necessidade de entrega rápida, como em aplicativos de celular. [cite: 45, 99]"
            },
            { 
                text: "CASCATA", 
                hint: "Modelo preditivo sequencial puro, onde se avança um passo de cada vez (Requisitos, Design, Código). [cite: 51, 59]",
                explanation: "Possui variações como a 'com feedback' que permite revisões pontuais, ou a 'sobreposta' que ganha tempo iniciando o design antes do fim dos requisitos. [cite: 60, 106, 108]"
            },
            { 
                text: "ESPIRAL", 
                hint: "Modelo adaptativo que foca em Análise de Risco. [cite: 86, 87]",
                explanation: "O projeto evolui em ciclos, onde cada volta é uma iteração que reduz o risco do projeto antes do próximo passo. [cite: 87, 133]"
            },
            { 
                text: "SCRUM", 
                hint: "Modelo ágil focado na gestão de equipe através de ciclos curtos. [cite: 94, 227]",
                explanation: "Define papéis como PO e Scrum Master, eventos como Dailies e Sprints, e costuma usar ferramentas como Jira ou Trello. [cite: 170, 228]"
            },
            { 
                text: "SPRINT", 
                hint: "Ciclos curtos e fixos (de 1 a 4 semanas) usados para entregar valor real no desenvolvimento ágil. [cite: 94, 142]",
                explanation: "Para melhorar a previsibilidade de entrega na Sprint, utilizam-se gráficos como o Burndown Chart e técnicas como Planning Poker. [cite: 220, 221, 222]"
            },
            { 
                text: "GIT", 
                hint: "Sistema de controle de versão usado para armazenar o código e gerenciar mudanças em cada sprint. [cite: 196, 197]",
                explanation: "Permite que vários desenvolvedores trabalhem no mesmo arquivo, gerenciando os materiais produzidos de forma versionada. [cite: 197, 199]"
            },
            { 
                text: "HTML", 
                hint: "Na tríade do frontend web, é a linguagem que define a estrutura (o 'esqueleto'). [cite: 201, 203]",
                explanation: "É o que define o que é um título e o que é um parágrafo na construção de interfaces amigáveis. [cite: 202, 203]"
            },
            { 
                text: "CSS", 
                hint: "Linguagem que define as cores, o contraste, as fontes e o posicionamento visual na web. [cite: 204]",
                explanation: "É o responsável pela estética e usabilidade visual, utilizando seletores e chaves para estilos. [cite: 205, 208, 215]"
            },
            { 
                text: "PYTHON", 
                hint: "A linguagem de referência atual se o requisito pede ampla disponibilidade de bibliotecas para IA e dados. [cite: 244, 245]",
                explanation: "Possui sintaxe com indentação obrigatória e usa bibliotecas como Pandas e TensorFlow para processar sensores e dados industriais. [cite: 214, 246]"
            },
            { 
                text: "MODEL", 
                hint: "No padrão MVC, é a camada que gerencia os dados e a lógica de negócio do sistema. [cite: 233, 235]",
                explanation: "É onde as regras do sistema residem. Recebe instruções de atualização através do intermediário (Controller). [cite: 235, 237]"
            },
            { 
                text: "RELACIONAL", 
                hint: "Tipo de banco de dados (ex: PostgreSQL) focado em Integridade Referencial e relações entre tabelas. [cite: 248, 249]",
                explanation: "Garante consistência estrutural através de chaves estrangeiras, sendo ideal para sistemas de estoques e financeiro. [cite: 249, 250]"
            },
            { 
                text: "NOSQL", 
                hint: "Banco de dados não-relacional focado em flexibilidade e alta performance para dados sem estrutura rígida. [cite: 251]",
                explanation: "Exemplos incluem o MongoDB (orientado a Documentos) e o Redis (Chave-Valor). [cite: 251]"
            },
            { 
                text: "PROTOTIPACAO", 
                hint: "Modelo adaptativo focado em criar uma versão simplificada ('rascunho') para o cliente validar. [cite: 84, 85]",
                explanation: "Funciona como o apartamento decorado em um estande de vendas, permitindo rápida visualização e feedback. [cite: 85]"
            }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
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

        const initGame = () => {
            if (availablePuzzles.length === 0) {
                availablePuzzles = [...database];
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
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }
        };

        const getKeyClass = (key) => {
            if (!guessedLetters.value.includes(key)) return '';
            if (currentPuzzle.value.text.includes(key)) return 'correct';
            return 'wrong';
        };
        
        const handleKeyPress = (e) => {
            const char = e.key.toUpperCase();
            const isValid = keyboardLayout.some(row => row.includes(char));
            if (isValid) guessLetter(char);
        };

        onMounted(() => {
            initGame();
            window.addEventListener('keydown', handleKeyPress);
        });

        return {
            currentPuzzle, displayedWordGroups, guessedLetters, mistakes, score,
            currentAsciiArt, gameOver, victory, keyboardLayout, guessLetter, getKeyClass, initGame
        };
    }
}).mount('#app');