const CheckerHelper = (() => {
    function checkIfWholeNumber(num) {
        return typeof (num) === "number" && Number.isInteger(num) && num >= 0;
    }

    function checkIfPositiveNumber(num) {
        return checkIfWholeNumber(num) && num > 0;
    }

    return {
        checkIfWholeNumber,
        checkIfPositiveNumber,
    };
})();

export default CheckerHelper;
