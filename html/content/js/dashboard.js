/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8857142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "products and platforms Request"], "isController": false}, {"data": [1.0, 500, 1500, "overview Request-0"], "isController": false}, {"data": [0.5, 500, 1500, "overview Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "services Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "services Request-0"], "isController": false}, {"data": [1.0, 500, 1500, " prespective Request-2"], "isController": false}, {"data": [1.0, 500, 1500, "industry Request-0"], "isController": false}, {"data": [1.0, 500, 1500, " prespective Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "industry Request-1"], "isController": false}, {"data": [1.0, 500, 1500, " prespective Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "customer stories Request"], "isController": false}, {"data": [1.0, 500, 1500, "aboutus Request"], "isController": false}, {"data": [1.0, 500, 1500, " news Request-0"], "isController": false}, {"data": [1.0, 500, 1500, " finance Request"], "isController": false}, {"data": [0.5, 500, 1500, " news Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "services Request"], "isController": false}, {"data": [1.0, 500, 1500, "products and platforms Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "aboutus Request-0"], "isController": false}, {"data": [0.0, 500, 1500, "Main Request"], "isController": false}, {"data": [1.0, 500, 1500, "products and platforms Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "aboutus Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "industry Request"], "isController": false}, {"data": [0.5, 500, 1500, "overview Request"], "isController": false}, {"data": [1.0, 500, 1500, " finance Request-0"], "isController": false}, {"data": [1.0, 500, 1500, " finance Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Research Request"], "isController": false}, {"data": [0.0, 500, 1500, "Main Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "customer stories Request-2"], "isController": false}, {"data": [1.0, 500, 1500, "customer stories Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "customer stories Request-0"], "isController": false}, {"data": [1.0, 500, 1500, " prespective Request"], "isController": false}, {"data": [1.0, 500, 1500, "Main Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Research Request-0"], "isController": false}, {"data": [0.5, 500, 1500, " news Request"], "isController": false}, {"data": [1.0, 500, 1500, "Research Request-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35, 0, 0.0, 316.02857142857147, 25, 1815, 229.0, 925.4, 1637.399999999999, 1815.0, 6.300630063006301, 1494.1951226372637, 1.0396742799279928], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["products and platforms Request", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1300.3866792929293, 0.7957175925925927], "isController": false}, {"data": ["overview Request-0", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 15.40798611111111, 4.304108796296297], "isController": false}, {"data": ["overview Request-1", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 744.2350701160541, 0.23233498549323017], "isController": false}, {"data": ["services Request-1", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1710.0868055555554, 0.5338541666666666], "isController": false}, {"data": ["services Request-0", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 16.000600961538463, 4.4696514423076925], "isController": false}, {"data": [" prespective Request-2", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1565.293224617904, 0.5714383187772926], "isController": false}, {"data": ["industry Request-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 14.857700892857142, 4.150390625], "isController": false}, {"data": [" prespective Request-1", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 6.505408653846153, 1.8780048076923077], "isController": false}, {"data": ["industry Request-1", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1514.8406742125985, 0.472902312992126], "isController": false}, {"data": [" prespective Request-0", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.71875, 4.7265625], "isController": false}, {"data": ["customer stories Request", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1700.4048944063927, 1.6365225456621004], "isController": false}, {"data": ["aboutus Request", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1594.7514960106384, 1.005651595744681], "isController": false}, {"data": [" news Request-0", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.9921875, 5.0], "isController": false}, {"data": [" finance Request", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 1094.451658847185, 0.6754775469168901], "isController": false}, {"data": [" news Request-1", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 391.7435109289617, 0.1408811475409836], "isController": false}, {"data": ["services Request", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1534.6037724103585, 0.9415463147410359], "isController": false}, {"data": ["products and platforms Request-0", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.640625, 4.6484375], "isController": false}, {"data": ["aboutus Request-0", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 16.000600961538463, 4.4696514423076925], "isController": false}, {"data": ["Main Request", 1, 0, 0.0, 1815.0, 1815, 1815, 1815.0, 1815.0, 1815.0, 1815.0, 0.5509641873278236, 204.94307420798899, 0.11944731404958678], "isController": false}, {"data": ["products and platforms Request-1", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1423.6119119003688, 0.4432368542435424], "isController": false}, {"data": ["aboutus Request-1", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1791.15112888756, 0.5747233851674641], "isController": false}, {"data": ["industry Request", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1365.9061945921987, 0.8380429964539008], "isController": false}, {"data": ["overview Request", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 706.7624713302752, 0.4336295871559633], "isController": false}, {"data": [" finance Request-0", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 16.30108173076923, 4.770132211538462], "isController": false}, {"data": [" finance Request-1", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 1175.2352755763688, 0.36867345100864557], "isController": false}, {"data": ["Research Request", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1417.3240661621094, 0.9918212890625], "isController": false}, {"data": ["Main Request-0", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 0.25502197112366604, 0.06682066070307596], "isController": false}, {"data": ["customer stories Request-2", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 2880.352168120155, 0.8554384689922481], "isController": false}, {"data": ["customer stories Request-1", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 6.370907738095238, 1.9996279761904763], "isController": false}, {"data": ["customer stories Request-0", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 15.625, 4.521122685185185], "isController": false}, {"data": [" prespective Request", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 1122.79052734375, 1.15966796875], "isController": false}, {"data": ["Main Request-1", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1696.6457976598174, 0.5038884132420092], "isController": false}, {"data": ["Research Request-0", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.9921875, 5.0], "isController": false}, {"data": [" news Request", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 381.37100657545164, 0.26982598299681193], "isController": false}, {"data": ["Research Request-1", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1568.8751352813852, 0.5580357142857143], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
