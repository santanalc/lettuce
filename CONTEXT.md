# Cinturão Verde Inteligente

Vocabulário compartilhado do produto para manter o SaaS e o agente Hermes falando a mesma língua.

## Rastreamento do projeto

O workspace canônico no Linear é `hackathon-open` e todos os tickets deste projeto usam o prefixo `HAC-`. Tickets `ENG-*` não devem ser criados, atualizados, vinculados ou usados como destino/referência operacional. O mapa canônico é `HAC-5`.

## Personas

**Pequeno produtor de hortaliças**:
Produtor familiar de pequena escala, com até 5 hectares cultivados, baixa digitalização, que usa celular/WhatsApp, decide o cultivo e a venda, e enfrenta dependência de atravessadores.
_Evitar_: agronegócio, produtor enterprise, agricultor familiar (categoria legal não decidida).

## Geografia

**Região-piloto**:
Mogi das Cruzes, usada como recorte geográfico principal do MVP e da primeira demonstração.
_Evitar_: tratar todo o Alto Tietê como igualmente coberto no piloto.

**Localidade da demonstração**:
Jundiapeba, em Mogi das Cruzes, é a localidade fixa da primeira demonstração; a generalização para outras localidades fica para depois. A recomendação deve deixar explícitas as premissas quando não houver dados específicos da propriedade.

**Acesso digital da persona**:
Smartphone Android, uso habitual de WhatsApp, conectividade móvel intermitente e preferência por texto curto, áudio e foto em vez de formulários longos.

**Dor principal do MVP**:
Planejamento econômico do ciclo de cultivo — decidir o que plantar e quando, acompanhar cuidados e riscos, estimar o investimento, consultar uma tabela contextualizada de preços e comparar cenários de receita e retorno na época provável de colheita.
_Evitar_: previsão exata de preço, retorno garantido, recomendação financeira autônoma.

**Métrica principal de valor**:
Tempo para transformar uma dúvida em um plano econômico de cultivo acionável, com cultura, janela de plantio, cuidados, riscos, investimento estimado e faixa de preço/retorno na colheita, em até 5 minutos.

**Jornada principal do MVP**:
Começar pela localidade e pelo tamanho do talhão; recomendar culturas e calendário conforme clima, época e premissas do terreno; explicar cuidados e riscos; e fechar com investimento estimado, tabela contextualizada de preços e cenários de retorno.

**Modos de entrada**:
No modo explorar o talhão, a cultura é recomendada pelo sistema. No modo avaliar cultura, o produtor informa a cultura e recebe o mesmo plano de cuidados, investimento e preço. Ambos usam localidade, área, data ou janela de plantio, irrigação e canal de venda.

**Parceiro de validação**:
A COOPROJUR é o primeiro alvo de validação pós-hackathon, com CATI/ATER como apoio técnico; COOPAVAT e COOPSAT são alternativas. O parceiro não é dependência da demo de um dia.

**Dados mínimos para o plano**:
Localidade, área cultivada, data ou janela pretendida de plantio, sistema de cultivo/irrigação e canal provável de venda; a cultura é obrigatória apenas no modo avaliar cultura. Custos, produtividade e preços entram como referências editáveis, com suas premissas visíveis.

**Plano de cultivo**:
Snapshot versionado para um talhão e ciclo que reúne entradas do produtor, calendário, cuidados, riscos, investimento e cenários econômicos com suas fontes e premissas.

**Canal de venda**:
Caminho provável pelo qual o lote será comercializado, como venda direta, cooperativa, atravessador ou atacado; contextualiza custos e preços, mas não garante comprador.

**Investimento estimado**:
Faixa calculada de custos do ciclo a partir de área, quantidades, unidades e valores editáveis. Não é orçamento fechado nem recomendação financeira.

**Oferta líquida**:
Valor de uma oferta após comissão, embalagem, frete, perdas e outros custos informados. Não é sinônimo de preço de referência ou resultado do ciclo.

**Eixos de análise territorial**:
O diagnóstico organiza a explicação em vulnerabilidade (sensibilidade e capacidade adaptativa), exposição e ameaça climática. A demo usa esses eixos para explicar produção e manejo, organização e assistência técnica, uso do solo e sinais de chuva, temperatura e evapotranspiração, sem fingir uma avaliação fundiária ou climática de precisão.

**Validação do hackathon**:
Sem entrevistas ou coorte real no dia da implementação. A demo usará um perfil representativo e dados-semente, cobrindo variações de cultura, área e canal de venda; a validação com cinco produtores fica para depois.

**Restrição do hackathon**:
Implementação demonstrável em um dia; ingestão completa de fontes, entrevistas, integrações externas e operação de piloto ficam fora desse corte.

**Faixa estimada de preço na colheita**:
Cenário contextualizado por cultura, qualidade, embalagem, unidade, volume, data, origem/destino e tipo de preço, sempre exibido com fonte, data, amostra e incerteza.
_Evitar_: cotação única, preço garantido, previsão pontual sem intervalo.

## Culturas

**Culturas iniciais do MVP**:
Alface, repolho, couve, couve-flor, cebolinha, cenoura, beterraba e brócolis. Esse conjunto representa folhosas, maçarias, raízes e brássicas presentes na produção local; não é o catálogo completo do município.

**Culturas da demonstração do hackathon**:
Alface, repolho e couve. São as três culturas de maior volume no recorte do Alto Tietê Cabeceiras estudado pela FGV; o produto explicita que repolho e couve são da mesma família e não representam rotação entre famílias.

## Modelo de cultivo

**Cultura**:
O que é plantado e colhido, como alface ou cenoura.

**Variedade**:
A cultivar específica de uma cultura, como alface crespa; não é uma cultura diferente.

**Ciclo**:
Uma produção temporal de uma cultura/variedade associada a um talhão.

**Plantio**:
O evento que inicia um ciclo.

**Propriedade**:
O imóvel ou unidade produtiva que agrupa um ou mais talhões; não é a unidade mínima de planejamento.

**Talhão**:
A unidade física cultivável, com área e localização, à qual um ciclo pertence. Um talhão pode receber ciclos sucessivos.

**Trato**:
Ação de manejo planejada ou executada em um ciclo, como irrigar, capinar ou adubar. Uma recomendação de trato não é registro de que o trato foi executado.

**Insumo**:
Material ou produto usado em um trato; sua existência não significa que foi recomendado ou aprovado.

**Ocorrência**:
Fato ou relato observado no campo, como sintoma, dano, falha de irrigação ou evento climático. Um relato do produtor permanece não verificado até haver evidência ou revisão.

**Colheita**:
Evento de retirada da produção de um ciclo. Um ciclo pode ter várias colheitas antes de ser encerrado.

**Lote**:
Conjunto de produção colhida com origem, data, quantidade e características de qualidade comuns; é a unidade comercial de referência, não o talhão.

**Cotação**:
Preço observado em uma fonte de mercado, sempre acompanhado de cultura/variedade, qualidade, embalagem, unidade, volume, data, origem/destino e tipo de preço.

**Oferta**:
Proposta específica de um comprador para um lote ou conjunto de condições. Não é sinônimo de cotação e não implica pagamento ou logística executados.

**Preço de referência**:
Faixa calculada a partir de cotações e, quando disponível, ofertas comparáveis normalizadas. É contextualizada e incerta; nunca é preço garantido.

**Risco climático**:
Avaliação, para um local e horizonte definidos, que combina ameaça, exposição e vulnerabilidade, com fonte, incerteza e ação preventiva. Não é uma certeza sobre o clima.

**Recomendação**:
Orientação acionável produzida a partir de fatos, dados externos e/ou cálculos, com premissas, fonte, data e confiança explícitas.

**Fonte**:
Origem rastreável de um dado, regra ou orientação, incluindo identificação e data de atualização quando disponíveis.

**Confiança**:
Sinal de qualidade e incerteza da informação ou recomendação, nunca uma garantia de verdade ou resultado.

**Aprovação técnica**:
Aceite explícito de um responsável técnico humano para orientação regulada ou de maior risco; o Hermes pode explicar e encaminhar, mas não substitui essa aprovação.

## Tipos de informação e limites do agente

- **Fato do produtor**: informação relatada pelo produtor sobre sua propriedade, talhão, cultivo ou ocorrência; deve ser identificada como relato.
- **Dado externo**: observação ou regra obtida de uma fonte rastreável.
- **Cálculo determinístico**: resultado reproduzível de uma fórmula e entradas visíveis, independente do modelo de linguagem.
- **Orientação genérica**: explicação educativa e de baixo risco, com fonte quando aplicável; não é prescrição personalizada.
- **Recomendação regulada**: orientação sujeita a fonte oficial e aprovação técnica, especialmente agrotóxicos; o Hermes não prescreve produto, dose ou aplicação de forma autônoma.

## Relações e estados essenciais

- Um produtor opera uma propriedade; uma propriedade contém talhões; um talhão recebe ciclos; um ciclo tem uma cultura e, opcionalmente, uma variedade.
- O plantio inicia o ciclo; tratos e ocorrências pertencem ao ciclo; colheitas geram lotes.
- Cotações e ofertas contextualizam lotes e alimentam o preço de referência; não se confundem com ele.
- Risco climático se vincula ao local e ao horizonte do ciclo; recomendações citam as fontes, fatos e cálculos que as sustentam.
- Um ciclo pode estar **planejado**, **em andamento**, **encerrado** ou **cancelado**; a primeira colheita não o encerra necessariamente.

## Referências

- [FGV — Cinturão Verde e diagnóstico do Alto Tietê](https://eaesp.fgv.br/sites/eaesp.fgv.br/files/u641/fgvces-cinturaoverde.pdf): ranking regional e culturas complementares, com base no IBGE/Censo Agropecuário 2017.
- [Prefeitura de Mogi — Cartilha Hortaliças](https://www.mogidascruzes.sp.gov.br/public/site/doc/202212141152246399d5181ec0d.pdf): destaques locais de folhosas, maçarias, raízes e tubérculos.
- [Prefeitura de Mogi — Agricultura familiar na merenda escolar](https://www.mogidascruzes.sp.gov.br/noticia/merenda-de-qualidade-prefeitura-de-mogi-das-cruzes-inicia-entrega-da-agricultura-familiar-para-escolas): confirmação recente de culturas fornecidas por famílias produtoras locais.
