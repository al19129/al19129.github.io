const key_list = [
    '1'  , '2', '3', '4', '5', '6', '7', '8', '9', '0', '-' , '^', //'\xA5',
    '\\t', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' , '@', '[' , 
    'a'  , 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':' , ']', 
    'z'  , 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', ' '
];
const key_array = [
    ['1', 1, 2]  , ['2', 1, 3], ['3', 1, 4], ['4', 1, 5], ['5', 1, 6], ['6', 1, 7], ['7', 1, 8], ['8', 1, 9] , ['9', 1, 10], ['0', 1, 11], ['-', 1, 12] , ['^', 1, 13] , //['\\', 1, 14], // 1:E/J
    ['\\t', 2, 1], ['q', 2, 2], ['w', 2, 3], ['e', 2, 4], ['r', 2, 5], ['t', 2, 6], ['y', 2, 7], ['u', 2, 8] , ['i', 2, 9] , ['o', 2, 10], ['p', 2, 11] , ['@', 2, 12] , ['[', 2, 13]  , // 14:Enter
    ['a', 3, 2]  , ['s', 3, 3], ['d', 3, 4], ['f', 3, 5], ['g', 3, 6], ['h', 3, 7], ['j', 3, 8], ['k', 3, 9] , ['l', 3, 10], [';', 3, 11], [':', 3, 12] , [']', 3, 13] , //['\\n', 3, 14], // 1:CapsLock
    ['z', 4, 3]  , ['x', 4, 4], ['c', 4, 5], ['v', 4, 6], ['b', 4, 7], ['n', 4, 8], ['m', 4, 9], [',', 4, 10], ['.', 4, 11], ['/', 4, 12], ['\\', 4, 13], // 1:lShift, 2:none, 14:rShift
    [' ', 5, 7]  // key[5][7]:space
];
const num       = ["1", "2" , "3", "4", "5", "6", "7" , "8", "9"];
const num_shift = ["!", "\"", "#", "$", "%", "&", "\'", "(", ")"];
const unn_shift = ["-", "^" , "" , "@", "[", ";", ":" , "]", ",", ".", "/", "\\"];
const nes_shift = ["=", "~" , "|", "`", "{", "+", "*" , "}", "<", ">", "?", "_" ];

var color = new Array(6);
var key = new Array(6);
// 写経のお手本プログラムを保持しているっぽい
// line:行数 pos:何文字目か を要素とする二次元配列linesかも(ちょっと違うかも)
// 写経するプログラムがこの配列の各要素に行ごとに格納されている．つまり各要素は写経するプログラムの1行を文字列で表したもの
var lines = new Array();
var line = 0;
// 位置position？
var pos = 0;
var sampleCode;
// status
var stat = 0;
var backup_program = "";
var backup_stat = 0;
var tabCount = 0;
const down = [9, 8, 13];


// ミスタイプした時のタイピング時間について決める必要がある．
// キーボードガチャガチャしてるだけでスコアが伸びるのは良くないから，ミスタイプはタイピング時間に換算しないことにする？
// プログラムの写経学習という点ではスペースもエンターもタイピング時間にカウントする
// コードタイピングという観点からだとコードの最後の文字が入力された時点でタイピング時間のカウントをやめたほうがいいかも
// どこでタイプミスをしたかは取得できた．写経するコードを改行文字を除いた一次元配列に格納してミスした場所のキーを取得するのもいいかも
// タイプミスしたキーとは，本来タイプするべきだったのにタイプされなかったキーのこととする
// inputは入力された文字が格納されている．タイプミスしたらフラグを立てて次に入力された文字をタイプミスした文字とするとか？

// とりあえずもう一度ボタンのことは考えずに作る

// ダイグラフを保存する配列．
// 一つ目の要素は基準時間からプログラム開始時間の差だから無意味な値
// これの要素数は写経入力欄に正常に打ち込まれた文字の数と等しい
let timeDiffArr = [];
// タイピング開始時間を格納
let timeStart = 0;
// 前回打鍵された時の時刻
let timeLast = 0;
// ダイグラフを一時的に格納するもの
let timeDiff = 0;
// 差の時間を足し合わせて合計タイピング時間とする変数
let sumDiff = 0;
// 何個目のダイグラフか数える変数
// ミスだとしても写経エリアに文字が入力されたらカウントされる(timeDiffArrの長さと違うところはこの点)
let inputCount = 0;
// ミスを数える変数
// ミスタイプして画面が赤くなってるとき適当にキー押してもmissCountは増えない
let missCount = 0;
// ソースコード上のどこの文字をタイプミスしたかを格納する配列
// #と入力するべきところをiと入力したら#が入る
let whereMissCollection = [];
// 何のキーを間違って押したかを格納する配列
// #と入力するべきところをiと入力したらiが入る
let whatMissCollection = [];
// タイプミスしたことを記憶するフラグ．trueでタイプミス
let missFlag = false;
// 何回目のキータイプでタイプミスをしたかを格納する配列
let missArr = [];
// 実験で使うデータを格納・出力するためのオブジェクト
// オブジェクトに格納される値はサンプルプログラムの最後の文字までの計算結果．そのあとのenterを押すまでの時間とかは計算しないっぽい
let syakyouObj = {};



// 光るグループか従来か 光らせるコード
function CreateEffect() {
    var data = { 'color': color, 'key': key };
    // API？に指定した色に光らせるよう依頼
    chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", data);
}


// 写経が終了したことを知る仕組みはない？だとすると写経にかかった時間はtimeDiffArrの和で出す？

function InputProcess(input) {

    // inputCount++;
    // console.log("inputCount++");
    if (stat == 0) {
        // alert("入力すべき文字がありません．\n［ファイルを選択］からファイルを選択するか，選択済みの場合は［はじめから］をクリックしてください．");
    } else if (stat == 1) {

        // このブロックは少なくともキーが入力されていて，その正誤によって処理をするところ
        // エンターが押されただけだと個々の処理は実行されない？


        console.log("現在入力されたキーは : " + input);
        // 引数が現在のポジションの文字ならば(正しい入力がされたなら)
        // line:行数 pos:何文字目か を要素とする二次元配列lines
        if (input == lines[line][pos]) {

            // if(タイプされたキーが正しかったら){以下の処理をする}else{何番目のダイグラフでミスったか保存する}
            // 前回キーが押された時の時間との差（ダイグラフ）をとる処理．．．
            // 押された時間を取得 
            date = new Date();
            temp = date.getTime();
            // 押された時刻とひとつ前のキーが押された時刻の差を格納
            timeDiff = temp - timeLast;
            // その差を配列に格納
            timeDiffArr.push(timeDiff);
            // タイプされた文字が一文字目なら
            if(timeLast === 0){
                // タイピング開始時刻を格納(写経が終了したのが分かったこれとの差を求める必要がある．)
                timeStart = temp;

                
            }else{
                // 合計タイピング時間に追加
                sumDiff = sumDiff +  timeDiff;
            }
            // 次回押されるキーとの差をとるために今回押された時間を格納 更新
            timeLast = temp;

            // 直前の入力がタイプミスなら今回の入力をタイプミスしたキーとして格納
            // この処理は正しいキーがタイプされたとき処理されるしエンターが押されたときは処理されない
            // エンターがタイプされたとき実行される関数で改行文字を格納しているからエンターもカバーできてる
            if(missFlag){
                whereMissCollection.push(input);
                missFlag = false;

            }


            // コンソールに必要そうな値を表示
            console.log("");
            console.log("//////////////");

            // console.log("ダイグラフは" + (timeDiff / 1000) + "です");

            syakyouObj.digraphArr = timeDiffArr;
            // console.log("↓はダイグラフの一覧です");
            // console.log(syakyouObj.digraphArr);

            syakyouObj.allTypingTime = sumDiff / 1000;
            // console.log("合計タイピング時間は" + syakyouObj.allTypingTime + "msです");

            syakyouObj.wps = (timeDiffArr.length / (sumDiff / 1000));
            // console.log("現在の1秒当たりの入力文字数(WPS)は" + syakyouObj.wps + "です");



            syakyouObj.correctCount = timeDiffArr.length;
            console.log("正しいタイピングの回数は" + syakyouObj.correctCount + "です");

            syakyouObj.missCount = missCount;
            console.log("ミスタイプ数は" + syakyouObj.missCount + "です");

            // syakyouObj.inputCount = inputCount;
            syakyouObj.inputCount = syakyouObj.missCount + syakyouObj.correctCount;
            console.log("キーがタイプされた回数(ミスタイプを含む)は" + syakyouObj.inputCount + "です");

            console.log("digraphArr.length is " + syakyouObj.digraphArr.length)

            syakyouObj.correctLate = ((timeDiffArr.length / syakyouObj.inputCount) * 100);
            console.log("正タイプ率は" + syakyouObj.correctLate + "%です");

            syakyouObj.missLate = ((missCount / syakyouObj.inputCount) * 100);
            console.log("タイプミスの割合は" + syakyouObj.missLate + "%です");

            syakyouObj.sumProbs = syakyouObj.correctLate + syakyouObj.missLate;
            console.log("確率の和は" + syakyouObj.sumProbs);

            syakyouObj.sampleCode = sampleCode;
            // console.log("写経するプログラム" + syakyouObj.sampleCode);

            syakyouObj.whereMissCollection = whereMissCollection;
            console.log("タイプミスした文字は" + syakyouObj.whereMissCollection);

            missArr.push(0);
            syakyouObj.missArr = missArr;
            // console.log("missArr: " + syakyouObj.missArr);

            syakyouObj.whatMissCollection = whatMissCollection;
            console.log("whatmisscolloection:" + whatMissCollection);

            console.log("//////////////");
            console.log("");
            // 写経が完了したらウィンドウアラートで知らせてくれる



            // 演出を表示しなおすためにクリアして
            KeyboardClear();
            // プログラムを書く？？？
            WriteProgram(lines[line][pos]);
            // 行の終端でないなら
            if (pos < lines[line].length-1) {
                // ポジションを右にずらす
                ++pos;
            // 行の終端で，そこが最後の行でなければ
            } else if (line < lines.length) {
                // 次の行へ
                ++line;
                // ポジションリセット
                pos = 0;
                stat = 4;
                // エンターを押させる関数っぽいけど内容がそうじゃなさそう
                EnterEffects();
                return;
            }
            // エフェクトを出す
            // 次に押すべきキーの情報が渡される．
            KeyboardEffects(lines[line][pos]);
        } else {
            // 入力された文字が正しい文字でなければこの関数が実行される．
            MissEffects(input);
        }
    } else if (stat != 3) {
        MissEffects(input);
    }
}

function TabProcess() {
    if (stat == 0) {
        alert("入力すべき文字がありません．\n［ファイルを選択］からファイルを選択するか，選択済みの場合は［はじめから］をクリックしてください．");
    } else if (stat == 2) {

        // ここから加筆
        // console.log("true tab");
        // 正しくtabが押されたときはダイグラフを書き加える
        date = new Date();
        temp = date.getTime();
        // 押された時刻とひとつ前のキーが押された時刻の差を格納
        timeDiff = temp - timeLast;
        // その差を配列に格納
        timeDiffArr.push(timeDiff);
        // タイプされた文字が一文字目なら
        if(timeLast === 0){
            // タイピング開始時刻を格納(写経が終了したのが分かったこれとの差を求める必要がある．)
            timeStart = temp;
        }else{
            // 合計タイピング時間に追加
            sumDiff = sumDiff +  timeDiff;
        }
        // 次回押されるキーとの差をとるために今回押された時間を格納 更新
        timeLast = temp;

        
        // 正しくtabが押されたとき，直前にミスタイプしていればwhereMissCollectionにpush
        if (missFlag == true){
            whereMissCollection.push("\t")
            missFlag = false;
        }

        
        // ここまで加筆

        KeyboardClear();
        WriteProgram("\t");
        if (--tabCount == 0) {
            KeyboardEffects(lines[line][pos]);
        } else {
            TabEffects();
        }
    } else if (stat != 3) {
        MissEffects("\t");
    }
}

function MissProcess() {
    if (stat == 0) {
        alert("入力すべき文字がありません．\n［ファイルを選択］からファイルを選択するか，選択済みの場合は［はじめから］をクリックしてください．");
    } else if (stat == 3) {
        KeyboardClear();
        document.getElementById('program').value = backup_program;
        document.getElementById('program').style.backgroundColor = 'white';
        if (backup_stat == 1) {
            KeyboardEffects(lines[line][pos]);
        } else if (backup_stat == 2) {
            TabEffects();
        } else if (backup_stat == 4) {
            EnterEffects();
        }
    } else {
        // 
    }
}

function EnterProcess() {

    if (stat == 0) {
        alert("入力すべき文字がありません．\n［ファイルを選択］からファイルを選択するか，選択済みの場合は［はじめから］をクリックしてください．");
    } else if (stat == 4) {
        inputCount++;

        // ここから加筆
        console.log("true tab")

        // 正しくtabが押されたときはダイグラフを書き加える
        date = new Date();
        temp = date.getTime();
        // 押された時刻とひとつ前のキーが押された時刻の差を格納
        timeDiff = temp - timeLast;
        // その差を配列に格納
        timeDiffArr.push(timeDiff);
        // タイプされた文字が一文字目なら
        if(timeLast === 0){
            // タイピング開始時刻を格納(写経が終了したのが分かったこれとの差を求める必要がある．)
            timeStart = temp;
        }else{
            // 合計タイピング時間に追加
            sumDiff = sumDiff +  timeDiff;
        }
        // 次回押されるキーとの差をとるために今回押された時間を格納 更新
        timeLast = temp;
        // ここまで加筆


        // (たぶん)正しくエンターが押されたときに処理されるブロック
        // ここでフラグが立ってたらエンターがタイプミスしたキーということになる．
        if(missFlag){
            whereMissCollection.push("\n");
            missFlag = false;
        }
        KeyboardClear();
        // document.getElementById('id').valueで'id'IDを持つエレメントのドキュメントを取得している？
        // サンプルプログラムと写経したプログラムが一致していたら(写経が終わっていたら)
        if (document.getElementById('program').value.slice(0, -1) == document.getElementById('sample').value) {
            // 保存するjsonファイルの名前を決める
            // yuta 選択されたファイル名を取得する
            let element = document.getElementById('file');
            let files = element.files;
            let fileName = files[0].name.replace('.', '_');

            // ダイグラフの配列先頭要素は標準時が入っているから0にする
            syakyouObj.digraphArr[0] = 0;
            // 写経したデータをjsonで保存
            const json = JSON.stringify(syakyouObj, null, 2);
            const blob = new Blob([json], {type:"application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = subjectID + "_" +  fileName + ".json"
            a.click();
            URL.revokeObjectURL(url);

            // 写経したコードをファイルとして保存するか聞く？
            Output();
            // 関数を抜ける
            return;
        }
        // サンプルと写経したプログラムが一致していなかったら
        // 改行文字を写経してるプログラムに追記する
        WriteProgram("\n");
        // もう一度写経が終わっているか確認？？
        if (document.getElementById('program').value.slice(0, -1) == document.getElementById('sample').value) {
            Output();
            return;
        }
        LineProcess();
    } else if (stat != 3) {
        // 間違ってエンターを押していた場合

        MissEffects("\n");
    }
}

function LineProcess() {
    var tabArray = lines[line].split('\t');
    tabCount = 0;
    for (i=0; i<tabArray.length; ++i) {
        if (tabArray[i] == "") {
            ++tabCount;
        } else {
            lines[line] = tabArray[i];
        }
    }
    if (tabCount > 0) TabEffects();
    else KeyboardEffects(lines[line][pos]);
}

// 引数は次に押すべきキーの情報
function KeyboardEffects(ch) {
    var lightUp = new Array();
    init();
    // 引数を変換して配列へのポインタを保持する変数に格納？
    lightUp = translate(ch);
    for (r=0; r<lightUp.length; ++r) {
        key[lightUp[r][0]][lightUp[r][1]] = 0x01000000 | 0xff00ff;
    }
    stat = 1;
    CreateEffect();
}

function TabEffects() {
    init();
    key[2][1] = 0x01000000 | 0xff00ff;
    stat = 2;
    CreateEffect();
}

// ミスった時の演出？
// どんなキーでもミスタイプをしたらこの関数を通る
// ここで間違えて何をミス・タイプしたのかを格納する
function MissEffects(input) {
    // ミスをカウント
    missCount++;

    // ミスした場所を記録
    missArr.push(1);
    // 何をミスタイプしたか格納
    whatMissCollection.push(input);

    missFlag = true;
    backup_program = document.getElementById('program').value;
    backup_stat = stat;
    WriteProgram(input);
    document.getElementById('program').style.backgroundColor = 'lightcoral';
    init();
    key[1][15] = 0x01000000 | 0xff00ff;
    stat = 3;
    CreateEffect();
}

function EnterEffects() {
    // 現在位置とかを管理するやつを初期化している？
    init();
    // エンターキーに対応する配列要素に色を指定している？
    // エンターを光らせようとしている？
    key[3][14] = 0x01000000 | 0xff00ff;
    stat = 4;
    // 発行させる関数っぽい
    CreateEffect();
}

function KeyboardClear() {
    init();
    CreateEffect();
}

function WriteProgram(ch) {
    // 写経しているプログラムのテキストを変数に格納
    var program = document.getElementById('program').value;
    // 写経しているプログラムのエレメントにさっき格納してたテキストと引数の一文字を足して更新？
    // これで写経しているテキストが更新されていくのかも
    document.getElementById('program').value = program.slice(0, -1) + ch + "|";
}

function translate(ch) {
    var lightUp = new Array();
    var index;
    if (key_list.includes(ch) == true) { // shift不要
        index = key_list.indexOf(ch);
    } else { // shift必要
        lightUp.push([4, 1]); // lshift
        lightUp.push([4, 14]); // rshift
        if (ch.match(/^[A-Z]+$/)) { // 大文字アルファベット
            index = key_list.indexOf(ch.toLowerCase());
        } else if (num_shift.includes(ch) == true) { // 数字+shift
            index = num_shift.indexOf(ch);
            index = key_list.indexOf(num[index]);
        } else if (nes_shift.includes(ch) == true) { // 記号+shift
            index = nes_shift.indexOf(ch);
            index = key_list.indexOf(unn_shift[index]);
        }
    }
    lightUp.push([key_array[index][1], key_array[index][2]]);
    return lightUp;
}

function InitTextarea(sample) {
    sampleCode = sample.replace(/    /g, "\t");
    // サンプルプログラムを左のテキストエリアに入れる
    document.getElementById('sample').value = sampleCode;
    // 写経エリアを空にする．
    document.getElementById('program').value = "";
    LightUp();
}

function init() {
    for (r = 0; r < 6; r++) {
        color[r] = new Array(22);
        for (c = 0; c < 22; c++) {
            color[r][c] = 0;
        }
   }
   for (r = 0; r < 6; r++) {
        key[r] = new Array(22);
        for (c = 0; c < 22; c++) {
            key[r][c] = 0;
        }
    }
}

function LightUp() {
    if (lines[0] == '' && lines.length <= 1) {
        alert('サンプルコードが入力されていません．\nサンプルコードを入力してからボタンをクリックしてください．');
    } else {
        line = 0;
        pos = 0;
        document.getElementById('program').style.backgroundColor = 'white';
        document.getElementById('sample').style.backgroundColor = 'white';
        lines = new Array();
        lines = sampleCode.split(/\r\n|\n/);
        document.getElementById('program').value = "|";
        document.activeElement.blur();
        KeyboardEffects(lines[line][pos]);
    }
}

// 写経が終わった時の処理
function Output() {
    

    // おそらく写経したプログラムの最後に入力させられる改行文字を消すためにスライスしている？
    document.getElementById('program').value = document.getElementById('program').value.slice(0, -1);
    // テキストエリアを緑にする．
    document.getElementById('program').style.backgroundColor = 'lightgreen';
    document.getElementById('sample').style.backgroundColor = 'lightgreen';

    // ここで写経の結果を出力
    // ローカルストレージにJSONファイルとして？保存
    let syakyouJSON = JSON.stringify(syakyouObj);
    localStorage.setItem('syakyouOBJ',syakyouJSON);


    // window.alertみたいなのが出て，ファイルをダウンロードするか聞かれる．それでOKが入力されたらconfirm関数がtrueを返すっぽい
    // ifの中身はyes no のダイアログが流れる関数が入っていた．yesでtrueの返り値を得たとき，ifの中が実行される流れだったっぽい
    if (alert("プログラムの写経が完了しました．\nそのままお待ちください．")) {
        // ファイルをダウンロードすると選択したら処理される領域
        const blob = new Blob([document.getElementById('program').value],{type:"text/plain"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'download.c';
        link.click();
    }
    stat = 0;
}







// ダイグラフを格納するtimeDiffArrは正しくタイプされた文字と同じ数だけの要素数を持つ
// そのうちのどのダイグラフでミスをしたのか今のところ分からない