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

        // --- Banco de Questões (20 Questões de Teoria dos Grafos) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Conceitos Fundamentais de Grafos.",
                scenario: "Redes sociais, rotas de GPS e circuitos de internet possuem uma estrutura matemática comum.",
                text: "Matematicamente, qual é a definição de um Grafo G = (V, E)?",
                options: [
                    "Um conjunto de vetores direcionados com magnitude escalar.",
                    "Um conjunto de Vértices (V) e um conjunto de Arestas (E).",
                    "Uma matriz identidade com determinantes não nulos.",
                    "Um sistema de equações lineares de múltiplas variáveis."
                ],
                answer: "Um conjunto de Vértices (V) e um conjunto de Arestas (E).",
                explanation: "Um grafo G = (V, E) consiste essencialmente em um conjunto de Vértices (Nós, que representam objetos) e um conjunto de Arestas (Links, que representam a relação entre esses objetos)."
            },
            {
                id: 2,
                instruction: "Grafo Completo (Matemática).",
                scenario: "Você precisa conectar todos os 4 computadores de uma sala diretamente entre si.",
                text: "Quantas arestas existem em um grafo completo K4?",
                options: [
                    "4 arestas",
                    "8 arestas",
                    "6 arestas",
                    "12 arestas"
                ],
                answer: "6 arestas",
                explanation: "Em um grafo completo, todos os nós se conectam a todos os outros. A fórmula matemática para calcular as arestas é n(n-1)/2. Para n=4, temos 4(3)/2 = 6 arestas."
            },
            {
                id: 3,
                instruction: "Grafo Bipartido.",
                scenario: "Um algoritmo da Netflix precisa recomendar filmes. O conjunto U tem usuários e o conjunto V tem filmes.",
                text: "O que caracteriza um grafo Bipartido nesse cenário?",
                options: [
                    "Usuários podem se conectar com usuários, mas filmes não se conectam com filmes.",
                    "Todas as arestas ligam obrigatoriamente um nó de U a um nó de V, sem conexões internas no mesmo conjunto.",
                    "O número de nós no conjunto U deve ser exatamente igual ao do conjunto V.",
                    "Ele possui ciclos de comprimento ímpar."
                ],
                answer: "Todas as arestas ligam obrigatoriamente um nó de U a um nó de V, sem conexões internas no mesmo conjunto.",
                explanation: "Um grafo é bipartido se seus vértices puderem ser divididos em dois conjuntos distintos, de forma que nenhuma aresta conecte nós do mesmo conjunto."
            },
            {
                id: 4,
                instruction: "Matriz de Adjacência.",
                scenario: "Você está traduzindo o mapa de uma rede simples para o computador através de uma matriz quadrada.",
                text: "Por que a diagonal principal da matriz de adjacência de um grafo simples é preenchida com zeros?",
                options: [
                    "Porque não existem conexões com peso zero na rede.",
                    "Porque o determinante da matriz deve ser nulo.",
                    "Porque em um grafo simples não existem laços (loops) de um nó para ele mesmo.",
                    "Para facilitar o escalonamento de Gauss-Jordan."
                ],
                answer: "Porque em um grafo simples não existem laços (loops) de um nó para ele mesmo.",
                explanation: "A diagonal é 0 porque, em um grafo simples, um nó não cria um 'loop' ligando-se a ele mesmo; ele só se liga aos seus vizinhos."
            },
            {
                id: 5,
                instruction: "Matriz de Incidência.",
                scenario: "Diferente da Matriz de Adjacência, a Matriz de Incidência mapeia a relação direta entre Nós e Arestas.",
                text: "Como as linhas e colunas são estruturadas numa Matriz de Incidência?",
                options: [
                    "Linhas representam Arestas e Colunas representam Pesos.",
                    "Linhas representam os Nós e Colunas representam as Arestas.",
                    "Ambas (linhas e colunas) representam Nós.",
                    "Linhas representam a direção e Colunas representam os Nós."
                ],
                answer: "Linhas representam os Nós e Colunas representam as Arestas.",
                explanation: "Na técnica de mapeamento de Incidência, as linhas do matriz representam os vértices (Nós) e as colunas representam os links (Arestas)."
            },
            {
                id: 6,
                instruction: "Lema do Aperto de Mãos (Conceito).",
                scenario: "Um cientista de dados está validando a consistência de uma rede complexa extraída da web.",
                text: "Segundo o Lema do Aperto de Mãos, o que acontece se somarmos todos os graus dos vértices de um grafo?",
                options: [
                    "O resultado será igual ao número total de nós.",
                    "O resultado será sempre um número ímpar.",
                    "O resultado será igual a 2 vezes o total de Arestas.",
                    "O resultado será o peso mínimo de um caminho hamiltoniano."
                ],
                answer: "O resultado será igual a 2 vezes o total de Arestas.",
                explanation: "A soma dos graus de todos os vértices é igual ao dobro do número de arestas (2 * |E|), pois cada aresta conecta duas extremidades matemáticas."
            },
            {
                id: 7,
                instruction: "Lema do Aperto de Mãos (Cálculo).",
                scenario: "Um grafo possui 5 vértices com os seguintes graus: 2, 3, 3, 2 e 2.",
                text: "Aplicando o Lema do Aperto de Mãos, quantas arestas no total esse grafo possui?",
                options: [
                    "6 arestas",
                    "12 arestas",
                    "5 arestas",
                    "24 arestas"
                ],
                answer: "6 arestas",
                explanation: "Primeiro, somamos os graus: 2 + 3 + 3 + 2 + 2 = 12. Pelo Lema, a soma dos graus é o dobro das arestas, logo Arestas = 12 / 2 = 6."
            },
            {
                id: 8,
                instruction: "Algoritmo de Dijkstra (Características).",
                scenario: "O Google Maps precisa recalcular rapidamente uma rota quando você erra a rua.",
                text: "Por que o Algoritmo de Dijkstra é classificado como um algoritmo 'Guloso' (Greedy)?",
                options: [
                    "Porque ele consome muita memória RAM ao gerar as matrizes.",
                    "Porque ele visita todos os caminhos possíveis antes de decidir o melhor.",
                    "Porque ele toma a melhor decisão imediata a cada passo (menor custo no momento).",
                    "Porque ele processa apenas caminhos eulerianos."
                ],
                answer: "Porque ele toma a melhor decisão imediata a cada passo (menor custo no momento).",
                explanation: "É chamado de guloso porque escolhe sempre visitar o nó vizinho que tenha o menor custo imediato no momento de sua avaliação."
            },
            {
                id: 9,
                instruction: "Algoritmo de Dijkstra (Processamento).",
                scenario: "Para descobrir a rota mais rápida, o código de programação não consegue 'olhar' o desenho do grafo na tela.",
                text: "Qual estrutura de dados o Algoritmo de Dijkstra lê para processar a malha de rotas?",
                options: [
                    "Apenas listas de vetores de peso infinito.",
                    "A Matriz de Adjacência do grafo.",
                    "A renderização em pixels da imagem topológica.",
                    "A matriz identidade de determinantes."
                ],
                answer: "A Matriz de Adjacência do grafo.",
                explanation: "O algoritmo é 'cego' para desenhos geométricos. Ele processa a topologia lendo as posições (Linha i, Coluna j) preenchidas com custos temporais/pesos na Matriz de Adjacência."
            },
            {
                id: 10,
                instruction: "Otimização de Redes Sociais.",
                scenario: "O Facebook possui bilhões de usuários (nós).",
                text: "Por que o Facebook usa 'Listas de Adjacência' em vez de 'Matrizes de Adjacência' para mapear amizades?",
                options: [
                    "Porque matrizes não aceitam dígrafos direcionados.",
                    "Para evitar o gasto incalculável de memória com os zeros inúteis (pessoas que não são suas amigas).",
                    "Porque Listas suportam cálculos de determinantes de forma nativa.",
                    "Porque Listas forçam a rede a se tornar um Grafo Completo."
                ],
                answer: "Para evitar o gasto incalculável de memória com os zeros inúteis (pessoas que não são suas amigas).",
                explanation: "Uma matriz de 3 bilhões x 3 bilhões gastaria memória gigantesca registrando zeros ('0s'). A lista otimiza o sistema salvando unicamente as conexões reais (os '1s')."
            },
            {
                id: 11,
                instruction: "Tipos de Movimento: Passeio, Trilha e Caminho.",
                scenario: "Ao analisar a navegação de um pacote de rede, percebe-se que ele passou pelos nós: A -> B -> D -> A.",
                text: "Este trajeto repetiu o vértice A, mas não repetiu nenhuma aresta. Como ele é formalmente chamado?",
                options: [
                    "Passeio (Walk)",
                    "Trilha (Trail)",
                    "Caminho (Path)",
                    "Ciclo Hamiltoniano"
                ],
                answer: "Trilha (Trail)",
                explanation: "Trilha (Trail) é definida matematicamente como um passeio no qual nenhuma aresta é repetida, embora os vértices possam se repetir."
            },
            {
                id: 12,
                instruction: "Classificação Estrutural: Multigrafo.",
                scenario: "Um sistema de aviação modela cidades como vértices. Entre São Paulo e Nova York, existem 3 rotas diretas (voos de companhias diferentes).",
                text: "Qual estrutura permite essa multiplicidade de arestas entre os mesmos vértices?",
                options: [
                    "Grafo Simples",
                    "Grafo Bipartido",
                    "Multigrafo",
                    "Dígrafo Isolado"
                ],
                answer: "Multigrafo",
                explanation: "Diferente do Grafo Simples, o Multigrafo permite a existência de arestas paralelas conectando o exato mesmo par de vértices."
            },
            {
                id: 13,
                instruction: "Classificação Estrutural: Pseudografo.",
                scenario: "Uma máquina de estados finitos pode permanecer no mesmo estado atual se um evento recursivo ocorrer.",
                text: "Se um grafo possui um 'laço' (loop) ligando um nó a si mesmo, ele é classificado como:",
                options: [
                    "Árvore Genealógica",
                    "Pseudografo",
                    "Grafo Completo (Kn)",
                    "Matriz Assimétrica"
                ],
                answer: "Pseudografo",
                explanation: "O Pseudografo é a estrutura mais permissiva, contendo não apenas arestas paralelas, mas explicitamente permitindo Laços (Loops) em um vértice."
            },
            {
                id: 14,
                instruction: "Dígrafos (Grafos Direcionados).",
                scenario: "No Twitter (X), se o usuário A segue o usuário B, B não é obrigado a seguir A de volta.",
                text: "Essa assimetria causa qual reflexo na Matriz de Adjacência do Dígrafo?",
                options: [
                    "A matriz se torna estritamente simétrica (A = A^T).",
                    "A matriz passa a ter apenas o valor de peso 1.",
                    "A matriz perde a simetria, pois a aresta (u, v) não garante a volta (v, u).",
                    "A diagonal principal passa a conter valores infinitos."
                ],
                answer: "A matriz perde a simetria, pois a aresta (u, v) não garante a volta (v, u).",
                explanation: "Como a existência do arco de ida não garante a existência do arco de volta, a matriz de adjacência torna-se assimétrica em grafos direcionados."
            },
            {
                id: 15,
                instruction: "Abordagem Euleriana (Caminho).",
                scenario: "Um caminhão de limpeza precisa passar por todas as ruas (arestas) de um bairro exatamente uma vez, podendo terminar em um local diferente de onde começou.",
                text: "Teoricamente, qual é a condição exata para que um grafo admita esse Caminho Euleriano?",
                options: [
                    "Todos os vértices devem possuir grau par.",
                    "O grafo deve possuir exatamente dois vértices de grau ímpar.",
                    "A soma dos graus deve ser divisível por 3.",
                    "Não pode conter matrizes assimétricas."
                ],
                answer: "O grafo deve possuir exatamente dois vértices de grau ímpar.",
                explanation: "Um grafo conexo admite um Caminho Euleriano (trajeto aberto) se, e somente se, possui exatamente dois vértices de grau ímpar, que servirão como a origem e o destino da rota."
            },
            {
                id: 16,
                instruction: "Abordagem Euleriana (Circuito).",
                scenario: "O desafio original das Sete Pontes de Königsberg exigia que o passeio começasse e terminasse na mesma margem.",
                text: "O que exige a matemática para que exista um Circuito Euleriano fechado num grafo?",
                options: [
                    "O grafo não deve ter mais do que 7 arestas.",
                    "A matriz deve ser obrigatoriamente um multigrafo.",
                    "Todos os seus vértices devem possuir grau par.",
                    "O caminho precisa seguir a ordem de uma trilha sem nós isolados."
                ],
                answer: "Todos os seus vértices devem possuir grau par.",
                explanation: "O circuito Euleriano exige um fluxo de entrada e saída contínuo em cada ponto de parada; portanto, funciona se, e somente se, absolutamente todos os vértices possuírem grau par."
            },
            {
                id: 17,
                instruction: "Foco nos Vértices (Problemas Hamiltonianos).",
                scenario: "Um motorista precisa entregar mercadorias em todos os clientes. Não importa cruzar todas as ruas, o foco é chegar a todos os destinos.",
                text: "O Problema do Caixeiro Viajante (TSP) procura o caminho mais eficiente sob qual regra computacional NP-Completa?",
                options: [
                    "Grafo Ponderado sem direcionamento matricial.",
                    "Caminho Euleriano Finito.",
                    "Ciclo Hamiltoniano (visitar todos os vértices exatamente uma vez).",
                    "Pesquisa gulosa com Lema do Aperto de Mãos."
                ],
                answer: "Ciclo Hamiltoniano (visitar todos os vértices exatamente uma vez).",
                explanation: "A abordagem Hamiltoniana foca nos nós (destinos), buscando visitar todos os vértices uma única vez. Determinar o ciclo mais eficiente nesse cenário gera o Problema NP-completo do Caixeiro Viajante."
            },
            {
                id: 18,
                instruction: "Propriedades Visuais x Algoritmo.",
                scenario: "A estrutura do ciclo pentagonal (C5) tem 5 vértices formados num anel contínuo.",
                text: "Por que o ciclo C5 não pode ser considerado um Grafo Bipartido?",
                options: [
                    "Porque ele possui um número ímpar de arestas e não consegue criar um circuito de Euler.",
                    "Porque ele não é um dígrafo orientado.",
                    "Porque ele contém um ciclo de comprimento ímpar, o que gera um conflito de coloração.",
                    "Porque grafos bipartidos exigem o formato de matriz triangular para escalonamento."
                ],
                answer: "Porque ele contém um ciclo de comprimento ímpar, o que gera um conflito de coloração.",
                explanation: "Um grafo só é bipartido se não contém ciclos de comprimento ímpar. Tentar colorir um pentágono (C5) alternando duas cores causa choque no último nó, exigindo uma terceira cor."
            },
            {
                id: 19,
                instruction: "Identificação de Extremos.",
                scenario: "No modelamento de uma rede P2P (Peer-to-Peer), um terminal desconectou fisicamente do roteador.",
                text: "O que define estruturalmente um 'Vértice Isolado' no estudo de grafos?",
                options: [
                    "Um vértice com laços paralelos (grau infinito).",
                    "Um vértice que possui grau exato de 0.",
                    "Um vértice onde apenas setas de saída existem (fonte).",
                    "Um nó que forma o centro estrito de um grafo K3."
                ],
                answer: "Um vértice que possui grau exato de 0.",
                explanation: "Na topologia do grafo, um vértice isolado é aquele desprovido de qualquer ligação, ou seja, não possui arestas vinculadas a ele, configurando Grau 0."
            },
            {
                id: 20,
                instruction: "Grafos Ponderados x Não-Ponderados.",
                scenario: "Ao sair do GPS para modelagem genérica, retiramos a métrica de 'trânsito/tempo'.",
                text: "Em um grafo Não-Ponderado Simples, a matriz de adjacência é preenchida apenas com os valores 0 ou 1. O que representa o número '1'?",
                options: [
                    "Representa que o vértice está isolado do grafo.",
                    "O custo exato de viajar pela aresta entre os vértices.",
                    "O tamanho do caminho euleriano.",
                    "A simples existência formal de uma aresta entre dois nós."
                ],
                answer: "A simples existência formal de uma aresta entre dois nós.",
                explanation: "Na matriz de Adjacência pura (não ponderada), a marcação 1 sinaliza presença binária (a rua/aresta existe) e o 0 significa ausência (não há conexão direta)."
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
                }, 10);
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Carregando Desafio Topológico ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Processamento Estrutural concluído. Emitindo log de rotas...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                addLog("Sucesso: Roteamento Lógico Correto.", "log-success");
                showAnswer.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    addLog("Falha: Estouro de limite computacional.", "log-error");
                    showAnswer.value = true; 
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Rota Inválida. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Conexão Incorreta. Loop ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade analítica estrutural em modelagem de redes e matrizes.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada em topologia de redes, matrizes e regras de conectividade.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório do Simulador Lógico</h1>
                    <h2 style="color: #555; margin: 5px 0;">Algoritmos e Estruturas de Grafos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do usuário pelas ${questions.value.length} operações críticas envolvendo vértices, caminhos (Euler/Hamilton), algoritmos de busca (Dijkstra) e matrizes topológicas.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho no Roteamento</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento processado via kernel GRAPH.SIMULATOR
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `TeoriaDosGrafos_Log_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando malha de grafos...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando GRAPH_KERNEL_v2.0...", "log-info");
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
            nextQuestion,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');