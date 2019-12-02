'use strict';

var baseUrl;
var title;
var supportsHtml;
var nolicense;
var languages;
var themes;
var support;

$(document).ready(function () {
  $.ajaxSetup({
    cache: false
  });

  var currentUrl = window.location.href;

  baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('start'));

  initialize();
});

function initialize() {
  $.getJSON(baseUrl + 'start/data', function (data) {
    title = data.title;
    supportsHtml = data.supportsHtml;
    languages = data.languages;
    themes = data.themes;
    nolicense = data.noLicense;

    var presetClient = getUrlParameter('client');
    var presetLanguages = getUrlParameter('lang');
    var presetTheme = getUrlParameter('themeid');
    var presetSupport = getUrlParameter('support');

    if (!supportsHtml && presetClient == 'html') {
      presetClient = null;
    }

    if (!presetClient) {
      presetClient = window.navigator.userAgent.toLowerCase().indexOf('windows') >= 0 ? 'fsclient' : 'java';
    }

    if (!presetTheme) {
      presetTheme = 'DefaultID';
    }

    if (presetLanguages) {
      presetLanguages = presetLanguages.split(',');
    }

    var langPreset1 = $(presetLanguages).get(0);
    var langPreset2 = $(presetLanguages).get(1);
    var langPreset3 = $(presetLanguages).get(2);

    if (!langPreset1) {
      langPreset1 = 'de';
    }

    if (presetSupport != null && presetSupport.length && (presetSupport.toLowerCase() === "true" || presetSupport.toLowerCase() === "1")) {
      support = true;
    }

    setTitle();
    setClients(presetClient);
    setLanguages1(langPreset1, langPreset2, langPreset3);
    setThemes(presetTheme);
    setLookFeels();
    setDownloadButtonText();
    setControlsEnabled();
    refreshLink();
    checkLicense();
    setContentVisible();
  });
}

function setTitle() {
  var titleStr = title + ' - Client Start';
  document.title = titleStr;
  $('#sp-app-name').html(titleStr);
}

function setClients(presetClient) {
  $('#sp-clients-wrapper').empty();
  $('#sp-clients-wrapper').append('<ul id="sp-clients-list" class="sp-select-list"></ul>');
  $('#sp-clients-list').append('<li client="fsclient" ' + (presetClient === 'fsclient' ? ' selected="selected"' : '') + '>Client Launcher</li>');
  $('#sp-clients-list').append('<li client="java" ' + (presetClient === 'java' ? ' selected="selected"' : '') + '>Java Web Start</li>');

  if (!!supportsHtml) {
    $('#sp-clients-list').append('<li client="html" ' + (presetClient === 'html' ? ' selected="selected"' : '') + '>Html</li>');
  }

  $('#sp-clients-list').on('click', 'li:not([selected])', clientSelectedChanged);
}

function clientSelectedChanged() {
  $('#sp-clients-list li').removeAttr('selected');
  $(this).attr('selected', true);
  setDownloadButtonText();
  setControlsEnabled();
  refreshLink();
}

function setLanguages1(langPreset1, langPreset2, langPreset3) {
  $('#sp-lang-wrapper-1').empty();

  if (languages && languages.length > 0) {
    $('#sp-lang-wrapper-1').append('<ul id="sp-lang-list-1" class="sp-select-list"></ul>');

    languages.forEach(function (language) {
      $('#sp-lang-list-1').append('<li iso="' + language.iso + '"' + (language.iso === langPreset1 ? ' selected' : '') + '>' + language.name + '</li>');
      $('#sp-lang-list-1').off('click').on('click', 'li:not([selected])', language1SelectedChanged);
    });
  } else {
    $('#sp-lang-wrapper-1').append('N/A');
  }

  setLanguages2(langPreset2, langPreset3);
}

function setLanguages2(langPreset2, langPreset3) {
  $('#sp-lang-wrapper-2').empty();

  if (languages && languages.length > 1) {
    if ($('#sp-lang-list-1').has('li[selected]').length) {
      $('#sp-lang-wrapper-2').append('<ul id="sp-lang-list-2" class="sp-select-list"></ul>');

      languages.forEach(function (language) {
        if ($('#sp-lang-list-1 li[selected]').attr('iso') !== language.iso) {
          $('#sp-lang-list-2').append('<li iso="' + language.iso + '"' + (language.iso === langPreset2 ? ' selected' : '') + '>' + language.name + '</li>');
          $('#sp-lang-list-2').off('click').on('click', 'li:not([selected])', language2SelectedChanged);
        }
      });
    }
  } else {
    $('#sp-panel-lang-2').remove();
  }

  setLanguages3(langPreset3);
}

function setLanguages3(langPreset3) {
  $('#sp-lang-wrapper-3').empty();

  if (languages && languages.length > 2) {
    if ($('#sp-lang-list-1').has('li[selected]').length && $('#sp-lang-list-2').has('li[selected]').length) {
      $('#sp-lang-wrapper-3').append('<ul id="sp-lang-list-3" class="sp-select-list"></ul>');

      languages.forEach(function (language) {
        if ($('#sp-lang-list-1 li[selected]').attr('iso') !== language.iso && $('#sp-lang-list-2 li[selected]').attr('iso') !== language.iso) {
          $('#sp-lang-list-3').append('<li iso="' + language.iso + '"' + (language.iso === langPreset3 ? ' selected' : '') + '>' + language.name + '</li>');
          $('#sp-lang-list-3').off('click').on('click', 'li:not([selected])', language3SelectedChanged);
        }
      });
    }
  } else {
    $('#sp-panel-lang-3').remove();
  }
}

function language1SelectedChanged() {
  $('#sp-lang-list-1 li').removeAttr('selected');
  $(this).attr('selected', true);
  setLanguages2();
  refreshLink();
}

function language2SelectedChanged() {
  $('#sp-lang-list-2 li').removeAttr('selected');
  $(this).attr('selected', true);
  setLanguages3();
  refreshLink()
}

function language3SelectedChanged() {
  $('#sp-lang-list-3 li').removeAttr('selected');
  $(this).attr('selected', true);
  refreshLink()
}

function setThemes(themePreset) {
  $('#sp-themes-wrapper').empty();

  if (themes && themes.length) {
    $('#sp-themes-wrapper').append('<ul id="sp-themes-list" class="sp-select-list"></ul>');

    themes.forEach(function (theme) {
      $('#sp-themes-list').append('<li themeid="' + theme.id + '"' + (theme.id === themePreset ? ' selected="selected"' : '') + '>' + theme.name + '</li>');
      $('#sp-themes-list').on('click', 'li:not([selected])', themeSelectedChanged);
    });
  } else {
    $('#sp-themes-wrapper').append('N/A');
  }
}

function themeSelectedChanged() {
  $('#sp-themes-list li').removeAttr('selected');
  $(this).attr('selected', true);
  refreshLink();
}

function setLookFeels() {
  $('#sp-lookfeel-wrapper').empty();
  $('#sp-lookfeel-wrapper').append('<ul id="sp-lookfeel-list" class="sp-select-list"></ul>');
  $('#sp-lookfeel-list').append('<li metal="1" selected="selected">Default</li>');
  $('#sp-lookfeel-list').append('<li metal="0">Metal</li>');
  $('#sp-lookfeel-list').on('click', 'li:not([selected])', lookFeelSelectedChanged);
}

function lookFeelSelectedChanged() {
  $('#sp-lookfeel-list li').removeAttr('selected');
  $(this).attr('selected', true);
  refreshLink();
}

function setDownloadButtonText() {
  if ($('#sp-clients-list').has('li[selected]').length) {
    var client = $('#sp-clients-list li[selected]:first').attr('client');

    if (client === 'fsclient') {
      $('#sp-download-link').html('Download Start File');
    } else {
      $('#sp-download-link').html('Download Jnlp');
    }
  }
}

function setControlsEnabled() {
  $('#sp-start-link').removeAttr('target');
  $('#sp-start-link').show(0);
  $('#sp-download-link').show(0);

  if (support) {
    $('#sp-support').removeClass('hidden');
  }

  if ($('#sp-clients-list').has('li[selected]').length) {
    var client = $('#sp-clients-list li[selected]:first').attr('client');

    if (client === 'html') {
      $('#sp-start-link').attr('target', '_blank');
      $('#sp-download-link').hide(0);
      $('#sp-java-row').hide(200);
    } else {
      $('#sp-java-row').show(200);
    }
  }
}

function refreshLink() {
  var links = getLinks();

  if (nolicense) {
    $('#sp-start-link').removeAttr('href');
    $('#sp-download-link').removeAttr('href');
  } else {
    $('#sp-start-link').attr('href', links.startLink);
    $('#sp-download-link').attr('href', links.downloadLink);
  }
}

function getLinks() {
  var client = null;
  var theme = null;
  var metal = null;
  var lang = [];

  if ($('#sp-clients-list').has('li[selected]').length) {
    client = $('#sp-clients-list li[selected]:first').attr('client');
  }

  if ($('#sp-themes-list').has('li[selected]').length) {
    theme = {
      id: $('#sp-themes-list li[selected]:first').attr('themeid'),
      name: $('#sp-themes-list li[selected]:first').html()
    }
  }

  if ($('#sp-lookfeel-list').has('li[selected]').length) {
    metal = $('#sp-lookfeel-list li[selected]:first').attr('metal');
  }

  if ($('#sp-lang-list-1').has('li[selected]').length) {
    lang.push({
      name: $('#sp-lang-list-1 li[selected]:first').html(),
      iso: $('#sp-lang-list-1 li[selected]:first').attr('iso')
    });
  }

  if ($('#sp-lang-list-2').has('li[selected]').length) {
    lang.push({
      name: $('#sp-lang-list-2 li[selected]:first').html(),
      iso: $('#sp-lang-list-2 li[selected]:first').attr('iso')
    });
  }

  if ($('#sp-lang-list-3').has('li[selected]').length) {
    lang.push({
      name: $('#sp-lang-list-3 li[selected]:first').html(),
      iso: $('#sp-lang-list-3 li[selected]:first').attr('iso')
    });
  }

  var linkInfo = {
    lang: lang,
    theme: theme,
    metal: metal,
    support: support
  }

  if (client == 'html') {
    return getHtmlLinks(linkInfo);
  } else if (client == 'java') {
    return getJavaLinks(linkInfo);
  } else {
    return getLauncherLinks(linkInfo);
  }
}

function getLauncherLinks(linkInfo) {
  var queryStringStart = [];
  var queryStringDownload = [];

  queryStringStart.push('title=' + encodeURI(title));
  queryStringStart.push('broker=' + encodeURI(baseUrl));

  if (linkInfo.lang != null && linkInfo.lang.length > 0) {
    var langArr = [];

    linkInfo.lang.forEach(function (l) {
      langArr.push(l.iso);
    });

    var lang = langArr.join(',');

    queryStringStart.push("language=" + lang);
    queryStringDownload.push("lang=" + lang);
  }

  if (linkInfo.theme) {
    var theme = encodeURI(linkInfo.theme.id);
    queryStringStart.push("theme=" + theme);
    queryStringDownload.push("themeid=" + theme);
  }

  if (linkInfo.metal) {
    queryStringStart.push("lookAndFeel=" + linkInfo.metal);
    queryStringDownload.push("metal=" + linkInfo.metal);
  }

  if (linkInfo.support) {
    queryStringStart.push("support=" + linkInfo.support);
    queryStringDownload.push("support=" + linkInfo.support);
  }

  queryStringStart.push("noDomainAuth=false");
  queryStringDownload.push("nodomainauth=false");

  queryStringDownload.push("dl=1");

  var launcherStartLink = 'fsclientlauncher:launch?' + queryStringStart.join('&');
  var launcherDownloadLink = baseUrl + 'api/fsclient?' + queryStringDownload.join('&');

  return {
    startLink: launcherStartLink,
    downloadLink: launcherDownloadLink
  };
}

function getJavaLinks(linkInfo) {
  var queryString = [];

  if (linkInfo.lang != null && linkInfo.lang.length > 0) {
    var langArr = [];

    linkInfo.lang.forEach(function (l) {
      langArr.push(l.iso);
    });

    queryString.push("lang=" + langArr.join(','));
  }

  if (linkInfo.theme) {
    queryString.push("themeid=" + encodeURI(linkInfo.theme.id) + "&themename=" + encodeURI(linkInfo.theme.name));
  }

  if (linkInfo.metal) {
    queryString.push("metal=" + linkInfo.metal);
  }

  if (linkInfo.support) {
    queryString.push("support=" + linkInfo.support);
  }

  queryString.push("nodomainauth=false");

  var javaLink = baseUrl + 'api/jnlp?' + queryString.join('&');

  return {
    startLink: javaLink,
    downloadLink: javaLink + '&dl=1'
  };
}

function getHtmlLinks(linkInfo) {
  var htmlLink = null;
  var queryString = [];

  if (linkInfo.lang != null && linkInfo.lang.length) {
    var langArr = [];

    linkInfo.lang.forEach(function (l) {
      langArr.push(l.iso);
    });

    queryString.push("lang=" + langArr.join(','));
  }

  if (linkInfo.support) {
    queryString.push("support=" + linkInfo.support);
  }

  if (queryString.length) {
    htmlLink = baseUrl + "html/#/load?" + queryString.join("&");
  } else {
    htmlLink = baseUrl + "html/#";
  }

  return {
    startLink: htmlLink,
    downloadLink: htmlLink
  }
}

function checkLicense() {
  if (nolicense) {
    $('#sp-no-license').removeClass('hidden');
    setButtonsEnabled(false);
  }
}

function setButtonsEnabled(enabled) {
  $('#sp-start-link').attr('disabled', enabled ? false : true);
  $('#sp-download-link').attr('disabled', enabled ? false : true);
}

function setContentVisible() {
  $('#sp-loading').addClass('hidden');
  $('#sp-content').removeClass('hidden');
}

function getUrlParameter(param) {
  if (window.location.search) {
    var vars = window.location.search.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
      var paramName = vars[i].split('=');
      if (paramName[0] == param) {
        return decodeURIComponent(paramName[1]);
      }
    }
  }
}

function startApplication() {
  createLink(function (link) {
    if (link) {
      window.location = link;
    }
  });
}
