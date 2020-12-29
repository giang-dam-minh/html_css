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

        //mở form thêm khách hàng khi ấn thêm khách hàng
        $('#btnAdd').click(function () {
            $('.dialog-detail').show();
        })

        //load lại dữ liệu khi ấn nút reload
        $('#btnReload').click(function () {
            alert("reload");
        })

        //đóng form detail khi ấn dấu X
        $('#btnCloseFormDetail').click(function () {
            $('.dialog-detail').hide();
        })
    }

    loadData() {
        var ths = $('table thead th');

        $.ajax({
            url: this.url,
            method: "GET",
        }).done(function (res) {
            $.each(res, function (index, obj) {
                var tr = $(`<tr></tr>`);
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