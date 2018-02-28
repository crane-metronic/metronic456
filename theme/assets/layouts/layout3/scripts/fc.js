/**
Demo script to handle the theme demo
**/

var FC = function () {
    return {
        //main function to initiate the theme
        init: function() {
            //$('#switch-menu-state').bootstrapSwitch('state')
            $('#switch-menu-state').on(
                { 
                    'switchChange.bootstrapSwitch': function(event, state) {
                        if (state == true)
                        {
                            $(".page-header-menu").removeClass("hide");
                        }
                        else
                        {
                            $(".page-header-menu").addClass("hide");
                        }
                    }
                }
            );
        }
    };

}();

FC.init();