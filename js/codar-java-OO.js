const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Treinamento ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const roundOver = ref(false);
        const gameOver = ref(false);
        const userCode = ref("");
        const terminalBody = ref(null);
        
        // --- Controle de Dicas ---
        const hintsUsed = ref(0);
        const maxHints = 2;
        const maxAttempts = 3;

        // --- Banco de Questões (Orientação a Objetos - 10 Exercícios Práticos) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Crie a classe pública 'Main' com o método 'main'. Instancie um objeto da classe 'Carro' chamado 'c1', defina o atributo 'modelo' como 'Sedan' e chame o método 'acelerar()'.",
                variables: "Classes: Main, Carro | Objeto: c1 | Atributo: modelo | Método: acelerar()",
                scenario: "Sistema de Montadora: Ponto de entrada do sistema.",
                expectedPatterns: ["public class Main", "main", "new Carro", "c1.modelo", "Sedan", "c1.acelerar"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    Carro c1 = new Carro();\n    c1.modelo = \"Sedan\";\n    c1.acelerar();\n  }\n}",
                explanation: "O método main é o ponto de partida. Instanciamos a classe usando 'new' para construir o objeto na memória.",
                hints: [
                    "Lembre-se da assinatura: public static void main(String[] args)",
                    "Para instanciar use: Carro c1 = new Carro();"
                ]
            },
            {
                id: 2,
                instruction: "Crie a classe 'Produto' com os atributos privados 'nome' (String) e 'preco' (double). Crie o método público 'setPreco(double valor)' que só atualize o preço se o valor for maior que zero.",
                variables: "Classe: Produto | Atributos: nome, preco | Método: setPreco | Parâmetro: valor",
                scenario: "E-commerce: Encapsulamento e proteção de valores comerciais.",
                expectedPatterns: ["class Produto", "private String nome", "private double preco", "public void setPreco", "if", "> 0", "this.preco"],
                expectedExample: "public class Produto {\n  private String nome;\n  private double preco;\n  public void setPreco(double valor) {\n    if (valor > 0) {\n      this.preco = valor;\n    }\n  }\n}",
                explanation: "O encapsulamento protege dados (private). A escrita é feita por Setters (public) validando regras de negócio.",
                hints: [
                    "Use o 'this' para referenciar o atributo da classe: this.preco = valor;"
                ]
            },
            {
                id: 3,
                instruction: "Crie a classe 'Funcionario' com o atributo privado 'salario' (double). Implemente o método público 'getSalario()' que apenas retorne o valor do atributo.",
                variables: "Classe: Funcionario | Atributo: salario | Método: getSalario()",
                scenario: "RH Corporativo: Consulta de folha de pagamento.",
                expectedPatterns: ["class Funcionario", "private double salario", "public double getSalario", "return", "salario"],
                expectedExample: "public class Funcionario {\n  private double salario;\n  public double getSalario() {\n    return this.salario;\n  }\n}",
                explanation: "O Getter expõe valores de forma segura para outras classes do sistema realizarem leituras.",
                hints: [
                    "A assinatura do método deve ser: public double getSalario()",
                    "Use a palavra-chave 'return' para devolver o valor."
                ]
            },
            {
                id: 4,
                instruction: "Crie a classe 'PagamentoCartao' que herda (estende) da classe 'Pagamento'. Crie um construtor vazio.",
                variables: "Classes: PagamentoCartao, Pagamento",
                scenario: "Gateway Financeiro: Reaproveitamento de regras base.",
                expectedPatterns: ["class PagamentoCartao extends Pagamento"],
                expectedExample: "public class PagamentoCartao extends Pagamento {\n  public PagamentoCartao() {}\n}",
                explanation: "A palavra 'extends' promove o reaproveitamento estrutural (Herança).",
                hints: [
                    "Utilize a sintaxe: class Filha extends Pai"
                ]
            },
            {
                id: 5,
                instruction: "Na classe 'Cachorro' que estende 'Animal', use a anotação '@Override' para sobrescrever o método público 'emitirSom()'. Dentro dele, imprima 'Au au!'.",
                variables: "Classes: Cachorro, Animal | Método: emitirSom()",
                scenario: "Motor de Jogos: Polimorfismo e comportamento customizado.",
                expectedPatterns: ["class Cachorro extends Animal", "@Override", "public void emitirSom", "Au au!"],
                expectedExample: "class Cachorro extends Animal {\n  @Override\n  public void emitirSom() {\n    System.out.println(\"Au au!\");\n  }\n}",
                explanation: "Polimorfismo permite que a mesma ação (emitirSom) seja feita de maneira específica pela classe filha.",
                hints: [
                    "O @Override garante ao compilador que uma reescrita intencional está ocorrendo."
                ]
            },
            {
                id: 6,
                instruction: "Demonstre Composição: Crie a classe 'Carro'. Declare um atributo privado 'motor' do tipo 'Motor'. Crie o construtor público 'Carro()' e instancie o motor lá dentro (this.motor = new Motor()).",
                variables: "Classes: Carro, Motor | Atributo: motor | Construtor: Carro()",
                scenario: "Engenharia Mecânica: Vínculo vital de composição (forte).",
                expectedPatterns: ["class Carro", "private Motor motor", "public Carro", "this.motor = new Motor"],
                expectedExample: "public class Carro {\n  private Motor motor;\n  public Carro() {\n    this.motor = new Motor();\n  }\n}",
                explanation: "Se a classe mãe (Carro) criar a parte (Motor) internamente, é caracterizada uma composição (associação forte).",
                hints: [
                    "Declare a variável fora do construtor: private Motor motor;",
                    "Instancie o objeto dentro do bloco public Carro() { ... }"
                ]
            },
            {
                id: 7,
                instruction: "No mesmo arquivo, declare uma classe 'Pessoa' (sem modificador public) com atributo String 'nome'. Abaixo dela, crie a classe pública 'Sistema' contendo apenas o método 'main'.",
                variables: "Classes: Pessoa, Sistema | Atributo: nome | Método: main",
                scenario: "Configuração de Projeto: Estrutura multiclasse em arquivo único.",
                expectedPatterns: ["class Pessoa", "String nome", "public class Sistema", "main"],
                expectedExample: "class Pessoa {\n  String nome;\n}\npublic class Sistema {\n  public static void main(String[] args) {\n  }\n}",
                explanation: "O compilador Java exige que no máximo uma classe tenha modificador 'public' por arquivo (e que ele leve seu nome).",
                hints: [
                    "Remova o termo 'public' da classe Pessoa."
                ]
            },
            {
                id: 8,
                instruction: "Crie a classe 'Cliente' com o atributo privado 'cpf' (String). Crie o construtor público da classe que receba um String 'cpf' por parâmetro e inicialize o atributo usando 'this'.",
                variables: "Classe: Cliente | Atributo: cpf | Parâmetro: cpf",
                scenario: "CRM: Obrigação de dependências (injeção de estado no nascimento).",
                expectedPatterns: ["class Cliente", "private String cpf", "public Cliente", "this.cpf = cpf"],
                expectedExample: "public class Cliente {\n  private String cpf;\n  public Cliente(String cpf) {\n    this.cpf = cpf;\n  }\n}",
                explanation: "Construtores configuram a identidade do objeto imediatamente ao ser instanciado.",
                hints: [
                    "O construtor não possui tipo de retorno, ele leva apenas o nome da classe: public Cliente(String cpf) { ... }"
                ]
            },
            {
                id: 9,
                instruction: "Crie a classe 'ContaBancaria' com o atributo privado 'saldo' (double). Crie o método público 'sacar(double valor)'. Se 'valor > 0' e 'saldo >= valor', subtraia o valor do saldo. Senão, imprima 'Saldo Insuficiente'.",
                variables: "Classe: ContaBancaria | Atributos: saldo | Método: sacar | Parâmetro: valor",
                scenario: "Fintech: Motor transacional e garantias financeiras.",
                expectedPatterns: ["class ContaBancaria", "private double saldo", "public void sacar", "if", "> 0", ">=", "this.saldo", "-=", "else", "Saldo Insuficiente"],
                expectedExample: "public class ContaBancaria {\n  private double saldo;\n  public void sacar(double valor) {\n    if (valor > 0 && this.saldo >= valor) {\n      this.saldo -= valor;\n    } else {\n      System.out.println(\"Saldo Insuficiente\");\n    }\n  }\n}",
                explanation: "Métodos são onde vive a regra de negócio. Operações aritméticas só correm após sanitização do input e verificação do estado interno.",
                hints: [
                    "Use o operador lógico && (AND) para verificar se valor > 0 E saldo >= valor na mesma linha."
                ]
            },
            {
                id: 10,
                instruction: "Crie a classe pública 'App'. Implemente o método de inicialização do Java ('main') e exiba no console a mensagem 'Sistema OOP Iniciado'.",
                variables: "Classe: App | Método: main | Parâmetro: args",
                scenario: "Infraestrutura: Deploy de rotinas em ambiente de produção.",
                expectedPatterns: ["public class App", "public static void main", "String", "args", "System.out.println", "Sistema OOP Iniciado"],
                expectedExample: "public class App {\n  public static void main(String[] args) {\n    System.out.println(\"Sistema OOP Iniciado\");\n  }\n}",
                explanation: "O pilar fundamental de qualquer aplicação. Sem o main(), não há ciclo de vida para os objetos gerados.",
                hints: [
                    "Escreva a assinatura clássica completa para evitar erro de inicialização (public static void main)."
                ]
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal ---
        const scrollToBottom = () => {
            nextTick(() => {
                if (terminalBody.value) { 
                    terminalBody.value.scrollTop = terminalBody.value.scrollHeight; 
                }
            });
        };

        const addLog = (text, type = "log-default") => {
            logs.value.push({ text, type });
            scrollToBottom();
        };

        const typeWriter = (text, type) => {
            return new Promise(resolve => {
                logs.value.push({ text: "", type });
                let currentLogIndex = logs.value.length - 1; 
                let i = 0;
                
                const interval = setInterval(() => {
                    logs.value[currentLogIndex].text += text.charAt(i);
                    scrollToBottom(); 
                    i++;
                    
                    if (i === text.length) { 
                        clearInterval(interval); 
                        resolve(); 
                    }
                }, 15);
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Construindo Sistema (ID: ${currentQuestion.value.id})...`, "log-info");
            await typeWriter(`[Cenário de Negócio] ${currentQuestion.value.scenario}`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userCode.value = "";
            attempts.value = 0; 
            hintsUsed.value = 0;
            roundOver.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                resetTurn();
                loadQuestion();
            } else {
                gameOver.value = true;
                addLog("Trilha de regras de negócios OOP concluída. Gerando relatórios...", "log-info");
            }
        };

        const requestHint = () => {
            if (hintsUsed.value < maxHints && !roundOver.value && !isTyping.value) {
                const hintText = currentQuestion.value.hints[hintsUsed.value];
                hintsUsed.value++;
                feedbackType.value = "info";
                feedbackMsg.value = `<i class='bi bi-lightbulb-fill'></i> <strong>Dica ${hintsUsed.value}:</strong> ${hintText}`;
                addLog(`[Ajuda] Análise de Requisitos solicitada (${hintsUsed.value}/${maxHints}).`, "log-info");
            }
        };

        const submitCode = () => {
            if (isTyping.value || roundOver.value) return;

            const code = userCode.value;
            if (!code.trim()) {
                feedbackType.value = "warning";
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio. Defina a estrutura OOP completa.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = `<i class='bi bi-check-lg'></i> Fluxo aprovado no ambiente de testes! <br><br><strong>Gabarito Oficial:</strong><br><pre><code>${currentQuestion.value.expectedExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
                addLog(`[Success] Arquitetura OOP para o Cenário ${currentQuestion.value.id} aprovada.`, "log-success");
                roundOver.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Compilação falhou repetidamente. Estrutura reprovada.<br><br><strong>Gabarito Oficial Esperado:</strong><br><pre><code>${currentQuestion.value.expectedExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
                    addLog(`[Erro] Código-fonte diverge da especificação corporativa. Limite excedido.`, "log-error");
                    roundOver.value = true;
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Revise o uso das regras de classes e modificadores. Tentativa ${attempts.value}/${maxAttempts}`;
                    addLog(`[Aviso] Revisão de código exigida - falha na validação ${attempts.value}.`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Engenheiro(a) homologado(a) na Arquitetura de Software Orientada a Objetos.";
            if (score.value < 10) performanceMsg = "Necessária revisão teórica sobre UML, Classes, Encapsulamento, Herança e Polimorfismo.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Homologação de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Design Patterns Orientados a Objeto</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Homologação:</strong> ${data}</p>
                    <p>O presente documento reflete os testes aplicados a ${questions.value.length} cenários práticos de arquitetura e design sistêmico.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Qualidade de Código (QA)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 10 ? '#5C8069' : (score.value >= 6 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Estruturas Passaram no Teste Unitário</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico Técnico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento auditado e gerado pela Suíte JAVA.OOP.B2B
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_OOP_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const resetGame = () => {
            currentQuestionIndex.value = 0; 
            score.value = 0; 
            logs.value = []; 
            gameOver.value = false;
            resetTurn();
            addLog("Levantando contêineres de compilação Java...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador de Ambiente Corporativo (Módulo OOP)...", "log-info");
            setTimeout(() => { loadQuestion(); }, 1000);
        });

        return {
            questions,
            currentQuestionIndex,
            currentQuestion,
            progressPercentage,
            attempts,
            score,
            logs,
            isTyping,
            feedbackMsg,
            feedbackType,
            roundOver,
            gameOver,
            userCode,
            terminalBody,
            hintsUsed,
            maxHints,
            requestHint,
            submitCode,
            nextQuestion,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');