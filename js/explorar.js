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

        // --- Banco de Questões (20 Questões - Exploração Digital e Fundamentos) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Meta da Aula",
                scenario: "Ao iniciar o curso, é importante entender o propósito geral da aprendizagem tecnológica.",
                text: "Qual é a meta principal em relação à infraestrutura digital?",
                options: [
                    "Compreender a evolução da infraestrutura digital e reconhecer como a convergência das tecnologias molda a sociedade e a economia.",
                    "Aprender a programar em linguagem de máquina para mainframes.",
                    "Entender como os cabos submarinos são fisicamente construídos no oceano.",
                    "Estudar exclusivamente o desenvolvimento de hardware para computadores pessoais."
                ],
                answer: "Compreender a evolução da infraestrutura digital e reconhecer como a convergência das tecnologias molda a sociedade e a economia."
            },
            {
                id: 2,
                instruction: "Valores e Atitudes",
                scenario: "Um grupo de estudantes está desenvolvendo um projeto online e precisa definir regras de convivência.",
                text: "Quais são alguns dos pilares de atitude exigidos no ambiente digital?",
                options: [
                    "Desenvolver a ética, promover a empatia e respeitar a propriedade intelectual e privacidade.",
                    "Compartilhar dados pessoais abertamente para acelerar a Web 3.0.",
                    "Priorizar a velocidade de conexão em detrimento da segurança.",
                    "Evitar o uso de nuvem para não expor a propriedade intelectual."
                ],
                answer: "Desenvolver a ética, promover a empatia e respeitar a propriedade intelectual e privacidade."
            },
            {
                id: 3,
                instruction: "História - Anos 1940 a 1960",
                scenario: "Um documentário histórico aborda o início da computação corporativa e governamental.",
                text: "Como eram caracterizados os computadores (Mainframes) dos anos 1940 a 1960?",
                options: [
                    "Computadores giants, usados apenas por governos e grandes corporações para cálculos balísticos e censos.",
                    "Dispositivos móveis que democratizaram a internet.",
                    "Sistemas ciberfísicos integrados à Internet das Coisas (IoT).",
                    "Computadores pessoais presentes na maioria das casas."
                ],
                answer: "Computadores gigantes, usados apenas por governos e grandes corporações para cálculos balísticos e censos."
            },
            {
                id: 4,
                instruction: "História - Anos 1970 a 1980",
                scenario: "A democratização da tecnologia começou quando as máquinas saíram dos grandes laboratórios.",
                text: "O que marcou a transformação digital nos anos 1970 e 1980?",
                options: [
                    "A tecnologia entra nas casas e escritórios com o Computador Pessoal (PC).",
                    "A criação das primeiras redes sociais baseadas em avatares 3D.",
                    "O surgimento da Inteligência Artificial operando via 5G.",
                    "A transição das fábricas para a Indústria 4.0."
                ],
                answer: "A tecnologia entra nas casas e escritórios com o Computador Pessoal (PC)."
            },
            {
                id: 5,
                instruction: "História - Anos 1990 a 2000",
                scenario: "Empresas começaram a vender produtos globalmente sem lojas físicas.",
                text: "Qual foi o principal marco da transformação digital entre os anos 1990 e 2000?",
                options: [
                    "O mundo se conecta com a Internet Comercial, surgimento do e-commerce e globalização da informação.",
                    "A invenção do código binário e dos primeiros mainframes.",
                    "A implementação de fábricas baseadas no Fordismo.",
                    "A introdução exclusiva de tecnologias descentralizadas via Blockchain."
                ],
                answer: "O mundo se conecta com a Internet Comercial, surgimento do e-commerce e globalização da informação."
            },
            {
                id: 6,
                instruction: "História - Anos 2010 até Hoje",
                scenario: "Vivemos conectados o tempo todo, dependendo dos nossos smartphones para quase tudo.",
                text: "Como é definida a era tecnológica de 2010 até hoje?",
                options: [
                    "Era Mobile e Inteligência Artificial, com conectividade 24/7, nuvem e algoritmos preditivos.",
                    "A era da 'Web da Leitura', focada apenas em sites estáticos.",
                    "O período focado apenas na automação e eletrônica nas fábricas (Indústria 3.0).",
                    "A fase de criação dos PCs, onde o digital começou a democratizar."
                ],
                answer: "Era Mobile e Inteligência Artificial, com conectividade 24/7, nuvem e algoritmos preditivos."
            },
            {
                id: 7,
                instruction: "A Evolução da Web vs Indústria",
                scenario: "A evolução tecnológica muitas vezes é comparada aos saltos na produção industrial.",
                text: "A Indústria 1.0 e 2.0 (máquinas a vapor, Fordismo) fazem paralelo a qual fase da evolução da internet, em termos de estágio evolutivo inicial?",
                options: [
                    "Pode ser comparada à base inicial, como a Web 1.0 (Anos 90), que era a 'Web da Leitura'.",
                    "Faz paralelo direto com a Web 4.0 (Simbiótica).",
                    "À Era Mobile e Inteligência Artificial.",
                    "Ao surgimento da Web 3.0 e Blockchain."
                ],
                answer: "Pode ser comparada à base inicial, como a Web 1.0 (Anos 90), que era a 'Web da Leitura'."
            },
            {
                id: 8,
                instruction: "Web 1.0",
                scenario: "Em 1996, você acessava a internet para ler notícias em uma página que não permitia comentários.",
                text: "Como é caracterizada a Web 1.0 (Anos 90)?",
                options: [
                    "A 'Web da Leitura', formada por sites estáticos e catálogos online onde o usuário apenas consumia informação.",
                    "A 'Web Social', onde o usuário passou a produzir conteúdo e interagir.",
                    "A 'Web Semântica', controlada por IA e dispositivos ciberfísicos.",
                    "A era do 'Fordismo Digital', com servidores independentes do usuário final."
                ],
                answer: "A 'Web da Leitura', formada por sites estáticos e catálogos online onde o usuário apenas consumia informação."
            },
            {
                id: 9,
                instruction: "Web 2.0 e Indústria 3.0",
                scenario: "Com o crescimento dos blogs e do YouTube, a forma de usar a internet mudou drasticamente.",
                text: "O que define a Web 2.0 (Anos 2000)?",
                options: [
                    "A 'Web Social', marcada por redes sociais e a transição do usuário para produtor de conteúdo.",
                    "A 'Web Semântica', onde máquinas conversam exclusivamente entre si.",
                    "O período onde robôs assumiram as fábricas e controlavam as redes sociais.",
                    "A era estática de consumo passivo, também conhecida como a 'Web da Leitura'."
                ],
                answer: "A 'Web Social', marcada por redes sociais e a transição do usuário para produtor de conteúdo."
            },
            {
                id: 10,
                instruction: "Indústria 4.0",
                scenario: "Uma fábrica automotiva instalou sensores que tomam decisões sozinhos para corrigir falhas na montagem.",
                text: "Quais elementos caracterizam a Indústria 4.0 (A Quarta Revolução)?",
                options: [
                    "Sistemas ciberfísicos, Internet das Coisas (IoT), Impressão 3D, Big Data e fábricas inteligentes que tomam decisões sozinhas.",
                    "O uso exclusivo de eletricidade e produção em massa no estilo Fordismo.",
                    "Robótica inicial focada apenas na substituição manual pesada.",
                    "O surgimento da internet discada e globalização da informação."
                ],
                answer: "Sistemas ciberfísicos, Internet das Coisas (IoT), Impressão 3D, Big Data e fábricas inteligentes que tomam decisões sozinhas."
            },
            {
                id: 11,
                instruction: "Web 3.0",
                scenario: "A criptomoeda Bitcoin popularizou o conceito de descentralização.",
                text: "Além dos assistentes virtuais, qual é um dos principais focos da Web 3.0?",
                options: [
                    "Descentralização (Blockchain) e controle de dados pelo usuário.",
                    "Sites estáticos para leitura.",
                    "Centrais de processamento mainframe exclusivas de governos.",
                    "Mecanização com máquinas a vapor."
                ],
                answer: "Descentralização (Blockchain) e controle de dados pelo usuário."
            },
            {
                id: 12,
                instruction: "Web 4.0",
                scenario: "Carros autônomos conversam com semáforos inteligentes para evitar congestionamentos sem intervenção humana.",
                text: "Como é definida a Web 4.0 no contexto da integração digital?",
                options: [
                    "Web Semântica/Simbiótica, onde as máquinas conversam entre si e há integração total entre os mundos físico e digital.",
                    "A fase de criação de fóruns e sites de relacionamento baseados em texto.",
                    "O início do uso do computador pessoal em escritórios corporativos.",
                    "Um sistema isolado focado em catálogos eletrônicos sem interatividade."
                ],
                answer: "Web Semântica/Simbiótica, onde as máquinas conversam entre si e há integração total entre os mundos físico e digital."
            },
            {
                id: 13,
                instruction: "Infraestrutura Digital Básica",
                scenario: "Para que o Metaverso ou o 5G funcionem na prática, precisamos de uma estrutura por trás.",
                text: "Quais são os três pilares físicos e lógicos da infraestrutura digital apresentados?",
                options: [
                    "A Nuvem (Cloud), Conectividade (5G/Fibra) e Dispositivos (End-points).",
                    "Mainframes, Telégrafos e Sensores a Vapor.",
                    "Inteligência Artificial, Blockchain e Metaverso.",
                    "Redes Sociais, Comércio Eletrônico e YouTube."
                ],
                answer: "A Nuvem (Cloud), Conectividade (5G/Fibra) e Dispositivos (End-points)."
            },
            {
                id: 14,
                instruction: "Pilar 1 - A Nuvem",
                scenario: "Muitos usuários acham que seus arquivos online ficam 'flutuando' no ar.",
                text: "Qual é a definição correta para A Nuvem (Cloud Computing)?",
                options: [
                    "São fazendas gigantescas de servidores (Datacenters) que processam e armazenam dados globalmente.",
                    "São discos rígidos virtuais criados a partir das conexões 5G entre celulares.",
                    "São satélites atmosféricos que armazenam todas as fotos das redes sociais.",
                    "São pequenos chips presentes nos roteadores Wi-Fi locais."
                ],
                answer: "São fazendas gigantescas de servidores (Datacenters) que processam e armazenam dados globalmente."
            },
            {
                id: 15,
                instruction: "Serviços de Nuvem",
                scenario: "Empresas evitam construir seus próprios servidores contratando infraestrutura pronta.",
                text: "Quais são os principais exemplos de plataformas de Datacenters (Nuvem) citados no material?",
                options: [
                    "AWS, Google Cloud e Azure.",
                    "Facebook, Instagram e YouTube.",
                    "Ford, Tesla e Toyota.",
                    "Wi-Fi, 4G e Fibra Óptica."
                ],
                answer: "AWS, Google Cloud e Azure."
            },
            {
                id: 16,
                instruction: "Pilar 2 - Conectividade",
                scenario: "A informação digital precisa de caminhos físicos e ondas para chegar ao seu destino.",
                text: "O que engloba o pilar de 'Redes e Conectividade' que atua como as 'estradas' da informação?",
                options: [
                    "Cabos submarinos intercontinentais, redes de Fibra Óptica, Wi-Fi e redes móveis (4G/5G).",
                    "Apenas cabos de rede locais dentro de escritórios empresariais.",
                    "Somente conexões via satélite para áreas rurais.",
                    "A infraestrutura de armazenamento de baterias em fazendas de servidores."
                ],
                answer: "Cabos submarinos intercontinentais, redes de Fibra Óptica, Wi-Fi e redes móveis (4G/5G)."
            },
            {
                id: 17,
                instruction: "Pilar 3 - Dispositivos",
                scenario: "O usuário final precisa de hardware para enviar comandos e consumir as informações da nuvem.",
                text: "O que caracteriza os Dispositivos (End-points) na infraestrutura digital?",
                options: [
                    "São a ponta onde interagimos, como celulares, PCs, relógios inteligentes, sensores industriais e assistentes virtuais.",
                    "São os cabos submarinos que conectam continentes.",
                    "São exclusivamente os grandes datacenters do Google e da Amazon.",
                    "São os softwares criados na época da Web 1.0 para leitura passiva."
                ],
                answer: "São a ponta onde interagimos, como celulares, PCs, relógios inteligentes, sensores industriais e assistentes virtuais."
            },
            {
                id: 18,
                instruction: "Dispositivos End-points (Exemplos Práticos)",
                scenario: "Você está configurando a automação da sua casa usando a Alexa ou Google Home.",
                text: "Como esses assistentes virtuais (Alexa/Google Home) são classificados na infraestrutura tecnológica apresentada?",
                options: [
                    "Como Dispositivos (End-points).",
                    "Como Datacenters de Nuvem centralizados.",
                    "Como infraestrutura de Fibra Óptica.",
                    "Como nós de processamento exclusivo da Indústria 1.0."
                ],
                answer: "Como Dispositivos (End-points)."
            },
            {
                id: 19,
                instruction: "Reflexão sobre Tecnologia",
                scenario: "O avanço contínuo das ferramentas digitais proporciona um enorme potencial para quem as controla.",
                text: "Diante da afirmação 'Tecnologia é poder', qual é a reflexão ética central da aula?",
                options: [
                    "Garantir que toda essa infraestrutura seja usada com empatia, ética e respeito à privacidade.",
                    "Assegurar que toda a infraestrutura seja dominada comercialmente para maximizar o lucro.",
                    "Restringir o acesso à Web 4.0 apenas a governos para garantir a segurança balística.",
                    "Reduzir o avanço da Indústria 4.0 para proteger os métodos do Fordismo."
                ],
                answer: "Garantir que toda essa infraestrutura seja usada com empatia, ética e respeito à privacidade."
            },
            {
                id: 20,
                instruction: "O Impacto do Smartphone",
                scenario: "Com o avanço da era Mobile e da Inteligência artificial a partir de 2010, os aparelhos se tornaram indispensáveis.",
                text: "Segundo o panorama da evolução digital (Anos 2010 - Hoje), como o celular é enxergado na atualidade?",
                options: [
                    "Como uma extensão do corpo humano.",
                    "Como um dispositivo estático da Web 1.0.",
                    "Como uma ferramenta exclusiva para controle de mainframes.",
                    "Como uma interface limitada a chamadas de voz e mensagens curtas."
                ],
                answer: "Como uma extensão do corpo humano."
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
            await typeWriter(`Carregando Desafio de Exploração Digital ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Sucesso: Estruturação lógica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Compilação interrompida.", "log-error");
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
            
            let performanceMsg = "Excelente compreensão da evolução e infraestrutura digital.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos sobre evolução e conectividade digital.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Exploração Digital</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Fundamentos Tecnológicos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo evolução tecnológica, cloud computing, conectividade e as diferentes eras da internet.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador ALGO_EVAL_v1.5
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Fundamentos_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador ALGO_EVAL_v1.5...", "log-info");
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