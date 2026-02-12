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
            
            // Dados dos Níveis (O Roteiro do Jogo)
            levels: [
                {
                    id: 1,
                    concept: "Variáveis e String",
                    story: "Você acorda em uma sala escura. Um terminal pisca à sua frente pedindo identificação. Defina seu status para continuar.",
                    instruction: "Atribua o valor 'admin' para a variável usuario.",
                    codeTemplate: [
                        "usuario = <span class='keyword'>???</span>",
                        "<span class='keyword'>print</span>(<span class='string'>'Bem-vindo, '</span> + usuario)"
                    ],
                    options: ["'admin'", "admin", "1234", "True"],
                    correctAnswer: "'admin'",
                    successLog: "Acesso concedido. Sistema reiniciando..."
                },
                {
                    id: 2,
                    concept: "Condicional If/Else",
                    story: "O sistema reiniciou. Você vê dois arquivos criptografados: 'porta_esquerda' e 'porta_direita'. A porta esquerda parece segura.",
                    instruction: "Complete o IF para abrir a porta esquerda.",
                    codeTemplate: [
                        "escolha = <span class='string'>'esquerda'</span>",
                        "<span class='keyword'>if</span> escolha == <span class='string'>'esquerda'</span>:",
                        "    <span class='keyword'>print</span>(<span class='string'>'Caminho seguro'</span>)",
                        "<span class='keyword'>???</span>:",
                        "    <span class='keyword'>print</span>(<span class='string'>'GAME OVER'</span>)"
                    ],
                    options: ["else", "elif", "then", "stop"],
                    correctAnswer: "else",
                    successLog: "Você escolheu o caminho seguro e entrou no corredor principal."
                },
                {
                    id: 3,
                    concept: "Listas e Indexação",
                    story: "No corredor, você encontra uma caixa de ferramentas digitais. Você precisa pegar a 'chave_mestra' que está na primeira posição da lista.",
                    instruction: "Acesse o primeiro item da lista (índice 0).",
                    codeTemplate: [
                        "itens = [<span class='string'>'chave_mestra'</span>, <span class='string'>'lanterna'</span>, <span class='string'>'mapa'</span>]",
                        "meu_item = itens[<span class='keyword'>???</span>]",
                        "<span class='keyword'>print</span>(<span class='string'>'Item pego: '</span> + meu_item)"
                    ],
                    options: ["0", "1", "primeiro", "chave"],
                    correctAnswer: "0",
                    successLog: "Você pegou a Chave Mestra! Ela foi adicionada ao inventário.",
                    reward: "Chave Mestra"
                },
                {
                    id: 4,
                    concept: "Loops (For)",
                    story: "Uma porta blindada bloqueia a saída. Ela tem 3 travas de segurança. Você precisa hackear todas elas sequencialmente.",
                    instruction: "Use um loop FOR para desbloquear cada trava.",
                    codeTemplate: [
                        "travas = [<span class='string'>'T1'</span>, <span class='string'>'T2'</span>, <span class='string'>'T3'</span>]",
                        "<span class='keyword'>for</span> t <span class='keyword'>in</span> <span class='keyword'>???</span>:",
                        "    <span class='func'>desbloquear</span>(t)"
                    ],
                    options: ["travas", "range(3)", "lista", "t"],
                    correctAnswer: "travas",
                    successLog: "Travas T1, T2 e T3 desbloqueadas com sucesso."
                },
                {
                    id: 5,
                    concept: "Input de Dados",
                    story: "A porta final pede uma senha numérica para liberar a saída física. A dica na tela diz: 'Ano atual'.",
                    instruction: "Receba a entrada do usuário e converta para Inteiro.",
                    codeTemplate: [
                        "senha = <span class='func'>input</span>(<span class='string'>'Digite a senha: '</span>)",
                        "<span class='keyword'>if</span> <span class='func'>int</span>(<span class='keyword'>???</span>) == 2024:",
                        "    <span class='func'>abrir_saida</span>()"
                    ],
                    options: ["senha", "input", "ano", "text"],
                    correctAnswer: "senha",
                    successLog: "Senha correta. A porta se abre. Você está livre!"
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
        this.addLog("Iniciando protocolo de segurança...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        // Formata a linha de código para substituir ??? pela seleção do usuário
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
            this.feedbackMsg = ""; // Limpa msg de erro ao tentar de novo
        },

        async runCode() {
            if (!this.userSelection) return;

            // Verifica Resposta
            if (this.userSelection === this.currentLevel.correctAnswer) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Compilação concluída com sucesso!";
                this.levelComplete = true;
                
                // Adiciona item se houver
                if (this.currentLevel.reward) {
                    this.inventory.push(this.currentLevel.reward);
                }

                // Log de história
                await this.typeWriter(this.currentLevel.successLog, "log-success");

                // Espera um pouco e vai pro próximo nível
                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                // ERRO
                this.feedbackType = "error";
                this.feedbackMsg = `Erro de Sintaxe: '${this.userSelection}' não é válido neste contexto.`;
                this.addLog("Erro na execução do script. Tente novamente.", "log-error");
            }
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length) {
                this.currentLevelIndex++;
                this.userSelection = null;
                this.levelComplete = false;
                this.feedbackMsg = "";
                
                if (this.currentLevel) {
                    this.loadLevel();
                }
            }
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Nível ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            this.isTyping = false;
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        // Efeito de digitação para imersão
        typeWriter(text, type) {
            return new Promise(resolve => {
                // Adiciona linha vazia primeiro
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
                }, 30); // Velocidade da digitação
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    // Força o scroll para o final
                    terminal.scrollTop = terminal.scrollHeight;
                    
                    // Hack extra para navegadores mobile que às vezes ignoram o primeiro comando
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
            this.addLog("Reiniciando sistema...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');