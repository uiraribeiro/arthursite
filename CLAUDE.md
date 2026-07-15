# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Site institucional de uma página (single-page, âncoras) para Arthur Endy, cantor e compositor católico brasileiro. HTML5 + CSS3 + JavaScript vanilla puro — sem build step, sem framework, sem dependências de pacote. Todo o site é `index.html` + `css/style.css` + `js/script.js`.

## Rodando localmente

Não há processo de build. Para visualizar:

```bash
python3 -m http.server 8765
```

Depois abrir `http://localhost:8765/index.html`. Qualquer servidor estático simples funciona (não depende de rotas server-side).

Não há linter, testes automatizados ou CI configurados neste projeto.

## Restrição de conteúdo (crítica)

O site deve apresentar **exclusivamente o repertório católico/autoral atual** de Arthur Endy (ex.: "Desperta o Santo Dentro de Mim", "Uma História de Amor"). **Nunca** referenciar, linkar ou embutir os covers pop seculares do site antigo dele (arthurendy.com de 2022) ou que apareçam automaticamente em embeds ao vivo — essa fase não faz parte do posicionamento atual da marca.

Por isso o player do Spotify na seção Mídia usa embeds de **álbuns/faixas específicas** (`/embed/album/<id>`), não o embed do artista (`/embed/artist/<id>`): o embed do artista puxa os top-tracks públicos do Spotify ao vivo, que podem incluir covers seculares antigos. Ao adicionar novas músicas ao player, sempre usar o ID do álbum/faixa específica, nunca o embed do perfil completo do artista.

## Identidade visual

Definida em `:root` no topo de `css/style.css`:
- `--azul-peregrino: #253957` — cor principal (fundos escuros, textos sobre claro, header, footer)
- `--branco-linho: #f5f4f0` — cor secundária (fundos claros, textos sobre escuro)

Tipografia: Sora (títulos, `--font-display`) + Inter (corpo, `--font-body`), carregadas via Google Fonts no `<head>`.

## Arquitetura de assets e ícones

- `assets/img/` — todas as fotos e logos já processados (resize + WebP) prontos para uso no site.
- `assets/icons/` — ícones SVG de redes sociais/streaming/UI (`fill="currentColor"` ou `stroke="currentColor"`).
- `assets/ELEMENTO 01/`, `assets/ELEMENTO 02/`, `assets/logo/`, `assets/fotos/` — arquivos-fonte originais em alta resolução (logos vetoriais e fotos brutas do Instagram/ensaios). Estão no `.gitignore` porque já foram processados e não precisam ir para o deploy; mantenha-os localmente como fonte caso seja preciso reprocessar algo.

Há duas variantes de logo em uso, não intercambiáveis: o **símbolo isolado** (`logo-branco.png`/`logo-azul.png`, de `ELEMENTO 01/`) usado no favicon e como marca d'água/ícone decorativo (hero, footer icons pequenos), e o **logotipo linear completo** com o wordmark "ARTHUR ENDY" (`logo-linear-branco.png`, de `assets/logo/`) usado no `.brand-logo` do header e no `.footer-logo` do footer.

**Armadilha importante com os ícones SVG**: eles são referenciados via `<img src="...svg">`, não inline. Isso significa que `fill="currentColor"` dentro do SVG **não herda a cor do CSS** do elemento pai (limitação do `<img>` para conteúdo externo). Para tingir um ícone de branco sobre fundo escuro, usa-se o truque `filter: brightness(0) invert(1)` no CSS (ver `.header-social img`, `.footer-streaming img`, `.footer-contact img`, `.play-icon`, `.instagram-tile-icon img` em `style.css`). Se adicionar um novo ícone que precise de cor dinâmica, replicar esse padrão de filtro — não adicionar `color` esperando que funcione.

Processamento de imagens novas (resize + WebP) é feito via `sips` (built-in do macOS) + `cwebp` (Homebrew), não há script automatizado — foi feito manualmente linha de comando durante a criação do site.

## Hero

O hero **não tem headline** (`<h1>`) — foi removido a pedido do cliente; o bloco de texto é só símbolo + `.hero-subtitle` + botões, centralizado verticalmente (`.hero { align-items: center }`) com `padding-top` grande em `.hero-content` para empurrar o conteúdo para a metade inferior da imagem.

**Armadilha já resolvida, não reintroduzir**: `.hero-content` não deve levar a classe `.container`. As duas já foram usadas juntas antes e uma media query posterior (`@media (min-width:1280px) { .container {...} }`) zerava o `padding-bottom` do hero por ter a mesma especificidade e vir depois no arquivo. `.hero-content` tem seu próprio `max-width`/`padding` independentes de `.container`.

A foto de fundo (`assets/img/hero.webp`) é uma silhueta em paisagem (pôr do sol), não um retrato de rosto — não há necessidade de recortar em torno de um rosto. O overlay (`.hero-overlay`) é um gradiente que só escurece o terço inferior da imagem (onde ficam texto/botões), deixando o céu e a silhueta vívidos; o `.hero-subtitle` também tem `text-shadow` para reforçar a legibilidade sem depender só do overlay. Se trocar a foto do hero, reavaliar os stops do gradiente (`72%`/`88%`/`100%`) e o `object-position` conforme a composição da nova imagem.

`.scroll-indicator` é escondido em telas ≤639px (`display:none` no media query mobile) porque, em viewports curtos, ele colidia visualmente com os botões do hero.

## Estrutura de botões

Duas variantes de preenchimento em `style.css`, escolhidas conforme o fundo por trás do botão — não são intercambiáveis:
- `.btn-primary` (fundo `--branco-linho`, texto azul) — usar **apenas** sobre fundos escuros (ex.: hero).
- `.btn-solid` (fundo `--azul-peregrino`, texto branco) — usar sobre fundos claros/cards brancos (ex.: CTA da Agenda, botão de envio do formulário de Contato).
- `.btn-outline` (borda + texto `--branco-linho`) — sobre fundo escuro; adicionar também `.btn-dark` quando usado sobre fundo claro (ex.: "Kit de Imprensa", "Seguir no Instagram"), senão o texto fica quase invisível.

## Formulário de contato

Envio via Formspree (`https://formspree.io/f/xeeyovjj`) usando `fetch` em `js/script.js` (função `handleContactSubmit`). Validação client-side roda antes do submit (`validateForm`); o backend Formspree não precisa de configuração adicional no código além do endpoint no atributo `action` do `<form>`.

## Sem framework de animação

Reveal-on-scroll é feito com `IntersectionObserver` puro em `script.js` (adiciona a classe `.reveal` a elementos-alvo e `.is-visible` quando entram no viewport). O menu mobile ("sanfona") usa apenas CSS (`max-height` + `transition-delay` escalonado por `li:nth-child`) mais um toggle de classe via JS — não há biblioteca de animação envolvida.
