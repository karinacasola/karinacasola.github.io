const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const database = [
            { 
                text: "PREDITIVO", 
                hint: "Modelo de desenvolvimento onde o planejamento é feito de forma extensiva no início.",
                explanation: "É ideal para cenários com requisitos muito claros e rígidos, onde o risco de errar é fatal (ex: sonda espacial)."
            },
            { 
                text: "ADAPTATIVO", 
                hint: "Modelo que aceita que requisitos podem mudar, focando em aprender com o processo.",
                explanation: "Ideal para cenários onde o cliente não sabe bem o que quer, englobando métodos como Prototipação e Espiral."
            },
            { 
                text: "AGIL", 
                hint: "Metodologia com foco em entregas rápidas, constantes e satisfação total do cliente.",
                explanation: "É a melhor escolha quando há mudança constante, inovação e necessidade de entrega rápida, como em aplicativos de celular."
            },
            { 
                text: "CASCATA", 
                hint: "Modelo preditivo sequencial puro, onde se avança um passo de cada vez (Requisitos, Design, Código).",
                explanation: "Possui variações como a 'com feedback' que permite revisões pontuais, ou a 'sobreposta' que ganha tempo iniciando o design antes do fim dos requisitos."
            },
            { 
                text: "ESPIRAL", 
                hint: "Modelo adaptativo que foca em Análise de Risco.",
                explanation: "O projeto evolui em ciclos, onde cada volta é uma iteração que reduz o risco do projeto antes do próximo passo."
            },
            { 
                text: "SCRUM", 
                hint: "Modelo ágil focado na gestão de equipe através de ciclos curtos.",
                explanation: "Define papéis como PO e Scrum Master, eventos como Dailies e Sprints, e costuma usar ferramentas como Jira ou Trello."
            },
            { 
                text: "SPRINT", 
                hint: "Ciclos curtos e fixos (de 1 a 4 semanas) usados para entregar valor real no desenvolvimento ágil.",
                explanation: "Para melhorar a previsibilidade de entrega na Sprint, utilizam-se gráficos como o Burndown Chart e técnicas como Planning Poker."
            },
            { 
                text: "GIT", 
                hint: "Sistema de controle de versão usado para armazenar o código e gerenciar mudanças em cada sprint.",
                explanation: "Permite que vários desenvolvedores trabalhem no mesmo arquivo, gerenciando os materiais produzidos de forma versionada."
            },
            { 
                text: "HTML", 
                hint: "Na tríade do frontend web, é a linguagem que define a estrutura (o 'esqueleto').",
                explanation: "É o que define o que é um título e o que é um parágrafo na construção de interfaces amigáveis."
            },
            { 
                text: "CSS", 
                hint: "Linguagem que define as cores, o contraste, as fontes e o posicionamento visual na web.",
                explanation: "É o responsável pela estética e usabilidade visual, utilizando seletores e chaves para estilos."
            },
            { 
                text: "PYTHON", 
                hint: "A linguagem de referência atual se o requisito pede ampla disponibilidade de bibliotecas para IA e dados.",
                explanation: "Possui sintaxe com indentação obrigatória e usa bibliotecas como Pandas e TensorFlow para processar sensores e dados industriais."
            },
            { 
                text: "MODEL", 
                hint: "No padrão MVC, é a camada que gerencia os dados e a lógica de negócio do sistema.",
                explanation: "É onde as regras do sistema residem. Recebe instruções de atualização através do intermediário (Controller)."
            },
            { 
                text: "RELACIONAL", 
                hint: "Tipo de banco de dados (ex: PostgreSQL) focado em Integridade Referencial e relações entre tabelas.",
                explanation: "Garante consistência estrutural através de chaves estrangeiras, sendo ideal para sistemas de estoques e financeiro."
            },
            { 
                text: "NOSQL", 
                hint: "Banco de dados não-relacional focado em flexibilidade e alta performance para dados sem estrutura rígida.",
                explanation: "Exemplos incluem o MongoDB (orientado a Documentos) e o Redis (Chave-Valor)."
            },
            { 
                text: "PROTOTIPACAO", 
                hint: "Modelo adaptativo focado em criar uma versão simplificada ('rascunho') para o cliente validar.",
                explanation: "Funciona como o apartamento decorado em um estande de vendas, permitindo rápida visualização e feedback."
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