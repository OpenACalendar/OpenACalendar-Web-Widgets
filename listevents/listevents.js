/**
 * ican.openacalendar.org Event List Widget
 * @link http://ican.openacalendar.org/ OpenACalendar Open Source Software
 * @license http://ican.openacalendar.org/license.html 3-clause BSD
 * @copyright (c) 2013-2014, JMB Technology Limited, http://jmbtechnology.co.uk/
 * @author James Baster <james@jarofgreen.co.uk>
 */

var OpenACalendarWidgetListEvents = {
	callBackFunctionCount: 0,
	place: function(divid, site, options) {
		var usingOptions = {
			eventCount: 5,
			title: 'Events',
			maxStringLength: 300,
			countryCode: undefined,
			groupID: undefined,
			areaID: undefined,
			venueID: undefined,
			curatedListID: undefined,
			openInNewWindow: true,
			sslAvailable: false
		}
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				usingOptions[prop] = options[prop];
			}
		}
		var div = document.getElementById(divid);
		if (!div) return;
		var moreURL;
		if (usingOptions.groupID) {
			moreURL = "http://"+site+"/group/"+usingOptions.groupID;
		} else if (usingOptions.venueID) {
			moreURL = "http://"+site+"/venue/"+usingOptions.venueID;
		} else if (usingOptions.areaID) {
			moreURL = "http://"+site+"/area/"+usingOptions.areaID;
		} else if (usingOptions.curatedListID) {
			moreURL = "http://"+site+"/curatedlist/"+usingOptions.curatedListID;
		} else if (usingOptions.countryCode) {
			moreURL = "http://"+site+"/country/"+usingOptions.countryCode.toUpperCase();
		} else {
			moreURL = "http://"+site+"/";
		}

		var target = usingOptions['openInNewWindow'] ? ' target="_BLANK"' : '';

		div.innerHTML = '<div class="OpenACalendarWidgetListEventsData">'+
				'<div class="OpenACalendarWidgetListEventsHeader"><a href="'+moreURL+'" '+target+' id="'+divid+'Title">'+OpenACalendarWidgetListEvents.escapeHTML(usingOptions.title)+'</a></div>'+
				'<div class="OpenACalendarWidgetListEventsEvents" id="'+divid+'Data">Loading</div>'+
				'<div class="OpenACalendarWidgetListEventsFooter">'+
					'<div class="OpenACalendarWidgetListEventsFooterMore"><a href="'+moreURL+'" '+target+'>See more ...</a></div>'+
					'<div class="OpenACalendarWidgetListEventsFooterCredit">Powered by <a href="http://ican.hasacalendar.co.uk" '+target+'>Has A Calendar</a></div>'+
				'</div>'+
			'</div>';
		var dataDiv = document.getElementById(divid+"Data");
		var headTag = document.getElementsByTagName('head').item(0);

		OpenACalendarWidgetListEvents.callBackFunctionCount++;
		window["OpenACalendarWidgetListEventsCallBackFunction"+OpenACalendarWidgetListEvents.callBackFunctionCount] = function(data) {			
			var html = '';
			var limit = Math.min(data.data.length, usingOptions.eventCount);
			if (limit <= 0) {
				html = '<div class="OpenACalendarWidgetListEventsEventNone">No events</div>';
			} else {
				for (var i=0;i<limit;i++) {
					html += OpenACalendarWidgetListEvents.htmlFromEvent(data.data[i], usingOptions.maxStringLength, target);
				}
			}

			dataDiv.innerHTML=html;

			if (!usingOptions.title) {
				var titleDiv = document.getElementById(divid+"Title");
				titleDiv.innerHTML = data.title;
			}
		}
		var url = "http://";
		if (usingOptions.sslAvailable && "https:" == document.location.protocol) {
			url = "https://";
		}
		if (usingOptions.groupID) {
			url += site+"/api1/group/"+usingOptions.groupID+"/events.jsonp";
		} else if (usingOptions.venueID) {
			url += site+"/api1/venue/"+usingOptions.venueID+"/events.jsonp";
		} else if (usingOptions.areaID) {
			url += site+"/api1/area/"+usingOptions.areaID+"/events.jsonp";
		} else if (usingOptions.curatedListID) {
			url += site+"/api1/curatedlist/"+usingOptions.curatedListID+"/events.jsonp";
		} else if (usingOptions.countryCode) {
			url += site+"/api1/country/"+usingOptions.countryCode.toUpperCase()+"/events.jsonp";
		} else {			
			url += site+"/api1/events.jsonp";
		}

		var script = document.createElement("script");
		script.type = "text/javascript"; 
		script.src = url+"?callback=OpenACalendarWidgetListEventsCallBackFunction"+OpenACalendarWidgetListEvents.callBackFunctionCount;
		headTag.appendChild(script);
	},
	htmlFromEvent: function(event, maxLength, target) {
		var html = '<div class="OpenACalendarWidgetListEventsEvent">'
		html += '<div class="OpenACalendarWidgetListEventsDate">'+event.start.displaylocal+'</div>';
		html += '<div class="OpenACalendarWidgetListEventsSummary"><a href="'+event.siteurl+'" '+target+'>'+OpenACalendarWidgetListEvents.escapeHTML(event.summaryDisplay)+'</a></div>';
		html += '<div class="OpenACalendarWidgetListEventsDescription">'+OpenACalendarWidgetListEvents.escapeHTMLNewLine(event.description, maxLength)+'</div>';
		html += '<a class="OpenACalendarWidgetListEventsMoreLink" href="'+event.siteurl+'" '+target+'>More Info</a>';
		html += '<div class="OpenACalendarWidgetListEventsClear"></div>';	
		return html+'</div>';
	},			
	escapeHTML: function(str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	},
	escapeHTMLNewLine: function(str, maxLength) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		var out =  div.innerHTML;
		if (out.length > maxLength) {
			out = out.substr(0,maxLength)+" ...";
		}
		return out.replace(/\n/g,'<br>');
	}
};

