ScoreApp = {
	fetch_list: function(cb){
		$.getJSON("data/files.json?cache="+(new Date().getTime()), cb);
	},
	get_password: function(i,u,p){
		return hex_sha1(u+p+i).substr(0, 5);
	},
	load_data: function(i,u,p, success, error){
		var url;
		if(u !== undefined){
			var pass = ScoreApp.get_password(i,u,p);
			$("#loadscrim").show();
			$("#login").find("input[type=text],input[type=password]").attr("disabled", true);
			if(!i.match(/^[0-9a-f]+$/) || !u.match(/^[0-9a-z]+$/i)){
				return false;
			}
			url = "data/"+i+"/u"+u+"_"+pass+".json";
		}else{
			if(!i.match(/^[0-9a-f]+\/u[0-9a-z]+_[0-9a-f]{5}$/)){
				return false;
			}
			url = "data/"+i+".json";
			i = i.match(/^([^\/]+)/)[1];
		}
		$.ajax({
			dataType: "json",
			url: url,
			success: function(data){
				$.getJSON("data/"+i+"/stats.json", function(stats){
					success(data, stats, pass);
				});
			},
			error: function(x){
				var err = "ขณะนี้มีผู้ใช้งานจำนวนมาก หรืออยู่ในระหว่างการปรับปรุงระบบ";
				if(x.status == 404){
					err = "ไม่พบข้อมูล";
				}
				error(err);
			}
		});
	},
	percentColor: function(n){
		if(n < 10){
			return "#5c0009";
		}else if(n < 20){
			return "#a10010";
		}else if(n < 30){
			return "#c80014";
		}else if(n < 40){
			return "#c8314e";
		}else if(n < 50){
			return "#ff7a0c";
		}else if(n < 60){
			return "#ffdf3e";
		}else if(n < 70){
			return "#afff3a";
		}else if(n < 80){
			return "#67c62d";
		}else if(n < 90){
			return "#2dc62a";
		}else{
			return "#186e17";
		}
	}
};