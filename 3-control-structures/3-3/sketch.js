const CARD_W = 40;
const CARD_H = 60;
const CARD_INTERVAL = 20; // カードの間隔
const CARD_START_X = 30;
const CARD_START_Y = 10;
const CARD_COUNT_H = 10;  // 横方向のカード枚数
const CARD_COUNT_V = 6; // 縦方向のカード枚数


function setup() {
  const canvas = createCanvas(640, 480);
}

function draw() {
  background(40, 40, 40);
  noStroke();

  const playerX = mouseX;
  const playerY = mouseY;

  const x = CARD_START_X;
  const y = CARD_START_Y;

  fill(200, 200, 200);
  for (let i = 0; i < CARD_COUNT_H; i++) {
    for (let j = 0; j < CARD_COUNT_V; j++) {
      rect(x + (CARD_W + CARD_INTERVAL) * i, y + (CARD_H + CARD_INTERVAL) * j, CARD_W, CARD_H);
    }
  }

}
