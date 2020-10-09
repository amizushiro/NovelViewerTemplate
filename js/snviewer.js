/**
NovelViewer SAKURA

Copyright (c)2020 Aya Mizushiro

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
class SNViwerAppClass {

  constructor(param) {
    this.indent =  param && "indent" in param ? param.indent : false;
    this.convert = param && "convert" in param ? param.convert : true;
    this.return = param && "return" in param ? param.return : false;
    this.twitter = param && "twitter" in param ? param.twitter : false;
    this.indexList = param && "indexList" in param ? param.indexList : false;
    this.touchDevice = this.isTouchDevice();
    this.imageUrls = '';
    this.imageLoading = false;
    this.wrapper = document.getElementById("app");
    this.init();
  }

  init() {
    this.insertLoading();

    if (this.fontCheck()) {
      this.insertFont();
    }

    this.createMenu(this.indexList);

    if (this.convert) {
      this.imageLoading = this.convertNovelText();
    }
    
    if (document.getElementById('nvl-title') != null) {
      document.getElementById('nvl-title').classList.add('novel-title');
    }

    if (document.getElementById('nvl-subtitle') != null) {
      document.getElementById('nvl-subtitle').classList.add('novel-subtitle');
    }

    if (document.getElementById('nvl-section-title') != null) {
      const sectionTitle = document.getElementById('nvl-section-title');
      sectionTitle.classList.add('section-title');
      const addNode = this.createSpanEl('', '', sectionTitle.textContent.trim());
      sectionTitle.textContent = '';
      sectionTitle.appendChild(addNode);
    }

    if (document.getElementById('novel-body') != null) {
      document.getElementById('novel-body').classList.add('novel-block');
    }

    this.saveStyleLoad();
    
    if(!this.imageLoading) {
      // スクロール方向により初期化
      if (this.writing === 'rtl') {
        this.setScrollX();
      }
      this.loadingHide();
    }
  }

  insertLoading() {
    const loadingWrapEl = this.createDivEl('loading','loader-wrapper');
    const loadingEl = this.createDivEl('', 'loading');
    loadingEl.appendChild(this.createSpanEl('', '', 'Loading...'));
    loadingWrapEl.appendChild(loadingEl);
    document.body.appendChild(loadingWrapEl);
  }

  insertFont() {
    const gothicUri = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
    const minchoUri = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap';
    const linkEl = document.createElement('link');
    linkEl.rel = "stylesheet";

    linkEl.href = gothicUri;
    document.getElementsByTagName('head')[0].appendChild(linkEl);

    linkEl.href = minchoUri;
    document.getElementsByTagName('head')[0].appendChild(linkEl);
  }

  createMenu(indexList) {
    const menuEl = this.createMenuEl('','');
    if (this.return) { 
      menuEl.appendChild(this.createAEl('','novel-close-button', this.return,'×閉じる'));
    }

    // スタイル表示ボタン
    const closeStyle = this.createLabelEl('close-style', 'menu-close-toggle', 'novel-style-toggle', 'close');
    closeStyle.style.display = "none";
    menuEl.appendChild(closeStyle);

    // 目次閉じるボタン
    const closeIndex = this.createLabelEl('close-index', 'menu-close-toggle', 'novel-index-toggle', 'close');
    closeIndex.style.display = "none";
    menuEl.appendChild(closeIndex);
    
    menuEl.appendChild(this.createStyleMenu());
    if (0 < Object.keys(indexList).length) {       
      menuEl.appendChild(this.createIndex(indexList));
    }

    this.wrapper.appendChild(menuEl);
  }

  createStyleMenu() {
    const menuDivEl = this.createDivEl('', '');

    const styleMenuBtn = this.craeteCheckboxEl('novel-style-toggle', '');
    styleMenuBtn.addEventListener("change", (event) => { this.toggleStyle(event); }, false);
    menuDivEl.appendChild(styleMenuBtn);
    menuDivEl.appendChild(this.createLabelEl('', 'novel-style-toggle-label', 'novel-style-toggle', 'スタイル'))

    const menu = this.createDivEl('novel-style-menu', 'novel-menu');
    const contentsEl = this.createDivEl('', 'novel-style-contents');

    // 文字サイズ
    const wrapEl1 = this.createDivEl('', 'menu-item-wrap');
    wrapEl1.appendChild(this.createPEl('', 'menu-item-label', '文字サイズ'));

    const sizeWrap = this.createDivEl('', 'novel-radio-wrap');
    
    const smallRdo = this.createRadioEl('fontsize-small', '', 'fontsize');
    smallRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(smallRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-small'], 'fontsize-small', '小'));

    const normalRdo = this.createRadioEl('fontsize-normal', '', 'fontsize', 'normal');
    normalRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(normalRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-normal'], 'fontsize-normal', '中'));
    
    const largeRdo = this.createRadioEl('fontsize-large', '', 'fontsize', 'large');
    largeRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(largeRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-large'], 'fontsize-large', '大'));
    
    const oversizeRdo = this.createRadioEl('fontsize-oversize', '', 'fontsize', 'oversize');
    oversizeRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(oversizeRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-oversize'], 'fontsize-oversize', '特大'));
    
    wrapEl1.appendChild(sizeWrap);
    contentsEl.appendChild(wrapEl1);

    // 背景
    const wrapEl2 = this.createDivEl('', 'menu-item-wrap');
    wrapEl2.appendChild(this.createPEl('', 'menu-item-label', '背景'));
    
    const backWrap = this.createDivEl('', 'novel-radio-wrap');
    const whiteRdo = this.createRadioEl('theme-white', '', 'theme', 'white');
    whiteRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(whiteRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-white'], 'theme-white', '白'));
    const darkRdo = this.createRadioEl('theme-dark', '', 'theme', 'dark');
    darkRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(darkRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-dark'], 'theme-dark', '黒'));
    const kinariRdo = this.createRadioEl('theme-kinari', '', 'theme', 'kinari');
    kinariRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(kinariRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-kinari'], 'theme-kinari', '生成り'));

    wrapEl2.appendChild(backWrap);
    contentsEl.appendChild(wrapEl2);

    // 書体
    const wrapEl3 = this.createDivEl('', 'menu-item-wrap');
    wrapEl3.appendChild(this.createPEl('', 'menu-item-label', 'フォント'));

    const fontWrap = this.createDivEl('', 'novel-radio-wrap');
    const minchoRdo = this.createRadioEl('font-mincho', '', 'font', 'mincho');
    minchoRdo.addEventListener("change", (event) => { this.toggleFont(event); }, false);
    fontWrap.appendChild(minchoRdo);
    fontWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-mincho'], 'font-mincho', '明朝'));
    const gothicRdo = this.createRadioEl('font-gothic', '', 'font', 'gothic');
    gothicRdo.addEventListener("change", (event) => { this.toggleFont(event); }, false);
    fontWrap.appendChild(gothicRdo);
    fontWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-gothic'], 'font-gothic', 'ゴシック'));

    wrapEl3.appendChild(fontWrap);
    contentsEl.appendChild(wrapEl3);

    // 組版
    const wrapEl4 = this.createDivEl('', 'menu-item-wrap');
    wrapEl4.appendChild(this.createPEl('', 'menu-item-label', '組版'));

    const writeWrap = this.createDivEl('', 'novel-radio-wrap');
    const rtlRdo = this.createRadioEl('write-rtl', '', 'write', 'rtl');
    rtlRdo.addEventListener("change", (event) => { this.toggleWriting(event); }, false);
    writeWrap.appendChild(rtlRdo);
    writeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-rtl'], 'write-rtl', '縦書き'));
    const ltrRdo = this.createRadioEl('write-ltr', '', 'write', 'ltr');
    ltrRdo.addEventListener("change", (event) => { this.toggleWriting(event); }, false);
    writeWrap.appendChild(ltrRdo);
    writeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-ltr'], 'write-ltr', '横書き'));

    wrapEl4.appendChild(writeWrap);
    contentsEl.appendChild(wrapEl4);

    menu.appendChild(contentsEl);
    menuDivEl.appendChild(menu);

    return menuDivEl;
  }

  createIndex(indexList) {
    const menuDivEl = this.createDivEl('', '');

    const indexMenuBtn = this.craeteCheckboxEl('novel-index-toggle', '');
    indexMenuBtn.addEventListener("change", (event) => { this.toggleIndex(event); }, false);
    menuDivEl.appendChild(indexMenuBtn);
    
    menuDivEl.appendChild(this.createLabelEl('', 'novel-index-toggle-label', 'novel-index-toggle', '目次'))
    const menu = this.createDivEl('novel-index-menu', 'novel-menu');
    const contentsEl = this.createDivEl('', 'novel-index-contents');

    contentsEl.appendChild(this.createPEl('', 'index-title', this.getTitle()));
    contentsEl.appendChild(this.createPEl('', 'index-subtitle', this.getSubtitle()));
    contentsEl.appendChild(this.createIndexList(indexList));

    menu.appendChild(contentsEl);
    menuDivEl.appendChild(menu);

    return menuDivEl;
  }
  
  createIndexList(indexArray) {
    const currentUri = window.location.href;
    const ol = document.createElement('ol');
    ol.setAttribute('id', 'index-list');
    this.addClass(ol, 'index-list');

    let idx = -1;
    var fragment = document.createDocumentFragment();
    Object.keys(indexArray).forEach((key, index) => {
      const li = document.createElement('li');
      if (currentUri.endsWith(indexArray[key])) {
        li.appendChild(this.createAEl('', 'current', indexArray[key], key));
        idx = index;
      }
      else {
        li.appendChild(this.createAEl('', '', indexArray[key], key));
      }
      fragment.appendChild(li);
    });

    ol.appendChild(fragment);

    if (0 <= (idx - 1)) {
      const key = Object.keys(indexArray)[idx-1];
      this.insertHeader(key, indexArray[key]);
    }
    if ((idx + 1) < Object.keys(indexArray).length) {
      const key = Object.keys(indexArray)[idx+1];
      this.insertFooter(key, indexArray[key]);
    }
    else {
      this.insertFooter(false, false);
    }

    return ol;
  }

  insertHeader(section, url) {
    const headerEl = document.createElement('header');
    this.addClass(headerEl, 'novel-header');
    headerEl.appendChild(this.createAEl('', 'prev-link', url, section));
    this.wrapper.insertBefore(headerEl, this.wrapper.firstChild);
  }

  insertFooter(section, url) {
    const footerEl = document.createElement('footer');
    this.addClass(footerEl, 'novel-footer');

    if (this.twitter) {
      const snsEl = this.createDivEl('', 'sns-wrap');
      const ulEl = document.createElement('ul');
      this.addClass(ulEl, 'sns-list');
      const liEl = document.createElement('li');
      const novelUrl = window.location.href;
      const param = {
        'text': this.getTitle() + ' ' + this.getSubtitle() + '\n「' + this.getSectionTitle() + '」',
        'url': novelUrl
      };
      let res = [];
      for (let key in param) {
        res[res.length] = encodeURIComponent(key) + "=" + encodeURIComponent(param[key]);
      }
      const tweetUrl = 'https://twitter.com/intent/tweet?' + res.join("&");
      liEl.appendChild(this.createAEl('', ['sns-link', 'btn-twitter'], tweetUrl, 'Twitter'));

      ulEl.appendChild(liEl);
      snsEl.appendChild(ulEl);
      footerEl.appendChild(snsEl);
    }

    if (this.return) {
      const nextLink = document.createElement('a');
      if (section) {
        this.addClass(nextLink, 'next-link');
        nextLink.setAttribute('href', url);
        nextLink.innerText = section;
      }
      else {
        this.addClass(nextLink, 'close-link')
        nextLink.setAttribute('href', this.return);
        nextLink.innerText = '閉じる';
      }
      footerEl.appendChild(nextLink);
    }
    this.wrapper.appendChild(footerEl);
  }

  saveStyleLoad() {
    this.addClass(this.wrapper, 'novel-wrapper');
    // スタイル設定
    var fs = this.getStrage("fontsize");
    this.fontsize = fs !== null ? fs : "normal";
    this.addClass(this.wrapper, "fontsize-" + this.fontsize);
    document.getElementById("fontsize-" + this.fontsize).checked = true;

    var t = this.getStrage("theme");
    this.theme = t !== null ? t : "white";
    this.addClass(this.wrapper, 'paper-' + this.theme);
    document.getElementById("theme-" + this.theme).checked = true;

    var f = this.getStrage("font")
    this.font = f !== null ? f : "mincho";
    this.addClass(this.wrapper, 'font-' + this.font);
    document.getElementById("font-" + this.font).checked = true;

    var w = this.getStrage("writing");
    this.writing = w !== null ? w : "ltr";
    this.addClass(this.wrapper, this.writing);
    document.getElementById("write-" + this.writing).checked = true;
  }

  convertNovelText() {
    const target = document.getElementById("novel-body");
    let prevText = target.innerHTML;
    prevText = prevText.replace(/――/g, '<span class="dash-rule">―</span>―');
    prevText = prevText.replace(/\|/g, "｜");
    prevText = prevText.replace(/｜/g, '<ruby><rb>');
    prevText = prevText.replace(/《/g, '</rb><rp>（</rp><rt>');
    prevText = prevText.replace(/》/g, '</rt><rp>）</rp></ruby>');

    const lines = prevText.split(/\r\n|\n/);
    let imagesUri = this.getImagesUri(lines);

    // 画像作成
    this.loadingCount = 0;
    let images = new Array(imagesUri.length);
    for (let i = 0; i < imagesUri.length; i++) {
      images[i] = new Image();
      images[i].src = imagesUri[i];
      images[i].classList.add('sashie');
      images[i].alt = '';
      images[i].addEventListener('load',() => {
        const parent = document.getElementById("sashie" + (i+1));
        if (images[i].width > images[i].height) {
          images[i].classList.add('dir-v');
        }
        else {
          images[i].classList.add('dir-h');
        }
        const pEl = document.createElement("p");
        pEl.appendChild(images[i]);
        parent.parentNode.insertBefore(pEl, parent);
        parent.parentNode.removeChild(parent);

        this.loadingCount++;
        if (this.loadingCount === imagesUri.length) {
          // スクロール方向により初期化
          if (this.writing === 'rtl') {
            this.setScrollX();
          }
          this.loadingHide();
        }
      });
    }

    let newText = "";
    let imgidx = 1;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.includes('[')) {
        newText += "<p id=\"sashie" + imgidx + "\"></p>";
        imgidx++;
      }
      else if (this.indent && this.firstCharCheck(line)) {
        line = line.trim();
        newText += "<p>　" + line + "</p>";
      }
      else {
        newText += "<p>" + line + "</p>";
      }
    }
    target.innerHTML = newText;

    // ダミー画像挿入
    this.insertImageFlags(images);
    return 0 < images.length ? true : false;
  }

  getTitle() {
    const titleNode = document.getElementById('nvl-title');
    let title = '';
    for(let elem of titleNode.childNodes){
      if(elem.nodeName == "#text"){
        title += elem.nodeValue;
      }
    }
    return title.trim();
  }

  getSubtitle() {
    return document.getElementById('nvl-subtitle') ? document.getElementById('nvl-subtitle').textContent.trim() : '';
  }

  getSectionTitle() {
    return document.getElementById('nvl-section-title').textContent.trim();
  }

  getImagesUri(lines) {
    let imagesUri = new Array();
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.includes('[')) {
        imagesUri.push(line.split('[')[1].split(']')[0]);
      }
    }
    return imagesUri;
  }

  insertImageFlags(images) {
    for (let i = 0; i < images.length; i++) {
      let img = document.getElementById('sashie' + (i+1));
      img.appendChild(images[i]);
    }
  }

  loadingHide() {
    document.getElementById("loading").classList.add('hide');
  }

  toggleTheme(event) {
    const newTheme = event.target.value;
    this.changeClass(this.theme, newTheme, "paper-");
    this.theme = newTheme;
    this.setStrage("theme", newTheme);
  }

  toggleFont(event) {
    const newFont = event.target.value;
    this.changeClass(this.font, newFont, "font-");
    this.font = newFont;
    this.setStrage("font", newFont);
  }

  toggleFontsize(event) {
    const prevAreaX = document.body.scrollWidth - document.body.offsetWidth;
    const posX = window.scrollX;
    const newFontsize = event.target.value;
    this.changeClass(this.fontsize, newFontsize, "fontsize-");
    this.fontsize = newFontsize;
    this.setStrage("fontsize", newFontsize);

    if (this.writing !== "rtl") {
      return;
    }

    const newAreaX = document.body.scrollWidth - document.body.offsetWidth;
    const offsetX = prevAreaX - newAreaX;
    const newPosX = posX - offsetX;
    window.scroll(newPosX, 0);
  }
  
  toggleWriting(event) {
    const newWriting = event.target.value;
    this.changeClass(this.writing, newWriting, "");
    this.writing = newWriting;
    this.setStrage("writing", newWriting);

    if (this.writing === 'ltr') {
      this.setScrollY();
    }
    else {
      this.setScrollX();
    }
  }

  toggleStyle(event) {
    let flg = event.target.checked;
    if (flg) {
      document.getElementById("close-style").style.display = "block";
    } else {
      document.getElementById("close-style").style.display = "none";
    }
  }

  toggleIndex(event) {
    const flg = event.target.checked;
    if (flg) {
      document.getElementById("close-index").style.display = "block";
    } else {
      document.getElementById("close-index").style.display = "none";
    }
  }

  createMenuEl(idName, classArray) {
    const menu = document.createElement('menu');
    if (0 < idName.length) {
      menu.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(menu, classArray);
    }
    return menu;
  }
  
  createDivEl(idName, classArray) {
    const div = document.createElement('div');
    if (0 < idName.length) {
      div.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(div, classArray);
    }
    return div;
  }

  createPEl(idName, classArray, text) {
    const p = document.createElement('p');
    if (0 < idName.length) {
      p.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(p, classArray);
    }
    p.innerText = text;
    return p;
  }

  createSpanEl(idName, classArray, text) {
    const span = document.createElement('span');
    if (0 < idName.length) {
      span.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(span, classArray);
    }
    span.innerText = text;
    return span;
  }
  
  createAEl(idName, classArray, href, text) {
    const a = document.createElement('a');
    if (0 < idName.length) {
      a.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(a, classArray);
    }
    a.href = href;
    a.innerText = text;
    return a;
  }

  createLabelEl(idName, classArray, forName, text) {
    const lbl = document.createElement('label');
    if (0 < idName.length) {
      lbl.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(lbl, classArray);
    }
    if (0 < forName.length) {
      lbl.setAttribute('for', forName);
    }
    lbl.innerText = text;
    return lbl;
  }

  craeteCheckboxEl(idName, classArray) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (0 < idName.length) {
      checkbox.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(checkbox, classArray);
    }
    return checkbox;
  }

  createRadioEl(idName, classArray, name, value) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    if (0 < idName.length) {
      radio.setAttribute('id', idName);
    }
    if (0 < classArray.length) {
      this.addClass(radio, classArray);
    }
    if (0 < name.length) {
      radio.setAttribute('name', name);
    }
    radio.value = value;
    return radio;
  }

  addClass(el, classArray) {
    if (Array.isArray(classArray)) {
      classArray.forEach(cls => {
        el.classList.add(cls);
      });
    }
    else {
      el.classList.add(classArray);
    }
  }

  changeClass(prevClass, newClass, prefix) {
    this.wrapper.classList.remove(prefix + prevClass);
    this.wrapper.classList.add(prefix + newClass);
  }

  setScrollY() {
    const prevY = window.scrollY;
    const prevX = (document.body.scrollWidth - document.body.offsetWidth) - window.scrollX;

    const areaY = document.body.scrollHeight;
    const areaX = document.body.scrollWidth - document.body.offsetWidth;

    if (!this.touchDevice) {
      window.removeEventListener("wheel", this.scrollyTox, {passive: false});
    }
    window.scroll(0, prevX);
  }

  setScrollX() {
    const prevY = window.scrollY;
    const prevX = (document.body.scrollWidth - document.body.offsetWidth) - window.scrollX;

    const areaY = document.body.scrollHeight;
    const areaX = document.body.scrollWidth - document.body.offsetWidth;
    
    if (!this.touchDevice) {
      window.addEventListener("wheel", this.scrollyTox, {passive: false});
    }
    window.scroll(areaX - prevY, 0);
  }

  setStrage(name, item) {
    localStorage.setItem(name, item);
  }

  getStrage(name) {
    return localStorage.getItem(name);
  }

  scrollyTox(e) {
    if (e.deltaX === 0) {
      e.stopPropagation()
      e.preventDefault()
      // noinspection JSSuspiciousNameCombination
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('firefox') !== -1) {
        document.getElementById('app').scrollBy(-e.deltaY * 10, 0);
      }
      else {
        document.getElementById('app').scrollBy(-e.deltaY, 0);
      }
    }
  }

  firstCharCheck(l) {
    const c1 = l.trim().substring(0, 1);
    if (c1 === "「") {
      return false;
    }
    if (c1 === "（") {
      return false;
    }
    if (c1 === "『") {
      return false;
    }
    const c2 = l.substring(0, 2);
    if (c2 === "<i") {
      return false;
    }
    return true;
  }

  isTouchDevice() {
    var result = false;
    if (window.ontouchstart === null) {
      result = true;
    }  
    return result;
  }

  fontCheck() {
    return navigator.userAgent.includes('Android');
  }
}
