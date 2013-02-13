(function ($) {
    var mainFrame = null;
    var columns = 4;
    var headLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var footLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];


    var animationCount = 0;
    var loadMainFrame = function (root) {
        mainFrame = $('#__ak_main_frame');
        if (mainFrame.size() == 0) {
            mainFrame = $('<div/>').attr('id', '__ak_main_frame').appendTo(root);
        }
        return mainFrame;
    }

    var layout = function (animated) {
        var width = $('.__ak_rail_vertical').not('.__ak_removed').size() * 90 + 30;

        if ($('.__ak_rail_vertical').not(':hidden').size() > 7) {
            $('#__ak_add_button').hide();
            width -= 20;
        }
        if (animated) {
            mainFrame.animate({
                width:width
            }, 300);
        } else {
            mainFrame.width(width);
        }
        $('#__ak_add_button').css({
            left:mainFrame.offset().left + mainFrame.outerWidth() - 40,
            top:mainFrame.offset().top + 120
        });


    }

    var loadMenu = function (root) {
        var menu = $('#__ak_menu');
        if (menu.size() == 0) {
            menu = $('<div/>').attr('id', '__ak_menu').appendTo(root);
        } else {
            menu.empty();
        }
        var shuffleButton = $('<a>Shuffle</a>').attr('data-role', 'button')
            .attr('data-theme', 'c')
            .attr('id', '__ak_shuffle_button')
            .appendTo(menu);
        var editButton = $('<a>Edit</a>').attr('data-role', 'button')
            .attr('data-theme', 'c')
            .attr('id', '__ak_edit_button')
            .attr('data-icon', 'gear')
            .appendTo(menu);
        var saveButton = $('<a>Save</a>').attr('data-role', 'button')
            .attr('id', '__ak_save_button')
            .attr('data-icon', 'check')
            .attr('data-theme', 'b')
            .addClass('ui-disabled')
            .appendTo(menu);

        shuffleButton.bind('vclick', function () {
            if (animationCount > 0) return;
            shuffleRail();

            function shuffleLabel(){

            }
            (function (label) {
                function getRandom() {
                    return label.eq(Math.floor(label.size() * Math.random()));
                }
                var count = 5;
                for(var  i=0; i<count; i++){
                    var l1 = getRandom(),
                        l2 = getRandom();
                    var val1 = l1.text(),
                        val2 = l2.text();
                    l1.text(val2);
                    l2.text(val1);
                }
            })($('#__ak_foot_container label'));
        });
        editButton.bind("vclick", function () {
            if (animationCount > 0) return;
            $(this).add(saveButton).toggleClass('ui-disabled');
            edit();
        });
        saveButton.bind('vclick', function () {
            $(this).add(editButton).toggleClass('ui-disabled');
            save();
        });
        return menu;
    }

    var loadHeadStones = function (columns) {
        var container = $('#__ak_head_container');
        if (container.size() == 0) {
            container = $('<div/>').attr('id', '__ak_head_container').appendTo(mainFrame);
        } else {
            container.empty();
        }

        for (var column = 0; column < columns; column++) {
            var stone = $('<div/>').appendTo(container)
                .addClass('__ak_head_stone')
                .addClass('__ak_column_' + column);
            var button = $('<a/>').appendTo(stone)
                .attr('data-role', 'button')
                .attr('data-inline', 'true')
                .addClass('__ak_start_button')
                .text(headLabels[column]);
            var label = $('<label/>').appendTo(stone)
                .attr('id', '__ak_head_label' + column)
                .addClass('__ak_head_label').hide();
            var input = $('<input/>').attr('type', 'text')
                .appendTo(stone)
                .addClass('__ak_head_input')
                .attr('maxlength', 3)
                .appendTo(stone)
                .hide();

        }
        $('.__ak_head_stone').each(function () {
            var stone = $(this);
            var input = $('.__ak_head_input', stone);
            var button = $('.__ak_start_button', stone).show();
            input.keydown(function (e) {
                if (e.keyCode == 9 || e.keyCode == 13) {
                    var val = $(this).hide().val();
                    button.show();
                    button.find('.ui-btn-text')
                        .text(val);
                }
            });
        });
        $('.__ak_head_stone').bind('vclick', function () {
            var stone = $(this);
            var button = $('.__ak_start_button', stone);
            if (button.hasClass('ui-disabled')) {
                button.hide();
                var input = $('.__ak_head_input', stone);
                input.show().val(button.text());
                input.trigger('select');
            }
        });

        loadStartButtonEvents();
        return container;
    }
    var loadStartButtonEvents = function () {
        $('.__ak_start_button').each(function (i) {
            $(this).unbind('vclick').bind('vclick', function () {
                var button = $(this).hide();
                button.siblings('.__ak_head_label')
                    .show()
                    .text(button.text());
                startTrace(i);
            });
        });
    }


    var loadRails = function (columns, rows) {
        var container = $('#__ak_rail_container');
        if (container.size() == 0) {
            container = $('<div/>').attr('id', '__ak_rail_container').appendTo(mainFrame);
        } else {
            container.empty();
        }
        for (var column = 0; column < columns; column++) {
            var vertical = $('<div/>').appendTo(container)
                .addClass('__ak_rail_vertical')
                .addClass('__ak_column_' + column);
            if (column == columns - 1) vertical.addClass('__ak_last');

            for (var row = 0; row < rows; row++) {
                var box = $('<div/>').appendTo(vertical)
                    .addClass('__ak_rail_box')
                    .addClass('__ak_row_' + row)
                var horizontal = $('<div/>').appendTo(box)
                        .addClass('__ak_rail_horizontal')
                    ;
            }
        }
        return container;
    }

    var loadFootStones = function (columns) {
        var container = $('#__ak_foot_container');
        if (container.size() == 0) {
            container = $('<div/>').attr('id', '__ak_foot_container').appendTo(mainFrame);
        } else {
            container.empty();
        }
        for (var column = 0; column < columns; column++) {
            var stone = $('<div/>').appendTo(container)
                .addClass('__ak_foot_stone')
                .addClass('__ak_column_' + column);
            var label = $('<label/>').appendTo(stone)
                .addClass('__ak_foot_label')
                .text(footLabels[column])
                .bind('refresh',function () {
                    var label = $(this);
                    var val = label.text();
                    if (val && val.length >= 3) {
                        label.addClass('__ak_long');
                    } else {
                        label.removeClass('__ak_long');
                    }
                }).trigger('refresh');
            var input = $('<input/>').attr('type', 'text')
                .appendTo(stone)
                .addClass('__ak_foot_input')
                .attr('maxlength', 3)
                .appendTo(stone)
                .hide();
        }

        $('.__ak_foot_stone').each(function () {
            var stone = $(this);
            var input = $('.__ak_foot_input', stone);
            var label = $('.__ak_foot_label', stone);
            input.keydown(function (e) {
                if (e.keyCode == 9 || e.keyCode == 13) {
                    var val = $(this).hide().val();
                    label.show()
                        .text(val)
                        .trigger('refresh');
                }
            });
            label.dblclick(function () {
                var val = $(this).hide().text();
                input.show().val(val);
            });
        });
    }

    var loadRemoveButton = function () {
        var removeButton = $('#__ak_remove_button').hide();
        if (removeButton.size() == 0) {
            removeButton = $('<div/>').attr('id', '__ak_remove_button')
                .appendTo(mainFrame).hide();
            var img = $('<div/>').addClass('__ak_image').appendTo(removeButton);
        }
    }
    var loadAddButton = function () {
        var addButton = $('#__ak_add_button').hide();
        if (addButton.size() == 0) {
            addButton = $('<div/>').attr('id', '__ak_add_button')
                .prependTo(mainFrame).hide();
            var img = $('<div/>').addClass('__ak_image').appendTo(addButton);
        }
        addButton.bind('vclick', function () {
            add();
        });
    }

    var loadResultView = function (root) {
        var resultView = $('#__ak_result_view')
        if (resultView.size() == 0) {
            resultView = $('<div/>').attr('id', '__ak_result_view')
                .appendTo(root).hide();
            var title = $('<div/>').addClass('__ak_title_')
                .text('Result')
                .appendTo(resultView);
        }
    }

    var displayResult = function (val1, val2) {
        var resultView = $('<div/>').appendTo($('#__ak_result_view').show());
        var span1 = $('<span/>').text(val1).appendTo(resultView);
        var seperator = $('<span/>').text(' - ').appendTo(resultView);
        var span2 = $('<span/>').text(val2).appendTo(resultView);
    }

    var getHeadStone = function (column) {
        return $('.__ak_head_stone').not('.__ak_removed')
            .filter('.__ak_column_' + column);
    }
    var getFootStone = function (column) {
        return $('.__ak_foot_stone').not('.__ak_removed')
            .filter('.__ak_column_' + column);
    }
    var getBox = function (column, row) {
        return getVertical(column).find('.__ak_rail_box')
            .filter('.__ak_row_' + row);
    }
    var getHorizontalRail = function (column, row) {
        return getBox(column, row).find('.__ak_rail_horizontal');
    }
    var getVertical = function (column) {
        return $('.__ak_rail_vertical').not('.__ak_removed')
            .filter('.__ak_column_' + column);
    }

    var getHorizontalTrace = function (column, row) {
        return getBox(column, row).find('.__ak_trace_horizontal');
    }
    var getVerticalTrace = function (column, row) {
        return getBox(column, row).find('.__ak_trace_vertical');
    }


    var traceZindex = 0;
    var addHorizonalTrace = function (color, column, row) {
        var box = getBox(column, row);
        var shouldDown = $('.__ak_trace_horizontal', box).size() > 0;
        var trace = $('<div/>').addClass('__ak_trace_horizontal')
            .addClass('__ak_column_' + column)
            .addClass('__ak_row_' + row)
            .css('background', color)
            .appendTo(box)
            .css({
                left:box.offset().left - 6,
                top:box.offset().top + (shouldDown ? 4 : 0),
                width:box.width() + 12,
                height:8,
                zIndex:traceZindex++
            });
        if (shouldDown) trace.addClass('__ak_trace_down');
        return trace;
    }
    var addVerticalTrace = function (color, column, row, shouldDown) {
        var box = getBox(column, row);
        var trace = $('<div/>').addClass('__ak_trace_vertical')
            .css('background', color)
            .appendTo(box)
            .css({
                left:box.offset().left - 6,
                top:box.offset().top + (shouldDown ? 4 : 0),
                width:8,
                height:box.height() + (shouldDown ? 0 : 4),
                zIndex:traceZindex++
            });
        if (shouldDown) trace.addClass('__ak_trace_down');
        return trace;
    }
    var createRandomColor = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ' )';
    }
    var clean = function () {
        animationCount = 0;
        $('.__ak_start_button').addClass('ui-disabled');
        $('.__ak_rail_horizontal.__ak_on').removeClass('__ak_on');
        $('.__ak_trace_horizontal, .__ak_trace_vertical').remove();
        $('.__ak_start_button').show();
        $('.__ak_head_label').hide()
            .unbind('hover');
        $('.__ak_foot_label').addClass('__ak_off')
            .css('background', '')
            .unbind('hover');
        $('#__ak_result_view').empty().hide();

    }
    var shuffleRail = function () {
        clean();
        $('.__ak_start_button').removeClass('ui-disabled');
        $('div.__ak_rail_vertical', mainFrame).each(function (column) {
            var vertical = $(this);
            vertical.oneTime(100 * column + 1, function () {
                var vertical = $(this);
                var loopCount = 0;
                while (vertical.find('.__ak_rail_horizontal.__ak_on').size() < 2) {
                    $('div.__ak_rail_horizontal', vertical).each(function (row) {
                        if (row < 2) return true;
                        if (getHorizontalRail(column - 1, row).hasClass('__ak_on')) return true;
                        if (getHorizontalRail(column + 1, row).hasClass('__ak_on')) return true;
                        var horizontal = $(this);

                        var r = Math.floor(Math.random() * 10);
                        if (r > 5) {
                            horizontal.addClass('__ak_on');
                        }
                    });
                    $('div.__ak_rail_horizontal', vertical).filter('.__ak_on:last')
                        .removeClass('__ak_on');//prevent eternal loop
                    if (++loopCount > 100) break;//prevent eternal loop
                }
                $('div.__ak_rail_vertical:last', mainFrame).find('.__ak_on')
                    .removeClass('__ak_on');
            });
        });


        layout();
    }

    var startTrace = function (startColumn) {
        animationCount++;
        var color = createRandomColor();
        var column = startColumn;
        var startLabel = getHeadStone(column).find('label.__ak_head_label').css('background', color);
        var row = 0;
        var shouldDown = true;
        var traceClass = '__ak_for_' + startLabel.attr('id');
        var interval = 100;
        if ($('.__ak_start_button').not(':hidden').size() == 0) interval = 1;// last trace go quickly

        startLabel.everyTime(interval, function () {
            var vertical = addVerticalTrace(color, column, row++, shouldDown);
            vertical.addClass(traceClass);
            if (getHorizontalRail(column, row).hasClass('__ak_on')) {
                var horizontal = addHorizonalTrace(color, column++, row);
                horizontal.addClass(traceClass);
                shouldDown = horizontal.hasClass('__ak_trace_down');
            } else if (getHorizontalRail(column - 1, row).hasClass('__ak_on')) {
                var horizontal = addHorizonalTrace(color, --column, row);
                horizontal.addClass(traceClass);
                shouldDown = horizontal.hasClass('__ak_trace_down');
            } else {
                shouldDown = false;
            }
            if (getBox(column, row).size() == 0) {
                $(this).stopTime();
                animationCount--;
                var goalLabel = getFootStone(column).find('label.__ak_foot_label')
                    .removeClass('__ak_off')
                    .css('background', color)
                    .addClass(traceClass);
                $(this).oneTime(250, function () {
                    highlightStone(startLabel);
                    highlightStone(goalLabel);

                    displayResult(startLabel.text(), goalLabel.text());
                    $(this).oneTime(400, function () {
                        addHoverEffect(startLabel);
                        addHoverEffect(goalLabel);
                        syncHoverEvents(startLabel, goalLabel);
                        startLabel.hover(function () {
                            $('.__ak_for_' + startLabel.attr('id')).css('z-index', ++traceZindex);
                        });
                    })
                    if ($('.__ak_start_button').not(':hidden').size() == 1) {
                        $('.__ak_start_button').not(':hidden').oneTime(700, function () {
                            if (!$(this).is(':hidden')) $(this).trigger('vclick');
                        });
                    }
                });
            }
        });
    }

    var redrawTrace = function () {
        $('.__ak_trace_horizontal, .__ak_trace_vertical').each(function () {
            var trace = $(this);
            var box = trace.parents('.__ak_rail_box');
            trace.css({
                left:box.offset().left,
                top:box.offset().top
            });
        });
        $('.__ak_head_label, .__ak_foot_label').not(':hidden').each(function () {
            var label = $(this);
            addHoverEffect(label);
        });

    }

    var highlightStone = function (label) {
        var cover = $('<div/>').appendTo(mainFrame)
            .addClass('__ak_hilight_cover');
        cover.css({
            width:label.outerWidth(),
            height:label.outerHeight(),
            top:label.offset().top,
            left:label.offset().left
        });
        var i = 0;
        cover.everyTime(70, function () {
            if (++i % 2 == 0) {
                cover.hide();
            } else {
                cover.show();
            }
            if (i > 3) {
                cover.stopTime();
                cover.hide();
            }
        });
    }
    var addHoverEffect = function (label) {
        var outerWidth = label.outerWidth();
        var outerHeight = label.outerHeight();
        var width = label.width();
        var height = label.height();
        var offset = label.offset();
        var scale = 1.4;
        var fontSize = 30;
        label.unbind('hover').hover(function () {
            $(this).css({
                position:'absolute',
                top:offset.top - outerHeight * (scale - 1),
                left:offset.left - outerWidth * (scale - 1) / 2,
                width:width * scale,
                height:height * scale,
                fontSize:fontSize * scale,
                boxShadow:'1px 1px 5px #555'
            })
            return true;
        }, function () {
            $(this).css({
                position:'static',
                width:width,
                height:height,
                fontSize:fontSize,
                boxShadow:'none'
            });
            return true;
        });
    }
    var syncHoverEvents = function (obj1, obj2) {
        obj1.hover(function () {
            if ($(this).hasClass('__ak_hover')) return true;
            obj2.not('.__ak_hover')
                .addClass('__ak_hover')
                .trigger('mouseenter');
        }, function () {
            obj2.filter('.__ak_hover')
                .trigger('mouseleave')
                .removeClass('__ak_hover');
        });
        obj2.hover(function () {
            if ($(this).hasClass('__ak_hover')) return true;
            obj1.not('.__ak_hover')
                .addClass('__ak_hover')
                .trigger('mouseenter');
        }, function () {
            obj1.filter('.__ak_hover')
                .trigger('mouseleave')
                .removeClass('__ak_hover');
        });
    }

    var edit = function () {
        $('.__ak_trace_horizontal, .__ak_trace_vertical').remove();
        $('.__ak_start_button').show().addClass('ui-disabled');
        $('.__ak_head_label').hide()
            .unbind('hover');

        $('.__ak_foot_label').addClass('__ak_off')
            .css('background', '')
            .unbind('hover');


        $('.__ak_rail_horizontal.__ak_on, .__ak_rail_vertical').addClass('__ak_disabled');

        $('#__ak_shuffle_button').addClass('ui-disabled');


        $('.__ak_head_stone').children().hide();
        $('.__ak_head_input').each(function () {
            var button = $(this).siblings('.__ak_start_button');
            $(this).show().val(button.text());
        });

        $('.__ak_head_input').eq(0).trigger('select');

        $('.__ak_foot_input').each(function () {
            var label = $(this).siblings('.__ak_foot_label').hide();
            $(this).show().val(label.text());
        });


        loadRemoveButton();
        loadAddButton();

        layout();


        mainFrame.bind('mouseenter, mousemove', function (e) {
            $('.__ak_rail_vertical').not('.__ak_removed').each(function (column) {
                var x = e.pageX;
                var left = $(this).offset().left;
                var width = $(this).width();
                if (left - width / 2 < x && x < left + width / 2) {
                    showRemoveButton(column);
                }
            });
            showAddButton();
        });
        mainFrame.mouseleave(function () {
            $('#__ak_remove_button').hide();
            $('#__ak_add_button').hide();
        });

        var lastColumn = $('.__ak_rail_vertical').not('.__ak_removed').size() - 1;
        showRemoveButton(lastColumn);
        showAddButton();
    }

    var showRemoveButton = function (column) {
        var headStone = getHeadStone(column).eq(0);
        if (headStone.size() == 0) return;
        if ($('#__ak_remove_button', headStone).not(':hidden').size() > 0) return;
        if ($('.__ak_rail_vertical').not('.__ak_removed').size() < 3) return;
        $('#__ak_remove_button').appendTo(headStone)
            .show()
            .css({
                top:headStone.offset().top - 30,
                left:headStone.offset().left + 23
            })
            .unbind('vclick')
            .one('vclick', function () {
                remove(column);
                $(this).hide();
            });
        ;
    }

    var showAddButton = function () {
        if ($('.__ak_rail_vertical').not('.__ak_removed').size() < 8) {
            $('#__ak_add_button').show();
        }
    }

    var remove = function (column) {
        var vertical = getVertical(column).addClass('__ak_removed');
        var headStone = getHeadStone(column).addClass('__ak_removed');
        var footStone = getFootStone(column).addClass('__ak_removed');
        var last = $('.__ak_rail_vertical').not(':hidden').filter(':last');
        if (vertical.is(last)) {
            vertical.hide().removeClass('__ak_last');
            headStone.hide();
            footStone.hide();
            var horizontal = $('.__ak_rail_vertical').not(':hidden')
                .filter(':last')
                .addClass('__ak_last')
                .find('.__ak_rail_horizontal.__ak_on');
            horizontal.removeClass('__ak_on')
                .removeClass('__ak_disabled');

        } else {
            shrinkOut(vertical);
            shrinkOut(headStone);
            shrinkOut(footStone);
            if (column > 0) {
                var lefterVertial = getVertical(column - 1);
                lefterVertial.find('.__ak_rail_horizontal').each(function (row) {
                    if (!$(this).hasClass('__ak_on')) return true;
                    var horizontal = getBox(column + 1, row).find('.__ak_rail_horizontal.__ak_on');
                    horizontal.oneTime(300, function () {
                        $(this).removeClass('__ak_on');
                        $(this).removeClass('__ak_disabled');
                    });
                });
            }
        }
        reindex($('.__ak_rail_vertical').size());
        var interval = 300;
        mainFrame.animate({
            width:mainFrame.width() - 80
        }, interval, null, function () {
            layout();
        });
        $('#__ak_add_button').animate({
            left:$('#__ak_add_button').offset().left - 80
        }, interval, null, function () {
            layout();
        });
    }

    var add = function () {
        $('#__ak_remove_button').hide().appendTo(mainFrame);

        var interval = 300;
        mainFrame.animate({
            width:mainFrame.width() + 80
        }, interval, null, function () {
            var columns = $('.__ak_rail_vertical').not(':hidden').size();
            var lastVertical = $('.__ak_rail_vertical.__ak_last').removeClass('__ak_last');
            var vertical = lastVertical.clone()
                .addClass('__ak_last')
                .removeClass('__ak_removed')
                .insertAfter(lastVertical)
                .show();

            var lastFootStone = getFootStone(columns - 1);
            var footStone = lastFootStone.clone()
                .show()
                .insertAfter(lastFootStone);


            var lastHeadStone = getHeadStone(columns - 1);
            var headStone = lastHeadStone.clone()
                .show()
                .insertAfter(lastHeadStone);
            $('.__ak_head_input', headStone).val(columns + 1)
                .trigger('select');

            reindex($('.__ak_rail_vertical').size());
            layout();


            $('div.__ak_rail_horizontal', lastVertical).each(function (row) {
                if (row < 2) return true;
                if (getHorizontalRail(columns - 2, row).hasClass('__ak_on')) return true;
                var horizontal = $(this);
                var r = Math.floor(Math.random() * 10);
                if (r > 5) {
                    horizontal.addClass('__ak_on')
                        .addClass('__ak_disabled');
                }
            });


        });
        $('#__ak_add_button').animate({
            left:$('#__ak_add_button').offset().left + 80
        }, interval, null, function () {
            layout();
        });

    }
    var reindex = function (columns) {
        for (var column = 0; column < columns; column++) {
            var className = ('__ak_column_' + column);
            $('.' + className).removeClass(className);
        }
        $('.__ak_head_stone').not('.__ak_removed').each(function (column) {
            $(this).addClass('__ak_column_' + column);
        });
        $('.__ak_rail_vertical').not('.__ak_removed').each(function (column) {
            $(this).addClass('__ak_column_' + column);
        });
        $('.__ak_foot_stone').not('.__ak_removed').each(function (column) {
            $(this).addClass('__ak_column_' + column);
        });
    }

    var shrinkOut = function (obj) {
        var width = obj.width;
        obj.animate({
                width:1
            },
            200,
            null,
            function () {
                $(this).width(width).hide();
            });
    }

    var save = function () {
        $('.__ak_removed').remove();
        $('.__ak_disabled').removeClass('__ak_disabled');
        $('.__ak_start_button').removeClass('ui-disabled');
        loadStartButtonEvents();

        $('#__ak_shuffle_button').removeClass('ui-disabled');

        $('.__ak_head_stone').each(function () {
            var stone = $(this);
            var input = $('.__ak_head_input', stone).hide();
            var button = $('.__ak_start_button', stone).show();
            button.find('.ui-btn-text').text(input.val());
        });
        $('.__ak_foot_label').each(function () {
            var input = $(this).siblings('.__ak_foot_input').hide();
            $(this).show()
                .text(input.val())
                .trigger('refresh');
        });
        $('#__ak_remove_button').remove();
        $('#__ak_add_button').remove();
        layout(true);


        $('.__ak_start_button').each(function (column) {
            var val = $(this).text();
            if (val == '')  val = column + 1;
            headLabels[column] = val;
        });
        $('.__ak_foot_label').each(function (column) {
            var val = $(this).text();
            if (val == '')  val = column + 1;
            footLabels[column] = val;
        });
        reindex($('.__ak_rail_vertical').size());


        saveToStorage();
    }
    var saveToStorage = function () {
        localStorage.setItem('columns', $('.__ak_rail_vertical').size());
        localStorage.setItem('headLabels', JSON.stringify(headLabels));
        localStorage.setItem('footLabels', JSON.stringify(footLabels));
    }
    var restoreFromStorage = function () {
        var c = localStorage.getItem('columns');
        if (c) columns = parseInt(c);

        var h = localStorage.getItem('headLabels');
        if (h) headLabels = JSON.parse(h);

        var f = localStorage.getItem('footLabels');
        if (f) footLabels = JSON.parse(f);

    }
    $.fn.amida = function (options) {
        settings = $.extend({
            columns:6,
            rows:10
        }, options);

        restoreFromStorage();
        return this.each(function () {
            var root = $(this).addClass('__ak_root');
            var rows = 10;
            loadMainFrame(root);
            loadHeadStones(columns);
            loadRails(columns, rows);
            loadFootStones(columns);

            shuffleRail();


            var controlBoard = $('<div/>').attr('id', '__ak_control_board')
                .appendTo(root);
            loadMenu(controlBoard);
            loadResultView(controlBoard);


            var needsRedraw = false;
            $(window).resize(function () {
                redrawTrace();
            });
        });
    };
})(jQuery);