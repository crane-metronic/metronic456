var AppCalendar = function() {
    var checkMonth = function(d){
        var calendarY=d.format('YYYY');
        var calendarM=d.format('MM')-1;
        var date=new Date();
        var curY=date.getFullYear();
        var curM=date.getMonth();
        var resultI=new Date(calendarY,calendarM,1)-new Date(curY,curM,1);
        if (resultI>0) {return 1;}
        if (resultI<0) {return -1;}
        return 0;
    }
    var getLastMonth = function(y,m){
        var ym={};
        if (m==0) {
            ym.m=12;
            ym.y=y-1;
        }else{
            ym.m=m-1;
            ym.y=y;
        }
        return ym;
    };
    var getDaysOfMonth = function(y,m){
            return 32-new Date(y,m,32).getDate();
    };
    var getEventOfMonth = function(y,m){
        var dayCount=getDaysOfMonth(y,m);
        var days=[];
        for (var i = 1; i <= dayCount; i++) {
            days.push(i);
        }
        var monthEvents=[];
        $.each(days,function(i,e){
            $.each([1,2,3],function(ii,ee){
                var tempe={};
                tempe.title=ee+"";
                tempe.rate=ee;
                tempe.start=new Date(y,m,e);
                tempe.className="bg-grey";
                tempe.allDay=true;
                monthEvents.push(tempe);
            });
        });
        return monthEvents;
    };
    var getLastThreeMonthEvent = function(y,m){
        var last1=getLastMonth(y,m);
        var last2=getLastMonth(last1.y,last1.m);
        var e=getEventOfMonth(y,m);
        var e1=getEventOfMonth(last1.y,last1.m);
        var e2=getEventOfMonth(last2.y,last2.m);
        return (e||[]).concat(e1||[]).concat(e2||[]);
    };
    
    return {
        //main function to initiate the module
        init: function() {
            this.initCalendar();
        },
        
        initCalendar: function() {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            
            if ($('#calendar').parents(".portlet").width() <= 720) {
                $('#calendar').addClass("mobile");
                h = {
                    left: 'title, prev, next',
                    center: '',
                    right: 'today,month,agendaWeek,agendaDay'
                };
            } else {
                $('#calendar').removeClass("mobile");
                h = {
                    left: 'title',
                    center: '',
                    right: 'prev,next,today,month,agendaWeek,agendaDay'
                };
            }

            var initDrag = function(el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };

            var addEvent = function(title) {
                title = title.length === 0 ? "Untitled Event" : title;
                var html = $('<div class="external-event label label-default">' + title + '</div>');
                jQuery('#event_box').append(html);
                initDrag(html);
            };

            $('#external-events div.external-event').each(function() {
                initDrag($(this));
            });

            $('#event_add').unbind('click').click(function() {
                var title = $('#event_title').val();
                addEvent(title);
            });

            //predefined events
            $('#event_box').html("");
            addEvent("My Event 1");
            addEvent("My Event 2");
            addEvent("My Event 3");
            addEvent("My Event 4");
            addEvent("My Event 5");

            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
                timeFormat: '',
                displayEventTime: false, //hide event time info,only show title
                defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
                slotMinutes: 15,
                editable: false,
                droppable: true, // this allows things to be dropped onto the calendar !!!

                titleFormat: {
                    month: "YYYY 年 MMMM",
                    week: "YYYY 年 MMMM D 日",
                    day: "YYYY 年 MMMM D 日"
                },
                monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                dayNamesShort: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                buttonText: {
                    today: '今天',
                    month: '月',
                    week: '周',
                    day: '天'
                },



                drop: function(date, allDay) { // this function is called when something is dropped
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }
                },
                eventClick: function(calEvent, jsEvent, view) {
                    if (checkMonth(calEvent.start)<0) {
                        return;
                    }
                    var curClass=calEvent.className;
                    if (curClass=="bg-blue"||curClass=="bg-green-jungle") {
                        calEvent.className="bg-grey";
                        $('#calendar').fullCalendar('renderEvent', calEvent, true);
                        return;
                    }
                    var curDate=calEvent.start.format('YYYY-MM-DD');
                    var events = $('#calendar').fullCalendar('clientEvents', function(event) {
                        var eventStart = event.start.format('YYYY-MM-DD');
                        var eventEnd = event.end ? event.end.format('YYYY-MM-DD') : null;
                        return (eventStart <= curDate && (eventEnd >= curDate) && !(eventStart < curDate && (eventEnd == curDate))) || (eventStart == curDate && (eventEnd === null));
                    });
                    $.each(events,function(i,e){
                        e.className="bg-grey";
                        $('#calendar').fullCalendar('renderEvent', e, true);
                    });
                    calEvent.className="bg-green-jungle";
                    $('#calendar').fullCalendar('renderEvent', calEvent, true);
                },
                events:function(start,end,timezone, callback){
                    $("#calendar").fullCalendar("removeEvents");
                    if (checkMonth(this.getDate())>0) {
                        return;
                    }
                    var calendarY=this.getDate().format('YYYY');
                    var calendarM=this.getDate().format('MM')-1;
                    callback(getEventOfMonth(calendarY,calendarM));
                }
            });

        }

    };

}();

jQuery(document).ready(function() {    
   AppCalendar.init(); 
});