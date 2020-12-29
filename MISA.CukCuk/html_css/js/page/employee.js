$(document).ready(function () {
    new CustomerJS();
})


class CustomerJS extends BaseJS {
    constructor() {
        super();
    }
    setDataUrl() {
        this.url = "http://api.manhnv.net/api/employees";
    }
}
