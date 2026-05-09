const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const database = [
            { 
                text: "INVENTARIO", 
                hint: "Mapeamento detalhado e atualizado de todos os ativos de TI de uma organização. É a base para o planejamento.",
                explanation: "O Inventário Técnico lista todo o hardware, software, licenças e topologia que a empresa possui, apoiando decisões de implantação."
            },
            { 
                text: "HARDWARE", 
                hint: "Componentes físicos, como servidores (ex: Xeon) e discos, que processam e armazenam os dados da infraestrutura.",
                explanation: "É um dos três pilares da infraestrutura de TI, totalmente essencial para suportar a carga de trabalho de um novo sistema."
            },
            { 
                text: "REDES", 
                hint: "A infraestrutura de comunicação, como switches e roteadores, que permite a troca de dados entre os componentes.",
                explanation: "Garante que a comunicação funcione. Em nosso caso de uso, uma largura de banda como um link de 10mbps atende esse pilar."
            },
            { 
                text: "SEGURANCA", 
                hint: "Mecanismos físicos e lógicos, como firewalls e backups, responsáveis por proteger os dados corporativos.",
                explanation: "A Segurança é o terceiro pilar da infra TI, englobando a redundância de discos e defesa de perímetro de rede."
            },
            { 
                text: "ESPELHAMENTO", 
                hint: "Técnica de segurança em que dois discos gravam a mesma informação simultaneamente para evitar perda de dados.",
                explanation: "Conhecido também como RAID 1, garante que se um disco falhar, o sistema continua rodando perfeitamente no outro."
            },
            { 
                text: "PLANEJAR", 
                hint: "No método de gestão, é a etapa (Plan) que define o que será mapeado, como verificar se o link de internet atende os requisitos.",
                explanation: "A primeira etapa do ciclo PDCA (Planejar) é crucial para definir os requisitos do inventário e os objetivos da implantação antes da execução."
            },
            { 
                text: "CORRETIVA", 
                hint: "Tipo de manutenção reativa que atua somente quando a falha já ocorreu (ex: o servidor parou, o sistema caiu).",
                explanation: "É o tipo de manutenção menos desejada devido à parada não programada e ao seu alto custo de recuperação."
            },
            { 
                text: "PREVENTIVA", 
                hint: "Manutenção que ocorre em períodos e cronogramas específicos, como limpeza física e aplicação de patches de segurança.",
                explanation: "Tem o objetivo de evitar falhas de hardware ou vulnerabilidades lógicas executando revisões programadas."
            },
            { 
                text: "PREDITIVA", 
                hint: "Manutenção baseada em monitoramento de software. Troca-se um componente preventivamente porque os dados apontam o fim de sua vida útil.",
                explanation: "Softwares indicam quando uma peça vai falhar (como um disco degradando no RAID 1), permitindo a troca antes da quebra."
            },
            { 
                text: "ADAPTATIVA", 
                hint: "Tipo de manutenção que modifica o sistema para se adequar a uma nova realidade de negócio, ambiente ou mudança na legislação.",
                explanation: "Exemplo claro é ter que migrar a infraestrutura local inteira para a Nuvem devido a uma nova demanda operacional."
            },
            { 
                text: "ESTRESSE", 
                hint: "Estilo de teste de validação onde se simulam inúmeros acessos simultâneos para ter certeza que a rede suporta o tráfego.",
                explanation: "Aplica-se uma alta carga forçada para provar que requisitos mínimos, como a banda de 10mbps, vão aguentar em produção."
            },
            { 
                text: "HOMOLOGACAO", 
                hint: "Ambiente e teste onde o usuário final utiliza o novo sistema para validar se a entrega está de acordo antes do lançamento oficial.",
                explanation: "Também associado ao termo UAT (User Acceptance Testing), onde o cliente assina o aceite técnico atestando a usabilidade."
            },
            { 
                text: "TREINAMENTO", 
                hint: "Ação de capacitação exigida sempre que um novo servidor ou sistema muda a forma como a equipe de trabalho atua no dia a dia.",
                explanation: "Sempre que a rotina de comunicação ou as ferramentas mudam após uma implantação, é obrigatório reciclar e capacitar a equipe."
            },
            { 
                text: "ATIVOS", 
                hint: "Nome genérico dado aos bens lógicos e físicos de TI que compõem o Inventário Técnico e a infraestrutura de uma organização.",
                explanation: "O mapeamento detalhado de todos os 'ativos de TI' é a espinha dorsal de um banco de dados de gerenciamento de configuração (CMDB)."
            },
            { 
                text: "TOPOLOGIA", 
                hint: "Documentação em formato de desenho técnico que mostra como a rede, os roteadores e os servidores estão interligados.",
                explanation: "Além do registro em planilhas, a Topologia é essencial no inventário para visualizarmos a arquitetura física e lógica da rede."
            },
            { 
                text: "INVESTIMENTO", 
                hint: "Na análise financeira, as Despesas de Capital (CAPEX) são usadas para a compra inicial de bens físicos, também chamadas de...",
                explanation: "O CAPEX cobre a aquisição de equipamentos permanentes (como Servidores Xeon e licenças de software), sofrendo depreciação."
            },
            { 
                text: "RECORRENTE", 
                hint: "Diferente de comprar uma máquina, pagar a conta mensal de energia e da internet gera um custo operacional e contínuo. Um custo...",
                explanation: "Essas despesas são chamadas de OPEX. Elas entram mensalmente no fluxo de caixa para manter a infraestrutura rodando."
            },
            { 
                text: "PROPRIEDADE", 
                hint: "O Custo Total de ______ (TCO) soma os gastos de aquisição com todos os gastos mensais ao longo dos anos do sistema.",
                explanation: "Calcular o Custo Total de Propriedade ajuda a ver o 'iceberg'. Às vezes a máquina é barata, mas consome tanta energia que sai mais cara a longo prazo."
            },
            { 
                text: "CAPACIDADE", 
                hint: "Planejamento (Capacity Planning) usado para projetar o crescimento futuro do sistema baseando-se no cálculo de usuários e tráfego.",
                explanation: "É uma projeção matemática vital no Levantamento Técnico para dimensionar o hardware de forma que o sistema não engasgue amanhã."
            },
            { 
                text: "AUDITORIA", 
                hint: "Na fase de validação de dados, é a inspeção física feita indo até o Rack para olhar os cabos e etiquetas, comprovando se a planilha está certa.",
                explanation: "A Auditoria Física cruza a documentação do inventário com o cenário real (visual), detectando possíveis discrepâncias."
            }
        ];

        const currentPuzzle = ref({});
        const guessedLetters = ref([]);
        const mistakes = ref(0);
        const score = ref(0);
        const maxMistakes = 6;
        
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U'],
            ['I', 'O', 'P', 'A', 'S', 'D', 'F'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X'],
            ['C', 'V', 'B', 'N', 'M']
        ];

        const gallowsFrames = [
            `  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========`, 
            `  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========` 
        ];

        const currentAsciiArt = computed(() => gallowsFrames[mistakes.value]);

        const displayedWordGroups = computed(() => {
            if (!currentPuzzle.value.text) return [];
            return currentPuzzle.value.text.split(' ').map(word => {
                return word.split('').map(char => {
                    if (guessedLetters.value.includes(char) || mistakes.value >= maxMistakes) {
                        return char;
                    }
                    return '-';
                });
            });
        });

        const gameOver = computed(() => mistakes.value >= maxMistakes);
        const victory = computed(() => {
            if (!currentPuzzle.value.text) return false;
            const lettersOnly = currentPuzzle.value.text.replace(/ /g, '').split('');
            return lettersOnly.every(char => guessedLetters.value.includes(char));
        });

        const initGame = () => {
            let newPuzzle;
            do {
                newPuzzle = database[Math.floor(Math.random() * database.length)];
            } while (currentPuzzle.value.text === newPuzzle.text && database.length > 1);

            currentPuzzle.value = newPuzzle;
            guessedLetters.value = [];
            mistakes.value = 0;
        };

        const guessLetter = (letter) => {
            if (gameOver.value || victory.value || guessedLetters.value.includes(letter)) return;
            guessedLetters.value.push(letter);
            if (!currentPuzzle.value.text.includes(letter)) {
                mistakes.value++;
            }
            if (victory.value) {
                score.value++;
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }
        };

        const getKeyClass = (key) => {
            if (!guessedLetters.value.includes(key)) return '';
            if (currentPuzzle.value.text.includes(key)) return 'correct';
            return 'wrong';
        };
        
        const handleKeyPress = (e) => {
            const char = e.key.toUpperCase();
            const isValid = keyboardLayout.some(row => row.includes(char));
            if (isValid) guessLetter(char);
        };

        onMounted(() => {
            initGame();
            window.addEventListener('keydown', handleKeyPress);
        });

        return {
            currentPuzzle, displayedWordGroups, guessedLetters, mistakes, score,
            currentAsciiArt, gameOver, victory, keyboardLayout, guessLetter, getKeyClass, initGame
        };
    }
}).mount('#app');