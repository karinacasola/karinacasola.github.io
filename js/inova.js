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

        // --- Banco de Questões (30 Questões - Inovação e 6 Chapéus) ---
        const questions = ref([
            // --- 10 Questões sobre Inovação (Baseadas no material) ---
            {
                id: 1,
                instruction: "Conceito Prático de Inovação",
                scenario: "Sua equipe desenvolveu uma tecnologia brilhante, mas após o lançamento, ninguém quis comprar ou usar.",
                text: "De acordo com o conceito prático, isso pode ser considerado inovação?",
                options: [
                    "Não, pois inovação é a interseção exata entre a novidade (invenção) e a geração de valor (aplicação).",
                    "Sim, pois qualquer nova invenção tecnológica brilhante é considerada inovação.",
                    "Sim, a criatividade por si só basta para classificar o projeto como inovador.",
                    "Não, pois faltou incluir um novo modelo de negócio."
                ],
                answer: "Não, pois inovação é a interseção exata entre a novidade (invenção) e a geração de valor (aplicação).[cite: 1]"
            },
            {
                id: 2,
                instruction: "O que NÃO é Inovação",
                scenario: "Um colaborador está frustrado porque suas 'boas ideias' não foram consideradas inovações pela diretoria.",
                text: "Por que apenas ter boas ideias (criatividade) não é suficiente para inovar?",
                options: [
                    "Porque é preciso executá-las; criar algo novo sem utilidade prática não gera impacto.",
                    "Porque ideias precisam envolver tecnologia de ponta para serem validadas.",
                    "Porque inovação requer a criação de novos mercados invariavelmente.",
                    "Porque a criatividade atrapalha o ciclo de processos estruturados da empresa."
                ],
                answer: "Porque é preciso executá-las; criar algo novo sem utilidade prática não gera impacto.[cite: 1]"
            },
            {
                id: 3,
                instruction: "Tipos de Inovação",
                scenario: "Uma empresa de refrigerantes acaba de lançar um novo sabor de sua bebida mais famosa.",
                text: "Como esse tipo de inovação é classificado?",
                options: [
                    "Inovação Incremental, pois é a melhoria do que já existe.",
                    "Inovação Radical, pois revoluciona o mercado de bebidas.",
                    "Inovação Disruptiva, pois cria um novo mercado.",
                    "Inovação Aberta, pois depende da sociedade."
                ],
                answer: "Inovação Incremental, pois é a melhoria do que já existe.[cite: 1]"
            },
            {
                id: 4,
                instruction: "A Necessidade de Inovar",
                scenario: "O CEO decide que a empresa vai 'ficar parada', oferecendo o mesmo bom produto para sempre, pois ele já vende bem.",
                text: "Qual é a consequência dessa estagnação ao longo do tempo (Síndrome da Rainha Vermelha)?",
                options: [
                    "A empresa perde relevância e lucro, pois os produtos envelhecem, os concorrentes avançam e o comportamento muda.",
                    "A empresa mantém sua margem de lucro intacta por não gastar com pesquisa.",
                    "A empresa se torna líder de mercado pela estabilidade e padronização.",
                    "O mercado se adapta ao produto da empresa, reduzindo a necessidade de inovação."
                ],
                answer: "A empresa perde relevância e lucro, pois os produtos envelhecem, os concorrentes avançam e o comportamento muda.[cite: 1]"
            },
            {
                id: 5,
                instruction: "Entendendo o Mercado",
                scenario: "Você está tentando descobrir o que seu cliente quer construir para melhorar o seu produto.",
                text: "Em vez de perguntar o que o cliente quer, o que você deve observar utilizando o conceito de 'Jobs-to-be-done'?",
                options: [
                    "Qual 'trabalho' ele está contratando seu produto para fazer.",
                    "Quais são os dados demográficos desse cliente.",
                    "Qual é o orçamento anual que ele tem disponível.",
                    "Quais tecnologias ele mais admira."
                ],
                answer: "Qual 'trabalho' ele está contratando seu produto para fazer.[cite: 1]"
            },
            {
                id: 6,
                instruction: "Ecossistemas de Criação de Valor",
                scenario: "A empresa decidiu adotar a Inovação Aberta para não inovar sozinha de forma isolada.",
                text: "Nesse ecossistema compartilhado, qual é o papel esperado das Startups?",
                options: [
                    "Trazer agilidade.",
                    "Fornecer pesquisa básica acadêmica.",
                    "Criar leis e fomento.",
                    "Ser o mercado de consumo final."
                ],
                answer: "Trazer agilidade.[cite: 1]"
            },
            {
                id: 7,
                instruction: "Estratégias de Inovação",
                scenario: "A equipe vai iniciar um processo disciplinado de inovação utilizando o método apresentado.",
                text: "Qual é a primeira etapa (Passo 1) desse mapa estratégico?",
                options: [
                    "Empatia (Entender a dor).",
                    "Ideação (Gerar opções).",
                    "Prototipar (Fazer rápido).",
                    "Testar (Aprender)."
                ],
                answer: "Empatia (Entender a dor).[cite: 1]"
            },
            {
                id: 8,
                instruction: "O Segredo do Teste",
                scenario: "A equipe de inovação falhou em um teste de um novo serviço, mas gastou muito pouco e descobriu isso em duas semanas.",
                text: "Segundo as estratégias de inovação, como isso deve ser encarado?",
                options: [
                    "Como um aprendizado, seguindo o segredo: Erre rápido, erre barato, e escale o que funcionar!",
                    "Como um fracasso total que deve encerrar a cultura de inovação da empresa.",
                    "Como um erro de execução que exige a contratação de uma consultoria externa.",
                    "Como um sinal de que a etapa de ideação foi inútil."
                ],
                answer: "Como um aprendizado, seguindo o segredo: Erre rápido, erre barato, e escale o que funcionar![cite: 1]"
            },
            {
                id: 9,
                instruction: "Papel das Universidades no Ecossistema",
                scenario: "Sua empresa deseja criar uma rede de valor sustentável e busca parcerias com o setor acadêmico.",
                text: "Qual é a principal contribuição das Universidades no ecossistema de inovação?",
                options: [
                    "Pesquisa.",
                    "Agilidade e risco.",
                    "Consumo em massa.",
                    "Regulamentação governamental."
                ],
                answer: "Pesquisa.[cite: 1]"
            },
            {
                id: 10,
                instruction: "Análise do Cliente",
                scenario: "Durante uma pesquisa, o time está mapeando o que incomoda o cliente hoje.",
                text: "Na estrutura de análise do mercado, essa investigação se refere a qual pilar?",
                options: [
                    "Dores.",
                    "Desejos.",
                    "Jobs-to-be-done.",
                    "Ecossistemas."
                ],
                answer: "Dores.[cite: 1]"
            },
            
            // --- 20 Questões sobre os 6 Chapéus do Pensamento ---
            {
                id: 11,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: O projeto está atrasado. Um membro da equipe abre uma planilha e lista exatamente quantos dias faltam, o orçamento restante e as horas trabalhadas, sem emitir opiniões.",
                text: "Qual chapéu esse membro da equipe está utilizando?",
                options: [
                    "Chapéu Branco (Fatos e Dados).",
                    "Chapéu Vermelho (Emoções).",
                    "Chapéu Preto (Crítica).",
                    "Chapéu Verde (Criatividade)."
                ],
                answer: "Chapéu Branco (Fatos e Dados)."
            },
            {
                id: 12,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Uma nova tecnologia foi proposta. Alguém na mesa diz: 'Eu tenho um pressentimento ruim sobre isso. Não sinto que os clientes vão gostar, estou com medo de avançar.'",
                text: "Qual chapéu está sendo manifestado nesta fala?",
                options: [
                    "Chapéu Vermelho (Intuição e Emoção).",
                    "Chapéu Azul (Controle).",
                    "Chapéu Amarelo (Otimismo).",
                    "Chapéu Branco (Dados)."
                ],
                answer: "Chapéu Vermelho (Intuição e Emoção)."
            },
            {
                id: 13,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: A equipe sugere usar IA no atendimento. O gerente jurídico aponta os riscos de violação da LGPD e os possíveis processos judiciais caso ocorra vazamento.",
                text: "Qual chapéu do pensamento foca na cautela e identificação de riscos?",
                options: [
                    "Chapéu Preto (Crítica e Sobrevivência).",
                    "Chapéu Amarelo (Otimismo e Benefícios).",
                    "Chapéu Verde (Ideias Novas).",
                    "Chapéu Azul (Organização)."
                ],
                answer: "Chapéu Preto (Crítica e Sobrevivência)."
            },
            {
                id: 14,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: As vendas caíram. Um analista tenta animar o grupo dizendo: 'Isso é uma ótima oportunidade! Podemos aproveitar a queda para testar novos modelos de precificação e ganhar vantagem!'",
                text: "Essa visão focada no valor, benefícios e otimismo estruturado pertence a qual chapéu?",
                options: [
                    "Chapéu Amarelo (Otimismo e Valor).",
                    "Chapéu Vermelho (Emoções).",
                    "Chapéu Preto (Riscos).",
                    "Chapéu Branco (Informação)."
                ],
                answer: "Chapéu Amarelo (Otimismo e Valor)."
            },
            {
                id: 15,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: O produto atual é muito caro de produzir. A equipe faz um brainstorming e alguém sugere: 'E se alugarmos o produto em vez de vender? Ou trocarmos plástico por um biopolímero feito de fungos?'",
                text: "A geração de alternativas, criatividade e provocação são características de qual chapéu?",
                options: [
                    "Chapéu Verde (Criatividade e Alternativas).",
                    "Chapéu Azul (Facilitação).",
                    "Chapéu Branco (Fatos).",
                    "Chapéu Preto (Julgamento)."
                ],
                answer: "Chapéu Verde (Criatividade e Alternativas)."
            },
            {
                id: 16,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: A reunião está caótica, todos falando ao mesmo tempo. O líder intervém: 'Pessoal, vamos resumir o que temos até agora e dedicar os próximos 10 minutos apenas para identificar riscos.'",
                text: "O ato de gerenciar o processo de pensamento, resumir e organizar o tempo é papel de qual chapéu?",
                options: [
                    "Chapéu Azul (Controle e Gestão do Processo).",
                    "Chapéu Vermelho (Sentimentos).",
                    "Chapéu Amarelo (Benefícios).",
                    "Chapéu Verde (Ideação)."
                ],
                answer: "Chapéu Azul (Controle e Gestão do Processo)."
            },
            {
                id: 17,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Decisão sobre abrir uma nova filial. Uma diretora levanta um relatório com o número de habitantes locais, renda per capita e concorrência no raio de 5km.",
                text: "A busca e apresentação de informações neutras e objetivas reflete o uso do:",
                options: [
                    "Chapéu Branco.",
                    "Chapéu Preto.",
                    "Chapéu Amarelo.",
                    "Chapéu Vermelho."
                ],
                answer: "Chapéu Branco."
            },
            {
                id: 18,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: O lançamento fracassou. Alguém diz com raiva: 'Eu odeio essa nova interface, me sinto frustrado toda vez que tento usá-la!'",
                text: "Expressar sentimentos crus, sem a necessidade de justificativa lógica, pertence ao:",
                options: [
                    "Chapéu Vermelho.",
                    "Chapéu Verde.",
                    "Chapéu Azul.",
                    "Chapéu Branco."
                ],
                answer: "Chapéu Vermelho."
            },
            {
                id: 19,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Mudança para trabalho 100% remoto. O coordenador alerta: 'Isso pode diminuir o senso de pertencimento e criar gargalos na comunicação em projetos críticos.'",
                text: "Identificar falhas potenciais e motivos para algo não dar certo é o escopo do:",
                options: [
                    "Chapéu Preto.",
                    "Chapéu Amarelo.",
                    "Chapéu Branco.",
                    "Chapéu Verde."
                ],
                answer: "Chapéu Preto."
            },
            {
                id: 20,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: A empresa concorrente baixou os preços. A gerente diz: 'Se eles baixaram os preços, talvez a margem de lucro deles esteja estrangulada, o que nos dá a chance de focar na qualidade e virar a marca premium do setor.'",
                text: "Encontrar a lógica positiva construtiva e buscar oportunidades no cenário reflete o:",
                options: [
                    "Chapéu Amarelo.",
                    "Chapéu Preto.",
                    "Chapéu Vermelho.",
                    "Chapéu Azul."
                ],
                answer: "Chapéu Amarelo."
            },
            {
                id: 21,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Embalagens gerando muito lixo. Alguém joga a ideia absurda de 'fazer uma embalagem que pode ser comida após o uso'.",
                text: "O pensamento que permite ideias provocativas, fora da caixa e suspensão temporária do julgamento é o:",
                options: [
                    "Chapéu Verde.",
                    "Chapéu Branco.",
                    "Chapéu Preto.",
                    "Chapéu Azul."
                ],
                answer: "Chapéu Verde."
            },
            {
                id: 22,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Discussão paralisada sobre qual software comprar. O facilitador diz: 'Vamos parar de criticar (Chapéu Preto) e passar 5 minutos apenas gerando alternativas viáveis.'",
                text: "O facilitador assumiu a postura do pensar sobre o pensamento utilizando o:",
                options: [
                    "Chapéu Azul.",
                    "Chapéu Vermelho.",
                    "Chapéu Amarelo.",
                    "Chapéu Branco."
                ],
                answer: "Chapéu Azul."
            },
            {
                id: 23,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Avaliação de uma parceria. Você afirma: 'Temos 45% de market share na região Sul e o parceiro tem 30% na região Norte, somando teríamos cobertura de 75% do território nacional.'",
                text: "A constatação factual desse cenário é típica de qual chapéu?",
                options: [
                    "Chapéu Branco.",
                    "Chapéu Verde.",
                    "Chapéu Vermelho.",
                    "Chapéu Preto."
                ],
                answer: "Chapéu Branco."
            },
            {
                id: 24,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Contratação de um novo fornecedor. O diretor balança a cabeça e murmura: 'Minha intuição diz que eles não vão entregar no prazo, mesmo que o contrato seja bom.'",
                text: "Mesmo sem dados, ao usar o palpite e a intuição, o diretor 'vestiu' o:",
                options: [
                    "Chapéu Vermelho.",
                    "Chapéu Branco.",
                    "Chapéu Amarelo.",
                    "Chapéu Azul."
                ],
                answer: "Chapéu Vermelho."
            },
            {
                id: 25,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: O software recém-lançado apresentou bugs. O QA avisa: 'Se não revertermos a atualização hoje, o sistema de faturamento vai travar no final de semana.'",
                text: "O alerta para o perigo iminente e as consequências negativas lógicas representa o:",
                options: [
                    "Chapéu Preto.",
                    "Chapéu Verde.",
                    "Chapéu Amarelo.",
                    "Chapéu Vermelho."
                ],
                answer: "Chapéu Preto."
            },
            {
                id: 26,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Crise financeira. A diretoria avisa: 'Temos um fluxo de caixa estável para 6 meses, e essa pausa nos permite treinar a equipe para quando o mercado reaquecer.'",
                text: "A abordagem focada na viabilidade, esperança sustentada e benefícios lógicos é o:",
                options: [
                    "Chapéu Amarelo.",
                    "Chapéu Preto.",
                    "Chapéu Azul.",
                    "Chapéu Branco."
                ],
                answer: "Chapéu Amarelo."
            },
            {
                id: 27,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Melhoria da experiência do cliente. Um designer sugere 'gamificar' a fila de espera do atendimento, dando pontos a quem tiver paciência.",
                text: "Essa sugestão lateral e criativa nasce do pensamento sob o:",
                options: [
                    "Chapéu Verde.",
                    "Chapéu Vermelho.",
                    "Chapéu Branco.",
                    "Chapéu Preto."
                ],
                answer: "Chapéu Verde."
            },
            {
                id: 28,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: A reunião chegou ao final do tempo programado. Um membro elabora uma síntese: 'As informações mostraram X, sentimos Y, os riscos são Z. A decisão final é aguardar.'",
                text: "A definição de conclusões e o fechamento do raciocínio global são papéis do:",
                options: [
                    "Chapéu Azul.",
                    "Chapéu Amarelo.",
                    "Chapéu Verde.",
                    "Chapéu Vermelho."
                ],
                answer: "Chapéu Azul."
            },
            {
                id: 29,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: Antes de aprovar uma campanha, a equipe faz a pergunta crítica: 'Quais informações estão faltando para tomarmos essa decisão com segurança?'",
                text: "O ato de identificar as lacunas de informação e o que precisa ser descoberto é feito sob a ótica do:",
                options: [
                    "Chapéu Branco.",
                    "Chapéu Verde.",
                    "Chapéu Vermelho.",
                    "Chapéu Amarelo."
                ],
                answer: "Chapéu Branco."
            },
            {
                id: 30,
                instruction: "Análise de Cenário - 6 Chapéus",
                scenario: "Problema: A equipe está analisando os riscos apontados na rodada anterior. Para contrabalancear, alguém diz: 'Isso é difícil de fazer, mas se der certo, o retorno financeiro cobrirá todos os custos em um ano.'",
                text: "A superação de uma dificuldade apontada (Chapéu Preto) através de uma lógica de benefício pertence ao:",
                options: [
                    "Chapéu Amarelo.",
                    "Chapéu Verde.",
                    "Chapéu Vermelho.",
                    "Chapéu Azul."
                ],
                answer: "Chapéu Amarelo."
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
            
            let performanceMsg = "Excelente compreensão dos fundamentos de Inovação e dos 6 Chapéus do Pensamento.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos de Inovação e perfis analíticos.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Análise e Inovação</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Resolução de Problemas Complexos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo fundamentos práticos de inovação e aplicações situacionais dos 6 Chapéus do Pensamento de Edward de Bono.</p>
                    
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
                filename:     `Inovacao_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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