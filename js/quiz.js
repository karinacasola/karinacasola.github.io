const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        const questions = ref([
            {
                text: "No 'Motor da Empregabilidade', qual é a função da 'Última Engrenagem' (A Comunicação/Entrevista)?",
                options: [
                    "Tirar você da dúvida.",
                    "Tornar você visível para os recrutadores.",
                    "Provar o histórico profissional no papel.",
                    "Provar quem você é e decidir se você entra e fica."
                ],
                correctAnswer: 3,
                explanation: "O motor consiste em: Decidir, Posicionar e Comunicar. O Currículo abre a oportunidade, mas a Entrevista prova a pessoa e decide se você é O ESCOLHIDO. [cite: 34, 35, 90]"
            },
            {
                text: "Qual é a principal consequência comportamental de aceitar 'a vaga que sobra' (Desalinhamento)?",
                options: [
                    "Quebra do viés de confirmação.",
                    "Comunicação insegura, adotando um modo de defesa.",
                    "Antecipação das perguntas do recrutador.",
                    "Foco na Jornada do Herói corporativa."
                ],
                correctAnswer: 1,
                explanation: "Quando você busca a vaga que sobra (desalinhamento), o sintoma direto é uma comunicação insegura, agindo em um modo de defesa. [cite: 21, 22, 23, 24]"
            },
            {
                text: "Quais são as três etapas da atividade prática 'Do Papel para a Fala'?",
                options: [
                    "Desconstruir, Adaptar, Distribuir.",
                    "Decidir, Posicionar, Comunicar.",
                    "Mapear, Destilar, Humanizar.",
                    "Contexto, Conflito, Resultado."
                ],
                correctAnswer: 2,
                explanation: "A atividade prática exige: 1. Mapear a experiência; 2. Destilar em tópicos curtos; 3. Humanizar adicionando a perspectiva pessoal. [cite: 39, 42, 46]"
            },
            {
                text: "Qual é a 'Regra de Ouro' apontada para o momento de preparar os tópicos de fala para a entrevista?",
                options: [
                    "Escreva para ler, garantindo que não esquecerá nenhuma métrica.",
                    "Foque apenas nos resultados técnicos, omitindo o contexto.",
                    "Escreva para falar, não para ler.",
                    "Invente um desafio se a experiência não for forte o suficiente."
                ],
                correctAnswer: 2,
                explanation: "A regra de ouro ao passar do papel para a fala é: 'Escreva para falar, não para ler', garantindo naturalidade. [cite: 48]"
            },
            {
                text: "Por que, segundo o material, o famoso 'branco' acontece na hora H da entrevista?",
                options: [
                    "Porque o candidato está buscando a vaga alinhada.",
                    "Devido à alta carga cognitiva do recrutador.",
                    "Porque falta uma estrutura STAR no currículo.",
                    "Porque você não treinou."
                ],
                correctAnswer: 3,
                explanation: "O momento em que a maioria congela e o branco acontece ocorre fundamentalmente porque o candidato não treinou a musculatura da fala. [cite: 49, 50, 51]"
            },
            {
                text: "Em relação à confiança para falar em entrevistas, o material afirma que:",
                options: [
                    "A confiança é o pré-requisito para começar a praticar.",
                    "É preciso esperar estar totalmente pronto para ter confiança.",
                    "A confiança não é o pré-requisito, é o resultado da prática.",
                    "A confiança depende exclusivamente do layout do currículo."
                ],
                correctAnswer: 2,
                explanation: "Esperar estar pronto é uma ilusão. A confiança não é um pré-requisito para começar; ela é o resultado da prática constante. [cite: 54, 58, 59]"
            },
            {
                text: "Ao utilizar Engenharia de Prompts (Prompt 1), por que é necessário desconstruir a vaga para extrair palavras-chave?",
                options: [
                    "Para burlar os testes psicológicos da empresa.",
                    "Porque recrutadores escaneiam perfis em segundos e essas palavras ativam 'gatilhos neurais' de sucesso.",
                    "Para criar um currículo mais longo e detalhado.",
                    "Para esconder a falta de experiência do candidato."
                ],
                correctAnswer: 1,
                explanation: "Devido à carga cognitiva, recrutadores escaneiam perfis. O uso das palavras-chave exatas aciona gatilhos neurais que a empresa usa para definir 'sucesso'. [cite: 110, 111]"
            },
            {
                text: "No ajuste do currículo (Prompt 2), qual é o erro mais comum que a IA ajuda a corrigir?",
                options: [
                    "Focar em impacto (o que mudou) em vez de listar tarefas (o que fez).",
                    "Listar responsabilidades (o que fez) em vez de impacto e resultado.",
                    "Escrever o currículo apenas em tópicos longos.",
                    "Manter a experiência real intacta."
                ],
                correctAnswer: 1,
                explanation: "O maior erro é listar tarefas e responsabilidades. A correção exige mudar o foco de 'tarefas' para 'impacto', usando métricas como prova social. [cite: 120, 121, 123]"
            },
            {
                text: "Sobre o uso da Inteligência Artificial no posicionamento profissional, qual é a postura inegociável?",
                options: [
                    "A IA pode inventar competências se a vaga exigir muito.",
                    "A IA deve focar no dialeto técnico, ignorando a narrativa humana.",
                    "A IA deve traduzir seu histórico para o dialeto da empresa, mas nunca inventar.",
                    "A IA deve ser usada apenas para otimizar o LinkedIn."
                ],
                correctAnswer: 2,
                explanation: "O foco na verdade é essencial. A IA deve traduzir o histórico, mas a congruência técnica é inegociável; nunca se deve inventar. [cite: 124, 125, 159]"
            },
            {
                text: "Na auditoria de LinkedIn (Prompt 3), por que o título profissional deve ir além do cargo atual?",
                options: [
                    "Porque o LinkedIn penaliza títulos muito curtos.",
                    "Para garantir que o algoritmo exiba o perfil na seção de notícias.",
                    "Porque o LinkedIn é um motor de busca e o título deve mostrar a 'solução que você entrega'.",
                    "Para manter o perfil invisível até que esteja perfeitamente estruturado."
                ],
                correctAnswer: 2,
                explanation: "Sendo o LinkedIn um motor de busca, um 'SEO fraco' deixa o perfil invisível. O título não deve ser apenas o cargo, mas a solução entregue. [cite: 131, 135]"
            },
            {
                text: "Como as 'Respostas Estruturadas' (Jornada do Herói Corporativa) ajudam na entrevista?",
                options: [
                    "Permitem responder de forma genérica a qualquer pergunta.",
                    "Prendem a atenção do entrevistador por seguirem uma arquitetura natural de narrativa.",
                    "Diminuem o tempo da entrevista pela metade.",
                    "Eliminam a necessidade de conhecimento técnico."
                ],
                correctAnswer: 1,
                explanation: "Respostas estruturadas (Contexto → Conflito → Ação → Resultado) prendem a atenção do entrevistador porque seguem a arquitetura natural de uma boa narrativa. [cite: 145, 146]"
            },
            {
                text: "Qual é o conceito de 'Conhecimento Modular' no preparo para entrevistas (Prompt 4)?",
                options: [
                    "Separar o currículo em módulos visuais.",
                    "Estudar apenas os módulos técnicos da vaga.",
                    "Tratar experiências como notas interligadas que podem responder a perguntas diversas (ex: liderança, conflitos).",
                    "Usar módulos de software para simular a entrevista."
                ],
                correctAnswer: 2,
                explanation: "O conhecimento modular trata suas experiências como notas interligadas; uma mesma história passada pode responder a várias perguntas diferentes. [cite: 144]"
            },
            {
                text: "Por que é fundamental usar a IA para fazer uma 'Auditoria de Pontos Cegos' (Prompt 5)?",
                options: [
                    "Para quebrar o viés de confirmação, pois temos dificuldade de ler nossos textos de forma crítica.",
                    "Para confirmar que o currículo não precisa de alterações.",
                    "Apenas para encontrar erros ortográficos básicos.",
                    "Para diminuir a visibilidade estratégica no mercado."
                ],
                correctAnswer: 0,
                explanation: "Essa auditoria é vital para a 'quebra do viés de confirmação' e para estruturar uma defesa antecipada contra falhas que o recrutador apontaria. [cite: 152, 153]"
            },
            {
                text: "O que significa adotar uma 'Postura Antifrágil' no treinamento com IA?",
                options: [
                    "Evitar a todo custo simulações de entrevista difíceis.",
                    "Ocultar os pontos fracos do currículo.",
                    "Enfrentar o desconforto de ver as próprias falhas na simulação para evitar a dor da rejeição real.",
                    "Desistir do processo ao menor sinal de erro."
                ],
                correctAnswer: 2,
                explanation: "A postura antifrágil baseia-se no princípio de que o desconforto de ver as próprias falhas simuladas por uma máquina evita a dor da rejeição real. [cite: 154]"
            },
            {
                text: "Na tabela 'Síntese do Processo', qual é o foco principal da etapa de Distribuição (LinkedIn)?",
                options: [
                    "Palavras-chave e Gatilhos.",
                    "Estrutura STAR.",
                    "SEO e Título Estratégico.",
                    "Impacto e Prova Social."
                ],
                correctAnswer: 2,
                explanation: "Na fase 3 (Distribuição), o objetivo é rankear no LinkedIn, tendo como foco de otimização o 'SEO e Título Estratégico'. [cite: 157]"
            },
            {
                text: "Qual é o conceito central sobre o Posicionamento Profissional abordado na conclusão?",
                options: [
                    "Posicionar-se é criar uma persona diferente da sua realidade para ser aceito.",
                    "É sobre diminuir o atrito entre o que você sabe fazer e como o mercado percebe seu valor.",
                    "Trata-se de inventar competências para passar nos filtros automáticos.",
                    "É garantir que o currículo seja o único documento avaliado no processo."
                ],
                correctAnswer: 1,
                explanation: "O conceito central define que posicionamento profissional não é inventar competências, mas diminuir o atrito entre o que você sabe e a percepção de valor do mercado. [cite: 159]"
            },
            {
                text: "Durante a 'Arena de Simulação' (teste de musculatura da fala), o que 'Quem Fala' NÃO deve fazer?",
                options: [
                    "Ler as anotações em voz alta.",
                    "Testar a musculatura da fala.",
                    "Parar caso cometa um erro.",
                    "Cronometrar 10 minutos."
                ],
                correctAnswer: 2,
                explanation: "As regras da Arena para 'Quem fala' são explícitas: 'Não pare se errar'. A ideia é manter a fluidez e testar a musculatura. [cite: 63, 65, 66]"
            },
            {
                text: "Qual é a missão prática proposta no 'Desafio Final (Microação)'?",
                options: [
                    "Fazer um post longo no LinkedIn.",
                    "Gravar um vídeo de exatos 60 segundos resumindo objetivo e força maior.",
                    "Enviar o currículo para 10 empresas diferentes.",
                    "Reescrever o objetivo profissional no papel."
                ],
                correctAnswer: 1,
                explanation: "A missão final exige sair da sala, ir para a câmera (REC) e gravar um vídeo de exatos 60 segundos resumindo seu objetivo profissional e maior força. [cite: 79, 80, 83, 84]"
            },
            {
                text: "O que a Masterclass enfatiza sobre o papel da 'Voz' na etapa final de seleção?",
                options: [
                    "A voz deve repetir mecanicamente o currículo.",
                    "A voz prova a pessoa, tornando o candidato 'O Escolhido'.",
                    "A voz é avaliada apenas se o currículo estiver ausente.",
                    "A voz serve unicamente para ler as tarefas executadas."
                ],
                correctAnswer: 1,
                explanation: "O material traça um paralelo claro: o papel (currículo) prova o histórico, mas a voz (entrevista) prova a pessoa, sendo a etapa onde a decisão final é tomada. [cite: 31, 35, 90]"
            },
            {
                text: "Como o material visualiza a entrevista em relação à sua trajetória?",
                options: [
                    "Como um interrogatório formal.",
                    "Como uma leitura guiada do currículo.",
                    "Como a sua melhor história sendo contada ao vivo.",
                    "Como um teste exclusivamente de conhecimento técnico."
                ],
                correctAnswer: 2,
                explanation: "A conclusão é poética e direta: 'A entrevista não é um interrogatório. É a sua melhor história sendo contada ao vivo.' [cite: 92]"
            }
        ]);

        const currentQuestionIndex = ref(0);
        const selectedOption = ref(null);
        const attemptsLeft = ref(3);
        const showExplanation = ref(false);
        const score = ref(0);
        const quizFinished = ref(false);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        const checkAnswer = () => {
            if (selectedOption.value === null) return;

            const correct = currentQuestion.value.correctAnswer;

            if (selectedOption.value === correct) {
                // Acertou
                score.value++;
                showExplanation.value = true;
            } else {
                // Errou
                attemptsLeft.value--;
                if (attemptsLeft.value <= 0) {
                    showExplanation.value = true;
                } else {
                    // Desmarca para forçar nova escolha, se desejar (opcional, aqui mantemos selecionado para ele ver o erro)
                }
            }
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                selectedOption.value = null;
                attemptsLeft.value = 3;
                showExplanation.value = false;
            } else {
                quizFinished.value = true;
            }
        };

        const resetQuiz = () => {
            currentQuestionIndex.value = 0;
            selectedOption.value = null;
            attemptsLeft.value = 3;
            showExplanation.value = false;
            score.value = 0;
            quizFinished.value = false;
        };

        const exportToPDF = () => {
            const element = document.getElementById('pdf-export-area');
            const opt = {
                margin:       1,
                filename:     'relatorio_posicionamento_ia.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, backgroundColor: '#111111' }, // Fundo dark do card
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            
            // html2pdf está disponível via CDN no HTML
            html2pdf().set(opt).from(element).save();
        };

        return {
            questions,
            currentQuestionIndex,
            currentQuestion,
            selectedOption,
            attemptsLeft,
            showExplanation,
            score,
            quizFinished,
            progressPercentage,
            checkAnswer,
            nextQuestion,
            resetQuiz,
            exportToPDF
        };
    }
}).mount('#quiz-app');