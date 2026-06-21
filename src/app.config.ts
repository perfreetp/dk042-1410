export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/verify/index',
    'pages/report/index',
    'pages/mine/index',
    'pages/verify-result/index',
    'pages/report-create/index',
    'pages/history/index',
    'pages/report-detail/index',
    'pages/verify-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0052D9',
    navigationBarTitleText: '寿命件核验',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F2F3F5'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#0052D9',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/verify/index',
        text: '核验'
      },
      {
        pagePath: 'pages/report/index',
        text: '上报'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
