launchApp("一键签到") //百度贴吧一键签到
waitForActivity("com.chris.activity.MainFragmentActivity")
sleep(300)
click("一键签到", 0)
sleep(400)
click(784, 1080)
sleep(400)
click("极速签到")
sleep(1500)
home()
launchApp("See") //微博关注话题签到
sleep(2000)
back()
sleep(500)
back()
sleep(500)
launchApp("See")
waitForActivity("com.caij.see.ui.activity.home.MainContainActivity")
sleep(300)
swipe(10, 1090, 900, 1090, 400)
sleep(1000)
click("关注的话题")
sleep(1000)
for (let i = 0; i < 3; i++) {
    click("签到")
    sleep(900)
    swipe(550, 2000, 550, 474, 400)
    sleep(200)
}
//京东一键签到
app.startActivity({
    action: "VIEW",
    packageName: "com.dfg.dftb",
    className: "com.dfg.dftb.Jingdou"
});
waitForActivity("com.dfg.dftb.Jingdou")
sleep(200)
click(330, 2070);
sleep(200)
click(718, 1330);
sleep(400)
click(800, 2070);
sleep(1000)
back();
sleep(800)
click(558, 2170);
sleep(3500)
click(923, 774);
sleep(4500)
back();
sleep(1200)
app.startActivity({
    action: "VIEW",
    packageName: "com.dfg.dftb",
    className: "com.dfg.dftb.Jingdou"
});
waitForActivity("com.dfg.dftb.Jingdou")
click(550, 474);
sleep(1200)
swipe(550, 2000, 550, 474, 500)
sleep(300)
click("京喜农场好友助力"); //京喜农场
sleep(1200)
click(548, 2170);
sleep(1000)
click(757, 2040);
sleep(3000)
click(757, 1800);
sleep(3000)
click(757, 1580);
sleep(3000)
click(757, 1330);
sleep(3000)
click(757, 1100);
sleep(3000)
back();
sleep(1000)
click("京东农场好友助力"); //京东农场
sleep(1200)
click(548, 2170);
sleep(1000)
click(757, 2040);
sleep(3000)
click(757, 1800);
sleep(3000)
click(757, 1580);
sleep(3000)
click(757, 1330);
sleep(3000)
click(757, 1100);
sleep(3000)
click(757, 874);
sleep(3000)
back();
sleep(1000)
click("种豆得豆好友助力"); //种豆
sleep(1200)
click(548, 2170);
sleep(1000)
click(757, 2040);
sleep(1500)
click(757, 2040);
sleep(1500)
click(757, 1800);
sleep(1500)
click(757, 1800);
sleep(1500)
click(757, 1580);
sleep(1500)
click(757, 1580);
sleep(1500)
click(757, 1330);
sleep(1500)
click(757, 1330);
sleep(1500)
back();
sleep(1200)
swipe(550, 474, 550, 2000, 500)
sleep(300)
click("京东签到"); //种豆
sleep(3000)
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