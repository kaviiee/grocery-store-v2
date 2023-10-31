const user_cart={
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

<div>
<h1>Cart Total: {{ cartTotal }}</h1>
<p>Add more Products: <a @click="user_products" class="btn btn-primary">Products</a></p>
<p>Checkout of the cart : <a @click="checkout" class="btn btn-primary">Checkout</a></p>

<div class="row">
  <div class="col-md-12">
    <h3>Your Cart:</h3>
    <div v-for="item in cartItems" :key="item.id" class="col-md-3">
      <div class="panel panel-success">
        <div class="panel-heading">{{ item.name }}</div>
        <div class="panel-body" style="height: 220px;">
          <p>Category: {{ item.category }}</p>
          <p>Quantity ordered: {{ item.quantity }}</p>
          <p>Rate per unit: {{ item.rate }}</p>
          <p>Unit: {{ item.unit }}</p>
          <p>Manufacture Date: {{ item.manufacture_date }}</p>
          <p>Expiry Date: {{ item.expiry_date }}</p>
          <p>Total: {{ item.total }}</p>
        </div>
        <div class="panel-footer">
          <a @click='remove_cart_item(item.id)' class="btn btn-primary">Remove product</a>
        </div>
      </div>
    </div>
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
        cartTotal: 0,
        cartItems: [],
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
    },
    async checkout(){
        this.$router.push("/checkout")
    },
    async remove_cart_item(id){
        const res = await fetch(`/cart/${id}`,{
            method:"delete",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const data = await res.json()
        console.log(data)
        location.reload()
    },
    
      calculateCartTotal(cartItems) {
        let cartTotal = 0;
        for (const item of cartItems) {
          cartTotal += item.total;
        }
        return cartTotal;
      }
  },
  async mounted(){
    const id = localStorage.getItem('id')
    const res = await fetch(`/cart/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token')
        },
        
    })
    if(res.ok){
        this.cartItems = await res.json()
        this.cartTotal = this.calculateCartTotal(this.cartItems);
    }
    else {
        console.error("Failed to fetch cart data");
      }
  }
}
export default user_cart