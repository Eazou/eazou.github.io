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
Back()
sleep(500)
Back()
sleep(500)
launchApp("See") //微博关注话题签到
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