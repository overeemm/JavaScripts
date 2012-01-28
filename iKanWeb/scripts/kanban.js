/**
 * 
 */

var isiPadUser = ((navigator.userAgent.match(/iPad/i)));
var kanbanIssues = new KanbanIssues();

$(document).ready(function () {
	
	$('input#new-issue-text').keypress(function(e){
		if(e.which == 13){
			onAddIssue();
		}
	});
	
	$('input#new-issue-btn').click(function (){
		onAddIssue();
	});
	
	$('#clear-issues').click(function (){
		kanbanIssues.clear();
		$('.workflowstep li').remove();
	});
	
	$('.clear-column').click(function (){
		kanbanIssues.clearFinishedIssues();
		fillWorkflowStep(kanbanIssues.getIssues().finished, 'finished');
	});
	
	fillWorkflowStep(kanbanIssues.getIssues().someday, 'someday');
	fillWorkflowStep(kanbanIssues.getIssues().todo, 'todo');
	fillWorkflowStep(kanbanIssues.getIssues().inprogress, 'inprogress');
	fillWorkflowStep(kanbanIssues.getIssues().finished, 'finished');
	
	if(isiPadUser){
		$(".workflowstep li").touch( {
			ontouchend : function () { alert('');}
		} );
	}
	else {
		$(".workflowstep").sortable({ 
			start: function (event, ui) { showStatus(ui.item[0]); },
			stop: function (event, ui) { clearStatus(); },
			connectWith: ".workflowstep",
			remove: function (event, ui) {},
			update: function (event, ui) { 
				var index = $(this).children().index(ui.item[0]);
				if(index > 0);
					kanbanIssues.move(ui.item[0].id, this.id, index); 
				clearStatus();
			}
		}).disableSelection();
	}
});

function clearStatus(){
	$('.status span').text('');
}

function showStatus(issue)
{
	$('.status span').text(kanbanIssues.issueToString(issue.id));
}

function onAddIssue(){
	kanbanIssues.add($('input#new-issue-text').val());
	$('input#new-issue-text').val('');
	
	fillWorkflowStep(kanbanIssues.getIssues().someday, 'someday');
}

function fillWorkflowStep(arr, columnid){
	
	$('#'+columnid+' li').remove();

	$.each(arr, function (index, value){
		$('#'+columnid).append('<li class="issue" id="'+value.id+'">'+value.text+'</li>');
	});
	
	$('#'+columnid+' li').dblclick(function () {
		$(this).html('<input type="text" value="'+this.innerText+'" />');
		var li = this;
		$('input', this).focus().blur(function () {
			kanbanIssues.update(li.id, $(this).val());
			$(li).html($(this).val());
		});
		
	});
}