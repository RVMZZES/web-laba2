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
    const lileTemplate = '<label><input type="checkbox" name="{{prop}}" value="{{name}}">{{name}}</label><br>';
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

function readNotCurFilters(selector, properties) {
    let result = [];
    for (let prop in properties) {
        result.push(prop);
        let searchIDs = $("#filter input[name='" + prop + "']").filter(function() {
            return ($(this).prop('checked') == false)
        }).map(function() {
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

// принимает данные и текущий фильтр
function getNewFilters(selector, data, curFilter, properties) {
    // вычисляет кол-во записей с текущим фильтром
    let filtredServers = applyFilters(data, curFilter, Properties);

    // проверим все невыбранные фильтры, если они что-то добавляют оставляем эту галочку
    let notCurFilters = readNotCurFilters(selector, properties);
    console.log(notCurFilters);

    for (let prop of notCurFilters) {
        for (filter of notCurFilters[prop]) {
            curFilter[prop].push(filter);
            let tempArr = applyFilters(data, curFilter, properties);
            // если фильтр ничего не добавляет, отключаем его
            if (tempArr.length <= filtredServers.length && tempArr.filter(elem => filtredServers.indexOf(elem) == -1).length == 0) {
                let f = $("#filter input[name='" + prop + "'][value='" + filter + "']");
                f.prop('disabled', true);
            }
            // удалим то, что добавили
            curFilter[prop].pop();
        }
    }

    for (let server of filtredServers) {
        for (let prop in properties) {
            console.log(prop, server);
            // ищем нужный фильтр и включаем его
            let filter = $(selector + "[name='" + prop + "'][value='" + server[prop] + "']")
            filter.prop('disabled', false);
        }
    }
    //$("#filter input:checkbox:checked").prop('disabled', false);
    //$("#filter input[name=" + curFilterGroup + "]").prop('disabled', false);
    return filtredServers;
}

$('document').ready(function() {

    //printServers(servers, "#servers");
    printServers(servers, "#servers");
    printFilters(servers, Properties, "#filters");
    $('#filter input').change(function() {
        console.log($(this).val(), $(this).prop('name'), $(this).prop('checked'));
        // фильтр добавился, значит нужно убрать те, которые теперь ничего не добавляют
        if ($(this).prop('checked') == true) {
            console.log("ПЕРЕМЕН!");
        } else { // фильтр ушел

        }
        $("#filter input").prop("disabled", false);
        let curFilter = readCurFilters('#filter input', Properties);
        //alert("Фильттры" + curFilter);
        //alert(filtredServers);
        let filtredServers = getNewFilters('#filter input', servers, curFilter, Properties)
            //console.log($(this).val(), $(this).prop('name'))

        printServers(filtredServers, '#servers');

    });

})