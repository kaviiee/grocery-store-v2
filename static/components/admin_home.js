const admin_home={
    template:`
<div>

<div class="jumbotron">
<div class="container text-center">
  <h1>Grocery Store</h1>      
</div>
</div>

<div class="container page">  


<div>
<nav class="navbar navbar-inverse">
<div class="container-fluid">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>                        
    </button>
    
  </div>
  <div class="collapse navbar-collapse" id="myNavbar">
    <ul class="nav navbar-nav">
      <li class="active"><a @click="admin_home">Home</a></li>
      <li><a @click="admin_categories">Categories</a></li>
      <li><a @click="admin_products">Products</a></li>
      <li><a @click="admin_contactus">ContactUs</a></li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li><a @click="logout"><span class="glyphicon glyphicon-user"></span> Logout</a></li>
    </ul>
  </div>
</div>
</nav>
</div>

<div>
<h1>Welcome, {{current_user.username}}</h1>
<h3>You have {{current_user.role}} privileges</h3>
</div>
<button @click=export_csv(current_user.id) style="background-color: blue; cursor: pointer; border-radius: 5px; color:white; border-color: aquamarine; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Export CSV</button>

<footer class="container-fluid text-center">
<p>Online Store Copyright</p>  
</footer>
</div>
    `,
    data(){
        return{
            current_user:{
                username:"",
                role:""
                
            }
        }
    },
    methods:{
      async export_csv(id){
        const res=await fetch(`/export/${id}`, {
         method:"GET",
         headers: 
           {'Content-Type': 'application/json',
           // 'Authentication-Token': localStorage.getItem('auth-token'),
           
         },
         // body: JSON.stringify(this.formData),
       })
       const data=await res.json()
       if (res.ok){ 
           alert("Report has been sent to your mail")
       }
      },
        async admin_home(){
            this.$router.push(`/admin_home`)
        },
        async admin_categories(){
            this.$router.push(`/admin_categories`)
        },
        async admin_products(){
            this.$router.push(`/admin_products`)
        },
        async admin_contactus(){
            this.$router.push(`/admin_contactus`)
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
    const res = await fetch(`/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token')
        },
        //body: JSON.stringify(this.current_user),
    })
    if(res.ok){
        this.current_user = await res.json()
    }
    else {
        console.error("Failed to fetch user data");
      }
  }

}
export default admin_home