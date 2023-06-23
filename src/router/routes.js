
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',name:'home', component: () => import('pages/IndexPage.vue') },
      { path:'/login',name:'login',component:() => import('pages/login.vue')},
      { path:'/chat',name:'chat',component:() =>import('pages/chat.vue')},
      { path:'/profile',name:'profile',component:()=>import('pages/profile.vue')},
      { path:'/userDetail',name:'userDetail',component:()=>import('pages/userDetail.vue')},
      { path:'/groupMeets',name:'groupMeets',props:true,component:()=>import('pages/groupMeets.vue')},
      { path:'/groupActivities/:id',name:'groupActivities',props:true,component:()=>import('pages/groupActivities.vue')},
      { path:'/donatePage',name:'donatePage',component:()=>import('pages/donatePage.vue')},
      { path:'/discussions',name:'discussions',component:()=>import('pages/discussions.vue')},
      { path:'/discussion',name:'discussion',component:()=>import('pages/discussion.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
