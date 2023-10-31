import home from './components/home.js'
import login from './components/login.js'
import signup from './components/signup.js'
import user_home from './components/user_home.js'
import admin_home from './components/admin_home.js'
import admin_categories from './components/admin_categories.js'
import admin_products from './components/admin_products.js'
import user_categories from './components/user_categories.js'
import user_products from './components/user_products.js'
import user_cart from './components/user_cart.js'
import checkout from './components/checkout.js'
import admin_contactus from './components/admin_contactus.js'
import user_contactus from './components/user_contactus.js'

//import fetch from "node-fetch"

const routes=[
    {path:'/',component: home},
    {path:'/login',component: login},
    {path:'/signup',component: signup},
    {path:'/user_home',component: user_home},
    {path:'/admin_home',component: admin_home},
    {path:'/admin_categories', component: admin_categories},
    {path:'/admin_products', component:admin_products},
    {path:'/user_categories', component:user_categories},
    {path:'/user_products', component:user_products},
    {path:'/user_cart', component:user_cart},
    {path:'/checkout', component:checkout},
    {path:'/admin_contactus', component:admin_contactus},
    {path:'/user_contactus', component:user_contactus}

]
/*const routes=[
    {path:'/',component: home},
    {path:'/login',component: login},
    {path:'/signup',component: signup}
]
const routes=[
    {path:'/',component: home},
    {path:'/login',component: login},
    {path:'/signup',component: signup}
]*/
const router= new VueRouter({
    routes,
    base:"/",
})
/*const user_router= new VueRouter({
    routes,
    base:"/user_base",
})

const admin_router= new VueRouter({
    routes,
    base:"/admin_base",
})*/
const app=new Vue({
    el:"#app",
    router,
    methods:{
    //     logout
    /*async logout(){
        const res= await fetch('/logout')
        if (res.ok){
            localStorage.clear()
            this.$router.push('/')
        }else{
            console.log('could not log out the user')
        }
        
    }*/
    }
})