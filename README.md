# NovelViewer Template

![](docs/images//thumbnail.png)

NovelViewer Template はWebサイトで利用できる小説ビューワーテンプレートです。

小説ビューワーは、HTML/CSS/JavaScriptで作成しております。

## ライセンス

Copyright (c) 2020 Aya Mizushiro
This software is released under the MIT License, see [LICENSE](/LICENSE).

## 機能

 * 横書き／縦書き表示
 * ゴシック体／明朝体表示（※Android は動作保証対象外）
 * 文字サイズの変更（小・中・大・特大の４種類）
 * 背景色の変更（白・黒・生成りの３種類）
 * ルビ表示
 * 挿絵表示
 * 目次表示
 * レスポンシブ対応

サンプル  &raquo;
[NovelViewer Template サンプル](https://amizushiro.github.io/NovelViewerTemplate/)

## 動作環境

* Google Chrome
* FireFox
* Microsoft Edge（Chromium版のみ）
* Safari（Mac OS, iPad OS, iOS）
* Android※1

※1：Android 端末を持っていないため、エミュレータでのみ動作確認をしております。

## 使い方

ファイルは「src」フォルダにあるものを使用してください。

1．`</head>`の直前にスタイルシートを挿入。  
「`./path/`」は環境に合わせて変更してください。

```html
<link rel="stylesheet" href="./path/css/novelviewer.min.css">
```

2．`<body>`〜`</body>`内に下記を記述。

```html
<div id="app">
  <h1 id="nvl-title">
    シリーズタイトル
    <span id="nvl-subtitle">章タイトル（任意）</span>
  </h1>
  <h2 id="nvl-section-title">各話タイトル</h2>
  <div id="novel-body">
本文を
ここに書きます。
書き方の詳細は convert オプションの説明をご覧ください。
  </div>
</div>
```

3． `</body>`直前にJavaScriptを挿入。  
「path」は環境に合わせて変更してください。

```html
  <script src=./path/js/snviewer.min.js></script>
  <script>
    const viewerApp = new SNViwerAppClass();
  </script>
```

ディレクトリ直下の「`novelViewer.html`」がテンプレートになっています。  
また、`index.html`を開くと、サンプルを見ることができます。

基本的にはサンプルを参考に、テンプレートを使い回していただければ問題ないと思います。

##  オプション一覧

呼び出し時の引数にオプションを指定することで、いくつかの機能を有効／無効にできます。

| オプション名 | 入力値 | 説明 |
|-----------------|---------|------|
| indent | true / false | trueの時、行頭一字下げを行います。デフォルトでは false。 |
| convert | true / false | trueの時、記法（後述）の変換を行います。デフォルトでは true。 |
| return | string | 閉じるボタンを押した時に遷移する URL。指定しない場合は閉じるボタンが非表示になります。 |
| twitter | true / false | true の時、Twitter シェアボタンを表示します。デフォルトは false です。 |
| indexList | string 連想配列 | 目次リスト。目次リストを指定しない場合、目次は生成されません。 |

example：

```html
<script>
 const viewerApp = new SNViwerAppClass(
    {
      indent: true,
      convert: true,
      return: './index.html',
      twitter: true,
      indexList:
      {
         'ストーリータイトル1': 'ストーリー1 URL',
         'ストーリータイトル2': 'ストーリー2 URL'
      }
    });
</script>
```

## オプション詳細

### indent オプション

true の時、冒頭を全角空白で一字下げします。デフォルトは false です。  
「」、（）、『』は一字下げ対象外です。

自動インデント時は、前後の空白やタブは削除する仕様にしています。  
空白によって特殊なレイアウトを行っている場合は、このオプションを false にすることをお勧めします。

### convert オプション

true の時、本文を自動で段落タグで囲います。  
デフォルトは true です。

変換前  
```html
<div id="novel-body">
  ある晩、恭一はぞうりをはいて、すたすた鉄道線路の横の平らなところをあるいて居りました。
  たしかにこれは罰金です。おまけにもし汽車がきて、窓から長い棒などが出ていたら、一ぺんになぐり殺されてしまったでしょう。
  ところがその晩は、線路見まわりの工夫もこず、窓から棒の出た汽車にもあいませんでした。そのかわり、どうもじつに変てこなものを見たのです。
</div>
```

変換後  
```html
<div id="novel-body">
  <p>ある晩、恭一はぞうりをはいて、すたすた鉄道線路の横の平らなところをあるいて居りました。</p>
  <p>たしかにこれは罰金です。おまけにもし汽車がきて、窓から長い棒などが出ていたら、一ぺんになぐり殺されてしまったでしょう。</p>
  <p>ところがその晩は、線路見まわりの工夫もこず、窓から棒の出た汽車にもあいませんでした。そのかわり、どうもじつに変てこなものを見たのです。</p>
</div>
```
___

ダッシュを入力した場合、変換時にくっつく様にスタイルが自動であてられます。

変換前  
![ダッシュ変換前の表示。二つの―の間に隙間ができている。](./asset/dash_before.png)

変換後  
![ダッシュ変換後の表示。二つの—の間の隙間が狭まり繋がって見えている。](./asset/dash_after.png)

___

また、本文のみ一部、記法に対応しています。

使用できる記法は下記の通りです。

| 記法名 | 記法 | 変換後 |
|---------|------|---------|
|ルビ |｜漢字《かんじ》 |<ruby>漢字<rp>（</rp><rt>かんじ</rt><rp>）</rp></ruby> |
|挿絵 | [/path/hanami_inu.png]<br>※「path」は環境に合わせて変更してください。 |![犬のイラスト（いらすとや）](./asset/hanami_inu.png?resize=93,100)<br>画像は[いらすとや](https://www.irasutoya.com)より。|

これらの機能を使わない、自分でHTMLタグを記述して整形する場合は、このオプションを false にしてください。

### return オプション

戻り先URLを指定すると、指定したURLに戻る「閉じる」ボタンが表示されます。  
デフォルトでは戻り先がないため、閉じるボタンが非表示となります。

デフォルト表示  
![デフォルト表示。閉じるボタン非表示。](./asset/return_btn_hide.png)

オプションでURLを指定  
![オプションでURLを指定すると、閉じるボタンが表示される。](./asset/return_btn_show.png)

閉じるボタンは、本文の最後に表示されるものも対象です。

![ページ最後の閉じるボタン](./asset/return_btn_v2.png?resize=400,)

### twitter オプション

true の時、Twitter シェアボタンを表示します。  
デフォルトは false です。

ツイート内容はタイトルとURLです。

Twitter シェアボタン  
![表示されるTwitter シェアボタン](./asset/twitter_btn.png)

シェアボタン押下後  
![シェアボタンを押すと、Twitter公式のツイート画面に遷移する。](./asset/tweet_display.png)

### indexList オプション

指定すると目次リストを表示します。  
目次リストを指定しない場合、目次は生成されません。  
デフォルトは指定されていないため、表示されません。

記述サンプル  
```javascript
        indexList: 
        {
          '注文の多い料理店　序': 'novel1.html',
          'どんぐりと山猫': 'novel2.html',
          '狼森と笊森、盗森': 'novel3.html',
          '注文の多い料理店': 'novel4.html',
          '烏の北斗七星': 'novel5.html',
          '水仙月の四日': 'novel6.html',
          '山男の四月': 'novel7.html',
          'かしわばやしの夜': 'novel8.html',
          '月夜のでんしんばしら': 'novel9.html',
          '鹿踊りのはじまり': 'novel10.html'
        }
```

上記の表示サンプル  
![目次のサンプル表示](./asset/index_sample.png)  
「▼」がついているのが、現在表示しているページです。urlで判定しているため、打ち間違いにご注意ください。

___

また、目次リストを指定すると、前後の話に移動するリンクが自動で表示されます。

前話リンクのサンプル  
![前話リンクのサンプル表示](./asset/prev_btn.png?resize=600,)

次話リンクのサンプル  
![次話リンクのサンプル表示](./asset/next_btn.png?resize=600,)

## お問い合わせ

不具合、使い方でわからないところなど、  
何かございましたら、下記連絡先よりご連絡ください。

* [Mastodon（@amizushiro@sengenzakura.com）](https://mstdn.sengenzakura.com)
* [Twitter（@sengenzakura）](https://twitter.com/sengenzakura/)
