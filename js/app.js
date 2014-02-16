$(document).ready(function(){


	$("#search, .refreshButton").click(function(){			// whenever search button or refresh is clicked send ajax call to socialmention server
		
		var query = $("#query").val();
		var searchType = "all";
		var socialUrl = "http://socialmention.com/search";
		var sources = ["twitter","facebook","youtube"];

		$('.searchText').html(query);

		jQuery.ajax({
			type: "GET",
			url: socialUrl,
			data: {
				"q": query,
				"f": "json",
				"t": searchType,
				"src": sources
			},
			dataType: 'jsonp'
		}).done(function(response){
			$('.searchResults').show();
			postFormat(response);
		}).fail(function(){
			alert("Connection problems");
		});
	});


	$("#search").click(function(){		// whenever search button clicked, send ajax call to duckduckgo servers 

		var defUrl = "http://api.duckduckgo.com";
		var query = $("#query").val();

		jQuery.ajax({
			type: "GET",
			url: defUrl,
			data: {
				"q": query,
				"format": "json"
			},
			dataType: 'jsonp'
		}).done(function(response){
			defFormat(response);
		}).fail(function(){
			alert("Connection problems");
		});
	})

	var defFormat =  function(response)	// format defined for duck duck go responses
	{
		if ( response.Definition )
		{
			var infoText = response.Definition;
			var infoURL = response.DefinitionURL;
			var infoSource = response.DefinitionSource;
		}
		else if ( response.AbstractText )
		{
			var infoText = response.AbstractText;
			var infoURL = response.AbstractURL;
			var infoSource = response.AbstractSource;
		}
		else if ( response.Answer )
		{
			var infoText = response.Answer;
			var infoURL = "duckduckgo.com";
			var infoSource = "DuckDuckGo";
		}

		$(".about").html(infoText);
		$(".source").html("<a href='"+infoURL+"'> Read More at "+infoSource+"</a>");
	}

	var postFormat = function(response)	// function defining the format of the post
	{
		var count = response.count;
		var result = response.items;

		if ( count > 20 )
		{
			count = 20;
		}

		for ( var i = count - 1  ; i >= 0 ; i-- )
		{

			var d = new Date();
			d.setTime(result[i].timestamp*1000);
			result[i].timestamp = d.toUTCString();  // converting timestamp into correct format

			if ( result[i].source == "twitter" )	// If data is from twitter, the tweet data need to be in the description, not title
			{
				result[i].description = result[i].title;
				result[i].title = "Latest Tweet";
			}
			else if ( result[i].type == "images" ) // if data is an image, display it in the description 
			{
				result[i].description = "<img src='"+result[i].image+"'/>";
			}

			var myString = '\
				<div class="post">'
						+'<div class="panel panel-default">'
							+'<div class="panel-heading">'
								+'<div class="panel-title">'
									+'<div class="userName author">'
										+'<a href=" '+result[i].user_link+'  "><h4>'+result[i].user+'</h4></a>'
									+'</div>'
									+'<div class="postTitle">'
										+'<a href="'+result[i].link+'"</a>'
											+'<img class="source" alt="'+result[i].source+'" src="'+result[i].favicon+'"/>'
											+'   '+result[i].title
										+'</a>'	
										+'<span class=" pull-right text-muted"><small><abbr class="time" title="'+result[i].timestamp+'"></abbr></small></span>'
									+'</div>'
								+'</div>'
							+'</div>'
							+'<div class="panel-body">'
								+'<blockquote>'
									+'<p>'
										+result[i].description
									+'</p>'
								+'</blockquote>'
							+'</div>'
						
							+'<div class="panel-footer">'
								+'<div class="row">'
									+'<div class="linkedInShare col-xs-3">'
										+'<div class="btn btn-default"><a href="http://www.linkedin.com/shareArticle?mini=true&url='+result[i].link+'" target="_blank">LinkedIn</a></div>'
									+'</div>'
									+'<div class="fbShare col-xs-3">'
										+'<div class="btn btn-default"><a href="http://www.facebook.com/sharer.php?u='+result[i].link+'" target="_blank">Facebook</a></div>'
									+'</div>'
									+'<div class="twitterShare col-xs-3">'
										+'<div class="btn btn-default"><a href="http://twitter.com/share?url='+result[i].link+'" target="_blank">Tweet</a></div>'
									+'</div>'
									+'<div class="g+Share col-xs-3">'
										+'<div class="btn btn-default"><a href="https://plus.google.com/share?url='+result[i].link+'" target="_blank">G+</a></div>'											
									+'</div>'
								+'</div>'
							+'</div>'
					+'</div>'
				+'</div>';

			$("#social").prepend(myString);	
			
		}

		$(".time").timeago();	// to update timestamp


	};
});