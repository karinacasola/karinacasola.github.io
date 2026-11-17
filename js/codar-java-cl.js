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

        // --- Banco de Questões (Orientação a Objetos - 15 Exercícios Práticos Java) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Nível 1: Crie a classe 'Produto' com atributos privados 'codigo' (int) e 'preco' (double). No construtor, use 'if/else': se o preco for menor que 0.0, atribua 0.0. Caso contrário, atribua o valor recebido.",
                variables: "Classe: Produto | Atributos: codigo, preco",
                scenario: "E-commerce: Impedir produtos com preço negativo logo no momento de sua criação.",
                expectedPatterns: ["class Produto", "private int codigo", "private double preco", "public Produto", "if", "< 0", "this.preco = 0", "else"],
                expectedExample: "public class Produto {\n  private int codigo;\n  private double preco;\n  public Produto(int codigo, double preco) {\n    this.codigo = codigo;\n    if (preco < 0.0) {\n      this.preco = 0.0;\n    } else {\n      this.preco = preco;\n    }\n  }\n}",
                explanation: "O uso da condicional dentro do construtor garante que nenhum objeto seja instanciado com estados inconsistentes.",
                hints: [
                    "Dentro do construtor, faça: if (preco < 0.0) { this.preco = 0.0; } else { this.preco = preco; }"
                ]
            },
            {
                id: 2,
                instruction: "Nível 1: Crie a classe 'Aluno' com 'nome' (String) e 'nota' (double). No construtor, se a nota informada for maior que 10.0, force this.nota = 10.0. Caso contrário, mantenha o valor.",
                variables: "Classe: Aluno | Atributos: nome, nota",
                scenario: "Sistema Escolar: A nota máxima permitida é 10. Garantir essa regra na criação.",
                expectedPatterns: ["class Aluno", "private String nome", "private double nota", "if", "> 10", "this.nota = 10", "else"],
                expectedExample: "public class Aluno {\n  private String nome;\n  private double nota;\n  public Aluno(String nome, double nota) {\n    this.nome = nome;\n    if (nota > 10.0) {\n      this.nota = 10.0;\n    } else {\n      this.nota = nota;\n    }\n  }\n}",
                explanation: "A condicional limita valores máximos, sendo uma ótima prática de regra de negócios na raiz da classe.",
                hints: [
                    "A comparação deve ser if (nota > 10.0)."
                ]
            },
            {
                id: 3,
                instruction: "Nível 1: Crie a classe 'Senha' com o atributo 'valor' (String). No construtor, verifique se o texto recebido tem menos de 6 caracteres (valor.length() < 6). Se sim, defina a senha como '123456'. Senão, atribua o texto.",
                variables: "Classe: Senha | Atributos: valor",
                scenario: "Segurança: Forçar um tamanho mínimo para credenciais.",
                expectedPatterns: ["class Senha", "private String valor", "if", "length", "< 6", "123456", "else"],
                expectedExample: "public class Senha {\n  private String valor;\n  public Senha(String valor) {\n    if (valor.length() < 6) {\n      this.valor = \"123456\";\n    } else {\n      this.valor = valor;\n    }\n  }\n}",
                explanation: "Métodos de String, como length(), podem ser usados diretamente nas condições dos construtores.",
                hints: [
                    "A condição correta é: if (valor.length() < 6)"
                ]
            },
            {
                id: 4,
                instruction: "Nível 1: Crie a classe 'Funcionario' com 'salario' (double). No construtor, valide se o salário é inferior ao salário mínimo (1412.00). Se for, reajuste this.salario = 1412.00. Senão, mantenha.",
                variables: "Classe: Funcionario | Atributos: salario",
                scenario: "Folha de Pagamento: Respeitar o piso salarial legal no ato do registro.",
                expectedPatterns: ["class Funcionario", "private double salario", "if", "< 1412", "this.salario = 1412", "else"],
                expectedExample: "public class Funcionario {\n  private double salario;\n  public Funcionario(double salario) {\n    if (salario < 1412.00) {\n      this.salario = 1412.00;\n    } else {\n      this.salario = salario;\n    }\n  }\n}",
                explanation: "Substituir valores ilegais por um piso padrão evita que o sistema precise lidar com exceções posteriormente.",
                hints: [
                    "Não esqueça do modificador private para garantir que o salário não seja alterado de fora ignorando a regra."
                ]
            },
            {
                id: 5,
                instruction: "Nível 1: Crie a classe 'Estoque' com 'quantidade' (int). Crie um construtor padronizando tudo. Crie o método 'adicionarItens(int qtd)'. Nele, use if: se qtd for menor ou igual a 0, imprima 'Erro', senão some a qtd na quantidade.",
                variables: "Classe: Estoque | Atributos: quantidade | Método: adicionarItens",
                scenario: "Controle de Inventário: Evitar a inserção de quantidades negativas ou zeradas.",
                expectedPatterns: ["class Estoque", "private int quantidade", "public void adicionarItens", "if", "<= 0", "System.out.println", "else", "this.quantidade \\+="],
                expectedExample: "public class Estoque {\n  private int quantidade;\n  public Estoque(int quantidade) {\n    this.quantidade = quantidade;\n  }\n  public void adicionarItens(int qtd) {\n    if (qtd <= 0) {\n      System.out.println(\"Erro\");\n    } else {\n      this.quantidade += qtd;\n    }\n  }\n}",
                explanation: "Regras de if/else se aplicam não apenas aos construtores, mas a qualquer método que modifique o estado do objeto.",
                hints: [
                    "A lógica de acréscimo é: this.quantidade += qtd; (ou this.quantidade = this.quantidade + qtd;)"
                ]
            },
            {
                id: 6,
                instruction: "Nível 2 (Herança): 'Conta' com atributo 'protected double saldo'. Subclasse 'ContaCorrente' que recebe no construtor um deposito. Após chamar super(), se deposito < 50.0, this.saldo = 50.0. Senão, this.saldo = deposito.",
                variables: "Classes: Conta, ContaCorrente | Atributos: saldo (protected)",
                scenario: "Banco: Contas correntes possuem depósito mínimo de abertura obrigatório.",
                expectedPatterns: ["class Conta", "protected double saldo", "class ContaCorrente extends Conta", "super\\(", "if", "< 50", "this.saldo = 50", "else"],
                expectedExample: "class Conta {\n  protected double saldo;\n  public Conta() { this.saldo = 0; }\n}\nclass ContaCorrente extends Conta {\n  public ContaCorrente(double deposito) {\n    super();\n    if (deposito < 50.0) {\n      this.saldo = 50.0;\n    } else {\n      this.saldo = deposito;\n    }\n  }\n}",
                explanation: "Atributos 'protected' permitem que a classe filha implemente regras de preenchimento após evocar o construtor do pai.",
                hints: [
                    "A chamada 'super();' (construtor vazio) ou similar do pai deve sempre ser a primeira linha."
                ]
            },
            {
                id: 7,
                instruction: "Nível 2 (Herança): 'Veiculo' (protected velocidade). 'Carro' estende 'Veiculo'. No construtor de Carro, receba 'vel'. Após super(), use if: se vel > 120, this.velocidade = 120. Senão, this.velocidade = vel.",
                variables: "Classes: Veiculo, Carro | Atributos: velocidade (protected)",
                scenario: "Locadora: Limite mecânico de velocidade nos carros.",
                expectedPatterns: ["class Veiculo", "protected int velocidade", "class Carro extends Veiculo", "super", "if", "> 120", "this.velocidade = 120", "else"],
                expectedExample: "class Veiculo {\n  protected int velocidade;\n  public Veiculo() {}\n}\nclass Carro extends Veiculo {\n  public Carro(int vel) {\n    super();\n    if (vel > 120) {\n      this.velocidade = 120;\n    } else {\n      this.velocidade = vel;\n    }\n  }\n}",
                explanation: "Limitadores também são frequentes no fluxo de herança, sobrescrevendo a flexibilidade geral da classe Pai.",
                hints: [
                    "Declare 'protected int velocidade' na superclasse."
                ]
            },
            {
                id: 8,
                instruction: "Nível 2 (Herança): 'Empregado' (protected horas). 'Terceirizado' estende. Crie método 'calcularPagamento()' retornando double. Em 'Terceirizado', sobrescreva (@Override): se horas > 40, retorne horas * 50 + 100. Senão, horas * 50.",
                variables: "Classes: Empregado, Terceirizado | Método: calcularPagamento",
                scenario: "RH: Cálculo condicional com bônus de hora extra para os terceirizados.",
                expectedPatterns: ["class Empregado", "protected int horas", "class Terceirizado extends Empregado", "@Override", "calcularPagamento", "if", "> 40", "return horas \\* 50 \\+ 100", "else"],
                expectedExample: "class Empregado {\n  protected int horas;\n  public Empregado(int h) { this.horas = h; }\n  public double calcularPagamento() { return horas * 50.0; }\n}\nclass Terceirizado extends Empregado {\n  public Terceirizado(int h) { super(h); }\n  @Override\n  public double calcularPagamento() {\n    if (horas > 40) {\n      return (horas * 50.0) + 100.0;\n    } else {\n      return horas * 50.0;\n    }\n  }\n}",
                explanation: "Polimorfismo com condicional permite que a subclasse defina comportamentos diferentes com base no próprio estado.",
                hints: [
                    "Use @Override antes do public double calcularPagamento() na classe Terceirizado."
                ]
            },
            {
                id: 9,
                instruction: "Nível 2 (Herança): 'Pacote' (protected peso). 'PacoteExpresso' estende Pacote. Sobrescreva o método 'calcularFrete()'. Use if/else: se peso > 10.0, retorne peso * 5 + 20 (taxa extra). Senão, retorne peso * 5.",
                variables: "Classes: Pacote, PacoteExpresso | Método: calcularFrete",
                scenario: "Logística: Taxa de sobrepeso aplicada via regra condicional.",
                expectedPatterns: ["class Pacote", "protected double peso", "class PacoteExpresso extends Pacote", "@Override", "calcularFrete", "if", "> 10", "return peso \\* 5 \\+ 20", "else"],
                expectedExample: "class Pacote {\n  protected double peso;\n  public Pacote(double p) { this.peso = p; }\n  public double calcularFrete() { return peso * 3.0; }\n}\nclass PacoteExpresso extends Pacote {\n  public PacoteExpresso(double p) { super(p); }\n  @Override\n  public double calcularFrete() {\n    if (peso > 10.0) {\n      return (peso * 5.0) + 20.0;\n    } else {\n      return peso * 5.0;\n    }\n  }\n}",
                explanation: "Mais um exemplo de lógica interna utilizando variáveis herdadas via protected.",
                hints: [
                    "Verifique if (peso > 10.0)."
                ]
            },
            {
                id: 10,
                instruction: "Nível 2 (Sobrecarga): Crie a classe 'Assinatura' com 'meses' (int). Crie um construtor que recebe os meses: se < 1, grave 1. Crie outro construtor vazio 'Assinatura()' que simplesmente atribui this.meses = 12.",
                variables: "Classe: Assinatura | Construtores: Assinatura(meses), Assinatura()",
                scenario: "Streamings: Garantir uma vigência padrão ou mínima para os contratos.",
                expectedPatterns: ["class Assinatura", "private int meses", "public Assinatura\\(int", "if", "< 1", "this.meses = 1", "else", "public Assinatura\\(\\)", "this.meses = 12"],
                expectedExample: "public class Assinatura {\n  private int meses;\n  public Assinatura(int meses) {\n    if (meses < 1) {\n      this.meses = 1;\n    } else {\n      this.meses = meses;\n    }\n  }\n  public Assinatura() {\n    this.meses = 12;\n  }\n}",
                explanation: "A sobrecarga aliada ao if/else possibilita objetos flexíveis sem comprometer as regras de validação.",
                hints: [
                    "Um construtor recebe int meses e tem o IF. O outro está vazio public Assinatura() e não tem IF."
                ]
            },
            {
                id: 11,
                instruction: "Nível 3 (Scanner): No método 'main', use Scanner para ler a 'idade' (int). Instancie a classe 'Visitante' passando a idade. O construtor de 'Visitante' deve usar if: se idade < 12, this.categoria = 'Infantil', senão 'Adulto'.",
                variables: "Classes: Visitante, Main | Scanner",
                scenario: "Parques: Classificação etária automática baseada na entrada via console.",
                expectedPatterns: ["import java.util.Scanner", "class Visitante", "private String categoria", "if", "< 12", "Infantil", "Adulto", "Scanner", "nextInt", "new Visitante"],
                expectedExample: "import java.util.Scanner;\nclass Visitante {\n  private int idade;\n  private String categoria;\n  public Visitante(int idade) {\n    this.idade = idade;\n    if (idade < 12) {\n      this.categoria = \"Infantil\";\n    } else {\n      this.categoria = \"Adulto\";\n    }\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int i = sc.nextInt();\n    Visitante v = new Visitante(i);\n  }\n}",
                explanation: "A leitura dinâmica do Scanner dita a avaliação do if/else instanciado no construtor.",
                hints: [
                    "Lembre-se de importar o Scanner e usar nextInt() para capturar a idade."
                ]
            },
            {
                id: 12,
                instruction: "Nível 3 (Scanner): No main, leia 'distancia' (double). Instancie 'Viagem(distancia)'. O construtor de 'Viagem' avalia: se distancia < 100.0, this.preco = distancia * 2.0. Senão, this.preco = distancia * 1.5.",
                variables: "Classes: Viagem, Main | Scanner",
                scenario: "Aplicativos de Mobilidade: Desconto escalonado no preço pelo km rodado.",
                expectedPatterns: ["import java.util.Scanner", "class Viagem", "private double preco", "if", "< 100", "\\* 2", "\\* 1.5", "Scanner", "nextDouble", "new Viagem"],
                expectedExample: "import java.util.Scanner;\nclass Viagem {\n  private double distancia;\n  private double preco;\n  public Viagem(double d) {\n    this.distancia = d;\n    if (d < 100.0) {\n      this.preco = d * 2.0;\n    } else {\n      this.preco = d * 1.5;\n    }\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double d = sc.nextDouble();\n    Viagem v = new Viagem(d);\n  }\n}",
                explanation: "Cálculos e atribuições complexas podem ser encapsulados seguramente através das construtoras.",
                hints: [
                    "Utilize nextDouble() no Scanner."
                ]
            },
            {
                id: 13,
                instruction: "Nível 3 (Scanner+Herança): 'Imovel' (protected area). 'Apartamento' estende. No main, leia a area via Scanner. No construtor Apartamento(area), chame super() e avalie: se area < 40.0, this.area = 40.0. Senão, this.area = area.",
                variables: "Classes: Imovel, Apartamento, Main | Scanner",
                scenario: "Imobiliária: Aplicar a metragem mínima legal em novas construções.",
                expectedPatterns: ["import java.util.Scanner", "class Imovel", "protected double area", "class Apartamento extends Imovel", "super", "if", "< 40", "this.area = 40", "Scanner", "nextDouble"],
                expectedExample: "import java.util.Scanner;\nclass Imovel {\n  protected double area;\n  public Imovel() {}\n}\nclass Apartamento extends Imovel {\n  public Apartamento(double a) {\n    super();\n    if (a < 40.0) {\n      this.area = 40.0;\n    } else {\n      this.area = a;\n    }\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double area = sc.nextDouble();\n    Apartamento apt = new Apartamento(area);\n  }\n}",
                explanation: "A integração total: lemos de fora, instanciamos a filha, e esta valida o parâmetro contra sua herança (protected).",
                hints: [
                    "Instancie Apartamento passando o valor do Scanner."
                ]
            },
            {
                id: 14,
                instruction: "Nível 3 (Scanner+Herança): 'BancoMain'. Leia 'renda' (double) com Scanner. Instancie 'CartaoCredito'. O construtor avalia: se renda > 5000.0, atribua this.limite = 2000.0. Senão, this.limite = 500.0.",
                variables: "Classes: CartaoCredito, BancoMain | Scanner",
                scenario: "Financeira: Definição automática do limite de crédito através da renda informada.",
                expectedPatterns: ["import java.util.Scanner", "class CartaoCredito", "private double limite", "if", "> 5000", "this.limite = 2000", "this.limite = 500", "nextDouble", "new CartaoCredito"],
                expectedExample: "import java.util.Scanner;\nclass CartaoCredito {\n  private double renda;\n  private double limite;\n  public CartaoCredito(double r) {\n    this.renda = r;\n    if (r > 5000.0) {\n      this.limite = 2000.0;\n    } else {\n      this.limite = 500.0;\n    }\n  }\n}\npublic class BancoMain {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double renda = sc.nextDouble();\n    CartaoCredito c = new CartaoCredito(renda);\n  }\n}",
                explanation: "Decisões de negócios que determinam a faixa de crédito sem necessidade de cálculos manuais externos.",
                hints: [
                    "A leitura no Scanner vai direto para o construtor CartaoCredito(renda)."
                ]
            },
            {
                id: 15,
                instruction: "O Desafio Final: Leia 'experiencia' (int) via Scanner. Instancie 'Colaborador'. No construtor, avalie: se experiencia >= 5, this.nivel = 'Senior'. Se for menor, mas >= 2, 'Pleno'. Senão, 'Junior'.",
                variables: "Classes: Colaborador, Main | Nível (String)",
                scenario: "RH Estratégico: Avaliação complexa (if, else if, else) determinando plano de carreira inicial.",
                expectedPatterns: ["import java.util.Scanner", "class Colaborador", "private String nivel", "if", ">= 5", "Senior", "else if", ">= 2", "Pleno", "else", "Junior"],
                expectedExample: "import java.util.Scanner;\nclass Colaborador {\n  private int experiencia;\n  private String nivel;\n  public Colaborador(int exp) {\n    this.experiencia = exp;\n    if (exp >= 5) {\n      this.nivel = \"Senior\";\n    } else if (exp >= 2) {\n      this.nivel = \"Pleno\";\n    } else {\n      this.nivel = \"Junior\";\n    }\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int anos = sc.nextInt();\n    Colaborador c = new Colaborador(anos);\n  }\n}",
                explanation: "Múltiplas condições hierárquicas no construtor são perfeitas para categorizações e setups avançados do objeto.",
                hints: [
                    "Utilize a estrutura: if (...) { ... } else if (...) { ... } else { ... }"
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
            if (score.value < 10) performanceMsg = "Necessária revisão teórica sobre Classes, Construtores com Condicionais, Herança e Polimorfismo.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Homologação de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Design Patterns Orientados a Objeto com Validação Interna</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Homologação:</strong> ${data}</p>
                    <p>O presente documento reflete os testes aplicados a ${questions.value.length} cenários práticos de arquitetura e design sistêmico.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Qualidade de Código (QA)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 12 ? '#5C8069' : (score.value >= 8 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
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