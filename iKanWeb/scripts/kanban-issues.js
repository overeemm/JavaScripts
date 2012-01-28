/**
 * 
 */
function KanbanIssues(){

	var currentDataModelVersion = 1;
	
	var issues = (supportsLocalStorage() && localStorage['issues']) 
							? $.evalJSON(localStorage['issues']) 
							: { someday: [], todo: [], inprogress : [], finished: [], maxid : 1, version : currentDataModelVersion };
	
	if(issues.version != currentDataModelVersion)
		alert('localStorage bevat issues in een oude versie ('+issues.version+')!');
							
	var syncToStore = function (){
		if(supportsLocalStorage()) {
			localStorage['issues'] = $.toJSON(issues);
		}
	};					
	
	var findArray = function (columnid){
		return columnid == 'someday' ? issues.someday
			 : columnid == 'todo' ? issues.todo
			 : columnid == 'inprogress' ? issues.inprogress
			 : columnid == 'finished' ? issues.finished
		 	 : [];
	};
	
	var findIssueInArray = function (arr, issueid){
		var index = $.map(arr, function(o, i) { return o.id === issueid ? i : ''; }).join('');
		if(index !=''){
			var intindex = parseInt(index);
			var result = arr[intindex];
			return result;
		}
	};
	
    var findIssue = function (issueid){
		var issue = findIssueInArray(issues.someday, issueid);
		if(!issue) issue = findIssueInArray(issues.todo, issueid);
		if(!issue) issue = findIssueInArray(issues.inprogress, issueid);
		if(!issue) issue = findIssueInArray(issues.finished, issueid);
		return issue;
	};
	
	var pickupIssueFromArray = function (arr, issueid){
		var index = $.map(arr, function(o, i) { return o.id === issueid ? i : ''; }).join('');
		if(index !=''){
			var intindex = parseInt(index);
			var result = arr[intindex];
			arr.splice(intindex, 1);
			return result;
		}
	};
	
    var pickupIssue = function (issueid){
		var issue = pickupIssueFromArray(issues.someday, issueid);
		if(!issue) issue = pickupIssueFromArray(issues.todo, issueid);
		if(!issue) issue = pickupIssueFromArray(issues.inprogress, issueid);
		if(!issue) issue = pickupIssueFromArray(issues.finished, issueid);
		return issue;
	};
	
	this.issueToString = function(issueid) {
		var issue = findIssue(parseInt(issueid));
		return issue.text + ' (id:'+issue.id+', created:'+issue.created+')';
	};
	
	this.getIssues = function () { return issues; };
							
	this.add = function (input) {
		if(!input || input == '' || input.trim() == '')
			return;
		
		issues.someday.push( { text: input, created : new Date(), id : issues.maxid } );
		issues.maxid = issues.maxid + 1;
		syncToStore();
	};
	
	this.update = function (issueid, text) {
		var issue = findIssue(parseInt(issueid));
		issue.text = text;
		syncToStore();
	};
		
	this.move = function (issueid, tocolumnid, index) {
		var issue = pickupIssue(parseInt(issueid));
		var arr = findArray(tocolumnid);
		arr.splice(index, 0, issue);
		syncToStore();
	};
	
	this.clear = function (){
		issues = { someday: [], todo: [], inprogress : [], finished: [], maxid : 1, version : currentDataModelVersion };
		syncToStore();
	};
	
	this.clearFinishedIssues = function (){
		issues.finished = [];
		syncToStore();
	};
	
}

function supportsLocalStorage(){
	try { return 'localStorage' in window && window['localStorage'] !== null; } catch(e) { return false; }
}