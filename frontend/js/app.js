"use strict";

var $ = require("jquery");
require("jquery-ui/dialog");
require("jquery-ui/button");
require("jquery-ui/effect-clip");
require("./jquery.ui.touch-punch");
var ScoreApp = require("./shared");
var Chart = require("./chart.js");

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
	$("#loadscrim").show();
	$("#login").find("input[type=text],input[type=password]").attr("disabled", true);

	ScoreApp.load_data(i,u,p, function(data, stats, pass){
		$("#loadscrim").hide();
		$("#login").find("input[type=text],input[type=password]").attr("disabled", false);
		$(".error").hide();
		var dialog = $("#result").clone().attr("id", null).removeClass("hide");
		dialog.find(".name").text(data['_name']);
		dialog.find(".filename").text(data['_fname']);
		dialog.find(".imgshare").attr(
			'href', 'scoreshare/?f='
			+ encodeURIComponent(ScoreApp.get_url(i, u, p))
		);
		var scoreTable = dialog.find("table:first tbody");
		var graphdata=[], graphsubjects=[], graphcolor=[];
		$.each(data, function(k,v){
			if(k.charAt(0) == "_"){
				return;
			}
			var row = $('<tr></tr>');
			if(v.rank){
				var color = ScoreApp.percentColor(v.percent);

				$('<td><a class="viewstat" href="#"></a></td>').appendTo(row).find('a').text(k);
				$('<td></td>').appendTo(row).text(v.score);
				var percent=$('<td class="percent"></td>');
				percent.appendTo(row).text(v.percent.toFixed(2));
				percent.css("background-color", color);

				if(v.percent == 100){
					percent.addClass("fullscore");
				}

				$('<td></td>').appendTo(row).text(v.standard.toFixed(2));
				$('<td></td>').appendTo(row).text(v.rank);

				if(stats[k]){
					stats[k].my_score = v.score;
				}

				graphdata.push(v.percent);
				graphcolor.push(color);
				graphsubjects.push(k.replace(/\([0-9]+\)$/, ''));
			}else{
				$('<td></td>').appendTo(row).text(k);
				$('<td colspan="4"></td>').appendTo(row).text(v.score);
			}
			row.appendTo(scoreTable);
		});
		if(u !== undefined){
			window.location.hash = i+"/u"+u+"_"+ScoreApp.get_password(i,u,p);
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

		var canvas = dialog.find(".graph canvas");
		var chart = new Chart(canvas.get(0), {
			type: "bar",
			data: {
				labels: graphsubjects,
				datasets: [
					{
						data: graphdata,
						backgroundColor: graphcolor,
					}
				]
			},

			options: {
				maintainAspectRatio: false,
				legend: {display: false},
				scales: {
					yAxes: [{
						ticks: {
							suggestedMin: 0,
							suggestedMax: 100,
						},
					}]
				}
			},
		});
		canvas.data('chart', chart);
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

		var graphcolor = [];
		var labels = [];

		for(var i = 0; i < stat.histogram.length; i++){
			labels.push(i);
			if(i === stat.my_score){
				graphcolor.push(ScoreApp.percentColor((i/stat.max)*100));
			}else{
				graphcolor.push('#cccccc');
			}
		}

		var canvas = dialog.find(".graph canvas");
		canvas.data('chart').destroy();
		var chart = new Chart(canvas.get(0), {
			type: "bar",
			data: {
				labels: labels,
				datasets: [
					{
						label: 'จำนวนคน',
						data: stat.histogram,
						backgroundColor: graphcolor,
						borderWidth: 1,
						borderColor: '#666'
					}
				]
			},

			options: {
				maintainAspectRatio: false,
				legend: {display: false},
				title: {display: true, text: "Histogram"},
				scales: {
					xAxes: [{
						gridLines: {display: false},
						ticks: {autoSkip: true, maxTicksLimit: 11},
						barPercentage: 1.0,
						categoryPercentage: 1.0,
					}],
					yAxes: [{
						min: 0,
					}]
				},
			},
		});
		canvas.data("chart", chart);

		dialog.find(".stats").show();
		return false;
	});
});
