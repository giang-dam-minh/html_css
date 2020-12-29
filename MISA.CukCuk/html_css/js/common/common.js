/**
*    format dữ liệu ngày tháng sang ngày/tháng/năm
*    @Param {any} date: có kiểu dữ liệu bất kỳ
*   createBy: dmgiang 28/12/2020 
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
*/
function formatString(str) {
    if (str == null)
        return "";
    else return str;
}
/**
    format kiểu money từ 1000000 sang 1.00000
*/
function formatMoney(money) {
    if (money == null)
        return "";
    var num = money.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return num;
}