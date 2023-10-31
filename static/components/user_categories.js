const user_home={
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
<br>
<br>
<h3>Available categories are:</h3>
<br>

<div class="col-md-3" v-for="cat in cats" :key="cat.id"> 
    <div class="panel panel-success">
        <div class="panel-heading">{{cat.name}}</div>
        <div class="panel-body" style="height: 270px;">
            <div v-if="cat.img_url">
            <img :src="'static/' + cat.img_url" style="height: 250px; width: 220px;" class="img-responsive" alt="Image">
            </div>
            <div v-else>
            <p>No image Available</p>
            </div>
        </div>
        <div class="panel-footer">
            <a @click="user_products()" class="btn btn-primary" name="Products" value="products">Products</a>
        </div>
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
        cats:[]
        };},
  methods:{
    async user_home(){
        this.$router.push("/user_home")
    },
    async user_categories(){
        this.$router.push("/user_home")
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
  async mounted(){
    const res = await fetch(`/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token')
        },
        
    })
    if(res.ok){
        this.cats = await res.json()
    }
    else {
        console.error("Failed to fetch category data");
      }
  }
}
export default user_home