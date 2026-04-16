function construstTimeTable(timeTable, talksData) {
    return Object.keys(timeTable)
        .filter(function (k) { return timeTable[k]; })
        .sort()
        .map(function (time) {
            console.log(time);
            var name = timeTable[time];
            console.log(name);

            var index = 0;
            var talk = talksData.filter(function (t) { return t.name.indexOf(name) == 0; })[index];
            console.log(talk)
            // 何部目か判定
            if (
                (name == "第1部") ||
                (name == "第2部") ||
                (name == "第3部") ||
                (name == "第4部")
            ) {
                return { time: name, name: "", title: "", major: "" };
            }

            // 改行
            else if (name == "改行") {
                return { time: "\xa0", name: "\xa0", title: "", major: "" };
            }

            // 休憩・座談会
            else if (name.indexOf("休憩・座談会") == 0) {
                return { time: time, name: "", title: name, major: "" };
            }

            // 平野さんWS
            else if (name == "平野WS") {
                return {
                    time: time,
                    name: "ワークショップ：平野力也",
                    title: "ワークショップ：骨の鑑定入門：これってヒト？イヌ？シカ？",
                    major: "理学系研究科"
                };
            }

            // 平城さんWS
            else if (name == "平城WS") {
                return {
                    time: time,
                    name: "ワークショップ：平城裕隆",
                    title: "ワークショップ：騒がしくても話せる音声入力インタフェース",
                    major: "学際情報学府学際情報学専攻"
                };
            }
            
            else {
                if (!talk) {
                  console.warn("一致しない講演者名: " + name);
                  return {
                    time: time,
                    name: name,  // fallback 表示
                    title: "(未登録)",
                    major: ""
                  };
                }
              
                return {
                  time: time,
                  name: talk.name,
                  title: talk.title,
                  major: talk.affiliation
                };
              }
            
            // 通常講演者
            /*else {
                return {
                    time: time,
                    name: talk.name,
                    title: talk.title,
                    major: talk.affiliation
                };
            }    */
        });

}

document.addEventListener('DOMContentLoaded', function () {
    var DayTable1 = construstTimeTable(day1, data);
    var DayTable2 = construstTimeTable(day2, data);

    var headlineElement = document.querySelector('.article-headline');
    if (!headlineElement) {
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

    function renderTable(header, tableData) {
        var rows = tableData.map(function (row) {
            return ''
                + '<tr>'
                + '<td class=time valign="top">' + escapeHtml(row.time || '') + '</td>'
                + '<td class=title valign="top">' + (row.title || '') + '</td>'
                + '<td class=name valign="top">' + escapeHtml(row.name || '') + '</td>'
                + '</tr>';
        }).join('');

        return ''
            + '<h3>' + escapeHtml(header) + '</h3>'
            + '<table class=time-table>'
            + rows
            + '</table>';
    }

    var rendered1 = renderTable("5/24 (土)", DayTable1);
    var rendered2 = renderTable("5/25 (日)", DayTable2);

    headlineElement.innerHTML = rendered1 + "<br />" + rendered2;
});
