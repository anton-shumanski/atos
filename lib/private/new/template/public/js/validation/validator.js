$('form[data-constraints]').each(function(){
    var form = $(this);
    var constraints = form.attr('data-constraints');
    form.submit(function () {
        var errors;
        if (errors = validate(validate.collectFormValues(this), window[constraints])) {
            /**
             * @todo make your own implementation how to append errors
             */
            for (var i in errors) {
                var errorsHtml = '';
                for (var n in errors[i]) {
                    errorsHtml += errors[i][n]+'<br/>';
                }
                $(this).find('[name='+i+']').next().html(errorsHtml)
            }
            return false;
        }
    });
});