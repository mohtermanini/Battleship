const FormHelper = (() => {
    function enableButton(button) {
        button.removeAttribute("disabled");
    }
    function disableButton(button) {
        button.setAttribute("disabled", "");
    }

    return {
        enableButton,
        disableButton,
    };
})();

export default FormHelper;
