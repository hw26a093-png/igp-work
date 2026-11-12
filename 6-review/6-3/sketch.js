// TODO: 以下の条件を全て満たすゲームを自由に制作する。
//   * プレイヤーはキー操作で上下左右に動く。プレイヤーは画面外へ出られない。
//   * 画面内には、プレイヤーが衝突するとゲームオーバーの要因になる「動くもの」が複数存在する。これは画面外に出ても構わない。
//   * ゲームオーバーになったことが、画面表示などによってプレイヤーに伝わる。
//   * 得点や生存時間など、プレイ結果を他人と比較できる数値を表示する。この数値はゲームオーバー後には変化させず、表示を維持する。
//   * リスタート機能はなくてもよい。


let playerImages = [];
let enemyImages = [[], []];

// プレイヤー情報
let player = {
  x: 350,
  y: 200,
  flip: false,  // true の時は左向き
  damage: false,  // true の時はダメージポーズ
  speed: 1.8,
  life: 3
};

// 敵群情報
let enemies = [

  { type: 0, size: 48, speed: 3, x: 30, y: 240, angle: 0 },
  { type: 0, size: 60, speed: 3, x: 30, y: 50, angle: 0 },
  { type: 1, size: 90, speed: -2.7, x: 800, y: 400, angle: 0 },
  { type: 1, size: 75, speed: -4, x: 800, y: 120, angle: 0 },

];

// preload() は画像などを事前に読み込むための関数 (p5.js から自動的に呼び出される)
// 読み込みが完了してから setup() が実行される
function preload() {
  // 画像の読み込み
  playerImages[0] = loadImage('assets/player_walk_mid.png');
  playerImages[1] = loadImage('assets/player_walk2.png');
  playerImages[2] = loadImage('assets/player_death.png');
  enemyImages[0][0] = loadImage('assets/enemy_walk1.png');
  enemyImages[0][1] = loadImage('assets/enemy_walk2.png');
  enemyImages[1][0] = loadImage('assets/enemy_chase1.png');
  enemyImages[1][1] = loadImage('assets/enemy_chase2.png');
}

// setup() は全体の初期化処理を行うための関数
// preload() の後、1 度だけ実行される
function setup() {
  createCanvas(640, 480);

  for (let i = 0; i < enemies.length; i++) {
    setEnemyDirection(enemies[i]);
  }
}

// draw() は毎フレームの処理を行うための関数
// デフォルトでは 1 秒間に約 60 回実行される
function draw() {
  background(235, 235, 200);

  // プレイヤー更新
  updatePlayer();

  // 敵更新、描画
  for (let i = 0; i < enemies.length; i++) {
    updateEnemy(enemies[i]);
    drawEnemy(enemies[i]);
  }

  // プレイヤー描画
  drawPlayer();
  drawPlayerlife();
  drawTime();

}

// プレイヤーの更新
function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
    player.flip = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
    player.flip = false;
  }
  if (keyIsDown(UP_ARROW)) {
    player.y -= player.speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += player.speed;
  }

  // プレイヤーが画面外に出ないようにする
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > width) {
    player.x = width;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y > height) {
    player.y = height;
  }

  // プレイヤーと敵の接触判定
  for (let i = 0; i < enemies.length; i++) {
    if (isHitPlayer(enemies[i]) === true && player.damage === false) {
      player.damage = true;
      player.life--;
      break; // 1 フレームに複数の敵と接触しても、1 回だけダメージを受ける
    }
    if (player.damage === true) {
      if (frameCount % 60 === 0) {
        player.damage = false;
      }
      if (player.life <= 0) {
        gameOver();
      }
      return;
    }
    else if (isHitPlayer(enemies[i]) === false) {
      player.damage = false;
    }

  }
}





// プレイヤーの描画
function drawPlayer() {
  const pattern = player.damage ? 2 : Math.floor(frameCount / 20) % 2; // 20 フレームごとに絵を切り替える
  const imageSize = 96;
  const x = player.x - imageSize / 2;
  const y = player.y - imageSize / 2;

  if (player.flip) {
    // 左右反転させて描画
    push();
    translate(x + imageSize, y);
    scale(-1, 1);
    image(playerImages[pattern], 0, 0, imageSize, imageSize);
    pop();
  } else {
    image(playerImages[pattern], x, y, imageSize, imageSize);
  }
}

function setEnemyDirection(enemy) {
  enemy.angle = atan2(
    player.y - enemy.y,
    player.x - enemy.x
  );
}

function gameOver() {
  // ゲームオーバー処理
  noLoop(); // draw() のループを停止
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  text("生存時間：" + Math.floor(frameCount / 60) + "秒", width / 2, height / 2 + 40);
}

// 敵の更新
function updateEnemy(enemy) {

  // 決められた方向に直進
  let movex = enemy.speed * cos(enemy.angle);
  let movey = enemy.speed * sin(enemy.angle);
  if (enemy.speed < 0) {
    movex = -movex;
    movey = -movey;
  }
  enemy.x += movex;
  enemy.y += movey;


  // 画面外に出たか判定
  let out = false;

  if (enemy.x > width + enemy.size / 2 ||
    enemy.x < -enemy.size / 2 ||
    enemy.y > height + enemy.size / 2 ||
    enemy.y < -enemy.size / 2) {
    out = true;
  }

  if (out) {

    // 画面外に出た方向と反対側に移動
    if (enemy.speed > 0) {
      if (movex > 0) {
        enemy.x = -enemy.size / 2;
      }
      else if (movex < 0) {
        enemy.x = width + enemy.size / 2;
      }

      if (movey > 0) {
        enemy.y = -enemy.size / 2;
      }
      else if (movey < 0) {
        enemy.y = height + enemy.size / 2;
      }
    }
    else {
      if (movex < 0) {
        enemy.x = width + enemy.size / 2;
      }
      else if (movex > 0) {
        enemy.x = -enemy.size / 2;
      }

      if (movey < 0) {
        enemy.y = height + enemy.size / 2;
      }
      else if (movey > 0) {
        enemy.y = -enemy.size / 2;
      }
    }

    // 新しい移動方向を決定
    setEnemyDirection(enemy);
  }
}

// 敵の描画
function drawEnemy(enemy) {
  const pattern = Math.floor(frameCount / 20) % 2; // 20 フレームごとに絵を切り替える
  image(enemyImages[enemy.type][pattern], enemy.x - (enemy.size / 2), enemy.y - (enemy.size / 2), enemy.size, enemy.size);
}

// プレイヤーと接触しているかどうか
function isHitPlayer(enemy) {
  const distanceX = player.x - enemy.x;
  const distanceY = player.y - enemy.y;
  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) < (enemy.size / 2 + 20);
}

function drawPlayerlife() {
  fill(255);
  textSize(24);
  text('ライフ：' + player.life, 20, 60);
}

function drawTime() {
  fill(255);
  textSize(24);
  text('生存時間：' + Math.floor(frameCount / 60) + '秒', 20, 30);
}