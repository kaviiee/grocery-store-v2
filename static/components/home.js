const home={
    template:`
  <div class="jumbotron">
            <h1 class="display-4">Welcome to My Grocery Store</h1>
            <img src='static/logo.jpg' alt="My Grocery Store Logo" class="logo mx-auto d-block">
            <p class="lead">Thank you for visiting our store. Start shopping now!</p>
            <hr class="my-4">
            <p>Explore our wide range of products and enjoy a seamless shopping experience.</p>
            <!-- Login and Signup links -->
            <button @click=login class="btn btn-primary btn-lg">Login</button>
            <button @click=signup class="btn btn-success btn-lg">Signup</button>
    </div>
    `,

  methods:{
     login(){
      this.$router.push("/login")
     },
     signup(){
      this.$router.push("/signup")
     }
  },
  async mounted(){
    /*const res= await fetch('/logout',{
        if (res.ok){
            localStorage.clear()
            this.$router.push('/')
        }else{
            console.log('could not log out the user')
        }
      })*/
  }
}
export default home