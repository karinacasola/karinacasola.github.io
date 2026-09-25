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

        // --- Banco de Questões (30 Questões - Orientação a Objetos e UML) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Conceitual: Orientação a Objetos.",
                scenario: "A Orientação a Objetos (OO) é um paradigma de programação focado em aproximar a modelagem de software de elementos do mundo real.[cite: 1]",
                text: "Quais são os dois conceitos fundamentais nos quais esse paradigma se baseia?[cite: 1]",
                options: [
                    "Variáveis e Laços de Repetição.",
                    "Entidades e Cardinalidades.",
                    "Classes e Objetos.[cite: 1]",
                    "Tabelas e Procedimentos."
                ],
                answer: "Classes e Objetos.[cite: 1]" 
            },
            {
                id: 2,
                instruction: "Prática: Loja Virtual.",
                scenario: "Em um e-commerce, um cliente pode realizar vários pedidos.[cite: 2]",
                text: "Como ficaria a modelagem da multiplicidade entre Cliente e Pedido considerando a regra acima?[cite: 2]",
                options: [
                    "Cliente (1) --- (1) Pedido",
                    "Cliente (1) --- (0..*) Pedido[cite: 1, 2]",
                    "Cliente (*) --- (*) Pedido",
                    "Cliente (0..1) --- (1..*) Pedido"
                ],
                answer: "Cliente (1) --- (0..*) Pedido[cite: 1, 2]"
            },
            {
                id: 3,
                instruction: "Alternativa Correta: Visibilidade.",
                scenario: "O Diagrama de Classes utiliza uma simbologia específica para definir o acesso aos atributos e métodos.[cite: 1]",
                text: "Qual símbolo representa a visibilidade Privada (Private), onde o acesso é permitido apenas pela própria classe?[cite: 1]",
                options: [
                    "(+)[cite: 1]",
                    "(#)[cite: 1]",
                    "(-)[cite: 1]",
                    "(*)[cite: 1]"
                ],
                answer: "(-)[cite: 1]"
            },
            {
                id: 4,
                instruction: "Conceitual: Abstração.",
                scenario: "Na abstração, a Classe é comparada à 'planta baixa' de uma casa, enquanto o Objeto é a 'casa construída'.[cite: 1]",
                text: "O que essa analogia indica sobre a relação entre classes e objetos?[cite: 1]",
                options: [
                    "Você pode instanciar (construir) vários objetos independentes usando a mesma classe (planta).[cite: 1]",
                    "Uma classe deve ser descartada após a criação do primeiro objeto.[cite: 1]",
                    "Objetos diferentes compartilham a mesma instância física de memória.[cite: 1]",
                    "A planta baixa contém os dados reais, e a casa é apenas um modelo teórico.[cite: 1]"
                ],
                answer: "Você pode instanciar (construir) vários objetos independentes usando a mesma classe (planta).[cite: 1]"
            },
            {
                id: 5,
                instruction: "Prática: Jogo de RPG.",
                scenario: "O jogo possui a figura do Personagem base. O personagem pode ser especializado em Mago ou Guerreiro.[cite: 2]",
                text: "Qual tipo de relacionamento UML existe entre Mago/Guerreiro e a classe base Personagem?[cite: 2]",
                options: [
                    "Composição.[cite: 1]",
                    "Agregação.[cite: 1]",
                    "Associação.[cite: 1]",
                    "Herança (É um).[cite: 1, 2]"
                ],
                answer: "Herança (É um).[cite: 1, 2]"
            },
            {
                id: 6,
                instruction: "Alternativa Correta: História da UML.",
                scenario: "A UML foi criada para resolver a 'Guerra dos Métodos' na engenharia de software.[cite: 3]",
                text: "Quem são os 'Três Amigos' responsáveis por unir os métodos mais populares e criar a UML em 1994?[cite: 3]",
                options: [
                    "Alan Turing, Ada Lovelace e Charles Babbage.",
                    "Grady Booch, James Rumbaugh e Ivar Jacobson.[cite: 3]",
                    "Steve Jobs, Bill Gates e Linus Torvalds.",
                    "Scott Ambler, Martin Fowler e Robert C. Martin."
                ],
                answer: "Grady Booch, James Rumbaugh e Ivar Jacobson.[cite: 3]"
            },
            {
                id: 7,
                instruction: "Conceitual: Polimorfismo.",
                scenario: "No paradigma orientado a objetos, as classes filhas herdam métodos da classe pai.[cite: 1]",
                text: "Qual é a principal função do Polimorfismo nesse contexto?[cite: 1]",
                options: [
                    "Impedir que a classe filha altere o código da classe pai.[cite: 1]",
                    "Transformar atributos públicos em privados automaticamente.[cite: 1]",
                    "Permitir reescrever (sobrescrever) o comportamento de um método herdado.[cite: 1]",
                    "Obrigar a classe filha a deletar os métodos do pai.[cite: 1]"
                ],
                answer: "Permitir reescrever (sobrescrever) o comportamento de um método herdado.[cite: 1]"
            },
            {
                id: 8,
                instruction: "Prática: Clínica Médica.",
                scenario: "Cada consulta gera exatamente um prontuário. Se a consulta for apagada, o prontuário deixa de existir.[cite: 2]",
                text: "Como o relacionamento entre Consulta e Prontuário deve ser modelado?[cite: 2]",
                options: [
                    "Composição (Losango preenchido), pois a parte depende do todo.[cite: 1, 2]",
                    "Agregação (Losango vazado), pois a parte é independente.[cite: 1, 2]",
                    "Herança (Seta vazada), pois o prontuário é uma consulta.[cite: 1, 2]",
                    "Multiplicidade 0..*, pois o prontuário é opcional.[cite: 1, 2]"
                ],
                answer: "Composição (Losango preenchido), pois a parte depende do todo.[cite: 1, 2]"
            },
            {
                id: 9,
                instruction: "Alternativa Correta: DER vs Diagrama de Classes.",
                scenario: "Diagramas diferentes analisam o sistema sob lentes diferentes.[cite: 3]",
                text: "Qual é a principal diferença estrutural entre um DER e um Diagrama de Classes?[cite: 3]",
                options: [
                    "O DER foca na lógica em memória, a Classe foca na interface.[cite: 3]",
                    "Ambos são exatamente iguais, mudando apenas a linguagem de programação.[cite: 3]",
                    "O DER foca apenas em Dados/Estado, enquanto o Diagrama de Classes mapeia Estado + Comportamento (métodos).[cite: 3]",
                    "O Diagrama de Classes mapeia o banco de dados SQL, o DER mapeia o Front-End.[cite: 3]"
                ],
                answer: "O DER foca apenas em Dados/Estado, enquanto o Diagrama de Classes mapeia Estado + Comportamento (métodos).[cite: 3]"
            },
            {
                id: 10,
                instruction: "Conceitual: Encapsulamento.",
                scenario: "Em linguagens como Java, os atributos são comumente definidos como privados.[cite: 1]",
                text: "Qual é a forma padrão e segura de expor e modificar esses atributos restritos?[cite: 1]",
                options: [
                    "Utilizando funções matemáticas nativas do sistema.[cite: 1]",
                    "Transformando todos os atributos em globais.[cite: 1]",
                    "Deixando o banco de dados alterar diretamente a memória.[cite: 1]",
                    "Utilizando métodos Getters (acessar) e Setters (modificar).[cite: 1]"
                ],
                answer: "Utilizando métodos Getters (acessar) e Setters (modificar).[cite: 1]"
            },
            {
                id: 11,
                instruction: "Prática: Casa Inteligente.",
                scenario: "Uma Central de Controle gerencia Cômodos, que por sua vez agrupam diversos dispositivos que podem existir independentemente do cômodo.[cite: 2]",
                text: "Qual é o relacionamento ideal entre Cômodo e Dispositivo Eletrônico?[cite: 2]",
                options: [
                    "Herança (É um).[cite: 1]",
                    "Composição (Tem um - Forte).[cite: 1]",
                    "Agregação (Tem um - A parte existe sem o todo).[cite: 1, 2]",
                    "Visibilidade Privada.[cite: 1]"
                ],
                answer: "Agregação (Tem um - A parte existe sem o todo).[cite: 1, 2]"
            },
            {
                id: 12,
                instruction: "Alternativa Correta: Definição de UML.",
                scenario: "A UML tornou-se um padrão global na área de TI.[cite: 3]",
                text: "O que significa a sigla UML?[cite: 3]",
                options: [
                    "Universal Method of Logic.[cite: 3]",
                    "Unified Modeling Language (Linguagem de Modelagem Unificada).[cite: 3]",
                    "Unified Memory Layout.[cite: 3]",
                    "User Management Level.[cite: 3]"
                ],
                answer: "Unified Modeling Language (Linguagem de Modelagem Unificada).[cite: 3]"
            },
            {
                id: 13,
                instruction: "Conceitual: O Diagrama de Classes.",
                scenario: "O Diagrama de Classes é considerado o 'coração' da UML estrutural.[cite: 1]",
                text: "O que exatamente esse diagrama apresenta em sua notação visual?[cite: 1]",
                options: [
                    "A tela exata que o usuário final vai interagir no sistema.[cite: 1]",
                    "Apenas os dados que serão gravados no disco rígido.[cite: 1]",
                    "O nome das entidades, seus Atributos e seus Métodos.[cite: 1]",
                    "A infraestrutura de servidores e redes físicas.[cite: 1]"
                ],
                answer: "O nome das entidades, seus Atributos e seus Métodos.[cite: 1]"
            },
            {
                id: 14,
                instruction: "Prática: Locadora de Veículos.",
                scenario: "A locadora aluga Veículos. Um veículo pode ser Carro de Passeio, Moto ou Caminhão, e possui placa e ano.[cite: 2]",
                text: "O que Carro de Passeio, Moto e Caminhão representam em relação à classe Veículo?[cite: 2]",
                options: [
                    "Atributos da classe Veículo.[cite: 1, 2]",
                    "Subclasses que utilizam Herança da classe pai Veículo.[cite: 1, 2]",
                    "Métodos polimórficos de Veículo.[cite: 1, 2]",
                    "Classes agregadas a um Contrato.[cite: 1, 2]"
                ],
                answer: "Subclasses que utilizam Herança da classe pai Veículo.[cite: 1, 2]"
            },
            {
                id: 15,
                instruction: "Alternativa Correta: Simbologia de Relacionamento.",
                scenario: "As linhas entre classes na UML indicam como elas interagem.[cite: 1]",
                text: "Qual símbolo visual representa a Herança no Diagrama de Classes?[cite: 1]",
                options: [
                    "Uma linha simples contínua.[cite: 1]",
                    "Um losango preenchido.[cite: 1]",
                    "Uma seta vazada apontando para a classe Pai.[cite: 1]",
                    "Um círculo com um sinal de mais.[cite: 1]"
                ],
                answer: "Uma seta vazada apontando para a classe Pai.[cite: 1]"
            },
            {
                id: 16,
                instruction: "Conceitual: Tipagem em Java.",
                scenario: "Java possui características diferentes de linguagens de script como Python.[cite: 1]",
                text: "O que significa dizer que o Java exige 'Tipagem Forte' ou 'Estática'?[cite: 1]",
                options: [
                    "Que o código não pode ser alterado após ser salvo.[cite: 1]",
                    "Que variáveis e retornos precisam ter seus tipos (ex: int, double, void) declarados explicitamente.[cite: 1]",
                    "Que o encapsulamento é opcional e baseado em convenção.[cite: 1]",
                    "Que as classes filhas são fortemente amarradas ao banco de dados.[cite: 1]"
                ],
                answer: "Que variáveis e retornos precisam ter seus tipos (ex: int, double, void) declarados explicitamente.[cite: 1]"
            },
            {
                id: 17,
                instruction: "Prática: Rede de Hotéis.",
                scenario: "Uma reserva de hotel refere-se a um ou mais quartos para um período determinado.[cite: 2]",
                text: "Como se lê a multiplicidade '1..*' no relacionamento entre Reserva e Quarto?[cite: 2]",
                options: [
                    "Zero ou muitos quartos.[cite: 1, 2]",
                    "Exatamente um quarto obrigatório.[cite: 1, 2]",
                    "Um ou muitos quartos (pelo menos um).[cite: 1, 2]",
                    "No máximo um quarto.[cite: 1, 2]"
                ],
                answer: "Um ou muitos quartos (pelo menos um).[cite: 1, 2]"
            },
            {
                id: 18,
                instruction: "Alternativa Correta: Visibilidade Protegida.",
                scenario: "Classes filhas podem precisar acessar atributos específicos da classe pai.[cite: 1]",
                text: "Qual modificador de acesso é representado pelo símbolo (#) na UML?[cite: 1]",
                options: [
                    "Public (Público).[cite: 1]",
                    "Private (Privado).[cite: 1]",
                    "Package (Pacote).[cite: 1]",
                    "Protected (Protegido).[cite: 1]"
                ],
                answer: "Protected (Protegido).[cite: 1]"
            },
            {
                id: 19,
                instruction: "Conceitual: UML e Métodos Ágeis.",
                scenario: "O Manifesto Ágil prioriza 'Software em funcionamento mais que documentação abrangente'.[cite: 3]",
                text: "Isso significa que a UML deve ser abandonada em projetos ágeis (como o Scrum)?[cite: 3]",
                options: [
                    "Sim, a UML é estritamente incompatível com o desenvolvimento iterativo.[cite: 3]",
                    "Sim, fluxogramas substituíram a UML.[cite: 3]",
                    "Não, a UML atua como uma ferramenta de comunicação visual e prevenção de débitos técnicos.[cite: 3]",
                    "Não, mas apenas o DER deve ser desenhado para agilizar entregas.[cite: 3]"
                ],
                answer: "Não, a UML atua como uma ferramenta de comunicação visual e prevenção de débitos técnicos.[cite: 3]"
            },
            {
                id: 20,
                instruction: "Prática: Player de Música Digital.",
                scenario: "Um Álbum possui várias Faixas. Se os direitos expirarem e o Álbum for excluído, as faixas são sumariamente removidas.[cite: 2]",
                text: "Essa dependência existencial caracteriza qual relacionamento UML entre Álbum e Faixa?[cite: 2]",
                options: [
                    "Herança.[cite: 1, 2]",
                    "Composição.[cite: 1, 2]",
                    "Agregação.[cite: 1, 2]",
                    "Polimorfismo.[cite: 1, 2]"
                ],
                answer: "Composição.[cite: 1, 2]"
            },
            {
                id: 21,
                instruction: "Alternativa Correta: Agregação.",
                scenario: "A Agregação indica um relacionamento onde 'a parte pode existir sem o todo'.[cite: 1]",
                text: "Como a Agregação é desenhada no Diagrama de Classes?[cite: 1]",
                options: [
                    "Linha simples.[cite: 1]",
                    "Losango preenchido na extremidade da classe Todo.[cite: 1]",
                    "Seta vazada apontando para a classe Parte.[cite: 1]",
                    "Losango vazado na extremidade da classe Todo.[cite: 1]"
                ],
                answer: "Losango vazado na extremidade da classe Todo.[cite: 1]"
            },
            {
                id: 22,
                instruction: "Conceitual: Justificativa para a OO.",
                scenario: "Existem vários motivos para equipes adotarem a Orientação a Objetos.[cite: 1]",
                text: "Como o Encapsulamento ajuda na Manutenção Facilitada de um sistema?[cite: 1]",
                options: [
                    "Ele reescreve automaticamente erros de sintaxe em produção.[cite: 1]",
                    "Ele garante que a alteração interna de um módulo (objeto) não quebre o sistema inteiro.[cite: 1]",
                    "Ele elimina a necessidade de compilação do código Java.[cite: 1]",
                    "Ele permite que múltiplos desenvolvedores editem a mesma linha de código simultaneamente.[cite: 1]"
                ],
                answer: "Ele garante que a alteração interna de um módulo (objeto) não quebre o sistema inteiro.[cite: 1]"
            },
            {
                id: 23,
                instruction: "Prática: Sistema Bancário.",
                scenario: "Uma Conta Bancária deve ser classificada como Conta Corrente ou Conta Poupança.[cite: 2]",
                text: "Quais entidades atuam como Subclasses (herdando propriedades) da Conta Base?[cite: 2]",
                options: [
                    "Cliente e Gerente.[cite: 2]",
                    "Número e Agência.[cite: 2]",
                    "Conta Corrente e Conta Poupança.[cite: 2]",
                    "Depósito e Saque.[cite: 2]"
                ],
                answer: "Conta Corrente e Conta Poupança.[cite: 2]"
            },
            {
                id: 24,
                instruction: "Alternativa Correta: Multiplicidade Opcional.",
                scenario: "A multiplicidade define as restrições numéricas das relações.[cite: 1]",
                text: "O que a anotação '0..1' significa na UML?[cite: 1]",
                options: [
                    "Um ou muitos.[cite: 1]",
                    "Exatamente um.[cite: 1]",
                    "Infinidade negativa.[cite: 1]",
                    "Zero ou um (Opcional).[cite: 1]"
                ],
                answer: "Zero ou um (Opcional).[cite: 1]"
            },
            {
                id: 25,
                instruction: "Conceitual: Diagramas UML Diversos.",
                scenario: "Além do Diagrama de Classes, a UML possui diagramas para outras visões do sistema.[cite: 1]",
                text: "Qual diagrama é usado para mostrar a linha do tempo e a ordem do trânsito de dados entre os objetos?[cite: 1]",
                options: [
                    "Diagrama de Casos de Uso.[cite: 1]",
                    "Diagrama de Sequência.[cite: 1]",
                    "Diagrama de Atividades.[cite: 1]",
                    "Diagrama de Banco de Dados.[cite: 1]"
                ],
                answer: "Diagrama de Sequência.[cite: 1]"
            },
            {
                id: 26,
                instruction: "Prática: App de Delivery.",
                scenario: "O sistema aloca exatamente um entregador parceiro para transportar um pedido finalizado.[cite: 2]",
                text: "Como fica a multiplicidade no sentido Pedido -> Entregador?[cite: 2]",
                options: [
                    "1[cite: 1, 2]",
                    "0..*[cite: 1, 2]",
                    "1..*[cite: 1, 2]",
                    "0..1[cite: 1, 2]"
                ],
                answer: "1[cite: 1, 2]"
            },
            {
                id: 27,
                instruction: "Alternativa Correta: Composição.",
                scenario: "A Composição mapeia partes estritamente dependentes.[cite: 1]",
                text: "Qual é o símbolo visual representativo da Composição?[cite: 1]",
                options: [
                    "Linha simples.[cite: 1]",
                    "Losango vazado.[cite: 1]",
                    "Losango preenchido.[cite: 1]",
                    "Seta pontilhada.[cite: 1]"
                ],
                answer: "Losango preenchido.[cite: 1]"
            },
            {
                id: 28,
                instruction: "Conceitual: UML vs Programação.",
                scenario: "A UML serve como 'esperanto' (idioma universal) de software.[cite: 3]",
                text: "A UML é considerada uma linguagem de programação para executar rotinas?[cite: 3]",
                options: [
                    "Sim, ela compila diretamente para a memória do servidor.[cite: 3]",
                    "Não, ela é estritamente focada na persistência de dados.[cite: 3]",
                    "Não, ela é uma linguagem visual de modelagem para documentar e planejar.[cite: 3]",
                    "Sim, mas apenas na linguagem Java.[cite: 3]"
                ],
                answer: "Não, ela é uma linguagem visual de modelagem para documentar e planejar.[cite: 3]"
            },
            {
                id: 29,
                instruction: "Prática: Associação Simples.",
                scenario: "Na abstração de um sistema de trânsito, um 'Motorista dirige Carro'. Essa classe 'conhece' a outra.[cite: 1]",
                text: "Qual é o relacionamento visual adequado para essa interação direta?[cite: 1]",
                options: [
                    "Composição.[cite: 1]",
                    "Agregação.[cite: 1]",
                    "Herança.[cite: 1]",
                    "Associação (Linha Simples).[cite: 1]"
                ],
                answer: "Associação (Linha Simples).[cite: 1]"
            },
            {
                id: 30,
                instruction: "Alternativa Correta: Visibilidade Pública.",
                scenario: "Os atributos ou métodos podem ser acessíveis por qualquer outra classe do sistema.[cite: 1]",
                text: "Qual símbolo da UML indica Visibilidade Pública (Public)?[cite: 1]",
                options: [
                    "(#)[cite: 1]",
                    "(+)[cite: 1]",
                    "(-)[cite: 1]",
                    "(=)[cite: 1]"
                ],
                answer: "(+)[cite: 1]"
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
            await typeWriter(`Carregando Desafio de Orientação a Objetos e UML ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Sucesso: Estruturação sistêmica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Abstração interrompida.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
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
            
            let performanceMsg = "Excelente compreensão dos conceitos de Orientação a Objetos e Modelagem UML.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos Diagramas de Classes, multiplicidades e relacionamentos.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Orientação a Objetos e UML</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Modelagem de Sistemas</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo abstração OO, Encapsulamento, Relacionamentos (Composição, Agregação, Herança) e diagramação.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador UML_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Modelagem_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador lógico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador UML_EVAL_v2.0...", "log-info");
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