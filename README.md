# Tia Ju 10 123 — site da campanha

Versão em HTML estático do site que hoje roda no Canva
([tiaju10.my.canva.site](https://tiaju10.my.canva.site/)). Sem framework, sem
build: são três arquivos HTML, um CSS e os assets.

## Rodando localmente

```bash
npm install
npm start          # live-server em src/, com reload automático
```

## Estrutura

```
src/                              tudo que vai para o ar
├── index.html                    Tia Ju se apresenta (vídeo)
├── conheca.html                  Conheça a Tia Ju (texto)
├── vote.html                     Vote 10 123 (simulação de voto)
├── redes.html                    Nossas redes (links das redes sociais)
├── css/style.css
├── js/video.js                   autoplay + botão de som
└── assets/
    ├── img/       logo, flor de fundo, posters, foto recortada
    ├── img/redes/ ícones das redes sociais
    └── video/     apresentacao.mp4, simulacao-voto.mp4

assets/                           material de design, não publicado
├── LAYOUT/                       mockups das páginas em 1080×1920
├── BOTOES_REDES/                 ícones de redes (não usados no site)
└── PNGs/FAIXAS_01.png            faixa do rodapé (feita em CSS no site)
```

Só `src/` é publicado. A pasta `assets/` guarda o material de origem — veja
[`assets/README.md`](assets/README.md) para o que é cada coisa.

## Como o layout funciona

O design original é um canvas de **1080×1920** (formato story). O CSS mantém
todas as medidas nessas unidades e escala tudo com uma variável:

```css
--w: max(300px, min(100dvw - 1rem, 560px, (100dvh - 1rem) * 0.5625));
--u: calc(var(--w) / 1080);   /* 1 unidade do canvas original */

.logo { width: calc(505.2 * var(--u)); }
```

Assim os números no CSS são os mesmos do design, e a página inteira escala junto
— cabendo em uma tela só, sem letterbox. Abaixo de 480px os três botões empilham;
em telas baixas (≤640px de altura) eles encolhem para não passar da dobra.

O orçamento vertical das 1920 unidades é usado inteiro, sem sobra:

```
  logo     0 ..  331     a logo cobre os 121 primeiros pixels do vídeo
  vídeo  210 .. 1718     848 de largura (9:16)
  botões 1758 .. 1878    120 de altura
  folga  1878 .. 1920
```

Mexer em qualquer um desses números exige refazer a conta — se a soma passar de
1920, a coluna encolhe (a altura vira o limite de `--w`) e tudo fica menor.

Duas coisas a saber ao mexer no CSS:

- `--w` usa `dvw`/`dvh`, **não** `%`. Uma porcentagem dentro de uma custom
  property só é resolvida no ponto de uso — em `height` ela viraria 100% da
  *altura* do pai, quebrando todas as medidas verticais.
- O texto de `conheca.html` usa `<br>` nas mesmas quebras do design original.
  Como a fonte escala com a coluna, as 19 linhas continuam proporcionais em
  qualquer tela.

## Vídeos

Os dois vídeos tocam sozinhos, em loop. Navegador nenhum permite autoplay com
som, então eles entram **mudos** — e `js/video.js` mostra um botão
"TOQUE PARA OUVIR" por cima do vídeo para ligar o áudio em um clique. O botão só
aparece depois que o autoplay realmente começou; se o navegador bloquear (ou se
o usuário estiver economizando dados), ficam o poster e os controles nativos.

Como autoplay implica baixar o vídeo, os arquivos pesam no primeiro acesso
(13 MB e 8,6 MB). Se isso incomodar no mobile, vale comprimir com algo como:

```bash
ffmpeg -i entrada.mp4 -vf scale=720:-2 -c:v libx264 -crf 28 -c:a aac -b:a 96k saida.mp4
```

## Redes sociais

`redes.html` substitui o link para o Linktree: os perfis aparecem direto na
página, cada ícone clicável. O layout segue
`assets/LAYOUT/NOSSAS REDES.png` — posições e tamanhos nas mesmas coordenadas
do canvas 1080×1920.

| Rede | Perfil | Link |
| --- | --- | --- |
| Site | tiaju10.com.br | https://tiaju10.com.br |
| Facebook | @tiaju10 | https://www.facebook.com/tiaju10/ |
| Instagram | @tiaju10 | https://www.instagram.com/tiaju10 |
| TikTok | @tiaju_10 | https://www.tiktok.com/@tiaju_10 |
| YouTube | @tiaju1028 | https://www.youtube.com/@tiaju1028 |

Os endereços vieram do próprio Linktree da campanha. Duas diferenças em
relação ao mockup:

- O mockup escreve **www.tiaju.com.br**, que não resolve. O domínio no ar é
  `tiaju10.com.br`, e é ele que está no link.
- O Linktree também tem canal no WhatsApp e a vaquinha
  (`queroapoiar.com.br/tiaju`). Não estão no mockup, então ficaram de fora.

A foto da Tia Ju (`assets/img/tiaju.webp`) foi recortada do mockup por
flood-fill do fundo roxo. No original ela terminava atrás dos botões, então o
pé da imagem é dissolvido com `mask-image` para o corte reto não aparecer.

## Fontes

O Canva usa fontes proprietárias. Os substitutos foram escolhidos medindo a
largura do mesmo texto na fonte original e nas candidatas:

| Uso | Original | Substituto | Erro |
| --- | --- | --- | --- |
| Corpo de texto | Canva Sans | **Montserrat 700** | 0,1% |
| Botões | condensada Canva | **Oswald 700** | 0,5% |

Ambas vêm do Google Fonts. Para tirar a dependência externa, baixe os `.woff2` para
`src/assets/fonts/` e troque o `<link>` por um `@font-face`.

## Paleta

| | |
| --- | --- |
| Fundo | `#4f1f76` |
| Botão ciano | `#73fcff → #00bec2` |
| Botão roxo | `#9369ff → #5731a6` |
| Botão rosa | `#ff9ed6 → #cf339c` |
| Botão laranja | `#ffa176 → #c05100` |
| Faixa do rodapé | `#0471b4` `#815fa5` `#9d489b` `#ee93b7` |

## Publicando na AWS

```bash
S3_BUCKET=meu-bucket CLOUDFRONT_ID=E123ABC npm run deploy
```

O script (`scripts/deploy.sh`) envia assets com cache longo e HTML sem cache,
depois invalida o CloudFront. Precisa do `aws` CLI configurado.

Na distribuição do CloudFront, aponte o **Default root object** para
`index.html`.

## Diferenças em relação ao Canva

- Sem os controles de apresentação (setas, barra de progresso, zoom) e sem a
  marca "Designed with Canva".
- Cada página tem URL própria (`/`, `/conheca.html`, `/vote.html`) em vez de
  `#page-0/1/2`.
- O rótulo "ASSISTIA AO VÍDEO" do original foi corrigido para "ASSISTA AO VÍDEO".
- Os vídeos usam o player nativo do navegador, são servidos junto com o site e
  tocam em autoplay (mudos, em loop) — veja "Vídeos" acima.
- No Canva, o vídeo da simulação de voto era um link para
  [este Short](https://www.youtube.com/shorts/ZtT1c9AWSDE); aqui ele toca na
  própria página.
# tiaju
# tiaju
