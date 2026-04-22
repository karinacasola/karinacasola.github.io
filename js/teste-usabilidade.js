const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            mistakes: 0,
            maxMistakes: 6,
            guessedLetters: [],
            showFeedback: false,
            isWin: false,
            gameFinished: false,
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            questions: [
                { word: "VERBALIZAR", hint: "Ação principal do Think-Aloud", scenario: "Na técnica de Think-Aloud, o facilitador pede para o usuário ______ seus pensamentos enquanto executa uma tarefa.", feedback: "A essência do Think-Aloud é a externalização verbal do processo cognitivo." },
                { word: "MENTAL", hint: "Revelado pelo Think-Aloud", scenario: "Ouvir o usuário ajuda a entender e revelar seu modelo ______.", feedback: "O modelo mental revela as expectativas do usuário sobre a interface." },
                { word: "MINIMA", hint: "Postura do facilitador", scenario: "Durante o teste, a intervenção do observador deve ser ______.", feedback: "Intervir demais enviesa o teste; o facilitador deve apenas incentivar a fala." },
                { word: "QUEDA", hint: "Resultado imediato (M&S)", scenario: "O redesign milionário da Marks & Spencer gerou uma ______ de 8,1% nas vendas.", feedback: "Apesar do alto investimento (£150 milhões), problemas de UX derrubaram as vendas." },
                { word: "SENHAS", hint: "Fricção no Login (M&S)", scenario: "Clientes antigos abandonaram o site porque foram forçados a trocar suas ______.", feedback: "Forçar ações sem explicação gera fricção e abandono do usuário." },
                { word: "REVISTA", hint: "Problema de Hierarquia (M&S)", scenario: "Os menus adotaram um estilo de ______ que escondia as categorias de produtos.", feedback: "Nomes inspiracionais esconderam a arquitetura de informação essencial." },
                { word: "CONTORNO", hint: "Problema Visual (M&S)", scenario: "Os botões de ação e o carrinho tinham baixo contraste porque possuíam apenas ______.", feedback: "A falta de preenchimento reduziu a visibilidade das chamadas de ação primárias." },
                { word: "NORMAN", hint: "Autor do modelo emocional", scenario: "Os três níveis de processamento do Design Emocional foram definidos por Don ______.", feedback: "Don Norman detalhou os níveis Visceral, Comportamental e Reflexivo." },
                { word: "VISCERAL", hint: "Nível da Aparência", scenario: "O nível que lida com a aparência, reação imediata, instintiva e o 'uau' inicial.", feedback: "É a primeira impressão, processada antes do pensamento consciente." },
                { word: "COMPORTAMENTAL", hint: "Nível do Prazer de Uso", scenario: "Nível focado estritamente na funcionalidade, desempenho e sensação de eficácia.", feedback: "Avalia a usabilidade clássica: quão bem o produto cumpre sua função." },
                { word: "REFLEXIVO", hint: "Nível do Significado", scenario: "O nível de processamento mais alto, que envolve autoimagem e satisfação a longo prazo.", feedback: "Conecta-se a como o produto faz o usuário se sentir diante da sociedade." },
                { word: "ANSIEDADE", hint: "Efeito da Desordem", scenario: "No nível visceral (O que ele VÊ?), quando o usuário vê desordem, o cérebro processa ______.", feedback: "Interfaces poluídas geram carga cognitiva imediata e desconforto." },
                { word: "CONFIANCA", hint: "Efeito da Harmonia", scenario: "Se a interface apresenta harmonia visual, o cérebro processa instintivamente a ______.", feedback: "Estética bem resolvida transmite profissionalismo e segurança." },
                { word: "FRUSTRACAO", hint: "Efeito da interrupção", scenario: "No nível comportamental, quando o fluxo de uso é interrompido, a dor gera ______.", feedback: "Como no caso da Marks & Spencer, a interrupção destrói o prazer de uso." },
                { word: "INTELIGENTE", hint: "Sentimento Reflexivo", scenario: "Um bom app de produtividade faz o usuário se sentir ______ perante os outros.", feedback: "O design reflexivo atua na vaidade, identidade e pertencimento." },
                { word: "FRANZIDAS", hint: "Indicador de Frustração", scenario: "Micro-expressões faciais comuns ao encontrar um botão sem contraste: sobrancelhas ______.", feedback: "O rosto do usuário demonstra confusão antes mesmo dele falar." },
                { word: "SUSPIROS", hint: "Indicador Físico", scenario: "Durante o Think-Aloud, ______ indicam que a interface está gerando carga cognitiva excessiva.", feedback: "Preste atenção na linguagem corporal, ela complementa a fala." },
                { word: "DELEITE", hint: "Oposto de Frustração", scenario: "Quando o usuário diz 'Isso facilita muito minha vida', é um indicador claro de ______.", feedback: "A satisfação reflexiva indica que o design cumpriu seu propósito máximo." },
                { word: "HESITAR", hint: "Sinal de Confiança", scenario: "O usuário clica sem ______ quando o visual comunica claramente a função.", feedback: "Quando o nível visceral apoia o comportamental, o uso se torna fluido." },
                { word: "PERSONALIDADE", hint: "Diretriz Emocional", scenario: "Uma interface humanizada usa micro-textos e tons de voz que ressoam com a ______.", feedback: "A persona direciona como o sistema 'conversa' com o usuário." },
                { word: "IMEDIATO", hint: "Tipo de Feedback", scenario: "Para reduzir a ansiedade visceral, o sistema deve fornecer um feedback visual ______.", feedback: "Estados de carregamento e confirmações informam o usuário sobre o status." },
                { word: "STORYTELLING", hint: "Jornada do Usuário", scenario: "Criação de uma ______ onde o usuário é o herói que supera suas dores com a ferramenta.", feedback: "Narrativas engajam emocionalmente e justificam a utilidade do sistema." },
                { word: "ENGAJADO", hint: "Transformação do Usuário", scenario: "Um bom design emocional transforma um usuário passivo em um usuário ______.", feedback: "Usuários engajados tornam-se defensores da marca e do produto." },
                { word: "COGNITIVA", hint: "Tipo de Carga", scenario: "Falhas de hierarquia de informação exigem excessiva carga ______ do cérebro.", feedback: "O usuário é forçado a pensar para encontrar algo que deveria ser óbvio." },
                { word: "ESTETICA", hint: "Pode atrapalhar a função", scenario: "Notou-se que em péssimos redesigns, muitas vezes a ______ atrapalhou a usabilidade.", feedback: "Design visceral sem base comportamental destrói a utilidade da ferramenta." },
                { word: "OBSERVADOR", hint: "Papel no Teste", scenario: "Quem conduz o Think-Aloud atua como um ______ que anota o modelo mental mapeado.", feedback: "A neutralidade é vital para não corromper os dados do teste." },
                { word: "INVISIVEL", hint: "Problema M&S", scenario: "Na M&S, o ícone do carrinho estava quase ______ devido ao design de linha fina.", feedback: "Baixo contraste ignora regras básicas de acessibilidade e percepção." },
                { word: "INSTINTIVA", hint: "Reação Visceral", scenario: "A resposta do cérebro no primeiro contato visual é puramente ______.", feedback: "Não há raciocínio lógico profundo nos primeiros milissegundos de contato." },
                { word: "DESEMPENHO", hint: "Foco Comportamental", scenario: "O nível Comportamental foca estritamente na função e no ______ da tarefa.", feedback: "A beleza não salva um sistema que é lento ou ineficaz." },
                { word: "EXCLUSIVAMENTE", hint: "Sensação Final", scenario: "O objetivo é que o usuário sinta que o produto foi feito ______ para ele.", feedback: "Essa percepção atesta o sucesso completo das diretrizes de Design Emocional." }
            ]
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        maskedWordArray() {
            // Separa a palavra e substitui letras não adivinhadas por '_'
            return this.currentQuestion.word.split('').map(char => {
                return this.guessedLetters.includes(char) ? char : '_';
            });
        },
        progressPercentage() {
            return ((this.currentQuestionIndex) / this.questions.length) * 100;
        }
    },
    methods: {
        guessLetter(letter) {
            // Ignora se a letra já foi clicada ou se o feedback já está na tela
            if (this.guessedLetters.includes(letter) || this.showFeedback) return;
            
            this.guessedLetters.push(letter);
            
            // Verifica se errou
            if (!this.currentQuestion.word.includes(letter)) {
                this.mistakes++;
            }

            this.checkGameState();
        },
        checkGameState() {
            // Verifica se o array da palavra tem todas as suas letras adivinhadas
            const isWordComplete = this.currentQuestion.word.split('').every(char => this.guessedLetters.includes(char));
            
            if (isWordComplete) {
                this.isWin = true;
                this.showFeedback = true;
            } else if (this.mistakes >= this.maxMistakes) {
                this.isWin = false;
                this.showFeedback = true;
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.resetRound();
            } else {
                this.gameFinished = true;
            }
        },
        resetRound() {
            this.guessedLetters = [];
            this.showFeedback = false;
            this.isWin = false;
            this.mistakes = 0;
        },
        restartGame() {
            this.currentQuestionIndex = 0;
            this.gameFinished = false;
            this.resetRound();
        }
    }
}).mount('#app');