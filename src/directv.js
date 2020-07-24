const express =  require("express")

const app = express()

const path = require('path')
app.use(express.static(path.join(__dirname, '../public')));


app.listen(9000, () => {
    console.log("Server is running")
})


function test(comment) {
    console.log("test called....");
}

export{test}