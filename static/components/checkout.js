const checkout={
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
<div class="container page">  
<h3>Transaction Successful</h3>
<h2>Transaction amount: {{cart_total}} </h2>
<a @click="user_home" class="btn btn-primary" >Go to Home</a>
</div>

<footer class="container-fluid text-center">
  <p>Online Store Copyright</p>  
</footer>
</div>
</div>

    `,
data() {
    return{
        cart_total:0,
        
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
        this.$router.push("/user_home")
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
  async mounted(){
    const id = localStorage.getItem('id');
    const res = await fetch(`/check/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token')
        },
        //body: JSON.stringify(this.current_user),
    })
    if(res.ok){
        this.cart_total = await res.json()
    }
    else {
        console.error("Failed to fetch checkout data");
      }
  }
}
export default checkout