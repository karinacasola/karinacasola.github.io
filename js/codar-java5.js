const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attempts: 0,
            userCode: '',
            logs: [{ type: 'log-info', text: 'Ambiente Java inicializado. Módulo: CRUD e Bibliotecas I/O em Java.' }],
            isTyping: false,
            roundOver: false,
            feedbackMsg: '',
            feedbackType: '',
            gameOver: false,
            hintsUsed: 0,
            maxHints: 3,
            questions: [
                // ---------------------------------------------------------
                // FASE 1: CREATE (Escrita Básica)
                // ---------------------------------------------------------
                {
                    instruction: "[Q1 - File Create Básico] Crie a classe 'ArquivoUtil'. Crie o método estático 'public static void criarArquivoLog(String nome, String msg)'. Use um bloco try-with-resources instanciando a classe 'FileWriter' na variável 'fw'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void, try | Classes: ArquivoUtil, FileWriter | Método: criarArquivoLog | Variáveis: nome, msg, fw",
                    regex: /class\s+ArquivoUtil[\s\S]*public\s+static\s+void\s+criarArquivoLog\s*\(\s*String\s+nome\s*,\s*String\s+msg\s*\)[\s\S]*try\s*\(\s*FileWriter\s+fw\s*=\s*new\s+FileWriter\s*\(\s*nome\s*\)\s*\)/i,
                    explanation: "O construtor do FileWriter exige o nome do arquivo. O uso do try-with-resources (entre parênteses) garante o fechamento automático do recurso.",
                    expectedExample: "import java.io.*;\npublic class ArquivoUtil {\n  public static void criarArquivoLog(String nome, String msg) {\n    try (FileWriter fw = new FileWriter(nome)) { }\n    catch(IOException e) { }\n  }\n}",
                    hint: "Sintaxe: try (FileWriter fw = new FileWriter(nome)) { }"
                },
                {
                    instruction: "[Q2 - File Create Gravação] Baseado na 'ArquivoUtil', chame o método de gravação: 'fw.write(msg);'. Em seguida, no catch, capture 'IOException e' e imprima a mensagem de erro com 'e.getMessage()'.",
                    elementosExigidos: "Palavras Reservadas: catch | Classes: IOException | Métodos: write, getMessage | Variáveis: fw, msg, e",
                    regex: /fw\.write\s*\(\s*msg\s*\);[\s\S]*catch\s*\(\s*IOException\s+e\s*\)[\s\S]*e\.getMessage\(\)/i,
                    explanation: "O método write() envia o texto para o disco. O tratamento da IOException é obrigatório no Java para operações de disco.",
                    expectedExample: "try (FileWriter fw = new FileWriter(nome)) {\n  fw.write(msg);\n} catch (IOException e) {\n  System.out.println(\"Erro: \" + e.getMessage());\n}",
                    hint: "Faça fw.write(msg); dentro do try. No catch, capture (IOException e)."
                },
                {
                    instruction: "[Q3 - File Create Buffer] Crie o método 'public static void salvarTexto(String caminho, String texto)'. Para otimizar, envolva o FileWriter instanciando a classe 'BufferedWriter' na variável 'bw'. Use 'bw.write(texto);'.",
                    elementosExigidos: "Palavras Reservadas: public, static, void, try | Classes: BufferedWriter, FileWriter | Métodos: salvarTexto, write | Variáveis: caminho, texto, bw",
                    regex: /salvarTexto\s*\(\s*String\s+caminho\s*,\s*String\s+texto\s*\)[\s\S]*try\s*\(\s*(?:FileWriter\s+\w+\s*=\s*new\s+FileWriter.*?;)?\s*BufferedWriter\s+bw\s*=\s*new\s+BufferedWriter\s*\([\s\S]*\.write\s*\(\s*texto\s*\)/i,
                    explanation: "O BufferedWriter junta pacotes de texto na RAM antes de enviar ao disco, poupando processamento em textos longos.",
                    expectedExample: "public static void salvarTexto(String caminho, String texto) {\n  try (BufferedWriter bw = new BufferedWriter(new FileWriter(caminho))) {\n    bw.write(texto);\n  } catch (IOException e) { }\n}",
                    hint: "Instancie BufferedWriter bw = new BufferedWriter(new FileWriter(caminho));"
                },
                {
                    instruction: "[Q4 - File Create Múltiplas Linhas] Crie a classe 'GeradorDocumento'. Método 'public static void salvarVetor(String[] dados, String nomeArq)'. Use o BufferedWriter 'bw'. Itere o array 'dados' e use 'bw.newLine();' para quebrar a linha.",
                    elementosExigidos: "Palavras Reservadas: for | Classes: GeradorDocumento, BufferedWriter | Métodos: salvarVetor, write, newLine | Variáveis: dados, nomeArq, bw",
                    regex: /class\s+GeradorDocumento[\s\S]*salvarVetor[\s\S]*BufferedWriter\s+bw[\s\S]*for\s*\([\s\S]*bw\.write[\s\S]*bw\.newLine\(\)/i,
                    explanation: "O método newLine() adiciona a quebra de linha correta independentemente do sistema operacional.",
                    expectedExample: "public class GeradorDocumento {\n  public static void salvarVetor(String[] dados, String nomeArq) {\n    try(BufferedWriter bw = new BufferedWriter(new FileWriter(nomeArq))) {\n      for(String d : dados) { bw.write(d); bw.newLine(); }\n    } catch(Exception e){}\n  }\n}",
                    hint: "No for, faça bw.write(item); e logo em seguida bw.newLine();"
                },

                // ---------------------------------------------------------
                // FASE 2: READ (Leitura)
                // ---------------------------------------------------------
                {
                    instruction: "[Q5 - File Read Scanner] Na classe 'ArquivoUtil', crie 'public static void lerArquivoCompleto(String caminho)'. Instancie a classe 'Scanner' na variável 'sc', passando um 'new File(caminho)'. Capture a exceção 'FileNotFoundException'.",
                    elementosExigidos: "Palavras Reservadas: try, catch | Classes: Scanner, File, FileNotFoundException | Método: lerArquivoCompleto | Variáveis: sc, caminho",
                    regex: /lerArquivoCompleto\s*\(\s*String\s+caminho\s*\)[\s\S]*try\s*\(\s*Scanner\s+sc\s*=\s*new\s+Scanner\s*\(\s*new\s+File\s*\(\s*caminho\s*\)\s*\)\s*\)[\s\S]*catch\s*\(\s*FileNotFoundException/i,
                    explanation: "Diferente de System.in, o Scanner aqui é associado a um File para extrair dados do HD. Exige tratamento de FileNotFoundException.",
                    expectedExample: "public static void lerArquivoCompleto(String caminho) {\n  try (Scanner sc = new Scanner(new File(caminho))) {\n  } catch (FileNotFoundException e) {\n    System.out.println(\"Arquivo não encontrado\");\n  }\n}",
                    hint: "try (Scanner sc = new Scanner(new File(caminho))) { ... }"
                },
                {
                    instruction: "[Q6 - File Read Iteração] No método 'lerArquivoCompleto', crie um laço 'while (sc.hasNextLine())'. Imprima o resultado da função 'sc.nextLine()'.",
                    elementosExigidos: "Palavras Reservadas: while | Classes: System | Métodos: hasNextLine, nextLine, print/println | Variável: sc",
                    regex: /while\s*\(\s*sc\.hasNextLine\(\)\s*\)\s*\{[\s\S]*System\.out\.print(?:ln)?\s*\(\s*sc\.nextLine\(\)\s*\);/i,
                    explanation: "O método hasNextLine garante que a leitura só avança se ainda houver conteúdo no arquivo, prevenindo erros de limite.",
                    expectedExample: "while (sc.hasNextLine()) {\n  System.out.println(sc.nextLine());\n}",
                    hint: "Use while(sc.hasNextLine()) { System.out.println(sc.nextLine()); }"
                },
                {
                    instruction: "[Q7 - File Read Lógica] Crie o método 'public static boolean verificarPalavra(String caminho, String alvo)'. Leia com 'Scanner sc'. Se 'sc.nextLine().contains(alvo)', retorne true.",
                    elementosExigidos: "Palavras Reservadas: boolean, return, while, if | Classes: Scanner | Métodos: verificarPalavra, contains, nextLine | Variáveis: caminho, alvo, sc",
                    regex: /verificarPalavra\s*\(\s*String\s+caminho\s*,\s*String\s+alvo\s*\)[\s\S]*Scanner\s+sc[\s\S]*while[\s\S]*if\s*\([\s\S]*sc\.nextLine\(\)\.contains\s*\(\s*alvo\s*\)\s*\)[\s\S]*return\s+true;/i,
                    explanation: "Sub-rotinas de busca que encerram (return true) assim que encontram o valor poupam a varredura desnecessária do resto do arquivo.",
                    expectedExample: "public static boolean verificarPalavra(String caminho, String alvo) {\n  try(Scanner sc = new Scanner(new File(caminho))) {\n    while(sc.hasNextLine()) {\n      if(sc.nextLine().contains(alvo)) return true;\n    }\n  } catch(Exception e){} return false;\n}",
                    hint: "O if deve conter sc.nextLine().contains(alvo)."
                },
                {
                    instruction: "[Q8 - File Read Buffer] Crie 'public static int contarLinhas(String caminho)'. Em vez de Scanner, use a classe 'BufferedReader' na variável 'br', envolvendo um 'FileReader'.",
                    elementosExigidos: "Palavras Reservadas: int, try | Classes: BufferedReader, FileReader | Método: contarLinhas | Variáveis: caminho, br",
                    regex: /contarLinhas\s*\(\s*String\s+caminho\s*\)[\s\S]*try\s*\(\s*BufferedReader\s+br\s*=\s*new\s+BufferedReader\s*\(\s*new\s+FileReader\s*\(\s*caminho\s*\)\s*\)\s*\)/i,
                    explanation: "BufferedReader é mais eficiente que Scanner para manipulação puramente textual e massiva, como contar linhas de logs gigantes.",
                    expectedExample: "public static int contarLinhas(String caminho) {\n  try (BufferedReader br = new BufferedReader(new FileReader(caminho))) {\n  } catch (IOException e) { return -1; }\n}",
                    hint: "try (BufferedReader br = new BufferedReader(new FileReader(caminho)))"
                },
                {
                    instruction: "[Q9 - File Read Contagem] No método 'contarLinhas', declare 'int contador = 0;'. Faça o laço: 'while (br.readLine() != null)'. Incremente a variável 'contador++;' e retorne-a no final.",
                    elementosExigidos: "Palavras Reservadas: int, while, return | Método: readLine | Variáveis: contador, br",
                    regex: /int\s+contador\s*=\s*0;[\s\S]*while\s*\(\s*br\.readLine\(\)\s*!=\s*null\s*\)[\s\S]*contador\s*\+\+;[\s\S]*return\s+contador;/i,
                    explanation: "Ao contrário do Scanner, o BufferedReader.readLine() retorna 'null' quando atinge o fim do arquivo (EOF).",
                    expectedExample: "int contador = 0;\nwhile (br.readLine() != null) {\n  contador++;\n}\nreturn contador;",
                    hint: "while (br.readLine() != null) { contador++; }"
                },
                {
                    instruction: "[Q10 - File Read Avançado NIO] Crie 'public static List<String> lerTudoNio(String caminho)'. Importe 'java.nio.file.Files' e 'java.nio.file.Paths'. Retorne 'Files.readAllLines(Paths.get(caminho));'.",
                    elementosExigidos: "Palavras Reservadas: return | Classes: List, String, Files, Paths | Métodos: lerTudoNio, readAllLines, get | Variáveis: caminho",
                    regex: /lerTudoNio\s*\(\s*String\s+caminho\s*\)[\s\S]*return\s+Files\.readAllLines\s*\(\s*Paths\.get\s*\(\s*caminho\s*\)\s*\);/i,
                    explanation: "O pacote NIO (New I/O) abstrai toda a complexidade do Scanner/Buffer para carregar arquivos direto para uma lista na RAM em uma linha de código.",
                    expectedExample: "import java.nio.file.*;\nimport java.util.List;\npublic static List<String> lerTudoNio(String caminho) throws IOException {\n  return Files.readAllLines(Paths.get(caminho));\n}",
                    hint: "A execução é direta: return Files.readAllLines(Paths.get(caminho));"
                },

                // ---------------------------------------------------------
                // FASE 3: UPDATE (Atualização / Append)
                // ---------------------------------------------------------
                {
                    instruction: "[Q11 - File Update Append] Crie 'public static void adicionarLinha(String arquivo, String texto)'. Para não apagar o arquivo existente, inicialize o 'FileWriter' com o parâmetro 'true': 'new FileWriter(arquivo, true)'.",
                    elementosExigidos: "Palavras Reservadas: void, try, true | Classes: FileWriter | Método: adicionarLinha | Variáveis: arquivo, texto, fw",
                    regex: /adicionarLinha\s*\(\s*String\s+arquivo\s*,\s*String\s+texto\s*\)[\s\S]*try\s*\(\s*FileWriter\s+fw\s*=\s*new\s+FileWriter\s*\(\s*arquivo\s*,\s*true\s*\)\s*\)/i,
                    explanation: "O parâmetro booleano 'true' ativa o modo 'append', dizendo ao S.O. para posicionar o cursor no final do arquivo em vez de sobrescrevê-lo.",
                    expectedExample: "public static void adicionarLinha(String arquivo, String texto) {\n  try (FileWriter fw = new FileWriter(arquivo, true)) {\n    fw.write(texto);\n  } catch (IOException e) { }\n}",
                    hint: "FileWriter fw = new FileWriter(arquivo, true)"
                },
                {
                    instruction: "[Q12 - File Update PrintWriter] No método 'adicionarLinha', envolva o FileWriter instanciando a classe 'PrintWriter' na variável 'pw'. Use a função 'pw.println(texto);'.",
                    elementosExigidos: "Palavras Reservadas: try | Classes: PrintWriter, FileWriter | Método: println | Variáveis: pw, texto",
                    regex: /try\s*\([\s\S]*PrintWriter\s+pw\s*=\s*new\s+PrintWriter\s*\(\s*(?:fw|new\s+FileWriter)[\s\S]*pw\.println\s*\(\s*texto\s*\);/i,
                    explanation: "PrintWriter fornece os métodos println() e print(), permitindo formatar a saída de texto no arquivo com a mesma facilidade do System.out.",
                    expectedExample: "try (FileWriter fw = new FileWriter(arquivo, true);\n     PrintWriter pw = new PrintWriter(fw)) {\n  pw.println(texto);\n}",
                    hint: "A gravação fica: pw.println(texto);"
                },
                {
                    instruction: "[Q13 - Update Regra Negócio] Crie 'public static void registrarLogSistema(String msg)'. O arquivo fixo será 'sistema.log'. Use o FileWriter em modo append (true) e grave a variável 'msg'.",
                    elementosExigidos: "Palavras Reservadas: true | Classes: FileWriter | Métodos: registrarLogSistema, write | Variável: msg",
                    regex: /registrarLogSistema\s*\(\s*String\s+msg\s*\)[\s\S]*new\s+FileWriter\s*\(\s*"sistema\.log"\s*,\s*true\s*\)[\s\S]*write\s*\(\s*msg\s*\)/i,
                    explanation: "Muitas sub-rotinas de atualização escondem o nome do arquivo para garantir que as rotinas principais sempre gravem no local padronizado.",
                    expectedExample: "public static void registrarLogSistema(String msg) {\n  try(FileWriter fw = new FileWriter(\"sistema.log\", true)) {\n    fw.write(msg + \"\\n\");\n  } catch(Exception e){}\n}",
                    hint: "O construtor é new FileWriter(\"sistema.log\", true)"
                },
                {
                    instruction: "[Q14 - Update Lote] Crie 'public static void adicionarMultiplos(String arq, String[] linhas)'. Com PrintWriter e modo append, use um for-each para varrer a variável 'linhas' e grave com 'pw.println(linha);'.",
                    elementosExigidos: "Palavras Reservadas: for, true | Classes: PrintWriter | Métodos: adicionarMultiplos, println | Variáveis: arq, linhas, linha, pw",
                    regex: /adicionarMultiplos\s*\(\s*String\s+arq\s*,\s*String\s*\[\s*\]\s*linhas\s*\)[\s\S]*PrintWriter\s+pw[\s\S]*true[\s\S]*for\s*\(\s*String\s+linha\s*:\s*linhas\s*\)[\s\S]*pw\.println\s*\(\s*linha\s*\)/i,
                    explanation: "Procedimento clássico para descarregar um vetor temporário da RAM anexando os registros ao final de um banco de dados em arquivo texto.",
                    expectedExample: "public static void adicionarMultiplos(String arq, String[] linhas) {\n  try(PrintWriter pw = new PrintWriter(new FileWriter(arq, true))) {\n    for(String linha : linhas) pw.println(linha);\n  } catch(Exception e){}\n}",
                    hint: "No for-each (String linha : linhas), chame pw.println(linha);"
                },
                {
                    instruction: "[Q15 - Backup Lógico (Read + Write)] Crie a classe 'RotinaDiscos'. Método 'public static void fazerBackup(String origem, String destino)'. Instancie 'BufferedReader br' (origem) e 'BufferedWriter bw' (destino).",
                    elementosExigidos: "Palavras Reservadas: class, try | Classes: RotinaDiscos, BufferedReader, BufferedWriter, FileReader, FileWriter | Método: fazerBackup | Variáveis: origem, destino, br, bw",
                    regex: /class\s+RotinaDiscos[\s\S]*fazerBackup\s*\(\s*String\s+origem\s*,\s*String\s+destino\s*\)[\s\S]*BufferedReader\s+br\s*=\s*new\s+BufferedReader[\s\S]*origem[\s\S]*BufferedWriter\s+bw\s*=\s*new\s+BufferedWriter[\s\S]*destino/i,
                    explanation: "Operações complexas de I/O abrem dois canais simultâneos (leitura e escrita) para transferir dados de um arquivo a outro.",
                    expectedExample: "public class RotinaDiscos {\n  public static void fazerBackup(String origem, String destino) {\n    try(BufferedReader br = new BufferedReader(new FileReader(origem));\n        BufferedWriter bw = new BufferedWriter(new FileWriter(destino))) { }\n  }\n}",
                    hint: "Instancie os dois buffers. Eles representam a Origem (Leitura) e o Destino (Escrita)."
                },
                {
                    instruction: "[Q16 - Backup Clone] No método 'fazerBackup', leia e grave no mesmo laço: 'while ((linha = br.readLine()) != null)'. Faça 'bw.write(linha);' e logo depois 'bw.newLine();'.",
                    elementosExigidos: "Palavras Reservadas: while | Métodos: readLine, write, newLine | Variáveis: linha, br, bw",
                    regex: /while\s*\(\s*\(\s*linha\s*=\s*br\.readLine\(\)\s*\)\s*!=\s*null\s*\)[\s\S]*bw\.write\s*\(\s*linha\s*\);[\s\S]*bw\.newLine\(\);/i,
                    explanation: "Isso clona o arquivo linha a linha de forma segura, sem explodir a memória RAM, ideal para arquivos de gigabytes.",
                    expectedExample: "String linha;\nwhile ((linha = br.readLine()) != null) {\n  bw.write(linha);\n  bw.newLine();\n}",
                    hint: "No while, armazene e verifique se é null. Se não for, bw.write e bw.newLine."
                },

                // ---------------------------------------------------------
                // FASE 4: DELETE E VALIDAÇÃO FÍSICA
                // ---------------------------------------------------------
                {
                    instruction: "[Q17 - File Delete Básico] Na classe 'ArquivoUtil', crie 'public static void excluirArquivo(String caminho)'. Instancie a classe 'File' na variável 'arquivo'. Chame a função 'arquivo.delete();'.",
                    elementosExigidos: "Palavras Reservadas: void, new | Classes: File | Métodos: excluirArquivo, delete | Variáveis: caminho, arquivo",
                    regex: /excluirArquivo\s*\(\s*String\s+caminho\s*\)[\s\S]*File\s+arquivo\s*=\s*new\s+File\s*\(\s*caminho\s*\);[\s\S]*arquivo\.delete\(\);/i,
                    explanation: "A exclusão não usa classes stream (Writer/Reader), e sim a classe representacional 'File' do java.io.",
                    expectedExample: "public static void excluirArquivo(String caminho) {\n  File arquivo = new File(caminho);\n  arquivo.delete();\n}",
                    hint: "File arquivo = new File(caminho); arquivo.delete();"
                },
                {
                    instruction: "[Q18 - File Exists] No método 'excluirArquivo', envolva o 'arquivo.delete();' com uma estrutura if chamando o método de checagem: 'if (arquivo.exists())'.",
                    elementosExigidos: "Palavras Reservadas: if | Classes: File | Métodos: exists, delete | Variável: arquivo",
                    regex: /if\s*\(\s*arquivo\.exists\(\)\s*\)\s*\{?[\s\S]*arquivo\.delete\(\);/i,
                    explanation: "Verificar se o arquivo físico existe antes de operar previne comportamentos inesperados do SO.",
                    expectedExample: "if (arquivo.exists()) {\n  arquivo.delete();\n}",
                    hint: "if (arquivo.exists()) { arquivo.delete(); }"
                },
                {
                    instruction: "[Q19 - Delete com Retorno Booleano] Crie 'public static boolean limparFisico(String arq)'. Instancie File. Retorne diretamente o resultado logico da exclusão: 'return arquivo.delete();'.",
                    elementosExigidos: "Palavras Reservadas: boolean, return | Classes: File | Métodos: limparFisico, delete | Variáveis: arq, arquivo",
                    regex: /limparFisico\s*\(\s*String\s+arq\s*\)[\s\S]*File\s+arquivo\s*=\s*new\s+File\s*\(\s*arq\s*\);[\s\S]*return\s+arquivo\.delete\(\);/i,
                    explanation: "O método delete() nativamente já devolve true (exclusão bem sucedida) ou false (falhou ou não existia).",
                    expectedExample: "public static boolean limparFisico(String arq) {\n  File arquivo = new File(arq);\n  return arquivo.delete();\n}",
                    hint: "return arquivo.delete();"
                },
                {
                    instruction: "[Q20 - Informação do Arquivo] Crie 'public static long verTamanho(String arq)'. Instancie File. Retorne o tamanho em bytes chamando o método: 'return arquivo.length();'.",
                    elementosExigidos: "Palavras Reservadas: long, return | Classes: File | Métodos: verTamanho, length | Variáveis: arq, arquivo",
                    regex: /verTamanho\s*\(\s*String\s+arq\s*\)[\s\S]*File\s+arquivo[\s\S]*return\s+arquivo\.length\(\);/i,
                    explanation: "A classe File possui métodos de metadata. length() devolve os bytes, útil para verificar integridade.",
                    expectedExample: "public static long verTamanho(String arq) {\n  File arquivo = new File(arq);\n  return arquivo.length();\n}",
                    hint: "return arquivo.length();"
                },
                {
                    instruction: "[Q21 - Limpeza Lote Delete] Crie a classe 'GestorLote'. 'public static void apagarTodos(String[] arquivos)'. Varra com for-each e para cada iterador 'a', faça: 'new File(a).delete();'.",
                    elementosExigidos: "Palavras Reservadas: class, for, new | Classes: GestorLote, File | Métodos: apagarTodos, delete | Variáveis: arquivos, a",
                    regex: /class\s+GestorLote[\s\S]*apagarTodos\s*\(\s*String\s*\[\s*\]\s*arquivos\s*\)[\s\S]*for\s*\(\s*String\s+a\s*:\s*arquivos\s*\)[\s\S]*new\s+File\s*\(\s*a\s*\)\.delete\(\);/i,
                    explanation: "Podemos instanciar o File anonimamente e engatar a chamada de função na mesma linha se precisarmos apenas acionar comandos rápidos.",
                    expectedExample: "public class GestorLote {\n  public static void apagarTodos(String[] arquivos) {\n    for(String a : arquivos) new File(a).delete();\n  }\n}",
                    hint: "No for (String a : arquivos) { new File(a).delete(); }"
                },

                // ---------------------------------------------------------
                // FASE 5: INTEGRAÇÃO E OTIMIZAÇÕES PROCEDURAIS
                // ---------------------------------------------------------
                {
                    instruction: "[Q22 - Integração Scanner com Delete] Crie 'LimpezaCondicional'. Método 'apagarSeEncontrar(String arq, String alvo)'. Use ArquivoUtil.verificarPalavra() criado antes num if. Se for true, instancie File e dê delete().",
                    elementosExigidos: "Palavras Reservadas: class, if | Classes: LimpezaCondicional, ArquivoUtil, File | Métodos: apagarSeEncontrar, verificarPalavra, delete | Variáveis: arq, alvo",
                    regex: /class\s+LimpezaCondicional[\s\S]*apagarSeEncontrar\s*\(\s*String\s+arq\s*,\s*String\s+alvo\s*\)[\s\S]*if\s*\(\s*ArquivoUtil\.verificarPalavra\s*\(\s*arq\s*,\s*alvo\s*\)\s*\)[\s\S]*new\s+File\s*\(\s*arq\s*\)\.delete\(\);/i,
                    explanation: "Lógica modular: uma sub-rotina aciona a sub-rotina de busca. Dependendo da resposta booleana, efetua a destruição do arquivo.",
                    expectedExample: "public class LimpezaCondicional {\n  public static void apagarSeEncontrar(String arq, String alvo) {\n    if(ArquivoUtil.verificarPalavra(arq, alvo)) {\n      new File(arq).delete();\n    }\n  }\n}",
                    hint: "if (ArquivoUtil.verificarPalavra(arq, alvo)) { new File(arq).delete(); }"
                },
                {
                    instruction: "[Q23 - Extração Dinâmica] Crie 'ExtratorNum'. Método 'public static int somarArquivo(String caminho)'. Use BufferedReader. Varra com while e acumule: 'soma += Integer.parseInt(br.readLine());'.",
                    elementosExigidos: "Palavras Reservadas: class, int, while | Classes: ExtratorNum, BufferedReader, Integer | Métodos: somarArquivo, parseInt, readLine | Variáveis: caminho, soma",
                    regex: /class\s+ExtratorNum[\s\S]*somarArquivo\s*\(\s*String\s+caminho\s*\)[\s\S]*BufferedReader[\s\S]*while[\s\S]*soma\s*\+=\s*Integer\.parseInt\s*\(\s*\w+\.readLine\(\)\s*\)/i,
                    explanation: "Todo I/O devolve String. Integrar CRUD com operações matemáticas exige o parser na leitura.",
                    expectedExample: "public class ExtratorNum {\n  public static int somarArquivo(String caminho) throws Exception {\n    BufferedReader br = new BufferedReader(new FileReader(caminho));\n    int soma = 0; String l;\n    while((l = br.readLine())!=null) soma += Integer.parseInt(l);\n    return soma;\n  }\n}",
                    hint: "A conversão é necessária: soma += Integer.parseInt(l);"
                },
                {
                    instruction: "[Q24 - Dump de Matriz (Write)] Crie 'DumpMemoria'. Método 'public static void salvarMatriz(int[][] m, String arq)'. Com PrintWriter, faça for(i) e for(j) e grave 'pw.print(m[i][j] + \" \");'. Fora do 'j', 'pw.println();'.",
                    elementosExigidos: "Palavras Reservadas: class, for | Classes: DumpMemoria, PrintWriter | Métodos: salvarMatriz, print, println | Variáveis: m, arq, i, j",
                    regex: /class\s+DumpMemoria[\s\S]*salvarMatriz\s*\(\s*int\s*\[\s*\]\s*\[\s*\]\s*m\s*,\s*String\s+arq\s*\)[\s\S]*PrintWriter[\s\S]*for[\s\S]*for[\s\S]*pw\.print\s*\(\s*m\[i\]\[j\]\s*\+\s*" "\s*\);[\s\S]*pw\.println\(\);/i,
                    explanation: "Gravando estruturas matriciais complexas da RAM persistindo o formato 2D visual no bloco de notas.",
                    expectedExample: "public class DumpMemoria {\n  public static void salvarMatriz(int[][] m, String arq) throws Exception{\n    PrintWriter pw = new PrintWriter(new FileWriter(arq));\n    for(int i=0;i<m.length;i++){\n      for(int j=0;j<m[i].length;j++) pw.print(m[i][j] + \" \");\n      pw.println();\n    } pw.close();\n  }\n}",
                    hint: "Lembre-se do pw.print no loop interno e do pw.println no loop de linhas (externo)."
                },
                {
                    instruction: "[Q25 - Cabeçalhos Estruturados] Crie 'CabecalhoUtil'. 'public static void assinarLog(String arq)'. Use PrintWriter no modo Append. Execute 3 vezes: 'pw.println(\"-----\");', 'pw.println(\"LOG:\");', 'pw.println(\"-----\");'.",
                    elementosExigidos: "Palavras Reservadas: class, true | Classes: CabecalhoUtil, PrintWriter | Métodos: assinarLog, println | Variável: arq",
                    regex: /class\s+CabecalhoUtil[\s\S]*assinarLog\s*\(\s*String\s+arq\s*\)[\s\S]*PrintWriter[\s\S]*true[\s\S]*pw\.println\s*\(\s*"-----"\s*\);[\s\S]*pw\.println\s*\(\s*"LOG:"\s*\);[\s\S]*pw\.println\s*\(\s*"-----"\s*\);/i,
                    explanation: "Rotinas de estruturação de metadados em modo update preparam o arquivo antes das varreduras em lote gravarem o dado cru.",
                    expectedExample: "public class CabecalhoUtil {\n  public static void assinarLog(String arq) throws Exception {\n    PrintWriter pw = new PrintWriter(new FileWriter(arq, true));\n    pw.println(\"-----\"); pw.println(\"LOG:\"); pw.println(\"-----\");\n  }\n}",
                    hint: "Instancie com true para append e chame pw.println() as três vezes."
                },
                {
                    instruction: "[Q26 - Checagem Arquivo Vazio] Crie 'Validador'. Método 'public static boolean vazio(String arq)'. Instancie BufferedReader. Leia 'String linha = br.readLine();' fora do laço. Retorne 'linha == null;'.",
                    elementosExigidos: "Palavras Reservadas: class, boolean, return | Classes: Validador, BufferedReader, String | Métodos: vazio, readLine | Variáveis: arq, linha",
                    regex: /class\s+Validador[\s\S]*public\s+static\s+boolean\s+vazio\s*\(\s*String\s+arq\s*\)[\s\S]*BufferedReader[\s\S]*String\s+linha\s*=\s*br\.readLine\(\);[\s\S]*return\s+linha\s*==\s*null;/i,
                    explanation: "Se o primeiro contato do buffer com o disco já retornar nulo, sabe-se em frações de segundo que o arquivo está vazio sem abrir streams pesados.",
                    expectedExample: "public class Validador {\n  public static boolean vazio(String arq) throws Exception {\n    BufferedReader br = new BufferedReader(new FileReader(arq));\n    String linha = br.readLine();\n    return linha == null;\n  }\n}",
                    hint: "Apenas teste a primeira linha lida: return linha == null;"
                },
                
                // ---------------------------------------------------------
                // FASE 6: ORQUESTRAÇÃO NA CLASSE MAIN (O CICLO COMPLETO)
                // ---------------------------------------------------------
                {
                    instruction: "[Q27 - O Maestro: Create + Read] Crie a classe 'Principal'. No método 'main', declare 'String arq = \"dados.txt\";'. Invoque 'ArquivoUtil.criarArquivoLog(arq, \"Registro 1\");' e 'ArquivoUtil.lerArquivoCompleto(arq);'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void | Classes: Principal, ArquivoUtil, String | Métodos: main, criarArquivoLog, lerArquivoCompleto | Variáveis: arq, args",
                    regex: /class\s+Principal[\s\S]*main\s*\(\s*String\s*\[\s*\]\s*args\s*\)[\s\S]*String\s+arq\s*=\s*"dados\.txt";[\s\S]*ArquivoUtil\.criarArquivoLog\s*\(\s*arq\s*,\s*"Registro 1"\s*\);[\s\S]*ArquivoUtil\.lerArquivoCompleto\s*\(\s*arq\s*\);/i,
                    explanation: "O método main é o Maestro, unindo a sub-rotina que cria o arquivo e a que lê, fechando o escopo do CR (Create, Read).",
                    expectedExample: "public class Principal {\n  public static void main(String[] args) {\n    String arq = \"dados.txt\";\n    ArquivoUtil.criarArquivoLog(arq, \"Registro 1\");\n    ArquivoUtil.lerArquivoCompleto(arq);\n  }\n}",
                    hint: "Declare a String e use as chamadas de método estático através da classe ArquivoUtil."
                },
                {
                    instruction: "[Q28 - O Maestro: Update + Delete] Modifique o 'main'. Sob a variável 'arq', chame 'ArquivoUtil.adicionarLinha(arq, \"Novo Dado\");'. Depois, ordene a destruição chamando 'ArquivoUtil.excluirArquivo(arq);'.",
                    elementosExigidos: "Palavras Reservadas: class | Classes: Principal, ArquivoUtil | Métodos: main, adicionarLinha, excluirArquivo | Variável: arq",
                    regex: /class\s+Principal[\s\S]*main[\s\S]*ArquivoUtil\.adicionarLinha\s*\(\s*arq\s*,\s*"Novo Dado"\s*\);[\s\S]*ArquivoUtil\.excluirArquivo\s*\(\s*arq\s*\);/i,
                    explanation: "Terminando o UD (Update, Delete). O ciclo de vida da informação nasce na memória, vai pro disco, é alterado e destruído.",
                    expectedExample: "public class Principal {\n  public static void main(String[] args) {\n    String arq = \"teste.txt\";\n    ArquivoUtil.adicionarLinha(arq, \"Novo Dado\");\n    ArquivoUtil.excluirArquivo(arq);\n  }\n}",
                    hint: "Basta invocar as duas funções procedurais nesta ordem na classe Principal."
                },
                {
                    instruction: "[Q29 - Scanner I/O Completo] Crie 'FluxoFinal'. No main, instancie 'Scanner sc = new Scanner(System.in);'. Capture a digitação com 'String dig = sc.nextLine();'. Salve usando 'ArquivoUtil.criarArquivoLog(\"usr.txt\", dig);'.",
                    elementosExigidos: "Palavras Reservadas: class, new | Classes: FluxoFinal, Scanner, System, ArquivoUtil, String | Métodos: main, nextLine, criarArquivoLog | Variáveis: sc, dig",
                    regex: /class\s+FluxoFinal[\s\S]*main[\s\S]*Scanner\s+sc\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\);[\s\S]*String\s+dig\s*=\s*sc\.nextLine\(\);[\s\S]*ArquivoUtil\.criarArquivoLog\s*\(\s*"usr\.txt"\s*,\s*dig\s*\);/i,
                    explanation: "I/O interativo: conectamos a interface do console do usuário à sub-rotina estática que faz a persistência física.",
                    expectedExample: "public class FluxoFinal {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String dig = sc.nextLine();\n    ArquivoUtil.criarArquivoLog(\"usr.txt\", dig);\n  }\n}",
                    hint: "Scanner lendo System.in na RAM repassando para criarArquivoLog salvar no disco."
                },
                {
                    instruction: "[Q30 - Fluxo em Lote] No main de 'FluxoFinal', instancie o vetor: 'String[] lista = {\"A\", \"B\"};'. Descarregue chamando 'GeradorDocumento.salvarVetor(lista, \"lote.txt\");'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static | Classes: FluxoFinal, String, GeradorDocumento | Métodos: main, salvarVetor | Variáveis: lista",
                    regex: /class\s+FluxoFinal[\s\S]*main[\s\S]*String\s*\[\s*\]\s*lista\s*=\s*\{\s*"A"\s*,\s*"B"\s*\}[\s\S]*GeradorDocumento\.salvarVetor\s*\(\s*lista\s*,\s*"lote\.txt"\s*\);/i,
                    explanation: "Dados em lote definidos no escopo principal orquestrando o despejo direto no disco rígido por meio de procedimento estático, fechando o modelo procedimental de I/O.",
                    expectedExample: "public class FluxoFinal {\n  public static void main(String[] args) {\n    String[] lista = {\"A\", \"B\"};\n    GeradorDocumento.salvarVetor(lista, \"lote.txt\");\n  }\n}",
                    hint: "Declare a matriz literal e passe a variável lista para o salvarVetor."
                }
            ]
        }
    },
    computed: {
        currentQuestion() { return this.questions[this.currentQuestionIndex]; },
        progressPercentage() { return (this.currentQuestionIndex / this.questions.length) * 100; }
    },
    methods: {
        typeLog(text, type, callback) {
            this.isTyping = true;
            this.logs.push({ text: '', type: type });
            let i = 0;
            const index = this.logs.length - 1;
            
            const typeWriter = () => {
                if (i < text.length) {
                    this.logs[index].text += text.charAt(i);
                    i++;
                    this.$refs.terminalBody.scrollTop = this.$refs.terminalBody.scrollHeight;
                    setTimeout(typeWriter, 15);
                } else {
                    this.isTyping = false;
                    if (callback) callback();
                }
            };
            typeWriter();
        },
        submitCode() {
            if (!this.userCode.trim()) {
                this.feedbackMsg = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio!";
                this.feedbackType = "warning";
                return;
            }

            this.attempts++;
            this.typeLog(`Compilando rotinas de I/O...`, 'log-info', () => {
                const code = this.userCode.replace(/\s+/g, ' ').trim();
                const passed = this.currentQuestion.regex.test(code);

                if (passed) {
                    this.handleSuccess();
                } else {
                    this.handleError();
                }
            });
        },
        handleSuccess() {
            this.score++;
            this.roundOver = true;
            this.feedbackMsg = "<i class='bi bi-check-circle-fill'></i> Elementos obrigatórios e lógica validados com sucesso!";
            this.feedbackType = "success";
            this.typeLog(`[SUCCESS] Testes passaram. Código atendeu às especificações literais requisitadas.`, 'log-success');
        },
        handleError() {
            if (this.attempts >= 3) {
                this.roundOver = true;
                this.feedbackMsg = "<i class='bi bi-x-circle'></i> Limite de tentativas alcançado. Verifique se as classes, métodos e variáveis correspondem à instrução.";
                this.feedbackType = "error";
                this.typeLog(`[ERROR] Falha estrutural repetida. Verifique os nomes exatos (maiúsculas/minúsculas). Round travado.`, 'log-error');
            } else {
                this.feedbackMsg = `<i class='bi bi-bug'></i> Erro. Faltam elementos obrigatórios (palavras reservadas, classes, métodos ou variáveis nomeadas). Tentativa ${this.attempts}/3.`;
                this.feedbackType = "warning";
                this.typeLog(`[WARN] Diferença detectada contra o gabarito. Lembre-se: Java diferencia letras e exige que variáveis, classes e métodos sejam declarados com nomes exatos.`, 'log-warning');
            }
        },
        requestHint() {
            if (this.hintsUsed < this.maxHints) {
                this.hintsUsed++;
                this.feedbackMsg = `<i class="bi bi-lightbulb"></i> <strong>Dica:</strong> ${this.currentQuestion.hint}`;
                this.feedbackType = "info";
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.resetRound();
                this.typeLog(`Carregando ambiente para desafio ${this.currentQuestionIndex + 1}...`, 'log-info');
            } else {
                this.gameOver = true;
                this.typeLog(`Treinamento finalizado. Gerando estatísticas...`, 'log-success');
            }
        },
        resetRound() {
            this.userCode = '';
            this.attempts = 0;
            this.roundOver = false;
            this.feedbackMsg = '';
            this.feedbackType = '';
        },
        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.gameOver = false;
            this.hintsUsed = 0;
            this.logs = [{ type: 'log-info', text: 'Ambiente Java reinicializado.' }];
            this.resetRound();
        },
        saveResultPDF() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                    <h1 style="color: #5C8069;">Relatório: JAVA PROCEDURAL I/O</h1>
                    <p><strong>Desafios Concluídos:</strong> ${this.questions.length}</p>
                    <p><strong>Pontuação Final:</strong> ${this.score}</p>
                    <p><strong>Dicas Utilizadas:</strong> ${this.hintsUsed}</p>
                    <hr>
                    <p><em>Este relatório atesta a participação e validação da estruturação de lógicas procedurais focadas exclusivamente em leitura, escrita, atualização e exclusão física de arquivos (CRUD) em Java.</em></p>
                </div>
            `;
            html2pdf().from(element).save('relatorio-javalogic-procedural.pdf');
        }
    }
}).mount('#app');