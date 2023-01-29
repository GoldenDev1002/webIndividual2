
let vueApp = document.getElementById("newApp"); // it will run first and get the element with new app which is assigned to vueApp varaible and placed in vue instance
import {lessons} from "./lessons.js"

let app = new Vue({
    el: vueApp,
    data() {
      return { //key is a unique identifier for each of the object  that maps 
        sitename: "Vue.js School Project",
        
       /* lesson: {
          id: 1000,
          subject: "English",
          location: "Hendon",
          price: 2000,
          image: "subjectPic/english.jpg",

          disable: false,
          spaces: 5,
          showContent: true,
          name: "",
          phoneNumber: "",
        },*/


        lessons, //is a state in vue
        cart: [],
        showContent: true,
        nameInput : "",
        numberInput: "",
        message: "",
        search : "",
        sortFeature: "subject",
        sortOption: "ascending",
        ascending : "",
        descending : "",
        cartIcon: "fa fa-cart-shopping"

       
      
      };
    },
filters: {

},
created() {
  fetch("http://localhost:4500/collections/products")
  .then((response)=> {
    response.json();
  })
  .then((lessons)=> {
  this.lessons = lessons;
  })
},
    methods: {
      addToCart(aLesson) {
       /* // reduces number of spaces for lesson given
        aLesson.spaces--;

        // check if lesson passed is already existing in cart
        var existingItemInCart = this.cart.find(item => item.lessonId === aLesson.id);
        if(existingItemInCart == null){
          // lesson does not yet exist in cart, add lesson to cart
          // create and save cartItem object for new lesson to be added to cart
          var cartItem = {lessonId : aLesson.id, spaces: 1, lesson: aLesson};
          this.cart.push(cartItem);
        }else{
          // update number of spaces for existing lesson in cart
          ++existingItemInCart.spaces;
        } */

        fetch("http://localhost:4500/order", {
          method: "POST",
          body: JSON.stringify({
            name: this.nameInput,
            phoneNumber : this.numberInput,
            orders: this.cart
          }),
          headers: { "Content-type": "application/json;charset=UTF-8"}
        })//orders collection
      
      },

    
      showButton() {
        this.showContent = this.showContent ? false : true;
      },

      canAddToCart(aLesson) {
        return aLesson.spaces > this.cartCount(aLesson.id);
      },

      cartCount(lesson){
        let count = 0;
        for(var i = 0; i < this.cart.length; i++){
          if(this.cart[i]=== lesson){
            count++
          }
        }

        return count;
      },



    removeCart(lessonId){
      // find selected lesson in cart
      var itemInCart = this.getCartItemFromCartByLessonId(lessonId);

      if(itemInCart.spaces == 1){
          // if just one item space is left, remove item completely from cart
          var index = this.cart.map(x => x.lessonId).indexOf(lessonId);
          this.cart.splice(index, 1);

          // redirect user back to home if cart is empty
          if(this.cart.length <= 0){
            
            this.showButton();
          }
      }else{
          // reduce number of spaces of item in cart
          --itemInCart.spaces;
      }

      // increase lesson space 
      var lesson = this.getLessonById(lessonId);
      ++lesson.spaces;
  },
  // get lesson by id
  getLessonById(lessonId){
      var lesson = this.lessons.find(u => u.id == lessonId);
      return lesson;
  },
  // get item in cart by id
  getCartItemFromCartByLessonId(lessonId){
      var item = this.cart.find(u => u.lessonId == lessonId);
      return item;
  },

    
names(){
    let telephone = /^\d{11}$/
    
    let strings =  /[a-zA-Z]/g
    let x = document.getElementById("naming");
    let y = document.getElementById("numbering");
    

    
    if(strings.test(x.value) && telephone.test(y.value)){
      x.style.backgroundColor = "green";
      y.style.backgroundColor = "green";
      x.style.color = "white";
      y.style.color = "white";
     
      alert("Form submitted");
      console.log("Correct3")

     
      
    }
    else{
      x.style.backgroundColor = "red";
      y.style.backgroundColor = "red";
      x.style.color = "white";
      y.style.color = "white";
     
    }

   

    

  } 
,
  
      checkBtn(){

       
        
        if(this.nameInput.length != 0 && this.numberInput.length != 0){
          this.message = "Complete"; 
           //  document.getElementById("naming").addEventListener("keyup", names);
          
        
      
       

        this.names()
          
        }
        else{
          this.message = "Fill in all the fields"
        }
        },



        
      
    },

    
    computed: {
      cartItem: function () {
        return this.cart.length; //this data is unsuitabkle because of use rinteraction i.e the user is supposed to input in this scenario
      },


     

      filteredLessons : function(){
        let eachLesson = this.lessons;
        if(this.search != ""){
          eachLesson = eachLesson.filter((lesson) => {

            return lesson.subject.toLowerCase().match(this.search) || lesson.location.toLowerCase().match(this.search)
          })

          
        }


   
  


       

        if (this.sortOption === "ascending") {
          
          switch (this.sortFeature) {
            case "subject":
              return lessons.sort((a, b) => {
                if (a.subject.toLowerCase() < b.subject.toLowerCase()) 
                return -1;
                return 1;
              });
            case "location":
              return lessons.sort((a, b) => {
                if (a.location.toLowerCase() < b.location.toLowerCase())
                  return -1;
                return 1;
              });
            case "price":
              return lessons.sort((a, b) => a.price - b.price);
            case "availability":
              return lessons.sort(
                (a, b) => {
                  if(a.spaces >b.spaces) return -1;
                  return 1
                }
              );
          }
        }else if(this.sortOption === "descending"){
          switch (this.sortFeature) {
            case "subject":
              return lessons.sort((a, b) => {
                if (a.subject.toLowerCase() < b.subject.toLowerCase()) 
                return 1;
                return -1;
              });
            case "location":
              return lessons.sort((a, b) => {
                if (a.location.toLowerCase() < b.location.toLowerCase()) return 1;
                return -1;
              });
            case "price":
              return lessons.sort((a, b) => b.price - a.price);
            case "availability":
              return lessons.sort(
                (a, b) => {
                  if(a.spaces > b.spaces) return 1;
                  return -1
                }
              );
          }
        }




        return eachLesson
   }





        }


       



        


       


    
      
       //returns this.lessons array and uses the filter method , to filter each lesson item and return if the title lesson exists it should be true, if it doesn't exist,it shoulbe be false
       //returns an updated array to be looped over 
      },


      

      
     
     /* canAddToCart: function () {
        return this.lessons.spaces > this.cartItem;
      }, */

    

    )