const { createApp } = Vue;

const INITIAL_CODE = 
`public class FolhaPagamento {
    public static void main(String[] args) {
        
        // Dados dos funcionários
        String[] funcionarios = ["Alice", "Bruno", "Carla", "Diego", "Elena"];
        String[] departamentos = {"TI", "RH", "TI", "Vendas", "RH"};
        
        // ERRO: Preste atenção no tipo de dado
        int salarioBase = 3000.50;
        double totalFolha = 0.0;
        
        int[] horasExtras = {10, 0, 5, 20, 2};
        int[] faltas = {0, 2, 0, 1, 0};
        
        System.out.println("--- PROCESSAMENTO DE FOLHA ---");
        
        // ERRO: Cuidado com os limites do Array
        for (int i = 1; i <= funcionarios.length; i++) {
            
            String nome = funcionarios[i];
            String depto = departamentos[i];
            double salarioBruto = salarioBase;
            
            // ERRO: Como comparamos textos (Strings) em Java?
            if (depto == "TI") {
                salarioBruto += 500.0; // Bônus Tech
            }
            
            // ERRO: O que falta para o Switch não executar os debaixo?
            switch(depto) {
                case "Vendas":
                    salarioBruto += 300.0; // Comissão
                case "RH":
                    salarioBruto += 150.0; // Auxílio
            }
            
            // ERRO: Isso é uma comparação ou uma atribuição?
            if (faltas[i] = 0) {
                salarioBruto += 100.0; // Prêmio assiduidade
            } else {
                double descontoFalta = (salarioBruto / 30) * faltas[i];
                salarioBruto -= descontoFalta;
            }
            
            // ERRO: Compilador vai reclamar no final dessa linha
            double valorHoraExtra = horasExtras[i] * 45.5
            salarioBruto += valorHoraExtra;
            
            // ERRO: Divisão de inteiros no Java resulta em número truncado!
            double bonusAnual = salarioBruto * (5 / 100);
            salarioBruto += bonusAnual;
            
            // ERRO: Escopo de variável. Declarada no IF, usada fora?
            if (salarioBruto > 2500.0) {
                double imposto = salarioBruto * 0.15;
            } else {
                double imposto = salarioBruto * 0.05;
            }
            double salarioLiquido = salarioBruto - imposto;
            
            // ERRO: Letra maiúscula no lugar errado
            System.out.printLn("Funcionário: " + nome + " | Líquido: R$ " + salarioLiquido);
            
            // TODO: A variável 'totalFolha' deve acumular a soma de todos os 'salarioLiquido'.
            // Implemente a soma abaixo:
            
        }
        
        System.out.println("Total da Folha Pago: R$ " + totalFolha);
    }
}`;

const CORRECT_CODE = 
`public class FolhaPagamento {
    public static void main(String[] args) {
        
        // CORREÇÃO 1: Arrays inicializados com {}
        String[] funcionarios = {"Alice", "Bruno", "Carla", "Diego", "Elena"};
        String[] departamentos = {"TI", "RH", "TI", "Vendas", "RH"};
        
        // CORREÇÃO 2: salarioBase usa casas decimais, logo precisa ser double
        double salarioBase = 3000.50;
        double totalFolha = 0.0;
        
        int[] horasExtras = {10, 0, 5, 20, 2};
        int[] faltas = {0, 2, 0, 1, 0};
        
        System.out.println("--- PROCESSAMENTO DE FOLHA ---");
        
        // CORREÇÃO 3: Array em Java começa no índice 0 e vai até < length
        for (int i = 0; i < funcionarios.length; i++) {
            
            String nome = funcionarios[i];
            String depto = departamentos[i];
            double salarioBruto = salarioBase;
            
            // CORREÇÃO 4: Comparação de Strings se faz com .equals()
            if (depto.equals("TI")) {
                salarioBruto += 500.0;
            }
            
            switch(depto) {
                case "Vendas":
                    salarioBruto += 300.0;
                    break; // CORREÇÃO 5: Inserção do break para parar o switch
                case "RH":
                    salarioBruto += 150.0;
                    break; 
            }
            
            // CORREÇÃO 6: Comparação de igualdade exige ==
            if (faltas[i] == 0) {
                salarioBruto += 100.0; 
            } else {
                double descontoFalta = (salarioBruto / 30) * faltas[i];
                salarioBruto -= descontoFalta;
            }
            
            // CORREÇÃO 7: Inserção do ponto e vírgula final
            double valorHoraExtra = horasExtras[i] * 45.5;
            salarioBruto += valorHoraExtra;
            
            // CORREÇÃO 8: Para não dar 0, deve-se usar um decimal na divisão (ex: 5.0)
            double bonusAnual = salarioBruto * (5.0 / 100);
            salarioBruto += bonusAnual;
            
            // CORREÇÃO 9: Variável declarada fora do if/else para ser acessível depois
            double imposto = 0.0;
            if (salarioBruto > 2500.0) {
                imposto = salarioBruto * 0.15;
            } else {
                imposto = salarioBruto * 0.05;
            }
            
            double salarioLiquido = salarioBruto - imposto;
            
            // CORREÇÃO 10: println escrito de forma totalmente minúscula
            System.out.println("Funcionário: " + nome + " | Líquido: R$ " + salarioLiquido);
            
            // IMPLEMENTAÇÃO (TODO): Acumulador total da folha
            totalFolha += salarioLiquido;
        }
        
        System.out.println("Total da Folha Pago: R$ " + totalFolha);
    }
}`;

createApp({
    data() {
        return {
            userCode: INITIAL_CODE,
            resolvedCode: CORRECT_CODE,
            attempts: 10,
            fixedBugs: 0,
            logs: [],
            isTyping: false,
            gameComplete: false,
            victory: false,

            validationRules: [
                {
                    id: "Array_Init",
                    regex: /String\[\]\s+funcionarios\s*=\s*\{/,
                    errorMsg: "FolhaPagamento.java:5: error: array initializer expected.\n  Dica: Em Java, arrays são inicializados com chaves {} e não colchetes [].",
                    hint: "Olhe a linha 5. Os arrays em Java usam um símbolo diferente para encapsular os itens da lista."
                },
                {
                    id: "Data_Type",
                    regex: /double\s+salarioBase\s*=\s*3000\.50/,
                    errorMsg: "FolhaPagamento.java:9: error: incompatible types: possible lossy conversion from double to int.\n  Dica: Números com casas decimais não cabem em um 'int'.",
                    hint: "A variável 'salarioBase' tem um valor fracionado (3000.50). 'int' guarda apenas inteiros."
                },
                {
                    id: "Loop_Bounds",
                    regex: /int\s+i\s*=\s*0\s*;\s*i\s*<\s*funcionarios\.length/,
                    errorMsg: "Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException.\n  Dica: O índice de arrays em Java começa em 0. E vai até tamanho - 1 (usar '<').",
                    hint: "No for (linha 18), um array de 5 posições vai de 0 a 4. O loop atual tenta iniciar no 1 e ir até o 5 (que não existe)."
                },
                {
                    id: "String_Compare",
                    regex: /depto\.equals\(\s*"TI"\s*\)/,
                    errorMsg: "FolhaPagamento.java:25: warning: String values are compared using '==', not 'equals()'.\n  Dica: Em Java, == compara endereço de memória de Objetos, não o texto.",
                    hint: "Para verificar se a String 'depto' é igual a \"TI\", use o método depto.equals(\"TI\")."
                },
                {
                    id: "Switch_Fallthrough",
                    regex: /salarioBruto\s*\+=\s*300\.0;\s*break;/,
                    errorMsg: "[WARNING] Switch fall-through detectado no case 'Vendas'.\n  Dica: O case Vendas está vazando para o RH. Falta uma palavra-chave para parar o switch.",
                    hint: "Dentro do switch, logo após adicionar 300.0 na comissão de Vendas, você precisa 'quebrar' o fluxo."
                },
                {
                    id: "If_Assignment",
                    regex: /if\s*\(\s*faltas\[i\]\s*==\s*0\s*\)/,
                    errorMsg: "FolhaPagamento.java:38: error: incompatible types: int cannot be converted to boolean.\n  Dica: Um sinal de igual (=) significa atribuição. Para comparar igualdade, use dois.",
                    hint: "Na verificação de faltas, está escrito `faltas[i] = 0`. Isso atribui 0. Use `==` para perguntar se é 0."
                },
                {
                    id: "Missing_Semicolon",
                    regex: /horasExtras\[i\]\s*\*\s*45\.5\s*;/,
                    errorMsg: "FolhaPagamento.java:46: error: ';' expected.\n  Dica: Toda instrução no Java obrigatoriamente termina com ponto e vírgula.",
                    hint: "Verifique o final da linha onde a variável `valorHoraExtra` é declarada."
                },
                {
                    id: "Integer_Division",
                    regex: /5\.0\s*\/\s*100|5\s*\/\s*100\.0|0\.05/,
                    errorMsg: "FolhaPagamento.java:50: Lógica: Divisão de inteiros resulta em 0.\n  Dica: (5 / 100) em Java resulta em 0. Transforme um dos números em decimal (5.0 / 100) ou use 0.05.",
                    hint: "O cálculo do bônusAnual está multiplicando por zero. (5/100) para o Java é 0. Troque por 0.05 ou 5.0/100."
                },
                {
                    id: "Variable_Scope",
                    regex: /(double\s+imposto\s*(=\s*0(\.0)?)?\s*;)|(double\s+imposto\s*=\s*salarioBruto)/,
                    errorMsg: "FolhaPagamento.java:58: error: cannot find symbol variable imposto.\n  Dica: A variável imposto foi criada DENTRO das chaves do IF/ELSE, e morre ao sair delas.",
                    hint: "Declare `double imposto = 0.0;` ANTES do `if(salarioBruto > 2500)`. Assim ela existe fora dele."
                },
                {
                    id: "Print_Typo",
                    regex: /System\.out\.println\(/,
                    errorMsg: "FolhaPagamento.java:61: error: cannot find symbol method printLn(String).\n  Dica: O Java é Case Sensitive (diferencia maiúsculas e minúsculas).",
                    hint: "A função de impressão é `println` (tudo em minúsculo), não `printLn`."
                },
                {
                    id: "Implementation_Sum",
                    regex: /totalFolha\s*\+=\s*salarioLiquido|totalFolha\s*=\s*totalFolha\s*\+\s*salarioLiquido/,
                    errorMsg: "FolhaPagamento.java:65: Lógica: O Total da Folha não está sendo calculado.\n  Dica: Adicione o salarioLiquido à variável totalFolha a cada passagem do laço.",
                    hint: "Na área de TODO, digite: `totalFolha += salarioLiquido;` para somar a folha de cada um no montante."
                }
            ]
        }
    },
    mounted() {
        this.addLog("Inicializando Máquina Virtual Java (Equipe)...", "log-info");
        this.addLog("Carregando ambiente de compilação. Aguardando código.", "log-info");
    },
    methods: {
        async compileCode() {
            if (this.attempts <= 0 || this.isTyping) return;
            
            this.isTyping = true;
            this.logs = []; 
            await this.typeWriter(`$ javac FolhaPagamento.java`, "log-info");
            
            let code = this.userCode;
            let errorsFound = [];
            let passedChecks = 0;

            this.validationRules.forEach(rule => {
                if (rule.regex.test(code)) {
                    passedChecks++;
                } else {
                    errorsFound.push(rule);
                }
            });

            this.fixedBugs = passedChecks;

            if (errorsFound.length === 0) {
                // SUCESSO
                await this.typeWriter(`✓ Compilação concluída sem erros!`, "log-success");
                await this.typeWriter(`$ java FolhaPagamento`, "log-info");
                await this.typeWriter(`--- PROCESSAMENTO DE FOLHA ---`, "log-success");
                await this.typeWriter(`Processamento de 5 funcionários finalizado.`, "log-success");
                await this.typeWriter(`Total da Folha Pago: R$ 17855.0`, "log-success"); 
                
                setTimeout(() => {
                    this.victory = true;
                    this.gameComplete = true;
                    this.isTyping = false;
                }, 2000);

            } else {
                // FALHA
                this.attempts--;
                await this.typeWriter(`Foram encontrados ${errorsFound.length} erro(s) na compilação/lógica:`, "log-error");
                
                let errorsToShow = errorsFound.slice(0, 3);
                for (let err of errorsToShow) {
                    await this.typeWriter(`-> ${err.errorMsg}`, "log-error");
                }

                if (errorsFound.length > 3) {
                    await this.typeWriter(`... e mais ${errorsFound.length - 3} erro(s) não exibidos. Resolva estes primeiro.`, "log-warning");
                }

                if (this.attempts <= 0) {
                    await this.typeWriter(`[SYSTEM HALT] Tentativas esgotadas. Compilador bloqueado. Iniciando modo de segurança visual.`, "log-error");
                    setTimeout(() => {
                        this.victory = false;
                        this.gameComplete = true;
                        this.isTyping = false;
                    }, 3000);
                } else {
                    this.isTyping = false;
                }
            }
        },

        async showHint() {
            if (this.isTyping || this.gameComplete) return;
            
            let code = this.userCode;
            let firstError = this.validationRules.find(rule => !rule.regex.test(code));

            if (firstError) {
                this.isTyping = true;
                await this.typeWriter(`[DICA DO SISTEMA] Analisando código da equipe...`, "log-warning");
                await this.typeWriter(`💡 DICA: ${firstError.hint}`, "log-warning");
                this.isTyping = false;
            } else {
                this.addLog("O código parece estar correto! Tente compilar.", "log-success");
            }
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    if (!this.logs[currentLogIndex]) { clearInterval(interval); resolve(); return; }
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) { clearInterval(interval); resolve(); }
                }, 10);
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) terminal.scrollTop = terminal.scrollHeight;
            });
        },

        generatePDF() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; border: 5px solid #27c93f;">
                    <h1 style="color: #27c93f; font-size: 36px;">SISTEMA RESTAURADO</h1>
                    <h2>Certificado de Equipe - Java HR Tech</h2>
                    <p style="margin-top: 30px; font-size: 18px; color: #333;">
                        Certificamos que a equipe concluiu com êxito o <strong>Módulo Hardcore de Debugging Estrutural em Java</strong>.
                    </p>
                    <p style="font-size: 16px; margin-top: 20px;">
                        A equipe analisou e corrigiu com sucesso um algoritmo contendo falhas em Tipos de Dados, Laços de Repetição, Estruturas de Controle de Fluxo e Escopo de Variáveis.
                    </p>
                    <div style="margin: 40px auto; padding: 15px; background: #f0f0f0; border: 2px solid #333; width: 60%; font-size: 20px; font-weight: bold;">
                        Tentativas Utilizadas: ${10 - this.attempts} de 10<br>
                        Bugs Aniquilados: 11 / 11
                    </div>
                    <p style="color: #666; font-style: italic;">"O código é forte, mas a equipe é imbatível."</p>
                    <p style="margin-top: 30px;">Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            `;
            
            html2pdf().set({
                margin: 0.5, filename: 'relatorio_equipe_hrtech.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            }).from(element).save();
        },

        resetGame() {
            this.userCode = INITIAL_CODE;
            this.attempts = 10;
            this.fixedBugs = 0;
            this.logs = [];
            this.gameComplete = false;
            this.victory = false;
            this.addLog("Sistema reiniciado. Compilador pronto para a equipe.", "log-info");
        }
    }
}).mount('#app');