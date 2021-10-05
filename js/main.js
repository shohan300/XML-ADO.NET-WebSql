/// Create Database -----------------------------------------------------------
var DatabaseName = 'EmployeeDB';  
var imageName= "";
var Version = 1.0;  
var TextDescription = 'My First Web-SQL Example';  
var DatabaseSize = 5 * 1024 * 1024;

var dbObj = openDatabase(DatabaseName, Version, TextDescription, DatabaseSize);


dbObj.transaction(function (tx) {
			
    tx.executeSql('CREATE TABLE IF NOT EXISTS EmployeeTable (id unique, name, email, departId, image)');  

    tx.executeSql('CREATE TABLE IF NOT EXISTS DepartmentTable (departId unique, departName)');  

    tx.executeSql('insert into DepartmentTable(departId, departName) values(1,"IT")');  
    tx.executeSql('insert into DepartmentTable(departId, departName) values(2,"Accountant")');  
    tx.executeSql('insert into DepartmentTable(departId, departName) values(3,"Claerk")');  
    tx.executeSql('insert into DepartmentTable(departId, departName) values(4,"Management")');  
    
    alldetails(); 
});


/// Pageload and Show Data in Table -----------------------------------------------------------
function alldetails(){

    dbObj.transaction(function (tx) {  

        tx.executeSql('SELECT e.id, e.name, e.email, e.image, d.departName, d.departId FROM EmployeeTable e left join DepartmentTable d on e.departId = d.departId ', [], function (tx, results) 
        {  
            //$('#blah').attr('src', results.rows.item(0).image);

            var len = results.rows.length, i;  
                $("#tblGrid").find("tr:gt(0)").remove();  

                var str = '';  
                
                for (i = 0; i < len; i++) {  
                    str += "<tr>";  
                    str += "<td>" + results.rows.item(i).id + "</td>";  
                    str += "<td>" + results.rows.item(i).name + "</td>";  
                    str += "<td>" + results.rows.item(i).email + "</td>";  
                    str += "<td>" + results.rows.item(i).departName + "</td>";  
                    str += "<td><img src=" + results.rows.item(i).image + " width='64' height='64'></td>";  
                    str += "</tr>";

                    document.getElementById("tblGrid").innerHTML += str;  
                    str = '';  
                }  
        }, null);  
    });  
}



/// Insert Data Function  --------------------------------------------------------------------

function Insert() {  
            
    var id = document.getElementById("tbID").value;  
    var name = document.getElementById("tbName").value;  
    var email = document.getElementById("tbLocation").value;  
    var departId = document.getElementById("tbLdept").value; 			
    
    dbObj.transaction(function (tx) {  
        tx.executeSql('insert into EmployeeTable(id, name, email, departId, image) values(' + id + ',"' + name + '","' + email + '",' + departId + ', "' + imageName + '")');  

    });  

    alldetails();
    allblank();
}

/// Show Employee Id in  Select dropdownBox  --------------------------------------------------------

function empidbind()  
{  
    dbObj.transaction(function (tx) {  
        tx.executeSql('SELECT * from EmployeeTable', [], function (tx, results) {  
            var len = results.rows.length, i;  
            document.getElementById("ddlid").innerHTML = '';  
            var str = '';  
            for (i = 0; i < len; i++) {  

                str += "<option value=" + results.rows.item(i).id + ">" + results.rows.item(i).id + "</option>"; 

                document.getElementById("ddlid").innerHTML += str;  
                str = '';  
            }  
        }, null);  
    });   

}


function myFunction()  
{  
    var id = document.getElementById("ddlid").value;  

    dbObj.transaction(function (tx) {  
        tx.executeSql('SELECT * from EmployeeTable where id=' + id + '', [], function (tx, results)  
        {  
        console.log(results.rows);
        
            document.getElementById("tbName").value = results.rows.item(0).name;  
            document.getElementById("tbLocation").value = results.rows.item(0).email;  
            document.getElementById("tbLdept").value = results.rows.item(0).departId;  
            $('#blah').attr('src', results.rows.item(0).image);					
        }, null);  
    }); 
     
} 


///---------- Showing Department data in dropdown Box --------------------------
dbObj.transaction(function (tx) {  
    tx.executeSql('SELECT * from DepartmentTable', [], function (tx, results) {  
        var len = results.rows.length, i;  
        var str = '';  
        for (i = 0; i < len; i++) {  
            str += "<option value=" + results.rows.item(i).departId + ">" + results.rows.item(i).departName + "</option>";  
            document.getElementById("tbLdept").innerHTML += str;  
            str = '';  
        }  
    }, null);  
}); 


/// Delete Data Function  --------------------------------------------------------------------
function del() {  
    var id = document.getElementById("ddlid").value;  
    dbObj.transaction(function (tx) {  
        tx.executeSql('delete from EmployeeTable where id=' + id + '');  
    });  
    empidbind();  
    alldetails();  
}

/// Update Data Function  --------------------------------------------------------------------
function updte() {  
            
    var id = document.getElementById("ddlid").value;  
    var name = document.getElementById("tbName").value;  
    var email = document.getElementById("tbLocation").value;   

    dbObj.transaction(function (tx) {  
        tx.executeSql('update EmployeeTable set Name="' + name + '",email="' + email + '", image="' + imageName + '" where id=' + id);  
    });  
    empidbind(); 
    alldetails(); 

}  


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(input.files[0].name);
            imageName=e.target.result;
            $('#blah').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function allblank(){
    document.getElementById("tbID").value = "";
    document.getElementById("tbName").value = "";
    document.getElementById("tbLocation").value = "";
    document.getElementById("blah").src="images/placeholder.png";
    document.getElementById("image").value = "";
}


