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

        // --- Banco de Questões (Classes Abstratas + if/else - 15 Exercícios Corporativos) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Nível 1: Crie a classe abstrata 'RegistroPonto' com 'protected double horas', construtor e método abstrato 'String verificarJornada()'. Crie a subclasse 'PontoEscritorio' usando extends, super() e @Override: se horas > 8.0 retorne 'Hora Extra', senão 'Normal'.",
                variables: "Abstrata: RegistroPonto | Subclasse: PontoEscritorio",
                scenario: "RH / Ponto Eletrônico: Identificar automaticamente horas extras na jornada dos colaboradores.",
                expectedPatterns: ["abstract class RegistroPonto", "protected double horas", "abstract String verificarJornada", "class PontoEscritorio extends RegistroPonto", "super\\(", "@Override", "if", "> 8", "else"],
                expectedExample: "public abstract class RegistroPonto {\n  protected double horas;\n  public RegistroPonto(double horas) {\n    this.horas = horas;\n  }\n  public abstract String verificarJornada();\n}\n\npublic class PontoEscritorio extends RegistroPonto {\n  public PontoEscritorio(double horas) {\n    super(horas);\n  }\n  @Override\n  public String verificarJornada() {\n    if (horas > 8.0) {\n      return \"Hora Extra\";\n    } else {\n      return \"Normal\";\n    }\n  }\n}",
                explanation: "A classe abstrata define o contrato obrigatório verificarJornada(), enquanto a subclasse aplica a regra de negócio com if/else.",
                hints: [
                    "Declare o método abstrato sem chaves: public abstract String verificarJornada();",
                    "Na subclasse, chame super(horas); no construtor e use @Override antes de verificarJornada()."
                ]
            },
            {
                id: 2,
                instruction: "Nível 1: Crie a classe abstrata 'ChamadoTI' com 'protected int prioridade', construtor, método concreto 'void exibir()' e método abstrato 'int calcularSLA()'. Em 'ChamadoRede' (extends), sobrescreva calcularSLA(): se prioridade == 1 retorne 2, senão retorne 24.",
                variables: "Abstrata: ChamadoTI | Subclasse: ChamadoRede",
                scenario: "Help Desk: Definir o prazo de atendimento (SLA em horas) conforme a urgência do ticket.",
                expectedPatterns: ["abstract class ChamadoTI", "protected int prioridade", "abstract int calcularSLA", "class ChamadoRede extends ChamadoTI", "super\\(", "@Override", "if", "== 1", "else"],
                expectedExample: "public abstract class ChamadoTI {\n  protected int prioridade;\n  public ChamadoTI(int prioridade) {\n    this.prioridade = prioridade;\n  }\n  public void exibir() {\n    System.out.println(\"Prioridade: \" + prioridade);\n  }\n  public abstract int calcularSLA();\n}\n\npublic class ChamadoRede extends ChamadoTI {\n  public ChamadoRede(int prioridade) {\n    super(prioridade);\n  }\n  @Override\n  public int calcularSLA() {\n    if (prioridade == 1) {\n      return 2;\n    } else {\n      return 24;\n    }\n  }\n}",
                explanation: "Classes abstratas podem misturar métodos concretos (reaproveitados por todos) com métodos abstratos (personalizados por cada subclasse).",
                hints: [
                    "O método concreto exibir() possui corpo com {}, já calcularSLA() termina com ponto e vírgula.",
                    "Use if (prioridade == 1) { return 2; } else { return 24; } dentro do @Override."
                ]
            },
            {
                id: 3,
                instruction: "Nível 1: Crie a classe abstrata 'Despesa' com 'protected double valor', construtor e método abstrato 'String analisar()'. Crie 'DespesaAlimentacao' (extends): se valor <= 80.0 retorne 'Aprovado', senão 'Revisar'.",
                variables: "Abstrata: Despesa | Subclasse: DespesaAlimentacao",
                scenario: "Financeiro / Reembolsos: Aprovação automática de notas fiscais de refeição dentro do teto corporativo.",
                expectedPatterns: ["abstract class Despesa", "protected double valor", "abstract String analisar", "class DespesaAlimentacao extends Despesa", "super\\(", "@Override", "if", "<= 80", "else"],
                expectedExample: "public abstract class Despesa {\n  protected double valor;\n  public Despesa(double valor) {\n    this.valor = valor;\n  }\n  public abstract String analisar();\n}\n\npublic class DespesaAlimentacao extends Despesa {\n  public DespesaAlimentacao(double valor) {\n    super(valor);\n  }\n  @Override\n  public String analisar() {\n    if (valor <= 80.0) {\n      return \"Aprovado\";\n    } else {\n      return \"Revisar\";\n    }\n  }\n}",
                explanation: "O modificador protected permite que DespesaAlimentacao acesse diretamente o atributo valor herdado de Despesa.",
                hints: [
                    "Na superclasse: protected double valor; e public abstract String analisar();",
                    "Na subclasse, implemente if (valor <= 80.0) { return \"Aprovado\"; } else { return \"Revisar\"; }"
                ]
            },
            {
                id: 4,
                instruction: "Nível 1: Crie a classe abstrata 'ReservaSala' com 'protected int pessoas', construtor e método abstrato 'boolean validar()'. Crie 'SalaReuniao' (extends): se pessoas <= 10 retorne true, senão retorne false.",
                variables: "Abstrata: ReservaSala | Subclasse: SalaReuniao",
                scenario: "Gestão de Escritório: Impedir reservas de salas acima da capacidade física permitida.",
                expectedPatterns: ["abstract class ReservaSala", "protected int pessoas", "abstract boolean validar", "class SalaReuniao extends ReservaSala", "super\\(", "@Override", "if", "<= 10", "else"],
                expectedExample: "public abstract class ReservaSala {\n  protected int pessoas;\n  public ReservaSala(int pessoas) {\n    this.pessoas = pessoas;\n  }\n  public abstract boolean validar();\n}\n\npublic class SalaReuniao extends ReservaSala {\n  public SalaReuniao(int pessoas) {\n    super(pessoas);\n  }\n  @Override\n  public boolean validar() {\n    if (pessoas <= 10) {\n      return true;\n    } else {\n      return false;\n    }\n  }\n}",
                explanation: "Métodos abstratos com retorno boolean são ideais para padronizar regras de validação em sistemas corporativos.",
                hints: [
                    "O método abstrato deve retornar boolean: public abstract boolean validar();",
                    "Use super(pessoas); no construtor de SalaReuniao."
                ]
            },
            {
                id: 5,
                instruction: "Nível 1: Crie a classe abstrata 'ItemEstoque' com 'protected int qtd', construtor e método abstrato 'String checarReposicao()'. Crie 'MaterialEscritorio' (extends): se qtd < 20 retorne 'Comprar', senão 'OK'.",
                variables: "Abstrata: ItemEstoque | Subclasse: MaterialEscritorio",
                scenario: "Almoxarifado / ERP: Emitir alerta automático de reposição de suprimentos de escritório.",
                expectedPatterns: ["abstract class ItemEstoque", "protected int qtd", "abstract String checarReposicao", "class MaterialEscritorio extends ItemEstoque", "super\\(", "@Override", "if", "< 20", "else"],
                expectedExample: "public abstract class ItemEstoque {\n  protected int qtd;\n  public ItemEstoque(int qtd) {\n    this.qtd = qtd;\n  }\n  public abstract String checarReposicao();\n}\n\npublic class MaterialEscritorio extends ItemEstoque {\n  public MaterialEscritorio(int qtd) {\n    super(qtd);\n  }\n  @Override\n  public String checarReposicao() {\n    if (qtd < 20) {\n      return \"Comprar\";\n    } else {\n      return \"OK\";\n    }\n  }\n}",
                explanation: "Mesmo sem poder fazer new ItemEstoque(), a classe abstrata organiza o atributo e o construtor para todas as categorias de estoque.",
                hints: [
                    "Use public abstract class ItemEstoque com protected int qtd;",
                    "Sobrescreva checarReposicao() verificando if (qtd < 20)."
                ]
            },
            {
                id: 6,
                instruction: "Nível 2: Crie a classe abstrata 'NotaFiscal' com 'protected double valor', construtor e método abstrato 'double calcularImposto()'. Crie 'NFServico' (extends): se valor <= 5000.0 retorne valor * 0.05, senão retorne valor * 0.08.",
                variables: "Abstrata: NotaFiscal | Subclasse: NFServico",
                scenario: "ERP Fiscal: Calcular alíquota progressiva de ISS na emissão de notas de serviço.",
                expectedPatterns: ["abstract class NotaFiscal", "protected double valor", "abstract double calcularImposto", "class NFServico extends NotaFiscal", "super\\(", "@Override", "if", "<= 5000", "0\\.05", "else", "0\\.08"],
                expectedExample: "public abstract class NotaFiscal {\n  protected double valor;\n  public NotaFiscal(double valor) {\n    this.valor = valor;\n  }\n  public abstract double calcularImposto();\n}\n\npublic class NFServico extends NotaFiscal {\n  public NFServico(double valor) {\n    super(valor);\n  }\n  @Override\n  public double calcularImposto() {\n    if (valor <= 5000.0) {\n      return valor * 0.05;\n    } else {\n      return valor * 0.08;\n    }\n  }\n}",
                explanation: "Cada tipo de nota fiscal pode herdar de NotaFiscal e aplicar sua própria faixa tributária dentro de calcularImposto().",
                hints: [
                    "Multiplique por 0.05 para 5% e por 0.08 para 8%.",
                    "Lembre-se do @Override e do super(valor) na classe NFServico."
                ]
            },
            {
                id: 7,
                instruction: "Nível 2: Crie a classe abstrata 'Lead' com 'protected double orcamento', construtor e método abstrato 'String classificar()'. Crie 'LeadB2B' (extends): se orcamento >= 10000.0 retorne 'Quente', senão 'Morno'.",
                variables: "Abstrata: Lead | Subclasse: LeadB2B",
                scenario: "CRM Comercial: Priorizar automaticamente oportunidades corporativas de alto valor.",
                expectedPatterns: ["abstract class Lead", "protected double orcamento", "abstract String classificar", "class LeadB2B extends Lead", "super\\(", "@Override", "if", ">= 10000", "else"],
                expectedExample: "public abstract class Lead {\n  protected double orcamento;\n  public Lead(double orcamento) {\n    this.orcamento = orcamento;\n  }\n  public abstract String classificar();\n}\n\npublic class LeadB2B extends Lead {\n  public LeadB2B(double orcamento) {\n    super(orcamento);\n  }\n  @Override\n  public String classificar() {\n    if (orcamento >= 10000.0) {\n      return \"Quente\";\n    } else {\n      return \"Morno\";\n    }\n  }\n}",
                explanation: "Regras de qualificação de CRM encapsuladas em subclasses concretas facilitam adicionar novos canais no futuro.",
                hints: [
                    "A classe pai deve ser abstract class Lead.",
                    "Na subclasse LeadB2B, verifique if (orcamento >= 10000.0)."
                ]
            },
            {
                id: 8,
                instruction: "Nível 2: Crie a classe abstrata 'LicencaSoftware' com 'protected int usuarios', construtor e método abstrato 'double calcularCusto()'. Crie 'LicencaAnual' (extends): se usuarios > 20 retorne usuarios * 80.0, senão usuarios * 100.0.",
                variables: "Abstrata: LicencaSoftware | Subclasse: LicencaAnual",
                scenario: "TI / Compras: Aplicar desconto por volume na renovação de licenças SaaS da empresa.",
                expectedPatterns: ["abstract class LicencaSoftware", "protected int usuarios", "abstract double calcularCusto", "class LicencaAnual extends LicencaSoftware", "super\\(", "@Override", "if", "> 20", "80", "else", "100"],
                expectedExample: "public abstract class LicencaSoftware {\n  protected int usuarios;\n  public LicencaSoftware(int usuarios) {\n    this.usuarios = usuarios;\n  }\n  public abstract double calcularCusto();\n}\n\npublic class LicencaAnual extends LicencaSoftware {\n  public LicencaAnual(int usuarios) {\n    super(usuarios);\n  }\n  @Override\n  public double calcularCusto() {\n    if (usuarios > 20) {\n      return usuarios * 80.0;\n    } else {\n      return usuarios * 100.0;\n    }\n  }\n}",
                explanation: "O contrato calcularCusto() garante que qualquer tipo de licença corporativa saiba calcular seu orçamento.",
                hints: [
                    "Declare protected int usuarios; na classe abstrata LicencaSoftware.",
                    "No @Override de calcularCusto(), use if (usuarios > 20)."
                ]
            },
            {
                id: 9,
                instruction: "Nível 2: Crie a classe abstrata 'Colaborador' com 'protected double salarioBase', construtor e método abstrato 'double calcularBonus()'. Crie 'Vendedor' (extends) com 'private boolean bateuMeta': se bateuMeta for true retorne salarioBase * 0.15, senão salarioBase * 0.05.",
                variables: "Abstrata: Colaborador | Subclasse: Vendedor",
                scenario: "RH / Folha de Pagamento: Calcular bônus variável conforme o atingimento de metas comerciais.",
                expectedPatterns: ["abstract class Colaborador", "protected double salarioBase", "abstract double calcularBonus", "class Vendedor extends Colaborador", "boolean bateuMeta", "super\\(", "@Override", "if", "0\\.15", "else", "0\\.05"],
                expectedExample: "public abstract class Colaborador {\n  protected double salarioBase;\n  public Colaborador(double salarioBase) {\n    this.salarioBase = salarioBase;\n  }\n  public abstract double calcularBonus();\n}\n\npublic class Vendedor extends Colaborador {\n  private boolean bateuMeta;\n  public Vendedor(double salarioBase, boolean bateuMeta) {\n    super(salarioBase);\n    this.bateuMeta = bateuMeta;\n  }\n  @Override\n  public double calcularBonus() {\n    if (bateuMeta) {\n      return salarioBase * 0.15;\n    } else {\n      return salarioBase * 0.05;\n    }\n  }\n}",
                explanation: "Subclasses podem adicionar atributos próprios (como bateuMeta) além dos herdados da classe abstrata.",
                hints: [
                    "No construtor de Vendedor, receba salarioBase e bateuMeta, chamando super(salarioBase) primeiro.",
                    "Dentro do @Override, teste if (bateuMeta) para retornar 15% ou 5%."
                ]
            },
            {
                id: 10,
                instruction: "Nível 2: Crie a classe abstrata 'Credencial' com 'protected int hora', construtor e método abstrato 'String verificarAcesso()'. Crie 'CrachaVisitante' (extends): se hora >= 8 && hora <= 18 retorne 'Liberado', senão 'Bloqueado'.",
                variables: "Abstrata: Credencial | Subclasse: CrachaVisitante",
                scenario: "Segurança Predial: Restringir entrada de visitantes ao horário comercial do escritório.",
                expectedPatterns: ["abstract class Credencial", "protected int hora", "abstract String verificarAcesso", "class CrachaVisitante extends Credencial", "super\\(", "@Override", "if", ">= 8", "<= 18", "else"],
                expectedExample: "public abstract class Credencial {\n  protected int hora;\n  public Credencial(int hora) {\n    this.hora = hora;\n  }\n  public abstract String verificarAcesso();\n}\n\npublic class CrachaVisitante extends Credencial {\n  public CrachaVisitante(int hora) {\n    super(hora);\n  }\n  @Override\n  public String verificarAcesso() {\n    if (hora >= 8 && hora <= 18) {\n      return \"Liberado\";\n    } else {\n      return \"Bloqueado\";\n    }\n  }\n}",
                explanation: "Combinar operadores lógicos (&&) com métodos sobrescritos de classes abstratas modela regras de controle de acesso com clareza.",
                hints: [
                    "Use o operador && para validar o intervalo: if (hora >= 8 && hora <= 18).",
                    "Não esqueça do super(hora); no construtor de CrachaVisitante."
                ]
            },
            {
                id: 11,
                instruction: "Nível 3 (Polimorfismo): Crie a classe abstrata 'Cobranca' com 'protected double valor', 'protected int diasAtraso', construtor e método abstrato 'double valorFinal()'. Em 'Boleto' (extends): se diasAtraso > 0 retorne valor + 20.0, senão valor. Na 'Main', crie uma referência 'Cobranca c = new Boleto(200.0, 3);'.",
                variables: "Abstrata: Cobranca | Subclasse: Boleto | Main",
                scenario: "Financeiro / Cobrança: Usar referência da classe abstrata para processar boletos com multa por atraso.",
                expectedPatterns: ["abstract class Cobranca", "abstract double valorFinal", "class Boleto extends Cobranca", "super\\(", "@Override", "if", "> 0", "else", "Cobranca\\s+\\w+\\s*=\\s*new Boleto"],
                expectedExample: "public abstract class Cobranca {\n  protected double valor;\n  protected int diasAtraso;\n  public Cobranca(double valor, int diasAtraso) {\n    this.valor = valor;\n    this.diasAtraso = diasAtraso;\n  }\n  public abstract double valorFinal();\n}\n\nclass Boleto extends Cobranca {\n  public Boleto(double valor, int diasAtraso) {\n    super(valor, diasAtraso);\n  }\n  @Override\n  public double valorFinal() {\n    if (diasAtraso > 0) {\n      return valor + 20.0;\n    } else {\n      return valor;\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Cobranca c = new Boleto(200.0, 3);\n    System.out.println(c.valorFinal());\n  }\n}",
                explanation: "Embora new Cobranca() seja proibido, usar Cobranca como tipo de referência (polimorfismo) é uma prática essencial em Java.",
                hints: [
                    "Na Main, declare o tipo como Cobranca e instancie com new Boleto(...).",
                    "Lembre-se de passar os dois parâmetros no super(valor, diasAtraso)."
                ]
            },
            {
                id: 12,
                instruction: "Nível 3 (Polimorfismo): Crie a classe abstrata 'Tarefa' com 'protected int estimativa', 'protected int gastas', construtor e método abstrato 'String status()'. Em 'TarefaDev' (extends): se gastas > estimativa retorne 'Atrasada', senão 'No Prazo'. Na 'Main', instancie via referência 'Tarefa t = new TarefaDev(10, 12);'.",
                variables: "Abstrata: Tarefa | Subclasse: TarefaDev | Main",
                scenario: "Gestão de Projetos / Kanban: Monitorar estouro de horas em tarefas da equipe de tecnologia.",
                expectedPatterns: ["abstract class Tarefa", "abstract String status", "class TarefaDev extends Tarefa", "super\\(", "@Override", "if", "> estimativa", "else", "Tarefa\\s+\\w+\\s*=\\s*new TarefaDev"],
                expectedExample: "public abstract class Tarefa {\n  protected int estimativa;\n  protected int gastas;\n  public Tarefa(int estimativa, int gastas) {\n    this.estimativa = estimativa;\n    this.gastas = gastas;\n  }\n  public abstract String status();\n}\n\nclass TarefaDev extends Tarefa {\n  public TarefaDev(int estimativa, int gastas) {\n    super(estimativa, gastas);\n  }\n  @Override\n  public String status() {\n    if (gastas > estimativa) {\n      return \"Atrasada\";\n    } else {\n      return \"No Prazo\";\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Tarefa t = new TarefaDev(10, 12);\n    System.out.println(t.status());\n  }\n}",
                explanation: "A referência polimórfica Tarefa permite tratar diferentes tipos de cards do Kanban de forma uniforme.",
                hints: [
                    "Na Main, use: Tarefa t = new TarefaDev(10, 12);",
                    "Compare if (gastas > estimativa) dentro do método status()."
                ]
            },
            {
                id: 13,
                instruction: "Nível 3 (Polimorfismo): Crie a classe abstrata 'PlanoCloud' com 'protected double gb', construtor e método abstrato 'double calcularFatura()'. Em 'PlanoBasico' (extends): se gb > 100.0 retorne 50.0 + (gb - 100.0) * 2.0, senão 50.0. Na 'Main', crie 'PlanoCloud p = new PlanoBasico(120.0);'.",
                variables: "Abstrata: PlanoCloud | Subclasse: PlanoBasico | Main",
                scenario: "TI / Nuvem Corporativa: Calcular cobrança de armazenamento excedente em servidores cloud.",
                expectedPatterns: ["abstract class PlanoCloud", "protected double gb", "abstract double calcularFatura", "class PlanoBasico extends PlanoCloud", "super\\(", "@Override", "if", "> 100", "else", "PlanoCloud\\s+\\w+\\s*=\\s*new PlanoBasico"],
                expectedExample: "public abstract class PlanoCloud {\n  protected double gb;\n  public PlanoCloud(double gb) {\n    this.gb = gb;\n  }\n  public abstract double calcularFatura();\n}\n\nclass PlanoBasico extends PlanoCloud {\n  public PlanoBasico(double gb) {\n    super(gb);\n  }\n  @Override\n  public double calcularFatura() {\n    if (gb > 100.0) {\n      return 50.0 + (gb - 100.0) * 2.0;\n    } else {\n      return 50.0;\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    PlanoCloud p = new PlanoBasico(120.0);\n    System.out.println(p.calcularFatura());\n  }\n}",
                explanation: "O cálculo de franquia com excedente é um clássico de sistemas SaaS corporativos e se encaixa perfeitamente em métodos sobrescritos.",
                hints: [
                    "O excedente é calculado por (gb - 100.0) * 2.0 somado à mensalidade base de 50.0.",
                    "Na Main, declare PlanoCloud p = new PlanoBasico(120.0);"
                ]
            },
            {
                id: 14,
                instruction: "Nível 3 (Polimorfismo): Crie a classe abstrata 'Documento' com 'protected int assinaturas', construtor e método abstrato 'String validar()'. Em 'Contrato' (extends): se assinaturas >= 2 retorne 'Concluido', senão 'Pendente'. Na 'Main', crie um vetor 'Documento[] docs = new Documento[1];' e guarde um 'new Contrato(2)'.",
                variables: "Abstrata: Documento | Subclasse: Contrato | Vetor Polimórfico",
                scenario: "Jurídico / Assinatura Digital: Armazenar e validar lotes de contratos em um vetor polimórfico.",
                expectedPatterns: ["abstract class Documento", "protected int assinaturas", "abstract String validar", "class Contrato extends Documento", "super\\(", "@Override", "if", ">= 2", "else", "Documento\\[\\]", "new Documento\\["],
                expectedExample: "public abstract class Documento {\n  protected int assinaturas;\n  public Documento(int assinaturas) {\n    this.assinaturas = assinaturas;\n  }\n  public abstract String validar();\n}\n\nclass Contrato extends Documento {\n  public Contrato(int assinaturas) {\n    super(assinaturas);\n  }\n  @Override\n  public String validar() {\n    if (assinaturas >= 2) {\n      return \"Concluido\";\n    } else {\n      return \"Pendente\";\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Documento[] docs = new Documento[1];\n    docs[0] = new Contrato(2);\n    System.out.println(docs[0].validar());\n  }\n}",
                explanation: "É perfeitamente válido criar um vetor do tipo da classe abstrata (new Documento[1]), pois estamos alocando referências e não instanciando Documento diretamente.",
                hints: [
                    "Crie o vetor com: Documento[] docs = new Documento[1];",
                    "Atribua a subclasse concreta na posição 0: docs[0] = new Contrato(2);"
                ]
            },
            {
                id: 15,
                instruction: "Desafio Final: Crie a classe abstrata 'EmailCorporativo' com 'protected double anexoMB', construtor, método concreto 'void registrar()' e método abstrato 'String enviar()'. Em 'EmailExterno' (extends): se anexoMB > 25.0 retorne 'Bloqueado', else if anexoMB > 10.0 retorne 'Compactar', else retorne 'Enviado'. Teste com 'EmailCorporativo e = new EmailExterno(15.0);' na Main.",
                variables: "Abstrata: EmailCorporativo | Subclasse: EmailExterno | if / else if / else",
                scenario: "Segurança de TI / Gateway de E-mail: Filtrar anexos externos com múltiplas faixas de decisão.",
                expectedPatterns: ["abstract class EmailCorporativo", "protected double anexoMB", "abstract String enviar", "class EmailExterno extends EmailCorporativo", "super\\(", "@Override", "if", "> 25", "else if", "> 10", "else", "EmailCorporativo\\s+\\w+\\s*=\\s*new EmailExterno"],
                expectedExample: "public abstract class EmailCorporativo {\n  protected double anexoMB;\n  public EmailCorporativo(double anexoMB) {\n    this.anexoMB = anexoMB;\n  }\n  public void registrar() {\n    System.out.println(\"Log registrado.\");\n  }\n  public abstract String enviar();\n}\n\nclass EmailExterno extends EmailCorporativo {\n  public EmailExterno(double anexoMB) {\n    super(anexoMB);\n  }\n  @Override\n  public String enviar() {\n    if (anexoMB > 25.0) {\n      return \"Bloqueado\";\n    } else if (anexoMB > 10.0) {\n      return \"Compactar\";\n    } else {\n      return \"Enviado\";\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    EmailCorporativo e = new EmailExterno(15.0);\n    e.registrar();\n    System.out.println(e.enviar());\n  }\n}",
                explanation: "Este desafio reúne todos os pilares do módulo: classe abstrata, método concreto, método abstrato, herança com super(), @Override, polimorfismo e condicionais encadeadas.",
                hints: [
                    "Use a estrutura if (anexoMB > 25.0) ... else if (anexoMB > 10.0) ... else ...",
                    "Na Main, chame tanto o método concreto e.registrar() quanto o polimórfico e.enviar()."
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
                addLog("Trilha de Classes Abstratas OOP concluída. Gerando relatórios...", "log-info");
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
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Revise o uso de abstract, extends, super(), @Override e if/else. Tentativa ${attempts.value}/${maxAttempts}`;
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

            let performanceMsg = "Engenheiro(a) homologado(a) na Arquitetura de Software com Classes Abstratas.";
            if (score.value < 10) performanceMsg = "Necessária revisão teórica sobre Classes Abstratas, Métodos Abstratos, Herança, @Override e Polimorfismo.";

            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Homologação de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Classes Abstratas e Regras de Negócio em Java</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Homologação:</strong> ${data}</p>
                    <p>O presente documento reflete os testes aplicados a ${questions.value.length} cenários práticos de arquitetura com Classes Abstratas.</p>
                    
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
                filename:     `Relatorio_Classes_Abstratas_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador de Ambiente Corporativo (Módulo Classes Abstratas)...", "log-info");
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