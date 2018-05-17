'use strict';

var baseUrl;
var title;
var supportsHtml;
var nolicense;
var languages;
var themes;

$(document).ready(function () {
  $.ajaxSetup({
    cache: false
  });

  var currentUrl = window.location.href;

  baseUrl = 'http://localhost:8080/Dev/NV286_1_FS40_FS40_4.0_user1/FS40Application/';
  // baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('start'));

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

    if (!presetClient) {
      presetClient = 'java';
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

    setTitle();
    setClients(presetClient);
    setLanguages1(langPreset1, langPreset2, langPreset3);
    setThemes(presetTheme);
    setLookFeels();
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
  $('#sp-clients-list').append('<li client="java" ' + (presetClient === 'java' ? ' selected="selected"' : '') + '>Java</li>');
  $('#sp-clients-list').append('<li client="html" ' + (presetClient === 'html' ? ' selected="selected"' : '') + '>Html</li>');
  $('#sp-clients-list').on('click', 'li:not([selected])', clientSelectedChanged);
}

function clientSelectedChanged() {
  $('#sp-clients-list li').removeAttr('selected');
  $(this).attr('selected', true);
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
      $('#sp-lang-wrapper-3').append('<ul id="sp-lang-list-3" class="select-list"></ul>');

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
  $('#sp-lookfeel-list').append('<li metal="false" selected="selected">Default</li>');
  $('#sp-lookfeel-list').append('<li metal="true">Metal</li>');
  $('#sp-lookfeel-list').on('click', 'li:not([selected])', lookFeelSelectedChanged);
}

function lookFeelSelectedChanged() {
  $('#sp-lookfeel-list li').removeAttr('selected');
  $(this).attr('selected', true);
  refreshLink();
}

function setControlsEnabled() {
  $('#sp-start-link').removeAttr('target');

  if (!supportsHtml) {
    $('#sp-clients-row').addClass('hidden');
  } else {
    $('#sp-clients-row').removeClass('hidden');

    if ($('#sp-clients-list').has('li[selected]').length) {
      var client = $('#sp-clients-list li[selected]:first').attr('client');

      if (client === 'html') {
        $('#sp-java-row').hide(200);
        $('#sp-start-link').attr('target', '_blank');
      } else {
        $('#sp-java-row').show(200);
      }
    }
  }
}

function refreshLink() {
  createLink(
    function (link) {
      $('#sp-link').attr('value', link);
      $('#sp-start-link').attr('href', link);
    },
    function () {
      $('#sp-link').removeAttr('value');
      $('#sp-start-link').removeAttr('href');
    },
    function () {
      if (nolicense) {
        $('#sp-link').removeAttr('value');
        $('#sp-start-link').removeAttr('href');
      }
    }
  );
}

function createLink(success, error, complete) {
  var client = null;
  var theme = null;
  var metal = false;

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

  var startLinkJson = {
    supportsHtml: supportsHtml,
    client: client,
    languages: [],
    theme: theme,
    metal: metal
  };

  if ($('#sp-lang-list-1').has('li[selected]').length) {
    startLinkJson.languages.push({
      name: $('#sp-lang-list-1 li[selected]:first').html(),
      iso: $('#sp-lang-list-1 li[selected]:first').attr('iso')
    });
  }

  if ($('#sp-lang-list-2').has('li[selected]').length) {
    startLinkJson.languages.push({
      name: $('#sp-lang-list-2 li[selected]:first').html(),
      iso: $('#sp-lang-list-2 li[selected]:first').attr('iso')
    });
  }

  if ($('#sp-lang-list-3').has('li[selected]').length) {
    startLinkJson.languages.push({
      name: $('#sp-lang-list-3 li[selected]:first').html(),
      iso: $('#sp-lang-list-3 li[selected]:first').attr('iso')
    });
  }

  $.ajax({
    url: baseUrl + 'start/link',
    type: "POST",
    data: JSON.stringify(startLinkJson),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: success,
    error: error,
    complete: complete
  });
}

function checkLicense() {
  if (nolicense) {
    $('#sp-no-license').removeClass('hidden');
    setButtonEnabled(false);
  }
}

function setButtonEnabled(enabled) {
  $('#sp-start-link').attr('disabled', enabled ? false : true);
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
