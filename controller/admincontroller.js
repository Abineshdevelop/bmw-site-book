const adminModel = require('../model/adminmodel')
const usermodel = require('../model/usermodel')
const bcrypt = require("bcryptjs")
const Car = require('../model/carmodel')
const { search } = require('../routes/user')

console.log("admin model", adminModel)
const loadLogin = async (req, res) => {
    res.render('admin/login')
}
const loginin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const admin = await adminModel.findOne({ name });

        if (!admin || password !== admin.password) {
            return res.render('admin/login', { message: "Invalid credentials" });
        }

        req.session.admin = {
            isLoggedIn: true,
            name: admin.name //storing name here
        };

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("error", error);
        res.send(error.message);
    }
};



const loadDashboard = async (req, res) => {
    try {
        const users = await usermodel.find({});
        const carsRaw = await Car.find({}).sort({ createdAt: -1 });
        const message = req.query.message;

        const userM = users.map(user => ({
            ...user.toObject(),
            createdAt: user.createdAt ? user.createdAt.toString().split(' ').slice(0, 5).join(' ') : ''
        }));

        const cars = carsRaw.map(c => ({
            ...c.toObject(),
            createdAt: c.createdAt ? c.createdAt.toString().split(' ').slice(0,5).join(' ') : ''
        }));

        res.render('admin/dashboard', {
            users: userM,
            cars,
            message,
            adminName: req.session.admin?.name || 'Admin' // Pass admin name
        });
    } catch (error) {
        res.send(error.message);
    }
};



const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    await usermodel.findByIdAndUpdate(req.params.id, { name, email });
    res.redirect('/admin/dashboard?message=user+updated+successfully');
  } catch (err) {
    res.send(err.message);
  }
};

//delete user
const deleteUser = async (req, res) => {
    try {
        await usermodel.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.send(error.message);
    }
};


const createUser = async(req,res)=>{
    const {name, email, password} = req.body 

    const userExists = await usermodel.findOne({email})
    if(userExists){
        return res.redirect('/admin/dashboard?message=user+already+exists&type=error')
    }
    const hashedPassword = await bcrypt.hash(password, 10 )
    const user = new usermodel({
        name, 
        email, 
        password: hashedPassword
    })
    await user.save()
    res.redirect('/admin/dashboard?message=user+created+successfully')
}



const searchUser = async (req, res) => {

  try {
    console.log("search user")
    const searchQuery = req.query.q;
    const regex = new RegExp(searchQuery, 'i'); //to search user

    const users = await usermodel.find({
      $or: [
        { name: regex },
        { email: regex }
      ]
    });
console.log('hi')
    res.render('admin/dashboard', { users });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send('Server error');
  }
};



//admin signoutertgsuetf

const adminsignout = (req, res) => {
    try{
        delete req.session.admin
        res.redirect('/admin/login')
    }catch(err){
        console.log("Logout error ",err)
    }
};



// Cars: create
const createCar = async (req, res) => {
    try {
        const { name, subtitle, imageUrl, price, description, features, specs } = req.body;
        const car = new Car({
            name,
            subtitle,
            imageUrl,
            price,
            description,
            features: (features ? features.split(',').map(s => s.trim()).filter(Boolean) : []),
            specs: (() => { try { return specs ? JSON.parse(specs) : {}; } catch(e){ return {}; } })()
        });
        await car.save();
        res.redirect('/admin/dashboard?message=car+added+successfully');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard?message=failed+to+add+car&type=error');
    }
};

// Cars: update
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subtitle, imageUrl, price, description, features, specs } = req.body;
        await Car.findByIdAndUpdate(id, {
            name,
            subtitle,
            imageUrl,
            price,
            description,
            features: (features ? features.split(',').map(s => s.trim()).filter(Boolean) : []),
            specs: (() => { try { return specs ? JSON.parse(specs) : {}; } catch(e){ return {}; } })()
        });
        res.redirect('/admin/dashboard?message=car+updated+successfully');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard?message=failed+to+update+car&type=error');
    }
};

// Cars: delete
const deleteCar = async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard?message=car+deleted');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard?message=failed+to+delete+car&type=error');
    }
};

module.exports = { loadLogin, loginin, loadDashboard, updateUser, deleteUser, createUser, searchUser, adminsignout, createCar, updateCar, deleteCar }


