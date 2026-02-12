const { createApp } = Vue;

createApp({
    data() {
        return {
            // Estado inicial do projeto
            stats: {
                quality: 70,     // Saúde do código
                docs: 50,        // Documentação disponível
                tests: 50,       // Cobertura de testes
                maintenance: 80  // Facilidade de manutenção (vs Dívida Técnica)
            },
            day: 1,
            maxDays: 20, // Meta: Lançar a versão 1.0 no dia 20
            
            gameActive: true,
            gameWon: false,
            gameOverReason: "",
            
            // Texto explicativo que aparece após uma ação
            lastActionExplanation: "",
            
            // Histórico simples para exportação
            logs: []
        }
    },
    computed: {
        // Lógica de Pontuação Final
        finalScore() {
            // Média dos status
            const avgStats = (this.stats.quality + this.stats.docs + this.stats.tests + this.stats.maintenance) / 4;
            // Bônus por dias sobrevividos
            const dayBonus = this.day * 15;
            // Cálculo final
            return Math.floor(avgStats * 6 + dayBonus);
        },
        
        // --- MENTOR VIRTUAL INTELIGENTE ---
        // Analisa o estado atual e sugere a melhor ação
        advisorTip() {
            if (!this.gameActive) return "Simulação finalizada. Verifique o relatório.";

            const lowest = this.getLowestStat();
            
            // Dica de Reta Final
            if (this.day >= this.maxDays - 3) {
                return "Estamos na reta final (Release Candidate)! Mantenha todos os status acima de 30% para o lançamento.";
            }

            // Dicas baseadas em problemas críticos (< 40%)
            if (lowest.val <= 40) {
                switch(lowest.key) {
                    case 'quality': 
                        return "⚠️ ALERTA: O código está 'espaguete'. A equipe está demorando para entender a lógica. Refatore agora!";
                    case 'docs': 
                        return "⚠️ ALERTA: 'Bus Factor' crítico. Se um desenvolvedor sair, o conhecimento se perde. Escreva documentação!";
                    case 'tests': 
                        return "⚠️ ALERTA: O sistema está instável. Bugs regressivos estão aparecendo. Aumente a cobertura de testes.";
                    case 'maintenance': 
                        return "⚠️ ALERTA: O cliente está furioso com bugs em produção. Faça correções urgentes (Hotfix), mesmo que gere dívida técnica.";
                }
            }

            // Dicas gerais de equilíbrio
            return "O projeto está estável. Tente equilibrar Qualidade e Testes para garantir sustentabilidade a longo prazo.";
        }
    },
    methods: {
        // Retorna cor baseada na porcentagem (Verde, Amarelo, Vermelho)
        getBarColor(value) {
            if (value > 60) return '#4CAF50'; 
            if (value > 30) return '#FFC107'; 
            return '#F44336'; 
        },

        // Acha o status mais baixo para gerar alertas
        getLowestStat() {
            let keys = Object.keys(this.stats);
            let minKey = keys[0];
            let minVal = this.stats[keys[0]];
            keys.forEach(key => {
                if (this.stats[key] < minVal) {
                    minVal = this.stats[key];
                    minKey = key;
                }
            });
            return { key: minKey, val: minVal };
        },

        // --- LÓGICA PRINCIPAL DAS AÇÕES ---
        performAction(action) {
            if (!this.gameActive) return;

            // 1. Entropia do Software: Tudo piora um pouco a cada dia se não cuidado
            const entropy = 3;
            this.stats.quality -= entropy;
            this.stats.docs -= entropy;
            this.stats.tests -= entropy;
            this.stats.maintenance -= entropy;

            const boost = 25; // Quanto a ação melhora o foco principal
            const cost = 10;  // Custo de oportunidade (Trade-off)

            switch(action) {
                case 'refactor':
                    this.stats.quality += boost;
                    this.stats.maintenance -= cost;
                    this.lastActionExplanation = "♻️ Refatoração: Você limpou o código e reduziu a complexidade. Isso facilita futuras alterações, mas consumiu tempo que poderia ser usado corrigindo bugs atuais.";
                    break;
                case 'docs':
                    this.stats.docs += boost;
                    this.stats.tests -= cost;
                    this.lastActionExplanation = "📝 Documentação: O conhecimento foi registrado na Wiki. A equipe agora trabalha mais rápido, mas deixamos de escrever novos testes automatizados hoje.";
                    break;
                case 'test':
                    this.stats.tests += boost;
                    this.stats.quality += 5; // Testes ajudam levemente a qualidade
                    this.stats.docs -= cost;
                    this.lastActionExplanation = "🛡️ Testes Automatizados: Criamos uma rede de segurança. O deploy é mais seguro, mas a documentação ficou desatualizada com as novas mudanças.";
                    break;
                case 'fix':
                    this.stats.maintenance += boost;
                    this.stats.quality -= cost;
                    this.lastActionExplanation = "🚑 Hotfix: Bug corrigido em produção! O cliente está feliz, mas a solução foi uma 'gambiarra' rápida que piorou a qualidade interna do código.";
                    break;
            }

            // 2. Normalização (Impede que passe de 100 ou caia de 0)
            Object.keys(this.stats).forEach(key => {
                if (this.stats[key] > 100) this.stats[key] = 100;
                if (this.stats[key] < 0) this.stats[key] = 0;
            });

            // 3. Registrar Log
            this.logs.push({
                day: this.day,
                action: action,
                result: this.lastActionExplanation
            });

            // 4. Avançar dia e checar status
            this.day++;
            this.checkGameStatus();
        },

        checkGameStatus() {
            // Condição de Derrota (Falência do Projeto)
            // Se qualquer atributo chegar a 0, o projeto morre.
            const lowest = this.getLowestStat().val;
            
            if (lowest <= 0) {
                this.endGame(false, "FALÊNCIA DO PROJETO: Um dos pilares essenciais chegou a 0%. O sistema tornou-se insustentável e foi cancelado pela diretoria.");
                return;
            }

            // Condição de Fim de Prazo (Lançamento V1.0)
            if (this.day > this.maxDays) {
                // Para vencer, nenhum status pode estar "Crítico" (abaixo de 30)
                if (lowest >= 30) {
                    this.endGame(true, "SUCESSO! Você gerenciou os trade-offs e lançou a Versão 1.0 com um sistema estável e confiável.");
                } else {
                    this.endGame(false, "LANÇAMENTO FRACASSADO: O prazo acabou, mas o software estava instável demais (alguns status críticos). O lançamento foi abortado.");
                }
            }
        },

        endGame(won, reason) {
            this.gameActive = false;
            this.gameWon = won;
            this.gameOverReason = reason;
            this.advisorTip = won ? "Missão Cumprida! O projeto é um sucesso." : "Projeto Cancelado.";
        },

        resetGame() {
            this.stats = { quality: 70, docs: 50, tests: 50, maintenance: 80 };
            this.day = 1;
            this.gameActive = true;
            this.gameWon = false;
            this.lastActionExplanation = "";
            this.logs = [];
        },

        // Função de Exportar JSON (Relatório)
        exportData() {
            const projectData = {
                meta: {
                    simulation: "Project Pet Simulator",
                    date: new Date().toLocaleString(),
                    outcome: this.gameWon ? "VITÓRIA" : "DERROTA",
                    finalScore: this.finalScore,
                    reason: this.gameOverReason
                },
                finalStats: this.stats,
                actionHistory: this.logs
            };
            
            const jsonString = JSON.stringify(projectData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_projeto_${this.gameWon ? 'sucesso' : 'falha'}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
}).mount('#app');