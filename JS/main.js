class Server {
    constructor(title, cls, siteCount, ssd, supPhp) {
        if (supPhp) {
            supPhp = "Да";
        } else {
            supPhp = "Нет";
        }
        this.title = title;
        this.cls = cls;
        this.siteCount = siteCount;
        this.ssd = ssd;
        this.supPhp = supPhp;
    }
}
const clss = {
    fasters: "Скоростные",
    lowCost: "Дешевые",
    powerful: "Мощные"
}
const servers = [
    new Server("Дешевый", clss.lowCost, '15', "7", false),
    new Server("Дешманский", clss.lowCost, '1', '12', false),
    new Server("Быстрый", clss.fasters, "1", "7", true),
    new Server("Болид", clss.fasters, '8', "25", true),
    new Server("Мощь", clss.powerful, "15", "40", true),
    new Server("Бог", clss.powerful, "25", "100", true)
]

function printServers(arrServers, selector) {
    const startTemplate = '<table style="width:80%;"><tr style="background-color:#EFEFEF;"><td>Название</td><td>Кол-во обслуживаемых сайтов</td><td>Обьём SSD</td><td>Поддержка PHP</td></tr>';
    const lileTemplate = '<tr><td>{{title}}</td><td>{{count}}</td><td>{{ssd}}</td><td>{{supPhp}}</td></tr>';
    const endTemplate = '</table>';

    let output = startTemplate;
    for (let item of arrServers) {
        let tmpLine;
        tmpLine = lileTemplate.replace('{{title}}', item.title);
        tmpLine = tmpLine.replace('{{count}}', item.siteCount);
        tmpLine = tmpLine.replace('{{ssd}}', item.ssd);
        tmpLine = tmpLine.replace('{{supPhp}}', item.supPhp);
        output += tmpLine;
    };
    output += endTemplate;
    $(selector).html(output);
}

const Properties = {
    'cls': "Класс",
    'siteCount': "Кол-во сайтов",
    'ssd': "Вместимость SSD, ГБ",
    'supPhp': "Поддержка PHP"
}

function printFilters(arrServers, arProperties, selector) {
    const startTemplate = '<div id="filter"><br>{{name}}<br>';
    const lileTemplate = '<label><input type="checkbox" name="{{prop}}" value="{{name}}" checked>{{name}}</label><br>';
    const endTemplate = '</div>';

    let output = '';
    for (let prop in arProperties) {

        let tmpLine = startTemplate.replace('{{name}}', arProperties[prop]);
        let vals = [];
        for (let server of arrServers) {
            if (!vals.includes(server[prop])) {
                vals.push(server[prop]);
            }
        }
        vals.sort();
        vals.forEach(function(item, index, array) {
            tmpLine += lileTemplate.replace("{{prop}}", prop).replaceAll("{{name}}", item);
        });
        output += tmpLine;
        output += endTemplate;
    };
    $(selector).html(output);
}

function readCurFilters(selector, properties) {

    let result = [];
    for (let prop in properties) {
        result.push(prop);
        let searchIDs = $("#filters input[name='" + prop + "']:checkbox:checked").map(function() {
            return $(this).val();
        }).get();
        result[prop] = searchIDs;
    }
    return result;
}
// данные для фильтрации,
function applyFilters(data, filter, properties) {

    let result = [];
    for (let server of data) {
        let ok = true;
        for (let prop in properties) {
            //alert("Сервер " + server[prop] + " Фильтр " + filter[prop] + " найден " + filter[prop].indexOf(server[prop]));
            //alert(typeof(filter[prop][0]) + typeof(server[prop]))
            if (!filter[prop].length)
                continue;
            if (filter[prop].indexOf(server[prop]) == -1)
                ok = false;
        }
        if (ok) {
            result.push(server);
        };
    }
    return result;
}

$('document').ready(function() {

    //printServers(servers, "#servers");
    printServers(servers, "#servers");
    printFilters(servers, Properties, "#filters");
    $('#filter input').change(function() {
        let curFilter = readCurFilters('#filter input', Properties);
        //alert("Фильттры" + curFilter);
        let filtredServers = applyFilters(servers, curFilter, Properties);
        //alert(filtredServers);
        printServers(filtredServers, '#servers');
    });

})