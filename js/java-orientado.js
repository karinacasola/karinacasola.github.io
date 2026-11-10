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

        // --- Banco de Questões (15 Questões - Slides e Fundamentos Orientados a Objetos) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Paradigmas de Programação",
                scenario: "Um desenvolvedor está migrando de C para Java e precisa entender a diferença estrutural.",
                text: "Qual é a diferença fundamental entre o paradigma Imperativo/Procedural e o Orientado a Objetos descrita no material?",
                options: [
                    "O imperativo foca em 'como fazer' com sequências de ações; o orientado a objetos foca em 'quem faz', dividindo o problema em entidades autônomas.",
                    "O orientado a objetos foca na criação de variáveis globais soltas, enquanto o imperativo utiliza herança.",
                    "Não há diferenças, ambos executam dados soltos em uma estrutura de caixas pretas.",
                    "O imperativo é exclusivo para Java e o orientado a objetos para C."
                ],
                answer: "O imperativo foca em 'como fazer' com sequências de ações; o orientado a objetos foca em 'quem faz', dividindo o problema em entidades autônomas."
            },
            {
                id: 2,
                instruction: "Classes e Objetos",
                scenario: "Durante uma aula de abstração, o professor usa a analogia de uma construção civil.",
                text: "De acordo com a analogia apresentada, o que representam a Classe e o Objeto, respectivamente?",
                options: [
                    "A Classe é a planta baixa (o molde abstrato), e o Objeto é a casa construída fisicamente (a instância gerada com 'new').",
                    "A Classe é o método main, e o Objeto é o comando de compilação.",
                    "A Classe é o teto da casa, e o Objeto é o código fonte.",
                    "Ambos representam o mesmo elemento em momentos distintos da compilação."
                ],
                answer: "A Classe é a planta baixa (o molde abstrato), e o Objeto é a casa construída fisicamente (a instância gerada com 'new')."
            },
            {
                id: 3,
                instruction: "Ponto de Entrada",
                scenario: "Para inicializar um sistema comercial, a empresa precisa definir onde a execução inicia.",
                text: "Qual é o papel principal do método 'public static void main(String[] args)' em um programa Orientado a Objetos em Java?",
                options: [
                    "Atuar como o ponto de partida (entry point) e o 'botão de ligar' onde os primeiros objetos são instanciados.",
                    "Compilar o código fonte em bytecode sem interagir com os objetos.",
                    "Ocultar os atributos privados de uma classe principal.",
                    "Gerenciar exclusivamente o encapsulamento do sistema."
                ],
                answer: "Atuar como o ponto de partida (entry point) e o 'botão de ligar' onde os primeiros objetos são instanciados."
            },
            {
                id: 4,
                instruction: "Organização de Arquivos",
                scenario: "Um programador júnior estruturou as classes do cliente e tentou compilar tudo junto.",
                text: "O que acontece se tentarmos colocar duas classes públicas (ex: public class Carro e public class Main) no mesmo arquivo em Java?",
                options: [
                    "O compilador gerará um erro informando que o tipo público deve ser definido em seu próprio arquivo.",
                    "O Java compilará o arquivo normalmente, criando dois bytecodes independentes.",
                    "A JVM ignorará a segunda classe pública e executará apenas a primeira.",
                    "O sistema unificará as duas classes em um único objeto global."
                ],
                answer: "O compilador gerará um erro informando que o tipo público deve ser definido em seu próprio arquivo."
            },
            {
                id: 5,
                instruction: "Módulos e Importações",
                scenario: "Uma equipe divide o projeto em pastas estruturadas (br.banco.dados e br.banco.telas).",
                text: "Quando é obrigatório usar a instrução 'import' para acessar uma classe em Java?",
                options: [
                    "Quando as classes estão em arquivos e em pacotes diferentes, para avisar o Java onde a classe está.",
                    "Sempre, mesmo se as classes estiverem exatamente no mesmo pacote ou arquivo.",
                    "Apenas quando o arquivo contém o método main.",
                    "O comando import foi descontinuado e não é mais necessário no Java moderno."
                ],
                answer: "Quando as classes estão em arquivos e em pacotes diferentes, para avisar o Java onde a classe está."
            },
            {
                id: 6,
                instruction: "Controle de Acesso",
                scenario: "Para blindar uma Conta, o atributo 'saldo' recebeu a palavra-chave private.",
                text: "Qual é a característica do modificador 'private' dentro do princípio da Caixa Preta no Java?",
                options: [
                    "O atributo/método só é visível dentro da própria classe, impedindo que qualquer outra classe leia ou altere diretamente.",
                    "Ele libera o acesso para qualquer parte do sistema, mas bloqueia alterações.",
                    "Torna a classe visível apenas para pacotes externos importados via JRE.",
                    "Permite a leitura direta, mas exige um Getter apenas para alteração."
                ],
                answer: "O atributo/método só é visível dentro da própria classe, impedindo que qualquer outra classe leia ou altere diretamente."
            },
            {
                id: 7,
                instruction: "Polimorfismo Prático",
                scenario: "A classe Cachorro herda de Animal, e necessita alterar o método padronizado emitirSom().",
                text: "Para que serve a anotação @Override ao utilizar a herança (extends) em Java?",
                options: [
                    "Para reescrever (sobrescrever) um comportamento da classe Pai para o contexto específico da classe Filha.",
                    "Para bloquear o método e impedir que ele seja alterado no futuro.",
                    "Para transformar uma classe filha em uma classe abstrata.",
                    "Para forçar a inicialização imediata do método no construtor."
                ],
                answer: "Para reescrever (sobrescrever) um comportamento da classe Pai para o contexto específico da classe Filha."
            },
            {
                id: 8,
                instruction: "Simbologia UML",
                scenario: "A arquiteta desenha a ligação entre 'Veículo' e 'Pessoa', e entre 'Veículo' e 'Motor'.",
                text: "Em um Diagrama de Classes UML, qual é a diferença entre um losango vazado e um losango preenchido?",
                options: [
                    "O vazado indica Agregação (tem um independente) e o preenchido indica Composição (tem um vital/dependente).",
                    "O vazado indica Herança e o preenchido indica Associação Simples.",
                    "Ambos indicam Herança, mas o preenchido exige que o atributo seja privado (-).",
                    "O vazado indica que a classe é pública (+), enquanto o preenchido que é protegida (#)."
                ],
                answer: "O vazado indica Agregação (tem um independente) e o preenchido indica Composição (tem um vital/dependente)."
            },
            {
                id: 9,
                instruction: "Ciclo de Vida do Objeto",
                scenario: "Você deve garantir que todos os usuários já nasçam obrigatoriamente com o atributo e-mail inicializado.",
                text: "Em relação aos tipos de retorno (void, int, String), qual é a regra estrita para declarar um método Construtor?",
                options: [
                    "Construtores não possuem tipo de retorno, nem mesmo a palavra 'void'. Eles apenas inicializam o objeto.",
                    "Devem sempre retornar 'void' para indicar que o processo de instanciação finalizou.",
                    "Devem retornar o tipo da própria classe para instanciar na memória.",
                    "Retornam obrigatoriamente uma String com o status do 'new'."
                ],
                answer: "Construtores não possuem tipo de retorno, nem mesmo a palavra 'void'. Eles apenas inicializam o objeto."
            },
            {
                id: 10,
                instruction: "Múltiplos Construtores",
                scenario: "A classe Produto precisa aceitar instanciações que incluam somente o 'nome' ou 'nome e preco'.",
                text: "O que caracteriza a Sobrecarga (Overloading) de construtores em uma mesma classe?",
                options: [
                    "A criação de mais de um construtor, desde que a assinatura (quantidade, ordem ou tipo dos parâmetros) seja diferente.",
                    "A reescrita de um construtor da classe Pai usando a anotação @Override.",
                    "O uso excessivo de atributos que causa sobrecarga de memória heap na JVM.",
                    "A substituição do construtor padrão pelo coletor de lixo (Garbage Collector)."
                ],
                answer: "A criação de mais de um construtor, desde que a assinatura (quantidade, ordem ou tipo dos parâmetros) seja diferente."
            },
            {
                id: 11,
                instruction: "Resolução de Conflitos de Nomes",
                scenario: "O parâmetro do seu construtor se chama 'nome', exatamente igual ao atributo privado da classe.",
                text: "Para que a palavra-chave 'this' é primariamente utilizada dentro de métodos e construtores?",
                options: [
                    "Para referenciar o próprio objeto atual e diferenciar atributos da classe de parâmetros recebidos que tenham o mesmo nome.",
                    "Para instanciar um novo objeto em substituição ao construtor padrão.",
                    "Para invocar diretamente o método main a partir de um pacote secundário.",
                    "Para transformar um atributo privado em protegido temporariamente."
                ],
                answer: "Para referenciar o próprio objeto atual e diferenciar atributos da classe de parâmetros recebidos que tenham o mesmo nome."
            },
            {
                id: 12,
                instruction: "Vantagens do Encapsulamento",
                scenario: "A empresa pede que salários não possam ser registrados no sistema com valores inferiores a 1412.00.",
                text: "Qual é uma grande vantagem do uso de métodos Setter apontada no material?",
                options: [
                    "Permitir a criação de regras de negócio (validações) antes de aceitar e modificar o valor real no atributo.",
                    "Liberar todos os atributos da classe para modificação direta via comando 'new'.",
                    "Reaproveitar códigos entre classes filhas sem a necessidade de herança.",
                    "Executar o Garbage Collector automaticamente quando um valor inválido é detectado."
                ],
                answer: "Permitir a criação de regras de negócio (validações) antes de aceitar e modificar o valor real no atributo."
            },
            {
                id: 13,
                instruction: "Visibilidade Protected",
                scenario: "A classe ContaPoupança, como filha de Conta, calcula juros compostos em cima do atributo saldo.",
                text: "Como o modificador 'protected' facilita a manipulação de dados pelas classes filhas?",
                options: [
                    "Ele permite que a classe filha acesse e altere o atributo do pai diretamente como se fosse dela, sem precisar de Getters ou Setters internamente.",
                    "Ele obriga a classe filha a reescrever (sobrescrever) todos os atributos da classe pai.",
                    "Ele bloqueia a herança completa, protegendo os métodos vitais do sistema.",
                    "Ele transforma automaticamente todas as classes filhas em interfaces públicas."
                ],
                answer: "Ele permite que a classe filha acesse e altere o atributo do pai diretamente como se fosse dela, sem precisar de Getters ou Setters internamente."
            },
            {
                id: 14,
                instruction: "Construção Hierárquica",
                scenario: "A superclasse 'Pessoa' exige a informação 'nome' já no seu construtor.",
                text: "O que acontece quando uma classe Pai possui um construtor que exige parâmetros, e uma classe Filha tenta ser instanciada?",
                options: [
                    "A classe Filha é obrigada a usar o comando 'super()' em seu próprio construtor para repassar os dados exigidos pelo Pai.",
                    "A classe Filha pode ignorar os parâmetros do Pai, criando um novo construtor vazio com 'this()'.",
                    "O construtor do Pai é anulado automaticamente pela subclasse, perdendo a herança.",
                    "A JVM gerará os valores originais do Pai automaticamente em todas as instâncias da Filha."
                ],
                answer: "A classe Filha é obrigada a usar o comando 'super()' em seu próprio construtor para repassar os dados exigidos pelo Pai."
            },
            {
                id: 15,
                instruction: "Dinâmica de Instanciação",
                scenario: "O programa exige e-mail e senha inseridos fisicamente pelo operador de caixa no terminal para acessar.",
                text: "Como unimos a captura de dados dinâmicos via 'Scanner' com a construção segura de objetos?",
                options: [
                    "Lemos os dados do usuário, armazenamos em variáveis locais e as passamos diretamente para os parâmetros do comando 'new' na instanciação.",
                    "Instanciamos o objeto vazio primeiro e, em seguida, passamos o objeto Scanner inteiro para um único setter geral.",
                    "Criamos o Scanner exclusivamente dentro do método construtor da classe a ser instanciada.",
                    "Substituímos o construtor nativo pelo método nextLine() da interface Scanner."
                ],
                answer: "Lemos os dados do usuário, armazenamos em variáveis locais e as passamos diretamente para os parâmetros do comando 'new' na instanciação."
            }
        ]);

        // =========================================================================
        // NOVO BLOCO: Algoritmo seguro de Embaralhamento (Fisher-Yates)
        // Embaralha as posições aleatoriamente garantindo dinamismo real,
        // e evitando bugs de reatividade do Vue ao usar splice
        // =========================================================================
        const shuffleArray = (array) => {
            const newArray = [...array]; 
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
            
            let performanceMsg = "Excelente compreensão dos fundamentos da Orientação a Objetos e estruturas em Java.";
            if (score.value < 10) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos de encapsulamento, herança e construtores.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Paradigmas e POO em Java</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Orientação a Objetos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo os fundamentos de Classes, Objetos, Encapsulamento, Herança, Polimorfismo e Construtores.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 12 ? '#10B981' : (score.value >= 8 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificacao_POO_Java_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador...", "log-info");
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