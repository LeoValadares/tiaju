// Os navegadores so deixam um video comecar sozinho se ele estiver mudo.
// Entao o video entra mudo e mostramos um botao para ligar o som.
document.querySelectorAll(".midia").forEach(function (midia) {
  var video = midia.querySelector("video");
  var botao = midia.querySelector(".som");
  if (!video || !botao) return;

  // O botao e sempre um reflexo do estado real do elemento: se por qualquer
  // motivo o som nao ficar ligado, ele reaparece em vez de sumir calado.
  function sincronizar() {
    botao.hidden = !video.muted;
  }

  botao.addEventListener("click", function () {
    video.muted = false;
    video.volume = 1;

    var play = video.play();
    if (play && play.then) {
      play
        .then(function () {
          // O Chrome pode reverter o mute se recusar tocar com som.
          if (video.muted) video.muted = false;
          sincronizar();
        })
        .catch(function () {
          // Recusou tocar com som: volta pro mudo e devolve o botao,
          // senao o usuario fica sem som e sem como ligar.
          video.muted = true;
          video.play();
          sincronizar();
        });
    } else {
      sincronizar();
    }
  });

  // Cobre tambem o volume dos controles nativos.
  video.addEventListener("volumechange", sincronizar);

  // So oferece o atalho depois que o autoplay realmente pegou. Se o navegador
  // bloquear, ficam o poster e os controles nativos.
  video.addEventListener("playing", sincronizar);

  var autoplay = video.play();
  if (autoplay && autoplay.catch) autoplay.catch(function () {});
});
