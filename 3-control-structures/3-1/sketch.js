let playerX = 0;

const PLAYER_SIZE = 60;
const MOVE_SPEED = 5;

function setup() {
  const canvas = createCanvas(640, 480);

  playerX = (width / 2) - (PLAYER_SIZE / 2);  // 画面中央から開始
}

function draw() {


  let leftKeyText = '左に進む';

  let rightKeyText = '右に進む';

  if (playerX <= 0) {
    leftKeyText = 'これ以上左へ行けません';
  }
  if (playerX >= width - PLAYER_SIZE) {
    rightKeyText = 'これ以上右へ行けません';
  }

  background(235, 245, 255);

  if (keyIsDown(LEFT_ARROW) && playerX > 0) {
    playerX = playerX - MOVE_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW) && playerX < width - PLAYER_SIZE) {
    playerX = playerX + MOVE_SPEED;
  }


  fill(70, 140, 230);
  rect(playerX, 350, PLAYER_SIZE, PLAYER_SIZE);

  fill(40, 40, 40);
  textSize(24);
  text('Ｘ座標 = ' + playerX, 40, 40);
  text('左キー = ' + leftKeyText, 40, 80);
  text('右キー = ' + rightKeyText, 40, 120);


}
