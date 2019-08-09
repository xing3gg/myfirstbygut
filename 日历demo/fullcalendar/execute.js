var currentDate="";
var editData="";
var powerunit;
$(function(){
	powerunit=$('#powerunit',window.parent.document).text();
	 $('#calendar').fullCalendar({
         header:{left: 'prev,today,next,selectResult',  
             center: 'title',  
             right: 'selectDate,month,basicWeek,basicDay'  
         },
         defaultView:'month',
         height:$(window).height()-50,
         contentHeight:$(window).height()-100,
         firstDay:1,//设置一周中显示的第一天是哪天，周日是0，周一是1，类推
         isRTL:false,//设置为ture时则日历从右往左显示
         monthNames : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], //月份自定义命名
         monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], //月份缩略命名（英语比较实用：全称January可设置缩略为Jan）
         dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],       //同理monthNames
         dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],  //同理monthNamesShort
         weekNumberTitle : "周",         //周的国际化,默认为"W"
         timeFormat: 'HH:mm',//定义显示的时间格式
         weekMode:"liquid",
         fixedWeekCount :false,/*确定月视图中显示的周数。*/
         eventLimit: true,
         //点击空白处，添加信息
         dayClick: function(date, allDay, jsEvent, view) {
             var selDate =date.format('YYYY-MM-DD');//点击的当前日期格式
             var SysExecute={starttime:selDate,powerunit:powerunit};
             currentDate=selDate;
             //查询当天的工作安排
             $.ajax({
            	 type: "post",
                 url:"selectExecuteByDate.do",
                 data: JSON.stringify(SysExecute),
                 contentType : "application/json;charset=UTF-8",
                 success: function(result) {
                	 //判断查询的结果是否为空，如果为空弹出新建工作任务窗口，否则弹出当天所有任务的列表
                	if(JSON.stringify(result)!="[]"){
                		$("#eventList").html("");
                		$("#listModal .modal-title").text(selDate+"布控安排");
                		//遍历结果
                		$.each(result,function(index,r){
                            $("#eventList").append("<tr class='event' onclick=lookDetail('"+r.executeid+"')><td><p>"+r.starttime+"</p><p>"+r.executetime+"</p></td><td>"+r.executename+"</td></tr>")
                        });
                		 $('#listModal').modal('show');
                		 
                	 }else{
                			// layer.open({
                			// 	skin: 'layer-ext-alertskin',
                			// 	  title:"系统提示",
                			// 	  content:"当前无布控安排!",
                			// });
                	 }
                	 
                 }
             });
         },
         //点击某一任务
         eventClick: function(calEvent, jsEvent, view) {
        
        	//清除时间控件绑定
        	 $("#starttimeRange").empty();
             $("#starttimeRange").append('<input type="text" id="showExecutestarttime" readonly="readonly">');
        	//确保页面中在查看状态下为不可编辑状态
        	$("#UpdateBtu").css("display","block");
        	$("#saveUpdateBtu").css("display","none");
        	$("#showExecutename").attr("readonly","readonly"); 
        	$("#showExecuteunit").attr("readonly","readonly"); 
        	$("#showExecuteredperson").attr("readonly","readonly"); 
        	$("#showExecutetime").attr("readonly","readonly"); 
        	$("#showExecutemethod").attr("readonly","readonly"); 
        	$("#showExecutereason").attr("readonly","readonly"); 
        	$("#showIdcard").attr("readonly","readonly"); 
        	$("#showExecutedetial").attr("readonly","readonly");
           	var SysExecute={executeid:calEvent.id,powerunit:powerunit}
        	//显示任务详情页面
        	$('#showEventModal').modal('show');
        	//查询该任务内容
        		$.ajax({
        	   	    type: "post",
        	        url:"selectExecuteByDate.do",
        	        data: JSON.stringify(SysExecute),
        	        contentType : "application/json;charset=UTF-8",
        	        success: function(result) {
        	        	$("#showExecuteid").val(result[0].executeid);
        	       	    $("#showExecutename").val(result[0].executename);
        	       	    $("#showExecutestarttime").val(result[0].starttime);
        	       	    editData=result[0].starttime.substr(0,10);
        	       	    $("#showExecutetime").val(result[0].executetime);
        	       	    $("#showExecutemethod").val(result[0].executemethod);
        	       	    $("#showPhone").val(result[0].phonenum);
        	       	    $("#showMac").val(result[0].macaddress);
        	        	$("#showFsx").val(result[0].fsznum);
        	        	$("#showCarnum").val(result[0].carnum);
        	        	$("#showLinkman").val(result[0].linkman);
        	       	    $("#showExecutereason").val(result[0].executereason);
        	       	    $("#showIdcard").val(result[0].idcard);
        	       	    $("#showExecutedetial").text(result[0].executedetial);
        	       	    $("#showExecuteunit").val(result[0].executeunit);
        	       	    
        	       	    
        	        }
        	    });
         },
   
         //加载日历数据
         events: function(start,end,timezone, callback) {
        	 //var process=layer.load();
             $.ajax({
                 url:"selectallExecute.do",
                 data:{"powerunit":powerunit},
                 success: function(result) { 
                	 var events = [];
                	 $.each(result,function(index,r){
                		 events.push({
                             title :  r.executename,
                             id :r.executeid,
                             start :r.starttime,
                             end :r.starttime,
                            
                         });
                		
                     });
                     callback(events);
                     //layer.close(process);
                 }
             });
             
         },
	 });
	 //日期下拉框
	 $("#fc-dateSelect").delegate("select","change",function(){
	        var fcsYear = $("#fcs_date_year").val();
	        var fcsMonth = parseInt($("#fcs_date_month").val()) + 1;
	        var str=fcsYear+"-"+fcsMonth;
	        var date=$.fullCalendar.moment(str);
	        $("#calendar").fullCalendar('gotoDate', date);
	 });
	
	
	 
})

//点击查看某一任务详情
function lookDetail(eventid){
	
	//确保页面中在查看状态下为不可编辑状态
	$("#UpdateBtu").css("display","block");
	$("#saveUpdateBtu").css("display","none");
	$("#showExecutename").attr("readonly","readonly");
	$("#showEventdescription").attr("readonly","readonly");
	$("#showEventlocation").attr("readonly","readonly");
	//隐藏任务列表
	$('#listModal').modal('hide');
	//显示任务详情页面
	$('#showEventModal').modal('show');
	
	//查询该任务内容
	var Event={eventid:eventid}
	$.ajax({
   	    type: "post",
        url:"selectEventByID.do",
        data: JSON.stringify(Event),
        contentType : "application/json;charset=UTF-8",
        success: function(result) {
        	$("#showEventid").val(result.eventid);
       	    $("#showEventname").val(result.eventname);
       	    $("#showEventstartdate").val(result.startdate);
       	    $("#showEventenddate").val(result.enddate);
       	    $("#showEventdescription").val(result.description);
       	    $("#showEventlocation").val(result.location);
       	    $("#showEventcreator").text(result.creator);
       	    $("#showEventtime").text(result.time);
        }
    });
}

//点击任务列表触发的方法
function lookDetail(executeid){

	//确保页面中在查看状态下为不可编辑状态
	$("#UpdateBtu").css("display","block");
	$("#saveUpdateBtu").css("display","none");
	$("#showEventname").attr("readonly","readonly");
	$("#showEventdescription").attr("readonly","readonly");
	$("#showEventlocation").attr("readonly","readonly");
	
	var Event={eventid:eventid}
	//隐藏任务列表
	$('#listModal').modal('hide');
	//显示任务详情页面
	$('#showEventModal').modal('show');
	//查询该任务内容
		$.ajax({
	   	    type: "post",
	        url:"selectEventByID.do",
	        data: JSON.stringify(Event),
	        contentType : "application/json;charset=UTF-8",
	        success: function(result) {
	        	$("#showEventid").val(result.eventid);
	       	    $("#showEventname").val(result.eventname);
	       	    $("#showEventstartdate").val(result.startdate);
	       	    $("#showEventenddate").val(result.enddate);
	       	    $("#showEventdescription").val(result.description);
	       	    $("#showEventlocation").val(result.location);
	       	    $("#showEventcreator").text(result.creator);
	       	    $("#showEventtime").text(result.time);
	        }
	    });
}

// 日期格式化:2017-11-11
function formatdate(cellvalue) {
	var date=new  Date(cellvalue);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};
//日期，在原有日期基础上，增加days天数，默认增加1天
function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}
// 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}
//切换日历
function changestate(){
if($("#executestate").val()=="1"){
$("#contentIframe",parent.document).attr("src","showexecutefinsh.do");
}
}