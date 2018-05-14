var baseUrl;
var title;
var nolicense;
var languages;
var themes;

$(document).ready(function() {
    // Default jQuery Ajax Settings
    $.ajaxSetup({
        cache: false
    });

    // Global Ajax Event Handlers
    $(document).ajaxError(fnOnAjaxErrorGlobal);

    var currentUrl = window.location.href;

    baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('start'));

    fnInitialize();
});

function fnEqualizePanelHeights() {
    $('.equalheight').equalize({
        children: '.panel-default',
        reset: false
    });
}

function fnOnAjaxErrorGlobal(event, xhr, settings, error) {
    var title;
    var message;
    var stacktrace;

    if (xhr.status === 0) {
        title = 'Ajax Request Error';
        message = 'Could not connect to server!';
        stacktrace = 'N/A';
    } else {
        var ex = JSON.parse(xhr.responseText);

        message = ex.exceptionMessage;
        stacktrace = ex.stackTrace;
    }

    $('#error-modal #error-title').html(error);
    $('#error-modal #error-message').html(message);
    $('#error-modal #error-stacktrace').html(stacktrace);

    $('#error-modal').modal({
        backdrop: 'static'
    });
}

function fnInitialize() {
    $.getJSON(baseUrl + 'start/data', function(data) {
        title = data.title;
        languages = data.languages;
        themes = data.themes;
        nolicense = data.noLicense;

        presetLanguages = fnGetUrlParameter('lang');
        presetTheme = fnGetUrlParameter('themeid');

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

        fnSetTitle();
        fsSetLanguages1(langPreset1, langPreset2, langPreset3);
        fsSetThemes(presetTheme);
        fsSetLookFeels();
        fnRefreshLink();
        fnCheckLicense();
        fnSetContentVisible();
        fnEqualizePanelHeights();

        $('#start-button').on('click', fnStartApplication);
        $('#download-button').on('click', fnDownloadJnlp);
    });
}

function fnSetTitle() {
    var titleStr = title + ' - Client Start';
    document.title = titleStr;
    $('#application-name').html(titleStr);
}

function fsSetLanguages1(langPreset1, langPreset2, langPreset3) {
    $('#lang-wrapper-1').empty();

    if (languages && languages.length) {
        $('#lang-wrapper-1').append('<ul id="lang-list-1" class="select-list"></ul>');

        languages.forEach(function(language) {
            $('#lang-list-1').append('<li iso="' + language.iso + '"' + (language.iso === langPreset1 ? ' selected' : '') + '>' + language.name + '</li>');
            $('#lang-list-1').off('click').on('click', 'li:not([selected])', fnLanguage1SelectedChanged);
        });
    } else {
        $('#lang-wrapper-1').append('N/A');
    }

    fnSetLanguages2(langPreset2, langPreset3);
}

function fnSetLanguages2(langPreset2, langPreset3) {
    $('#lang-wrapper-2').empty();

    if (languages && languages.length) {
        if ($('#lang-list-1').has('li[selected]').length) {
            $('#lang-wrapper-2').append('<ul id="lang-list-2" class="select-list"></ul>');

            languages.forEach(function(language) {
                if ($('#lang-list-1 li[selected]').attr('iso') !== language.iso) {
                    $('#lang-list-2').append('<li iso="' + language.iso + '"' + (language.iso === langPreset2 ? ' selected' : '') + '>' + language.name + '</li>');
                    $('#lang-list-2').off('click').on('click', 'li:not([selected])', fnLanguage2SelectedChanged);
                }
            });
        }
    } else {
        $('#lang-wrapper-2').append('N/A');
    }

    fnSetLanguages3(langPreset3);
}

function fnSetLanguages3(langPreset3) {
    $('#lang-wrapper-3').empty();

    if (languages && languages.length) {
        if ($('#lang-list-1').has('li[selected]').length && $('#lang-list-2').has('li[selected]').length) {
            $('#lang-wrapper-3').append('<ul id="lang-list-3" class="select-list"></ul>');

            languages.forEach(function(language) {
                if ($('#lang-list-1 li[selected]').attr('iso') !== language.iso && $('#lang-list-2 li[selected]').attr('iso') !== language.iso) {
                    $('#lang-list-3').append('<li iso="' + language.iso + '"' + (language.iso === langPreset3 ? ' selected' : '') + '>' + language.name + '</li>');
                    $('#lang-list-3').off('click').on('click', 'li:not([selected])', fnLanguage3SelectedChanged);
                }
            });
        }
    } else {
        $('#lang-wrapper-3').append('N/A');
    }
}

function fnLanguage1SelectedChanged() {
    $('#lang-list-1 li').removeAttr('selected');
    $(this).attr('selected', true);
    fnSetLanguages2();
    fnRefreshLink();
}

function fnLanguage2SelectedChanged() {
    $('#lang-list-2 li').removeAttr('selected');
    $(this).attr('selected', true);
    fnSetLanguages3();
    fnRefreshLink()
}

function fnLanguage3SelectedChanged() {
    $('#lang-list-3 li').removeAttr('selected');
    $(this).attr('selected', true);
    fnRefreshLink()
}

function fsSetThemes(themePreset) {
    $('#themes-wrapper').empty();

    if (themes && themes.length) {
        $('#themes-wrapper').append('<ul id="themes-list" class="select-list"></ul>');

        themes.forEach(function(theme) {
            $('#themes-list').append('<li themeid="' + theme.id + '"' + (theme.id === themePreset ? ' selected="selected"' : '') + '>' + theme.name + '</li>');
            $('#themes-list').on('click', 'li:not([selected])', fnThemeSelectedChanged);
        });
    } else {
        $('#themes-wrapper').append('N/A');
    }
}

function fnThemeSelectedChanged() {
    $('#themes-list li').removeAttr('selected');
    $(this).attr('selected', true);
    fnRefreshLink();
}

function fsSetLookFeels() {
    $('#lookfeel-wrapper').empty();
    $('#lookfeel-wrapper').append('<ul id="lookfeel-list" class="select-list"></ul>');
    $('#lookfeel-list').append('<li metal="false" selected="selected">Default</li>');
    $('#lookfeel-list').append('<li metal="true">Metal</li>');
    $('#lookfeel-list').on('click', 'li:not([selected])', fnLookFeelSelectedChanged);
}

function fnLookFeelSelectedChanged() {
    $('#lookfeel-list li').removeAttr('selected');
    $(this).attr('selected', true);
    fnRefreshLink();
}

function fnRefreshLink() {
    fnCreateLink(false,
        function(link) {
            $('#link').attr('value', link);
        },
        function() {
            $('#link').removeAttr('value');
        },
        function() {
            if (nolicense) {
                $('#link').removeAttr('value');
            }
        });
}

function fnCreateLink(download, success, error, complete) {
    var theme = null;
    var metal = false;

    if ($('#themes-list').has('li[selected]').length) {
        theme = {
            id: $('#themes-list li[selected]:first').attr('themeid'),
            name: $('#themes-list li[selected]:first').html()
        }
    }

    if ($('#lookfeel-list').has('li[selected]').length) {
        metal = $('#lookfeel-list li[selected]:first').attr('metal');
    }

    var startLinkJson = {
        languages: [],
        theme: theme,
        metal: metal,
        download: download ? true : false
    };

    if ($('#lang-list-1').has('li[selected]').length) {
        startLinkJson.languages.push({
            name: $('#lang-list-1 li[selected]:first').html(),
            iso: $('#lang-list-1 li[selected]:first').attr('iso')
        });
    }

    if ($('#lang-list-2').has('li[selected]').length) {
        startLinkJson.languages.push({
            name: $('#lang-list-2 li[selected]:first').html(),
            iso: $('#lang-list-2 li[selected]:first').attr('iso')
        });
    }

    if ($('#lang-list-3').has('li[selected]').length) {
        startLinkJson.languages.push({
            name: $('#lang-list-3 li[selected]:first').html(),
            iso: $('#lang-list-3 li[selected]:first').attr('iso')
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

function fnCheckLicense() {
    if (nolicense) {
        $('#nolicense').removeClass('hidden');
        fnSetButtonsEnabled(false);
    }
}

function fnSetButtonsEnabled(enabled) {
    $('#start-button').attr('disabled', enabled ? false : true);
    $('#download-button').attr('disabled', enabled ? false : true);
}

function fnSetContentVisible() {
    $('#loading').addClass('hidden');
    $('#content').removeClass('hidden');
}

function fnGetUrlParameter(param) {
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

function fnStartApplication() {
    fnCreateLink(false, function(link) {
        if (link) {
            window.location = link;
        }
    });
}

function fnDownloadJnlp() {
    fnCreateLink(true, function(link) {
        if (link) {
            window.location = link;
        }
    });
}
