const obj = {
    name: "Elena", 
    greet: function() {
        // console.log("Hello, " + this.name);
        console.log(`Hello, ${this.name}`);
    },

    greet2: () => {
        // cannot access this,name
        console.log("Hello, " + this.name);
    }
}



obj.greet2();