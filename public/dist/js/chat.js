/** xiankefu-v2.1.0 GPL License By https://www.xiankefu.com/ */
 ;layui.define(["chat","socket"],function(t){var a=layui.$,e=layui.chat,i={};i.open=function(){var t=window.location.search,i=new Object;if(t.indexOf("?")!=-1){var c=t.substr(1);strs=c.split("&");for(var s=0;s<strs.length;s++)i[strs[s].split("=")[0]]=decodeURI(strs[s].split("=")[1])}var n=layui.data("xkf_info_data")[i.bid]||{},o=layui.socket(layui.cache.xkf.ws+"?bid="+i.bid+"&cid="+n.cid,{path:"/im/","force new connection":!0,reconnection:!0,autoConnect:!0,transports:layui.device().ie&&layui.device().ie<10?["websocket","polling"]:["websocket"]});o.on("message board",function(){e.layerBusy()}),o.on("connect",function(){o.emit("create chat",{csid:n.csid,cid:n.cid,agent:"customer",new_customer:n.new_customer,has_history:n.has_history}),a(".xkf-chat-area-shadeFull").remove()}),e.on("restart",function(t){o.emit("create chat",{csid:t.csid,cid:t.cid,agent:"customer",new_customer:n.new_customer})}),o.on("create chat",function(t){if("new"==t.action){o.emit("read message",{talk_id:t.talk_id,cid:n.cid,csid:n.csid});var c=a(".xkf-chat-cont").data("times");"one"==c||(a(".xkf-chat-cont").data("times","one"),e.talkid(t))}else layui.data("xkf_talk_id",{key:i.bid,value:t.talk_id})}),o.on("changeName",function(t){t.cid==n.cid&&layui.data("xkf_selfName",{key:i.bid,value:t.nickname})}),e.on("sendMessage",function(t){o.emit("chat message",t.send)}),o.on("get mid",function(t){e.getMessage(t)}),layui.data("xkf_customer",{key:"status",value:0}),layui.data("xkf_customer",{key:"isOpen",value:1}),o.on("read success",function(t){layui.data("xkf_customer",{key:"status",value:0})}),o.on("chat message",function(t){var c=0,s=null,n=function(){var t=document.title.replace("【　　　　　　　　】","").replace("【收到一条新消息！】","");return s=setTimeout(function(){c++,n(),c%2==0?document.title="【收到一条新消息！】"+t:document.title="【　　　　　　　　】"+t},600)},d=function(){clearTimeout(s),document.title=document.title.replace("【　　　　　　　　】","").replace("【收到一条新消息！】","")},u=a(".xkf-chat-client").hasClass("xkf-chat-middle"),r=function(t){o.emit("read message",{talk_id:t.talk_id,cid:t.cid,csid:t.csid})};"hidden"==document.visibilityState?u?(clearTimeout(s),n(),a(document).one("visibilitychange",function(){"visible"==document.visibilityState&&(d(),1!=layui.data("xkf_customer").status&&(layui.data("xkf_customer",{key:"status",value:1}),r(t)))})):1!=layui.data("xkf_customer").status&&(layui.data("xkf_customer",{key:"status",value:1}),a(document).one("visibilitychange",function(){"visible"==document.visibilityState&&1==layui.data("xkf_customer").isOpen&&r(t)})):u?r(t):1==layui.data("xkf_customer").isOpen?r(t):1!=layui.data("xkf_customer").status&&layui.data("xkf_customer",{key:"status",value:1}),layui.data("xkf_news_sound")[i.bid]&&a("#XKF-index-audio").get(0).play(),e.getMessage(t)}),e.on("readMessage",function(t){layui.data("xkf_customer",{key:"isOpen",value:t.is_open}),1==t.is_open&&1==layui.data("xkf_customer").status&&(o.emit("read message",{talk_id:t.talk_id,cid:t.cid,csid:t.csid}),layui.data("xkf_customer",{key:"status",value:0}))}),o.on("read message",function(t){a(".xkf-chat-main-selfRead").addClass("active"),a(".xkf-chat-main-selfRead").html("已读")}),o.on("add blacklist",function(t){e.getBlackList(t),"refresh"==t.type&&a(".xkf-chat-cont").data("type","refresh")}),o.on("remove blacklist",function(t){e.getBlackList(t),"refresh"==a(".xkf-chat-cont").data("type")&&(o.emit("create chat",{csid:layui.data("xkf_info_data")[i.bid].csid,cid:n.cid,agent:"customer",has_history:n.has_history,new_customer:n.new_customer}),a(".xkf-chat-cont").removeData("type"))}),o.on("system chat message",function(t){e.getChatLog(t)}),o.on("chat over",function(t){e.startChat(t),o.emit("offline",{cid:t.cid,csid:t.csid,room_id:t.room_id,agent:"customer",talk_id:t.talk_id})}),o.on("transfer",function(t){o.emit("create chat",{csid:t.to_csid,cid:n.cid,agent:"customer",action:"transfer",new_customer:n.new_customer}),n.csid=t.to_csid;var e={bid:i.bid,cid:n.cid,csid:t.to_csid,key:i.key,data:i.data};a.ajax({url:layui.cache.xkf.api+"customer/init",type:"GET",data:e,dataType:"json",success:function(t){t.data=t.data||{};var e,c={nickname:t.data.nickname,customer_name:t.data.customer_name,csid:t.data.csid,sign:t.data.sign||"",avatar:t.data.avatar,cid:t.data.cid,timestamp:(new Date).getTime(),has_history:t.data.has_history,qq:t.data.qq,weixin:t.data.weixin,ad_info:t.data.ad_info,chat_bg_color:t.data.chat_bg_color,is_show:t.data.is_show,tss_info:t.data.tss_info};e=0==c.length?layui.data("xkf_info_data")[i.bid]:c,layui.data("xkf_info_data",{key:i.bid,value:e}),a(".xkf-chat-cont-sideImg img").attr("src",c.avatar||layui.cache.xkf.root+"images/team_img1.png"),a(".xkf-chat-head-img img").attr("src",c.avatar||layui.cache.xkf.root+"images/team_img1.png"),a("#XKF-chat-cont-tipName").html(c.nickname||"管理员"),a("#XKF-chat-cont-tipDesc").html(c.sign),a(".xkf-chat-cont-sideSign").html(c.ad_info||"")}})}),o.on("question",function(t){e.getMessage(t,!0)}),e.on("question",function(t){o.emit("question",t)}),e.on("level",function(t){o.emit("rate finish",t)}),window.onbeforeunload=function(){o.emit("offline",{csid:n.csid,bid:i.bid,cid:n.cid,agent:"customer"})}},t("im",{event:i})});