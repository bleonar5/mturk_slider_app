                var attr = "";

                


                function show_intro(){
                	$("#instructions").css("display", "none");
                	$("#intro").css("display", "block");
                }

                function check_answer(e){
                	var message = ["This arrangement doesn't a lot of sense. 'Enormous', 'tremendous', 'massive', and 'vast' have been erroneously placed on the 'smaller' end of the scale, while 'tiny' and 'minute' are placed to the far-right, on the 'larger' end of the scale.  Try another choice.","This is the right choice! The relative positioning of these adjectives makes sense, with the 'smaller' adjectives are arranged in several groups on the left and the 'larger' adjectives arranged in several groups on the right. Click 'Continue' below to move on","This is not the best choice. Although the adjectives are all mostly on the correct sides of the scale, none of them are grouped together. A better choice would be the second option, where groups of adjectives with similar intensities are grouped together."];
                	
                	var selected = e.target.id;

                	
                	var color = (parseInt(selected) == 2) ? "green" : "red";
                	$('#' + selected).css("border","3px solid " + color);
                	$('#text' + selected).text(message[parseInt(selected) - 1]);

                	if(selected == '2'){
                		$('#check').css("display","inline");
                		$('#check').css("text-align","center");
                	}

                	//$('#more_intro').css("display","none");
                	//$('#experiment').css("display","block");
                }

                function check_arrangement(){
                	//var freezing = circleData[0].val, cold = circleData[1].val, warm = circleData[2].val, hot = circleData[3].val;
                	console.log(circleData[0]);
                	less_cheerful = [circleData[0],circleData[5],circleData[6]];
                	more_cheerful = [circleData[1],circleData[2],circleData[3],circleData[4],circleData[7],circleData[8],circleData[9]];

                	console.log(less_cheerful);

                	for(x= 0; x< less_cheerful.length;x++){
                		//console.log(adj.adj);

                		for(y=0;y< more_cheerful.length;y++){
                			//console.log(e.val + ' ' + good_adj.val);
                			if (less_cheerful[x].val >= more_cheerful[y].val){
                				//console.log('y');
                				$('#wrongOrder').text("This does not seem like an intuitive arrangement. Make sure all the 'less cheerful' adjectives are placed to the left of all the 'more cheerful' ones. HINT: '" + less_cheerful[x].adj + "' should be to the left of '" + more_cheerful[y].adj + "'.");
                				return;
                			}
                		}
                	}
               		$(addAdjID).css("display","");
               		$('#test_remove_adjective').css('display','');
               		circleData.splice(18,2);
              		circleData.push({"adj":"gigantic","val":15});
               		var slider = d3.select("#test");
               		slider.selectAll("circle").remove();
               		slider.selectAll("text.key").remove();
               		d3.select("#test_remove_adjective").selectAll("option").remove();
               		init();

               		$('#wrongOrder').text("Good! You organized the adjectives from least cheerful to most cheerful. Now let's try out adding and removing adjectives. Add 'chipper' to the slider and remove 'gigantic'");

               		$("#checkArrangement").attr("onclick", "check_add()");
               		$("#checkArrangement").text("Check Arrangement");
                }

                function check_add() {
                	var has_unhappy = false, has_lukewarm =false;
                	for(i = 0; i < circleData.length; i++){
                		if(circleData[i].adj == "gigantic"){
                			console.log("has_unhappy ==  true");
                			has_unhappy = true;
                		}
                		if(circleData[i].adj.toLowerCase() == "chipper"){
                			console.log("has_lukewarm == true");
                			has_lukewarm = true;
                		}
                	}
                	if(has_unhappy){
                		$('#wrongOrder').text("You haven't removed 'gigantic' from the slider! Select 'gigantic' from the drop-down menu and click 'REMOVE ADJECTIVE'.");
                	}
                	else{
                		if(has_lukewarm){
                			$('#wrongOrder').text("Nice work! Now click 'Continue' to move on to the experiment");
                			$("#checkArrangement").attr("onclick","show_experiment()");
                			$("#checkArrangement").text("Continue on to Experiment");
                		}
                		else{
                			$('#wrongOrder').text("You still need to add 'chipper' to the slider! Do this by typing in 'chipper' where it says 'Your new adjective...' and then either press enter or click 'ADD ADJECTIVE'.")
                		}
                	}

                }

                function show_test(){
                	$('#more_intro').css('display',"none");
                	$("#test").css("display", "block");
                	attr="cheerfulness_1:07:00::";
                	adj_grab();
                }

                function show_experiment(){
                	$('#test').css("display","none");
                	sliderID = "#slider";
					keyID = "#key";
					addFieldID = "#add_field";
					addAdjID = "#add_adj";
					addButtonID = "#add_button";
					adjsID = "#adjs";
					errorID = "#error";
					attrID = "#attr";
					attr_defID = "#attr_def";

					if(!$.urlParam('attr'))
		                attr = 'temperature';
		            else
		                attr = $.urlParam('attr');

					adj_grab();

					

					circleData = experimentData;

					//init();

                	$('#experiment').css("display","block");
                	$('#attr_answer').attr('value',attr);

                }

                function show_moreIntro(){
                	$('#intro').css("display","none");
                	$('html,body').scrollTop(0);
                	$('#more_intro').css("display","block");
                }


                //taken from https://www.sitepoint.com/url-parameters-jquery/
                $.urlParam = function(name){
				    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
				    if (results==null){
				       return null;
				    }
				    else{
				       return results[1] || 0;
				    }
				}

                //gets circleData from server
                function adj_grab(){
                    $.ajax({
                        url: "adjs/" + attr,
                        type: "GET",
                        dataType: "JSON",
                        success: function(data) {
                            experimentData = data;
                            circleData = data;
                            //console.log(data);
                            //show_experiment();
                            attr_def = data[0].attrdef;

                            d3.select(sliderID)
                            	.selectAll("text.attr")
                            	.data(['less','more'])
                            	.enter()
                            	.append("text")
                            	.each(function(d,i){
                            		d3.select(this)
                            			.attr("x",  600 * i + (25 * i))
                            			.attr("y", "75%")
                            			.attr("textLength",75)
                            			.attr("font-size",20)
                            			.attr("class","attr")
                            			.text(d);
                            	});
                            

                            //var randomColor = "";

                            /*for(i=0;i<data.length + 20;i++){
                            	colors.push("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
                            }*/
                            //show_experiment();
                            init();
                        }
                    });

                }



                //sends new json values back to server
                //don't currently call this, sends to mturk instead
                function send_json(succ){
                    $.ajax({
                        url: "adjs/" + attr,
                        type: "POST",
                        dataType: "JSON",
                        data: { circleData : circleData },
                        success: function(data) {
                        	console.log("yes baby");
                        }
                    });
                }

				//array of JSONs of adjective-value pairs
				circleData = [{"adj":"awful","value":1},{"adj":"bad","value":3},{"adj":"decent","value":5},{"adj":"good","value":6},{"adj":"great","value":8}];

				var sliderID = "#testSlider";
				var keyID = "#testKey";
				var addFieldID = "#test_add_field";
				var addAdjID = "#test_add_adj";
				var addButtonID = "#test_add_button";
				var adjsID = "#test_adjs";
				var errorID = "#test_error";
				var attrID = "#test_attr";
				var attr_defID = "#test_attr_def";


                attrs = ['shorter-taller','worse-better','smaller-bigger'];


                experimentData = [];

                attr_def = ""


				//set of possible colors
				//colors = ["blue","red","yellow","green","orange","purple","pink","maroon","magenta","gray"];

				colors = ["FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000", 
        "800000", "008000", "000080", "808000", "800080", "008080", "808080", 
        "C00000", "00C000", "0000C0", "C0C000", "C000C0", "00C0C0", "C0C0C0", 
        "400000", "004000", "000040", "404000", "400040", "004040", "404040", 
        "FF8080", "0066CC", "CCCCFF", "99CC00", "FFCC00", "339966", "003300", 
        "993300", "003366", "666699", "993366", "600060", "006060", "606060", 
        "A00000", "00A000", "0000A0", "A0A000", "A000A0", "00A0A0", "FFFF99", 
        "E00000", "00E000", "0000E0", "E0E000", "E000E0", "00E0E0", "EDD0E0","808DD0", "8D008D", "0D80D0", "8DDD80", 
        "C00A00", "00C0E0", "0000C0", "C0EA00", "C000CA", "0BC0C0", "C0CBD0", 
        "400DE0", "004AE0", "0B0C40", "404CCC", "4DDD40", "BB4040", "4C4C40", 
        "FF8A80", "0A66CC", "CCCDFF", "99CCB0", "FFCCD0",];

        		


				//rounds number to nearest multiple of 5, to represent discrete slider values
				function round(x) {
					if(Math.ceil(x/25) * 25 - x > 12)
						return Math.floor(x/25) * 25;
					else
						return Math.ceil(x/25) * 25;
				}

				//changes message below add adjective button
				function change_message(str){
					$(addFieldID).val('');
					d3.select(errorID).text(str);

				}

				//Checks to see if submitted adjective is valid and unique, then updates json array and reloads svg
				function add_adj() {
					var input = d3.select(addFieldID);
					var adj = input.node().value;
					
					//assumes there are no valid multi-word or length < 2 adjectives
					if(adj.length > 2 & adj.split(" ").length == 1){
						//checks if adjective already on slider
						for(i=0;i<circleData.length;i++){
							if(circleData[i].adj.toLowerCase() == adj.toLowerCase()){
								change_message("cannot include " + adj + " twice");
								return;
							}

						}

						//remove any error message
						change_message("");

						//add new adjective to JSON array
						circleData.push({"adj":adj,"val":0, "attr":attr});

						//removes svg elements
						d3.selectAll("circle").remove();
						d3.selectAll("rect").remove();
						d3.selectAll("text.key").remove();

						update_form();
						//reloads svg elements
						init();
					}
					//displays message if input adjective invalid
					else
						change_message("adjective must be one word and at least three letters long");

					
				}

				function update_form(){
					if(adjsID == "#test_adjs")
						return;

					d3.select("#mturk_form")
						.selectAll("input.answer")
						.remove();

					d3.select("#mturk_form").selectAll("input.answer")
						.data(circleData)
						.enter()
						.append("input")
						.attr("type","hidden")
						.attr("class","answer")
						.attr("name",function(d){
							return d.adjid;
						})
						.attr("value",function(d){
							return d.val;
						});


				}


				//removes selected element from slider and reloads
				function remove_adj(){

					var adj = d3.select(adjsID).node().value;

					//finds relevant node
					for(i = 0;i < circleData.length; i++){
						if(circleData[i].adj == adj){
							//removes adjective-value pair from list
							circleData.splice(i,1);

							//removes svg elements
							d3.selectAll("circle").remove();
							d3.selectAll("rect").remove();
							d3.selectAll("text.key").remove();
							d3.selectAll("option").remove();

							update_form();

							//reloads
							init();
							return;
						}
					}
				}

				function embolden(e) {
					var id = e.target.id;
					d3.select(keyID).select("#text"+id).attr("class","highlighted");
					//$("#text" + id).css('color','#8954j9');

				}

				function unembolden(e){
					var id = e.target.id;
					d3.select(keyID).select("#text"+id).attr("class","");
				}

				function dragmove(d) {
					var temp = 0, id = 0;
					//updates location of circle
					var circle = d3.select(this)
						.attr("cx", temp = round(Math.min(600,Math.max(d3.event.x, 100))));

					id = circle.attr('id');

					//updates JSON array
					circleData[id].val = (temp - 100) / 25;

					//stacks circles if necessary
					d3.select(sliderID).selectAll("circle").each(function(d,i){
						var stack = 0;

						for(j = 0;j<i;j++){
							if(circleData[j].val == circleData[i].val)
								stack++;
						}

						var offset = 10;

						//if(stack >= 8)
							//offset = 4;

						//stacks circle
						var circ = d3.select(this).attr("cy",Math.max(3,parseInt(75 - offset * stack)) + "%");
						//updates tooltip
						circ.select("title").text( function(d) {
							return d.adj + " = " + circleData[i].val;});
					});
					update_form();
				};

				//drag behavior
				var drag = d3.behavior.drag()
					.on("drag",dragmove);

				//called on load and after adjectives are added or removed
				function init() {
					update_form();



					

                    d3.select(attrID).text(attr.split('_')[0].toUpperCase());
                    d3.select(attr_defID).text(attr_def);

					var selectDiv = d3.select(sliderID);


					var temp = 0;

					var selectCircles = selectDiv.selectAll("circle")
						.data(circleData)
						.enter()
						.append("circle")
						//places circle according to json value
						.attr("cx", function(d){return temp = (parseInt(d.val) * 25) + 100})
						.attr("r","2%")
						.style("stroke-width","1%")
						.attr("class","draggable")
						.style("cursor","all-scroll")
						.attr('onmouseover', 'embolden(event)')
						.attr('onmouseout', 'unembolden(event)')
						.call(drag)
						.each(function(d,i){
							//stacks circles if necessary
							d3.select(this)
								.attr("id",i)
								.style("fill",colors[i])
								.style("stroke",colors[i])
								.style("fill-opacity",0.8);

							var stack = 0;

							for(j = 0;j<i;j++){
								if(circleData[j].val == circleData[i].val)
									stack++;
							}

							var offset = 10;

							//if(stack >= 8)
								//offset = 4;

							d3.select(this).attr("cy",Math.max(3,parseInt(75 - offset * stack)) + "%");
						})
						//adds tooltip
						.append("svg:title")
						.text(function(d) {
							if(d.def != undefined)
								return d.adj + " = " + d.val + '\n' + d.def;
							else
								return d.adj + " = " + d.val;
						});
							
					var selectKey = d3.select(keyID);

					var num_cols = Math.floor(circleData.length / 5);

					selectKey.attr("height", 30 + 30 * num_cols);

					var num_rows = 5;

					//var radius_size = (700 / num_rows)  * 0.075;
					var radius_size = 15;

					selectKey.selectAll("circle").remove();
					selectKey.selectAll("rect").remove();
					selectKey.selectAll("text").remove();
					selectKey.selectAll("option").remove();


					//adds rectangles for color key
					selectKey.selectAll("circle")
						.data(circleData)
						.enter()
						.append("circle")
						.attr("r", radius_size - 4)
						.each(function(d,i){
							var column = Math.floor(i / 5);
							var mod = i % 5;
							d3.select(this)
								.attr("cx", 15 + 140 * mod)
								.attr("cy",15 + 30 * column)
								.style("fill",colors[i])
                                .style("fill-opacity",0.6)
                                .style("stroke-width",4)
								.style("stroke",colors[i]);
						});

					//adds text for color key
					selectKey.selectAll("text")
						.data(circleData)
						.enter()
						.append("text")
						.attr("class","key")
						.style('color','red')
						.text(function(d) { return "= " + d.adj;})
						//adjusts font-size according to number of adjs and length of adj, caps at 33.33
						.attr('textLength', function(d){
							return 105;
						})
						.attr("font-size",16)
						.each(function(d,i){
							var column = Math.floor(i / 5);
							var mod = i % 5;
							d3.select(this)
								.attr("x",35 + 140 * mod)
								.attr("y", 17 + 30 * column)
								.attr("id",'text'+i);
						});

					//fills options for adjective
					d3.select(adjsID).selectAll("option")
						.data(circleData)
						.enter()
						.append("option")
						.each(function(d,i){
							d3.select(this)
								.attr("value", circleData[i].adj)
								.text(circleData[i].adj);
						})

				};
				
				


