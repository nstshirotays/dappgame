# DApp ゲーム
　ここでは、本アプリをtruffleとganacheを使って起動する方法を説明します。実行環境としてはPaizaCloudを使います。この環境を構築すると、イーサリアムネットワークが内部メモリ上に構築されますので、非常に高速で動作します。

　
### サーバー構築
　Paiza Cloudにて node.jsを指定してサーバーを作成します
* ここで作成するサーバー名は、後ほどアプリのアクセスで必要となりますので、控えておいてください。
* サーバーは常時起動（ベーシックプランのみ）を選択して下さい（有料です）
* 無料プランではディスクサイズが不足してインストールできません。
* 無料プランで試したい方はRopstenなどに別途デプロイして下さい。
* Qiitaに記事を投稿しています
　
### インストール

```
npm install -g truffle
npm install -g ganache-cli
```

### ganache起動
　下記のコマンドでローカルにイーサリアムネットワークを作ります。
* なお、コマンド実行時に表示されるアカウントと秘密鍵は必ずコピーしておきましょう。

```
ganache-cli -h 0.0.0.0
```

* このプロセスは起動したままにしておいてください。停止した場合は全てやり直しとなります。
　
　
### Solidityコンパイル
　下記のコマンドでソリディティをコンパイルして、起動中のガナッシュにデプロイします。
　
```
cd dappgame
truffle compile
truffle migrate
```

* truffleの設定は　truffle-config.jsに記載されています。
* このファイルに対象とするイーサリアムネットワークや、solidityのバージョン。
* 生成されるabiファイルの場所などが指定されています。
　

### Reactスタート
　下記のコマンドでReactを動作させます。

```
cd dappgame
npm install
npm start
```

### アプリへのアクセス
　PaizaCloudのIDE画面内にブラウザが起動して画面が表示されますが、これは×閉じしてください。
　
* 別のブラウザ、もしくは別タブにて下記にアクセスします。
* https://ＸＸＸＸＸＸ.paiza-user-basic.cloud:3000/
* ＸＸＸＸＸＸの部分には最初にサーバーを作成した時の名前が入ります。

### メタマスクの設定
　PaizaCloud上で起動しているganacheネットワークにMetalmarkで接続します。
　
#### (1) ネットワークの設定
　メタマスクの設定からネットワークを追加する。
　
* ネットワーク名：自由
* 新規RPC URL：https://ＸＸＸＸＸＸ.paiza-user-basic.cloud:8545/
* チェーンID：1337　　（赤文字で警告がでますが無視します）
* 通貨記号：ETH
　
#### (2) アカウントのインポート
　ganache-cliを起動した際に表示されていたアカウントをインポートする。
* メタマスクのメニューからアカウントのインポートを選択する
* ganach-cliのPrivate Keysからどれか一つを選び、秘密鍵として張り付けます。
　
#### (3) アプリケーションへの接続
　dappgameの画面に移動し改めてメタマスクをポップアップ表示させます。
* その際に、アカウントの左側に　●接続済み　と表示されてればOKです。
* もしも　〇接続されていません　と表示されていた場合は、その文字をクリックして接続してください。
　
* 場合によっては、アプリとの接続確認画面に遷移せず、単に接続を促すメッセージのみ表示されます。
* その際は、ブラウザの再表示などを行ってメタマスクにアプリの存在を認識させて下さい。
　

