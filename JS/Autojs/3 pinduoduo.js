//拼多多一键签到
app.startActivity({
    action: "VIEW",
    packageName: "com.xunmeng.pinduoduo",
    className: "com.xunmeng.pinduoduo.ui.activity.HomeActivity"
});
waitForActivity("com.xunmeng.pinduoduo.ui.activity.HomeActivity")
sleep(100)
click("签到领钱", 0);
sleep(4000)
click(550, 428);
sleep(2000)
back();
sleep(500)
back();
sleep(500)
back();
sleep(500)
app.startActivity({
    action: "VIEW",
    packageName: "com.xunmeng.pinduoduo",
    className: "com.xunmeng.pinduoduo.ui.activity.HomeActivity"
});
waitForActivity("com.xunmeng.pinduoduo.ui.activity.HomeActivity")
sleep(100)
click(1000, 2160);
sleep(1000)
click(857, 421);
sleep(2000)
click("领取", 0)
sleep(1000)