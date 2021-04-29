const NILAI_SERANG_PLAYER = 10;
const NILAI_SERANG_MONSTER = 15; 
const NILAI_SERANGAN_KUAT = 20;
const NILAI_ISI_DARAH = 20;

const ATTACK = 'ATTACK';
const STRONG_ATTACK = 'STRONG ATTACK';
const LOG_SERANGAN_PLAYER = 'ATTACK PLAYER';
const LOG_SERANGAN_KUAT_PLAYER = 'ATTACK STRONG PLAYER';
const LOG_SERANGAN_MONSTER = 'ATTACK MONSTER';
const LOG_ISI_DARAH_PLAYER = 'HEAL PLAYER';
const LOG_GAME_OVER = 'GAME OVER';

function getMaxLifeValues() {
	const enteredValue = prompt('Masukkan Nilai Darah: ', '100');
	let parseValue = parseInt(enteredValue);
	if (isNaN(parseValue) || parseValue <= 0) {
		throw { Message : 'Input tidak valid karena yang dimasukkan bukan angka!'};
	}
	return enteredValue;
}

let NILAI_DARAH;

try {
	NILAI_DARAH = getMaxLifeValues(); 
} catch (error) {
	console.log(error);
	NILAI_DARAH = 100;
	alert('Ada sesuatu yang salah, nilai defaultnya yaitu 100');
}

let battleLog = [];
let darahPlayerSaatIni = NILAI_DARAH;
let darahMonsterSaatIni = NILAI_DARAH;
let bonusLife = true;
let loggedIn;

adjustHealthBars(NILAI_DARAH);

function reset() {
	darahPlayerSaatIni = NILAI_DARAH;
	darahMonsterSaatIni = NILAI_DARAH;
	resetGame(NILAI_DARAH);
}

function writeToLog (ev, val, playerHealth, monsterHealth) {
	let logEntry = {
		event : ev,
		value : val,
		PlayerHealthValue : playerHealth,
		MonsterHealthValue : monsterHealth
	}
	switch(ev){
		case LOG_SERANGAN_PLAYER:
			logEntry.target = 'MONSTER';
			break;
		case LOG_SERANGAN_KUAT_PLAYER:
			logEntry.target = 'MONSTER';
			break;
		case LOG_SERANGAN_MONSTER:
			logEntry.target = 'PLAYER';
			break;
		case LOG_ISI_DARAH_PLAYER:
			logEntry.target = 'PLAYER';
			break;
		case LOG_GAME_OVER:
			logEntry = {
				event : ev,
				value : val,
				PlayerHealthValue : playerHealth,
				MonsterHealthValue : monsterHealth
			};
			break;
		default:
			logEntry = {};
	}

	// if (ev === LOG_SERANGAN_PLAYER) {
	// 	logEntry.target = 'MONSTER';
	// } else if (ev === LOG_SERANGAN_KUAT_PLAYER) {
	// 	logEntry.target = 'MONSTER';
	// } else if (ev === LOG_SERANGAN_MONSTER) {
	// 	logEntry.target = 'PLAYER';
	// } else if (ev === LOG_ISI_DARAH_PLAYER) {
	// 	logEntry.target = 'PLAYER';	
	// } else if (ev === LOG_GAME_OVER) {
	// 	logEntry = {
	// 		event : ev,
	// 		value : val,
	// 		PlayerHealthValue : playerHealth,
	// 		MonsterHealthValue : monsterHealth
	// 	};
	// }
	battleLog.push(logEntry);
}

function nyerang(mode) {
	let logEntry;
	// = mode === ATTACK ? LOG_SERANGAN_MONSTER : LOG_SERANGAN_KUAT_PLAYER; //Ternary Operator
	let maksimalSerangan;
	// = mode === ATTACK ? NILAI_SERANG_MONSTER : NILAI_SERANGAN_KUAT; //Ternary Operator
	if (mode === ATTACK) {
		maksimalSerangan = NILAI_SERANG_MONSTER;
		logEntry = LOG_SERANGAN_PLAYER;
	} else if (mode === STRONG_ATTACK ) {
		maksimalSerangan = NILAI_SERANGAN_KUAT;
		logEntry = LOG_SERANGAN_KUAT_PLAYER;
	}
	const seranganDariPlayer = dealMonsterDamage(maksimalSerangan);
	darahMonsterSaatIni -= seranganDariPlayer;
	writeToLog(logEntry, maksimalSerangan, darahPlayerSaatIni, darahMonsterSaatIni);
  endRound();
}

function isiDarah() {
	let healthValue;
	if (darahPlayerSaatIni >= NILAI_DARAH - NILAI_ISI_DARAH) {
		alert("Kamu Tidak Bisa Mengisi Darah Sampai Penuh");
		healthValue = NILAI_DARAH - darahPlayerSaatIni;
	} else {
		healthValue = NILAI_ISI_DARAH;
	}
	increasePlayerHealth(NILAI_ISI_DARAH);
	darahPlayerSaatIni += NILAI_ISI_DARAH;
	writeToLog(LOG_ISI_DARAH_PLAYER, healthValue,darahPlayerSaatIni, darahMonsterSaatIni);
	endRound();
} 

function endRound() {
	const initiaHealth = darahPlayerSaatIni;
	const seranganDariMonster = dealPlayerDamage(NILAI_SERANG_MONSTER);
	darahPlayerSaatIni -= seranganDariMonster;
	writeToLog(LOG_SERANGAN_MONSTER, seranganDariMonster, darahPlayerSaatIni, darahMonsterSaatIni);
	if (darahPlayerSaatIni <= 0 && bonusLife) {
		bonusLife = false;	
		removeBonusLife();
		darahPlayerSaatIni = initiaHealth;
		setPlayerHealth(initiaHealth);
		alert('Kamu Sebenernya sudah meninggal, tetapi masih ada kesempatan hidup');
	}

	if (darahMonsterSaatIni <= 0 && darahPlayerSaatIni > 0) {
		alert('VICTORY !');
		writeToLog(LOG_GAME_OVER, 'VICTORY', darahPlayerSaatIni, darahMonsterSaatIni);
	} else if (darahPlayerSaatIni <= 0 && darahMonsterSaatIni > 0) {
		alert('DEFEAT !');
		writeToLog(LOG_GAME_OVER, 'DEFEAT', darahPlayerSaatIni, darahMonsterSaatIni);
	} else if(darahPlayerSaatIni <= 0 && darahMonsterSaatIni <= 0) {
		alert('DRAW !');
		writeToLog(LOG_GAME_OVER, 'DRAW', darahPlayerSaatIni, darahMonsterSaatIni);
	}
	if (darahPlayerSaatIni <= 0 || darahMonsterSaatIni <= 0) {
		reset();
	}	
}
function showLog() {
	console.log("------------");
	// perulangan dengan for
	// for (i = 0; i < battleLog.length; i++) {
	// 	console.log(battleLog[i]);
	// } 
	//perulangan dengan cara baru for-of
	let i = 0;
	for (const logEntry of battleLog) {
		if ((!loggedIn && loggedIn !== 0 )|| loggedIn < i) {
			console.log(`${i}`);
			for (const key in logEntry) {
				console.log(`${key} => ${logEntry[key]}`);
			}
			loggedIn = i;
			break;
		}
		i++;
	}
}

function serangMonster() {
	nyerang(ATTACK);
}

function seranganKuat() {
	nyerang(STRONG_ATTACK);
}

attackBtn.addEventListener('click', serangMonster);
strongAttackBtn.addEventListener('click', seranganKuat);
healBtn.addEventListener('click', isiDarah);
logBtn.addEventListener('click', showLog);