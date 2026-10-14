# Especificação viva — Maratona Marvel

> **Documento de produto, engenharia, UX e evolução histórica**  
> **Versão documental:** 1.0 · **Referência:** implementação em `main` consultada em 14/10/2026 · **Idioma:** português brasileiro  
> **Repositório original:** https://github.com/michaelfdias/maratona-marvel  
> **Aplicação:** https://michaelfdias.github.io/maratona-marvel/  
> **Público-alvo secundário:** desenvolvedores e agentes de programação (por exemplo, Claude Code) que precisam **reconstruir uma experiência funcionalmente equivalente**, sem depender de contexto de conversa.
>
> **Hierarquia de verdade:** (1) código atual de `main` para comportamentos efetivamente existentes; (2) esta especificação para intenções, motivação, contratos e testes; (3) histórico de commits para decisões anteriores. Havendo divergência, registre-a e esclareça antes de modificar o produto. A documentação não autoriza concluir que algo foi testado visualmente apenas porque foi validado por leitura de código.

---

## 0. Como usar este documento como fonte de uma IA

Esta especificação não é apenas um backlog. É um **registro de produto**, com decisões aprovadas, mecanismos técnicos, formatos persistidos, critérios de aceite, casos de borda, compromissos de design, evolução e recursos rejeitados.

**Ao reconstruir do zero:**

1. Leia o `README.md` e este documento integralmente; examine o código-fonte atual, se disponível.
2. Reproduza as **regras de produto e interação**, não necessariamente a estrutura monolítica do HTML. Uma arquitetura modular moderna é possível, mas não deve alterar a experiência nem exigir login/backend.
3. Importe o catálogo de **70 IDs estáveis** e as sinopses; não substitua por uma listagem genérica nem reorganize silenciosamente a curadoria.
4. Implemente o modelo de dados, filtros, renderização, persistência, formulários e modos de exibição antes de refinamentos cinematográficos.
5. Garanta acessibilidade, Safari/iPhone, modo claro/escuro, controles por toque, performance mobile e importação/exportação.
6. Use a matriz de testes de aceite antes da publicação e não anuncie como validado algo que não executou.
7. Ao evoluir esta documentação, acrescente uma entrada ao diário de decisões e atualize a seção de **estado atual**, retirando prescrições de versões abandonadas.

### 0.1 Escopo do que é contrato e do que é liberdade

- **Contrato forte:** 70 filmes; 12 blocos; IDs estáveis; grupos; filtros; ordem editorial; seleção por filme ou seção; progresso local; configurações; persistência de seções; avaliações; backups; compartilhamento WhatsApp; identidade minimalista responsiva; páginas institucionais; separação entre lista pública e dados privados.
- **Contrato de comportamento:** toque no contador de uma seção expande/recolhe; toque no checkbox não; arraste em estrelas; voltar ao topo; preferência de tema compartilhada com páginas internas; celebrações no momento correto.
- **Contrato de design:** fundo calmo, vermelho Marvel apenas como destaque, hierarquia de leitura, tipografia responsiva, links com comportamento touch correto, rodapé cinematográfico full width, dedicatória sem caixas.
- **Liberdade de implementação:** frameworks, componentização, estado global, roteamento e bibliotecas leves, desde que o app continue rápido, acessível, publicável estaticamente, sem dependência de cadastro, sem regressões e fiel aos contratos.
- **Dado temporal:** anos futuros, nomes e disponibilidade dos filmes podem mudar; não pressupor que previsões editoriais são fatos imutáveis.

## 1. Visão, problema e posicionamento

### 1.1 Problema

Uma pessoa quer assistir aos filmes relacionados ao Universo Marvel, mas encontra três dificuldades: **qual ordem seguir**; **quais franquias são relevantes**; **quais títulos já viu ou ainda faltam**. Listas lineares comuns não ajudam a acompanhar um percurso extenso ou distinguir continuidade canônica de material contextual e opcional.

### 1.2 Proposta de valor

A **Maratona Marvel** é uma *watchlist editorial interativa*. Ela combina:

- **Curadoria:** orientação de visualização pensada para experiência narrativa e conexões entre filmes.
- **Organização pessoal:** estado de visto, data, avaliação, progresso e seções.
- **Controle do escopo:** do MCU estrito a uma maratona mais ampla.
- **Exploração contextual:** comentários e sinopses opcionais.
- **Autonomia:** sem conta, backend de usuário, cobrança ou sincronização obrigatória; backup sob controle do visitante.
- **Personalização e conforto:** bom uso no celular e desktop, modos claro/escuro e minimalista.
- **Afeto e compartilhamento:** identidade de cinéfilo, celebrações e convite para indicar a lista.

### 1.3 O que o produto NÃO é

- Não hospeda nem reproduz arquivos de vídeo; não fornece player, streaming, links ilícitos ou acesso aos filmes.
- Não é aplicação oficial da Marvel/Disney/Sony; não se atribui certificação ou chancela das franquias.
- Não mantém conta nem histórico sincronizado entre dispositivos; exportar/importar é a ferramenta de migração.
- Não promete disponibilidade atual em plataformas de streaming; o link do título **abre busca Google**.
- Não inclui todas as séries/especiais de streaming como itens do contador. A curadoria é de **longas-metragens**.
- Não promete ordem cronológica universal; a sequência é **editorialmente híbrida**, baseada no lançamento do MCU e nos blocos complementares.
- Não possui atualmente compartilhamento de **Instagram Stories** com cartaz/QR Code: esse experimento foi removido após avaliação negativa.

### 1.4 Princípios inegociáveis de UX

1. **Primeiro a lista:** nenhum efeito, publicidade, onboarding complexo ou navegação atrapalha a tarefa principal.
2. **Poucos cliques:** tornar diretamente acionáveis título da seção, subtítulo, contador, seta e espaço vazio do cabeçalho.
3. **Gestos não ambíguos:** o checkbox marca; o cabeçalho recolhe; a estrela avalia; o título de filme pesquisa.
4. **Estado durável:** recarregar não perde filmes, preferências ou seções recolhidas.
5. **Metadados proporcionais:** notas, anos, datas, estrelas e barra flutuante são opcionalmente visíveis.
6. **Indicação honesta:** compartilhamento descreve um guia, nunca conteúdo para assistir.
7. **Compatibilidade Safari:** evitar estados de foco/hover persistentes no toque e usar layout que não varie com a tipografia nativa.
8. **Respeito a movimento reduzido e acessibilidade:** não sacrificar teclado nem leitores de tela em nome da estética.
9. **Cuidar dos detalhes:** contraste, números tabulares, alinhamento vertical, alvos de toque e microcópia são parte do produto.
10. **Evoluir sem Frankenstein:** áreas transversais como o rodapé devem ter **design system único**, não CSS especial por página.

---

## 2. Arquitetura existente e opções de reconstrução

### 2.1 Implementação real (não idealizada)

Trata-se de uma aplicação estática com grande parte do HTML/CSS/JS **inline** em `index.html`, incluindo catálogo, sinopses e regras de interface. Não há compilação nem framework obrigatório. As páginas institucionais são HTMLs independentes.

| Caminho | Papel e observações |
| --- | --- |
| `/index.html` | Layout principal; CSS local; dataset `sections`; `synopses`; estado; renderização; interação; filtro; backups; celebrações; modal; menu minimalista. |
| `/sobre/index.html` | Página institucional de missão, recursos, privacidade básica, independência e contato. |
| `/ordem-recomendada/index.html` | Metodologia de ordenação, blocos X-Men/Aranha/Deadpool e distinção entre filtros. |
| `/privacidade/index.html` | Texto de política de privacidade sobre armazenamento, hospedagem e serviços externos. |
| `/shared-footer.css` | **Fonte CSS compartilhada** para rodapé em todas as páginas e botão fixo de voltar ao topo. |
| `/back-to-top.js` | **Script compartilhado** para atalho de retorno ao início e preferência persistida. |
| `/README.md` | Apresentação curta de uso e arquitetura. |
| `/docs/ESPECIFICACAO.md` | Este documento; fonte de requisitos, decisões e reconstrução. |

**Hospedagem:** GitHub Pages, com base de URLs sob `/maratona-marvel/`. **Analytics:** Cloudflare Web Analytics (beacon incluído nos documentos atuais). Sem base de dados de progresso, API proprietária ou registro de usuários.

**Atenção ao executar localmente:** há caminhos **absolutos** para `/maratona-marvel/shared-footer.css`, `/maratona-marvel/back-to-top.js` e páginas internas. Abrir `index.html` via `file://` pode funcionar parcialmente, mas um teste fiel deve usar servidor HTTP/HTTPS com essa base, ou adaptar os caminhos a outra hospedagem.

### 2.2 Arquitetura conceitual recomendada para implementação equivalente

Mesmo que o produto original seja monolítico, uma IA pode separar as responsabilidades:

- **Catálogo editorial**: matriz estática de seções e filmes; índice por ID; dicionário de sinopses.
- **Persistência**: um serviço `Storage` com leitura defensiva, escrita, schema/versão, exportação e importação.
- **Estado de apresentação**: preferências, filtro ativo, busca, agrupamento, sessões expandidas e sinopses temporárias.
- **Progresso**: funções puras para calcular vistos, percentuais, conclusão por seção, datas e avaliações.
- **Renderização**: componentes de capa, métricas, filtros, lista, linha de filme, seções, modal, rodapé e páginas institucionais.
- **Interação**: click/pointer/touch/keyboard, foco, modais, menu lateral, scroll e animação.
- **Serviços transversais**: preferência de tema compartilhada, configuração voltar ao topo, compartilhamento, analytics.
- **Testes**: unidades do domínio, integração de DOM e smoke visual mobile/desktop.

Essa divisão **é uma recomendação arquitetural**, não algo que já exista como módulos separados no original.

### 2.3 Abordagem de renderização atual

O código monta a lista com template strings e substitui `root.innerHTML` a cada alteração que exija novo desenho. Event handlers de lista são delegados ao elemento persistente `#list`, evitando registrar listeners individuais a cada reconstrução. O modelo de dados é separado do DOM. Estados efêmeros (ex.: sinopse expandida durante a sessão, gesto de arraste) coexistem com estado salvo em `localStorage`.

**Ao reconstruir:** preserve IDs e semântica dos controles. Evite perder foco de teclado ao renderizar; se alterar o DOM, restaure foco de forma intencional. Não use `innerHTML` com conteúdo não confiável sem escaping. A implementação atual usa função `esc` para caracteres HTML.

---

## 3. Domínio: catálogo, IDs, classes e ordem editorial

### 3.1 Universo da lista

**O snapshot consultado contém exatamente:**

- **70** filmes, todos com IDs únicos.
- **12** seções editoriais.
- **40** filmes `group: "mcu"`.
- **12** filmes `group: "recommended"`.
- **18** filmes `group: "optional"`.
- **52** com `tier: "high"` e **18** com `tier: "optional"`.
- **70** sinopses completas (uma por ID).
- Campo `star: true` em seis filmes, utilizado como marcador editorial no dataset (não confundir com avaliação privada).
- Dois títulos marcados `future: true` no snapshot de referência: *Vingadores: Doomsday* (2026) e *Vingadores: Guerras Secretas* (2027).

**O grupo não é o mesmo conceito de fase:** um bloco de X-Men pode conter itens recomendados e opcionais; o filtro depende do campo `group`, não da posição do filme na tela.

### 3.2 Esquema de dados de cada filme

Exemplo semanticamente fiel (campos originais preservados):

```json
{
  "id": "iron-man-2008",
  "pt": "Homem de Ferro",
  "en": "Iron Man",
  "year": 2008,
  "note": "Comentário editorial sobre relevância e contexto do filme.",
  "tier": "high",
  "star": false,
  "future": false,
  "group": "mcu"
}
```

**Contrato:**

| Campo | Tipo | Semântica |
| --- | --- | --- |
| `id` | string estável | Chave primária de progresso, datas, avaliação e sinopse. Não usar índice ou título como chave. |
| `pt` | string | Nome em português usado na interface por padrão. |
| `en` | string | Nome em inglês no seletor de idioma e na busca. |
| `year` | inteiro | Ano de lançamento editorial. Previsto quando `future` for verdadeiro. |
| `note` | string | Comentário editorial breve, opcionalmente visível na linha do filme. |
| `tier` | `"high" | "optional"` | Peso editorial; `"optional"` habilita o selo “Opcional”. |
| `star` | boolean | Sinalização presente no catálogo; não confundir com rating pessoal. |
| `future` | boolean | Filme ainda tratado como previsto no catálogo de referência. |
| `group` | `"mcu" | "recommended" | "optional"` | Determina escopo dos filtros. |

Seção: `{ name: string, subtitle: string, items: Film[] }`. A ordem dos objetos no array `sections` **é a ordem sugerida de exibição**.

### 3.3 Por que a ordem não é simplesmente cronológica

A principal narrativa segue a **ordem de lançamento do MCU**, preservando descobertas, introduções de personagens e significado de cenas pós-créditos. Contudo, franquias de outros estúdios não são misturadas indiscriminadamente por data. Elas são apresentadas **em blocos completos, inseridos antes de pontos do MCU onde suas referências são relevantes**. É por isso que X-Men aparece depois da Saga do Infinito e que os filmes anteriores de Homem-Aranha vêm antes de *Sem Volta para Casa*. Deadpool e conexões antecedem *Deadpool & Wolverine*. A ordem editorial é opinativa, explicada publicamente, não uma afirmação de continuidade canônica universal.

**Alternativa:** o usuário pode optar por **organizar por ano de lançamento** nas configurações; nesse caso a lista vira grupos por ano, com desempate pela sequência original (`sequence = sectionIndex * 100 + filmIndex`). O progresso acompanha os IDs, não a posição em tela.

### 3.4 Contrato dos três filtros

| Opção exibida | Regra | Total sem busca |
| --- | --- | ---: |
| **Todos os filmes** | Sem restrição de grupo | **70** |
| **MCU** | `film.group === "mcu"` | **40** |
| **MCU + recomendados** | `film.group !== "optional"` | **52** |

A aplicação combina filtro e busca usando **AND** (um filme precisa pertencer ao escopo *e* corresponder ao texto pesquisado). O denominador do progresso visível é a quantidade de filmes resultantes desses critérios.

### 3.5 Fonte de dados para uma reconstrução independente

Abaixo segue o **catálogo exato de referência**, extraído diretamente do `sections` atual. Inclui IDs, títulos, anos, classes, sinalização temporal e comentários editoriais. As **70 sinopses originais** aparecem no apêndice seguinte. Para futura curadoria, revise os dois apêndices em conjunto.

**Legenda:** `M` = MCU; `R` = recomendado; `O` = opcional. `★` identifica a marcação `star`; `⏳` indica `future`.


#### 1. Fase 1 · A formação da equipe

*Saga do Infinito · 2008–2012* — **6 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `iron-man-2008` | **Homem de Ferro** / *Iron Man* | 2008 | M | Tony Stark constrói a primeira armadura após ser capturado e inaugura o MCU. Introduz a tecnologia, o carisma e os conflitos que moldam os Vingadores. |
| `the-incredible-hulk-2008` | **O Incrível Hulk** / *The Incredible Hulk* | 2008 | M | Bruce Banner tenta controlar uma transformação provocada por radiação gama. Integra o MCU, embora o ator principal seja substituído nos filmes seguintes. |
| `iron-man-2-2010` | **Homem de Ferro 2** / *Iron Man 2* | 2010 | M | Tony enfrenta as consequências de revelar sua identidade e lida com rivais perigosos. Amplia o papel da SHIELD e introduz Natasha Romanoff. |
| `thor-2011` | **Thor** / *Thor* | 2011 | M | O príncipe de Asgard é enviado à Terra para aprender humildade. Apresenta Loki, os deuses asgardianos e a dimensão cósmica do universo Marvel. |
| `captain-america-the-first-avenger-2011` | **Capitão América: O Primeiro Vingador** / *Captain America: The First Avenger* | 2011 | M | Na Segunda Guerra, Steve Rogers recebe o soro do supersoldado. Sua história introduz a HYDRA e um artefato decisivo para a Saga do Infinito. |
| `the-avengers-2012` | **Os Vingadores** / *The Avengers* | 2012 | M ★ | Uma invasão liderada por Loki obriga os heróis a se unirem pela primeira vez. É o grande pagamento das histórias individuais da Fase 1. |

#### 2. Fase 2 · Expansão e conflito interno

*Saga do Infinito · 2013–2015* — **6 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `iron-man-3-2013` | **Homem de Ferro 3** / *Iron Man 3* | 2013 | M | Após a batalha de Nova York, Tony enfrenta ansiedade e uma nova ameaça. Explora quem ele é além da armadura e o custo pessoal de ser herói. |
| `thor-the-dark-world-2013` | **Thor: O Mundo Sombrio** / *Thor: The Dark World* | 2013 | M | Thor enfrenta uma força antiga ligada ao Éter. A trama apresenta uma Joia do Infinito e prepara elementos importantes para os próximos filmes. |
| `captain-america-the-winter-soldier-2014` | **Capitão América: O Soldado Invernal** / *Captain America: The Winter Soldier* | 2014 | M | Steve e Natasha descobrem uma conspiração dentro da SHIELD. Um thriller de espionagem que altera profundamente o equilíbrio político do MCU. |
| `guardians-of-the-galaxy-2014` | **Guardiões da Galáxia** / *Guardians of the Galaxy* | 2014 | M | Um grupo improvável de foras da lei precisa proteger um artefato cósmico. Expande o MCU para o espaço e aprofunda a história das Joias. |
| `avengers-age-of-ultron-2015` | **Vingadores: Era de Ultron** / *Avengers: Age of Ultron* | 2015 | M ★ | Uma tentativa de proteger a humanidade dá origem a Ultron. Reúne os Vingadores, apresenta novos heróis e planta conflitos para o futuro. |
| `ant-man-2015` | **Homem-Formiga** / *Ant-Man* | 2015 | M | Scott Lang assume um traje capaz de alterar seu tamanho para impedir um roubo perigoso. Introduz Hank Pym e conceitos ligados ao Reino Quântico. |

#### 3. Fase 3 · O auge da Saga do Infinito

*Saga do Infinito · 2016–2019* — **11 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `captain-america-civil-war-2016` | **Capitão América: Guerra Civil** / *Captain America: Civil War* | 2016 | M | Um conflito sobre a supervisão dos heróis divide os Vingadores em dois lados. Apresenta o Homem-Aranha de Tom Holland e o Pantera Negra. |
| `doctor-strange-2016` | **Doutor Estranho** / *Doctor Strange* | 2016 | M | Um cirurgião arrogante descobre as artes místicas após um acidente. Abre as portas para outras dimensões e para a magia no MCU. |
| `guardians-of-the-galaxy-vol.-2-2017` | **Guardiões da Galáxia Vol. 2** / *Guardians of the Galaxy Vol. 2* | 2017 | M | Peter Quill investiga suas origens enquanto os Guardiões aprendem o significado de família. Aprofunda os laços e as diferenças entre eles. |
| `spider-man-homecoming-2017` | **Homem-Aranha: De Volta ao Lar** / *Spider-Man: Homecoming* | 2017 | M | Peter Parker tenta conciliar escola e heroísmo sob a orientação de Tony Stark. Mostra o lado cotidiano do MCU após Guerra Civil. |
| `thor-ragnarok-2017` | **Thor: Ragnarok** / *Thor: Ragnarok* | 2017 | M | Thor enfrenta Hela e o destino de Asgard, com Hulk e Loki envolvidos. O desfecho se conecta diretamente ao começo de Guerra Infinita. |
| `black-panther-2018` | **Pantera Negra** / *Black Panther* | 2018 | M | T’Challa assume o trono de Wakanda e enfrenta um rival que questiona seu legado. Apresenta mais da nação e de sua tecnologia. |
| `avengers-infinity-war-2018` | **Vingadores: Guerra Infinita** / *Avengers: Infinity War* | 2018 | M ★ | Thanos reúne as Joias do Infinito enquanto heróis da Terra e do espaço tentam detê-lo. Um dos grandes pontos de convergência do MCU. |
| `ant-man-and-the-wasp-2018` | **Homem-Formiga e a Vespa** / *Ant-Man and the Wasp* | 2018 | M | Scott e Hope investigam os mistérios do Reino Quântico. A cena pós-créditos ajuda a conectar o filme aos eventos de Guerra Infinita. |
| `captain-marvel-2019` | **Capitã Marvel** / *Captain Marvel* | 2019 | M | Ambientado nos anos 1990, apresenta Carol Danvers e a origem de sua ligação com Nick Fury. Amplia a dimensão cósmica do MCU. |
| `avengers-endgame-2019` | **Vingadores: Ultimato** / *Avengers: Endgame* | 2019 | M ★ | Os heróis sobreviventes tentam reverter as consequências de Thanos. É a conclusão emocional e narrativa da Saga do Infinito. |
| `spider-man-far-from-home-2019` | **Homem-Aranha: Longe de Casa** / *Spider-Man: Far From Home* | 2019 | M | Peter viaja à Europa tentando seguir em frente após Ultimato. Explora o legado de Tony Stark e encerra a Fase 3. |

#### 4. Especial · A Saga X-Men

*Dos primeiros mutantes ao legado de Wolverine* — **11 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `x-men-2000` | **X-Men: O Filme** / *X-Men* | 2000 | R | Apresenta Wolverine, Xavier e Magneto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x2-2003` | **X-Men 2** / *X2* | 2003 | R | Aprofunda o conflito entre mutantes e humanos. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x-men-the-last-stand-2006` | **X-Men: O Confronto Final** / *X-Men: The Last Stand* | 2006 | O | Fecha a trilogia original. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-origins-wolverine-2009` | **X-Men Origens: Wolverine** / *X-Men Origins: Wolverine* | 2009 | O | Explora o passado de Logan. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-first-class-2011` | **X-Men: Primeira Classe** / *X-Men: First Class* | 2011 | R | Mostra a origem da relação Xavier–Magneto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-wolverine-2013` | **Wolverine: Imortal** / *The Wolverine* | 2013 | O | Aventura solo no Japão. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-days-of-future-past-2014` | **X-Men: Dias de um Futuro Esquecido** / *X-Men: Days of Future Past* | 2014 | R | Conecta gerações e altera a linha do tempo. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x-men-apocalypse-2016` | **X-Men: Apocalipse** / *X-Men: Apocalypse* | 2016 | O | Continua a história da equipe jovem. É um complemento independente, sem necessidade para seguir a história central. |
| `logan-2017` | **Logan** / *Logan* | 2017 | R | Despedida marcante de Wolverine; importante para Deadpool & Wolverine. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `dark-phoenix-2019` | **X-Men: Fênix Negra** / *Dark Phoenix* | 2019 | O | Desfecho da equipe jovem. É um complemento independente, sem necessidade para seguir a história central. |
| `the-new-mutants-2020` | **Os Novos Mutantes** / *The New Mutants* | 2020 | O | História paralela, sem necessidade para o MCU. É um complemento independente, sem necessidade para seguir a história central. |

#### 5. Fase 4 · Novos heróis e novas lendas

*Saga do Multiverso · 2021* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `black-widow-2021` | **Viúva Negra** / *Black Widow* | 2021 | M | Uma história situada antes de Ultimato. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `shang-chi-and-the-legend-of-the-ten-rings-2021` | **Shang-Chi e a Lenda dos Dez Anéis** / *Shang-Chi and the Legend of the Ten Rings* | 2021 | M | Apresenta um novo herói. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `eternals-2021` | **Eternos** / *Eternals* | 2021 | M | Expande a mitologia cósmica. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 6. Especial · Os outros Homens-Aranha

*As histórias de Tobey Maguire e Andrew Garfield, antes de Sem Volta para Casa* — **5 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `spider-man-2002` | **Homem-Aranha** / *Spider-Man* | 2002 | R | Primeiro filme da trilogia de Tobey Maguire. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `spider-man-2-2004` | **Homem-Aranha 2** / *Spider-Man 2* | 2004 | R | Continua a jornada de Peter Parker. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `spider-man-3-2007` | **Homem-Aranha 3** / *Spider-Man 3* | 2007 | R | Encerra a trilogia de Tobey. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-amazing-spider-man-2012` | **O Espetacular Homem-Aranha** / *The Amazing Spider-Man* | 2012 | R | Nova versão com Andrew Garfield. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-amazing-spider-man-2-2014` | **O Espetacular Homem-Aranha 2: A Ameaça de Electro** / *The Amazing Spider-Man 2* | 2014 | R | Conclui a duologia de Andrew Garfield. Ajuda a reconhecer personagens e referências nos encontros entre universos. |

#### 7. Fase 4 · O multiverso se abre

*Saga do Multiverso · 2021–2022* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `spider-man-no-way-home-2021` | **Homem-Aranha: Sem Volta para Casa** / *Spider-Man: No Way Home* | 2021 | M | Um feitiço dá errado e coloca Peter diante das consequências do multiverso. Ganha muito mais impacto após os filmes de Tobey e Andrew. |
| `doctor-strange-in-the-multiverse-of-madness-2022` | **Doutor Estranho no Multiverso da Loucura** / *Doctor Strange in the Multiverse of Madness* | 2022 | M | Stephen Strange atravessa realidades alternativas para proteger uma jovem com poderes raros. WandaVision oferece contexto essencial para Wanda. |
| `thor-love-and-thunder-2022` | **Thor: Amor e Trovão** / *Thor: Love and Thunder* | 2022 | M | Continua a trajetória de seus protagonistas e amplia o universo Marvel. Vale acompanhar para conhecer melhor os personagens e suas relações. |
| `black-panther-wakanda-forever-2022` | **Pantera Negra: Wakanda Para Sempre** / *Black Panther: Wakanda Forever* | 2022 | M | A sucessão do legado de Wakanda. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 8. Fase 5 · Novas ameaças

*Saga do Multiverso · 2023* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `ant-man-and-the-wasp-quantumania-2023` | **Homem-Formiga e a Vespa: Quantumania** / *Ant-Man and the Wasp: Quantumania* | 2023 | M | Explora o Reino Quântico. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `guardians-of-the-galaxy-vol.-3-2023` | **Guardiões da Galáxia Vol. 3** / *Guardians of the Galaxy Vol. 3* | 2023 | M | Conclusão emocional de um ciclo da equipe. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `the-marvels-2023` | **As Marvels** / *The Marvels* | 2023 | M | Continuação conectada a Ms. Marvel e WandaVision. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 9. Especial · Deadpool e conexões

*As aventuras e referências que enriquecem Deadpool & Wolverine* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `fantastic-four-2005` | **Quarteto Fantástico** / *Fantastic Four* | 2005 | O | Conheça a formação clássica da Fox. É um complemento independente, sem necessidade para seguir a história central. |
| `fantastic-four-rise-of-the-silver-surfer-2007` | **Quarteto Fantástico e o Surfista Prateado** / *Fantastic Four: Rise of the Silver Surfer* | 2007 | O | Continuação da equipe original da Fox. É um complemento independente, sem necessidade para seguir a história central. |
| `deadpool-2016` | **Deadpool** / *Deadpool* | 2016 | R | Apresenta Wade Wilson; conteúdo adulto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `deadpool-2-2018` | **Deadpool 2** / *Deadpool 2* | 2018 | R | Fundamental para entender suas relações; conteúdo adulto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |

#### 10. Fase 5 · Encontros e novas equipes

*Saga do Multiverso · 2024–2025* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `deadpool-and-wolverine-2024` | **Deadpool & Wolverine** / *Deadpool & Wolverine* | 2024 | M | Wade Wilson e Wolverine enfrentam problemas envolvendo a TVA e diferentes realidades. Deadpool 1–2, Logan e Loki enriquecem as referências. |
| `captain-america-brave-new-world-2025` | **Capitão América: Admirável Mundo Novo** / *Captain America: Brave New World* | 2025 | M | Sam Wilson lidera uma nova fase do Capitão América. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `thunderbolts*-2025` | **Thunderbolts*** / *Thunderbolts** | 2025 | M | Uma equipe formada por figuras improváveis. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 11. Fase 6 · Rumo ao desfecho

*Saga do Multiverso · 2025–2027* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `the-fantastic-four-first-steps-2025` | **Quarteto Fantástico: Primeiros Passos** / *The Fantastic Four: First Steps* | 2025 | M | Apresenta uma nova versão da Primeira Família. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `spider-man-brand-new-day-2026` | **Homem-Aranha: Um Novo Dia** / *Spider-Man: Brand New Day* | 2026 | M | Continua a história de Peter Parker depois de Sem Volta para Casa. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `avengers-doomsday-2026` | **Vingadores: Doomsday** / *Avengers: Doomsday* | 2026 ⏳ | M ★ | Próximo grande encontro anunciado dos Vingadores, previsto para dezembro de 2026. A trama deve ampliar os conflitos multiversais. |
| `avengers-secret-wars-2027` | **Vingadores: Guerras Secretas** / *Avengers: Secret Wars* | 2027 ⏳ | M ★ | Grande evento anunciado para dezembro de 2027 e planejado como encerramento da Saga do Multiverso. |

#### 12. Extras · Outras adaptações da Marvel

*Complementos opcionais para curiosos* — **10 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `hulk-2003` | **Hulk** / *Hulk* | 2003 | O | Versão independente de Ang Lee, não é prequela do Hulk de 2008. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-1998` | **Blade, o Caçador de Vampiros** / *Blade* | 1998 | O | Filme de origem da trilogia de Wesley Snipes; conteúdo adulto. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-ii-2002` | **Blade II** / *Blade II* | 2002 | O | Continuação da franquia de vampiros. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-trinity-2004` | **Blade: Trinity** / *Blade: Trinity* | 2004 | O | Encerra a trilogia. É um complemento independente, sem necessidade para seguir a história central. |
| `daredevil-2003` | **Demolidor: O Homem Sem Medo** / *Daredevil* | 2003 | O | Versão cinematográfica anterior ao MCU. É um complemento independente, sem necessidade para seguir a história central. |
| `elektra-2005` | **Elektra** / *Elektra* | 2005 | O | Derivado do Demolidor de 2003. É um complemento independente, sem necessidade para seguir a história central. |
| `fantastic-four-2015` | **Quarteto Fantástico** / *Fantastic Four* | 2015 | O | Reboot independente da franquia. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-2018` | **Venom** / *Venom* | 2018 | O | Universo Sony, com ligação pontual ao multiverso. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-let-there-be-carnage-2021` | **Venom: Tempo de Carnificina** / *Venom: Let There Be Carnage* | 2021 | O | Contém conexão nas cenas adicionais. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-the-last-dance-2024` | **Venom: A Última Rodada** / *Venom: The Last Dance* | 2024 | O | Conclusão da trilogia Sony. É um complemento independente, sem necessidade para seguir a história central. |

### 3.6 Sinopses originais vinculadas aos IDs

O seguinte dicionário de conteúdo é parte dos requisitos editoriais do snapshot. Ao migrar, **associe por ID**, nunca por nome ou posição. A apresentação padrão usa painéis individuais fechados; ler uma sinopse não marca o filme como visto.

#### Fase 1 · A formação da equipe

**Homem de Ferro** — `iron-man-2008`

Após ser capturado durante uma demonstração de armamentos, Tony Stark constrói uma armadura para escapar. De volta para casa, o empresário passa a questionar o impacto das armas de sua companhia e decide usar sua tecnologia para enfrentar novas ameaças.

**O Incrível Hulk** — `the-incredible-hulk-2008`

Bruce Banner vive escondido enquanto procura uma cura para a condição que o transforma em uma criatura de força extraordinária quando perde o controle. Sua tentativa de permanecer longe dos militares é ameaçada por um experimento que cria um adversário igualmente perigoso.

**Homem de Ferro 2** — `iron-man-2-2010`

Com sua identidade de Homem de Ferro conhecida mundialmente, Tony Stark enfrenta pressões do governo, problemas de saúde e um rival que desenvolve tecnologia semelhante à sua. Para superar essas ameaças, ele precisa aceitar a ajuda de antigos e novos aliados.

**Thor** — `thor-2011`

Thor, herdeiro do trono de Asgard, é banido para a Terra após desafiar as ordens do pai. Sem seus poderes, precisa aprender a conviver com humanos e demonstrar que merece seu martelo, enquanto seu irmão Loki trama para conquistar espaço em Asgard.

**Capitão América: O Primeiro Vingador** — `captain-america-the-first-avenger-2011`

Durante a Segunda Guerra Mundial, o jovem Steve Rogers quer servir ao país, mas não consegue se alistar por causa de sua saúde frágil. Selecionado para um experimento militar, torna-se o Capitão América e enfrenta uma organização que pretende usar uma energia misteriosa como arma.

**Os Vingadores** — `the-avengers-2012`

Quando Loki chega à Terra com um exército alienígena e ameaça a humanidade, Nick Fury reúne heróis que até então agiam separadamente. Homem de Ferro, Capitão América, Thor, Hulk, Viúva Negra e Gavião Arqueiro precisam superar suas diferenças para lutar juntos.

#### Fase 2 · Expansão e conflito interno

**Homem de Ferro 3** — `iron-man-3-2013`

Abalado pelos acontecimentos em Nova York, Tony Stark passa a depender cada vez mais de suas armaduras. Quando um terrorista conhecido como Mandarim ameaça pessoas próximas a ele, Tony enfrenta um desafio que coloca sua identidade e seus recursos à prova.

**Thor: O Mundo Sombrio** — `thor-the-dark-world-2013`

Uma antiga força desperta quando Jane Foster entra em contato com uma energia misteriosa. Thor precisa protegê-la e impedir que Malekith, líder dos Elfos Negros, utilize esse poder para mergulhar os Nove Reinos na escuridão.

**Capitão América: O Soldado Invernal** — `captain-america-the-winter-soldier-2014`

Tentando se adaptar ao mundo moderno, Steve Rogers trabalha para a SHIELD, mas descobre que nem tudo é o que parece. Ao lado de Natasha Romanoff e Sam Wilson, ele investiga uma conspiração enquanto é perseguido por um assassino extremamente habilidoso.

**Guardiões da Galáxia** — `guardians-of-the-galaxy-2014`

O aventureiro Peter Quill rouba um objeto cobiçado por forças poderosas e acaba formando uma aliança improvável com Gamora, Drax, Rocket e Groot. Entre fugas e desentendimentos, o grupo precisa impedir que o artefato seja usado para destruir mundos.

**Vingadores: Era de Ultron** — `avengers-age-of-ultron-2015`

Tony Stark e Bruce Banner tentam criar um sistema de defesa global, mas o projeto ganha consciência e conclui que a humanidade é o verdadeiro problema. Os Vingadores se reúnem para impedir Ultron e lidar com novos aliados e inimigos.

**Homem-Formiga** — `ant-man-2015`

O ex-presidiário Scott Lang recebe a oportunidade de mudar de vida quando o cientista Hank Pym o recruta para uma missão. Equipado com um traje que permite encolher e ampliar sua força, Scott precisa executar um roubo que poderá evitar uma grave ameaça.

#### Fase 3 · O auge da Saga do Infinito

**Capitão América: Guerra Civil** — `captain-america-civil-war-2016`

Após uma missão com consequências internacionais, os governos exigem maior controle sobre os Vingadores. A proposta divide a equipe entre os que defendem a supervisão e os que temem perder a liberdade de agir, transformando antigos aliados em adversários.

**Doutor Estranho** — `doctor-strange-2016`

O brilhante cirurgião Stephen Strange perde a precisão das mãos em um acidente e procura tratamentos que a medicina não oferece. Sua busca o leva a aprender artes místicas e a descobrir ameaças que ultrapassam a realidade conhecida.

**Guardiões da Galáxia Vol. 2** — `guardians-of-the-galaxy-vol.-2-2017`

Enquanto tentam manter a equipe unida, os Guardiões encontram um ser poderoso que afirma conhecer a verdadeira origem de Peter Quill. Revelações sobre família, lealdade e passado colocam os integrantes do grupo diante de decisões difíceis.

**Homem-Aranha: De Volta ao Lar** — `spider-man-homecoming-2017`

Depois de participar de uma missão com os Vingadores, Peter Parker volta à rotina escolar e tenta provar que está pronto para desafios maiores. Sua investigação sobre armas alienígenas o coloca no caminho de um criminoso conhecido como Abutre.

**Thor: Ragnarok** — `thor-ragnarok-2017`

Thor descobre que uma inimiga poderosa ameaça Asgard e acaba preso em um planeta distante, onde é forçado a lutar em uma arena. Para voltar para casa, precisa reunir aliados improváveis, incluindo Hulk e Loki, antes que seu mundo seja destruído.

**Pantera Negra** — `black-panther-2018`

Após a morte do pai, T’Challa retorna a Wakanda para assumir o trono e proteger os segredos de sua nação. Um adversário com ligação ao passado da família real desafia seu direito de governar e suas ideias sobre o papel de Wakanda no mundo.

**Vingadores: Guerra Infinita** — `avengers-infinity-war-2018`

Thanos inicia uma campanha para reunir seis Joias do Infinito e impor sua visão de equilíbrio ao universo. Heróis espalhados pela Terra e pelo espaço tentam impedir seus planos, mesmo sem saber se terão forças suficientes para detê-lo.

**Homem-Formiga e a Vespa** — `ant-man-and-the-wasp-2018`

Scott Lang tenta cumprir sua prisão domiciliar enquanto Hope van Dyne e Hank Pym buscam uma maneira de resgatar Janet do Reino Quântico. A missão se complica quando uma misteriosa mulher capaz de atravessar objetos também passa a disputar a tecnologia.

**Capitã Marvel** — `captain-marvel-2019`

Nos anos 1990, uma guerreira conhecida como Vers chega à Terra durante uma guerra entre povos alienígenas. Ao investigar lembranças fragmentadas de seu passado, ela conhece Nick Fury e descobre pistas sobre sua verdadeira identidade e seus poderes.

**Vingadores: Ultimato** — `avengers-endgame-2019`

Depois de uma perda devastadora, os Vingadores sobreviventes tentam encontrar uma forma de reparar os danos causados por Thanos. Uma possibilidade inesperada exige coragem, sacrifícios e a colaboração de heróis que ainda acreditam em uma segunda chance.

**Homem-Aranha: Longe de Casa** — `spider-man-far-from-home-2019`

Peter Parker viaja à Europa com colegas da escola na esperança de aproveitar as férias e deixar as responsabilidades heroicas de lado. Mas estranhas criaturas ameaçam cidades e um novo aliado chamado Mysterio surge para ajudá-lo.

#### Especial · A Saga X-Men

**X-Men: O Filme** — `x-men-2000`

Em um mundo no qual mutantes são temidos por suas habilidades, o professor Charles Xavier mantém uma escola para jovens com poderes especiais. Enquanto Wolverine e Vampira procuram um lugar seguro, Magneto prepara um plano para alterar a relação entre mutantes e humanos.

**X-Men 2** — `x2-2003`

Um ataque misterioso à Casa Branca amplia o medo dos mutantes e leva o governo a agir contra a escola de Xavier. Os X-Men precisam encontrar um inimigo que conhece profundamente seus poderes e ameaça toda a comunidade mutante.

**X-Men: O Confronto Final** — `x-men-the-last-stand-2006`

A descoberta de uma possível cura para as mutações divide opiniões e intensifica a tensão entre humanos e mutantes. Ao mesmo tempo, o retorno de uma força excepcional coloca os X-Men diante de um conflito pessoal e de uma batalha de grandes proporções.

**X-Men Origens: Wolverine** — `x-men-origins-wolverine-2009`

Logan atravessa décadas de conflitos ao lado de seu meio-irmão Victor Creed, até ser recrutado para um programa militar secreto. Traições e experiências perigosas ajudam a explicar como ele recebeu suas garras de adamantium e perdeu parte de suas lembranças.

**X-Men: Primeira Classe** — `x-men-first-class-2011`

Durante a Guerra Fria, o jovem Charles Xavier conhece Erik Lehnsherr, um mutante marcado por experiências traumáticas. Os dois formam uma equipe para impedir uma ameaça mundial, mas suas opiniões diferentes sobre a humanidade começam a separá-los.

**Wolverine: Imortal** — `the-wolverine-2013`

Atormentado por acontecimentos do passado, Logan viaja ao Japão a convite de um homem que conheceu décadas antes. Envolvido em disputas familiares e perseguições, ele se vê vulnerável de uma maneira inesperada e precisa decidir pelo que ainda vale lutar.

**X-Men: Dias de um Futuro Esquecido** — `x-men-days-of-future-past-2014`

Em um futuro no qual máquinas caçam mutantes, os X-Men elaboram um plano para evitar a catástrofe. A consciência de Wolverine é enviada ao passado, onde ele precisa reunir antigos aliados e impedir um acontecimento que mudará a história.

**X-Men: Apocalipse** — `x-men-apocalypse-2016`

Um mutante ancestral desperta após milhares de anos e decide reconstruir o mundo à sua imagem. Enquanto recruta seguidores poderosos, Charles Xavier e seus alunos tentam impedir a destruição e descobrir a extensão de suas próprias habilidades.

**Logan** — `logan-2017`

Em um futuro próximo, Logan vive isolado e cuida de um Charles Xavier debilitado. Seu desejo de permanecer fora dos conflitos termina quando uma menina com capacidades extraordinárias precisa de proteção contra forças que a perseguem.

**X-Men: Fênix Negra** — `dark-phoenix-2019`

Durante uma missão de resgate no espaço, Jean Grey entra em contato com uma força cósmica que amplifica seus poderes. Conforme perde o controle, antigos laços são colocados à prova e a equipe precisa decidir como proteger a todos.

**Os Novos Mutantes** — `the-new-mutants-2020`

Cinco jovens com habilidades extraordinárias são mantidos em uma instituição isolada, supostamente para aprender a controlar seus poderes. À medida que acontecimentos assustadores se intensificam, eles questionam as intenções de quem os mantém ali.

#### Fase 4 · Novos heróis e novas lendas

**Viúva Negra** — `black-widow-2021`

Natasha Romanoff é obrigada a confrontar lembranças de sua vida como espiã quando uma conspiração ligada ao programa que a treinou vem à tona. Ao reencontrar pessoas de seu passado, ela enfrenta um inimigo que controla assassinas altamente preparadas.

**Shang-Chi e a Lenda dos Dez Anéis** — `shang-chi-and-the-legend-of-the-ten-rings-2021`

Shang-Chi tenta levar uma vida discreta em São Francisco, mas seu passado volta quando homens ligados à organização dos Dez Anéis o encontram. Para proteger quem ama, ele precisa enfrentar o legado de sua família e habilidades que tentou abandonar.

**Eternos** — `eternals-2021`

Seres imortais enviados à Terra há milhares de anos voltam a se reunir quando uma antiga ameaça reaparece. Enquanto investigam o propósito de sua missão, os Eternos precisam confrontar escolhas feitas ao longo de séculos de convivência com a humanidade.

#### Especial · Os outros Homens-Aranha

**Homem-Aranha** — `spider-man-2002`

Após ser picado por uma aranha geneticamente modificada, o estudante Peter Parker descobre habilidades extraordinárias. Uma perda pessoal o faz entender o peso de suas escolhas, enquanto o misterioso Duende Verde ameaça sua cidade e as pessoas próximas a ele.

**Homem-Aranha 2** — `spider-man-2-2004`

Peter Parker enfrenta dificuldades para equilibrar faculdade, trabalho, relacionamentos e sua vida como Homem-Aranha. Quando um cientista brilhante sofre um acidente que transforma seus braços mecânicos em uma ameaça, Peter precisa decidir que tipo de vida deseja seguir.

**Homem-Aranha 3** — `spider-man-3-2007`

No auge da popularidade como Homem-Aranha, Peter Parker se vê dividido entre problemas afetivos, novos adversários e um estranho organismo que altera seu comportamento. Seus impulsos colocam à prova os vínculos que mais valoriza.

**O Espetacular Homem-Aranha** — `the-amazing-spider-man-2012`

Peter Parker investiga o desaparecimento de seus pais e encontra pistas em pesquisas conduzidas por um antigo colega do pai. Depois de adquirir poderes aracnídeos, ele precisa enfrentar uma criatura perigosa enquanto se aproxima de Gwen Stacy.

**O Espetacular Homem-Aranha 2: A Ameaça de Electro** — `the-amazing-spider-man-2-2014`

Peter Parker tenta manter seu relacionamento com Gwen Stacy enquanto enfrenta as consequências de ser o Homem-Aranha. O surgimento de Electro e o retorno de Harry Osborn ameaçam sua cidade e expõem segredos ligados à Oscorp.

#### Fase 4 · O multiverso se abre

**Homem-Aranha: Sem Volta para Casa** — `spider-man-no-way-home-2021`

Quando sua identidade secreta é revelada, Peter Parker procura Doutor Estranho para recuperar a vida que tinha. Um feitiço acaba afetando as fronteiras entre universos, trazendo visitantes inesperados e escolhas que colocarão sua responsabilidade à prova.

**Doutor Estranho no Multiverso da Loucura** — `doctor-strange-in-the-multiverse-of-madness-2022`

Doutor Estranho conhece America Chavez, uma jovem capaz de viajar entre universos, e tenta protegê-la de uma perseguição misteriosa. A busca por respostas o leva a realidades alternativas e a reencontrar personagens marcados por perdas recentes.

**Thor: Amor e Trovão** — `thor-love-and-thunder-2022`

Thor procura um novo propósito depois de muitas batalhas, mas retorna à ação quando um assassino de deuses ameaça diferentes mundos. Com a ajuda de Valquíria, Korg e Jane Foster, ele parte para impedir a próxima tragédia.

**Pantera Negra: Wakanda Para Sempre** — `black-panther-wakanda-forever-2022`

Wakanda enfrenta o luto e pressões externas após perder seu rei. Quando uma poderosa civilização submarina surge e exige uma decisão difícil, Shuri, Ramonda e os protetores do país precisam defender seu povo e preservar seu legado.

#### Fase 5 · Novas ameaças

**Homem-Formiga e a Vespa: Quantumania** — `ant-man-and-the-wasp-quantumania-2023`

Scott Lang, Hope e suas famílias são transportados para o Reino Quântico, onde descobrem povos, criaturas e conflitos desconhecidos. Para encontrar o caminho de volta, precisam enfrentar um governante que esconde ambições muito maiores.

**Guardiões da Galáxia Vol. 3** — `guardians-of-the-galaxy-vol.-3-2023`

Quando um dos Guardiões corre perigo, Peter Quill reúne a equipe para uma missão de resgate que revela acontecimentos dolorosos do passado de Rocket. O grupo precisa enfrentar um inimigo obcecado por controlar a evolução da vida.

**As Marvels** — `the-marvels-2023`

Carol Danvers percebe que seus poderes se conectaram misteriosamente aos de Monica Rambeau e Kamala Khan. As três passam a trocar de lugar sempre que usam suas habilidades, obrigando-as a trabalhar juntas contra uma ameaça intergaláctica.

#### Especial · Deadpool e conexões

**Quarteto Fantástico** — `fantastic-four-2005`

Durante uma missão espacial, quatro cientistas e um piloto são atingidos por radiação cósmica e desenvolvem poderes extraordinários. Enquanto aprendem a lidar com as transformações, enfrentam Victor Von Doom, que sofreu mudanças durante o mesmo acidente.

**Quarteto Fantástico e o Surfista Prateado** — `fantastic-four-rise-of-the-silver-surfer-2007`

O Quarteto Fantástico se prepara para uma nova etapa de suas vidas quando um misterioso ser prateado começa a aparecer pelo planeta. Sua chegada anuncia uma ameaça de escala mundial, obrigando a equipe a deixar questões pessoais de lado.

**Deadpool** — `deadpool-2016`

Wade Wilson, um ex-militar de humor ácido, aceita um tratamento experimental após receber um diagnóstico grave. A experiência lhe concede poderes de regeneração, mas o deixa desfigurado, dando início a uma busca irreverente por vingança.

**Deadpool 2** — `deadpool-2-2018`

Depois de uma perda pessoal, Deadpool tenta encontrar um novo propósito e acaba envolvido na proteção de um jovem mutante. A situação se complica com a chegada de Cable, um soldado vindo do futuro, e com a formação de uma equipe pouco convencional.

#### Fase 5 · Encontros e novas equipes

**Deadpool & Wolverine** — `deadpool-and-wolverine-2024`

Deadpool descobre que a existência de seu universo está ameaçada e procura uma versão de Wolverine para ajudá-lo. Os dois são arrastados para uma aventura envolvendo a Autoridade de Variância Temporal e personagens de diferentes realidades.

**Capitão América: Admirável Mundo Novo** — `captain-america-brave-new-world-2025`

Sam Wilson assume o papel de Capitão América e se vê envolvido em uma crise internacional após um encontro com o presidente dos Estados Unidos. Ao investigar uma conspiração, precisa escolher em quem confiar e impedir que o conflito se agrave.

**Thunderbolts*** — `thunderbolts*-2025`

Um grupo de agentes e anti-heróis é atraído para uma armadilha durante uma missão secreta. Sem poder confiar em seus antigos superiores, eles precisam colaborar para sobreviver e enfrentar uma ameaça relacionada a experiências do passado.

#### Fase 6 · Rumo ao desfecho

**Quarteto Fantástico: Primeiros Passos** — `the-fantastic-four-first-steps-2025`

Reed Richards, Sue Storm, Johnny Storm e Ben Grimm conciliam a vida familiar com a responsabilidade de proteger seu mundo. Quando uma ameaça cósmica surge, a equipe precisa enfrentar um desafio que envolve tanto o futuro da Terra quanto seus laços pessoais.

**Homem-Aranha: Um Novo Dia** — `spider-man-brand-new-day-2026`

Após os acontecimentos de Sem Volta para Casa, Peter Parker segue sua vida como Homem-Aranha em uma nova fase, enfrentando as consequências de suas escolhas. A aventura acompanha sua tentativa de proteger Nova York e encontrar um novo equilíbrio pessoal.

**Vingadores: Doomsday** — `avengers-doomsday-2026`

Os Vingadores e outros heróis do universo Marvel se preparam para enfrentar uma ameaça de proporções extraordinárias ligada ao Doutor Destino. Como o filme ainda não estreou, os detalhes oficiais da história permanecem limitados e sujeitos a mudanças.

**Vingadores: Guerras Secretas** — `avengers-secret-wars-2027`

Anunciado como um grande encontro de heróis e realidades, o filme dará continuidade aos eventos de Doomsday e ao encerramento planejado da Saga do Multiverso. Sua trama completa ainda não foi divulgada oficialmente.

#### Extras · Outras adaptações da Marvel

**Hulk** — `hulk-2003`

Bruce Banner trabalha em pesquisas envolvendo regeneração celular quando um acidente com radiação desencadeia uma transformação incontrolável. Enquanto tenta entender a origem de seus poderes, ele confronta traumas familiares e a perseguição dos militares.

**Blade, o Caçador de Vampiros** — `blade-1998`

Blade é um caçador que possui habilidades de vampiro, mas pode caminhar sob o sol. Determinado a impedir que vampiros dominem os humanos, ele investiga os planos de Deacon Frost e enfrenta uma ameaça ligada à sua própria origem.

**Blade II** — `blade-ii-2002`

Blade é obrigado a se aliar a um grupo de vampiros que costumava combater quando surge uma nova espécie de predadores. Mais perigosos e difíceis de deter, esses seres ameaçam tanto humanos quanto vampiros.

**Blade: Trinity** — `blade-trinity-2004`

Blade é perseguido pelas autoridades após ser incriminado e descobre que seus inimigos pretendem despertar um vampiro lendário. Com a ajuda de novos caçadores, ele tenta impedir que a ameaça se espalhe.

**Demolidor: O Homem Sem Medo** — `daredevil-2003`

Cego desde a infância, Matt Murdock desenvolve sentidos extraordinariamente aguçados e atua como advogado durante o dia. À noite, torna-se Demolidor e enfrenta o crime em Hell’s Kitchen, até cruzar o caminho de Elektra e do poderoso Rei do Crime.

**Elektra** — `elektra-2005`

Depois de sobreviver a acontecimentos traumáticos, Elektra torna-se uma assassina profissional. Ao receber uma missão que envolve um pai e sua filha, ela precisa decidir entre cumprir o contrato e proteger pessoas perseguidas por uma organização secreta.

**Quarteto Fantástico** — `fantastic-four-2015`

Quatro jovens participam de um experimento que os transporta para outra dimensão, onde uma exposição inesperada altera seus corpos. Ao retornar, precisam aprender a controlar habilidades extraordinárias e enfrentar as consequências de uma missão que saiu do controle.

**Venom** — `venom-2018`

O jornalista Eddie Brock investiga experiências ilegais conduzidas por uma empresa de biotecnologia e acaba se unindo a um organismo alienígena. Enquanto tenta conviver com a criatura chamada Venom, descobre planos que ameaçam a humanidade.

**Venom: Tempo de Carnificina** — `venom-let-there-be-carnage-2021`

Eddie Brock tenta estabelecer regras para sua convivência com Venom, mas sua investigação sobre o assassino Cletus Kasady desencadeia um novo perigo. A ameaça cresce quando outro simbionte surge e coloca a cidade em risco.

**Venom: A Última Rodada** — `venom-the-last-dance-2024`

Eddie Brock e Venom passam a ser perseguidos por forças humanas e alienígenas, enquanto uma ameaça ligada à origem dos simbiontes se aproxima. A dupla precisa tomar decisões difíceis para impedir consequências maiores.

