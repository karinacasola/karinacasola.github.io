const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            userSelection: null,
            inventory: [],
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            // 20 Níveis de Algoritmos (Pseudocódigo)
            levels: [
                {
                    id: 1,
                    concept: "Saída de Dados",
                    story: "Você está preso em um mainframe inativo. Para acordar o sistema, envie um sinal visual para o console.",
                    instruction: "Use o comando correto para exibir a mensagem na tela.",
                    codeTemplate: [
                        "<span class='func'>???</span>(<span class='string'>\"Acordar Sistema\"</span>)"
                    ],
                    options: ["leia", "escreva", "mostre", "print"],
                    correctAnswer: "escreva",
                    successLog: "Sinal enviado. Monitores ligados..."
                },
                {
                    id: 2,
                    concept: "Tipos de Variáveis",
                    story: "Um painel exige que você declare a voltagem da porta. A voltagem é um número inteiro, sem casas decimais.",
                    instruction: "Declare corretamente o tipo da variável voltagem.",
                    codeTemplate: [
                        "<span class='type'>???</span> voltagem <- 220",
                        "<span class='func'>escreva</span>(<span class='string'>\"Voltagem setada: \"</span>, voltagem)"
                    ],
                    options: ["inteiro", "real", "caracter", "logico"],
                    correctAnswer: "inteiro",
                    successLog: "Energia estabilizada em 220v. Porta destrancada."
                },
                {
                    id: 3,
                    concept: "Entrada de Dados",
                    story: "Um terminal de voz pede seu crachá de identificação. O sistema precisa ouvir (ler) quem você é.",
                    instruction: "Use o comando que captura o que o usuário digita e guarda na variável.",
                    codeTemplate: [
                        "<span class='type'>caracter</span> cracha",
                        "<span class='func'>escreva</span>(<span class='string'>\"Diga seu ID:\"</span>)",
                        "<span class='func'>???</span>(cracha)"
                    ],
                    options: ["escreva", "guarde", "leia", "receba"],
                    correctAnswer: "leia",
                    successLog: "ID aceito. Bem-vindo, Usuário Desconhecido."
                },
                {
                    id: 4,
                    concept: "Atribuição",
                    story: "Você encontrou uma caixa de fusíveis. Para ativá-la, a variável 'status' deve receber o valor 'ligado'.",
                    instruction: "Escolha o operador de atribuição padrão do pseudocódigo.",
                    codeTemplate: [
                        "<span class='type'>caracter</span> status",
                        "status <span class='keyword'>???</span> <span class='string'>\"ligado\"</span>"
                    ],
                    options: ["==", "->", "<-", "=>"],
                    correctAnswer: "<-",
                    successLog: "Fusíveis ativados. As luzes se acendem.",
                    reward: "Lanterna"
                },
                {
                    id: 5,
                    concept: "Condicional Simples (Se)",
                    story: "Um cão-robô bloqueia o corredor. Ele só te deixa passar se o comando de autorização for verdadeiro.",
                    instruction: "Inicie a estrutura de decisão para verificar a autorização.",
                    codeTemplate: [
                        "<span class='type'>logico</span> autorizado <- verdadeiro",
                        "<span class='keyword'>???</span> (autorizado == verdadeiro) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Passagem livre\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["enquanto", "se", "caso", "para"],
                    correctAnswer: "se",
                    successLog: "O cão-robô reconhece sua autorização e senta."
                },
                {
                    id: 6,
                    concept: "Condicional Composta (Senão)",
                    story: "Você tenta hackear a porta do servidor. Se a senha estiver correta, abre. Caso contrário, soa o alarme.",
                    instruction: "Qual palavra-chave é usada para o 'caso contrário' da decisão?",
                    codeTemplate: [
                        "<span class='keyword'>se</span> (senha_correta) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Porta Aberta\"</span>)",
                        "<span class='keyword'>???</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"ALARME!\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["senao", "senaose", "falso", "outro"],
                    correctAnswer: "senao",
                    successLog: "Caminho alternativo configurado. Risco de alarme evitado."
                },
                {
                    id: 7,
                    concept: "Operadores Relacionais",
                    story: "O elevador de carga só suporta caixas com peso menor ou igual a 50kg. Sua caixa pesa exatos 50kg.",
                    instruction: "Use o operador relacional correto para 'menor ou igual'.",
                    codeTemplate: [
                        "<span class='type'>inteiro</span> peso_caixa <- 50",
                        "<span class='keyword'>se</span> (peso_caixa <span class='keyword'>???</span> 50) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Pode subir!\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: [">=", "==", "<=", "=>"],
                    correctAnswer: "<=",
                    successLog: "Elevador em movimento... Você chegou ao 2º Andar."
                },
                {
                    id: 8,
                    concept: "Operador Lógico (E)",
                    story: "A porta do cofre exige que DOIS botões sejam pressionados ao mesmo tempo: botão1 E botão2.",
                    instruction: "Complete com o operador lógico que exige que ambas as condições sejam verdadeiras.",
                    codeTemplate: [
                        "<span class='keyword'>se</span> (botao1 == verdadeiro <span class='keyword'>???</span> botao2 == verdadeiro) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Cofre aberto\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["OU", "NAO", "E", "AND"],
                    correctAnswer: "E",
                    successLog: "Cofre aberto! Você encontrou o Cartão de Acesso.",
                    reward: "Cartão de Acesso"
                },
                {
                    id: 9,
                    concept: "Operador Lógico (OU)",
                    story: "Um laser escaneia sua mão. Ele desliga se você tiver o 'Cartão de Acesso' OU for o 'Admin'.",
                    instruction: "Use o operador lógico que permite que apenas UMA das condições seja suficiente.",
                    codeTemplate: [
                        "<span class='keyword'>se</span> (tem_cartao <span class='keyword'>???</span> eh_admin) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Laser desativado\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["E", "OU", "NAO", "OR"],
                    correctAnswer: "OU",
                    successLog: "O laser desliga após escanear seu inventário."
                },
                {
                    id: 10,
                    concept: "Loop: Enquanto (Condição)",
                    story: "Uma parede de firewall tem 3 camadas. Você precisa atacá-la continuamente até que suas defesas cheguem a zero.",
                    instruction: "Escolha o comando de repetição que executa baseado em uma condição.",
                    codeTemplate: [
                        "<span class='type'>inteiro</span> defesas <- 3",
                        "<span class='keyword'>???</span> (defesas > 0) <span class='keyword'>faca</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Atacando firewall...\"</span>)",
                        "    defesas <- defesas - 1",
                        "<span class='keyword'>fimenquanto</span>"
                    ],
                    options: ["se", "para", "enquanto", "repita"],
                    correctAnswer: "enquanto",
                    successLog: "Ataque em loop iniciado. Firewall enfraquecendo..."
                },
                {
                    id: 11,
                    concept: "Incremento / Decremento",
                    story: "Durante o ataque, o sistema do firewall tenta regenerar 1 ponto de defesa. Você deve subtrair esse ponto manualmente.",
                    instruction: "Como decrementar a variável 'defesas' em 1?",
                    codeTemplate: [
                        "// Firewall tenta recuperar",
                        "defesas <- defesas + 1",
                        "// Seu contra-ataque:",
                        "defesas <- <span class='keyword'>???</span>"
                    ],
                    options: ["defesas - 1", "defesas + 1", "0", "-1"],
                    correctAnswer: "defesas - 1",
                    successLog: "Contra-ataque bem sucedido. Firewall destruído!"
                },
                {
                    id: 12,
                    concept: "Loop: Para (Contável)",
                    story: "Você achou um painel com 5 interruptores alinhados. Você precisa ligar todos eles em sequência.",
                    instruction: "Complete a estrutura de repetição PARA estipulando o limite final.",
                    codeTemplate: [
                        "<span class='keyword'>para</span> i <span class='keyword'>de</span> 1 <span class='keyword'>???</span> 5 <span class='keyword'>faca</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Ligando interruptor \", i</span>)",
                        "<span class='keyword'>fimpara</span>"
                    ],
                    options: ["ate", "passo", "faca", "por"],
                    correctAnswer: "ate",
                    successLog: "Todos os 5 interruptores foram ativados. Gerador auxiliar online."
                },
                {
                    id: 13,
                    concept: "Vetores (Declaração)",
                    story: "Para abrir o duto de ar, você precisa armazenar as 4 direções de um labirinto (Norte, Sul, Leste, Oeste).",
                    instruction: "Declare um vetor chamado 'direcoes' que comporte 4 textos.",
                    codeTemplate: [
                        "<span class='type'>???</span> direcoes[4]",
                        "direcoes[0] <- <span class='string'>\"Norte\"</span>",
                        "direcoes[1] <- <span class='string'>\"Sul\"</span>"
                    ],
                    options: ["inteiro", "logico", "caracter", "real"],
                    correctAnswer: "caracter",
                    successLog: "Vetor de navegação criado na memória."
                },
                {
                    id: 14,
                    concept: "Vetores (Índices)",
                    story: "O mapa diz: 'Siga a primeira direção gravada na memória para achar o duto'.",
                    instruction: "Acesse o primeiro elemento do vetor. Lembre-se, na programação, vetores começam do...",
                    codeTemplate: [
                        "<span class='type'>caracter</span> caminho",
                        "caminho <- direcoes[<span class='keyword'>???</span>]",
                        "<span class='func'>escreva</span>(<span class='string'>\"Indo para o \"</span>, caminho)"
                    ],
                    options: ["1", "0", "N", "4"],
                    correctAnswer: "0",
                    successLog: "Lendo índice zero... Direção Norte. Você entrou no duto de ar.",
                    reward: "Mapa do Duto"
                },
                {
                    id: 15,
                    concept: "Condicional Aninhada",
                    story: "Dentro do duto há uma bifurcação. Se o ar for frio, vá para a direita. Senão, SE houver luz, vá reto.",
                    instruction: "Use a estrutura que une um 'senão' com um novo 'se'.",
                    codeTemplate: [
                        "<span class='keyword'>se</span> (ar == <span class='string'>\"frio\"</span>) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Direita\"</span>)",
                        "<span class='keyword'>???</span> (luz == verdadeiro) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Reto\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["senao", "senao se", "caso", "entao"],
                    correctAnswer: "senao se",
                    successLog: "Você seguiu reto em direção à luz do final do duto."
                },
                {
                    id: 16,
                    concept: "Operador de Módulo (Resto)",
                    story: "O alçapão final tem um enigma: 'Apenas números PARES destravam a fechadura'. Você tem o número 42.",
                    instruction: "Para saber se é par, o RESTO da divisão por 2 deve ser zero. Qual é o operador de resto?",
                    codeTemplate: [
                        "<span class='type'>inteiro</span> num <- 42",
                        "<span class='keyword'>se</span> (num <span class='keyword'>???</span> 2 == 0) <span class='keyword'>entao</span>",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Destrancado!\"</span>)",
                        "<span class='keyword'>fimse</span>"
                    ],
                    options: ["/", "%", "*", "MOD"], // Aceitando % ou MOD, aqui usamos %
                    correctAnswer: "%",
                    successLog: "A trava reconhece a divisão exata e se solta."
                },
                {
                    id: 17,
                    concept: "Variável Acumuladora",
                    story: "Antes da saída há um pedágio digital. Você precisa juntar todas as moedas que achou para pagar a taxa.",
                    instruction: "Complete a linha que ACUMULA o valor da moeda ao total que você já tem.",
                    codeTemplate: [
                        "<span class='type'>inteiro</span> total <- 0",
                        "<span class='keyword'>para</span> i <span class='keyword'>de</span> 1 <span class='keyword'>ate</span> 3 <span class='keyword'>faca</span>",
                        "    total <- <span class='keyword'>???</span> + 5",
                        "<span class='keyword'>fimpara</span>"
                    ],
                    options: ["moeda", "total", "i", "0"],
                    correctAnswer: "total",
                    successLog: "Dinheiro suficiente somado. Pedágio pago."
                },
                {
                    id: 18,
                    concept: "Funções (Declaração)",
                    story: "O portão principal é controlado por um protocolo isolado. Você precisa encapsular o comando de abrir em um subprograma.",
                    instruction: "Como iniciamos a criação de uma função/procedimento no pseudocódigo?",
                    codeTemplate: [
                        "<span class='keyword'>???</span> destrancar_portao()",
                        "    <span class='func'>escreva</span>(<span class='string'>\"Girando engrenagens...\"</span>)",
                        "<span class='keyword'>fimfuncao</span>"
                    ],
                    options: ["funcao", "metodo", "classe", "executar"],
                    correctAnswer: "funcao",
                    successLog: "Subprograma de abertura compilado com sucesso."
                },
                {
                    id: 19,
                    concept: "Retorno de Função",
                    story: "O portão verifica a integridade do sistema, a função precisa devolver a resposta 'verdadeiro' para quem a chamou.",
                    instruction: "Qual comando devolve um valor de dentro da função para o código principal?",
                    codeTemplate: [
                        "<span class='keyword'>funcao</span> checar_sistema()",
                        "    // verificações feitas...",
                        "    <span class='keyword'>???</span> verdadeiro",
                        "<span class='keyword'>fimfuncao</span>"
                    ],
                    options: ["envie", "saia", "devolva", "retorne"],
                    correctAnswer: "retorne",
                    successLog: "Sistema 100% íntegro. A trava principal cai."
                },
                {
                    id: 20,
                    concept: "Fuga do Mainframe!",
                    story: "O sol brilha lá fora. Você só precisa executar o último comando de parada para encerrar o terminal e fugir.",
                    instruction: "Acione o algoritmo para imprimir a mensagem final de vitória.",
                    codeTemplate: [
                        "<span class='func'>escreva</span>(<span class='string'>\"Fuga Concluída!\"</span>)",
                        "<span class='keyword'>???</span>"
                    ],
                    options: ["reiniciar", "pausa", "fimalgoritmo", "loop"],
                    correctAnswer: "fimalgoritmo",
                    successLog: "Conexão encerrada. Bem-vindo ao mundo real!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.addLog("Iniciando BIOS do Mainframe...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        formatCodeLine(line) {
            if (line.includes("???")) {
                if (this.userSelection) {
                    return line.replace("???", `<span class="code-slot filled">${this.userSelection}</span>`);
                }
                return line.replace("???", `<span class="code-slot">?</span>`);
            }
            return line;
        },

        selectOption(option) {
            this.userSelection = option;
            this.feedbackMsg = ""; 
        },

        async runCode() {
            if (!this.userSelection) return;

            if (this.userSelection === this.currentLevel.correctAnswer) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Algoritmo válido. Executando bloco...";
                this.levelComplete = true;
                
                if (this.currentLevel.reward && !this.inventory.includes(this.currentLevel.reward)) {
                    this.inventory.push(this.currentLevel.reward);
                }

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                // ERRO
                this.feedbackType = "error";
                this.feedbackMsg = `Erro de Lógica: '${this.userSelection}' é inválido aqui.`;
                this.addLog("Erro na compilação. Revise seu pseudocódigo.", "log-error");
            }
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.userSelection = null;
                this.levelComplete = false;
                this.feedbackMsg = "";
                this.loadLevel();
            } else {
                // Terminou todos os 20 níveis
                this.levelComplete = true;
                this.userSelection = null;
            }
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Setor ${this.currentLevel.id}/20: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            this.isTyping = false;
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 25); 
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => {
                        terminal.scrollTop = terminal.scrollHeight;
                    }, 50);
                }
            });
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.userSelection = null;
            this.inventory = [];
            this.logs = [];
            this.levelComplete = false;
            this.addLog("Reiniciando Matrix...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');