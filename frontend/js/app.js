"use strict";

var $ = require("jquery");
require("jquery-ui/dialog");
require("jquery-ui/button");
require("jquery-ui/effect-clip");
require("./jquery.ui.touch-punch");
var ScoreApp = require("./shared");

var fetch_list = function(){
	ScoreApp.fetch_list(function(o){
		var target = $("#files").empty();
		$.each(o, function(k, v){
			var label = $('<label></label>').text(" "+v.name);
			$('<input>').attr({
				type: "radio",
				name: "file",
				value: v.id,
				disabled: v.uploaded != 4,
				required: true
			}).prependTo(label);
			label.appendTo(target);
		});
		target.find("input:first").attr("checked", true);
	});
};

var load_data = function(i,u,p){
	ScoreApp.load_data(i,u,p, function(data, stats, pass){
		$("#loadscrim").hide();
		$("#login").find("input[type=text],input[type=password]").attr("disabled", false);
		$(".error").hide();
		var dialog = $("#result").clone().attr("id", null).removeClass("hide");
		dialog.find(".name").text(data['_name']);
		dialog.find(".filename").text(data['_fname']);
		var scoreTable = dialog.find("table:first tbody");
		var graphdata=[], graphsubjects=[];
		$.each(data, function(k,v){
			if(k.charAt(0) == "_"){
				return;
			}
			var row = $('<tr></tr>');
			if(v.rank){
				$('<td><a class="viewstat" href="#"></a></td>').appendTo(row).find('a').text(k);
				$('<td></td>').appendTo(row).text(v.score);
				var percent=$('<td class="percent"></td>');
				percent.appendTo(row).text(v.percent.toFixed(2));
				if(v.percent == 100){
					percent.css({
						"background": "url("+require('./nyancat.txt')+") no-repeat #0f397c",
						"background-position": "-2px -2px"
					});
				}else{
					percent.css("background-color", ScoreApp.percentColor(v.percent));
				}
				$('<td></td>').appendTo(row).text(v.standard.toFixed(2));
				$('<td></td>').appendTo(row).text(v.rank);

				if(stats[k]){
					stats[k].histogram[v.score] = {
						y: stats[k].histogram[v.score],
						color: ScoreApp.percentColor(v.percent)
					};
				}

				graphdata.push({name: k, color: ScoreApp.percentColor(v.percent), y: v.percent});
				graphsubjects.push(k.replace(/\([0-9]+\)$/, ''));
			}else{
				$('<td></td>').appendTo(row).text(k);
				$('<td colspan="4"></td>').appendTo(row).text(v.score);
			}
			row.appendTo(scoreTable);
		});
		if(u !== undefined){
			window.location.hash = i+"/u"+u+"_"+pass;
		}
		dialog.appendTo("body").dialog({
			width: 500,
			height: 600,
			title: data['_fname'],
			show: {
				effect: "clip",
				duration: 500
			}
		}).data("stats", stats);
		// new Highcharts.Chart({
		// 	chart: {
		// 		renderTo: dialog.find(".graph").get(0),
		// 		type: "column",
		// 		height: 200,
		// 		animation: {
		// 			duration: 1000,
		// 			easing: "swing"
		// 		}
		// 	},
		// 	title: {"text": null},
		// 	series: [{"data": graphdata, "name": "ร้อยละ"}],
		// 	xAxis: {"categories": graphsubjects},
		// 	yAxis: {"title": {text: null}, max:100, min: 0},
		// 	legend: {enabled: false},
		// 	credits:{enabled:false},
		// 	exporting:{enabled:false}
		// });
	}, function(err){
		$("#loadscrim").hide();
		$("#login").find("input[type=text],input[type=password]").attr("disabled", false);
		$(".error").text(err).slideDown();
	});
}

$(function(){
	fetch_list();
	$("#light").hide();
	$("#login").submit(function(){
		var file = $(this).find("input[name=file]:checked");
		load_data(file.val(), $(this).find("input[name=u]").val(), $(this).find("input[name=p]").val());
		return false;
	});
	$("input[type=submit]").button();
	if(window.location.hash.length > 1){
		load_data(window.location.hash.substr(1));
	}
	$("body").delegate(".viewstat", "click", function(){
		var dialog = $(this).closest(".result");
		dialog.find(".active").removeClass("active");
		dialog.find(".graph").empty();
		var subj = $(this).addClass("active").text();
		var stat = dialog.data("stats")[subj];
		dialog.find(".subjinfo").text(subj);
		var tbody = dialog.find(".stats").hide().find("tbody").empty();
		var scoreTr = $('<tr></tr>').appendTo(tbody);
		$('<td></td>').text('คะแนน').appendTo(scoreTr);
		$('<td></td>').text(stat.hiscore).appendTo(scoreTr);
		$('<td></td>').text(stat.lowscore).appendTo(scoreTr);
		$('<td></td>').text(stat.lowscore2).appendTo(scoreTr);
		$('<td></td>').text(stat.mode).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.average.toFixed(4)).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.sd.toFixed(4)).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.count).appendTo(scoreTr);
		var personTr = $('<tr></tr>').appendTo(tbody);
		$('<td></td>').text('จำนวน (คน)').appendTo(personTr);
		$('<td></td>').text(stat.hiscore_cnt).appendTo(personTr);
		$('<td></td>').text(stat.lowscore_cnt).appendTo(personTr);
		$('<td></td>').text(stat.lowscore2_cnt).appendTo(personTr);
		$('<td></td>').text(stat.mode_cnt).appendTo(personTr);

		// new Highcharts.Chart({
		// 	chart: {
		// 		renderTo: dialog.find(".graph").get(0),
		// 		type: "column",
		// 		height: 200
		// 	},
		// 	title: {"text": "Histogram"},
		// 	series: [{"data": stat.histogram, "name": "จำนวน"}],
		// 	yAxis: {"title": {text: null}},
		// 	legend: {enabled: false},
		// 	plotOptions: {
		// 		column: {
		// 			shadow: false,
		// 			pointPadding: 0,
		// 			groupPadding: 0,
		// 			borderWidth:.5,
		// 			borderColor:'#666',
		// 			color: 'rgba(204,204,204,.85)'
		// 		}
		// 	},
		// 	credits:{enabled:false},
		// 	exporting:{enabled:false}
		// });

		dialog.find(".stats").show();
		return false;
	});
});
