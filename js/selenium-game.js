const { createApp } = Vue;

createApp({
    data() {
        return {
            currentMissionIndex: 0,
            attempts: 0,
            totalErrors: 0,
            userSelection: null,
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            gameOver: false,
            
            // 20 Casos de Teste (Selenium + Django)
            missions: [
                {
                    title: "1. Acessando o Painel Admin",
                    description: "Inicie o teste navegando até a página de login do Django Admin na sua máquina local.",
                    codePrefix: "from selenium import webdriver\ndriver = webdriver.Chrome()\n\n",
                    codeSuffix: "",
                    answer: 'driver.get("http://localhost:8000/admin/")',
                    options: [
                        'driver.navigate("http://localhost:8000/admin/")',
                        'driver.get("http://localhost:8000/admin/")',
                        'driver.open_url("http://localhost:8000/admin/")',
                        'driver.go_to("http://localhost:8000/admin/")'
                    ]
                },
                {
                    title: "2. Localizando o Usuário",
                    description: "Encontre o campo de texto para o nome de usuário. O Django por padrão usa o atributo 'name' como 'username'.",
                    codePrefix: "from selenium.webdriver.common.by import By\n\nuser_input = ",
                    codeSuffix: "",
                    answer: 'driver.find_element(By.NAME, "username")',
                    options: [
                        'driver.find_element(By.ID, "username")',
                        'driver.find_element(By.NAME, "username")',
                        'driver.find_element(By.CLASS_NAME, "username")',
                        'driver.get_element(By.NAME, "username")'
                    ]
                },
                {
                    title: "3. Preenchendo o Usuário",
                    description: "Simule a digitação inserindo o texto 'admin' no elemento recém encontrado.",
                    codePrefix: "user_input = driver.find_element(By.NAME, 'username')\n",
                    codeSuffix: "",
                    answer: 'user_input.send_keys("admin")',
                    options: [
                        'user_input.type("admin")',
                        'user_input.write("admin")',
                        'user_input.send_keys("admin")',
                        'user_input.fill("admin")'
                    ]
                },
                {
                    title: "4. Localizando a Senha",
                    description: "Agora localize o campo de senha usando XPath focado no atributo name.",
                    codePrefix: "pass_input = ",
                    codeSuffix: "",
                    answer: 'driver.find_element(By.XPATH, "//input[@name=\'password\']") div',
                    options: [
                        'driver.find_element(By.XPATH, "//input[@name=\'password\']") div',
                        'driver.find_element(By.XPATH, "/input[name=\'password\']") div',
                        'driver.find_element(By.SELECTOR, "//input[password]") div',
                        'driver.find_element(By.XPATH, "//password") div'
                    ]
                },
                {
                    title: "5. Enviando o Formulário",
                    description: "Em vez de clicar no botão de login, pressione a tecla ENTER (RETURN) dentro do campo de senha.",
                    codePrefix: "from selenium.webdriver.common.keys import Keys\n\npass_input.send_keys('senha123')\n",
                    codeSuffix: "",
                    answer: 'pass_input.send_keys(Keys.RETURN)',
                    options: [
                        'pass_input.submit()',
                        'pass_input.send_keys(Keys.ENTER)',
                        'pass_input.send_keys(Keys.RETURN)',
                        'pass_input.press(Keys.ENTER)'
                    ]
                },
                {
                    title: "6. Espera Explícita (Explicit Wait)",
                    description: "Aguarde até que a div com ID 'content-main' (painel principal do Django) esteja presente na tela antes de continuar.",
                    codePrefix: "from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\n",
                    codeSuffix: "",
                    answer: 'WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "content-main")))',
                    options: [
                        'driver.implicitly_wait(10, By.ID, "content-main")',
                        'WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "content-main")))',
                        'time.sleep(10)',
                        'WebDriverWait(driver, 10).wait((By.ID, "content-main"))'
                    ]
                },
                {
                    title: "7. Acessando o App de Usuários",
                    description: "Encontre o link do menu lateral do Django cujo texto exato é 'Users'.",
                    codePrefix: "users_link = ",
                    codeSuffix: "\nusers_link.click()",
                    answer: 'driver.find_element(By.LINK_TEXT, "Users")',
                    options: [
                        'driver.find_element(By.TEXT, "Users")',
                        'driver.find_element(By.LINK_TEXT, "Users")',
                        'driver.find_element(By.PARTIAL_LINK_TEXT, "Users")',
                        'driver.find_element(By.A, "Users")'
                    ]
                },
                {
                    title: "8. Validação (Assertion)",
                    description: "Use o assert do Python para garantir que a palavra 'Select user' está no título da página atual.",
                    codePrefix: "",
                    codeSuffix: "",
                    answer: 'assert "Select user" in driver.title',
                    options: [
                        'assert "Select user" == driver.page_source',
                        'assert "Select user" in driver.title',
                        'assertEqual("Select user", driver.title)',
                        'assert driver.title.contains("Select user")'
                    ]
                },
                {
                    title: "9. Adicionando Novo Usuário",
                    description: "Encontre e clique no botão 'Add user +'. No Django admin, ele geralmente é um link com a classe 'addlink'.",
                    codePrefix: "add_btn = ",
                    codeSuffix: "\nadd_btn.click()",
                    answer: 'driver.find_element(By.CLASS_NAME, "addlink")',
                    options: [
                        'driver.find_element(By.CSS_CLASS, "addlink")',
                        'driver.find_element(By.CLASS_NAME, "addlink")',
                        'driver.find_elements(By.CLASS_NAME, "addlink")[0]',
                        'driver.get_element(By.CLASS, "addlink")'
                    ]
                },
                {
                    title: "10. Trabalhando com Checkboxes",
                    description: "Marque a checkbox de 'Staff status'. No Django, esse input tem o ID 'id_is_staff'.",
                    codePrefix: "staff_checkbox = driver.find_element(By.ID, 'id_is_staff')\nif not staff_checkbox.is_selected():\n    ",
                    codeSuffix: "",
                    answer: 'staff_checkbox.click()',
                    options: [
                        'staff_checkbox.check()',
                        'staff_checkbox.select()',
                        'staff_checkbox.click()',
                        'staff_checkbox.set(True)'
                    ]
                },
                {
                    title: "11. Tratando Menus Dropdown (Select)",
                    description: "Para selecionar um grupo em um menu <select>, precisamos usar a classe especial Select do Selenium.",
                    codePrefix: "from selenium.webdriver.support.ui import Select\n\n",
                    codeSuffix: "\ngroup_dropdown.select_by_visible_text('Editores')",
                    answer: 'group_dropdown = Select(driver.find_element(By.ID, "id_groups"))',
                    options: [
                        'group_dropdown = Select(driver.find_element(By.ID, "id_groups"))',
                        'group_dropdown = driver.find_element(By.ID, "id_groups")',
                        'group_dropdown = Dropdown(driver.find_element(By.ID, "id_groups"))',
                        'group_dropdown = Select.element(By.ID, "id_groups")'
                    ]
                },
                {
                    title: "12. Executando JavaScript",
                    description: "O botão de salvar está lá embaixo. Para evitar erros de clique interceptado, role a página até o fim usando JS.",
                    codePrefix: "",
                    codeSuffix: "",
                    answer: 'driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")',
                    options: [
                        'driver.scroll_down()',
                        'driver.run_script("window.scrollTo(bottom);")',
                        'driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")',
                        'driver.execute_javascript("scroll_to_end()")'
                    ]
                },
                {
                    title: "13. Salvando o Formulário (CSS Selector)",
                    description: "Encontre o botão de salvar usando um seletor CSS. Ele é um input cujo atributo name é '_save'.",
                    codePrefix: "save_btn = ",
                    codeSuffix: "\nsave_btn.click()",
                    answer: 'driver.find_element(By.CSS_SELECTOR, "input[name=\'_save\']") div',
                    options: [
                        'driver.find_element(By.CSS, "input[name=\'_save\']") div',
                        'driver.find_element(By.CSS_SELECTOR, "input[name=\'_save\']") div',
                        'driver.find_element(By.SELECTOR, "input[name=\'_save\']") div',
                        'driver.find_element(By.CSS_SELECTOR, ".input_save") div'
                    ]
                },
                {
                    title: "14. Verificando Mensagem de Sucesso",
                    description: "Após salvar, o Django exibe uma mensagem. Localize a lista de mensagens pela classe 'messagelist'.",
                    codePrefix: "messages = ",
                    codeSuffix: "\nassert 'was added successfully' in messages.text",
                    answer: 'driver.find_element(By.CLASS_NAME, "messagelist")',
                    options: [
                        'driver.find_element(By.CLASS_NAME, "messagelist")',
                        'driver.find_element(By.CLASS, "messagelist")',
                        'driver.find_elements(By.CLASS_NAME, "messagelist")',
                        'driver.find_element(By.NAME, "messagelist")'
                    ]
                },
                {
                    title: "15. Lendo Dados de uma Tabela",
                    description: "Volte para a lista de usuários e encontre todas as linhas da tabela (<tr>) que ficam dentro do <tbody>.",
                    codePrefix: "table_rows = ",
                    codeSuffix: "\nprint(f'Encontrados {len(table_rows)} usuários.')",
                    answer: 'driver.find_elements(By.XPATH, "//tbody/tr")',
                    options: [
                        'driver.find_element(By.TAG_NAME, "tr")',
                        'driver.find_elements(By.CSS_SELECTOR, "tr.tbody")',
                        'driver.find_elements(By.XPATH, "//tbody/tr")',
                        'driver.find_elements(By.TAG_NAME, "tbody > tr")'
                    ]
                },
                {
                    title: "16. Limpando um Campo",
                    description: "Você decidiu buscar por um usuário. Antes de digitar na barra de pesquisa, você deve limpar o campo.",
                    codePrefix: "search_bar = driver.find_element(By.ID, 'searchbar')\n",
                    codeSuffix: "\nsearch_bar.send_keys('karina')",
                    answer: 'search_bar.clear()',
                    options: [
                        'search_bar.empty()',
                        'search_bar.delete_all()',
                        'search_bar.clear()',
                        'search_bar.reset()'
                    ]
                },
                {
                    title: "17. Lidando com Alertas (Pop-ups JS)",
                    description: "Imagine que ao deletar um usuário o Django exiba um alert() JS. Como você muda o foco para ele e aceita?",
                    codePrefix: "alert = ",
                    codeSuffix: "\nalert.accept()",
                    answer: 'driver.switch_to.alert',
                    options: [
                        'driver.get_alert()',
                        'driver.switch_to.alert',
                        'driver.focus_alert()',
                        'driver.switch_to_window("alert")'
                    ]
                },
                {
                    title: "18. Navegação: Voltando",
                    description: "Simule o clique no botão 'Voltar' do navegador para retornar à página anterior.",
                    codePrefix: "# Volta na história do navegador\n",
                    codeSuffix: "",
                    answer: 'driver.back()',
                    options: [
                        'driver.go_back()',
                        'driver.previous()',
                        'driver.back()',
                        'driver.return()'
                    ]
                },
                {
                    title: "19. Captura de Tela (Evidência)",
                    description: "Testes automatizados falharam? Tire um print da tela inteira do navegador e salve como 'erro_admin.png'.",
                    codePrefix: "# Gera uma imagem do painel\n",
                    codeSuffix: "",
                    answer: 'driver.save_screenshot("erro_admin.png")',
                    options: [
                        'driver.screenshot("erro_admin.png")',
                        'driver.save_screenshot("erro_admin.png")',
                        'driver.take_screenshot("erro_admin.png")',
                        'driver.print_screen("erro_admin.png")'
                    ]
                },
                {
                    title: "20. Encerrando a Sessão",
                    description: "Missão cumprida. Finalize o WebDriver fechando todas as janelas e liberando o processo.",
                    codePrefix: "# Encerra o WebDriver\n",
                    codeSuffix: "",
                    answer: 'driver.quit()',
                    options: [
                        'driver.close()',
                        'driver.exit()',
                        'driver.stop()',
                        'driver.quit()'
                    ]
                }
            ]
        }
    },
    computed: {
        currentMission() {
            return this.missions[this.currentMissionIndex];
        },
        codeLines() {
            if (!this.currentMission) return [];
            // Junta prefixo, lacuna (???) e sufixo, depois divide por quebra de linha
            const fullCode = (this.currentMission.codePrefix || "") + "???" + (this.currentMission.codeSuffix || "");
            return fullCode.split('\n');
        },
        successRate() {
            const maxErrorsTolerated = this.missions.length * 2; 
            const calc = ((maxErrorsTolerated - this.totalErrors) / maxErrorsTolerated) * 100;
            return Math.max(0, calc).toFixed(0);
        }
    },
    mounted() {
        this.addLog("Inicializando ambiente WebDriver...", "log-info");
        setTimeout(() => {
            this.loadMission();
        }, 1000);
    },
    methods: {
        formatCodeLine(line) {
            // Substitui "???" pelo input do usuário ou deixa a interrogação de placeholder
            if (line.includes("???")) {
                if (this.userSelection) {
                    return line.replace("???", `<span class="code-slot filled">${this.userSelection}</span>`);
                }
                return line.replace("???", `<span class="code-slot">...</span>`);
            }
            return line;
        },

        selectOption(option) {
            if (this.levelComplete) return;
            this.userSelection = option;
            this.feedbackMsg = "";
        },

        async runCode() {
            if (!this.userSelection || this.levelComplete) return;

            // Verifica Resposta
            if (this.userSelection === this.currentMission.answer) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Script compilado e executado com sucesso! (Status 200)";
                this.levelComplete = true;
                
                await this.typeWriter(`✓ Cenário ${this.currentMissionIndex + 1} validado com sucesso.`, "log-success");

                setTimeout(() => {
                    this.nextMission();
                }, 2000);

            } else {
                // ERRO
                this.attempts++;
                this.totalErrors++;
                
                if (this.attempts >= 3) {
                    // Esgotou tentativas
                    this.feedbackType = "error";
                    this.feedbackMsg = "Tentativas esgotadas. Autocompletando código correto...";
                    this.levelComplete = true;
                    this.userSelection = this.currentMission.answer; // Injeta a resposta correta
                    
                    await this.typeWriter(`✗ Falha Crítica. Injetando bypass de segurança...`, "log-error");
                    
                    setTimeout(() => {
                        this.nextMission();
                    }, 3500);
                } else {
                    // Tenta de novo
                    let chancesLeft = 3 - this.attempts;
                    this.feedbackType = "error";
                    this.feedbackMsg = `SyntaxError/NoSuchElementException. Restam ${chancesLeft} chance(s).`;
                    this.addLog(`Erro na execução da instrução. Retrying...`, "log-error");
                }
            }
        },

        nextMission() {
            if (this.currentMissionIndex < this.missions.length - 1) {
                this.currentMissionIndex++;
                this.resetMissionState();
                this.loadMission();
            } else {
                this.gameOver = true;
                this.addLog("Bateria de testes finalizada. Desligando WebDriver...", "log-info");
            }
        },

        async loadMission() {
            this.isTyping = true;
            this.addLog("------------------------------------", "log-info");
            await this.typeWriter(`Carregando cenário: ${this.currentMission.title}`, "log-info");
            await this.typeWriter(`>> ${this.currentMission.description}`, "log-default");
            
            // Embaralha as opções
            this.currentMission.options = this.shuffleArray([...this.currentMission.options]);
            
            this.isTyping = false;
        },

        resetMissionState() {
            this.userSelection = null;
            this.levelComplete = false;
            this.feedbackMsg = "";
            this.attempts = 0;
        },

        restartGame() {
            this.currentMissionIndex = 0;
            this.totalErrors = 0;
            this.logs = [];
            this.gameOver = false;
            this.resetMissionState();
            this.addLog("Reiniciando instância WebDriver...", "log-info");
            setTimeout(() => this.loadMission(), 1000);
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
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 20); // Velocidade de digitação rápida
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => {
                        terminal.scrollTop = terminal.scrollHeight;
                    }, 50);
                }
            });
        },

        exportToJSON() {
            const relatorio = {
                atividade: "Selenium QA: Operação Django (IDE Mode)",
                autor: "QA Automator",
                data_conclusao: new Date().toISOString(),
                estatisticas: {
                    total_cenarios: this.missions.length,
                    erros_sintaxe_ou_localizacao: this.totalErrors,
                    taxa_sucesso_estimada: this.successRate + "%"
                },
                status: "APPROVED"
            };

            const jsonString = JSON.stringify(relatorio, null, 4);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const linkTag = document.createElement('a');
            linkTag.href = url;
            linkTag.download = "selenium_django_test_report.json";
            
            document.body.appendChild(linkTag);
            linkTag.click();
            document.body.removeChild(linkTag);
            URL.revokeObjectURL(url);
        },

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }
}).mount('#app');