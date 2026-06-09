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

        // --- Banco de Questões (As 20 de Empatia e Colaboração Interdisciplinar) ---
        const questions = ref([
            {
                id: 1,
                instruction: "O Modelo do Iceberg e a Comunicação.",
                scenario: "Um cidadão reclama que o posto de saúde está sempre fechado. No entanto, sua verdadeira dificuldade é o preço da passagem de ônibus para chegar lá.",
                text: "De acordo com o Modelo do Iceberg aplicado à comunicação, o que representa a 'ponta visível' nesse contexto?",
                options: [
                    "A queixa verbalizada ou o sintoma imediato.",
                    "Os medos e inseguranças estruturais.",
                    "A falta de literacia digital do cidadão.",
                    "O planejamento logístico da intervenção comunitária."
                ],
                answer: "A queixa verbalizada ou o sintoma imediato."
            },
            {
                id: 2,
                instruction: "O papel da escuta empática.",
                scenario: "Durante uma entrevista de campo para um projeto social, o pesquisador foca não apenas no que o entrevistado diz abertamente, mas também no que ele hesita em dizer.",
                text: "O que caracteriza a escuta empática?",
                options: [
                    "É a mera recepção passiva de estímulos sonoros do ambiente.",
                    "É um processo ativo de descodificação para compreender necessidades não verbalizadas.",
                    "É a interrupção constante para impor o conhecimento técnico do entrevistador.",
                    "É a escuta focada estritamente na coleta de dados quantitativos."
                ],
                answer: "É um processo ativo de descodificação para compreender necessidades não verbalizadas."
            },
            {
                id: 3,
                instruction: "Colaboração Interdisciplinar: A Metáfora.",
                scenario: "Vários profissionais de diferentes áreas tentam resolver um problema comunitário, mas cada um age sem consultar os demais, defendendo apenas a sua visão técnica.",
                text: "Na metáfora da orquestra, o que acontece no ecossistema quando cada área atua de forma isolada?",
                options: [
                    "Alcança-se o resultado estético ideal, a harmonia social perfeita.",
                    "Gera-se apenas ruído e sobreposição de esforços na intervenção.",
                    "A escuta empática da equipe é automaticamente maximizada.",
                    "Ocorre a captação mais rápida e eficiente de recursos financeiros."
                ],
                answer: "Gera-se apenas ruído e sobreposição de esforços na intervenção."
            },
            {
                id: 4,
                instruction: "Falha em Projetos Sociais.",
                scenario: "Uma ONG cria um projeto de reciclagem muito bem estruturado tecnicamente, mas a comunidade não o adere. Descobre-se que o projeto foi criado sem entender a rotina dos moradores.",
                text: "Segundo as dinâmicas da apresentação (PPT), por que projetos sociais costumam falhar?",
                options: [
                    "Pelo excesso de profissionais de tecnologia na equipe.",
                    "Quando não escutamos as vozes marginalizadas ao desenhar a solução.",
                    "Por excesso de recursos financeiros que desmotivam a equipe.",
                    "Por utilizarem demasiadamente a escuta empática em vez da lógica."
                ],
                answer: "Quando não escutamos as vozes marginalizadas ao desenhar a solução."
            },
            {
                id: 5,
                instruction: "Abordagem Multidisciplinar na Desnutrição.",
                scenario: "No combate à desnutrição infantil, diferentes áreas possuem papéis vitais e complementares. A equipe clínica está profundamente focada no bem-estar biológico das crianças.",
                text: "Qual é o papel específico da área da 'Saúde' neste ecossistema de solução (Tabela 1)?",
                options: [
                    "Desenvolver as plataformas de monitorização de dados.",
                    "Realizar o diagnóstico clínico, intervenção nutricional e apoio psicológico.",
                    "Fazer a captação de recursos e o planejamento logístico logístico da distribuição.",
                    "Desenhar as interfaces gráficas e garantir a acessibilidade do app."
                ],
                answer: "Realizar o diagnóstico clínico, intervenção nutricional e apoio psicológico."
            },
            {
                id: 6,
                instruction: "Abordagem Multidisciplinar na Desnutrição.",
                scenario: "O projeto de saúde precisa ganhar escala e facilitar o acompanhamento e o alerta de novos casos de desnutrição pela equipe de campo e pelas famílias.",
                text: "Qual o papel central reservado à área de 'Tecnologia', com base na matriz de articulação do material?",
                options: [
                    "Fazer o diagnóstico clínico e prescrever os suplementos infantis.",
                    "Realizar a gestão da equipe de campo e o pagamento de salários.",
                    "Cuidar do desenvolvimento de plataformas simplificadas de monitorização de dados e alertas.",
                    "Responsabilizar-se pela captação exclusiva de investidores e doadores."
                ],
                answer: "Cuidar do desenvolvimento de plataformas simplificadas de monitorização de dados e alertas."
            },
            {
                id: 7,
                instruction: "Abordagem Multidisciplinar na Desnutrição.",
                scenario: "A equipe de saúde já tem o diagnóstico detalhado e a tecnologia desenvolveu o aplicativo de monitoramento. Porém, faltam os suplementos físicos nos postos de atendimento por má organização.",
                text: "A qual área compete prioritariamente a viabilização operacional e logística dos suplementos?",
                options: [
                    "Tecnologia.",
                    "Saúde.",
                    "Administração.",
                    "Psicologia."
                ],
                answer: "Administração."
            },
            {
                id: 8,
                instruction: "Aplicação prática da escuta empática na Saúde.",
                scenario: "A médica percebe que uma mãe frequentemente não leva o filho às consultas de acompanhamento nutricional agendadas pelo sistema público.",
                text: "Ao aplicar a escuta empática, o que o profissional de saúde deve buscar compreender em vez de julgar?",
                options: [
                    "Se a falta advém do medo da estigmatização ou da simples falta de transporte.",
                    "Se a mãe possui conhecimentos avançados de programação para usar o app.",
                    "Se a clínica tem fundos administrativos suficientes para operar naquele dia.",
                    "Se a interface do sistema governamental tem uma paleta de cores atrativa."
                ],
                answer: "Se a falta advém do medo da estigmatização ou da simples falta de transporte."
            },
            {
                id: 9,
                instruction: "Literacia Digital e Empatia na Tecnologia.",
                scenario: "Um desenvolvedor precisa criar um sistema de notificação de saúde para moradores de uma comunidade vulnerável, onde muitos utilizam celulares antigos e têm dificuldade com leitura complexa.",
                text: "Como a escuta empática deve ser aplicada pela área de Tecnologia neste cenário?",
                options: [
                    "Criando algoritmos complexos e invisíveis que tomam decisões sem controle do usuário.",
                    "Desenhando interfaces acessíveis, considerando e respeitando as potenciais limitações na literacia digital.",
                    "Focando apenas em garantir que os servidores cloud tenham 100% de uptime.",
                    "Exigindo, através de pop-ups bloqueadores, que os usuários atualizem seus aparelhos."
                ],
                answer: "Desenhando interfaces acessíveis, considerando e respeitando as potenciais limitações na literacia digital."
            },
            {
                id: 10,
                instruction: "Natureza dos Desafios Sociais do Século XXI.",
                scenario: "Um gestor público tenta resolver a exclusão digital de uma cidade apenas comprando e distribuindo tablets, sem planejar o treinamento de professores ou prover internet nas escolas.",
                text: "Por que abordagens isoladas de uma única disciplina costumam falhar ao tentar resolver desafios contemporâneos?",
                options: [
                    "Porque necessitam exclusivamente da aprovação direta da equipe médica.",
                    "Porque os problemas sociais de hoje são por natureza multifacetados e interdependentes.",
                    "Porque a capacidade tecnológica atual global ainda é muito rudimentar.",
                    "Porque a escuta empática proíbe expressamente o uso de dispositivos tecnológicos."
                ],
                answer: "Porque os problemas sociais de hoje são por natureza multifacetados e interdependentes."
            },
            {
                id: 11,
                instruction: "Temática central do Roteiro.",
                scenario: "Você está preparando a apresentação de abertura para a oficina de soluções inovadoras usando os slides fornecidos (PPT).",
                text: "Qual é o título e o lema principal impresso no material visual apresentado?",
                options: [
                    "Da Empatia à Ação: Cocriando Soluções Socioambientais.",
                    "A Revolução das Redes: Marketing Digital e Presença.",
                    "Gestão de Crise Corporativa: Foco no Lucro.",
                    "Engenharia de Software e a Estética Minimalista."
                ],
                answer: "Da Empatia à Ação: Cocriando Soluções Socioambientais."
            },
            {
                id: 12,
                instruction: "Alinhamento de Conceitos.",
                scenario: "Na dinâmica de grupo, o facilitador pede aos participantes que observem um diagrama de Venn exibido no telão e pensem sobre como esses dois círculos se unem na prática diária.",
                text: "Quais são as duas palavras-chave que formam a interseção visual destacada neste diagrama?",
                options: [
                    "Teoria e Prática da Programação.",
                    "Propósito e Ação.",
                    "Saúde Pública e Tecnologia Privada.",
                    "Empatia e Receita Financeira."
                ],
                answer: "Propósito e Ação."
            },
            {
                id: 13,
                instruction: "A base oculta do iceberg.",
                scenario: "Um beneficiário recusa agressivamente a ajuda de um programa de capacitação. A 'ponta visível' do iceberg é a recusa vocal e a irritação.",
                text: "O que a base submersa desse iceberg frequentemente abriga e que precisa ser escutado?",
                options: [
                    "Apenas a documentação técnica preenchida incorretamente.",
                    "As métricas estatísticas de retorno sobre investimento (ROI).",
                    "Medos, inseguranças, fatores emocionais e barreiras socioeconômicas estruturais.",
                    "O planejamento de recursos humanos da organização não-governamental."
                ],
                answer: "Medos, inseguranças, fatores emocionais e barreiras socioeconômicas estruturais."
            },
            {
                id: 14,
                instruction: "Superando o isolamento profissional.",
                scenario: "Durante uma conferência, um painelista insiste de forma arrogante que a sua disciplina acadêmica isolada detém todas as chaves para salvar o meio ambiente.",
                text: "De acordo com a conclusão do artigo, quando nos tornamos verdadeiramente capazes de transformar realidades sociais de forma profunda?",
                options: [
                    "Quando passamos do isolamento profissional para a harmonia coletiva.",
                    "Quando uma área científica domina hierarquicamente e subjuga as demais opiniões.",
                    "Quando delegamos a resolução de problemas totalmente à Inteligência Artificial.",
                    "Quando abandonamos a escuta empática em favor da frieza absoluta dos dados."
                ],
                answer: "Quando passamos do isolamento profissional para a harmonia coletiva."
            },
            {
                id: 15,
                instruction: "A postura do Investigador Social.",
                scenario: "Uma assistente social nota que uma família afirma estar se alimentando bem para evitar repreensão, mas as crianças aparentam sinais de letargia aguda.",
                text: "Dominar a escuta empática exige atuar como um investigador social. O que isso possibilita na prática da intervenção?",
                options: [
                    "Julgar criminalmente as famílias em situação de vulnerabilidade com rapidez.",
                    "Ler as entrelinhas e validar emoções subjacentes, permitindo um diagnóstico verdadeiramente humanizado.",
                    "Preencher os relatórios quantitativos do governo com maior eficiência processual.",
                    "Reduzir drasticamente o tempo gasto nas conversas e visitas domiciliares."
                ],
                answer: "Ler as entrelinhas e validar emoções subjacentes, permitindo um diagnóstico verdadeiramente humanizado."
            },
            {
                id: 16,
                instruction: "Diversidade e Ação Interdisciplinar.",
                scenario: "Um slide exibe visualmente dezenas de ícones profissionais diferentes (engrenagens, estetoscópios, maletas) apontando para um círculo central vazio a ser preenchido pela audiência.",
                text: "Qual é a pergunta reflexiva central associada a este diagrama na apresentação?",
                options: [
                    "Qual destas profissões oferece a maior remuneração no mercado atual?",
                    "Como diferentes profissões podem colaborar para resolver um único problema social?",
                    "Como a automação fará com que essas funções se tornem obsoletas?",
                    "Qual é a melhor forma de competir financeiramente com outras disciplinas?"
                ],
                answer: "Como diferentes profissões podem colaborar para resolver um único problema social?"
            },
            {
                id: 17,
                instruction: "Escuta Empática Administrativa.",
                scenario: "Durante uma intervenção humanitária prolongada e estressante, médicos e enfermeiros começam a cometer pequenos erros devido à privação de sono e sobrecarga emocional.",
                text: "Segundo a matriz de ações, qual é a aplicação prática da escuta empática para o time de 'Administração' neste cenário crítico?",
                options: [
                    "Punir as falhas com cortes de salário para manter o rigor técnico.",
                    "Identificar proativamente sinais de exaustão (burnout) nos profissionais da linha de frente.",
                    "Dobrar a carga horária da equipe médica para compensar atrasos.",
                    "Redesenhar as interfaces do software hospitalar imediatamente."
                ],
                answer: "Identificar proativamente sinais de exaustão (burnout) nos profissionais da linha de frente."
            },
            {
                id: 18,
                instruction: "A sinergia do ecossistema.",
                scenario: "A tecnologia trouxe escala ao tratamento da desnutrição e a área da saúde aplicou o cuidado biológico necessário. Porém, sem processos sólidos, o fluxo não dura um mês.",
                text: "O que a área da Administração confere essencialmente a essa orquestra multidisciplinar de resolução de problemas?",
                options: [
                    "A sustentabilidade financeira e viabilidade operacional do ecossistema a longo prazo.",
                    "O diagnóstico laboratorial e o tratamento medicamentoso direto das crianças.",
                    "A arquitetura e ofuscação do código-fonte do banco de dados governamental.",
                    "O alinhamento estético entre o mundo real e a paleta de cores do sistema."
                ],
                answer: "A sustentabilidade financeira e viabilidade operacional do ecossistema a longo prazo."
            },
            {
                id: 19,
                instruction: "Surgimento de ideias e Brainstorming local.",
                scenario: "No decorrer da oficina, o mediador quer trazer o grande conceito global para a realidade palpável e imediata dos participantes do workshop.",
                text: "Qual destas perguntas provocativas consta no roteiro da apresentação em slides (PPT) para estimular ideias de impacto?",
                options: [
                    "Como podemos fundar uma multinacional de sucesso até o ano que vem?",
                    "Qual seria uma solução simples e barata para incentivar mais pessoas a separarem o lixo ou cuidarem da saúde mental na nossa comunidade?",
                    "Quem deve ser responsabilizado legalmente pelos danos ambientais do último século?",
                    "Como substituir o trabalho das ONGs locais por algoritmos complexos?"
                ],
                answer: "Qual seria uma solução simples e barata para incentivar mais pessoas a separarem o lixo ou cuidarem da saúde mental na nossa comunidade?"
            },
            {
                id: 20,
                instruction: "Reflexão de fechamento.",
                scenario: "O evento está terminando. A última tela roxa ilumina o ambiente e convida os presentes a uma interiorização sobre sua jornada como profissionais transformadores.",
                text: "O que o último slide de engajamento pede que o público expresse verbalmente ou mentalmente?",
                options: [
                    "Em uma palavra, como você se sente em relação ao seu poder de causar impacto positivo no mundo?",
                    "Qual foi a palestra mais lucrativa para os objetivos do seu negócio hoje?",
                    "Descreva em três parágrafos a falha do Modelo do Iceberg nas organizações não-governamentais.",
                    "Liste quais atalhos de teclado tornaram a experiência deste workshop mais célere."
                ],
                answer: "Em uma palavra, como você se sente em relação ao seu poder de causar impacto positivo no mundo?"
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
            await typeWriter(`Carregando Desafio ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Jornada concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Conceito compreendido e aplicado.";
                addLog("Sucesso: Visão empática e colaborativa demonstrada.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Desconexão dos princípios de colaboração.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Visão fragmentada. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade de articulação interdisciplinar e escuta empática.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de Escuta Empática e da Orquestra dos Saberes.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho e Empatia</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Colaboração Interdisciplinar</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos de escuta ativa, resolução de problemas complexos, e intersecção de saberes da Saúde, Administração e Tecnologia.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador de Empatia Interdisciplinar.
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Empatia_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando simulação de Colaboração e Empatia...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador Interdisciplinar v2.0...", "log-info");
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