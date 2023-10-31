const user_contactus={
    template:`
    <div>
    
    <div class="jumbotron">
  <div class="container text-center">
    <h1>Grocery Store</h1>      
  </div>
</div>
<div class="container-fluid">
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <img class="nav navbar-brand" src="/static/logo.jpg" style="height:50px;">
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li class="active"><a @click="user_home">Home</a></li>
        <li><a @click="user_categories">Categories</a></li>
        <li><a @click="user_products">Products</a></li>
        <li><a @click="user_contactus">ContactUs</a></li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
        <li><a @click="user_cart"><span class="glyphicon glyphicon-shopping-cart"></span> Cart</a></li>
        <li><a @click="logout"><span class="glyphicon glyphicon-user"></span> Logout</a></li>
      </ul>
    </div>
  </div>
</nav>
<div class="container">
    <h1>Contact Us</h1>
    <div class="row">
        <div class="col-md-6">
            <h3>Email: <a href="mailto:grocery_store@gmail.com">grocery_store@gmail.com</a></h3>
            <h3>Phone no.: 1234567890</h3>
            <h3>Instagram: <a href="https://www.instagram.com/grocery_store">www.instagram.com/grocery_store</a></h3>
        </div>
        <div class="col-md-6">
            <h3>Looking for jobs/internships?</h3>
            <h3>Write to: <a href="mailto:grocery_store_jobs@gmail.com">grocery_store_jobs@gmail.com</a></h3>
        </div>
    </div>
</div>

<footer class="container-fluid text-center">
  <p>Online Store Copyright</p>  
</footer>
</div>
</div>

    `,
data() {
    return{
        
        };},
  methods:{
    async user_home(){
        this.$router.push("/user_home")
    },
    async user_categories(){
        this.$router.push("/user_categories")
    },
    async user_products(){
        this.$router.push("/user_products")
    },
    async user_contactus(){
        this.$router.push("/user_contactus")
    },
    async user_cart(){
        this.$router.push("/user_cart")
    },
    async logout(){
      const res= await fetch('/logout')
      if (res.ok){
          localStorage.clear()
          this.$router.push('/')
      }else{
          console.log('could not log out the user')
      }
    }
  },

}
export default user_contactus