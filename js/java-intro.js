const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const showAnswer = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de Questões (30 Questões - Lógica, Java e Estruturas) ---
        const questions = ref([
            // --- Aula 1: Lógica, Níveis e Execução (Introdução) ---
            {
                id: 1,
                instruction: "Lógica vs. Sintaxe",
                scenario: "Um colega diz que se você aprender a sintaxe do Java, a lógica não importa.",
                text: "Qual é a diferença fundamental entre lógica de programação e sintaxe descrita nos fundamentos?",
                options: [
                    "A lógica é o modelo mental do que deve ser feito; a sintaxe é a regra gramatical da linguagem específica.",
                    "A lógica depende exclusivamente da máquina; a sintaxe é universal.",
                    "A sintaxe resolve o problema matemático e a lógica escreve os símbolos.",
                    "Ambas são iguais e dependem apenas do compilador utilizado."
                ],
                answer: "A lógica é o modelo mental do que deve ser feito; a sintaxe é a regra gramatical da linguagem específica."
            },
            {
                id: 2,
                instruction: "O Poder da Abstração",
                scenario: "O professor pede para criar uma classe 'ContaBancaria' em vez de manipular registradores na CPU.",
                text: "Qual é a principal vantagem da abstração na programação?",
                options: [
                    "Reduzir drasticamente a carga cognitiva, permitindo focar na regra de negócio e não no hardware.",
                    "Aumentar a velocidade de execução do código convertendo-o diretamente em pulsos elétricos.",
                    "Eliminar a necessidade de testar variáveis lógicas.",
                    "Permitir o uso exclusivo de processadores ARM."
                ],
                answer: "Reduzir drasticamente a carga cognitiva, permitindo focar na regra de negócio e não no hardware."
            },
            {
                id: 3,
                instruction: "Linguagens de Baixo Nível",
                scenario: "Uma equipe cogita escrever um sistema corporativo em Assembly para 'ficar mais rápido'.",
                text: "Por que não programamos sistemas comerciais comuns em Assembly?",
                options: [
                    "Porque exige controle absoluto do hardware, tem extrema verbosidade e zero portabilidade entre processadores diferentes.",
                    "Porque o Assembly possui gerenciamento automático de memória (Garbage Collector), deixando o sistema pesado.",
                    "Porque linguagens de baixo nível rodam apenas em servidores web.",
                    "Porque o código assembly dispensa o uso de CPU."
                ],
                answer: "Porque exige controle absoluto do hardware, tem extrema verbosidade e zero portabilidade entre processadores diferentes."
            },
            {
                id: 4,
                instruction: "Níveis de Abstração",
                scenario: "Ao analisar a tabela de perfis de linguagens, você nota características bem opostas.",
                text: "Como se diferenciam as linguagens de Alto Nível e Baixo Nível quanto ao controle do hardware?",
                options: [
                    "Alto nível esconde o hardware e tem abstração alta; baixo nível exibe o hardware e fornece controle total.",
                    "Alto nível gerencia a memória manualmente; baixo nível usa Garbage Collector.",
                    "Alto nível possui curva de aprendizado lenta e complexa comparada ao baixo nível.",
                    "Não há diferenças de portabilidade, apenas na velocidade."
                ],
                answer: "Alto nível esconde o hardware e tem abstração alta; baixo nível exibe o hardware e fornece controle total."
            },
            {
                id: 5,
                instruction: "Compilação vs Interpretação",
                scenario: "Você deve escolher uma linguagem para um projeto. O 'C' é compilado e o JavaScript é interpretado.",
                text: "Qual é a principal diferença técnica entre linguagens compiladas e interpretadas?",
                options: [
                    "A compilada gera um arquivo executável (.exe) antes de rodar; a interpretada lê e executa linha a linha em tempo real.",
                    "A compilada sempre é mais lenta que a interpretada.",
                    "A interpretada obriga o uso de uma máquina virtual embutida no Windows.",
                    "Linguagens compiladas não conseguem rodar lógicas matemáticas."
                ],
                answer: "A compilada gera um arquivo executável (.exe) antes de rodar; a interpretada lê e executa linha a linha em tempo real."
            },
            {
                id: 6,
                instruction: "A Filosofia do Java",
                scenario: "Sua empresa adotou Java porque o sistema precisa rodar em vários sistemas operacionais diferentes.",
                text: "Qual é a promessa revolucionária do Java que resolve o problema de falta de portabilidade?",
                options: [
                    "A promessa WORA (Write Once, Run Anywhere - Escreva uma vez, rode em qualquer lugar).",
                    "Compilação estrita diretamente para o processador Intel x86.",
                    "A eliminação do uso de variáveis na sintaxe.",
                    "A execução nativa do código escrito em C++ paralelamente."
                ],
                answer: "A promessa WORA (Write Once, Run Anywhere - Escreva uma vez, rode em qualquer lugar)."
            },
            {
                id: 7,
                instruction: "O Paradigma Híbrido",
                scenario: "Após executar o compilador (javac) em um código Fonte (.java), um novo formato é gerado.",
                text: "O que é este novo formato e qual componente o lê e traduz?",
                options: [
                    "É o Bytecode (.class), lido e traduzido pela JVM, que simula um computador.",
                    "É um binário nativo (.exe), executado diretamente pelo Sistema Operacional.",
                    "É um código Assembly, interpretado apenas pelo JIT.",
                    "É um arquivo de banco de dados estrutural do JRE."
                ],
                answer: "É o Bytecode (.class), lido e traduzido pela JVM, que simula um computador."
            },
            {
                id: 8,
                instruction: "Desempenho da JVM",
                scenario: "O aplicativo em Java acelera o processamento de funções repetitivas em tempo real.",
                text: "Qual componente dinâmico da JVM promove esse ganho explosivo de performance?",
                options: [
                    "O Compilador JIT (Just-In-Time), que identifica 'Hot Spots' no bytecode e os compila para o código nativo.",
                    "O Garbage Collector, que processa variáveis antigas em segundo plano.",
                    "O Class Loader, ao pré-carregar as imagens da interface gráfica.",
                    "A JRE, que reescreve as regras ortográficas do texto humano."
                ],
                answer: "O Compilador JIT (Just-In-Time), que identifica 'Hot Spots' no bytecode e os compila para o código nativo."
            },
            {
                id: 9,
                instruction: "Memória em Java",
                scenario: "Em linguagens de baixo nível, você gerencia a alocação de RAM (malloc, free). No Java, isso não ocorre.",
                text: "Como a memória (Heap) é gerenciada automaticamente evitando o vazamento em Java?",
                options: [
                    "Pela ação do Garbage Collector (GC), um patrulheiro automático que destrói objetos sem uso liberando espaço.",
                    "Pelo Compilador javac, que define o tamanho da memória antes da execução.",
                    "Pelo Verificador de Bytecode, impedindo a execução de loops.",
                    "A memória nunca é esvaziada em Java, necessitando reiniciar a máquina."
                ],
                answer: "Pela ação do Garbage Collector (GC), um patrulheiro automático que destrói objetos sem uso liberando espaço."
            },
            {
                id: 10,
                instruction: "Ecossistema (JRE vs JDK)",
                scenario: "Um novo analista diz: 'Não consigo compilar códigos Java, só rodar o software de folha de pagamento.'",
                text: "Qual componente está instalado na máquina dele, e qual está faltando para permitir o desenvolvimento?",
                options: [
                    "Ele tem apenas a JRE (ambiente de usuário); falta o JDK, que inclui ferramentas de desenvolvimento como o javac.",
                    "Ele possui o JDK completo, mas precisa desinstalar a JVM.",
                    "Falta a ele apenas o Javadoc, necessário para compilar executáveis.",
                    "O compilador JRE falhou em executar as instruções estáticas."
                ],
                answer: "Ele tem apenas a JRE (ambiente de usuário); falta o JDK, que inclui ferramentas de desenvolvimento como o javac."
            },
            
            // --- Aula 2: Estruturas de Decisão ---
            {
                id: 11,
                instruction: "Base das Estruturas de Decisão",
                scenario: "O programa deve decidir se um usuário pode acessar o painel de administrador.",
                text: "Como as estruturas de decisão validam as regras para escolher qual bloco de código executar?",
                options: [
                    "Com base em uma condição booleana, que avalia uma expressão como verdadeira (true) ou falsa (false).",
                    "Lendo textos escritos em inglês enviados pelo Scanner.",
                    "Executando simultaneamente todos os blocos disponíveis.",
                    "Checando fisicamente os pulsos elétricos do processador."
                ],
                answer: "Com base em uma condição booleana, que avalia uma expressão como verdadeira (true) ou falsa (false)."
            },
            {
                id: 12,
                instruction: "Condicional Simples",
                scenario: "Um código tem a estrutura: if (idade >= 18) { tirarCNH(); }. O usuário informou a idade de 15.",
                text: "O que o programa fará ao avaliar essa condição (false) em um if simples?",
                options: [
                    "O programa simplesmente ignora o bloco e continua a execução normalmente na próxima linha fora do if.",
                    "O programa exibirá um erro fatal no terminal e finalizará a execução do pacote.",
                    "O programa reavalia a variável aguardando que ela se torne 18.",
                    "O código volta para o início (linha 1) automaticamente."
                ],
                answer: "O programa simplesmente ignora o bloco e continua a execução normalmente na próxima linha fora do if."
            },
            {
                id: 13,
                instruction: "Condicional Composta (if-else)",
                scenario: "O bloco else cria uma bifurcação, permitindo tratar caminhos distintos.",
                text: "O que acontece na estrutura composta if e else se a condição principal for verdadeira?",
                options: [
                    "O bloco if é executado e o bloco else é totalmente ignorado; nunca os dois são executados.",
                    "O compilador rodará o bloco if primeiro e depois o bloco else sequencialmente.",
                    "O JIT gera uma exceção por encontrar dois blocos distintos no fluxo.",
                    "O else aguarda a sua vez em uma thread secundária."
                ],
                answer: "O bloco if é executado e o bloco else é totalmente ignorado; nunca os dois são executados."
            },
            {
                id: 14,
                instruction: "Aplicação do else",
                scenario: "Você testa a nota (if nota >= 6). A nota inserida é exatamente 6.0.",
                text: "Com base no exemplo de condicional composta estudada, qual ramo o Java seguirá?",
                options: [
                    "O bloco if, pois a igualdade matemática na instrução >= (maior ou igual) valida a condição como verdadeira.",
                    "O bloco else, pois o número 6 é o limite exato.",
                    "Nenhum, retornando um status neutro sem compilar.",
                    "Isso gerará um erro sintático."
                ],
                answer: "O bloco if, pois a igualdade matemática na instrução >= (maior ou igual) valida a condição como verdadeira."
            },
            {
                id: 15,
                instruction: "Encadeamento de Decisões",
                scenario: "Você precisa classificar a nota do aluno em três status: APROVADO, RECUPERAÇÃO ou REPROVADO.",
                text: "Qual estrutura permite criar esse encadeamento testando múltiplas possibilidades sequenciais?",
                options: [
                    "A estrutura condicional encadeada else if.",
                    "Múltiplos blocos else isolados.",
                    "Um simples if seguido do encerramento forçado da classe.",
                    "Não é possível fazer três bifurcações usando apenas ifs nativos."
                ],
                answer: "A estrutura condicional encadeada else if."
            },
            {
                id: 16,
                instruction: "Ordem do else if",
                scenario: "No bloco encadeado existem três condições (else if) válidas em sequência (ex: >5, >7, >9).",
                text: "Como o Java processa as condições de uma cadeia de else if?",
                options: [
                    "Ele testa em ordem, de cima para baixo. Assim que achar uma verdadeira, executa o bloco correspondente e ignora todo o restante da estrutura.",
                    "Ele verifica todas até achar a melhor correspondência lógica.",
                    "Ele inverte a ordem de execução do fundo para o topo da estrutura.",
                    "O fluxo se ramifica gerando blocos independentes e concorrentes."
                ],
                answer: "Ele testa em ordem, de cima para baixo. Assim que achar uma verdadeira, executa o bloco correspondente e ignora todo o restante da estrutura."
            },
            {
                id: 17,
                instruction: "O else Final",
                scenario: "A estrutura encadeada possui múltiplos else if e encerra com a instrução else { println(\"REPROVADO\"); }.",
                text: "Neste contexto encadeado, como atua este bloco 'else' posicionado ao final?",
                options: [
                    "Atua como um padrão (fallback), sendo acionado apenas se absolutamente nenhuma das condições acima for verdadeira.",
                    "Ele anula todas as condições acima e substitui os resultados positivos.",
                    "Age checando se variáveis foram descartadas da memória RAM pelo Garbage Collector.",
                    "É uma sintaxe incorreta que resultará em erro no compilador javac."
                ],
                answer: "Atua como um padrão (fallback), sendo acionado apenas se absolutamente nenhuma das condições acima for verdadeira."
            },
            {
                id: 18,
                instruction: "Boas Práticas: Blocos {}",
                scenario: "O programador removeu as chaves '{}' de um if porque a instrução tinha apenas uma única linha.",
                text: "Embora seja possível, qual é a regra de ouro recomendada para a estrutura if e else?",
                options: [
                    "Sempre utilize chaves! É mais seguro, evita bugs em manutenções futuras e torna o código mais legível.",
                    "Evite chaves ao máximo para garantir velocidade na execução do código JIT.",
                    "Substitua as chaves por parênteses para garantir o uso estrito do bloco.",
                    "Chaves devem ser usadas apenas em variáveis, não em controles de fluxo."
                ],
                answer: "Sempre utilize chaves! É mais seguro, evita bugs em manutenções futuras e torna o código mais legível."
            },

            // --- Aula 3: Fundamentos e Operações Práticas ---
            {
                id: 19,
                instruction: "Estrutura do Arquivo",
                scenario: "Ao iniciar a escrita de um código em Java, precisamos definir onde o interpretador começará a leitura.",
                text: "Como organizamos nosso código dentro do arquivo segundo a estrutura primária do Java?",
                options: [
                    "Envelopando o código dentro da declaração da Classe Principal e criando o método main como ponto de entrada.",
                    "Escrevendo todas as variáveis e fluxos puramente soltos na página inicial do pacote.",
                    "Criando uma pasta .java e inicializando o index.html principal.",
                    "Rodando o bytecode diretamente sem criar classes ou métodos."
                ],
                answer: "Envelopando o código dentro da declaração da Classe Principal e criando o método main como ponto de entrada."
            },
            {
                id: 20,
                instruction: "Imutabilidade (Constantes)",
                scenario: "A taxa de juros fixa (12%) não deve ser alterada durante toda a execução da rotina financeira do programa.",
                text: "Qual palavra reservada do Java garante a imutabilidade do valor atribuído?",
                options: [
                    "Usamos a palavra 'final' (ex: final double TAXA = 12.0;).",
                    "Usamos a palavra 'var' (ex: var TAXA = 12;).",
                    "Bloqueamos com a palavra 'constante'.",
                    "Mudamos o tipo da variável para int."
                ],
                answer: "Usamos a palavra 'final' (ex: final double TAXA = 12.0;)."
            },
            {
                id: 21,
                instruction: "char vs String",
                scenario: "Você deve guardar a resposta 'S' (Sim) ou 'N' (Não) de um formulário de forma isolada.",
                text: "Como diferenciar sintaticamente um tipo char primitivo de uma Classe String textual?",
                options: [
                    "O char armazena apenas um caractere com aspas simples ('S'); a String armazena textos com aspas duplas (\"Sim\").",
                    "O char permite concatenação natural, enquanto a String é primitiva e imutável.",
                    "Ambos usam aspas simples, mas a String exige o pacote utilitário de texto.",
                    "Não há diferenças sintáticas reais para o compilador na geração do Bytecode."
                ],
                answer: "O char armazena apenas um caractere com aspas simples ('S'); a String armazena textos com aspas duplas (\"Sim\")."
            },
            {
                id: 22,
                instruction: "Poder da Classe String",
                scenario: "Você verificará se a senha possui 8 caracteres usando métodos internos no texto inserido.",
                text: "Por que a String em Java possui operações utilitárias internas, ao contrário de uma variável int comum?",
                options: [
                    "Porque a String não é um tipo primitivo, é uma Classe, logo possui métodos embutidos como o '.length()'.",
                    "Porque String é lida diretamente pelo terminal de comandos no Linux.",
                    "Porque aspas duplas habilitam a execução de macros automáticas via javac.",
                    "Isso é falso, variáveis inteiras também possuem método nativo .length()."
                ],
                answer: "Porque a String não é um tipo primitivo, é uma Classe, logo possui métodos embutidos como o '.length()'."
            },
            {
                id: 23,
                instruction: "Pacotes Inclusos (java.lang)",
                scenario: "Você cria classes String e usa o Math sem precisar escrever importações no topo do documento.",
                text: "Por que a importação do namespace dessas classes básicas é desnecessária?",
                options: [
                    "Porque elas pertencem ao pacote java.lang, que é importado automaticamente em todos os programas Java.",
                    "Porque a JVM injeta esses comandos via processador local do usuário final.",
                    "Porque 'String' não é pertencente ao ecossistema e atua apenas como flag booleana.",
                    "Devido a uma regra da JRE de ignorar hierarquia de pastas ao salvar."
                ],
                answer: "Porque elas pertencem ao pacote java.lang, que é importado automaticamente em todos os programas Java."
            },
            {
                id: 24,
                instruction: "Importações Explícitas",
                scenario: "Um código precisa gerar valores randômicos e ler digitação através das classes Random e Scanner.",
                text: "Diferente de String, o que você deve incluir no código fonte para que essas classes funcionem?",
                options: [
                    "Sua importação explícita na área superior do arquivo (ex: import java.util.Scanner;).",
                    "Declará-las diretamente como atributos globais public static na Classe Principal.",
                    "Reinstalar o JDK utilizando pacotes focados em redes (java.net).",
                    "Baixar a API externa correspondente (arquivos .jar ou dependências web)."
                ],
                answer: "Sua importação explícita na área superior do arquivo (ex: import java.util.Scanner;)."
            },
            {
                id: 25,
                instruction: "Comparação de Textos",
                scenario: "Uma condição 'if (nome == \"Admin\")' falha em reconhecer um administrador válido inserido.",
                text: "Na regra de comparação do Java, por que o operador '==' falha ao comparar conteúdo de textos (String)?",
                options: [
                    "O '==' compara o endereço da referência de memória. Para conteúdo textual exato, usa-se string1.equals(string2).",
                    "O '==' funciona apenas com números reais, para booleanos e textos deve-se usar os delimitadores duplos.",
                    "Strings são imutáveis e negam qualquer leitura ou comparação lógica imposta pelo sistema.",
                    "Porque o programa não ignorou diferenças entre minúsculas ou caracteres corrompidos da entrada."
                ],
                answer: "O '==' compara o endereço da referência de memória. Para conteúdo textual exato, usa-se string1.equals(string2)."
            },
            {
                id: 26,
                instruction: "Conectivos e Lógica E",
                scenario: "A regra de negócio diz: 'Permitir entrada APENAS SE idade >= 18 e altura >= 1.50'.",
                text: "Qual operador lógico do Java conecta e garante que ambas as condições sejam simultaneamente verdadeiras?",
                options: [
                    "O operador E, representado pelo símbolo &&.",
                    "O operador OU, representado pelo símbolo ||.",
                    "O operador lógico unário NÃO (!).",
                    "O símbolo comercial usado em ponteiros (&)."
                ],
                answer: "O operador E, representado pelo símbolo &&."
            },
            {
                id: 27,
                instruction: "Cálculo de Ímpar/Par",
                scenario: "O exercício prático solicitava verificar a paridade de um número inteiro fornecido pelo Scanner.",
                text: "Qual operador matemático possibilita identificar se há resto na divisão de um número?",
                options: [
                    "O operador de módulo ou resto (%).",
                    "O operador de divisão flutuante (//).",
                    "O símbolo de exponenciação (^).",
                    "A classe utilitária java.lang.Math.remainder."
                ],
                answer: "O operador de módulo ou resto (%)."
            },
            {
                id: 28,
                instruction: "Saídas Formatadas (printf)",
                scenario: "Você precisa mostrar o resultado: 'O produto A custa R$ 10,50.' formatando variáveis no terminal.",
                text: "Qual função de saída da classe System permite injetar variáveis diretamente usando %s e %.2f?",
                options: [
                    "A instrução formatada System.out.printf().",
                    "A instrução base System.out.println().",
                    "A instrução crua System.out.print().",
                    "A formatação pela JRE via String.formatHTML."
                ],
                answer: "A instrução formatada System.out.printf()."
            },
            {
                id: 29,
                instruction: "A Armadilha do Scanner",
                scenario: "O programa leu um número inteiro usando 'sc.nextInt()'. Logo em seguida, ele precisa ler uma frase do usuário.",
                text: "Qual precaução ou tratamento prático é obrigatório para que a próxima entrada de texto (nextLine) não falhe?",
                options: [
                    "A execução de um 'nextLine()' vazio no código para consumir o botão Enter deixado no buffer do terminal.",
                    "O reset do buffer limpando o cache geral do Garbage Collector da JRE.",
                    "Inverter a ordem, impedindo estruturalmente a leitura de números antes de textos em Java.",
                    "Apagar o arquivo compilado .class antes de iniciar a nova requisição."
                ],
                answer: "A execução de um 'nextLine()' vazio no código para consumir o botão Enter deixado no buffer do terminal."
            },
            {
                id: 30,
                instruction: "Boas Práticas de Gestão",
                scenario: "Seu sistema acabou de capturar todas as idades, nomes e descontos necessários via Console e não precisa mais ler dados.",
                text: "Qual é a conduta final correta (boa prática) em relação ao objeto Scanner instanciado?",
                options: [
                    "Chamar o método close() da instância do Scanner para liberar e fechar o recurso na memória (ex: sc.close();).",
                    "Alterar a referência da classe local usando null.",
                    "Usar um comando recursivo de encerramento do processo em tempo real (System.exit(0)).",
                    "Escrever um javadoc avisando o usuário final sobre o lixo do terminal."
                ],
                answer: "Chamar o método close() da instância do Scanner para liberar e fechar o recurso na memória (ex: sc.close();)."
            }
        ]);

        // =========================================================================
        // NOVO BLOCO: Algoritmo seguro de Embaralhamento (Fisher-Yates)
        // Embaralha as posições aleatoriamente garantindo dinamismo real,
        // e evitando bugs de reatividade do Vue ao usar splice
        // =========================================================================
        const shuffleArray = (array) => {
            const newArray = [...array]; // Clona o array para evitar problemas de reatividade
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        // Aplica o embaralhamento para todas as questões ao iniciar
        questions.value.forEach(question => {
            question.options = shuffleArray(question.options);
        });
        // =========================================================================

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
            await typeWriter(`Carregando Desafio Analítico ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(currentQuestion.value.scenario, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 0; 
            showAnswer.value = false; 
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
                addLog("Avaliação concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Lógica validada com sucesso.";
                addLog("Sucesso: Análise precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Análise incorreta.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos fundamentos da Linguagem Java, Estruturas de Decisão e Lógica de Programação.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos de compilação, tipos primitivos e estruturas de decisão.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Lógica e Programação Java</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Fundamentos e Resolução Algorítmica</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo os fundamentos de alto e baixo nível, paradigma híbrido do Java (JVM, JRE, JDK), tipos primitivos, estruturas condicionais baseadas em decisões lógicas, e boas práticas de entradas de dados em console.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador INNOV_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificacao_Lógica_Java_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador analítico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador INNOV_EVAL_v2.0...", "log-info");
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
            showAnswer,
            gameOver,
            userSelection,
            terminalBody,
            selectOption,
            saveResultPDF,
            resetGame
        };
    } 
}).mount('#app');