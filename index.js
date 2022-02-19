import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';


const url=`https://vue3-course-api.hexschool.io/v2`;
const path=`sells`;
let myModal=``;
let delModal=``;

createApp({
  data(){
    return{
      temp:{
        title: '', 
        category: '',
        origin_price: 0,
        price: 0,
        unit: '',
        description: '',
        content: '',
        is_enabled: 0,
        imageUrl: ''},
      products:[],
      delItem:[],
      btnStatus:'',
      newGood:{   //用來存放(新增、修改)資料的物件
        data: {
          title: '', 
          category: '',
          origin_price: 0,
          price: 0,
          unit: '',
          description: '',
          content: '',
          is_enabled: 0,
          imageUrl: ''
        }
      },
    }
  },
  methods:{
    token(){   //將cookie取出並放入token，藉由token達到自動登入
    var token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token);
    axios.defaults.headers.common['Authorization'] = token;
    },
    checkLogin(){  
      axios.post(`${url}/api/user/check`)
        .then((res)=>{
          this.getData();
        })
        .catch((err)=>{
          alert(err.data.message);
          window.location="login.html";
        })
    },
    getData(){
      axios.get(`${url}/api/${path}/admin/products`)
      .then((res)=>{
        this.products = res.data.products;
        console.log(this.products);
      })
      .catch((err)=>{
        alert(err.data.message);
      })
    },
    //控制Modal是add(newGood是空的、edit(將item內的資料放進newGood在渲染、del開啟del的Modal)
    openModal(status,item){
      //為了避免在之前有編輯的資料遺留在使用另一個空資料淺拷貝到newGood內。
      if(status == 'add'){
        this.newGood.data = {...this.temp};
        this.btnStatus = 'add'
        myModal.show();
        //將v-for中的item在放進去newGood中
      }else if(status == 'edit'){
        this.newGood.data = {...item};
        this.btnStatus = 'edit'
        myModal.show();
      }else if(status == 'del'){
        this.delItem = {...item};
        delModal.show();
      }
    },
    addNewProduct(){  //新增產品功能，帶入物件資料，資料存放在newGood中
      axios.post(`${url}/api/${path}/admin/product`,this.newGood)
        .then((res)=>{
          alert(`${res.data.message}，新增成功`);
          myModal.hide()
          this.getData();
        })
        .catch(()=>{
          console.log(this.data);
          alert('新增失敗');
        })
    },
    removeProduct(){   //移除功能-點擊刪除的Modal中的確認才觸發，帶入打開Modal後存放進去的delItem中id
      axios.delete(`${url}/api/${path}/admin/product/${this.delItem.id}`)
      .then(() => {
        this.getData();
        delModal.hide();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },
    editProduct(item){
      axios.put(`${url}/api/${path}/admin/product/${item.data.id}`,this.newGood)
        .then((res)=>{
          console.log("成功");
          myModal.hide();
          this.getData();
          alert(res.data.message);
        })
        .catch((err)=>{
          alert(err.data.message);
        })
    },
    //對於Moadl的功能走向新增還是修改
    productBtn(status,item){
      if(status == 'add'){
        this.addNewProduct();
      }else if(status == 'edit'){
        console.log(item);
        this.editProduct(item);
      }
    },
    //按下新增圖片按鈕，上傳圖片在將回傳的網址放入imageUrl中
    upLoadImage(){
      const fileInput=document.querySelector('#upImage');
      // console.dir(fileInput.files[0]);
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file-to-upload",file);
      axios.post(`${url}/api/${path}/admin/upload`,formData)
        .then((res)=>{
          console.log(res);
          alert(res.data.message);
          this.newGood.data.imageUrl = res.data.imageUrl;
        }).catch((err)=>{
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.token();
    this.checkLogin();
    myModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  }
}).mount('#app');


//將上方改寫成以下初始化的方式->頭:creatApp改成const app=，尾:將mount拿掉
// Vue.createApp(app).mount('#app');