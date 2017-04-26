var recNo = 0,
		maxRecords = 0,
		pageNo = 1;
		article = '',
	  pages = 0,
	  beginYear = '',
	  endYear = '';

$(window).on('load', function () {

	$('#navbtn').css('display','none');
	$('#showpage').css('display','none');

	$('#search-button').click(function(event){
		article = $('#searchterm').val(),
	  pages = getPages($('#records').val()),
	  beginYear = $('#startyear').val(),
	  endYear = $('#endyear').val();

		if (pages > 1){
			$('#prevpage').attr('disabled','disabled');
			$('#navbtn').css('display','block');
			$('#showpage').css('display','block');
			$('#pageno').text(pageNo);

		} else {
			$('#navbtn').css('display','none');
			$('#showpage').css('display','none');
		}

		recNo = 0;
		maxRecords = parseInt($('#records').val());			  
	  if (article.length > 0) {
	  	$('#searchresult').empty();
  		showResult(article, pageNo - 1, beginYear, endYear);
	  } else {
	  	event.preventDefault();
	  };
	});

	$('#prevpage').click(function(){
  	pageNo--;
  	$('#pageno').text(pageNo);
  	if ( pageNo === 1 ){
  		$('#prevpage').attr('disabled','disabled');
  	}
  	recNo = (Math.floor((recNo - 1) / 10)) * 10 - 10;
  	$('#searchresult').empty();
  	showResult(article, pageNo - 1, beginYear, endYear);
		$('#nextpage').removeAttr('disabled');
	});

	$('#nextpage').click(function(){
  	pageNo++;
  	$('#pageno').text(pageNo);
  	if ( pageNo === pages ){
  		$('#nextpage').attr('disabled','disabled');
  	}
  	$('#searchresult').empty();
  	showResult(article, pageNo - 1, beginYear, endYear);
		$('#prevpage').removeAttr('disabled');
	});

	$('#clear-results').click(function(){
		$('#searchresult').empty();
		$('#searchterm').val(''),
	  $('#records').val('1'),
	  $('#startyear').val(''),
	  $('#endyear').val('');
		$('#navbtn').css('display','none');
		$('#showpage').css('display','none');		
	});

	$('#startyear').change(function(){
		$('#endyear').attr('min', $('#startyear').val())
	});
	
	$('#endyear').change(function(){
		$('#startyear').attr('max', $('#endyear').val())
	});
});

// Get data from nytimes.com
function showResult(article, page, beginYear, endYear){
	var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
	url += '?api-key=1759bbf8acf24f13a254a004a1d3cbc3';
	url += '&fl=web_url,headline,byline,section_name,pub_date';
	url += '&q=' + article;
	url += '&page=' + page;
	url += beginYear.length === 4 ? '&begin_date=' + beginYear + '0101' : '';
	url += endYear.length === 4 ? '&end_date=' + endYear + '1231' : '';

	$.ajax({
	  url: url,
	  method: 'GET',
	})
	.done(function(result) {
		var articlesData = result.response.docs;
	  for(i = 0 ; i < articlesData.length ; i++){
	  	recNo++;
	  	if ( recNo <= maxRecords){
		  	creatRecordDiv(recNo);
		  	$('#art' + recNo).html(articlesData[i].headline.main);
		  	var byline = articlesData[i].byline ? articlesData[i].byline.original : 'N/A';
		  	$('#byline' + recNo).html(byline);
		  	$('#section' + recNo).html(articlesData[i].section_name);
		  	var date = new Date(articlesData[i].pub_date);
		  	$('#date' + recNo).html(date);
		  	$('#url' + recNo).attr({'href':articlesData[i].web_url , 'target':'_blank'}).html(articlesData[i].web_url);
	  	} else { break; };
	  };
	})
	.fail(function(err) {
	  throw err;
	});	
};

// Calculate number of pages needed for requested records.
function getPages(recQty){
	var pages = Math.ceil(parseInt(recQty) / 10);
	return pages;
};

// Create DIV for each result record
function creatRecordDiv(recNo){
	var $div = $('<div class="article"></div>');
	var $article = $('<p></p>');
	$article.append('<span id="artno' + recNo + '" class="articleno">' + (recNo) + '</span>')
	$article.append('<span id="art' + recNo + '" class="articleheader"></span>')
	var $byline = $('<p class="details"></p>');
	$byline.append('<span id="byline' + recNo + '"></span>');
	var $section = $('<p class="details"></p>').text('Section: ');
	$section.append('<span id="section' + recNo + '"></span>');
	var $date = $('<p class="details"></p>');
	$date.append('<span id="date' + recNo + '"></span>');
	var $url = $('<p></p>');
	$url.append('<a id="url' + recNo + '" class="url"></a>');
	$div.append($article, $byline, $section, $date, $url);
	$('#searchresult').append($div);
};