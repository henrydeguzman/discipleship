/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 02/10/2019
 * Time: 6:30 PM
 */
$(function () {

    // Create the new tab
    var $tabPane = $('<div />', {'id': 'control-sidebar-theme-demo-options-tab','class': 'tab-pane active'});
    // Create the tab button
    var $tabButton = $('<li />', {'class': 'active'})
        .html('<a href=\'#control-sidebar-theme-demo-options-tab\' data-toggle=\'tab\'>'
            + '<i class="fa fa-wrench"></i>'
            + '</a>');
    // Add the tab button to the right sidebar tabs
    $('[href="#control-sidebar-home-tab"]')
        .parent()
        .before($tabButton);

    // Create the menu
    var $settings = $('<div />');

    // Layout options
    $settings.append(
        '<h4 class="control-sidebar-heading">'
        + 'Layout Options'
        + '</h4>'
        // Fixed layout
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-layout="fixed"class="pull-right"/> '
        + 'Fixed layout'
        + '</label>'
        + '<p>Activate the fixed layout. You can\'t use fixed and boxed layouts together</p>'
        + '</div>'
        // Boxed layout
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-layout="layout-boxed" class="pull-right"/> '
        + 'Boxed Layout'
        + '</label>'
        + '<p>Activate the boxed layout</p>'
        + '</div>'
        // Sidebar Toggle
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-layout="sidebar-collapse"class="pull-right"/> '
        + 'Toggle Sidebar'
        + '</label>'
        + '<p>Toggle the left sidebar\'s state (open or collapse)</p>'
        + '</div>'
        // Sidebar mini expand on hover toggle
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-enable="expandOnHover"class="pull-right"/> '
        + 'Sidebar Expand on Hover'
        + '</label>'
        + '<p>Let the sidebar mini expand on hover</p>'
        + '</div>'
        // Control Sidebar Toggle
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-controlsidebar="control-sidebar-open"class="pull-right"/> '
        + 'Toggle Right Sidebar Slide'
        + '</label>'
        + '<p>Toggle between slide over content and push content effects</p>'
        + '</div>'
        // Control Sidebar Skin Toggle
        + '<div class="form-group">'
        + '<label class="control-sidebar-subheading">'
        + '<input type="checkbox"data-sidebarskin="toggle"class="pull-right"/> '
        + 'Toggle Right Sidebar Skin'
        + '</label>'
        + '<p>Toggle between dark and light skins for the right sidebar</p>'
        + '</div>'
    );
    var $skinsList = $('<ul />', {'class': 'list-unstyled clearfix'});

    var mySkins = [
        {'name':'blue','leftnav':'#222d32','navheader':'#367fa9', 'header':'#3c8dbc'}
    ];

    for(var $x=0;$x<mySkins.length;$x++){
        $skinsList.append(skintemplate({'skin':mySkins[$x]['name'],'header':mySkins[$x]['header'],'navheader':mySkins[$x]['navheader']}));
    }

    $settings.append('<h4 class="control-sidebar-heading">Skins</h4>')
    $settings.append($skinsList);
    $tabPane.append($settings);
    $('#control-sidebar-home-tab').after($tabPane);

    function skintemplate(arr){
        $prefix="app-skin-";
        var spanstyle   ="display:block; width: 20%; float: left; height: 7px;";
        var spanstyle2   ="display:block; width: 80%; float: left; height: 7px;";
        var spanstyle3  ="display:block; width: 20%; float: left; height: 20px;";
        var spanstyle4  ="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7";
        var astyle      ="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)";

        return $('<li />', {style: 'float:left; width: 33.33333%; padding: 5px;'})
            .append('<a href="javascript:void(0)" data-skin="'+$prefix+arr.skin+'" style="'+astyle+'" class="clearfix full-opacity-hover">'
                + '<div><span style="'+spanstyle+'"></span><span class="'+$prefix+'header-'+arr.skin+'" style="'+spanstyle2+'"></span></div>'
                + '<div><span style="'+spanstyle3+'"></span><span style="'+spanstyle4+'"></span></div>'
                + '</a>'
                + '<p class="text-center no-margin">Blue</p>');
    }
});
