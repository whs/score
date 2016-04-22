!(function(){
var fetch_list = function(){
	$.mobile.loading('show', {
		text: 'กำลังโหลด', textVisible:true
	});
	ScoreApp.fetch_list(function(o){
		var target = $("#file").empty();
		$.each(o, function(k, v){
			$('<option>').attr({
				value: v.id,
				disabled: v.uploaded != 4,
			}).appendTo(target).text(v.name);
		});
		target.find("option:first").attr("selected", true);
		target.attr("disabled", false).selectmenu('enable').selectmenu('refresh');
		$.mobile.loading('hide');
	});
};
var load_data = function(i,u,p){
	$.mobile.loading('show', {
		text: 'กำลังโหลด', textVisible:true
	});
	ScoreApp.load_data(i,u,p, function(data, stats){
		$.mobile.loading('hide');
		$("#result h2").text(data['_name']);
		$("#result h4").text(data['_fname']);
		var scoreTable = $("#result tbody").empty();
		$.each(data, function(k,v){
			if(k[0] == "_"){
				return;
			}
			var row = $('<tr></tr>');
			if(v.rank){
				$('<td><a href="#"></a></td>').appendTo(row).find('a').text(k);
				$('<td></td>').appendTo(row).text(v.score);
				var percent=$('<td class="percent"></td>');
				percent.css("background-color", ScoreApp.percentColor(v.percent)).appendTo(row).text(v.percent.toFixed(2));
				$('<td></td>').appendTo(row).text(v.standard.toFixed(2));
				$('<td></td>').appendTo(row).text(v.rank);
			}else{
				$('<td></td>').appendTo(row).text(k);
				$('<td colspan="4"></td>').appendTo(row).text(v.score);
			}
			row.appendTo(scoreTable);
		});
		$.mobile.changePage("#result", {changeHash: false});
	}, function(err){
		$.mobile.loading('hide');
		alert(err);
	});
};
$.mobile.defaultPageTransition = "slide";
$(function(){
	fetch_list();
	$("#login").submit(function(){
		load_data($(this).find("#file").val(), $(this).find("input[name=u]").val(), $(this).find("input[name=p]").val());
		$("#login input[type=submit]").parent().removeClass("ui-btn-active");
		return false;
	});
});
})();