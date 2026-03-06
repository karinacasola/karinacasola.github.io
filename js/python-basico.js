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
            
            // 20 Níveis: Introdução Suave ao Python
            levels: [
                // ==========================
                // PARTE 1: SAÍDA E VARIÁVEIS (CREATE & READ simples)
                // ==========================
                {
                    id: 1,
                    concept: "Saída de Tela (Print)",
                    story: "A tela está preta. A primeira coisa que um programador faz é pedir para o computador falar com ele.",
                    instruction: "Use a função correta do Python para imprimir uma mensagem na tela.",
                    codeTemplate: [
                        "<span class='func'>???</span>(<span class='string'>'Olá, Sistema!'</span>)"
                    ],
                    options: ["escreva", "mostrar", "print", "echo"],
                    correctAnswer: "print",
                    successLog: "Olá, Sistema! Conexão estabelecida."
                },
                {
                    id: 2,
                    concept: "Criando Variáveis (Atribuição)",
                    story: "Você precisa guardar seu nome na memória do computador. Fazemos isso usando Variáveis.",
                    instruction: "Como dizemos que a variável 'nome' RECEBE o valor 'Visitante'?",
                    codeTemplate: [
                        "nome <span class='keyword'>???</span> <span class='string'>'Visitante'</span>"
                    ],
                    options: ["==", "->", "=", "recebe"],
                    correctAnswer: "=",
                    successLog: "Variável 'nome' salva na memória."
                },
                {
                    id: 3,
                    concept: "Lendo Variáveis",
                    story: "Agora que seu nome está salvo, peça para o computador imprimi-lo. Não use aspas, ou ele vai imprimir a palavra 'nome' ao invés do seu conteúdo!",
                    instruction: "Passe o nome da variável para dentro da função print.",
                    codeTemplate: [
                        "<span class='func'>print</span>(<span class='keyword'>???</span>)"
                    ],
                    options: ["'nome'", "nome", "Visitante", "var"],
                    correctAnswer: "nome",
                    successLog: "Saída do terminal: Visitante."
                },
                
                // ==========================
                // PARTE 2: TIPOS DE DADOS
                // ==========================
                {
                    id: 4,
                    concept: "Tipo: String (Texto)",
                    story: "Textos em Python são chamados de Strings (fios de caracteres). Eles precisam estar abraçados por algo para o computador não confundir com código.",
                    instruction: "O que usamos para indicar que um valor é um texto?",
                    codeTemplate: [
                        "senha = <span class='string'>???</span>secreta<span class='string'>???</span>"
                    ],
                    options: ["( )", "[ ]", "...", " ' ' "],
                    correctAnswer: " ' ' ",
                    successLog: "String reconhecida e armazenada."
                },
                {
                    id: 5,
                    concept: "Tipo: Inteiro (Números)",
                    story: "Números inteiros (int) não usam aspas. Eles são usados para matemática e contagens exatas.",
                    instruction: "Declare a variável 'idade' como um número inteiro.",
                    codeTemplate: [
                        "idade = <span class='number'>???</span>"
                    ],
                    options: ["'20'", "Vinte", "20", "20.0"],
                    correctAnswer: "20",
                    successLog: "Número inteiro alocado."
                },
                {
                    id: 6,
                    concept: "Operações Matemáticas (Update)",
                    story: "Você faz aniversário! Precisamos somar 1 à sua idade que já está salva.",
                    instruction: "Qual operador usamos para somar em Python?",
                    codeTemplate: [
                        "idade = idade <span class='keyword'>???</span> 1"
                    ],
                    options: ["mais", "+", "soma", "++"],
                    correctAnswer: "+",
                    successLog: "Idade atualizada matematicamente para 21."
                },
                {
                    id: 7,
                    concept: "Tipo: Float (Decimais)",
                    story: "O sistema quer saber a temperatura. Números quebrados são chamados de 'Float'. Em Python, usamos ponto, não vírgula!",
                    instruction: "Atribua um número decimal à temperatura.",
                    codeTemplate: [
                        "temperatura = <span class='number'>???</span>"
                    ],
                    options: ["36,5", "36.5", "'36.5'", "Float(36)"],
                    correctAnswer: "36.5",
                    successLog: "Temperatura de 36.5 graus registrada."
                },
                {
                    id: 8,
                    concept: "Tipo: Booleano (Verdadeiro/Falso)",
                    story: "O interruptor da luz só tem dois estados: Ligado (Verdadeiro) ou Desligado (Falso). Isso é um Booleano (bool).",
                    instruction: "Ligue as luzes! No Python, booleanos começam com Letra Maiúscula.",
                    codeTemplate: [
                        "luz_ligada = <span class='keyword'>???</span>"
                    ],
                    options: ["true", "True", "'True'", "Verdadeiro"],
                    correctAnswer: "True",
                    successLog: "Luzes do servidor ligadas.",
                    reward: "Lanterna"
                },

                // ==========================
                // PARTE 3: ENTRADA E CONVERSÃO
                // ==========================
                {
                    id: 9,
                    concept: "Entrada de Dados (Input)",
                    story: "O computador quer perguntar a sua cor favorita. Ele vai ficar esperando você digitar.",
                    instruction: "Use a função que 'Lê' o que o usuário digita no teclado.",
                    codeTemplate: [
                        "cor = <span class='func'>???</span>(<span class='string'>'Qual sua cor favorita? '</span>)"
                    ],
                    options: ["leia", "ask", "print", "input"],
                    correctAnswer: "input",
                    successLog: "Aguardando usuário... Entrada recebida."
                },
                {
                    id: 10,
                    concept: "Conversão de Tipos (Casting)",
                    story: "ATENÇÃO! O comando 'input' SEMPRE devolve um Texto (String). Se você pedir uma idade, ele vai salvar como '18' e não 18. Não dá para fazer matemática com texto!",
                    instruction: "Converta a resposta do input para um número Inteiro.",
                    codeTemplate: [
                        "resposta = <span class='func'>input</span>(<span class='string'>'Idade: '</span>)",
                        "idade_certa = <span class='func'>???</span>(resposta)"
                    ],
                    options: ["int", "str", "float", "num"],
                    correctAnswer: "int",
                    successLog: "Texto convertido para número com sucesso!"
                },

                // ==========================
                // PARTE 4: LÓGICA CONDICIONAL (IF / ELSE)
                // ==========================
                {
                    id: 11,
                    concept: "Estrutura Condicional (If)",
                    story: "Uma porta bloqueia o caminho. O sistema precisa testar 'SE' você tem a chave.",
                    instruction: "Como iniciamos uma estrutura de decisão em Python?",
                    codeTemplate: [
                        "<span class='keyword'>???</span> tem_chave == <span class='keyword'>True</span>:",
                        "    <span class='func'>print</span>(<span class='string'>'Porta Aberta!'</span>)"
                    ],
                    options: ["se", "when", "if", "for"],
                    correctAnswer: "if",
                    successLog: "Condição testada. Acesso permitido."
                },
                {
                    id: 12,
                    concept: "Símbolo de Igualdade",
                    story: "O 'if' precisa comparar o PIN. Lembre-se: UM sinal de igual (=) significa 'guardar/receber'. DOIS sinais (==) significa 'comparar'.",
                    instruction: "Verifique se o pin é exatamente igual a 1234.",
                    codeTemplate: [
                        "<span class='keyword'>if</span> pin <span class='keyword'>???</span> 1234:",
                        "    <span class='func'>print</span>(<span class='string'>'PIN Correto'</span>)"
                    ],
                    options: ["=", "==", "===", "->"],
                    correctAnswer: "==",
                    successLog: "Verificação de igualdade concluída."
                },
                {
                    id: 13,
                    concept: "A Importância dos Dois Pontos (:)",
                    story: "O Python é famoso por ser organizado. No final da linha do 'if', você SEMPRE precisa colocar um símbolo para dizer: 'agora vem o bloco de código'.",
                    instruction: "Qual símbolo termina a linha da condição?",
                    codeTemplate: [
                        "<span class='keyword'>if</span> nivel >= 2<span class='keyword'>???</span>",
                        "    <span class='func'>print</span>(<span class='string'>'Nível Suficiente'</span>)"
                    ],
                    options: [";", "{", ":", "."],
                    correctAnswer: ":",
                    successLog: "Sintaxe validada. Bloco de código iniciado."
                },
                {
                    id: 14,
                    concept: "Identação (Os Espaços Importam!)",
                    story: "Diferente de outras linguagens, o Python sabe que o 'print' está DENTRO do 'if' por causa dos espaços à esquerda (Identação).",
                    instruction: "Quantos espaços o Python geralmente usa por padrão para colocar algo 'dentro' do if?",
                    codeTemplate: [
                        "<span class='keyword'>if</span> acesso_livre:",
                        "<span class='keyword'>???</span><span class='func'>print</span>(<span class='string'>'Você entrou'</span>)"
                    ],
                    options: ["Nenhum", "1 espaço", "4 espaços", "1 tabulação visível"],
                    // Vou colocar uma opção didática que representa o espaçamento
                    correctAnswer: "4 espaços", 
                    successLog: "Identação correta. Bloco aninhado com sucesso.",
                    reward: "Chave Lógica"
                },
                {
                    id: 15,
                    concept: "Caminho Alternativo (Else)",
                    story: "E se a senha estiver errada? Precisamos dizer ao computador o que fazer 'CASO CONTRÁRIO'.",
                    instruction: "Qual palavra usamos para o caminho falso da condição?",
                    codeTemplate: [
                        "<span class='keyword'>if</span> senha == <span class='string'>'admin'</span>:",
                        "    <span class='func'>print</span>(<span class='string'>'Logado'</span>)",
                        "<span class='keyword'>???</span>:",
                        "    <span class='func'>print</span>(<span class='string'>'Acesso Negado'</span>)"
                    ],
                    options: ["senao", "else", "other", "fail"],
                    correctAnswer: "else",
                    successLog: "Regra de negação criada para segurança."
                },
                {
                    id: 16,
                    concept: "Múltiplas Condições (Elif)",
                    story: "Às vezes temos várias opções. Se o botão for 1, faça isso. SENÃO SE for 2, faça aquilo. SENÃO, faça outra coisa.",
                    instruction: "Abreviação de 'else if' em Python, usada para checar uma segunda condição.",
                    codeTemplate: [
                        "<span class='keyword'>if</span> botao == 1:",
                        "    <span class='func'>print</span>(<span class='string'>'Subindo'</span>)",
                        "<span class='keyword'>???</span> botao == 2:",
                        "    <span class='func'>print</span>(<span class='string'>'Descendo'</span>)"
                    ],
                    options: ["elseif", "elif", "else if", "case"],
                    correctAnswer: "elif",
                    successLog: "Múltiplos caminhos mapeados."
                },
                {
                    id: 17,
                    concept: "Operador Diferente",
                    story: "Uma regra diz que você NÃO PODE ser o usuário 'convidado'.",
                    instruction: "Como dizemos que algo deve ser 'Diferente' em Python?",
                    codeTemplate: [
                        "<span class='keyword'>if</span> usuario <span class='keyword'>???</span> <span class='string'>'convidado'</span>:",
                        "    <span class='func'>print</span>(<span class='string'>'Pode passar'</span>)"
                    ],
                    options: ["!==", "not=", "<>", "!="],
                    correctAnswer: "!=",
                    successLog: "Condição de exclusão confirmada."
                },

                // ==========================
                // PARTE 5: STRINGS AVANÇADAS E LIMPEZA (DELETE)
                // ==========================
                {
                    id: 18,
                    concept: "Concatenando Textos (Juntando)",
                    story: "Você quer imprimir 'Olá, ' junto com a variável 'nome'. Juntar textos se chama Concatenação.",
                    instruction: "Qual símbolo junta duas Strings?",
                    codeTemplate: [
                        "mensagem = <span class='string'>'Olá, '</span> <span class='keyword'>???</span> nome",
                        "<span class='func'>print</span>(mensagem)"
                    ],
                    options: ["&", "+", "and", ","],
                    correctAnswer: "+",
                    successLog: "Strings coladas com sucesso."
                },
                {
                    id: 19,
                    concept: "Formatando Textos (F-Strings)",
                    story: "Juntar com o '+' dá muito trabalho. Em Python, existe um 'F' mágico que você coloca antes das aspas, e ele deixa você colocar variáveis no meio do texto usando chaves {}.",
                    instruction: "Complete com a letra mágica para usar F-Strings.",
                    codeTemplate: [
                        "<span class='func'>print</span>(<span class='keyword'>???</span><span class='string'>'Acesso de {nome} concedido no nível {nivel}'</span>)"
                    ],
                    options: ["s", "format", "f", "p"],
                    correctAnswer: "f",
                    successLog: "F-string compilada dinamicamente!"
                },
                {
                    id: 20,
                    concept: "Limpando Dados (Delete simple)",
                    story: "Último passo: apague o rastro da senha que você guardou na variável para ninguém descobrir. Basta reatribuir ela como Vazia.",
                    instruction: "Como deixamos uma String completamente vazia?",
                    codeTemplate: [
                        "senha = <span class='string'>???</span>",
                        "<span class='func'>print</span>(<span class='string'>'Sistema limpo. Adeus.'</span>)"
                    ],
                    options: ["0", "False", "vazio", "''"],
                    correctAnswer: "''",
                    successLog: "Variável esvaziada. Missão Cumprida!"
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
        this.addLog("Boot sequencial iniciado...", "log-info");
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
                this.feedbackType = "success";
                this.feedbackMsg = "Comando aceito. Compilando...";
                this.levelComplete = true;
                
                if (this.currentLevel.reward && !this.inventory.includes(this.currentLevel.reward)) {
                    this.inventory.push(this.currentLevel.reward);
                }

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                this.feedbackType = "error";
                this.feedbackMsg = `Erro de Sintaxe: O interpretador Python não entendeu '${this.userSelection}'.`;
                this.addLog("Falha na compilação. Revise o código.", "log-error");
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
                this.levelComplete = true;
                this.userSelection = null;
            }
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Módulo ${this.currentLevel.id}/20: ${this.currentLevel.concept}...`, "log-info");
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
            this.addLog("Reiniciando o kernel do Python...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');