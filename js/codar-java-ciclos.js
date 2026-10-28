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

        // --- Banco de Questões (For com Arrays primeiro, seguidos por While e Do-While) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Construa um programa completo. Leia a quantidade de moradores usando o Scanner e crie um vetor de inteiros com esse tamanho. Use um 'for' para pedir a idade de cada pessoa e armazenar no vetor. Dentro do for, se a idade for >= 18, imprima 'Adulto', senão 'Menor de idade'.",
                variables: "Scanner sc, int qtd, int[] idades, int i",
                scenario: "IBGE: Censo familiar e tabulação demográfica.",
                expectedPatterns: ["class", "main", "Scanner", "new int", "for", "length", "if", ">= 18", "else"],
                expectedExample: "import java.util.Scanner;\npublic class IBGE {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int qtd = sc.nextInt();\n    int[] idades = new int[qtd];\n    for (int i = 0; i < idades.length; i++) {\n      idades[i] = sc.nextInt();\n      if (idades[i] >= 18) {\n        System.out.println(\"Adulto\");\n      } else {\n        System.out.println(\"Menor de idade\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "Para alocações de tamanho dinâmico, criamos o vetor utilizando a variável lida pelo Scanner, e o for varre os índices de 0 até length - 1[cite: 33, 41].",
                hints: [
                    "Crie o array como: 'int[] idades = new int[qtd];'[cite: 33].",
                    "O laço for deve utilizar 'i < idades.length'[cite: 31]."
                ]
            },
            {
                id: 2,
                instruction: "Construa um programa completo. Crie um vetor com capacidade para 3 preços do carrinho do iFood. Preencha os valores lendo via Scanner dentro de um laço 'for'. Em seguida, no mesmo for, se o valor for > 20.0, aplique um desconto de 10% (multiplique por 0.9) e o imprima, senão imprima o valor original.",
                variables: "Scanner sc, double[] carrinho, int i",
                scenario: "iFood: Motor de aplicação de cupons dinâmicos.",
                expectedPatterns: ["class", "main", "Scanner", "new double", "for", "if", "> 20", "else"],
                expectedExample: "import java.util.Scanner;\npublic class CarrinhoIFood {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double[] carrinho = new double[3];\n    for (int i = 0; i < carrinho.length; i++) {\n      carrinho[i] = sc.nextDouble();\n      if (carrinho[i] > 20.0) {\n        System.out.println(carrinho[i] * 0.9);\n      } else {\n        System.out.println(carrinho[i]);\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "O vetor armazena os decimais para a compra (carrinho) que recebem alterações matemáticas condicionais antes do faturamento final[cite: 37].",
                hints: [
                    "Não esqueça de ler o valor para a gaveta do vetor: 'carrinho[i] = sc.nextDouble();'."
                ]
            },
            {
                id: 3,
                instruction: "Construa um programa completo. Crie um vetor de String de tamanho 4 para mensagens do WhatsApp. Preencha-o via Scanner com o status 'Lida' ou 'Nao Lida' num laço 'for'. Se a mensagem for lida com o conteúdo 'Nao Lida', exiba 'Notificação pendente', senão exiba 'Tudo limpo'.",
                variables: "Scanner sc, String[] mensagens, int i",
                scenario: "WhatsApp: Contador de badges de notificações não lidas.",
                expectedPatterns: ["class", "main", "Scanner", "new String", "for", "if", "equals", "else"],
                expectedExample: "import java.util.Scanner;\npublic class WhatsAppNotificacao {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String[] mensagens = new String[4];\n    for (int i = 0; i < mensagens.length; i++) {\n      mensagens[i] = sc.next();\n      if (mensagens[i].equals(\"Nao Lida\")) {\n        System.out.println(\"Notificação pendente\");\n      } else {\n        System.out.println(\"Tudo limpo\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "A manipulação textual exige o uso do método '.equals()' para fazer a comparação lógica da regra[cite: 54, 55].",
                hints: [
                    "Cuidado: Strings não podem ser comparadas com '=='. Use '.equals(\"Nao Lida\")'[cite: 54]."
                ]
            },
            {
                id: 4,
                instruction: "Construa um programa completo. Crie um vetor de double tamanho 4 com as distâncias do Uber. Preencha com Scanner usando um 'for'. Para cada corrida, se a distância for < 2.0, o ganho é R$ 5.0 fixo. Senão, ganha R$ 2.0 por km. Imprima o ganho de cada corrida.",
                variables: "Scanner sc, double[] distancias, int i, double ganho",
                scenario: "Uber: Regra de cálculo de faturamento de motoristas parceiros.",
                expectedPatterns: ["class", "main", "Scanner", "new double", "for", "if", "< 2", "else", "\\* 2"],
                expectedExample: "import java.util.Scanner;\npublic class UberGanhos {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double[] distancias = new double[4];\n    double ganho;\n    for (int i = 0; i < distancias.length; i++) {\n      distancias[i] = sc.nextDouble();\n      if (distancias[i] < 2.0) {\n        ganho = 5.0;\n      } else {\n        ganho = distancias[i] * 2.0;\n      }\n      System.out.println(\"Ganho: \" + ganho);\n    }\n    sc.close();\n  }\n}",
                explanation: "Arrays iterados avaliam faixas mínimas de serviço para evitar tarifas negativas para a operação do motorista[cite: 39].",
                hints: [
                    "Guarde o valor do ganho calculado em uma variável temporária, e faça a verificação com if/else antes de imprimi-la."
                ]
            },
            {
                id: 5,
                instruction: "Construa um programa completo. Crie um vetor de inteiros com 4 transações do Nubank. Leia-as com Scanner em um 'for'. Use if/else: se a transação for < 0, exiba 'Saída de caixa'. Se for >= 0, exiba 'Entrada de dinheiro'.",
                variables: "Scanner sc, int[] transacoes, int i",
                scenario: "Nubank: Extrato de movimentação bancária.",
                expectedPatterns: ["class", "main", "Scanner", "new int", "for", "if", "< 0", "else"],
                expectedExample: "import java.util.Scanner;\npublic class NubankExtrato {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[] transacoes = new int[4];\n    for (int i = 0; i < transacoes.length; i++) {\n      transacoes[i] = sc.nextInt();\n      if (transacoes[i] < 0) {\n        System.out.println(\"Saida de caixa\");\n      } else {\n        System.out.println(\"Entrada de dinheiro\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "A interpretação de faturas é feita dividindo vetores em ramos condicionais a depender da polaridade do valor do índice[cite: 38].",
                hints: [
                    "O for deve percorrer a leitura 'transacoes[i] = sc.nextInt();' e em seguida verificar 'if (transacoes[i] < 0)'."
                ]
            },
            {
                id: 6,
                instruction: "Construa um programa completo. Um vetor de double tem tamanho 5 para armazenar minutos assistidos na Netflix. Leia os tempos no 'for'. Se o tempo for < 40, exiba 'Episódio abandonado'. Se for >= 40, exiba 'Episódio concluído'.",
                variables: "Scanner sc, double[] episodios, int i",
                scenario: "Netflix: Categorização de engajamento do usuário.",
                expectedPatterns: ["class", "main", "Scanner", "new double", "for", "if", "< 40", "else"],
                expectedExample: "import java.util.Scanner;\npublic class NetflixAvaliacao {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double[] episodios = new double[5];\n    for (int i = 0; i < episodios.length; i++) {\n      episodios[i] = sc.nextDouble();\n      if (episodios[i] < 40.0) {\n        System.out.println(\"Episódio abandonado\");\n      } else {\n        System.out.println(\"Episódio concluído\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "Uma métrica linear avalia cada item do vetor para acionar um sinal de analytics[cite: 39].",
                hints: [
                    "Use um array de double com 'new double[5]' e leia com '.nextDouble()'."
                ]
            },
            {
                id: 7,
                instruction: "Construa um programa completo. Crie um vetor de inteiros tamanho 3 para a meta de XP do Duolingo. Leia no 'for' o XP diário e some a uma variável 'totalXP'. Ao final (fora do for), faça um if/else: se o totalXP for >= 150, exiba 'Semana Perfeita', senão 'Continue praticando'.",
                variables: "Scanner sc, int[] xpDiario, int i, int totalXP",
                scenario: "Duolingo: Lógica de acúmulo de pontos da semana.",
                expectedPatterns: ["class", "main", "Scanner", "new int", "for", "totalXP", "\\+=", "if", ">= 150", "else"],
                expectedExample: "import java.util.Scanner;\npublic class DuolingoMetas {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[] xpDiario = new int[3];\n    int totalXP = 0;\n    for (int i = 0; i < xpDiario.length; i++) {\n      xpDiario[i] = sc.nextInt();\n      totalXP += xpDiario[i];\n    }\n    if (totalXP >= 150) {\n      System.out.println(\"Semana Perfeita\");\n    } else {\n      System.out.println(\"Continue praticando\");\n    }\n    sc.close();\n  }\n}",
                explanation: "Demonstra o padrão acumulador associado ao vetor. A soma iterada resulta no diagnóstico corporativo feito pelo 'if' que fica pós-laço[cite: 40].",
                hints: [
                    "Inicialize 'int totalXP = 0;' fora do laço.",
                    "Somente após a chave de fechamento do 'for', escreva o bloco if/else."
                ]
            },
            {
                id: 8,
                instruction: "Construa um programa completo. Em um sistema de trânsito do Waze, você tem 4 trechos (vetor de int tamanho 4). Leia o tempo de cada um via Scanner no 'for'. No laço, use um if/else para verificar: se o tempo for > 30, exiba 'Transito Intenso', senão exiba 'Via Livre'.",
                variables: "Scanner sc, int[] trechos, int i",
                scenario: "Waze: Classificação dinâmica do congestionamento de uma rodovia.",
                expectedPatterns: ["class", "main", "Scanner", "new int", "for", "if", "> 30", "else"],
                expectedExample: "import java.util.Scanner;\npublic class WazeTransito {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[] trechos = new int[4];\n    for (int i = 0; i < trechos.length; i++) {\n      trechos[i] = sc.nextInt();\n      if (trechos[i] > 30) {\n        System.out.println(\"Transito Intenso\");\n      } else {\n        System.out.println(\"Via Livre\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "Sistemas de roteamento percorrem arrays de telemetria aplicando condições de negócio em tempo real para pintar mapas[cite: 38].",
                hints: [
                    "O laço deve ser 'for (int i = 0; i < trechos.length; i++)' avaliando cada input[cite: 31]."
                ]
            },
            {
                id: 9,
                instruction: "Construa um programa completo. Peça para o usuário digitar a opção do menu (1-Café, 2-Leite). Use um 'do-while' para continuar pedindo a opção enquanto o usuário digitar opções diferentes de 1 e 2. Se for 1, imprima 'Café selecionado', senão 'Leite selecionado'.",
                variables: "Scanner sc, int opcao",
                scenario: "Máquina de Café: Validação de menu de autoatendimento.",
                expectedPatterns: ["class", "main", "Scanner", "do", "while", "if", "else", "!= 1", "!= 2"],
                expectedExample: "import java.util.Scanner;\npublic class MaquinaCafe {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int opcao;\n    do {\n      System.out.println(\"1-Cafe, 2-Leite:\");\n      opcao = sc.nextInt();\n    } while (opcao != 1 && opcao != 2);\n    if (opcao == 1) {\n      System.out.println(\"Cafe selecionado\");\n    } else {\n      System.out.println(\"Leite selecionado\");\n    }\n    sc.close();\n  }\n}",
                explanation: "O laço do-while garante que o bloco de menu seja executado ao menos uma vez, testando a condição apenas no final para segurar o fluxo[cite: 8, 9, 15].",
                hints: [
                    "Lembre-se de iniciar a classe e o método 'public static void main(String[] args)'[cite: 46].",
                    "A condição do while deve ser: (opcao != 1 && opcao != 2)[cite: 15]."
                ]
            },
            {
                id: 10,
                instruction: "Construa um programa completo. Uma bateria de celular inicia lendo o valor atual do usuário. Use um laço 'while' para diminuir a bateria de 1 em 1 por iteração, até chegar a 0. Se a bateria for <= 15 no meio do laço, imprima 'Bateria Fraca', senão 'Em uso'.",
                variables: "Scanner sc, int bateria",
                scenario: "Sistema Operacional: Monitoramento de drenagem de bateria.",
                expectedPatterns: ["class", "main", "Scanner", "while", "> 0", "--|- 1", "if", "<= 15", "else"],
                expectedExample: "import java.util.Scanner;\npublic class Celular {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int bateria = sc.nextInt();\n    while (bateria > 0) {\n      if (bateria <= 15) {\n        System.out.println(\"Bateria Fraca\");\n      } else {\n        System.out.println(\"Em uso\");\n      }\n      bateria--;\n    }\n    sc.close();\n  }\n}",
                explanation: "O laço while repete a verificação e o consumo da bateria enquanto ela possuir carga positiva[cite: 6, 14].",
                hints: [
                    "Declare o while testando se 'bateria > 0'[cite: 14].",
                    "Dentro do while, coloque o if/else e depois não esqueça de decrementar a variável (bateria--) para evitar loop infinito[cite: 6]."
                ]
            },
            {
                id: 11,
                instruction: "Construa um programa completo. Peça a senha de acesso (inteira) usando um laço 'do-while'. O programa deve repetir a solicitação enquanto a senha for diferente de 1234. Após acertar, imprima 'Acesso Permitido!'.",
                variables: "Scanner sc, int senha",
                scenario: "Segurança de Dados: Bloqueio de painel administrativo.",
                expectedPatterns: ["class", "main", "Scanner", "do", "while", "!= 1234"],
                expectedExample: "import java.util.Scanner;\npublic class SenhaAcesso {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int senha;\n    do {\n      System.out.println(\"Digite a senha:\");\n      senha = sc.nextInt();\n    } while (senha != 1234);\n    System.out.println(\"Acesso Permitido!\");\n    sc.close();\n  }\n}",
                explanation: "O fluxo é travado pelo do-while que exige a entrada correta do dado de autorização antes de liberar o sistema[cite: 12].",
                hints: [
                    "A variável 'senha' deve ser declarada antes do bloco 'do' para ser reconhecida na condição do 'while'[cite: 10]."
                ]
            },
            {
                id: 12,
                instruction: "Construa um programa completo. Declare um contador iniciando em 0. Em um laço 'while' que vai até o contador chegar a 10 (condição < 10), simule o aumento de volume de uma TV. Dentro do laço, peça para o usuário digitar 1 para subir o volume. Se digitar 1, adicione 1 ao contador. Se digitar qualquer outra coisa, avise 'Comando invalido'.",
                variables: "Scanner sc, int volume, int comando",
                scenario: "Smart TV: Ajuste linear de áudio controlado por usuário.",
                expectedPatterns: ["class", "main", "Scanner", "while", "< 10", "if", "==", "1", "else"],
                expectedExample: "import java.util.Scanner;\npublic class VolumeTV {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int volume = 0;\n    int comando;\n    while (volume < 10) {\n      comando = sc.nextInt();\n      if (comando == 1) {\n        volume++;\n        System.out.println(\"Volume: \" + volume);\n      } else {\n        System.out.println(\"Comando invalido\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "O laço while é incrementado manualmente a partir da validação de uma entrada, demonstrando controle de estado do hardware[cite: 13].",
                hints: [
                    "A condição principal é 'while (volume < 10)'. Incremente 'volume' apenas dentro do 'if (comando == 1)'."
                ]
            },
            {
                id: 13,
                instruction: "Construa um programa completo. Simule uma barra de download usando um laço 'while' iniciando em 0. Em cada iteração do laço, some o valor digitado pelo usuário ao progresso. Se o progresso ultrapassar 100, atribua 100 ao progresso e avise 'Download finalizado'. O laço termina quando chegar a 100.",
                variables: "Scanner sc, int progresso, int pacote",
                scenario: "Sistema de Arquivos: Computador processando pacotes de rede.",
                expectedPatterns: ["class", "main", "Scanner", "while", "< 100", "if", "> 100", "else"],
                expectedExample: "import java.util.Scanner;\npublic class Download {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int progresso = 0;\n    int pacote;\n    while (progresso < 100) {\n      pacote = sc.nextInt();\n      progresso += pacote;\n      if (progresso >= 100) {\n        progresso = 100;\n        System.out.println(\"Download finalizado\");\n      } else {\n        System.out.println(\"Baixando... \" + progresso + \"%\");\n      }\n    }\n    sc.close();\n  }\n}",
                explanation: "A simulação utiliza um laço acumulador (progresso += pacote) cuja parada depende da injeção gradual de banda (input), e a lógica trava o excedente a 100%[cite: 15].",
                hints: [
                    "Crie o loop como 'while (progresso < 100)'. Some a variável 'pacote' no 'progresso' antes do bloco if/else."
                ]
            },
            {
                id: 14,
                instruction: "Construa um programa completo. Leia a resposta do usuário 'Deseja excluir? (1-Sim/0-Nao)' usando 'do-while'. Se ele digitar número fora das opções, imprima 'Invalido' e repita o laço. Quando for 1 ou 0 o laço deve encerrar.",
                variables: "Scanner sc, int resposta",
                scenario: "Banco de Dados: Confirmação dupla de Soft-Delete.",
                expectedPatterns: ["class", "main", "Scanner", "do", "while", "if", "!= 1", "!= 0"],
                expectedExample: "import java.util.Scanner;\npublic class ConfirmacaoExclusao {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int resposta;\n    do {\n      System.out.println(\"Deseja excluir? (1-Sim/0-Nao)\");\n      resposta = sc.nextInt();\n      if (resposta != 1 && resposta != 0) {\n        System.out.println(\"Invalido\");\n      }\n    } while (resposta != 1 && resposta != 0);\n    sc.close();\n  }\n}",
                explanation: "Laço voltado a saneamento de input de usuário; o fluxo recusa avançar para o DELETE corporativo sem garantia explícita[cite: 13].",
                hints: [
                    "A condição para repetir (o while no fim) deve ser se a resposta for diferente de 1 E diferente de 0."
                ]
            },
            {
                id: 15,
                instruction: "Construa um programa completo. Usando a classe Scanner e um laço 'while', simule uma urna eletrônica que pede um voto (13 ou 22). Inicialize a variável voto fora do laço. Enquanto o voto digitado não for 13 nem 22, exiba 'Voto invalido' e leia o voto novamente. Quando sair do laço exiba 'Voto computado'.",
                variables: "Scanner sc, int voto",
                scenario: "Urna Eletrônica: Prevenção de travamento do ciclo eleitoral.",
                expectedPatterns: ["class", "main", "Scanner", "while", "!= 13", "&&", "!= 22", "if", "else", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\npublic class UrnaEletronica {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int voto = sc.nextInt();\n    while (voto != 13 && voto != 22) {\n      System.out.println(\"Voto invalido\");\n      voto = sc.nextInt();\n    }\n    System.out.println(\"Voto computado\");\n    sc.close();\n  }\n}",
                explanation: "O laço while repete o pedido constantemente enquanto a validação booleana dupla (&&) não atestar os estados corretos exigidos[cite: 14].",
                hints: [
                    "Leia o primeiro 'voto' antes do 'while'." ,
                    "A condição de permanência deve ser: '(voto != 13 && voto != 22)'. Não se esqueça de ler novamente dentro do laço[cite: 7]."
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
                addLog("Trilha de regras de negócios concluída. Gerando relatórios de qualidade de software...", "log-info");
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
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio. Defina a regra de negócio completa com public class.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = `<i class='bi bi-check-lg'></i> Fluxo sistêmico aprovado no ambiente de testes! <br><br><strong>Gabarito Oficial:</strong><br><pre><code>${currentQuestion.value.expectedExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
                addLog(`[Success] Lógica para o Cenário ${currentQuestion.value.id} aprovada.`, "log-success");
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
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Verifique o uso correto da Classe, Scanner, Arrays e as palavras reservadas. Tentativa ${attempts.value}/${maxAttempts}`;
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
            
            let performanceMsg = "Engenheiro(a) preparado(a) para implementação de regras sistêmicas complexas no back-end.";
            if (score.value < 10) performanceMsg = "Necessária revisão de documentação de laços (for, while, do-while), Vetores e regras com Operadores.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Homologação de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Regras de Negócio e Controle de Fluxo</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Homologação:</strong> ${data}</p>
                    <p>O presente documento reflete os testes aplicados a ${questions.value.length} cenários práticos de desenvolvimento de software diário (E-commerce, Bancário, Automação).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Qualidade de Código (QA)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 10 ? '#5C8069' : (score.value >= 6 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Sistemas Passaram no Teste Unitário</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico Técnico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento auditado e gerado pela Suíte JAVA.LOGIC.B2B
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Regras_de_Negocio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador de Ambiente Corporativo...", "log-info");
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