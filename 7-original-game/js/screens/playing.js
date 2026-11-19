
/**
 * @file プレイ画面
 */

// 自機の移動速度
const PLAYER_SPEED = 4;

// 攻撃角度の変更速度
const PLAYER_ROTATE_SPEED = 0.04;

// 弾の速度
const BULLET_SPEED = 12;

// 弾の半径
const BULLET_RADIUS = 8;

// 照準の長さ
const AIM_LENGTH = 100;

// 敵の出現間隔（フレーム）
const ENEMY_SPAWN_INTERVAL = 60;

// 敵の落下速度
const ENEMY_SPEED = 2;

const PLAYER_MAX_HP = 3;
let playerHP = PLAYER_MAX_HP;

// プレイヤー
let player = {
  x: 0,
  y: 0,
  angle: -Math.PI / 2
};

// 弾の配列
let bullets = [];

// 敵の配列
let enemies = [];

// 敵の出現を管理するカウンター
let enemySpawnTimer = 0;


/**
 * 自機の初期化
 */
function resetPlayer() {
  player.x = CANVAS_W / 2;
  player.y = CANVAS_H / 2;
  player.angle = -Math.PI / 2;
  playerHP = PLAYER_MAX_HP;
  bullets = [];
  enemies = [];

  enemySpawnTimer = 0;
}


/**
 * プレイ画面の更新
 */
function updatePlaying() {

  // プレイヤーの移動
  if (isKeyDown('a')) {
    player.x -= PLAYER_SPEED;
  }
  if (isKeyDown('d')) {
    player.x += PLAYER_SPEED;
  }
  if (isKeyDown('w')) {
    player.y -= PLAYER_SPEED;
  }
  if (isKeyDown('s')) {
    player.y += PLAYER_SPEED;
  }

  // 攻撃角度の変更
  if (isKeyDown('ArrowLeft')) {
    player.angle -= PLAYER_ROTATE_SPEED;
  }
  if (isKeyDown('ArrowRight')) {
    player.angle += PLAYER_ROTATE_SPEED;
  }

  // 画面外への移動制限
  const halfWidth = images.player.width / 2;
  const halfHeight = images.player.height / 2;

  player.x = constrain(
    player.x,
    halfWidth,
    CANVAS_W - halfWidth
  );

  player.y = constrain(
    player.y,
    halfHeight,
    CANVAS_H - halfHeight
  );

  // スペースキーで弾を発射
  if (wasKeyPressed(' ')) {
    shootBullet();
  }

  // 弾の更新
  updateBullets();

  // 敵の生成と更新
  updateEnemies();

  checkBulletEnemyCollision();

  // 仮の終了操作
  if (wasKeyPressed('x')) {
    goToResult();
  }
  if (playerHP <= 0) {
    goToResult();
  }
}


/**
 * 弾を発射する
 */
function shootBullet() {

  const vx = Math.cos(player.angle) * BULLET_SPEED;
  const vy = Math.sin(player.angle) * BULLET_SPEED;

  bullets.push({
    x: player.x + Math.cos(player.angle) * 30,
    y: player.y + Math.sin(player.angle) * 30,
    vx: vx,
    vy: vy
  });
}


/**
 * 弾を移動させる
 */
function updateBullets() {

  for (let i = bullets.length - 1; i >= 0; i--) {

    const bullet = bullets[i];

    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    // 画面外の弾を削除
    if (
      bullet.x < 0 ||
      bullet.x > CANVAS_W ||
      bullet.y < 0 ||
      bullet.y > CANVAS_H
    ) {
      bullets.splice(i, 1);
    }
  }
}


/**
 * 敵を生成する
 */
function spawnEnemy() {

  const enemyWidth = images.enemy1.width;
  const enemyHeight = images.enemy1.height;

  enemies.push({
    x: random(enemyWidth / 2, CANVAS_W - enemyWidth / 2),
    y: -enemyHeight / 2,
    speed: ENEMY_SPEED
  });
}


/**
 * 敵の生成と移動
 */
function updateEnemies() {

  // 敵の出現間隔をカウント
  enemySpawnTimer++;

  // 一定時間ごとに敵を生成
  if (enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
    spawnEnemy();
    enemySpawnTimer = 0;
  }

  // 敵を下方向に移動
  for (let i = enemies.length - 1; i >= 0; i--) {

    const enemy = enemies[i];

    enemy.y += enemy.speed;

    // 画面下に到達した敵を削除して体力を減らす
    if (enemy.y > CANVAS_H + images.enemy1.height / 2 - 60) {
      enemies.splice(i, 1);
      playerHP--;
    }
  }
}


/**
 * プレイ画面の描画
 */
function drawPlaying() {

  // 背景
  image(images.playingBg, 0, 0, CANVAS_W, CANVAS_H);

  // 敵の描画
  for (const enemy of enemies) {

    image(
      images.enemy1,
      enemy.x - images.enemy1.width / 2,
      enemy.y - images.enemy1.height / 2
    );
  }

  // 照準の描画
  stroke(255, 220, 50);
  strokeWeight(4);

  const aimX =
    player.x + Math.cos(player.angle) * AIM_LENGTH;

  const aimY =
    player.y + Math.sin(player.angle) * AIM_LENGTH;

  line(player.x, player.y, aimX, aimY);

  noStroke();

  // プレイヤーの描画
  const x = player.x - images.player.width / 2;
  const y = player.y - images.player.height / 2;

  image(images.player, x, y);

  // 弾の描画
  fill(0);

  for (const bullet of bullets) {
    ellipse(
      bullet.x,
      bullet.y,
      BULLET_RADIUS * 2,
      BULLET_RADIUS * 2
    );
  }

  // UI
  fill(40, 40, 40);
  textAlign(LEFT, TOP);
  textSize(24);
  text('SCORE: ' + gameData.score, 16, 16);

  textSize(16);
  text('WASD: 移動 / ←→: 照準 / SPACE: 発射', 16, 48);

  text('HP: ' + playerHP, 16, 80);
}


/**
 * 弾と敵の当たり判定
 */
function checkBulletEnemyCollision() {

  // 敵を後ろから確認
  for (let i = enemies.length - 1; i >= 0; i--) {

    const enemy = enemies[i];

    // 敵の当たり判定の半径
    const enemyRadius =
      Math.min(images.enemy1.width, images.enemy1.height) / 2;

    // 弾を後ろから確認
    for (let j = bullets.length - 1; j >= 0; j--) {

      const bullet = bullets[j];

      // 弾と敵の距離
      const distance = dist(
        bullet.x,
        bullet.y,
        enemy.x,
        enemy.y
      );

      // 当たっているか確認
      if (distance < BULLET_RADIUS + enemyRadius) {

        // 敵を削除
        enemies.splice(i, 1);

        // 弾を削除
        bullets.splice(j, 1);

        // スコア加算
        gameData.score += 100;

        // この敵の確認を終了
        break;
      }
    }
  }
}
