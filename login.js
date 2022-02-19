import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點 第二版 後面要加v2
const path = 'sells'; // 請加入個人 API Path 自行申請

const app = createApp({
  data(){
    return{
      user : {     
        //將登入信箱以及密碼存入user物件中，在html須用v-model="user.__"取值
        username:"",
        password:""
      },  
    }
  },
  methods:{
    login(){        
        console.log(this.user);  
        //可以用this去取得uesr裡面的內容   ((由於Vue幫我們展開了，所以只要直接寫this.user就好))
        axios.post(`${url}/admin/signin`, this.user)   
          .then((res)=>{
            const { token, expired } = res.data;  //解構取出token、expired
            document.cookie = `hexToken=${ token }; expires=${ new Date(expired)}; path=/`;  //放進cookie
            window.location=`index.html`;  //轉跳畫面
          })
          .catch((err)=>{
            alert(err.data.message);
            
          })
      }
  }
});

app.mount('#app');