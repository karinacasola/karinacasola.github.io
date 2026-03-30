const { createApp, ref, computed, onMounted } = Vue;

// Gerador dinâmico de 50 níveis sem os "spoilers" (Sintoma, Diagnóstico, etc.)
const generateLevels = () => {
    const industries = [
        { name: "Varejo", context: "rede de supermercados", product: "produtos nas prateleiras" },
        { name: "Indústria", context: "fábrica de peças", product: "linha de montagem" },
        { name: "Serviços", context: "empresa de consultoria", product: "projetos de clientes" },
        { name: "Saúde", context: "hospital de grande porte", product: "atendimento a pacientes" },
        { name: "Tecnologia", context: "startup de software", product: "plataforma digital" }
    ];

    const themes = [
        { name: "Estratégia (Bússola)", comp: "Estratégia", impact: "Sem direcionamento claro, os demais setores (instrumentos) tocam fora do ritmo esperado.", sol: "Redefinir os objetivos globais e comunicar a visão para todos os níveis." },
        { name: "Pessoas (Cérebro)", comp: "Pessoas", impact: "Colaboradores desengajados atuam como músicos desatentos, prejudicando a execução da partitura.", sol: "Implementar ações de gestão para engajar e capacitar as equipes na operação." },
        { name: "Tecnologia (Músculos)", comp: "Tecnologia", impact: "A limitação tecnológica reduz a força de execução, gerando gargalos nos processos.", sol: "Investir em infraestrutura tecnológica como elemento habilitador da eficiência." },
        { name: "Estrutura (Esqueleto)", comp: "Estrutura", impact: "Uma estrutura excessivamente centralizada causa lentidão e perda de oportunidades.", sol: "Revisar graficamente o organograma e descentralizar as decisões operacionais." },
        { name: "Processos (Veias)", comp: "Processos", impact: "A ausência de uma sequência otimizada impede que os insumos se transformem em valor de forma fluida.", sol: "Realizar a modelagem de atividades para mapear gargalos e redesenhar o fluxo." },
        { name: "Financeiro (Coração)", comp: "Financeiro", impact: "A incapacidade de bombear recursos financeiros causa a falência múltipla dos subsistemas operacionais.", sol: "Equilibrar a entrada e saída de capital para sustentar os outros departamentos." },
        { name: "Produção (Sistema Digestivo)", comp: "Produção", impact: "Falhas na transformação de insumos sobrecarregam o financeiro e frustram o cliente final.", sol: "Otimizar a conversão de recursos para garantir que o sistema gere resultados úteis." },
        { name: "Marketing (A Voz)", comp: "Marketing", impact: "A ausência de comunicação com o mundo externo isola o sistema aberto do seu ecossistema.", sol: "Ativar os canais de comunicação alinhados aos produtos disponíveis em estoque." },
        { name: "Desalinhamento Sistêmico", comp: "Interdependência", impact: "Subsistemas trabalhando de forma isolada e sem comunicação destroem o valor gerado pelo organismo como um todo.", sol: "Integrar a capacidade comercial com a capacidade real de produção e entrega." },
        { name: "A Orquestra Desafinada", comp: "Integração Global", impact: "A excelência isolada de um instrumento não salva a sinfonia se todos não seguirem a mesma partitura.", sol: "Colocar a Estratégia como Maestro para alinhar os objetivos individuais ao sucesso global." }
    ];

    let levels = [];
    let idCounter = 1;

    themes.forEach(theme => {
        industries.forEach(ind => {
            levels.push({
                id: idCounter++,
                feature: `Diagnóstico Sistêmico: Setor de ${ind.name}`,
                scenarioName: `Análise Prática na ${ind.context}`,
                correctOrder: [
                    // A ordem lógica agora deve ser deduzida pelo aluno pela leitura de causa e efeito:
                    `A organização enfrenta problemas críticos que afetam diretamente a entrega e gestão de ${ind.product}.`,
                    `A raiz dessa falha encontra-se especificamente no componente de ${theme.comp}.`,
                    `${theme.impact}`,
                    `${theme.sol}`
                ],
                explanation: `Conceito: A empresa é um sistema aberto. O componente de ${theme.name} é vital. Problemas nele exigem uma análise holística, pois alterações em um subsistema impactam os demais.`
            });
        });
    });

    return levels;
};

createApp({
    setup() {
        const levels = ref(generateLevels());
        const currentLevelIndex = ref(0);
        const userLines = ref([]); 
        const isChecked = ref(false); 
        const isLevelCorrect = ref(false);
        const userHistory = ref([]); 
        const gameFinished = ref(false);
        const attempts = ref(0);
        const maxAttempts = 3;
        const feedbackMessage = ref('');
        const feedbackType = ref('');
        const isShaking = ref(false);
        const showExplanation = ref(false);
        
        const draggingIndex = ref(null);
        const dragOverIndex = ref(null);

        const playErrorSound = () => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            } catch (e) { console.warn("Audio API unsupported"); }
        };

        const currentLevel = computed(() => levels.value[currentLevelIndex.value]);
        const progressPercentage = computed(() => (currentLevelIndex.value / levels.value.length) * 100);
        const correctCount = computed(() => userHistory.value.filter(h => h.isCorrect).length);

        const shuffleArray = (array) => {
            const newArr = [...array];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            if (newArr.length > 1 && JSON.stringify(newArr) === JSON.stringify(array)) {
                return shuffleArray(array);
            }
            return newArr;
        };

        const loadLevel = () => {
            isChecked.value = false;
            isLevelCorrect.value = false;
            attempts.value = 0;
            feedbackMessage.value = '';
            feedbackType.value = '';
            showExplanation.value = false;
            draggingIndex.value = null;
            dragOverIndex.value = null;
        
            const shuffled = shuffleArray(currentLevel.value.correctOrder);
            userLines.value = shuffled.map((text, idx) => ({
                id: `line-${currentLevel.value.id}-${idx}`, 
                text: text
            }));
        };

        const dragStart = (evt, index) => {
            if(isChecked.value) return;
            draggingIndex.value = index;
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.setData('text/plain', index);
            setTimeout(() => { if(evt.target) evt.target.classList.add('dragging'); }, 0);
        };

        const dragEnter = (index) => {
            if (index !== draggingIndex.value) dragOverIndex.value = index;
        };

        const dragEnd = (evt) => {
            if(evt.target) evt.target.classList.remove('dragging');
            dragOverIndex.value = null;
            draggingIndex.value = null;
        };

        const drop = (index) => {
            dragOverIndex.value = null;
            if(isChecked.value || draggingIndex.value === null) return;
            
            const dragIdx = draggingIndex.value;
            if (dragIdx === index) return;

            const newLines = [...userLines.value];
            const itemToMove = newLines[dragIdx];
            newLines.splice(dragIdx, 1);
            newLines.splice(index, 0, itemToMove);
            userLines.value = newLines;
            
            draggingIndex.value = null;
        };

        const checkAnswer = () => {
            const currentOrder = userLines.value.map(l => l.text);
            const correctOrder = currentLevel.value.correctOrder;
            const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
            
            attempts.value++;

            if (isCorrect) {
                isLevelCorrect.value = true;
                isChecked.value = true;
                showExplanation.value = true;
                feedbackMessage.value = '<i class="bi bi-check-lg"></i> Lógica de diagnóstico perfeitamente alinhada!';
                feedbackType.value = 'success';
                salvarHistorico(true);
            } else {
                isShaking.value = true;
                playErrorSound();
                setTimeout(() => { isShaking.value = false; }, 400);

                if (attempts.value < maxAttempts) {
                    const chancesLeft = maxAttempts - attempts.value;
                    const palavraChance = chancesLeft === 1 ? 'chance' : 'chances';
                    feedbackMessage.value = `<i class="bi bi-exclamation-triangle"></i> Ordem cronológica incorreta. Você tem mais <strong>${chancesLeft} ${palavraChance}</strong>.`;
                    feedbackType.value = 'error';
                } else {
                    isLevelCorrect.value = false;
                    isChecked.value = true; 
                    showExplanation.value = true;
                    feedbackMessage.value = '<i class="bi bi-x-circle-fill"></i> Suas chances acabaram! Observe a dedução correta abaixo.';
                    feedbackType.value = 'error';
                    
                    userLines.value = correctOrder.map((text, idx) => ({
                        id: `resolved-${currentLevel.value.id}-${idx}`,
                        text: text
                    }));
                    salvarHistorico(false);
                }
            }
        };

        const salvarHistorico = (isCorrect) => {
            const existingEntry = userHistory.value.find(h => h.levelId === currentLevel.value.id);
            if (!existingEntry) {
                userHistory.value.push({
                    levelId: currentLevel.value.id,
                    scenario: currentLevel.value.scenarioName,
                    isCorrect: isCorrect
                });
            }
        };

        const nextLevel = () => {
            if (currentLevelIndex.value < levels.value.length - 1) {
                currentLevelIndex.value++;
                loadLevel();
            } else {
                gameFinished.value = true;
            }
        };

        const resetGame = () => {
            currentLevelIndex.value = 0;
            userHistory.value = [];
            gameFinished.value = false;
            loadLevel();
        };

        const exportPDF = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.setTextColor(59, 130, 246);
            doc.text("Relatório de Diagnóstico: Arquitetura Empresarial", 15, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(80, 80, 80);
            doc.text(`Total de Acertos: ${correctCount.value} de ${levels.value.length}`, 15, 30);
            doc.text("Histórico por Caso:", 15, 40);
            
            let y = 50;
            userHistory.value.forEach((item) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                const status = item.isCorrect ? "[X] SUCESSO" : "[ ] FALHA";
                doc.setFontSize(10);
                doc.setTextColor(item.isCorrect ? 16 : 239, item.isCorrect ? 185 : 68, item.isCorrect ? 129 : 68);
                doc.text(`${status} - ${item.scenario}`, 15, y);
                y += 10;
            });
            
            doc.save(`relatorio_arquitetura_empresarial_${new Date().getTime()}.pdf`);
        };

        onMounted(() => {
            loadLevel();
        });

        return {
            levels, currentLevelIndex, currentLevel, userLines, isChecked, isLevelCorrect,
            progressPercentage, correctCount, gameFinished, attempts, feedbackMessage, feedbackType,
            isShaking, showExplanation,
            dragStart, dragEnter, dragEnd, drop, dragOverIndex,
            checkAnswer, nextLevel, exportPDF, resetGame
        };
    }
}).mount('#app');