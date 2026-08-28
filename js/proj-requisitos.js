const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // --- BANCO DE QUESTÕES ---
        const questoesForca = [
            { text: "REQUISITO FUNCIONAL", hint: "O sistema deve permitir que o usuário cadastre uma nova senha através de um link de recuperação.", explanation: "Descreve uma funcionalidade ou ação direta que o sistema deve executar para o usuário." },
            { text: "REQUISITO NAO FUNCIONAL", hint: "O tempo de carregamento da página de relatórios não deve ultrapassar 2,5 segundos em conexões 4G.", explanation: "Descreve uma restrição de qualidade, neste caso focada em desempenho e velocidade." },
            { text: "REGRA DE NEGOCIO", hint: "Clientes VIPs possuem o benefício de frete grátis em compras acima de R$ 200,00.", explanation: "É uma política ou lei da empresa que existiria mesmo se não houvesse um sistema de software." },
            { text: "REQUISITO FUNCIONAL", hint: "O sistema deve gerar um comprovante de matrícula em formato PDF ao final do processo.", explanation: "Geração de documentos e saídas de dados são funcionalidades esperadas do software." },
            { text: "REQUISITO NAO FUNCIONAL", hint: "As senhas de todos os usuários do banco devem ser salvas criptografadas com o algoritmo SHA-256.", explanation: "É um critério de segurança que dita 'como' o sistema deve operar internamente." },
            { text: "REGRA DE NEGOCIO", hint: "Apenas coordenadores e diretores possuem autorização para aprovar reembolsos superiores a R$ 500,00.", explanation: "Representa a hierarquia e as restrições corporativas aplicadas ao fluxo de aprovação." },
            { text: "REQUISITO NAO FUNCIONAL", hint: "A interface da aplicação deve ser completamente responsiva em navegadores Google Chrome e Firefox.", explanation: "Trata-se de um critério de portabilidade e compatibilidade do sistema." },
            { text: "REQUISITO FUNCIONAL", hint: "O usuário deve receber um e-mail de notificação automático confirmando o pagamento da fatura.", explanation: "O envio de notificações e e-mails é uma ação sistêmica acionada por um gatilho." },
            { text: "REGRA DE NEGOCIO", hint: "É terminantemente proibido o cadastro de usuários menores de 18 anos na plataforma de investimentos.", explanation: "Trata-se de uma conformidade legal/regulatória que o negócio precisa seguir." },
            { text: "REQUISITO NAO FUNCIONAL", hint: "O sistema de banco de dados do hospital deve estar operando com disponibilidade de 99,99% ao longo do ano.", explanation: "Define o nível de serviço (SLA) esperado quanto à disponibilidade tecnológica." }
        ];

        // --- ESTADO DO JOGO ---
        const currentQuestionIndex = ref(0);
        const score = ref(0);
        const mistakes = ref(0);
        const guessedLetters = ref([]);
        const gameOver = ref(false);
        const victory = ref(false);

        const currentPuzzle = computed(() => questoesForca[currentQuestionIndex.value]);

        // Layout do teclado QWERTY
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        // Arte ASCII progressiva
        const asciiArts = [
            "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
            "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
        ];
        
        const currentAsciiArt = computed(() => {
            return asciiArts[Math.min(mistakes.value, 6)];
        });

        // Formatação das palavras no painel
        const displayedWordGroups = computed(() => {
            const words = currentPuzzle.value.text.split(' ');
            return words.map(word => {
                return word.split('').map(char => {
                    if (char === ' ') return ' ';
                    return guessedLetters.value.includes(char) ? char : '_';
                });
            });
        });

        // --- MÉTODOS ---
        const initGame = () => {
            if (victory.value) {
                currentQuestionIndex.value = (currentQuestionIndex.value + 1) % questoesForca.length;
            } else if (gameOver.value) {
                score.value = 0; // Zera o score se perdeu e vai tentar de novo
            }
            mistakes.value = 0;
            guessedLetters.value = [];
            gameOver.value = false;
            victory.value = false;
        };

        const guessLetter = (key) => {
            if (gameOver.value || victory.value || guessedLetters.value.includes(key)) return;
            
            guessedLetters.value.push(key);
            
            if (!currentPuzzle.value.text.includes(key)) {
                mistakes.value++;
            }

            checkGameStatus();
        };

        const checkGameStatus = () => {
            // Verifica Vitória
            const wordChars = currentPuzzle.value.text.replace(/ /g, '').split('');
            const isWinner = wordChars.every(char => guessedLetters.value.includes(char));
            
            if (isWinner) {
                victory.value = true;
                score.value += 100;
                dispararConfete();
                return;
            }

            // Verifica Derrota
            if (mistakes.value >= 6) {
                gameOver.value = true;
            }
        };

        const getKeyClass = (key) => {
            if (!guessedLetters.value.includes(key)) return '';
            if (currentPuzzle.value.text.includes(key)) return 'correct';
            return 'wrong';
        };

        const dispararConfete = () => {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        };

        return {
            score,
            mistakes,
            currentPuzzle,
            currentAsciiArt,
            displayedWordGroups,
            keyboardLayout,
            guessedLetters,
            gameOver,
            victory,
            guessLetter,
            getKeyClass,
            initGame
        };
    }
}).mount('#app');