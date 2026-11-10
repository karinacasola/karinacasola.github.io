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

        // --- Banco de Questões (Orientação a Objetos - 15 Exercícios) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Nível 1 (Básico): Crie a classe 'Conta' com atributos privados 'numero' (int) e 'saldo' (double). Crie um construtor que inicialize ambos os atributos.",
                variables: "Classe: Conta | Atributos: numero, saldo | Construtor: Conta(numero, saldo)",
                scenario: "Sistema Bancário: Conta Simples. Uma conta não pode existir sem um número e um saldo inicial.",
                expectedPatterns: ["class Conta", "private int numero", "private double saldo", "public Conta", "this.numero", "this.saldo"],
                expectedExample: "public class Conta {\n  private int numero;\n  private double saldo;\n  public Conta(int numero, double saldo) {\n    this.numero = numero;\n    this.saldo = saldo;\n  }\n}",
                explanation: "O construtor obriga a inicialização do objeto no exato momento em que ele nasce (uso do new), garantindo um estado válido.",
                hints: [
                    "Use 'private' nos atributos para encapsulamento.",
                    "Use 'this' dentro do construtor para diferenciar o atributo do parâmetro."
                ]
            },
            {
                id: 2,
                instruction: "Nível 1 (Básico): Crie a classe 'Usuario'. Exija 'email' (String) e 'senha' (String) obrigatoriamente no seu construtor usando a palavra 'this'.",
                variables: "Classe: Usuario | Atributos: email, senha | Construtor: Usuario(email, senha)",
                scenario: "Sistema de Login: O objeto já deve nascer 100% funcional, evitando instâncias sem credenciais.",
                expectedPatterns: ["class Usuario", "private String email", "private String senha", "public Usuario", "this.email", "this.senha"],
                expectedExample: "public class Usuario {\n  private String email;\n  private String senha;\n  public Usuario(String email, String senha) {\n    this.email = email;\n    this.senha = senha;\n  }\n}",
                explanation: "Construtores não possuem tipo de retorno (nem mesmo void) e levam o exato nome da classe.",
                hints: [
                    "A assinatura deve ser: public Usuario(String email, String senha)"
                ]
            },
            {
                id: 3,
                instruction: "Nível 1 (Básico): Crie a classe 'Produto' com atributos privados 'nome' (String) e 'preco' (double). Garanta a inserção de ambos no construtor.",
                variables: "Classe: Produto | Atributos: nome, preco",
                scenario: "Catálogo de Produtos: Segurança na criação do objeto.",
                expectedPatterns: ["class Produto", "private String nome", "private double preco", "public Produto", "this.nome", "this.preco"],
                expectedExample: "public class Produto {\n  private String nome;\n  private double preco;\n  public Produto(String nome, double preco) {\n    this.nome = nome;\n    this.preco = preco;\n  }\n}",
                explanation: "Atributos privados impedem acesso externo direto. O construtor é a única forma de injetar os dados iniciais neste cenário.",
                hints: [
                    "Não esqueça de declarar os tipos corretos: String e double."
                ]
            },
            {
                id: 4,
                instruction: "Nível 1 (Básico - Sobrecarga): Na classe 'Produto', crie DOIS construtores: um vazio (sem parâmetros) inicializando nome como 'Genérico' e preço 0.0, e outro recebendo nome e preco.",
                variables: "Classe: Produto | Construtores: Produto(), Produto(nome, preco)",
                scenario: "E-commerce: Sobrecarga de construtores (Overloading).",
                expectedPatterns: ["public Produto\\(\\)", "\"Genérico\"", "0.0", "public Produto\\(String", "double"],
                expectedExample: "public class Produto {\n  private String nome;\n  private double preco;\n  public Produto() {\n    this.nome = \"Genérico\";\n    this.preco = 0.0;\n  }\n  public Produto(String nome, double preco) {\n    this.nome = nome;\n    this.preco = preco;\n  }\n}",
                explanation: "A sobrecarga permite instanciar o objeto de várias formas diferentes, desde que a assinatura seja distinta.",
                hints: [
                    "Crie 'public Produto() { ... }' e logo abaixo 'public Produto(String nome, double preco) { ... }'"
                ]
            },
            {
                id: 5,
                instruction: "Nível 1 (Básico - Encapsulamento): Crie a classe 'Funcionario' com atributo privado 'salario'. Crie os métodos 'getSalario()' e 'setSalario(double novoSalario)' validando se novoSalario >= 1412.00.",
                variables: "Classe: Funcionario | Métodos: getSalario(), setSalario(novoSalario)",
                scenario: "RH: Uso de Getters e Setters para aplicar regras de negócio.",
                expectedPatterns: ["private double salario", "public double getSalario", "public void setSalario", "if", ">= 1412.00", "this.salario"],
                expectedExample: "public class Funcionario {\n  private double salario;\n  public double getSalario() {\n    return this.salario;\n  }\n  public void setSalario(double novoSalario) {\n    if (novoSalario >= 1412.00) {\n      this.salario = novoSalario;\n    }\n  }\n}",
                explanation: "O Setter cria uma barreira de segurança, impedindo que o salário seja alterado para um valor inválido.",
                hints: [
                    "Use a condicional 'if (novoSalario >= 1412.00)' dentro do setSalario."
                ]
            },
            {
                id: 6,
                instruction: "Nível 2 (Intermediário - Protected): Crie a classe 'Conta' com o atributo PROTECTED 'saldo' (double). Crie a classe 'ContaPoupanca' que herda de 'Conta' e cria o método 'renderJuros(double taxa)' que multiplica o saldo pela taxa.",
                variables: "Classes: Conta, ContaPoupanca | Atributo: saldo (protected)",
                scenario: "Banco: O modificador protected libera acesso direto para as filhas.",
                expectedPatterns: ["protected double saldo", "class ContaPoupanca extends Conta", "public void renderJuros", "this.saldo \\* taxa"],
                expectedExample: "class Conta {\n  protected double saldo;\n}\nclass ContaPoupanca extends Conta {\n  public void renderJuros(double taxa) {\n    this.saldo = this.saldo + (this.saldo * taxa);\n  }\n}",
                explanation: "O protected permite que a classe filha acesse o atributo do pai como se fosse dela, usando o this, sem precisar de getters/setters.",
                hints: [
                    "O modificador é 'protected double saldo;' na classe Conta."
                ]
            },
            {
                id: 7,
                instruction: "Nível 2 (Intermediário - Herança e super): Crie a classe pai 'Pessoa' com atributo protected 'nome' e construtor. Crie a classe 'Aluno' estendendo Pessoa. No construtor de Aluno, receba nome e matricula, e use 'super(nome)'.",
                variables: "Classes: Pessoa, Aluno | Comando: super()",
                scenario: "Escola: Repasse de responsabilidade de construção para a classe pai.",
                expectedPatterns: ["class Pessoa", "protected String nome", "public Pessoa", "class Aluno extends Pessoa", "public Aluno", "super\\(nome\\)", "this.matricula"],
                expectedExample: "class Pessoa {\n  protected String nome;\n  public Pessoa(String nome) {\n    this.nome = nome;\n  }\n}\nclass Aluno extends Pessoa {\n  private int matricula;\n  public Aluno(String nome, int matricula) {\n    super(nome);\n    this.matricula = matricula;\n  }\n}",
                explanation: "Quando a classe Pai possui um construtor, a classe Filha é obrigada a repassar os dados de construção usando super().",
                hints: [
                    "A chamada 'super(nome);' deve ser a primeira linha do construtor de Aluno."
                ]
            },
            {
                id: 8,
                instruction: "Nível 2 (Intermediário - Polimorfismo): Crie 'Veiculo' com protected 'marca' e método 'mostrarDados()'. Crie 'Carro' herdando de Veiculo, com atributo 'portas'. Sobrescreva (@Override) 'mostrarDados()' imprimindo marca e portas.",
                variables: "Classes: Veiculo, Carro | Anotação: @Override",
                scenario: "Montadora: Sobrescrita de métodos para comportamento específico da filha.",
                expectedPatterns: ["class Veiculo", "protected String marca", "public void mostrarDados", "class Carro extends Veiculo", "@Override", "System.out.println", "marca", "portas"],
                expectedExample: "class Veiculo {\n  protected String marca;\n  public Veiculo(String m) {\n    this.marca = m;\n  }\n  public void mostrarDados() {\n    System.out.println(\"Marca: \" + marca);\n  }\n}\nclass Carro extends Veiculo {\n  private int portas;\n  public Carro(String m, int p) {\n    super(m);\n    this.portas = p;\n  }\n  @Override\n  public void mostrarDados() {\n    System.out.println(\"Carro: \" + marca + \" Portas: \" + portas);\n  }\n}",
                explanation: "O @Override indica que a classe filha está redefinindo o comportamento padrão do método pai.",
                hints: [
                    "O @Override vai exatamente acima do método 'public void mostrarDados()' na classe Carro."
                ]
            },
            {
                id: 9,
                instruction: "Nível 2 (Intermediário - Pagamentos): Crie a superclasse 'Pagamento' (protected valor) com método 'processar()'. Crie 'PagCartao' (com juros). Sobrescreva 'processar()' para retornar valor + juros.",
                variables: "Classes: Pagamento, PagCartao | Método: processar()",
                scenario: "E-commerce: Cálculo polimórfico de taxas.",
                expectedPatterns: ["class Pagamento", "protected double valor", "public double processar", "class PagCartao extends Pagamento", "@Override", "return valor \\+ juros"],
                expectedExample: "class Pagamento {\n  protected double valor;\n  public Pagamento(double v) {\n    this.valor = v;\n  }\n  public double processar() {\n    return valor;\n  }\n}\nclass PagCartao extends Pagamento {\n  private double juros;\n  public PagCartao(double v, double j) {\n    super(v);\n    this.juros = j;\n  }\n  @Override\n  public double processar() {\n    return valor + juros;\n  }\n}",
                explanation: "A classe filha herda o atributo protegido, e customiza a regra financeira ao sobrescrever o processamento.",
                hints: [
                    "Não esqueça de chamar o super(v) no construtor de PagCartao."
                ]
            },
            {
                id: 10,
                instruction: "Nível 2 (Intermediário - Animais): Superclasse 'Animal' (protected nome) com método 'emitirSom()'. Subclasse 'Cachorro' (raca). Sobrescreva 'emitirSom()' exibindo 'Au Au!'.",
                variables: "Classes: Animal, Cachorro | Método: emitirSom()",
                scenario: "Veterinária: Herança e polimorfismo simples.",
                expectedPatterns: ["class Animal", "protected String nome", "public void emitirSom", "class Cachorro extends Animal", "@Override", "\"Au Au!\""],
                expectedExample: "class Animal {\n  protected String nome;\n  public Animal(String n) {\n    this.nome = n;\n  }\n  public void emitirSom() {\n    System.out.println(\"Som genérico\");\n  }\n}\nclass Cachorro extends Animal {\n  private String raca;\n  public Cachorro(String n, String r) {\n    super(n);\n    this.raca = r;\n  }\n  @Override\n  public void emitirSom() {\n    System.out.println(nome + \" da raça \" + raca + \": Au Au!\");\n  }\n}",
                explanation: "Cachorro herda de Animal, envia o nome via super(), e define seu próprio som.",
                hints: [
                    "Use System.out.println no método sobrescrito para exibir a mensagem."
                ]
            },
            {
                id: 11,
                instruction: "Nível 2 (Intermediário - Transporte): Crie 'Passagem' (protected destino, valor) e 'valorTotal()'. Subclasse 'PassagemVip' (taxaVip). Sobrescreva 'valorTotal()' somando a taxa ao valor.",
                variables: "Classes: Passagem, PassagemVip | Atributos: destino, valor, taxaVip",
                scenario: "Agência de Viagens: Composição de preços em polimorfismo.",
                expectedPatterns: ["class Passagem", "protected String destino", "protected double valor", "class PassagemVip extends Passagem", "@Override", "return valor \\+ taxaVip"],
                expectedExample: "class Passagem {\n  protected String destino;\n  protected double valor;\n  public Passagem(String d, double v) {\n    this.destino = d;\n    this.valor = v;\n  }\n  public double valorTotal() {\n    return valor;\n  }\n}\nclass PassagemVip extends Passagem {\n  private double taxaVip;\n  public PassagemVip(String d, double v, double t) {\n    super(d, v);\n    this.taxaVip = t;\n  }\n  @Override\n  public double valorTotal() {\n    return valor + taxaVip;\n  }\n}",
                explanation: "PassagemVip reaproveita a estrutura de Passagem, mas modifica o cálculo final do custo.",
                hints: [
                    "O construtor de PassagemVip recebe 3 parâmetros: destino, valor, taxaVip."
                ]
            },
            {
                id: 12,
                instruction: "Nível 2 (Intermediário - Serviços): Crie 'Servico' (protected desc, horas) com método 'calcularCusto()' (horas * 50). Crie 'ServicoUrgente' (taxa). Sobrescreva chamando 'super.calcularCusto() + taxa'.",
                variables: "Classes: Servico, ServicoUrgente | Comando: super.calcularCusto()",
                scenario: "Consultoria: Reaproveitamento de métodos da classe pai.",
                expectedPatterns: ["class Servico", "return horas \\* 50", "class ServicoUrgente extends Servico", "@Override", "super\\.calcularCusto\\(\\) \\+ taxa"],
                expectedExample: "class Servico {\n  protected String desc;\n  protected int horas;\n  public Servico(String d, int h) {\n    this.desc = d;\n    this.horas = h;\n  }\n  public double calcularCusto() {\n    return horas * 50.0;\n  }\n}\nclass ServicoUrgente extends Servico {\n  private double taxa;\n  public ServicoUrgente(String d, int h, double t) {\n    super(d, h);\n    this.taxa = t;\n  }\n  @Override\n  public double calcularCusto() {\n    return super.calcularCusto() + taxa;\n  }\n}",
                explanation: "Podemos usar o 'super.nomeDoMetodo()' para executar o cálculo padrão do pai e somar incrementos na filha.",
                hints: [
                    "No @Override retorne: super.calcularCusto() + taxa;"
                ]
            },
            {
                id: 13,
                instruction: "Nível 3 (Avançado - Scanner Básico): Crie a classe 'Main' com 'Scanner'. Peça ao usuário 'Digite o email:' e 'Digite a senha:'. Leia com 'nextLine()' e instancie um objeto 'Usuario'.",
                variables: "Classe: Main | Ferramenta: Scanner | Objeto: Usuario",
                scenario: "Interface CLI: Entrada de dados dinâmica instanciando objetos.",
                expectedPatterns: ["import java.util.Scanner", "public class Main", "public static void main", "Scanner \\w+ = new Scanner\\(System.in\\)", "nextLine\\(\\)", "new Usuario"],
                expectedExample: "import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    System.out.print(\"Digite o email: \");\n    String email = sc.nextLine();\n    System.out.print(\"Digite a senha: \");\n    String senha = sc.nextLine();\n    Usuario u1 = new Usuario(email, senha);\n  }\n}",
                explanation: "Para sistemas dinâmicos, capturamos os dados com Scanner e passamos diretamente para o construtor do objeto.",
                hints: [
                    "Lembre-se do 'import java.util.Scanner;' no topo do arquivo."
                ]
            },
            {
                id: 14,
                instruction: "Nível 3 (Avançado - Completo Bancário): Estruture ContaBancaria e ContaPoupanca. No 'main', utilize o 'Scanner' para ler um 'saldo' (nextDouble) e uma 'taxa' (nextDouble). Instancie ContaPoupanca e chame 'exibirResumo()'.",
                variables: "Classes: ContaBancaria, ContaPoupanca, Main | Ferramenta: Scanner",
                scenario: "Sistema Financeiro: Herança aliada a entradas dinâmicas de console.",
                expectedPatterns: ["class ContaBancaria", "class ContaPoupanca extends ContaBancaria", "Scanner", "nextDouble\\(\\)", "new ContaPoupanca", "exibirResumo\\(\\)"],
                expectedExample: "import java.util.Scanner;\nclass ContaBancaria {\n  protected double saldo;\n  public ContaBancaria(double s) { this.saldo = s; }\n  public void exibirResumo() { System.out.println(\"Saldo: \" + saldo); }\n}\nclass ContaPoupanca extends ContaBancaria {\n  private double taxa;\n  public ContaPoupanca(double s, double t) { super(s); this.taxa = t; }\n  @Override\n  public void exibirResumo() {\n    System.out.println(\"Saldo: \" + saldo + \" Taxa: \" + taxa);\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double s = sc.nextDouble();\n    double t = sc.nextDouble();\n    ContaPoupanca cp = new ContaPoupanca(s, t);\n    cp.exibirResumo();\n  }\n}",
                explanation: "O fluxo completo exige declarar as classes (pai e filha) e coordenar o funcionamento via terminal com dados dinâmicos.",
                hints: [
                    "Atenção à leitura de números: use 'sc.nextDouble()'."
                ]
            },
            {
                id: 15,
                instruction: "Nível 3 (Avançado - Completo RH): Crie Funcionario(nome, salario) e Gerente(bonus). No 'main', leia via 'Scanner' o 'nome' (nextLine), 'salario' (nextDouble) e 'bonus' (nextDouble). Instancie um Gerente e chame 'calcularSalario()'.",
                variables: "Classes: Funcionario, Gerente, Main | Ferramenta: Scanner",
                scenario: "Folha de Pagamento: Leitura mista (texto e números) para instanciar subclasse polimórfica.",
                expectedPatterns: ["class Funcionario", "class Gerente extends Funcionario", "Scanner", "nextLine\\(\\)", "nextDouble\\(\\)", "new Gerente", "calcularSalario\\(\\)"],
                expectedExample: "import java.util.Scanner;\nclass Funcionario {\n  protected String nome;\n  protected double salario;\n  public Funcionario(String n, double s) { this.nome = n; this.salario = s; }\n  public double calcularSalario() { return salario; }\n}\nclass Gerente extends Funcionario {\n  private double bonus;\n  public Gerente(String n, double s, double b) { super(n, s); this.bonus = b; }\n  @Override\n  public double calcularSalario() { return salario + bonus; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String n = sc.nextLine();\n    double s = sc.nextDouble();\n    double b = sc.nextDouble();\n    Gerente g = new Gerente(n, s, b);\n    System.out.println(g.calcularSalario());\n  }\n}",
                explanation: "Último desafio que consolida atributos protegidos, super, sobrescrita e manipulação de Scanner para dados de múltiplos tipos.",
                hints: [
                    "Cuidado ao misturar nextLine e nextDouble no console em Java. Certifique-se da assinatura das classes."
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