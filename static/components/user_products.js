const user_products={
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
<div class="row col-md-4">
        <form @submit.prevent="search_products">
          <h3>Search Products</h3>
          <br>
          <label for="field" class="form-label">Search based on:</label><br>
          <select v-model="search.field" class="form-control" name="field" required>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="rate_per_unit">Rate per unit</option>
          </select>
          <br>
          <label for="value" class="form-label">Value:</label>
          <input v-model="search.value" type="text" class="form-control" name="value" id="value" placeholder="Value" required>
          <br>
          <input type="submit" class="btn btn-primary" name="submit" id="submit" value="Search">
          <br>
          </form>
      </div>
<div class="row">
    <div class="col-md-12">
      <h3>Available Products are:</h3>
      <div v-for="(products, category) in productsGrouped" :key="category">
        <h4>{{ category }}</h4>
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-md-3">
            <div class="panel panel-success">
              <div class="panel-heading">{{ product.name }}</div>
              <div class="panel-body" style="height: 220px;">
                <p>Rate per unit: {{ product.rate_per_unit }}</p>
                <p>Unit: {{ product.unit }}</p>
                <p>Available quantity: {{ product.available_quantity }}</p>
                <p>Manufacture Date: {{ product.manufacture_date }}</p>
                <p>Expiry Date: {{ product.expiry_date }}</p>
        <p v-if="product.available_quantity === 0">Out of Stock</p>
        <p v-else>
            Quantity:
        <input
            type="number"
            v-model="product.num"
            :min="1"
            :max="product.available_quantity"
            name="qty">
    </p>
  </div>
              <div class="panel-footer">
                <a @click="add_to_cart(product.id, category)" class="btn btn-primary" name="add_to_cart" value="add_to_cart">Add to Cart</a>
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
        qty:1,
        var:{
            p_id:"",
            user_id:"",
            qty:""
        },
        search: {
          field: '',
          value: ''
        },
        productsGrouped:{},
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
    async user_cart(id){
        
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
    async search_products() {
      const res = await fetch(`/all_products`,{
        method:'put',
        headers:{
          'Content-Type': "application/json",
          'Access-Control-Allow-Origin': '*',
          'Authentication-Token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify(this.search)
      })
      this.productsGrouped = await res.json()
    },
    async add_to_cart(product_id, category){
        this.var.p_id=product_id;
        this.var.user_id=localStorage.getItem("id");
        var prod;
        for(prod in this.productsGrouped[category]){
          if (this.productsGrouped[category][prod].id==product_id){
            var prod_num=this.productsGrouped[category][prod].num;
            console.log(prod_num)
            this.var.qty=prod_num;
            break;
            }
        }
        
        const res = await fetch(`/cart/${product_id}`,{
            method:'POST',
            headers:{
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': '*',
                'Authentication-Token': localStorage.getItem('auth-token')
              },
            body:JSON.stringify(this.var)
        })
        const data = await res.json()
        console.log(data)
        this.$router.push("/user_cart")
    }
  },
  async mounted(){
    const res = await fetch(`/all_products`,{
        method:'put',
        headers:{
          'Content-Type': "application/json",
          'Access-Control-Allow-Origin': '*',
          'Authentication-Token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify(this.search)
      })
      
    if(res.ok){
        this.productsGrouped = await res.json()
    }
    else {
        console.error("Failed to fetch user data");
      }
  }
}
export default user_products