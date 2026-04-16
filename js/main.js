document.addEventListener('DOMContentLoaded', function () {
  var headlineElement = document.querySelector('.article-headline');

  if (!headlineElement || typeof data === 'undefined') {
    return;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var rendered = '<dl>' + data.map(function (talk) {
    var title = escapeHtml(talk.title || '');
    var name = escapeHtml(talk.name || '');
    var affiliation = escapeHtml(talk.affiliation || '');
    var major = escapeHtml(talk.major || '');
    var chairperson = escapeHtml(talk.chairperson || '');
    var abstractText = escapeHtml(talk.abstract || '');
    var infoText = escapeHtml(talk.info || '');

    var majorText = major ? '<span class=major>（' + affiliation + '｜専門：' + major + '）</span>' : '';
    var chairpersonText = chairperson ? '<span class=major>（進行：' + chairperson + '）</span>' : '';

    return ''
      + '<a name="' + title + '" class=anchor></a>'
      + '<dt class=talk-header><span class=title>' + title + '</span>'
      + '<br />'
      + '<span class=name>' + name + '</span>'
      + majorText
      + chairpersonText
      + '</dt>'
      + '<dd class=talk-abs>' + abstractText + '<br>' + infoText + '</dd>';
  }).join('') + '</dl>';

  headlineElement.innerHTML = rendered;
});
