var customerjs = angular.module('customerjs', [
    'datatables',
    'datatables.columnfilter',
    'datatables.colreorder'
]);

customerjs.controller('customerCtrl', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder',
    function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
       
    $scope.customers = "";
        $scope.dtColumns = [
            DTColumnBuilder.newColumn("Gender", "Gender").withTitle('Gender'),
            DTColumnBuilder.newColumn("Title", "Title").withTitle('Title'),
            DTColumnBuilder.newColumn("Occupation", "Occupation").withTitle('Occupation'),
            DTColumnBuilder.newColumn("Company", "Company").withTitle('Company'),
            DTColumnBuilder.newColumn("GivenName", "Given Name").withTitle('Given Name'),
            DTColumnBuilder.newColumn("MiddleInitial", "Middle Initial").withTitle('Middle Initial'),
            DTColumnBuilder.newColumn("Surname", "Surname").withTitle('Surname'),
            DTColumnBuilder.newColumn("BloodType", "Blood Type").withTitle('Blood Type'),
            DTColumnBuilder.newColumn("EmailAddress", "EmailAddress").withTitle('Email Address')
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            url: "/Customer/getData",
            type: "POST"
        })
            .withPaginationType('full_numbers')
            .withDisplayLength('999999999999')
            .withColumnFilter()
            .withColReorder();
            
    $http({
        method: 'GET',
        url: '/Customer/GetCustomer'
    }).then(function (response) {
       
        $scope.customers = response.data;
    }, function (error) {
    console.log(error);
            });

    $scope.save = function (customer) {
        $http({
            url: '/Customer/SaveCustomer',
            method: "POST",
            datatype: "json",
            data: JSON.stringify(customer)
        }).then(function (response) {
            location.reload();
        }, function (error) {
            console.log(error);
        }); 
    };

    $scope.print = function () {
        var divToPrint = document.getElementById("entry-grid");
        newWin = window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close(); 
    };


    $scope.SelectedFileForUpload = null;

    $scope.importFile = function (file) {
        $scope.$apply(function () {
            $scope.Message = "";
            $scope.SelectedFileForUpload = file[0];
        })
    };
         
    $scope.ParseExcelDataAndSave = function () {
        var file = $scope.SelectedFileForUpload;

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //var data = e.target.result;
                //var workbook = XLSX.read(data, { type: 'binary' });
                //var sheetName = workbook.SheetNames[0];
                //var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var excelData = $scope.csvToJSON(e.target.result);

                if (excelData.length > 0) {
                    $scope.saveData(excelData);
                } else {
                    $scope.Message = "No data found";
                }
            }
            reader.onerror = function (ex) {
                console.log(ex);
            }
            reader.readAsBinaryString(file);
        }
    };

    $scope.csvToJSON = function (csv) {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            if (lines[i] != "") {
                var obj = {};
                var currentline = lines[i].split(",");

                result.push({
                    Gender: currentline[0],
                    Title: currentline[1],
                    Occupation: currentline[2],
                    Company: currentline[3],
                    GivenName: currentline[4],
                    MiddleInitial: currentline[5],
                    Surname: currentline[6],
                    BloodType: currentline[7],
                    EmailAddress: currentline[8],
                });
            }
        }
        return result; 
    };
        
    $scope.saveData = function (excelData) {
        var dataStorage = [];

        for (var x = 0, y = 0; x < excelData.length; x += 100, y++) {
            dataStorage.push(excelData.slice(x, x + 100));
        };

        angular.forEach(dataStorage, function (val) {
            $http({
                method: "POST",
                url: "/Customer/SaveExcelData",
                data: JSON.stringify(val),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(function (res) {
                $scope.Message = "record(s) inserted";
                location.reload();
                }, function (error) {
                    $scope.Message = "Error";
                })
        })
    };

    $scope.exportData = function (customers) {
        var x = [];
        for (var a = 0; a < customers.length; a++) {
            x.push({
                Gender: customers[a].Gender,
                Title: customers[a].Title,
                Occupation: customers[a].Occupation,
                Company: customers[a].Company,
                GivenName: customers[a].GivenName,
                MiddleInitial: customers[a].MiddleInitial,
                Surname: customers[a].Surname,
                BloodType: customers[a].BloodType,
                EmailAddress: customers[a].EmailAddress,
            })
        } 

        $scope.saveFile = function (filename) {
            if (filename != undefined) {
                JSONToCSVConverter(x, filename, true);
            } else {
                alert("filename is required");
            }
        };

    };

    function JSONToCSVConverter(JSONData, ReportTitle, ShowLabel) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            for (var index in arrData[i]) {
                row += arrData[i][index] + ',';
            }
            
            row = row.substring(0, row.length - 1);

            CSV += row;
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //var fileName = "MyFileName_";

        //var fileName = ReportTitle.replace(/ /g,"_");
        var fileName = ReportTitle;

        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;

        link.style = 'visibility:hidden';
        link.download = fileName + ".csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}]);
