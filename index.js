const Joi = require('joi');
const express = require('express');
const app = express();



app.use(express.json()); // to enable reafing json in req body for http post , by default this is disabled in express

var courses = [
    {id : 1, name : 'Course1'},
    {id : 2, name : 'Course2'},
    {id : 3, name : 'Course3'}
];

app.get('/', (req,res) => {
    res.send('Hello World !!......');
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt( req.params.id));
    if(!course) res.status(404).send(`No Course found for id : ${req.params.id}`);
    else res.status(200).send(course);
});

app.get('/api/courses/:year/:month', (req,res) => {
   res.send(req.params);
   console.log(req.query);
});

app.post('/api/courses', (req,res) => {
    /* 
    
    if (!req.body.name || req.body.name.length < 3){
        res.status(400).send("Bad Request...");
        return;
    }
    */
    
    /*
    const schema = {
            name : Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body,schema);
    console.error(result);
    
  
    if(result.error) {
        //res.status(400).send(result.error);
        res.status(400).send(result.error.details[0].message);
        return;
    }
    */

    // Object destructing : getting error object from result object
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    else {
        const course = {
            id : courses.length + 1,
            name : req.body.name
        };

        courses.push(course);
        res.send(course);
    }
 });

 app.put('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt( req.params.id));
    if(!course) return res.status(404).send(`No Course found for id : ${req.params.id}`);     
    else {
        const {error} = validateCourse(req.body);
        if(error) return res.status(400).send(error.details[0].message);            
        else {
            course.name = req.body.name;
            res.status(200).send(course);
        }
    }
});


app.delete('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt( req.params.id));
    if(!course) return res.status(404).send(`No Course found for id : ${req.params.id}`);       
    else {
            const index = courses.indexOf(course);
            courses.splice(index,1);
            res.status(200).send(course);
        }
    }
});




const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}.....`);
});


function validateCourse(course) {
    const schema = {
        name : Joi.string().min(3).required()
    };
    return Joi.validate(course,schema);
}