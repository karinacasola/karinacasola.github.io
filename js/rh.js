const { createApp } = Vue;

createApp({
    data() {
        return {
            phase: 1,
            currentLevelIndex: 0,
            score: 0,
            attempts: 3,
            
            userSelection: null,
            userCode: "",
            
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            showingResolution: false,
            hintActive: false,
            gameComplete: false,

            // FASE 1: Identificação de Erros (10 Exercícios)
            levelsPhase1: [
                {
                    instruction: "Por que este cálculo de média salarial está travando em loop infinito?",
                    codeTemplate: ["<span class='keyword'>int</span> i = 0;", "<span class='keyword'>while</span> (i < 5) {", "    System.out.println(<span class='string'>\"Processando folha...\"</span>);", "}"],
                    options: ["Falta i++ no bloco", "while não aceita int", "Sintaxe do println errada", "Condição sempre falsa"],
                    correctAnswer: "Falta i++ no bloco",
                    resolution: "No laço while, a variável de controle (i) precisa ser incrementada (i++) dentro do bloco, senão a condição sempre será verdadeira."
                },
                {
                    instruction: "Identifique o erro de sintaxe na impressão do contracheque.",
                    codeTemplate: ["<span class='keyword'>double</span> salario = 2500.50;", "System.out.println(<span class='string'>\"Salário: \"</span> + salario)"],
                    options: ["salario deveria ser int", "Falta ponto e vírgula (;)", "Aspas duplas inválidas", "System minúsculo"],
                    correctAnswer: "Falta ponto e vírgula (;)",
                    resolution: "Em Java, todas as instruções devem ser obrigatoriamente encerradas com ponto e vírgula (;)."
                },
                {
                    instruction: "Por que a validação do cargo não está funcionando mesmo digitando 'Gerente'?",
                    codeTemplate: ["String cargo = <span class='string'>\"Gerente\"</span>;", "<span class='keyword'>if</span> (cargo == <span class='string'>\"Gerente\"</span>) {", "    <span class='comment'>// Aprovar bônus</span>", "}"],
                    options: ["Falta parênteses", "Uso de == em vez de .equals()", "cargo não está instanciado", "Falta else"],
                    correctAnswer: "Uso de == em vez de .equals()",
                    resolution: "Em Java, == compara a referência de memória em Strings (objetos). Para comparar o texto (valor), deve-se usar cargo.equals(\"Gerente\")."
                },
                {
                    instruction: "Qual é o problema com este array de funcionários?",
                    codeTemplate: ["String[] nomes = {<span class='string'>\"Ana\"</span>, <span class='string'>\"Bruno\"</span>};", "System.out.println(nomes[2]);"],
                    options: ["Chaves {} erradas", "Array não usa colchetes", "Índice fora dos limites", "System.out inválido"],
                    correctAnswer: "Índice fora dos limites",
                    resolution: "O array tem tamanho 2. Os índices são 0 (Ana) e 1 (Bruno). Tentar acessar o índice 2 gera um ArrayIndexOutOfBoundsException."
                },
                {
                    instruction: "Por que o compilador acusa erro na variável 'imposto'?",
                    codeTemplate: ["<span class='keyword'>if</span> (salario > 2000) {", "    <span class='keyword'>double</span> imposto = 150.0;", "}", "System.out.println(imposto);"],
                    options: ["Imposto é palavra reservada", "Falta break", "salario não definido", "Variável fora de escopo"],
                    correctAnswer: "Variável fora de escopo",
                    resolution: "A variável 'imposto' foi declarada dentro do bloco IF. Ela deixa de existir fora dele. Precisa ser declarada antes do IF."
                },
                {
                    instruction: "Por que todos os departamentos após o RH são impressos neste Switch?",
                    codeTemplate: ["<span class='keyword'>switch</span>(codigo) {", "    <span class='keyword'>case</span> 1: System.out.println(<span class='string'>\"RH\"</span>);", "    <span class='keyword'>case</span> 2: System.out.println(<span class='string'>\"TI\"</span>);", "}"],
                    options: ["Falta comando break", "Case não aceita números", "Chaves erradas", "Falta default obrigatoriamente"],
                    correctAnswer: "Falta comando break",
                    resolution: "Sem o comando 'break' no final de cada case, o Java continua executando os blocos seguintes (fall-through)."
                },
                {
                    instruction: "O cálculo de bônus (10% de 2000) está dando 0. Por quê?",
                    codeTemplate: ["<span class='keyword'>int</span> salario = 2000;", "<span class='keyword'>double</span> bonus = salario * (10 / 100);"],
                    options: ["Parenteses redundantes", "bonus deveria ser int", "Divisão de inteiros resulta em 0", "Falta cast para float"],
                    correctAnswer: "Divisão de inteiros resulta em 0",
                    resolution: "Em Java, 10 / 100 são dois inteiros. A divisão trunca para 0. Você deve usar 10.0 / 100 ou 0.1."
                },
                {
                    instruction: "Identifique o erro de compilação na variável horasTrabalhadas.",
                    codeTemplate: ["<span class='keyword'>int</span> horasTrabalhadas;", "System.out.println(horasTrabalhadas + 8);"],
                    options: ["Variável local não inicializada", "Nome muito longo", "Falta aspas no + 8", "Soma proibida em println"],
                    correctAnswer: "Variável local não inicializada",
                    resolution: "Variáveis locais em Java precisam ser inicializadas (ter um valor atribuído, ex: int horas = 0;) antes de serem usadas."
                },
                {
                    instruction: "Por que apenas o primeiro candidato é contratado neste loop?",
                    codeTemplate: ["<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 0; i < 3; i++);", "{", "    System.out.println(<span class='string'>\"Contratado!\"</span>);", "}"],
                    options: ["A condição está ao contrário", "Ponto e vírgula após o for", "Chaves desnecessárias", "i < 3 roda só uma vez"],
                    correctAnswer: "Ponto e vírgula após o for",
                    resolution: "O ';' logo após os parênteses do for encerra o laço ali mesmo, fazendo com que o bloco {} abaixo execute apenas uma vez fora do laço."
                },
                {
                    instruction: "Por que o código abaixo nem chega a compilar?",
                    codeTemplate: ["<span class='keyword'>int</span> idade == 25;", "<span class='keyword'>if</span> (idade > 18) { }"],
                    options: ["== usado na atribuição", "Falta instrução no if", "Idade já definida", "Chaves vazias dão erro"],
                    correctAnswer: "== usado na atribuição",
                    resolution: "Para declarar e atribuir valor usa-se um único '=', que é o operador de atribuição. O '==' é apenas para comparação."
                }
            ],

            // FASE 2: Escrita de Código (20 Exercícios)
            levelsPhase2: [
                {
                    instruction: "Imprima a frase exata: 'Bem-vindo ao RH' no console.",
                    hint: "Use o comando de saída de texto padrão do Java: System.out.println(...);",
                    validationKeys: ["System.out.print", "\"Bem-vindo ao RH\""],
                    resolution: "<span class='builtin'>System.out.println</span>(<span class='string'>\"Bem-vindo ao RH\"</span>);"
                },
                {
                    instruction: "Declare uma variável inteira chamada 'vagas' com valor 10.",
                    hint: "Lembre-se do tipo int, do nome da variável e da atribuição com =.",
                    validationKeys: ["int", "vagas", "=", "10", ";"],
                    resolution: "<span class='keyword'>int</span> vagas = 10;"
                },
                {
                    instruction: "Crie um laço FOR tradicional que vá de 1 a 5, usando a variável 'i'.",
                    hint: "Estrutura: for(int i = 1; i <= 5; i++) { }",
                    validationKeys: ["for", "int", "i", "<", "++"],
                    resolution: "<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 1; i <= 5; i++) {\n  <span class='comment'>// bloco</span>\n}"
                },
                {
                    instruction: "Escreva um bloco IF para verificar se a variável 'idade' é maior ou igual a 18.",
                    hint: "Use os operadores >= dentro dos parênteses do if.",
                    validationKeys: ["if", "(", "idade", ">=", "18", ")"],
                    resolution: "<span class='keyword'>if</span> (idade >= 18) {\n  <span class='comment'>// Maior de idade</span>\n}"
                },
                {
                    instruction: "Declare um array de Strings chamado 'setores' com 2 elementos: 'TI' e 'RH'.",
                    hint: "Use chaves {} para inicializar o array direto na declaração.",
                    validationKeys: ["String[]", "setores", "{", "\"TI\"", "\"RH\"", "}"],
                    resolution: "String[] setores = {<span class='string'>\"TI\"</span>, <span class='string'>\"RH\"</span>};"
                },
                {
                    instruction: "Declare uma variável tipo 'double' chamada 'salario' com o valor 3500.50.",
                    hint: "Em Java, casas decimais usam ponto (.), não vírgula.",
                    validationKeys: ["double", "salario", "=", "3500.50", ";"],
                    resolution: "<span class='keyword'>double</span> salario = 3500.50;"
                },
                {
                    instruction: "Crie um laço WHILE que execute enquanto uma variável 'faltas' for menor que 3.",
                    hint: "A estrutura é: while (condicao) { }",
                    validationKeys: ["while", "(", "faltas", "<", "3", ")"],
                    resolution: "<span class='keyword'>while</span> (faltas < 3) {\n  <span class='comment'>// logica</span>\n}"
                },
                {
                    instruction: "Importe a biblioteca Scanner para ler dados do teclado (Escreva apenas a linha de importação).",
                    hint: "Fica antes da declaração da classe. Usa 'import java.util...'",
                    validationKeys: ["import", "java.util.Scanner", ";"],
                    resolution: "<span class='keyword'>import</span> java.util.Scanner;"
                },
                {
                    instruction: "Instancie um objeto Scanner chamado 'entrada' lendo do System.in.",
                    hint: "Scanner entrada = new Scanner(System.in);",
                    validationKeys: ["Scanner", "entrada", "=", "new", "Scanner(System.in)", ";"],
                    resolution: "Scanner entrada = <span class='keyword'>new</span> Scanner(System.in);"
                },
                {
                    instruction: "Declare uma variável booleana chamada 'ativo' e inicie como verdadeira.",
                    hint: "O tipo é boolean e o valor verdadeiro é 'true'.",
                    validationKeys: ["boolean", "ativo", "=", "true", ";"],
                    resolution: "<span class='keyword'>boolean</span> ativo = <span class='keyword'>true</span>;"
                },
                // Exercícios do 11 ao 20 mantidos curtos para fluidez
                { instruction: "Some +500 à variável existente 'salario' usando o operador reduzido (+=).", hint: "salario += valor;", validationKeys: ["salario", "+=", "500", ";"], resolution: "salario += 500;" },
                { instruction: "Imprima o primeiro item de um array chamado 'candidatos'.", hint: "Lembre-se que o índice inicial em Java é 0.", validationKeys: ["System.out.print", "candidatos[0]", ";"], resolution: "<span class='builtin'>System.out.println</span>(candidatos[0]);" },
                { instruction: "Crie um IF verificando se uma String 'cargo' é igual a \"Junior\" (Use método correto).", hint: "Para Strings, use o método .equals().", validationKeys: ["if", "(", "cargo.equals", "\"Junior\"", ")"], resolution: "<span class='keyword'>if</span> (cargo.equals(<span class='string'>\"Junior\"</span>)) {}" },
                { instruction: "Crie um ELSE IF verificando se 'idade' é menor que 16.", hint: "Vem depois do fechamento de chave de um if.", validationKeys: ["else if", "(", "idade", "<", "16", ")"], resolution: "<span class='keyword'>else if</span> (idade < 16) {}" },
                { instruction: "Escreva um bloco TRY-CATCH vazio capturando uma 'Exception e'.", hint: "try { } catch(Exception e) { }", validationKeys: ["try", "catch", "(Exception e)"], resolution: "<span class='keyword'>try</span> {\n} <span class='keyword'>catch</span> (Exception e) {\n}" },
                { instruction: "Declare uma constante (não pode ser alterada) inteira 'MAX_VAGAS' valendo 5.", hint: "Use o modificador 'final' antes do tipo.", validationKeys: ["final", "int", "MAX_VAGAS", "=", "5"], resolution: "<span class='keyword'>final int</span> MAX_VAGAS = 5;" },
                { instruction: "Crie um comando switch analisando a variável 'opcao'.", hint: "switch(opcao) { }", validationKeys: ["switch", "(", "opcao", ")"], resolution: "<span class='keyword'>switch</span>(opcao) {\n}" },
                { instruction: "Dentro de um switch, crie o bloco de fallback (caso nenhum seja atendido).", hint: "É a palavra-chave 'default:'.", validationKeys: ["default", ":"], resolution: "<span class='keyword'>default</span>:\n  <span class='comment'>// código</span>" },
                { instruction: "Encerre um laço de repetição imediatamente usando a palavra reservada correta.", hint: "É o comando 'break;'.", validationKeys: ["break", ";"], resolution: "<span class='keyword'>break</span>;" },
                { instruction: "Declare o método 'main' padrão do Java (linha completa de assinatura).", hint: "public static void main(String[] args)", validationKeys: ["public", "static", "void", "main", "String[]"], resolution: "<span class='keyword'>public static void</span> <span class='func'>main</span>(String[] args) {\n}" }
            ]
        }
    },
    computed: {
        currentLevels() { return this.phase === 1 ? this.levelsPhase1 : this.levelsPhase2; },
        currentLevel() { return this.currentLevels[this.currentLevelIndex]; }
    },
    mounted() {
        this.addLog("Iniciando JVM Virtual v1.0...", "log-info");
        this.addLog("Carregando Módulo RH...", "log-info");
        setTimeout(() => this.loadLevel(), 1000);
    },
    methods: {
        selectOption(option) {
            if (this.isTyping || this.showingResolution) return;
            this.userSelection = option;
            this.feedbackMsg = "";
        },

        showHint() {
            this.hintActive = true;
            this.addLog("Dica solicitada. (-0 pontos)", "log-warning");
        },

        async runAction() {
            this.isTyping = true;
            this.feedbackMsg = "";
            let isCorrect = false;

            if (this.phase === 1) {
                isCorrect = this.userSelection === this.currentLevel.correctAnswer;
                await this.typeWriter(`> Executando Analisador Estático...`, "log-default");
            } else {
                // FASE 2: Validação via Regex/Keywords
                let code = this.userCode.replace(/\s+/g, ' '); // normaliza espaços
                isCorrect = this.currentLevel.validationKeys.every(key => 
                    code.toLowerCase().includes(key.toLowerCase()) || code.includes(key)
                );
                await this.typeWriter(`> javac Main.java`, "log-default");
            }

            if (isCorrect) {
                this.feedbackType = "success";
                this.score++;
                this.feedbackMsg = this.phase === 1 ? "Problema identificado corretamente!" : "Compilado sem erros!";
                await this.typeWriter(`[SUCESSO] ${this.feedbackMsg}`, "log-success");
                
                setTimeout(() => { this.nextLevel(); }, 1500);
            } else {
                this.attempts--;
                if (this.attempts > 0) {
                    this.feedbackType = "warning";
                    this.feedbackMsg = `Incorreto. Você tem ${this.attempts} tentativa(s) restante(s).`;
                    await this.typeWriter(`[AVISO] Falha detectada. Tente novamente.`, "log-warning");
                    this.isTyping = false;
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Tentativas esgotadas para este exercício.";
                    this.showingResolution = true;
                    await this.typeWriter(`[ERRO CRÍTICO] Falha ao processar código.`, "log-error");
                    this.isTyping = false;
                }
            }
        },

        nextLevel() {
            if (this.currentLevelIndex < this.currentLevels.length - 1) {
                // Próximo exercício da fase atual
                this.currentLevelIndex++;
                this.resetState();
                this.loadLevel();
            } else {
                // Fim da Fase
                if (this.phase === 1) {
                    this.phase = 2;
                    this.currentLevelIndex = 0;
                    this.resetState();
                    this.addLog("--- FASE 1 CONCLUÍDA ---", "log-header");
                    this.addLog("Iniciando Fase 2: Codificação Prática", "log-info");
                    setTimeout(() => this.loadLevel(), 1000);
                } else {
                    // Fim do Jogo
                    this.gameComplete = true;
                    this.addLog("--- TREINAMENTO FINALIZADO ---", "log-header");
                    this.addLog(`Pontuação Final: ${this.score} / 30`, "log-success");
                }
            }
        },

        resetState() {
            this.userSelection = null;
            this.userCode = "";
            this.attempts = 3;
            this.showingResolution = false;
            this.hintActive = false;
            this.feedbackMsg = "";
            this.isTyping = false;
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Exercício ${this.currentLevelIndex + 1}...`, "log-default");
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
                    if (!this.logs[currentLogIndex]) { clearInterval(interval); resolve(); return; }
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) { clearInterval(interval); resolve(); }
                }, 10);
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) terminal.scrollTop = terminal.scrollHeight;
            });
        },

        generatePDF() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: #569cd6;">Certificado de Conclusão</h1>
                    <h2>Treinamento JAVA HR TECH</h2>
                    <p style="margin-top: 30px; font-size: 18px;">Certificamos que o colaborador concluiu o treinamento de Lógica Estruturada em Java focada no Departamento Pessoal.</p>
                    <div style="margin: 40px auto; padding: 20px; border: 2px solid #333; width: 50%; font-size: 24px; font-weight: bold;">
                        Pontuação Final: ${this.score} / 30
                    </div>
                    <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            `;
            
            html2pdf().set({
                margin: 1, filename: 'certificado_java_rh.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            }).from(element).save();
        },

        resetGame() {
            this.phase = 1; this.currentLevelIndex = 0; this.score = 0;
            this.logs = []; this.gameComplete = false; this.resetState();
            this.addLog("Reiniciando JVM...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');