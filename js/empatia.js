const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const questions = ref([
            { word: "EMPATIA", hint: "Capacidade de se colocar no lugar do outro.", feedback: "Empatia não é apenas sentir pena, é entender o contexto e as dores reais para criar soluções que façam sentido." },
            { word: "XPLANE", hint: "Empresa de Dave Gray que criou o Mapa original.", feedback: "A ferramenta nasceu da necessidade de alinhar stakeholders sobre quem é o usuário 'de verdade' através do Visual Thinking." },
            { word: "EXPERIENCIA", hint: "O termo 'UX' foca na jornada do usuário.", feedback: "Sem empatia, criamos interfaces bonitas que resolvem problemas inexistentes. O foco deve ser na jornada real." },
            { word: "INTERFACE", hint: "O termo 'UI' foca na interação visual.", feedback: "A interface é apenas decoração se não houver compreensão profunda da dor que ela deve aliviar." },
            { word: "PERSONA", hint: "Perfil arquetípico que o mapa ajuda a aprofundar.", feedback: "A persona dá o perfil (quem é), mas o Mapa de Empatia dá o sentir (o que ele vivencia)." },
            { word: "SHADOWING", hint: "Observar o usuário em seu ambiente natural.", feedback: "A observação direta evita 'achismos'. Ver o usuário em ação revela necessidades que ele mesmo não percebe." },
            { word: "VERBATIM", hint: "Citações diretas dos usuários nas seções do mapa.", feedback: "Dica de ouro do PDF: use as frases exatas do usuário para preencher as seções 'Diz' e 'Pensa'." },
            { word: "AMBIENTE", hint: "O que o usuário VÊ descreve o seu...", feedback: "Esta seção analisa o que o mercado oferece, o que os amigos fazem e o que o cerca fisicamente." },
            { word: "INFLUENCIADORES", hint: "Pessoas que impactam a seção 'O que ele OUVE?'.", feedback: "O que a família, amigos e canais de comunicação dizem molda a percepção do seu usuário." },
            { word: "SONHOS", hint: "Mapeados na seção 'O que ele PENSA e SENTE?'.", feedback: "Aqui entram as preocupações secretas e os desejos que o usuário muitas vezes não verbaliza." },
            { word: "COMPORTAMENTO", hint: "A seção 'O que ele FAZ e DIZ?' analisa seu...", feedback: "Analisa como ele se comporta em público e se suas ações condizem com o que ele afirma." },
            { word: "FRUSTRACOES", hint: "Um dos pilares da seção de 'Dores'.", feedback: "Mapear o que impede o usuário de agir é vital para o design centrado no humano." },
            { word: "FELICIDADE", hint: "Os 'Ganhos' mapeiam como ele mede a sua...", feedback: "Entender o que é sucesso para o usuário ajuda a definir os objetivos principais da sua interface." },
            { word: "BUROCRACIA", hint: "Dor principal resolvida no case Nubank.", feedback: "O Nubank usou o mapa para entender a dor de quem via filas enormes e portas giratórias travando." },
            { word: "MINIMALISTA", hint: "Estilo de UI usado pelo Nubank para dar controle.", feedback: "A interface limpa remove a carga cognitiva, atacando a dor da confusão bancária tradicional." },
            { word: "HUMANA", hint: "Tipo de linguagem (Diz/Faz) focada no case Nubank.", feedback: "Focar na dor significa falar a língua do usuário, oferecendo atendimento 24h e eliminando taxas." },
            { word: "ESTATICO", hint: "O Mapa de Empatia NÃO deve ser um documento...", feedback: "Ele é uma ferramenta viva! Deve ser atualizado conforme o produto e o entendimento do usuário evoluem." },
            { word: "DADOS", hint: "O Mapa transforma ... frios em compreensão humana.", feedback: "O design só funciona quando deixamos de olhar para números e passamos a olhar para pessoas." },
            { word: "QUALITATIVOS", hint: "Tipo de dados coletados em pesquisas de campo.", feedback: "O Mapa de Empatia é alimentado prioritariamente por insights qualitativos e observação." },
            { word: "MOTIVACOES", hint: "O objetivo é compreender as ... implícitas do usuário.", feedback: "Entender o 'porquê' por trás das ações é o que diferencia um bom design de uma simples interface." }
        ]);

        const currentQuestionIndex = ref(0);
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const gameFinished = ref(false);
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => (currentQuestionIndex.value / questions.value.length) * 100);
        
        const maskedWordArray = computed(() => {
            return currentQuestion.value.word.split('').map(l => guessedLetters.value.includes(l) ? l : '_');
        });

        const isWin = computed(() => !maskedWordArray.value.includes('_'));
        const isLoss = computed(() => mistakes.value >= 3);
        const showFeedback = computed(() => isWin.value || isLoss.value);

        const guessLetter = (letter) => {
            if (guessedLetters.value.includes(letter) || showFeedback.value) return;
            guessedLetters.value.push(letter);
            if (!currentQuestion.value.word.includes(letter)) mistakes.value++;
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                guessedLetters.value = [];
                mistakes.value = 0;
            } else {
                gameFinished.value = true;
            }
        };

        const restartGame = () => {
            currentQuestionIndex.value = 0;
            guessedLetters.value = [];
            mistakes.value = 0;
            gameFinished.value = false;
        };

        onMounted(() => {
            // Lógica do Menu Mobile (Referência do Blog)
            const menuToggle = document.getElementById('menu-toggle');
            const navbarMenu = document.getElementById('navbar-menu');
            if (menuToggle && navbarMenu) {
                menuToggle.addEventListener('click', () => {
                    navbarMenu.classList.toggle('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.toggle('bi-list');
                    icon.classList.toggle('bi-x-lg');
                });
            }
        });

        return {
            questions, currentQuestionIndex, currentQuestion, progressPercentage,
            guessedLetters, mistakes, alphabet, maskedWordArray, isWin, isLoss,
            showFeedback, gameFinished, guessLetter, nextQuestion, restartGame
        };
    }
}).mount('#app');