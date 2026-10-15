function setup() {
  const canvas = createCanvas(640, 480);
}

function draw() {
  background(255, 240, 240);

  fill(40, 40, 40);
  textSize(24);
  text('フレーム = ' + frameCount, 40, 80); // frameCount は毎フレームカウントアップされる p5.js の変数

  const FRAMES_PER_SECOND = 60;  // この課題では 1 秒間は 60 フレームと仮定する
  let Seconds = Math.floor(frameCount / FRAMES_PER_SECOND);
  let Minutes = Math.floor(Seconds / 60);
  Seconds = Seconds % 60;

  text('経過時間 = ' + Minutes + '分' + Seconds + '秒', 40, 130);
}
