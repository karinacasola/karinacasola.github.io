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
        
        const maxAttempts = 2;

        // --- Banco de Questões (40 Questões baseadas nos PDFs de IoT) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Conceito Histórico.",
                scenario: "Em 1999, durante uma apresentação na Procter & Gamble (P&G), um novo termo foi criado para descrever a implementação de etiquetas RFID na cadeia de suprimentos.",
                text: "Quem cunhou o termo 'Internet das Coisas'?",
                options: [
                    "Alan Turing.",
                    "Kevin Ashton.",
                    "Tim Berners-Lee.",
                    "Bill Gates."
                ],
                answer: "Kevin Ashton."
            },
            {
                id: 2,
                instruction: "Evolução da IoT.",
                scenario: "A conectividade de objetos cotidianos começou antes mesmo do termo IoT ser criado.",
                text: "Qual foi o primeiro objeto conectado à internet na década de 1980 na Universidade Carnegie Mellon?",
                options: [
                    "Um relógio digital.",
                    "Um termostato residencial.",
                    "Uma máquina de Coca-Cola.",
                    "Um carro autônomo."
                ],
                answer: "Uma máquina de Coca-Cola."
            },
            {
                id: 3,
                instruction: "Definição de IoT.",
                scenario: "Um aluno pergunta como definir a Internet das Coisas de forma técnica.",
                text: "Qual é o conceito fundamental da IoT?",
                options: [
                    "Apenas o uso de inteligência artificial em servidores isolados.",
                    "A rede de objetos físicos incorporados a sensores e software para trocar dados pela internet.",
                    "A criação de interfaces visuais para computadores de mesa.",
                    "O uso exclusivo de Bluetooth para conectar fones de ouvido."
                ],
                answer: "A rede de objetos físicos incorporados a sensores e software para trocar dados pela internet."
            },
            {
                id: 4,
                instruction: "Fluxo Lógico de Dados.",
                scenario: "Você está desenhando o diagrama de blocos de um sistema IoT.",
                text: "Qual é a sequência correta do fluxo lógico de dados em um sistema IoT funcional?",
                options: [
                    "Nuvem -> Usuário -> ESP32 -> Sensor.",
                    "Usuário -> Plataforma -> Sensor -> ESP32.",
                    "Sensor (Coleta) -> ESP32 (Processamento) -> Plataforma (Nuvem) -> Usuário (Monitoramento).",
                    "ESP32 -> Sensor -> Usuário -> Plataforma."
                ],
                answer: "Sensor (Coleta) -> ESP32 (Processamento) -> Plataforma (Nuvem) -> Usuário (Monitoramento)."
            },
            {
                id: 5,
                instruction: "Hardware IoT: ESP32.",
                scenario: "A equipe de hardware precisa escolher um microcontrolador que não exija módulos extras para se conectar à rede sem fio.",
                text: "Por que o ESP32 é a escolha principal para projetos IoT nesse cenário?",
                options: [
                    "Porque ele não suporta Bluetooth, economizando bateria.",
                    "Porque ele possui Wi-Fi e Bluetooth integrados nativamente no chip (SoC).",
                    "Porque ele funciona apenas via cabo Ethernet.",
                    "Porque ele requer um computador acoplado para funcionar."
                ],
                answer: "Porque ele possui Wi-Fi e Bluetooth integrados nativamente no chip (SoC)."
            },
            {
                id: 6,
                instruction: "Terminologia de Hardware.",
                scenario: "Lendo o datasheet do ESP32, você encontra a sigla 'SoC'.",
                text: "O que significa SoC no contexto do ESP32?",
                options: [
                    "System on a Chip (Tudo em um único componente).",
                    "Software on Cloud.",
                    "Sensor over Connection.",
                    "System of C."
                ],
                answer: "System on a Chip (Tudo em um único componente)."
            },
            {
                id: 7,
                instruction: "Pilares da IoT: Percepção.",
                scenario: "Você precisa medir a temperatura e a umidade de uma estufa agrícola.",
                text: "Qual componente do pilar de IoT é responsável por coletar esses dados do ambiente?",
                options: [
                    "Conectividade.",
                    "Processamento de Dados.",
                    "Sensores/Dispositivos.",
                    "Interface de Usuário (UI)."
                ],
                answer: "Sensores/Dispositivos."
            },
            {
                id: 8,
                instruction: "Pilares da IoT: Conectividade.",
                scenario: "Os sensores da estufa já estão coletando dados, mas eles precisam chegar até a nuvem.",
                text: "Quais protocolos/tecnologias representam o pilar de Conectividade?",
                options: [
                    "Dashboards e Gráficos.",
                    "Wi-Fi, Bluetooth, LoRaWAN, 5G.",
                    "Microcontroladores e Atuadores.",
                    "Processamento Local (Edge)."
                ],
                answer: "Wi-Fi, Bluetooth, LoRaWAN, 5G."
            },
            {
                id: 9,
                instruction: "Arquitetura IoT: Camada 1.",
                scenario: "Você está analisando a arquitetura em 4 camadas de um projeto IoT. A base do projeto envolve atuadores e a coleta de 180°C por um termopar.",
                text: "Em qual camada esses elementos estão localizados?",
                options: [
                    "Camada de Aplicação.",
                    "Camada de Middleware.",
                    "Camada de Percepção.",
                    "Camada de Rede."
                ],
                answer: "Camada de Percepção."
            },
            {
                id: 10,
                instruction: "Arquitetura IoT: Camada 4.",
                scenario: "O prefeito de uma cidade inteligente quer ver os dados de tráfego em um painel web.",
                text: "Qual camada da arquitetura fornece esses Dashboards e Aplicativos?",
                options: [
                    "Camada de Percepção.",
                    "Camada de Rede.",
                    "Camada de Middleware.",
                    "Camada de Aplicação."
                ],
                answer: "Camada de Aplicação."
            },
            {
                id: 11,
                instruction: "Pirâmide de Valor: Dados Brutos.",
                scenario: "O painel do sistema mostra apenas os números '180°C' e '10%', sem nenhum contexto adicional.",
                text: "Como classificamos essas informações na pirâmide de valor da IoT?",
                options: [
                    "Dados (Data): Valores brutos e isolados.",
                    "Informação: Dados contextualizados.",
                    "Conhecimento (Insights): Compreensão aplicada.",
                    "Sabedoria Artificial."
                ],
                answer: "Dados (Data): Valores brutos e isolados."
            },
            {
                id: 12,
                instruction: "Pirâmide de Valor: Conhecimento.",
                scenario: "O sistema alerta: 'A máquina A superaquece ao processar o material X; reduziremos a velocidade do motor para evitar falhas'.",
                text: "O que essa tomada de decisão autônoma representa?",
                options: [
                    "Dados brutos.",
                    "Apenas Informação.",
                    "Conhecimento (Insights): Compreensão aplicada gerando ação.",
                    "Camada de Rede."
                ],
                answer: "Conhecimento (Insights): Compreensão aplicada gerando ação."
            },
            {
                id: 13,
                instruction: "Protocolo de Comunicação.",
                scenario: "O sistema requer uma comunicação distribuída e leve para milhares de sensores.",
                text: "Qual protocolo baseado em um componente central (Broker) é amplamente utilizado em IoT?",
                options: [
                    "HTTP.",
                    "MQTT.",
                    "FTP.",
                    "SMTP."
                ],
                answer: "MQTT."
            },
            {
                id: 14,
                instruction: "Protocolo MQTT: O Broker.",
                scenario: "As mensagens de temperatura precisam ser roteadas corretamente para os aplicativos que as solicitaram.",
                text: "Qual é a função do Broker MQTT?",
                options: [
                    "Coletar dados analógicos do ambiente.",
                    "Gerenciar e distribuir as mensagens.",
                    "Proteger o circuito elétrico.",
                    "Renderizar os gráficos no navegador."
                ],
                answer: "Gerenciar e distribuir as mensagens."
            },
            {
                id: 15,
                instruction: "Protocolo MQTT: Tópicos.",
                scenario: "O ESP32 precisa enviar a umidade para um destino específico no Broker para não misturar com os dados de temperatura.",
                text: "Como são chamados os 'canais específicos' onde as informações são publicadas?",
                options: [
                    "Gateways.",
                    "Tópicos.",
                    "Brokers.",
                    "Sockets."
                ],
                answer: "Tópicos."
            },
            {
                id: 16,
                instruction: "Protocolo MQTT: Subscribe.",
                scenario: "O software de monitoramento precisa receber notificações automáticas sem ter que ficar perguntando ativamente ao servidor se há novos dados.",
                text: "Qual ação o software executa no MQTT para ouvir um tópico em tempo real?",
                options: [
                    "Publish (Publicar).",
                    "Subscribe (Assinar).",
                    "Request (Requisitar).",
                    "Ping."
                ],
                answer: "Subscribe (Assinar)."
            },
            {
                id: 17,
                instruction: "Fator Crítico de Projeto.",
                scenario: "Antes de comprar dezenas de sensores e microcontroladores, a equipe está avaliando o local da instalação no campo.",
                text: "Qual é o fator MAIS importante antes de iniciar a implementação física de um sistema IoT?",
                options: [
                    "A cor dos sensores.",
                    "A disponibilidade de conectividade estável (Wi-Fi ou Rede Móvel).",
                    "Ter um dashboard com modo escuro.",
                    "O uso exclusivo do protocolo HTTP."
                ],
                answer: "A disponibilidade de conectividade estável (Wi-Fi ou Rede Móvel)."
            },
            {
                id: 18,
                instruction: "Modelos de Processamento.",
                scenario: "O projeto gera Terabytes de dados históricos ao longo do ano, exigindo grande capacidade de armazenamento.",
                text: "Qual modelo de processamento é ideal para esse Big Data?",
                options: [
                    "Edge Computing.",
                    "Cloud Computing (Nuvem).",
                    "Processamento Local.",
                    "SoC."
                ],
                answer: "Cloud Computing (Nuvem)."
            },
            {
                id: 19,
                instruction: "Modelos de Processamento.",
                scenario: "Um veículo autônomo precisa frear instantaneamente se detectar um obstáculo. Ele não pode esperar a latência de enviar o dado à internet e aguardar a resposta.",
                text: "Qual tipo de processamento garante respostas em tempo real e menor latência?",
                options: [
                    "Cloud Computing.",
                    "Big Data em Nuvem.",
                    "Edge Computing (Computação de Borda).",
                    "Armazenamento a Frio."
                ],
                answer: "Edge Computing (Computação de Borda)."
            },
            {
                id: 20,
                instruction: "Ética e Privacidade.",
                scenario: "Um novo smartwatch será lançado no Brasil. A empresa quer coletar dados de batimentos cardíacos dos usuários.",
                text: "Segundo as leis de privacidade (como a LGPD), o que é exigido sobre o consentimento?",
                options: [
                    "Pode ser implícito, desde que os termos de uso sejam longos.",
                    "A empresa pode coletar secretamente se for para melhorar o produto.",
                    "O consentimento deve ser explícito, consentido e informado.",
                    "A coleta não requer consentimento se os dados forem enviados para a nuvem."
                ],
                answer: "O consentimento deve ser explícito, consentido e informado."
            },
            {
                id: 21,
                instruction: "Riscos de Privacidade.",
                scenario: "A prefeitura publicou dados 'anônimos' de GPS de carros. Um hacker cruzou os locais de saída de manhã e chegada à noite e descobriu quem eram os motoristas.",
                text: "Como se chama esse grande desafio na IoT?",
                options: [
                    "Criptografia Ponta a Ponta.",
                    "Risco de Reidentificação.",
                    "Edge Computing.",
                    "Roteamento de Rede."
                ],
                answer: "Risco de Reidentificação."
            },
            {
                id: 22,
                instruction: "Responsabilidade Civil.",
                scenario: "Um dispositivo médico IoT apresenta falha em um sensor e emite uma dosagem incorreta, ferindo o paciente.",
                text: "Como o consenso jurídico atual analisa a responsabilidade em incidentes como este?",
                options: [
                    "A culpa é exclusivamente do provedor de internet.",
                    "A culpa é sempre do usuário por não atualizar o firmware.",
                    "Analisa-se a cadeia de responsabilidade (fabricante, desenvolvedor, provedor) e exige-se contratos claros.",
                    "O paciente assume o risco total ao usar dispositivos conectados."
                ],
                answer: "Analisa-se a cadeia de responsabilidade (fabricante, desenvolvedor, provedor) e exige-se contratos claros."
            },
            {
                id: 23,
                instruction: "Etapas de Projeto IoT.",
                scenario: "O cliente quer implementar IoT em sua fazenda e já quer comprar 500 sensores de imediato.",
                text: "Antes de escalar, qual etapa o desenvolvedor deve realizar para testar a viabilidade em pequena escala?",
                options: [
                    "Lançamento global.",
                    "Prova de Conceito (PoC).",
                    "Instalação de Redes 6G.",
                    "Processo Unificado Ágil."
                ],
                answer: "Prova de Conceito (PoC)."
            },
            {
                id: 24,
                instruction: "Escolha de Hardware e Rede.",
                scenario: "Você vai monitorar o gado em um pasto aberto muito amplo, sem tomadas. O Wi-Fi gasta muita bateria e tem curto alcance.",
                text: "Qual tipo de rede seria mais adequada?",
                options: [
                    "Rede LoRa (melhor para campo aberto).",
                    "Rede Cabeada Ethernet.",
                    "Wi-Fi de Alta Frequência.",
                    "Bluetooth de Curto Alcance."
                ],
                answer: "Rede LoRa (melhor para campo aberto)."
            },
            {
                id: 25,
                instruction: "Segurança IoT.",
                scenario: "Muitos dispositivos IoT possuem baixo poder de processamento, impedindo criptografias pesadas e tornando-os alvos fáceis (botnets).",
                text: "Como a segurança deve ser tratada nesses projetos?",
                options: [
                    "Apenas adicionando um antivírus no final.",
                    "A segurança deve estar na concepção (Security by Design).",
                    "Ignorando a segurança, pois os dados não importam.",
                    "Desligando o dispositivo quando não estiver em uso."
                ],
                answer: "A segurança deve estar na concepção (Security by Design)."
            },
            {
                id: 26,
                instruction: "Perspectivas Futuras.",
                scenario: "No futuro, as máquinas de uma fábrica usarão dados coletados por IoT e inteligência para tomar decisões autônomas e preditivas sem intervenção humana.",
                text: "Como é chamada a convergência da Inteligência Artificial com a IoT?",
                options: [
                    "Big Data.",
                    "Edge Computing.",
                    "AIoT (Inteligência Artificial das Coisas).",
                    "Indústria 1.0."
                ],
                answer: "AIoT (Inteligência Artificial das Coisas)."
            },
            {
                id: 27,
                instruction: "Redes do Futuro.",
                scenario: "Para que cirurgias remotas sejam viáveis, a rede precisará conectar bilhões de dispositivos com latência quase zero.",
                text: "Quais tecnologias de rede prometem viabilizar esse cenário massivo e instantâneo?",
                options: [
                    "3G e 4G.",
                    "Redes 5G e 6G.",
                    "Cabos Coaxiais.",
                    "Bluetooth 2.0."
                ],
                answer: "Redes 5G e 6G."
            },
            {
                id: 28,
                instruction: "Fundamentos de Eletrônica.",
                scenario: "Você vai ligar um LED a um pino do ESP32 para criar um alerta visual.",
                text: "Qual componente elétrico deve ser inserido para oferecer oposição à corrente e evitar que o LED queime?",
                options: [
                    "Um Capacitor.",
                    "Um Resistor.",
                    "Um Transistor.",
                    "Um Broker MQTT."
                ],
                answer: "Um Resistor."
            },
            {
                id: 29,
                instruction: "Circuitos Básicos.",
                scenario: "Você selecionou o resistor adequado para o LED no pino digital.",
                text: "Como este resistor deve ser conectado fisicamente ao LED?",
                options: [
                    "Em paralelo.",
                    "Apenas no pino terra (GND).",
                    "Em série com o LED.",
                    "Via conexão Bluetooth."
                ],
                answer: "Em série com o LED."
            },
            {
                id: 30,
                instruction: "Lógica de Programação: Decisão.",
                scenario: "A bomba de água só deve ligar se a umidade do solo estiver abaixo de 30%.",
                text: "Qual estrutura lógica é utilizada para comparar esses valores com limites definidos?",
                options: [
                    "Estrutura de Repetição (for).",
                    "Estrutura Condicional (if).",
                    "MQTT Subscribe.",
                    "Ponteiro de Memória."
                ],
                answer: "Estrutura Condicional (if)."
            },
            {
                id: 31,
                instruction: "Lógica de Programação: Repetição.",
                scenario: "O microcontrolador precisa ler o valor do sensor de temperatura exatamente 10 vezes para calcular uma média e evitar ruídos.",
                text: "Qual estrutura de código é ideal para repetir um bloco um número determinado de vezes?",
                options: [
                    "Estrutura Condicional (if).",
                    "Switch Case.",
                    "Estrutura de Repetição (for).",
                    "Setup de Wi-Fi."
                ],
                answer: "Estrutura de Repetição (for)."
            },
            {
                id: 32,
                instruction: "Primeiros Passos ESP32.",
                scenario: "O instrutor pediu para fazer o 'Hello World' da eletrônica com o ESP32.",
                text: "Qual projeto corresponde a esse passo inicial que ensina o controle de saídas digitais (GPIO)?",
                options: [
                    "Leitura de Potenciômetro.",
                    "Projeto Pisca-Pisca (fazer o LED acender e apagar).",
                    "Conectar à Nuvem AWS.",
                    "Ler dados de um banco SQL."
                ],
                answer: "Projeto Pisca-Pisca (fazer o LED acender e apagar)."
            },
            {
                id: 33,
                instruction: "Entradas Digitais.",
                scenario: "Você adicionou um push-button ao circuito para que o usuário possa ligar um alarme manualmente.",
                text: "O que o controle por botão ensina na programação embarcada?",
                options: [
                    "O uso de bancos de dados relacionais.",
                    "A leitura de estados digitais (Ligado/Desligado, HIGH/LOW) e lógica condicional simples.",
                    "A conversão de sinais de rádio AM/FM.",
                    "A estrutura de camadas de uma Smart City."
                ],
                answer: "A leitura de estados digitais (Ligado/Desligado, HIGH/LOW) e lógica condicional simples."
            },
            {
                id: 34,
                instruction: "Entradas Analógicas.",
                scenario: "Você conectou um potenciômetro (botão de girar) para alterar gradualmente o brilho de um LED.",
                text: "O que esse projeto demonstra em contraste com um botão simples?",
                options: [
                    "Apenas o uso de 0 e 1.",
                    "A diferença entre sinais digitais e analógicos (uma faixa contínua de valores) e a conversão de dados.",
                    "O funcionamento interno do protocolo MQTT.",
                    "A criação de tópicos de segurança."
                ],
                answer: "A diferença entre sinais digitais e analógicos (uma faixa contínua de valores) e a conversão de dados."
            },
            {
                id: 35,
                instruction: "Conectividade Básica.",
                scenario: "Você carregou um código simples cujo objetivo é introduzir bibliotecas de rede.",
                text: "Qual é a saída esperada do projeto 'Primeiro Ping na Rede'?",
                options: [
                    "Apagar um LED externo.",
                    "Conectar ao Wi-Fi do laboratório e exibir o endereço IP no Monitor Serial.",
                    "Publicar uma mensagem em um Dashboard na Nuvem.",
                    "Girar um motor de passo 180 graus."
                ],
                answer: "Conectar ao Wi-Fi do laboratório e exibir o endereço IP no Monitor Serial."
            },
            {
                id: 36,
                instruction: "Camadas da IoT.",
                scenario: "Você instalou regras de negócio em um roteador industrial localizado dentro da fábrica (Edge) para processar alertas locais.",
                text: "Essa ação pertence a qual camada da arquitetura?",
                options: [
                    "Camada de Percepção (1).",
                    "Camada de Rede (2).",
                    "Camada de Middleware e Firmware (3).",
                    "Camada de Aplicação (4)."
                ],
                answer: "Camada de Middleware e Firmware (3)."
            },
            {
                id: 37,
                instruction: "Camadas da IoT.",
                scenario: "A escolha do módulo de Gateway e do padrão Bluetooth foi definida para o projeto residencial.",
                text: "O Bluetooth e o Gateway fazem parte de qual camada?",
                options: [
                    "Camada de Percepção (1).",
                    "Camada de Rede e Conexão (2).",
                    "Camada de Middleware (3).",
                    "Camada de Aplicação (4)."
                ],
                answer: "Camada de Rede e Conexão (2)."
            },
            {
                id: 38,
                instruction: "Automação e Lógica.",
                scenario: "Combinando um sensor e estruturas if/for no ESP32, o sistema decide sozinho quando ativar bombas d'água.",
                text: "O que essa tomada de decisão baseada em lógica representa no projeto?",
                options: [
                    "A inteligência da automação.",
                    "Uma Prova de Conceito (PoC).",
                    "O consentimento do usuário via LGPD.",
                    "O uso de Cloud Computing."
                ],
                answer: "A inteligência da automação."
            },
            {
                id: 39,
                instruction: "Smart Cities e Indústria 4.0.",
                scenario: "O objetivo de um novo projeto governamental é integrar a infraestrutura de energia, trânsito e saúde da cidade.",
                text: "Qual é o objetivo final dessa integração total baseada em IoT?",
                options: [
                    "Apenas reduzir a velocidade da internet residencial.",
                    "Buscar eficiência e sustentabilidade globais.",
                    "Testar redes 3G em áreas isoladas.",
                    "Proibir o uso de ESP32 em escolas."
                ],
                answer: "Buscar eficiência e sustentabilidade globais."
            },
            {
                id: 40,
                instruction: "Revisão Final: Do Físico à Decisão.",
                scenario: "Seu sistema completo coleta umidade, envia via Wi-Fi, processa na nuvem e exibe em um app.",
                text: "Segundo a meta da aula, quais são os impactos fundamentais analisados criticamente no desenvolvimento dessa solução?",
                options: [
                    "Apenas o custo do hardware.",
                    "Impactos éticos, legais (privacidade) e os desafios práticos de implementação (arquitetura e segurança).",
                    "Apenas a diferença entre Cascata e Scrum.",
                    "O impacto do CSS no front-end."
                ],
                answer: "Impactos éticos, legais (privacidade) e os desafios práticos de implementação (arquitetura e segurança)."
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
            await typeWriter(`Carregando Missão ${currentQuestion.value.id} de 40...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Conceito de IoT validado.";
                addLog("Sucesso: Base técnica de IoT compreendida.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Conceito incorreto para o cenário apresentado.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Decisão Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Decisão incorreta. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade técnica em fundamentos e arquitetura da Internet das Coisas.";
            if (score.value < 28) performanceMsg = "Recomenda-se revisão aprofundada dos pilares e protocolos IoT.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Avaliação - Internet das Coisas</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em IoT e ESP32</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo arquitetura, hardware, protocolos, ética e desafios práticos de IoT.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 28 ? '#10B981' : (score.value >= 20 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador de IoT.
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_IoT_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando simulação de Internet das Coisas...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador IoT_v1.0...", "log-info");
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