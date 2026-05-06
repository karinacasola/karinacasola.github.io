const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const database = [
            { 
                text: "GESTOS", 
                hint: "Na tendência de Interfaces Zero, se a tela desaparece e não usamos botões, como nosso corpo passa a interagir com o sistema além da voz?",
                explanation: "Interfaces Zero (No-UI) eliminam telas tradicionais, focando em interações que parecem invisíveis e naturais, como voz e movimentos corporais."
            },
            { 
                text: "PREDITIVA", 
                hint: "Se uma interface usa Inteligência Artificial para antecipar sua necessidade e oferecer uma solução antes mesmo de você clicar em algo, que tipo de personalização é essa?",
                explanation: "A personalização preditiva muda a interface baseada no comportamento do usuário via IA antes mesmo que a ação seja solicitada."
            },
            { 
                text: "MAGICO DE OZ", 
                hint: "Você quer testar se as pessoas gostam de conversar com um robô, mas o robô ainda não foi programado. Então, um humano responde escondido. Qual é o nome dessa técnica de ilusão?",
                explanation: "É uma técnica de teste onde o designer simula a inteligência do sistema manualmente nos bastidores para ver a reação genuína do usuário."
            },
            { 
                text: "SOMBRIOS", 
                hint: "Quando um design é feito de propósito para dificultar o cancelamento de uma assinatura e te prender, dizemos que ele usa padrões...",
                explanation: "Padrões Sombrios (Dark Patterns) são arquiteturas de design feitas de forma antiética para manipular decisões, como esconder botões."
            },
            { 
                text: "CATEGORIAS", 
                hint: "A Lei de Hick alerta que opções demais geram paralisia. Qual é a estratégia de Arquitetura de Informação para organizar um menu gigante e resolver isso?",
                explanation: "Segundo a Lei de Hick, o tempo de decisão aumenta com o número de opções, devendo-se agrupar essas opções em categorias lógicas."
            },
            { 
                text: "LEI DE FITTS", 
                hint: "Colocar o botão principal minúsculo no topo esquerdo do celular, bem longe do polegar, quebra qual regra de ergonomia?",
                explanation: "A Lei de Fitts afirma que o tempo para atingir um alvo depende da distância até ele e do seu tamanho. Botões vitais devem ser grandes e próximos."
            },
            { 
                text: "GATILHO", 
                hint: "No modelo que explica como a tecnologia cria hábitos, qual é o nome do estímulo inicial (como uma notificação) que te faz abrir um app?",
                explanation: "No Loop do Hábito (Hook Model), a primeira etapa é o Gatilho, projetado para capturar sua atenção imediata."
            },
            { 
                text: "PERCEPTIVEL", 
                hint: "Se um usuário é daltônico, ele não entenderá um aviso que usa apenas a cor vermelha para indicar erro. Qual princípio de acessibilidade foi ignorado?",
                explanation: "O princípio 'Perceptível' da WCAG garante que a informação seja apresentada de forma que os usuários possam notá-la através de diferentes sentidos."
            },
            { 
                text: "GUERRILHA", 
                hint: "Você precisa descobrir rapidamente se seu fluxo de compra faz sentido, mas não tem orçamento. Vai a um café e pede para estranhos testarem. Como se chama esse teste tático?",
                explanation: "O Teste de Guerrilha é rápido, informal e de baixo custo, feito em espaços públicos com pessoas aleatórias para detectar erros óbvios de navegação."
            },
            { 
                text: "COGNITIVO", 
                hint: "Especialistas simulam o passo a passo de um idoso em um aplicativo para julgar se o aprendizado é fácil. Como se chama esse 'percurso'?",
                explanation: "O Percurso Cognitivo é uma avaliação feita por especialistas que simulam a jornada do usuário, respondendo a perguntas com foco na facilidade de aprendizado."
            },
            { 
                text: "ARQUITETURA", 
                hint: "Ao mostrar um rascunho sem cores (wireframe) para um usuário, você não quer que ele avalie a beleza, mas sim a organização da informação. Você está testando a...",
                explanation: "Como wireframes não têm cor final, não testamos estética. O objetivo é testar a Arquitetura da Informação e o fluxo lógico."
            },
            { 
                text: "COGNITIVA", 
                hint: "Quando uma tela tem tantas informações e regras que o usuário se sente mentalmente exausto apenas tentando entender o que fazer, dizemos que a interface gerou uma alta carga...",
                explanation: "Testes simulados por IA podem prever a carga cognitiva, que mede o esforço mental exigido pelo usuário para processar e operar a interface."
            },
            { 
                text: "ROBUSTO", 
                hint: "Um site acessível precisa continuar funcionando bem tanto em navegadores de última geração quanto em antigos leitores de tela. Ele deve seguir o princípio de ser...",
                explanation: "O princípio Robusto da WCAG garante que o conteúdo suporte uma ampla variedade de tecnologias, incluindo tecnologias assistivas."
            },
            { 
                text: "VARIAVEIS", 
                hint: "Na prototipagem moderna, os designers não desenham apenas telas estáticas. Eles orquestram dados criando regras do tipo 'Se isso, mostre aquilo'. O que permite guardar essas regras no design?",
                explanation: "A prototipagem moderna transita do visual linear para o uso de variáveis e lógica condicional, reagindo a dados dinâmicos."
            },
            { 
                text: "RABISCO", 
                hint: "Ferramentas de IA como o Uizard conseguem pular etapas na criação. Você pode tirar uma foto de um desenho feito à mão no papel e ele vira um protótipo digital. O que ele escaneia?",
                explanation: "No nível de baixa fidelidade do Uizard, o usuário tira foto de um rabisco no papel e a IA converte os traços em componentes digitais básicos."
            },
            { 
                text: "ALUCINACAO", 
                hint: "Quando o motor de IA inventa uma informação falsa, mas com muita confiança, o designer precisa criar um 'Cenário de Erro' para lidar com isso. Qual o nome desse surto da máquina?",
                explanation: "Ao projetar para IA, designers precisam mapear cenários de erro e lidar com as alucinações da máquina."
            },
            { 
                text: "RECOMPENSA", 
                hint: "A dopamina no cérebro do usuário dispara quando ele rola o feed e encontra um conteúdo divertido ou novos curtidas. Essa etapa do ciclo do hábito é chamada de...",
                explanation: "No Loop do Hábito, a Recompensa reforça a ação tomada, mantendo o usuário investido no ecossistema."
            },
            { 
                text: "CARTOES", 
                hint: "Você não tem certeza se o botão deve se chamar 'Ajustes' ou 'Configurações'. Pede então para os usuários agruparem papéis soltos com esses nomes. É uma ordenação de...",
                explanation: "A Ordenação de Cartões (Card Sorting) avalia se os nomes dos menus fazem sentido para o modelo mental do usuário e seu agrupamento lógico."
            },
            { 
                text: "CLIQUE", 
                hint: "Em um teste de wireframe, se o usuário demora mais de 5 segundos para descobrir onde precisa tocar para avançar, a navegação reprovou no 'Tempo até o primeiro...'",
                explanation: "O Tempo até o 1º Clique (Time to First Click) é uma métrica crucial. Se a primeira ação demora, indica confusão visual ou má estrutura."
            },
            { 
                text: "PARALISIA", 
                hint: "O que acontece com o cérebro do usuário, segundo a Lei de Hick, quando ele é bombardeado com um formulário de 50 opções de uma só vez?",
                explanation: "A Lei de Hick aponta que muitas opções geram paralisia de decisão, aumentando drasticamente o tempo que o usuário leva para agir."
            }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
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
            let newPuzzle;
            do {
                newPuzzle = database[Math.floor(Math.random() * database.length)];
            } while (currentPuzzle.value.text === newPuzzle.text && database.length > 1);

            currentPuzzle.value = newPuzzle;
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