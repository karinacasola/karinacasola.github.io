const { createApp } = Vue;

createApp({
    data() {
        return {
            currentTopicIndex: 0,
            isTyping: false,
            logs: [],
            
            topics: [
                {
                    id: 1,
                    title: "1. Importando Bibliotecas (O topo de tudo)",
                    icon: "bi-puzzle-fill",
                    explanation: "A primeira coisa que fazemos em um arquivo Java, antes mesmo de dar nome ao nosso programa, é trazer as ferramentas extras que vamos precisar. Fazemos isso com o comando <code>import</code>.<br><br>O Java tem um núcleo básico rápido, mas ferramentas externas ficam em 'pacotes'. O caso mais comum é o <code>Scanner</code>, que nos permite ler o que o usuário digita no teclado.",
                    alert: "A declaração 'import' deve ser SEMPRE a primeira linha de código útil do seu arquivo.",
                    codeLines: [
                        "<span class='comment'>// 1. O import vem antes de tudo! Trazemos a ferramenta do pacote java.util</span>",
                        "<span class='keyword'>import</span> java.util.Scanner;",
                        "",
                        "<span class='keyword'>public class</span> CadastroRH {",
                        "  <span class='keyword'>public static void</span> <span class='builtin'>main</span>(String[] args) {",
                        "    <span class='comment'>// 2. Agora podemos usar a ferramenta para ler o teclado (System.in)</span>",
                        "    Scanner leitor = <span class='keyword'>new</span> Scanner(System.in);",
                        "    ",
                        "    System.out.println(<span class='string'>\"Ferramenta de leitura configurada!\"</span>);",
                        "  }",
                        "}"
                    ],
                    terminalOutputs: [
                        { text: "Ferramenta de leitura configurada!", type: "log-success" }
                    ]
                },
                {
                    id: 2,
                    title: "2. Sintaxe Base e Print",
                    icon: "bi-terminal-fill",
                    explanation: "Depois das importações, criamos a <strong>Classe</strong> e o método principal chamado <strong>main</strong>. Todo o seu código vai dentro das chaves <code>{ }</code> desse <code>main</code>.<br><br><strong>Regra de ouro:</strong> toda instrução em Java deve terminar com ponto e vírgula (;). Para exibir mensagens na tela, utilizamos o comando <code>System.out.println()</code>.",
                    alert: "O Java é 'Case Sensitive', ou seja, ele diferencia maiúsculas de minúsculas. 'System' obrigatoriamente começa com S maiúsculo!",
                    codeLines: [
                        "<span class='keyword'>public class</span> Exemplo {",
                        "  <span class='keyword'>public static void</span> <span class='builtin'>main</span>(String[] args) {",
                        "    <span class='comment'>// O println imprime o texto e pula uma linha</span>",
                        "    System.out.println(<span class='string'>\"Iniciando sistema de Folha...\"</span>);",
                        "  }",
                        "}"
                    ],
                    terminalOutputs: [
                        { text: "Iniciando sistema de Folha...", type: "log-output" }
                    ]
                },
                {
                    id: 3,
                    title: "3. Tipos de Dados e Variáveis",
                    icon: "bi-box-seam-fill",
                    explanation: "O Java é fortemente tipado. Precisamos avisar ao computador <strong>qual o tipo de dado</strong> que a variável vai guardar antes de colocar um valor nela.<br>Os principais usados no RH são:<br>• <code>int</code> para inteiros (ex: faltas, número de dependentes).<br>• <code>double</code> para decimais (ex: salário, descontos).<br>• <code>String</code> para textos (ex: nome, cargo).",
                    alert: "Números decimais no código Java usam ponto (.) e não vírgula (,). Exemplo: 3500.50",
                    codeLines: [
                        "<span class='keyword'>int</span> horasTrabalhadas = 160;",
                        "<span class='keyword'>double</span> valorHora = 45.50;",
                        "String nomeFuncionario = <span class='string'>\"Ana Silva\"</span>;",
                        "",
                        "System.out.println(<span class='string'>\"Funcionária: \"</span> + nomeFuncionario);",
                        "System.out.println(<span class='string'>\"Horas: \"</span> + horasTrabalhadas);"
                    ],
                    terminalOutputs: [
                        { text: "Funcionária: Ana Silva", type: "log-output" },
                        { text: "Horas: 160", type: "log-output" }
                    ]
                },
                {
                    id: 4,
                    title: "4. Matemática e Divisão de Inteiros",
                    icon: "bi-calculator-fill",
                    explanation: "As operações básicas são soma (+), subtração (-), multiplicação (*) e divisão (/).<br><br><strong>O grande perigo estrutural:</strong> Se você dividir dois números inteiros, o Java vai gerar um resultado inteiro, ignorando o resto. Para calcular porcentagens (como 5% = 5/100), se você escrever <code>(5 / 100)</code> o Java vai truncar isso e entenderá como <code>0</code>.",
                    alert: "Para forçar uma divisão decimal correta, um dos números deve ter um '.0' (ex: 5.0 / 100) ou simplesmente escreva 0.05.",
                    codeLines: [
                        "<span class='keyword'>double</span> salario = 2000.0;",
                        "<span class='comment'>// Errado: 5/100 resulta em 0</span>",
                        "<span class='keyword'>double</span> bonusErro = salario * (5 / 100);",
                        "",
                        "<span class='comment'>// Correto: Usando 5.0 ou 0.05</span>",
                        "<span class='keyword'>double</span> bonusCerto = salario * (5.0 / 100);",
                        "",
                        "System.out.println(<span class='string'>\"Bônus Errado: \"</span> + bonusErro);",
                        "System.out.println(<span class='string'>\"Bônus Certo: \"</span> + bonusCerto);"
                    ],
                    terminalOutputs: [
                        { text: "Bônus Errado: 0.0", type: "log-error" },
                        { text: "Bônus Certo: 100.0", type: "log-success" }
                    ]
                },
                {
                    id: 5,
                    title: "5. Arrays (Listas)",
                    icon: "bi-list-ol",
                    explanation: "Arrays armazenam vários valores do mesmo tipo. Em Java, <strong>o primeiro elemento sempre está na posição 0</strong>.<br><br>Se um array tem 3 itens, as posições são 0, 1 e 2. Se você tentar acessar a posição 3, o Java vai gerar o erro fatal <code>ArrayIndexOutOfBoundsException</code>, travando o programa.",
                    alert: "Arrays em Java utilizam colchetes [] na declaração e no acesso, mas são inicializados com chaves {}.",
                    codeLines: [
                        "<span class='comment'>// Array de 3 posições (índices 0, 1 e 2)</span>",
                        "String[] departamentos = {<span class='string'>\"RH\"</span>, <span class='string'>\"TI\"</span>, <span class='string'>\"Vendas\"</span>};",
                        "",
                        "System.out.println(<span class='string'>\"Primeiro depto: \"</span> + departamentos[0]);",
                        "System.out.println(<span class='string'>\"Último depto: \"</span> + departamentos[2]);"
                    ],
                    terminalOutputs: [
                        { text: "Primeiro depto: RH", type: "log-output" },
                        { text: "Último depto: Vendas", type: "log-output" }
                    ]
                },
                {
                    id: 6,
                    title: "6. Condicionais e Textos",
                    icon: "bi-diagram-split",
                    explanation: "Usamos <code>if</code> e <code>else</code> para criar regras. Para comparar números usamos <code>==</code>, <code>></code>, <code><</code>.<br><br><strong>Para comparar Strings (textos), NUNCA use `==`.</strong> O `==` verifica se os textos ocupam o mesmo espaço físico na memória do computador, o que vai falhar quase sempre. Sempre use o método <code>.equals()</code>.",
                    alert: "O sinal de = (um só) atribui valor. O sinal de == (dois seguidos) compara variáveis primitivas (como números e booleanos).",
                    codeLines: [
                        "String cargo = <span class='string'>\"Gerente\"</span>;",
                        "<span class='keyword'>int</span> tempoEmpresa = 3;",
                        "",
                        "<span class='keyword'>if</span> (cargo.equals(<span class='string'>\"Gerente\"</span>)) {",
                        "  System.out.println(<span class='string'>\"Acesso Liberado à Folha.\"</span>);",
                        "} <span class='keyword'>else</span> {",
                        "  System.out.println(<span class='string'>\"Acesso Negado.\"</span>);",
                        "}"
                    ],
                    terminalOutputs: [
                        { text: "Acesso Liberado à Folha.", type: "log-success" }
                    ]
                },
                {
                    id: 7,
                    title: "7. Switch e o perigo do Fall-through",
                    icon: "bi-signpost-split-fill",
                    explanation: "O <code>switch</code> é ótimo para substituir vários `if/else` seguidos. Ele procura o <code>case</code> correspondente à variável informada.<br><br><strong>A Armadilha:</strong> Se você não usar a palavra <code>break;</code> no final de um case, o Java continuará executando todos os cases abaixo dele, misturando lógicas.",
                    alert: "Sempre adicione um caso 'default:' no final para prever opções inválidas ou não mapeadas.",
                    codeLines: [
                        "String nivel = <span class='string'>\"Pleno\"</span>;",
                        "",
                        "<span class='keyword'>switch</span>(nivel) {",
                        "  <span class='keyword'>case</span> <span class='string'>\"Junior\"</span>:",
                        "    System.out.println(<span class='string'>\"Salário: R$ 3000\"</span>);",
                        "    <span class='keyword'>break</span>;",
                        "  <span class='keyword'>case</span> <span class='string'>\"Pleno\"</span>:",
                        "    System.out.println(<span class='string'>\"Salário: R$ 5000\"</span>);",
                        "    <span class='keyword'>break</span>; <span class='comment'>// Se faltar o break aqui, o Pleno ganha 8000 também!</span>",
                        "  <span class='keyword'>case</span> <span class='string'>\"Sênior\"</span>:",
                        "    System.out.println(<span class='string'>\"Salário: R$ 8000\"</span>);",
                        "    <span class='keyword'>break</span>;",
                        "}"
                    ],
                    terminalOutputs: [
                        { text: "Salário: R$ 5000", type: "log-output" }
                    ]
                },
                {
                    id: 8,
                    title: "8. Laços de Repetição (For)",
                    icon: "bi-arrow-repeat",
                    explanation: "O <code>for</code> permite repetir um bloco de código várias vezes.<br>Sua estrutura é dividida em 3 partes: <strong>(1) Variável de Início; (2) Condição de parada; (3) Incremento</strong>.<br><br>Para percorrer as listas (Arrays), a convenção é iniciar com `i = 0` e rodar até `i < array.length`.",
                    alert: "Não coloque ponto e vírgula após fechar os parênteses do for. Isso encerra o laço prematuramente e o código abaixo dele rodará só uma vez.",
                    codeLines: [
                        "String[] equipe = {<span class='string'>\"João\"</span>, <span class='string'>\"Maria\"</span>};",
                        "",
                        "<span class='comment'>// i inicia em 0; repete enquanto i for menor que 2; soma 1 ao i a cada volta</span>",
                        "<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 0; i < equipe.length; i++) {",
                        "  System.out.println(<span class='string'>\"Analisando: \"</span> + equipe[i]);",
                        "}"
                    ],
                    terminalOutputs: [
                        { text: "Analisando: João", type: "log-output" },
                        { text: "Analisando: Maria", type: "log-output" }
                    ]
                },
                {
                    id: 9,
                    title: "9. Escopo de Variáveis",
                    icon: "bi-bounding-box-circles",
                    explanation: "O escopo dita onde uma variável pode ser usada. No Java: <strong>uma variável deixa de existir quando a chave '{ }' em que ela foi declarada é fechada.</strong><br><br>Se você criar a variável <code>imposto</code> dentro das chaves de um <code>if</code>, ela será destruída ao final desse <code>if</code>, causando erro se tentar usar embaixo.",
                    alert: "Sempre declare as variáveis totalizadoras (como 'totalFolha' ou 'imposto') antes e fora dos blocos if/for/switch.",
                    codeLines: [
                        "<span class='keyword'>double</span> salario = 3000.0;",
                        "<span class='keyword'>double</span> imposto = 0.0; <span class='comment'>// Nasce no escopo principal, sobrevive até o fim</span>",
                        "",
                        "<span class='keyword'>if</span> (salario > 2500) {",
                        "  <span class='comment'>// Aqui apenas alteramos seu valor, não criamos uma nova</span>",
                        "  imposto = salario * 0.10;",
                        "}",
                        "",
                        "<span class='comment'>// Funciona perfeitamente, pois 'imposto' foi declarada lá em cima</span>",
                        "System.out.println(<span class='string'>\"Desconto: R$ \"</span> + imposto);"
                    ],
                    terminalOutputs: [
                        { text: "Desconto: R$ 300.0", type: "log-output" }
                    ]
                }
            ]
        }
    },
    computed: {
        currentTopic() {
            return this.topics[this.currentTopicIndex];
        }
    },
    mounted() {
        this.addLog("Iniciando Módulo de Consulta...", "log-info");
        this.addLog("Selecione um tópico acima e clique em Executar para testar.", "log-info");
    },
    methods: {
        selectTopic(index) {
            if (this.isTyping) return;
            this.currentTopicIndex = index;
            this.logs = []; 
            this.addLog(`Tópico carregado: ${this.currentTopic.title}`, "log-info");
        },

        async runExample() {
            if (this.isTyping) return;
            this.isTyping = true;
            
            this.logs = [];
            await this.typeWriter(`$ javac ExemploPratico.java`, "log-default");
            await this.typeWriter(`$ java ExemploPratico`, "log-default");
            
            for (let output of this.currentTopic.terminalOutputs) {
                await this.typeWriter(output.text, output.type);
            }
            
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
                }, 15); 
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) terminal.scrollTop = terminal.scrollHeight;
            });
        }
    }
}).mount('#app');