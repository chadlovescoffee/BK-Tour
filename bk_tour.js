var $ = require('jquery');
var Date_pretty = require('mod_Date_pretty');
var Time_pretty = require('mod_Time_pretty');

// include CSS
$('head').prepend('<link rel="stylesheet" type="text/css" href="dist/bk_tour.css">');


$( document ).ready(function() {


    $.ajax({
        url: "http://brettkissel.com/ajax/tourdates.php",
        jsonp: "callback",
        dataType: "jsonp",
        data: "",

        success: function(bk_tour) {

            console.log(bk_tour);

            var html = '';

            var i = 0;
            var i_max = bk_tour_config.qty;
            var bk_tour_qty = bk_tour.dates.length;


            $(bk_tour.dates).each(function () {

                // time html
                var time_html = '';
                if(bk_tour.dates[i].time != '00:00:00') {
                    time_html = '<div>' + Time_pretty(bk_tour.dates[i].time) + '</div>';
                }

                // ticket html
                var Ticket = bk_tour.dates[i].url;
                if(Ticket != '') {
                    Ticket = '<a href="' + bk_tour.dates[i].url + '" target="_blank">Tickets</a>';
                }



                // Highlight sold out events
                var vanilla_event = bk_tour.dates[i].event;
                var highlight_found = false;
                var highlight_text = '';
                var event_html = '';

                if(vanilla_event.indexOf('SOLD OUT') > -1) {
                    highlight_found = true;
                    highlight_text = 'SOLD OUT';
                } else {
                    if(vanilla_event.indexOf('Sold Out') > -1) {
                        highlight_found = true;
                        highlight_text = 'Sold Out';
                    } else {
                        if(vanilla_event.indexOf('sold out') > -1) {
                            highlight_found = true;
                            highlight_text = 'sold out';
                        }
                    }
                }

                if(highlight_found == true){
                    event_html = vanilla_event.replace(highlight_text, '<span class="soldout">SOLD OUT</span>');
                } else {
                    event_html = vanilla_event;
                }


                var Date_ugly = bk_tour.dates[i].date;

                html +=
                    '<div class="bk_tour">' +
                    '   <div class="concert column_wrapper">' +

                    '       <div class="date">' +
                    '           <h6>' + Date_pretty(Date_ugly) + '</h6>' +
                    '       </div>' +

                    '       <div class="details column_wrapper">' +
                    '           <div class="location column_wrapper">' +
                    '               <div class="city column_wrapper">' +
                    '                   <h3>' + bk_tour.dates[i].city + '</h3>' +
                    '               </div>' +

                    '               <div class="venue column_wrapper">' +
                    bk_tour.dates[i].venue +
                    time_html +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="event">' + event_html + '</div>' +
                    '       </div>' +

                    '       <div class="tickets">' +
                    '           <h6>' + Ticket + '</h6>' +
                    '       </div>' +

                    '   </div>' +
                    '</div>';

                ++i;

                if(i == i_max) {
                    return false;
                }
            });


            $(bk_tour_config.destination).append(html);

            // view more button
            if(i_max < bk_tour_qty) {
                $(bk_tour_config.destination).append('<a href="/tour.php"><div class="button">View More</div></a>');
            }
        }
    });
});