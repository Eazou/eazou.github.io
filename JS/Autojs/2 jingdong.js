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