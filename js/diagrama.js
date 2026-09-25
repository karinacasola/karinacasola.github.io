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
                instruction: "Conceitual: Fundamentos da OO.",
                scenario: "A Orientação a Objetos (OO) é um paradigma de programação cujo objetivo é aproximar a modelagem de software do mundo real.",
                text: "Quais são os dois conceitos fundamentais nos quais esse paradigma se baseia?",
                options: [
                    "Variáveis e Laços de Repetição.",
                    "Entidades e Cardinalidades.",
                    "Classes e Objetos.",
                    "Tabelas e Procedimentos."
                ],
                answer: "Classes e Objetos." 
            },
            {
                id: 2,
                instruction: "Prática: Loja Virtual (E-commerce).",
                scenario: "Em um e-commerce, um cliente pode realizar vários pedidos, mas um pedido pertence a um único cliente.",
                text: "Como ficaria a modelagem da multiplicidade entre a classe Cliente e a classe Pedido?",
                options: [
                    "Cliente (1) --- (1) Pedido",
                    "Cliente (1) --- (0..*) Pedido",
                    "Cliente (*) --- (*) Pedido",
                    "Cliente (0..1) --- (1..*) Pedido"
                ],
                answer: "Cliente (1) --- (0..*) Pedido"
            },
            {
                id: 3,
                instruction: "Alternativa Correta: Visibilidade UML.",
                scenario: "O Diagrama de Classes utiliza uma simbologia específica antes do nome dos atributos e métodos para definir o acesso.",
                text: "Qual símbolo representa a visibilidade Privada (Private), onde o acesso é restrito à própria classe?",
                options: [
                    "(+)",
                    "(#)",
                    "(-)",
                    "(*)"
                ],
                answer: "(-)"
            },
            {
                id: 4,
                instruction: "Conceitual: Entendendo a Abstração.",
                scenario: "Na analogia da abstração estrutural, a Classe é comparada à 'planta baixa' de uma casa, enquanto o Objeto é a 'casa construída'.",
                text: "O que essa analogia indica sobre a relação entre classes e objetos na memória?",
                options: [
                    "A partir de uma única planta (classe), pode-se construir (instanciar) várias casas (objetos) independentes.",
                    "A classe deve ser descartada após a criação do primeiro objeto no sistema.",
                    "Todos os objetos instanciados compartilham os mesmos dados de estado físico.",
                    "A planta baixa armazena os dados, enquanto a casa define as regras lógicas."
                ],
                answer: "A partir de uma única planta (classe), pode-se construir (instanciar) várias casas (objetos) independentes."
            },
            {
                id: 5,
                instruction: "Prática: Jogo de RPG.",
                scenario: "No RPG, existe um 'Personagem' base com nível e vida. Ele pode ser especializado em 'Mago' (com poder mágico) ou 'Guerreiro' (com armadura).",
                text: "Qual é o relacionamento UML que liga Mago e Guerreiro à classe Personagem?",
                options: [
                    "Composição.",
                    "Agregação.",
                    "Associação.",
                    "Herança (É um)."
                ],
                answer: "Herança (É um)."
            },
            {
                id: 6,
                instruction: "Alternativa Correta: História da UML.",
                scenario: "Nos anos 90, existiam mais de 50 métodos de modelagem diferentes, gerando um caos na comunicação entre engenheiros.",
                text: "Quem foram 'Os Três Amigos' que se uniram em 1994 para criar a UML?",
                options: [
                    "Alan Turing, Ada Lovelace e Charles Babbage.",
                    "Grady Booch, James Rumbaugh e Ivar Jacobson.",
                    "Steve Jobs, Bill Gates e Linus Torvalds.",
                    "Scott Ambler, Martin Fowler e Robert C. Martin."
                ],
                answer: "Grady Booch, James Rumbaugh e Ivar Jacobson."
            },
            {
                id: 7,
                instruction: "Conceitual: Polimorfismo.",
                scenario: "A herança permite que uma classe filha reaproveite o código da classe pai. Já o polimorfismo atua sobre o comportamento herdado.",
                text: "Qual é a principal função do Polimorfismo em um método como 'acelerar()'?",
                options: [
                    "Bloquear o acesso da classe filha ao método do pai.",
                    "Transformar atributos públicos em privados.",
                    "Permitir que a classe filha reescreva ou adapte o comportamento do método herdado.",
                    "Exigir que a classe filha crie um novo método com nome diferente."
                ],
                answer: "Permitir que a classe filha reescreva ou adapte o comportamento do método herdado."
            },
            {
                id: 8,
                instruction: "Prática: Clínica Médica.",
                scenario: "Cada consulta gera exatamente um prontuário. Se a consulta for cancelada e apagada, o prontuário associado deve ser destruído também.",
                text: "Como o relacionamento entre Consulta e Prontuário deve ser modelado no diagrama?",
                options: [
                    "Composição (Losango preenchido), indicando dependência existencial forte.",
                    "Agregação (Losango vazado), pois o prontuário é independente.",
                    "Herança (Seta vazada), pois o prontuário é um tipo de consulta.",
                    "Associação Simples com multiplicidade 0..*."
                ],
                answer: "Composição (Losango preenchido), indicando dependência existencial forte."
            },
            {
                id: 9,
                instruction: "Alternativa Correta: DER vs Classes.",
                scenario: "Embora o Diagrama de Entidade-Relacionamento (DER) e o Diagrama de Classes organizem sistemas, eles usam lentes diferentes.",
                text: "Qual é a principal diferença estrutural entre um DER e um Diagrama de Classes UML?",
                options: [
                    "O DER mapeia a lógica de negócios e o Diagrama de Classes mapeia o banco SQL.",
                    "Ambos são idênticos, mudando apenas a linguagem de programação final.",
                    "O DER foca apenas em dados (estado), enquanto o Diagrama de Classes mapeia estado e comportamento (métodos).",
                    "O Diagrama de Classes não possui atributos, apenas funções e métodos."
                ],
                answer: "O DER foca apenas em dados (estado), enquanto o Diagrama de Classes mapeia estado e comportamento (métodos)."
            },
            {
                id: 10,
                instruction: "Conceitual: Encapsulamento.",
                scenario: "Em linguagens como Java, é uma prática padrão definir atributos da classe como privados para proteger a integridade dos dados.",
                text: "Qual é a forma correta e segura de permitir que outras classes acessem e modifiquem esses atributos privados?",
                options: [
                    "Declarando as variáveis como globais.",
                    "Ignorando o encapsulamento e mudando tudo para public.",
                    "Por meio de métodos públicos conhecidos como Getters e Setters.",
                    "Conectando o atributo diretamente à interface do usuário."
                ],
                answer: "Por meio de métodos públicos conhecidos como Getters e Setters."
            },
            {
                id: 11,
                instruction: "Prática: Gestão Universitária.",
                scenario: "A Universidade é dividida em Departamentos. Cada Departamento 'agrupa' diversos Professores, mas os professores podem continuar existindo no sistema mesmo se o departamento fechar.",
                text: "Qual é o relacionamento ideal entre Departamento e Professor?",
                options: [
                    "Herança (É um).",
                    "Composição (Tem um - Forte).",
                    "Agregação (Tem um - A parte existe sem o todo).",
                    "Dependência Estrutural Privada."
                ],
                answer: "Agregação (Tem um - A parte existe sem o todo)."
            },
            {
                id: 12,
                instruction: "Alternativa Correta: Definição da UML.",
                scenario: "A padronização visual foi essencial para grandes equipes de desenvolvimento corporativo.",
                text: "O que significa exatamente a sigla UML?",
                options: [
                    "Universal Method of Logic.",
                    "Unified Modeling Language (Linguagem de Modelagem Unificada).",
                    "Unified Memory Layout.",
                    "User Management Level."
                ],
                answer: "Unified Modeling Language (Linguagem de Modelagem Unificada)."
            },
            {
                id: 13,
                instruction: "Conceitual: Anatomia da Classe UML.",
                scenario: "O Diagrama de Classes é o 'coração' da modelagem estrutural orientada a objetos.",
                text: "Quais são as 3 partes que compõem o retângulo representativo de uma Classe na UML padrão?",
                options: [
                    "ID, Tabela e Cardinalidade.",
                    "Nome da Classe, Atributos e Métodos.",
                    "Nome do Objeto, Tipagem e Instância.",
                    "Interface, Banco de Dados e Front-end."
                ],
                answer: "Nome da Classe, Atributos e Métodos."
            },
            {
                id: 14,
                instruction: "Prática: Sistema Bancário.",
                scenario: "Uma 'Conta Bancária' base possui número e saldo. Ela deve ser obrigatoriamente classificada como 'Conta Corrente' ou 'Conta Poupança'.",
                text: "Nesse cenário, qual o papel de Conta Corrente e Conta Poupança em relação à Conta Bancária?",
                options: [
                    "São atributos booleanos da classe Conta Bancária.",
                    "São instâncias de objetos diretos no banco de dados.",
                    "São subclasses que herdam propriedades da superclasse Conta Bancária.",
                    "São métodos polimórficos aplicados sobre o cliente."
                ],
                answer: "São subclasses que herdam propriedades da superclasse Conta Bancária."
            },
            {
                id: 15,
                instruction: "Alternativa Correta: Simbologia de Relacionamentos.",
                scenario: "As linhas desenhadas entre as caixas de um diagrama indicam como os objetos interagirão.",
                text: "Qual símbolo visual, colocado na extremidade da linha, representa a Herança na UML?",
                options: [
                    "Uma linha simples contínua.",
                    "Um losango preenchido.",
                    "Uma seta vazada (triângulo branco) apontando para a classe pai.",
                    "Um losango vazado."
                ],
                answer: "Uma seta vazada (triângulo branco) apontando para a classe pai."
            },
            {
                id: 16,
                instruction: "Conceitual: Tipagem de Variáveis.",
                scenario: "Diferente do Python, a linguagem Java impõe um controle rígido sobre os dados no momento da compilação.",
                text: "O que significa afirmar que Java exige 'Tipagem Forte/Estática' na Orientação a Objetos?",
                options: [
                    "Que a arquitetura de banco de dados deve ser definida antes da classe.",
                    "Que as variáveis e retornos de métodos precisam ter seus tipos (ex: int, String, double) declarados explicitamente.",
                    "Que a herança múltipla é obrigatória em todos os módulos.",
                    "Que não é permitido o uso de variáveis numéricas em objetos."
                ],
                answer: "Que as variáveis e retornos de métodos precisam ter seus tipos (ex: int, String, double) declarados explicitamente."
            },
            {
                id: 17,
                instruction: "Prática: Biblioteca.",
                scenario: "Um Livro é escrito por um ou mais autores. O sistema não aceita o cadastro de um livro sem que haja pelo menos um autor definido.",
                text: "Como se lê e se anota a multiplicidade no sentido Livro -> Autor?",
                options: [
                    "0..* (Zero ou muitos).",
                    "1 (Exatamente um).",
                    "1..* (Um ou muitos / Pelo menos um).",
                    "0..1 (Zero ou um / Opcional)."
                ],
                answer: "1..* (Um ou muitos / Pelo menos um)."
            },
            {
                id: 18,
                instruction: "Alternativa Correta: Visibilidade Protegida.",
                scenario: "Em alguns casos, um atributo não deve ser público, mas as classes filhas precisam acessá-lo diretamente.",
                text: "Qual modificador de acesso é representado pelo símbolo cerquilha (#) na UML?",
                options: [
                    "Public (Público).",
                    "Private (Privado).",
                    "Package (Pacote).",
                    "Protected (Protegido)."
                ],
                answer: "Protected (Protegido)."
            },
            {
                id: 19,
                instruction: "Conceitual: UML e Métodos Ágeis.",
                scenario: "O Manifesto Ágil valoriza mais 'software em funcionamento do que documentação abrangente'.",
                text: "No contexto do desenvolvimento ágil (Scrum), o que acontece com o Diagrama de Classes?",
                options: [
                    "Ele é abandonado porque o ágil proíbe desenhar diagramas.",
                    "Ele é gerado automaticamente pelo banco de dados após a Sprint.",
                    "Ele atua como um mapa estratégico leve e visual para alinhar a equipe antes da codificação.",
                    "Ele se torna um contrato engessado de 500 páginas."
                ],
                answer: "Ele atua como um mapa estratégico leve e visual para alinhar a equipe antes da codificação."
            },
            {
                id: 20,
                instruction: "Prática: Rede Social.",
                scenario: "Um usuário cria uma Postagem e ela recebe vários Comentários. A regra exige que: se a Postagem for excluída, todos os seus Comentários devem ser destruídos.",
                text: "Essa dependência de ciclo de vida caracteriza qual tipo de relacionamento entre Postagem e Comentário?",
                options: [
                    "Herança.",
                    "Composição (Relação Tem um Forte).",
                    "Agregação (Relação Tem um Fraco).",
                    "Polimorfismo."
                ],
                answer: "Composição (Relação Tem um Forte)."
            },
            {
                id: 21,
                instruction: "Alternativa Correta: Símbolo de Agregação.",
                scenario: "A Agregação denota que um objeto contém outros objetos, mas a existência deles é independente (a parte sobrevive sem o todo).",
                text: "Como a Agregação é desenhada no Diagrama de Classes?",
                options: [
                    "Linha simples não direcional.",
                    "Losango preenchido na extremidade da classe Todo.",
                    "Losango vazado na extremidade da classe Todo.",
                    "Seta pontilhada indicando dependência."
                ],
                answer: "Losango vazado na extremidade da classe Todo."
            },
            {
                id: 22,
                instruction: "Conceitual: Justificativa da OO.",
                scenario: "Entre os vários benefícios do planejamento via Orientação a Objetos, destaca-se a facilidade na manutenção do software.",
                text: "Como o princípio do Encapsulamento colabora para a manutenção do sistema em grandes equipes?",
                options: [
                    "Ocultando a complexidade interna do objeto, garantindo que alterações no seu motor não quebrem o restante do sistema que apenas o utiliza.",
                    "Forçando o banco de dados a realizar backups automáticos a cada 5 minutos.",
                    "Permitindo que qualquer classe modifique livremente os atributos das outras sem restrição.",
                    "Compilando todo o código num único arquivo global procedural."
                ],
                answer: "Ocultando a complexidade interna do objeto, garantindo que alterações no seu motor não quebrem o restante do sistema que apenas o utiliza."
            },
            {
                id: 23,
                instruction: "Prática: Zoológico.",
                scenario: "O zoológico gerencia Animais. Eles se dividem hierarquicamente em Mamíferos (que possuem tempo de gestação) e Aves (que possuem envergadura das asas).",
                text: "Considerando os atributos específicos (gestação vs envergadura), qual o conceito OO empregado aqui?",
                options: [
                    "Mamíferos e Aves herdam de Animal, mas cada subclasse define seus atributos especializados.",
                    "Mamíferos e Aves são atributos agregados à classe Recinto.",
                    "Mamíferos compõem Aves em um relacionamento de dependência forte.",
                    "Animal é uma interface que impede a criação de Aves e Mamíferos."
                ],
                answer: "Mamíferos e Aves herdam de Animal, mas cada subclasse define seus atributos especializados."
            },
            {
                id: 24,
                instruction: "Alternativa Correta: Multiplicidade Opcional.",
                scenario: "A multiplicidade na UML define as restrições quantitativas de um relacionamento entre pontas.",
                text: "O que a notação numérica '0..1' significa em uma relação?",
                options: [
                    "Um ou muitos.",
                    "Exatamente um (Obrigatório).",
                    "Infinidade negativa.",
                    "Zero ou um (Opcional)."
                ],
                answer: "Zero ou um (Opcional)."
            },
            {
                id: 25,
                instruction: "Conceitual: Demais Diagramas do Sistema.",
                scenario: "A UML engloba mais de 10 diagramas diferentes para representar o software sob várias perspectivas.",
                text: "Qual diagrama foca em mostrar a linha do tempo e a ordem em que os dados transitam entre os objetos?",
                options: [
                    "Diagrama de Casos de Uso.",
                    "Diagrama de Sequência.",
                    "Diagrama de Atividades.",
                    "Diagrama de Componentes."
                ],
                answer: "Diagrama de Sequência."
            },
            {
                id: 26,
                instruction: "Prática: App de Delivery.",
                scenario: "Após o restaurante finalizar o prato, o sistema aloca o pedido a um único entregador disponível para o transporte.",
                text: "Como fica a multiplicidade partindo do Pedido em direção ao Entregador alocado?",
                options: [
                    "Exatamente 1.",
                    "0..* (Zero ou muitos).",
                    "1..* (Um ou muitos).",
                    "Nula."
                ],
                answer: "Exatamente 1."
            },
            {
                id: 27,
                instruction: "Alternativa Correta: Símbolo de Composição.",
                scenario: "A Composição mapeia partes estritamente dependentes de um todo, onde 'a parte morre com o todo'.",
                text: "Qual é o símbolo visual que representa a Composição no diagrama de classes?",
                options: [
                    "Linha simples sem setas.",
                    "Losango vazado.",
                    "Losango preenchido.",
                    "Seta pontilhada (Dependência)."
                ],
                answer: "Losango preenchido."
            },
            {
                id: 28,
                instruction: "Conceitual: UML vs Programação.",
                scenario: "Muitos iniciantes confundem o papel da UML no fluxo de desenvolvimento.",
                text: "Podemos classificar a UML como uma linguagem de programação procedural para rodar rotinas?",
                options: [
                    "Sim, ela é compilada diretamente para a memória RAM do servidor Linux.",
                    "Não, ela foca puramente em criar scripts de banco de dados SQL.",
                    "Não, ela é uma linguagem visual de modelagem usada para documentar e planejar.",
                    "Sim, mas funciona apenas quando integrada com Java ou C#."
                ],
                answer: "Não, ela é uma linguagem visual de modelagem usada para documentar e planejar."
            },
            {
                id: 29,
                instruction: "Prática: Associação Simples.",
                scenario: "Na abstração de um sistema, identificou-se que um 'Motorista dirige um Carro'. O motorista não é parte do carro, e o carro não é parte do motorista, eles apenas interagem.",
                text: "Qual relacionamento descreve adequadamente o fato de uma classe apenas 'conhecer/interagir' com a outra?",
                options: [
                    "Composição (Losango preenchido).",
                    "Agregação (Losango vazado).",
                    "Herança (Seta vazada).",
                    "Associação (Linha simples)."
                ],
                answer: "Associação (Linha simples)."
            },
            {
                id: 30,
                instruction: "Alternativa Correta: Visibilidade Pública.",
                scenario: "Existem métodos (como 'realizarCompra()') que precisam ser chamados de fora da classe por outras partes do sistema.",
                text: "Qual símbolo da UML antecede um método indicando que ele possui Visibilidade Pública (Public)?",
                options: [
                    "(#)",
                    "(+)",
                    "(-)",
                    "(=)"
                ],
                answer: "(+)"
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
            await typeWriter(`Iniciando Validação de Orientação a Objetos e UML: Questão ${currentQuestion.value.id}...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Arquitetura sistêmica validada.";
                addLog("Sucesso: Relacionamento estrutural íntegro.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Divergência na abstração do modelo.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Modelagem Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Inconsistência identificada. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão do paradigma Orientado a Objetos e das estruturas de modelagem UML.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos Diagramas de Classes, notações de cardinalidade e hierarquias.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Orientação a Objetos e UML</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Arquitetura de Sistemas</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Validação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo abstração OO, Encapsulamento, Relacionamentos (Composição, Agregação, Herança) e multiplicidades UML.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Aproveitamento Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador UML_EVAL_v3.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Modelagem_UML_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador estrutural...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador UML_EVAL_v3.0...", "log-info");
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