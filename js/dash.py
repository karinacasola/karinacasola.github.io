from browser import document, ajax, timer, window
import json

def atualizar_kpis(req):
    """
    Callback que recebe os dados do backend Python (FastAPI/Flask)
    e injeta os valores na tela.
    """
    if req.status == 200 or req.status == 0:
        try:
            dados = json.loads(req.text)
            
            # Exemplo de atualização de UI via Brython caso o backend mande os dados reais
            # Na PoC real, você selecionaria os elementos por ID
            print(f"Dados atualizados do sensor: {dados}")
            
        except Exception as e:
            print("Erro ao decodificar JSON:", e)

def puxar_dados_hardware():
    """
    Faz a requisição para a Camada 3/4 do Pipeline da Indústria 4.0
    """
    req = ajax.ajax()
    req.bind('complete', atualizar_kpis)
    # Supondo que sua API local esteja em /dados
    req.open('GET', '/dados', True) 
    req.send()

# Loop de atualização do Dashboard (a cada 5 segundos)
# timer.set_interval(puxar_dados_hardware, 5000)

print("Módulo Brython de IoT inicializado com sucesso!")