class BaseJS {
    constructor() {
        this.setDataUrl();
        this.loadData();
        this.initEvents();
    }
    setDataUrl() {
        this.url = null;
    }

    initEvents() {
        var me = this;
        //mở form thêm khách hàng khi ấn thêm khách hàng
        $('.btnAdd').click(me.openDialog);

        //load lại dữ liệu khi ấn nút reload
        $('#btnReload').click(function () {
            $('table').remove('tr');
            me.loadData();
        })

        //đóng form detail khi ấn dấu X
        $('#btnCloseFormDetail').click(function () {
            $('.dialog-detail').hide();
        })

       //đóng form detail khi ấn hủy
        $('#btnCancel').click(function () {
            $('.dialog-detail').hide();
        })

        //lưu dữ liệu khi ấn nút save
        $('#btnSave').click(function () {
            //validate dữ liệu nhập vào
            var inputValidates =$('input[required], input[type="email"]');
            $.each(inputValidates, function (index, input) {
                var value = $(input).val();
                
                $(input).trigger('blur');

            })
            var inputNotValids = $('input[validate="false"]');
            if(inputNotValids &&inputNotValids.length>0)
            {
                alert("Dữ liệu không hợp lệ vui lòng kiểm tra lại");
                inputNotValids[0].focus();
                return;
            }

            //thu thập dữ liệu và build thành object
            var genderName="";
            if ($("#Nam").prop("checked")) {
                genderName = "Nam";
            }
            if ($("#Nu").prop("checked")) {
                genderName = "Nữ";
            }
            var customer = {
                "CustomerCode": $('#txtCustomerCode').val(),
                "FullName": $('#txtFullName').val(),
                "Address": $('#txtAddress').val(),
                "DateOfBirth": $('#txtDateOfBirth').val(),
                "GenderName":genderName,
                "Email": $('#txtEmail').val(),
                "PhoneNumber": $('#txtPhoneNumber').val(),
                "CustomerGroupId": $('#cbxCustomerGroup').val(),
                "MemberCardCode": $('#txtMemberCardCode').val(),
                "CompanyName": $('#txtCompanyName').val(),
                "CompanyTaxCode": $('#txtCompanyTaxCode').val(),
            }
            $.ajax({

                url: 'http://api.manhnv.net/api/customers',
                method: 'POST',
                data: JSON.stringify(customer),
                contentType: 'application/json'

            }).done(function (res) {
                alert("Lưu thành công");
                me.loadData();
            }).fail(function () {
                alert("Fail")
            })
        })

        //hiển thị thông tin chi tiết khi double click vào 1 bản ghi
        $('table tbody').on('dblclick', 'tr', function () {
            //lấy khóa chính
            var recordId = $(this).attr('recordId');
            $.ajax({
                url: "http://api.manhnv.net/api/customers" + "/" + recordId,
                method: "GET"
            }).done(function (res) {
                console.log(res);
            })
            
            $('.dialog-detail').show();
        })
        

        /*
            validate dữ liệu nhâp, nếu để trống thì cảnh báo
            createdBy: dmgiang 31/12/2020
        */
        $('input[required]').blur(function () {
            var value = $(this).val();
            if (!value) {
                $(this).addClass('border-red');
                $(this).attr("title", "Trường này không được để trống");
                $(this).attr("validate", false);
            }
            else {
                $(this).removeClass('border-red');
                $(this).attr("validate", true);

            }
            
        })

        /*
            validate email đúng định dạng
            createdBy: dmgiang 31/12/2020
        */
        $('input[type="email"]').blur(function () {
            var value = $(this).val();
            var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            if (!testEmail.test(value)) {
                $(this).addClass('border-red');
                $(this).attr("title", "Không đúng định dạng email!");
                $(this).attr("validate", false);

            }
            else {
                $(this).removeClass("border-red");
                $(this).attr("validate", true);

            }
           
                
        })
        
        
    }
    //load dữ liệu
    loadData() {
        var ths = $('table thead th');

        $.ajax({
            url: this.url,
            method: "GET",
        }).done(function (res) {
            $.each(res, function (index, obj) {
                var tr = $(`<tr recordId=${obj.CustomerId}></tr>`);
                var td;
                $.each(ths, function (index, th) {
                    var fieldName = $(th).attr('fieldName');
                    if (fieldName == "Address")
                        td = $(`<td id="address" title= "` + obj[fieldName] + `"></td>`);
                    else td=$(`<td></td>`)
                    var value = obj[fieldName];
                    if (fieldName == "DateOfBirth")
                        value = formatDateOfBirth(value);
                    if (fieldName == "GenderName")
                        value = formatGenderName(value);
                    if (fieldName == "Salary"||fieldName=="DebitAmount") {
                        td.addClass("text-align-right");
                        value = formatMoney(value);
                    }
                    td.append(value);
                    $(tr).append(td);
                })
                $('table tbody').append(tr);
            })

        }).fail(function (res) {


        })
    }

    openDialog() {
        $('.dialog-detail').show();
        $('#txtCustomerCode').focus();

        //load dữ liệu vào combobox
        var select = $('select#cbxCustomerGroup')
        //lấy dữ liệu nhóm khách hàng
        $.ajax({
            url: "http://api.manhnv.net/api/customergroups",
            method: "GET",
        }).done(function (res) {
            if (res) {
                console.log(res);
                $.each(res, function (index, obj) {

                    var option = $(`<option  value= "` + obj.CustomerGroupId + `">` + obj.CustomerGroupName + `</option>`);
                    select.append(option);
                })
            }
        }).fail(function (res) {
            debugger;
        })
    }
}





/*
    format<any> sang kiểu date có dạng: ngày/tháng/năm
    createBy: dmgiang 29/12/2020 
*/
function formatDateOfBirth(dateOfBirth) {
    date = new Date(dateOfBirth);
    if (Number.isNaN(date.getTime()))
        return "";
    day = date.getDate();
    day = day < 10 ? '0' + day : day;
    month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

/* format kiểu gender sang Nam hoặc Nữ
   createBy: dmgiang 28/12/2020 
*/
function formatGenderName(gender) {
    if (gender == "Nam" || gender == "Nữ")
        return gender;
    else
        return "";
}

/**
    nếu giá trị đầu vào là null thì chuyển thành khoảng trắng
    createBy: dmgiang 28/12/2020 
*/
function formatString(str) {
    if (str == null)
        return "";
    else return str;
}
/**
    format kiểu money từ 1000000 sang 1.000.000
    createBy: dmgiang 28/12/2020 
*/
function formatMoney(money) {
    if (money == null)
        return "";
    var num = money.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return num;
}